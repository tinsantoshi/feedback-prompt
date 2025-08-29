import { FeedbackCriteria, FeedbackEvent, FeedbackResult, PromptFeedbackConfig } from './interfaces';
import { Observable, Subject, debounceTime, filter } from 'rxjs';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

/**
 * Core class for evaluating prompts and providing real-time feedback
 */
export class PromptFeedbackEvaluator {
  private config: PromptFeedbackConfig;
  private llm: ChatOpenAI | null = null;
  private feedbackSubject = new Subject<FeedbackEvent>();
  private inputSubject = new Subject<string>();
  private currentPrompt = '';

  /**
   * Create a new PromptFeedbackEvaluator
   * @param config Configuration options
   */
  constructor(config: PromptFeedbackConfig) {
    this.config = {
      debounceTime: 300,
      useLLM: true,
      llmModel: 'gpt-3.5-turbo',
      maxPromptLength: 2000,
      ...config,
    };

    // Initialize LLM if enabled
    if (this.config.useLLM) {
      this.llm = new ChatOpenAI({
        modelName: this.config.llmModel,
        temperature: 0.1,
      });
    }

    // Set up input processing pipeline
    this.inputSubject
      .pipe(
        filter((prompt) => prompt.length > 0),
        debounceTime(this.config.debounceTime || 300)
      )
      .subscribe((prompt) => {
        this.currentPrompt = prompt;
        this.evaluatePrompt(prompt);
      });
  }

  /**
   * Get the observable stream of feedback events
   */
  public getFeedbackStream(): Observable<FeedbackEvent> {
    return this.feedbackSubject.asObservable();
  }

  /**
   * Process new input text
   * @param text The prompt text to evaluate
   */
  public processInput(text: string): void {
    if (text.length > (this.config.maxPromptLength || 2000)) {
      text = text.substring(0, this.config.maxPromptLength || 2000);
    }
    this.inputSubject.next(text);
  }

  /**
   * Evaluate a prompt and emit feedback events
   * @param prompt The prompt to evaluate
   */
  private async evaluatePrompt(prompt: string): Promise<void> {
    // Emit initial feedback event
    this.emitFeedbackEvent('initial', {
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
    }, prompt);

    // Run heuristic evaluation
    const heuristicFeedback = this.runHeuristicEvaluation(prompt);
    this.emitFeedbackEvent('heuristic', heuristicFeedback, prompt);

    // If LLM is enabled and prompt is substantial, get LLM feedback
    if (this.llm && prompt.length > 20) {
      try {
        const llmFeedback = await this.getLLMFeedback(prompt);
        this.emitFeedbackEvent('llm', llmFeedback, prompt);
        
        // Emit complete event with combined feedback
        const completeFeedback = this.combineFeedback(heuristicFeedback, llmFeedback);
        this.emitFeedbackEvent('complete', completeFeedback, prompt);
      } catch (error) {
        console.error('Error getting LLM feedback:', error);
        // If LLM fails, just use heuristic feedback as final result
        this.emitFeedbackEvent('complete', heuristicFeedback, prompt);
      }
    } else {
      // If no LLM, heuristic feedback is the final result
      this.emitFeedbackEvent('complete', heuristicFeedback, prompt);
    }
  }

  /**
   * Run basic heuristic evaluation on the prompt
   * @param prompt The prompt to evaluate
   * @returns Feedback based on heuristics
   */
  private runHeuristicEvaluation(prompt: string): FeedbackResult {
    const result: FeedbackResult = {
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
    };

    // Check prompt length
    if (prompt.length < 10) {
      result.weaknesses.push('Prompt is too short');
      result.suggestions.push('Add more details to your prompt');
    } else if (prompt.length > 20) {
      result.strengths.push('Prompt has sufficient length');
    }

    // Check for question marks (indicates a clear question)
    if (prompt.includes('?')) {
      result.strengths.push('Prompt contains a clear question');
    } else if (prompt.length > 15 && !prompt.includes('?')) {
      result.suggestions.push('Consider phrasing your request as a question');
    }

    // Check for context
    if (this.config.criteria.context) {
      const contextWords = ['because', 'since', 'as', 'given that', 'context'];
      if (contextWords.some(word => prompt.toLowerCase().includes(word))) {
        result.strengths.push('Prompt provides context');
      } else {
        result.weaknesses.push('Prompt may lack context');
        result.suggestions.push('Add background information or context');
      }
    }

    // Check for specificity
    if (this.config.criteria.clarity) {
      const vagueWords = ['thing', 'stuff', 'etc', 'something', 'anything', 'good', 'nice', 'great'];
      const containsVagueWords = vagueWords.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(prompt);
      });
      
      if (containsVagueWords) {
        result.weaknesses.push('Prompt contains vague language');
        result.suggestions.push('Replace vague terms with specific descriptions');
      } else {
        result.strengths.push('Prompt uses specific language');
      }
    }

    // Check for output format specification
    if (this.config.criteria.format) {
      const formatIndicators = ['format', 'structure', 'style', 'bullet points', 'numbered', 'list', 'table', 'json'];
      if (formatIndicators.some(word => prompt.toLowerCase().includes(word))) {
        result.strengths.push('Prompt specifies desired output format');
      } else {
        result.weaknesses.push('Prompt does not specify output format');
        result.suggestions.push('Specify your preferred output format');
      }
    }

    // Run custom criteria if provided
    if (this.config.criteria.customCriteria) {
      for (const criterion of this.config.criteria.customCriteria) {
        const result = criterion.evaluator(prompt);
        if (typeof result === 'boolean') {
          if (result) {
            result.strengths.push(`Passes custom criterion: ${criterion.name}`);
          } else {
            result.weaknesses.push(`Fails custom criterion: ${criterion.name}`);
          }
        } else if (typeof result === 'number') {
          if (result > 0.7) {
            result.strengths.push(`High score on: ${criterion.name}`);
          } else if (result < 0.3) {
            result.weaknesses.push(`Low score on: ${criterion.name}`);
          }
        }
      }
    }

    // Calculate score based on strengths and weaknesses
    result.score = Math.min(
      100,
      Math.max(
        0,
        50 + (result.strengths.length * 10) - (result.weaknesses.length * 10)
      )
    );

    return result;
  }

  /**
   * Get feedback from an LLM
   * @param prompt The prompt to evaluate
   * @returns LLM-generated feedback
   */
  private async getLLMFeedback(prompt: string): Promise<FeedbackResult> {
    if (!this.llm) {
      throw new Error('LLM is not initialized');
    }

    const systemPrompt = `
You are an expert prompt engineer. Analyze the user's prompt and provide constructive feedback.
Evaluate the prompt on these criteria:
1. Clarity: Is it clear what is being asked?
2. Specificity: Does it provide specific details?
3. Context: Does it include necessary background information?
4. Constraints: Does it specify any constraints or requirements?
5. Output format: Does it specify the desired output format?

Respond with a JSON object in this exact format:
{
  "score": <number between 0-100>,
  "strengths": [<list of strings highlighting what's good about the prompt>],
  "weaknesses": [<list of strings identifying areas for improvement>],
  "suggestions": [<list of specific suggestions to improve the prompt>],
  "improvedPrompt": "<an improved version of the prompt>"
}
`;

    const response = await this.llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Evaluate this prompt: "${prompt}"`)
    ]);

    try {
      // Extract JSON from the response
      const content = response.content;
      const jsonMatch = content.toString().match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const feedbackJson = JSON.parse(jsonMatch[0]);
        return {
          score: feedbackJson.score || 0,
          strengths: feedbackJson.strengths || [],
          weaknesses: feedbackJson.weaknesses || [],
          suggestions: feedbackJson.suggestions || [],
          improvedPrompt: feedbackJson.improvedPrompt
        };
      }
      
      throw new Error('Could not parse LLM response as JSON');
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      // Return a basic result if parsing fails
      return {
        score: 50,
        strengths: ['LLM analyzed your prompt'],
        weaknesses: ['Could not parse detailed LLM feedback'],
        suggestions: ['Try rephrasing your prompt'],
      };
    }
  }

  /**
   * Combine feedback from multiple sources
   * @param heuristicFeedback Feedback from heuristic evaluation
   * @param llmFeedback Feedback from LLM
   * @returns Combined feedback
   */
  private combineFeedback(
    heuristicFeedback: FeedbackResult,
    llmFeedback: FeedbackResult
  ): FeedbackResult {
    // Prefer LLM score but consider heuristic score
    const score = Math.round(llmFeedback.score * 0.8 + heuristicFeedback.score * 0.2);
    
    // Combine and deduplicate strengths, weaknesses, and suggestions
    const strengths = [...new Set([...heuristicFeedback.strengths, ...llmFeedback.strengths])];
    const weaknesses = [...new Set([...heuristicFeedback.weaknesses, ...llmFeedback.weaknesses])];
    const suggestions = [...new Set([...heuristicFeedback.suggestions, ...llmFeedback.suggestions])];
    
    return {
      score,
      strengths,
      weaknesses,
      suggestions,
      improvedPrompt: llmFeedback.improvedPrompt
    };
  }

  /**
   * Emit a feedback event
   * @param type Type of feedback event
   * @param feedback Feedback result
   * @param prompt Original prompt text
   */
  private emitFeedbackEvent(
    type: 'initial' | 'heuristic' | 'llm' | 'complete',
    feedback: Partial<FeedbackResult>,
    prompt: string
  ): void {
    this.feedbackSubject.next({
      type,
      feedback,
      prompt,
      timestamp: Date.now(),
    });
  }
}