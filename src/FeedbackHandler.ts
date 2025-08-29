import { BaseCallbackHandler } from "langchain/callbacks";
import { PromptFeedbackEvaluator } from "./PromptFeedbackEvaluator";
import { FeedbackEvent, FeedbackResult } from "./interfaces";
import { Subject } from "rxjs";

/**
 * Callback handler for processing prompt input in real-time
 */
export class FeedbackHandler extends BaseCallbackHandler {
  private evaluator: PromptFeedbackEvaluator;
  private feedbackSubject = new Subject<FeedbackEvent>();
  private currentPrompt = '';
  private isProcessing = false;

  /**
   * Create a new FeedbackHandler
   * @param evaluator The prompt feedback evaluator to use
   */
  constructor(evaluator: PromptFeedbackEvaluator) {
    super();
    this.evaluator = evaluator;

    // Subscribe to evaluator feedback events
    this.evaluator.getFeedbackStream().subscribe((event) => {
      this.feedbackSubject.next(event);
    });
  }

  /**
   * Get the name of the handler
   */
  get name(): string {
    return "prompt-feedback-handler";
  }

  /**
   * Called when an LLM starts generating
   * @param llmInput The input to the LLM
   */
  async handleLLMStart(llmInput: string): Promise<void> {
    this.currentPrompt = llmInput;
    this.isProcessing = true;
    this.evaluator.processInput(llmInput);
  }

  /**
   * Called when a new token is generated
   * @param token The generated token
   */
  async handleLLMNewToken(token: string): Promise<void> {
    // Not used for prompt feedback, but could be used for response analysis
  }

  /**
   * Called when LLM generation ends
   */
  async handleLLMEnd(): Promise<void> {
    this.isProcessing = false;
  }

  /**
   * Called when a chain starts
   * @param inputs The inputs to the chain
   */
  async handleChainStart(inputs: Record<string, any>): Promise<void> {
    // Extract prompt from chain inputs
    const promptText = this.extractPromptFromInputs(inputs);
    if (promptText) {
      this.currentPrompt = promptText;
      this.evaluator.processInput(promptText);
    }
  }

  /**
   * Process input text directly
   * @param text The text to process
   */
  public processInput(text: string): void {
    this.currentPrompt = text;
    this.evaluator.processInput(text);
  }

  /**
   * Get the feedback stream
   * @returns Observable of feedback events
   */
  public getFeedbackStream() {
    return this.feedbackSubject.asObservable();
  }

  /**
   * Get the latest feedback synchronously
   * @returns Promise that resolves to the latest feedback
   */
  public async getLatestFeedback(): Promise<FeedbackResult | null> {
    return new Promise((resolve) => {
      const subscription = this.feedbackSubject.subscribe((event) => {
        if (event.type === 'complete') {
          subscription.unsubscribe();
          resolve(event.feedback as FeedbackResult);
        }
      });

      // Set a timeout to prevent hanging
      setTimeout(() => {
        subscription.unsubscribe();
        resolve(null);
      }, 5000);
    });
  }

  /**
   * Extract prompt text from chain inputs
   * @param inputs Chain inputs
   * @returns Extracted prompt text or null
   */
  private extractPromptFromInputs(inputs: Record<string, any>): string | null {
    // Try to find prompt in common input patterns
    if (typeof inputs.prompt === 'string') {
      return inputs.prompt;
    }
    
    if (typeof inputs.input === 'string') {
      return inputs.input;
    }
    
    if (inputs.messages && Array.isArray(inputs.messages)) {
      // Extract the last human message
      for (let i = inputs.messages.length - 1; i >= 0; i--) {
        const message = inputs.messages[i];
        if (message.type === 'human' || message.role === 'user') {
          return message.content;
        }
      }
    }
    
    // If we can't find a prompt, return null
    return null;
  }
}