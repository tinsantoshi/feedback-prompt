# Getting Started with LangChain Prompt Feedback Component

This guide will help you quickly set up and start using the LangChain Prompt Feedback Component in your project.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Basic knowledge of TypeScript and LangChain

## Installation

Install the package using npm:

```bash
npm install langchain-prompt-feedback
```

Or using yarn:

```bash
yarn add langchain-prompt-feedback
```

## Basic Setup

1. Import the necessary components:

```typescript
import { PromptFeedbackChain, createFeedbackCriteria } from 'langchain-prompt-feedback';
```

2. Create feedback criteria:

```typescript
const criteria = createFeedbackCriteria({
  clarity: true,    // Evaluate if the prompt is clear and specific
  context: true,    // Check if the prompt provides necessary context
  constraints: true, // Verify if constraints are specified
  examples: true,   // Check if examples are included when needed
  format: true      // Evaluate if output format is specified
});
```

3. Create the feedback chain:

```typescript
const feedbackChain = new PromptFeedbackChain({
  criteria,
  useLLM: true,     // Use LLM for advanced evaluation (set to false for faster, heuristic-only evaluation)
  debounceTime: 300 // Wait 300ms after typing stops before evaluating
});
```

4. Process a prompt and get feedback:

```typescript
const result = await feedbackChain.call({ input: "Tell me about artificial intelligence" });
console.log(result.feedback);
```

## Using the Streaming API

For real-time feedback as users type:

```typescript
const subscription = feedbackChain.streamFeedback("What are the best practices for prompt engineering?")
  .subscribe({
    next: (event) => {
      console.log(`Event type: ${event.type}`);
      console.log(`Feedback: ${JSON.stringify(event.feedback)}`);
      
      // Update UI with feedback
      updateFeedbackUI(event.feedback);
      
      if (event.type === 'complete') {
        subscription.unsubscribe();
      }
    },
    error: (err) => console.error('Error in feedback stream:', err)
  });
```

## Framework Integration

### React

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { PromptFeedbackChain } from 'langchain-prompt-feedback';

function PromptEditor() {
  const [prompt, setPrompt] = useState('');
  const [feedback, setFeedback] = useState(null);
  const feedbackChain = useRef(null);
  
  useEffect(() => {
    // Initialize the feedback chain
    feedbackChain.current = new PromptFeedbackChain({
      criteria: {
        clarity: true,
        context: true,
        constraints: true,
        examples: true,
        format: true
      },
      useLLM: true,
      debounceTime: 500
    });
    
    // Clean up on unmount
    return () => {
      // Any cleanup code
    };
  }, []);
  
  const handlePromptChange = (e) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    
    if (newPrompt.length > 5 && feedbackChain.current) {
      // Process the input and get feedback
      feedbackChain.current.call({ input: newPrompt })
        .then(result => {
          setFeedback(result.feedback);
        })
        .catch(err => {
          console.error('Error getting feedback:', err);
        });
    }
  };
  
  return (
    <div className="prompt-editor">
      <h2>Prompt Editor</h2>
      <textarea
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Type your prompt here..."
        rows={5}
        className="prompt-textarea"
      />
      
      {feedback && (
        <div className="feedback-container">
          <h3>Prompt Quality: {feedback.score}/100</h3>
          
          {feedback.strengths.length > 0 && (
            <div className="strengths">
              <h4>Strengths:</h4>
              <ul>
                {feedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.suggestions.length > 0 && (
            <div className="suggestions">
              <h4>Suggestions:</h4>
              <ul>
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.improvedPrompt && (
            <div className="improved-prompt">
              <h4>Improved Version:</h4>
              <p>{feedback.improvedPrompt}</p>
              <button onClick={() => setPrompt(feedback.improvedPrompt)}>
                Use This Version
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PromptEditor;
```

### Vue.js

```vue
<template>
  <div class="prompt-editor">
    <h2>Prompt Editor</h2>
    <textarea
      v-model="prompt"
      @input="handlePromptChange"
      placeholder="Type your prompt here..."
      rows="5"
      class="prompt-textarea"
    ></textarea>
    
    <div v-if="feedback" class="feedback-container">
      <h3>Prompt Quality: {{ feedback.score }}/100</h3>
      
      <div v-if="feedback.strengths.length > 0" class="strengths">
        <h4>Strengths:</h4>
        <ul>
          <li v-for="(strength, index) in feedback.strengths" :key="index">
            {{ strength }}
          </li>
        </ul>
      </div>
      
      <div v-if="feedback.suggestions.length > 0" class="suggestions">
        <h4>Suggestions:</h4>
        <ul>
          <li v-for="(suggestion, index) in feedback.suggestions" :key="index">
            {{ suggestion }}
          </li>
        </ul>
      </div>
      
      <div v-if="feedback.improvedPrompt" class="improved-prompt">
        <h4>Improved Version:</h4>
        <p>{{ feedback.improvedPrompt }}</p>
        <button @click="useImprovedPrompt">Use This Version</button>
      </div>
    </div>
  </div>
</template>

<script>
import { PromptFeedbackChain } from 'langchain-prompt-feedback';

export default {
  data() {
    return {
      prompt: '',
      feedback: null,
      feedbackChain: null
    };
  },
  mounted() {
    // Initialize the feedback chain
    this.feedbackChain = new PromptFeedbackChain({
      criteria: {
        clarity: true,
        context: true,
        constraints: true,
        examples: true,
        format: true
      },
      useLLM: true,
      debounceTime: 500
    });
  },
  methods: {
    handlePromptChange() {
      if (this.prompt.length > 5 && this.feedbackChain) {
        // Process the input and get feedback
        this.feedbackChain.call({ input: this.prompt })
          .then(result => {
            this.feedback = result.feedback;
          })
          .catch(err => {
            console.error('Error getting feedback:', err);
          });
      }
    },
    useImprovedPrompt() {
      if (this.feedback && this.feedback.improvedPrompt) {
        this.prompt = this.feedback.improvedPrompt;
      }
    }
  }
};
</script>
```

## Next Steps

- Check out the [API Reference](API.md) for detailed information on all available options
- Explore the [examples](examples/) directory for more usage examples
- Read the [architecture documentation](docs/architecture.md) to understand how the component works
- Join our community and contribute to the project

For any issues or questions, please open an issue on GitHub.