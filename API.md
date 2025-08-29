# LangChain Real-Time Prompt Feedback API Reference

This document provides detailed information about the API for the LangChain Real-Time Prompt Feedback component.

## Table of Contents

1. [Core Classes](#core-classes)
   - [PromptFeedbackEvaluator](#promptfeedbackevaluator)
   - [FeedbackHandler](#feedbackhandler)
   - [PromptFeedbackChain](#promptfeedbackchain)
2. [Interfaces](#interfaces)
   - [FeedbackResult](#feedbackresult)
   - [FeedbackCriteria](#feedbackcriteria)
   - [PromptFeedbackConfig](#promptfeedbackconfig)
   - [FeedbackEvent](#feedbackevent)
3. [Utility Functions](#utility-functions)
   - [createDefaultFeedbackCriteria](#createdefaultfeedbackcriteria)
   - [createFeedbackCriteria](#createfeedbackcriteria)
   - [calculateBasicPromptScore](#calculatebasicpromptscore)
   - [extractKeyTopics](#extractkeytopics)
   - [suggestBasicImprovements](#suggestbasicimprovements)

## Core Classes

### PromptFeedbackEvaluator

The core class for evaluating prompts and providing real-time feedback.

#### Constructor

```typescript
constructor(config: PromptFeedbackConfig)
```

Creates a new PromptFeedbackEvaluator with the specified configuration.

#### Methods

##### getFeedbackStream

```typescript
getFeedbackStream(): Observable<FeedbackEvent>
```

Returns an Observable that emits feedback events.

##### processInput

```typescript
processInput(text: string): void
```

Processes new input text and triggers the evaluation pipeline.

### FeedbackHandler

A callback handler for processing prompt input in real-time.

#### Constructor

```typescript
constructor(evaluator: PromptFeedbackEvaluator)
```

Creates a new FeedbackHandler with the specified evaluator.

#### Methods

##### processInput

```typescript
processInput(text: string): void
```

Processes input text directly.

##### getFeedbackStream

```typescript
getFeedbackStream(): Observable<FeedbackEvent>
```

Returns an Observable that emits feedback events.

##### getLatestFeedback

```typescript
getLatestFeedback(): Promise<FeedbackResult | null>
```

Returns a Promise that resolves to the latest feedback.

### PromptFeedbackChain

A chain for providing real-time feedback on prompts.

#### Constructor

```typescript
constructor({
  criteria = defaultCriteria(),
  inputKey = "input",
  outputKey = "feedback",
  ...config
}: {
  criteria?: FeedbackCriteria;
  inputKey?: string;
  outputKey?: string;
} & Partial<PromptFeedbackConfig>)
```

Creates a new PromptFeedbackChain with the specified configuration.

#### Methods

##### _call

```typescript
_call(
  values: ChainValues,
  runManager?: CallbackManagerForChainRun
): Promise<ChainValues>
```

Processes a prompt and generates feedback.

##### streamFeedback

```typescript
streamFeedback(input: string): Observable<any>
```

Streams feedback events for the given input.

##### getFeedbackHandler

```typescript
getFeedbackHandler(): FeedbackHandler
```

Returns the feedback handler.

## Interfaces

### FeedbackResult

Result of prompt feedback evaluation.

```typescript
interface FeedbackResult {
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
```

### FeedbackCriteria

Criteria for evaluating prompts.

```typescript
interface FeedbackCriteria {
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
```

### PromptFeedbackConfig

Configuration options for the prompt feedback component.

```typescript
interface PromptFeedbackConfig {
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
```

### FeedbackEvent

Event emitted during prompt feedback.

```typescript
interface FeedbackEvent {
  /** Type of feedback event */
  type: 'initial' | 'heuristic' | 'llm' | 'complete';
  /** Feedback result */
  feedback: Partial<FeedbackResult>;
  /** Original prompt text */
  prompt: string;
  /** Timestamp of the event */
  timestamp: number;
}
```

## Utility Functions

### createDefaultFeedbackCriteria

```typescript
function createDefaultFeedbackCriteria(): FeedbackCriteria
```

Creates default feedback criteria.

**Returns:** Default feedback criteria configuration.

### createFeedbackCriteria

```typescript
function createFeedbackCriteria(options: Partial<FeedbackCriteria>): FeedbackCriteria
```

Creates custom feedback criteria.

**Parameters:**
- `options`: Options to override default criteria.

**Returns:** Custom feedback criteria.

### calculateBasicPromptScore

```typescript
function calculateBasicPromptScore(prompt: string): number
```

Calculates a prompt quality score based on basic heuristics.

**Parameters:**
- `prompt`: The prompt to evaluate.

**Returns:** Score between 0-100.

### extractKeyTopics

```typescript
function extractKeyTopics(prompt: string): string[]
```

Extracts key topics from a prompt.

**Parameters:**
- `prompt`: The prompt to analyze.

**Returns:** Array of key topics.

### suggestBasicImprovements

```typescript
function suggestBasicImprovements(prompt: string): string[]
```

Suggests improvements for a prompt based on basic heuristics.

**Parameters:**
- `prompt`: The prompt to analyze.

**Returns:** Array of improvement suggestions.