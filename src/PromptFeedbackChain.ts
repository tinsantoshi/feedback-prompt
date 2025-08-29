import { BaseChain } from "langchain/chains";
import { ChainValues } from "langchain/schema";
import { CallbackManagerForChainRun } from "langchain/callbacks";
import { PromptFeedbackEvaluator } from "./PromptFeedbackEvaluator";
import { FeedbackCriteria, FeedbackResult, PromptFeedbackConfig } from "./interfaces";
import { FeedbackHandler } from "./FeedbackHandler";
import { Observable } from "rxjs";

/**
 * Chain for providing real-time feedback on prompts
 */
export class PromptFeedbackChain extends BaseChain {
  private evaluator: PromptFeedbackEvaluator;
  private handler: FeedbackHandler;
  private inputKey: string;
  private outputKey: string;

  /**
   * Create a new PromptFeedbackChain
   * @param config Configuration options
   */
  constructor({
    criteria = defaultCriteria(),
    inputKey = "input",
    outputKey = "feedback",
    ...config
  }: {
    criteria?: FeedbackCriteria;
    inputKey?: string;
    outputKey?: string;
  } & Partial<PromptFeedbackConfig>) {
    super();
    
    // Create evaluator and handler
    this.evaluator = new PromptFeedbackEvaluator({
      criteria,
      ...config
    });
    
    this.handler = new FeedbackHandler(this.evaluator);
    this.inputKey = inputKey;
    this.outputKey = outputKey;
  }

  /**
   * Get the input keys for the chain
   */
  get inputKeys(): string[] {
    return [this.inputKey];
  }

  /**
   * Get the output keys for the chain
   */
  get outputKeys(): string[] {
    return [this.outputKey];
  }

  /**
   * Get the chain type
   */
  _chainType(): string {
    return "prompt_feedback_chain";
  }

  /**
   * Process a prompt and generate feedback
   * @param values Input values
   * @param runManager Callback manager
   * @returns Feedback result
   */
  async _call(
    values: ChainValues,
    runManager?: CallbackManagerForChainRun
  ): Promise<ChainValues> {
    const prompt = values[this.inputKey];
    
    if (typeof prompt !== "string") {
      throw new Error(`Expected string for ${this.inputKey}, got ${typeof prompt}`);
    }
    
    // Process the prompt
    this.handler.processInput(prompt);
    
    // Wait for feedback
    const feedback = await this.handler.getLatestFeedback();
    
    // Return the feedback
    return {
      [this.outputKey]: feedback
    };
  }

  /**
   * Stream feedback events
   * @param input Input prompt
   * @returns Observable of feedback events
   */
  streamFeedback(input: string): Observable<any> {
    this.handler.processInput(input);
    return this.handler.getFeedbackStream();
  }

  /**
   * Get the feedback handler
   * @returns The feedback handler
   */
  getFeedbackHandler(): FeedbackHandler {
    return this.handler;
  }
}

/**
 * Create default feedback criteria
 * @returns Default criteria configuration
 */
function defaultCriteria(): FeedbackCriteria {
  return {
    clarity: true,
    context: true,
    constraints: true,
    examples: true,
    format: true
  };
}