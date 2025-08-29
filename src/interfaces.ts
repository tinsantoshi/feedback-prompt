/**
 * Result of prompt feedback evaluation
 */
export interface FeedbackResult {
  /** Overall quality score (0-100) */
  score: number;
  /** What's good about the prompt */
  strengths: string[];
  /** Areas for improvement */
  weaknesses: string[];
  /** Specific improvement suggestions */
  suggestions: string[];
  /** Optional improved version of the prompt */
  improvedPrompt?: string;
}

/**
 * Criteria for evaluating prompts
 */
export interface FeedbackCriteria {
  /** Is the prompt clear and specific? */
  clarity: boolean;
  /** Does it provide necessary context? */
  context: boolean;
  /** Does it specify constraints? */
  constraints: boolean;
  /** Does it include examples if needed? */
  examples: boolean;
  /** Does it specify desired output format? */
  format: boolean;
  /** Custom evaluation criteria */
  customCriteria?: Array<{
    name: string;
    evaluator: (prompt: string) => boolean | number;
  }>;
}

/**
 * Configuration options for the prompt feedback component
 */
export interface PromptFeedbackConfig {
  /** Criteria to evaluate */
  criteria: FeedbackCriteria;
  /** Debounce time in milliseconds for evaluation */
  debounceTime?: number;
  /** Whether to use an LLM for advanced feedback */
  useLLM?: boolean;
  /** Model to use for LLM-based feedback */
  llmModel?: string;
  /** Maximum prompt length to evaluate */
  maxPromptLength?: number;
}

/**
 * Event emitted during prompt feedback
 */
export interface FeedbackEvent {
  /** Type of feedback event */
  type: 'initial' | 'heuristic' | 'llm' | 'complete';
  /** Feedback result */
  feedback: Partial<FeedbackResult>;
  /** Original prompt text */
  prompt: string;
  /** Timestamp of the event */
  timestamp: number;
}