# LangChain Real-Time Prompt Feedback Component

A component for LangChain that provides real-time feedback on prompts as users type them. This helps users craft more effective prompts for LLMs by providing immediate guidance and suggestions.

![GitHub](https://img.shields.io/github/license/yourusername/langchain-prompt-feedback)
![npm](https://img.shields.io/npm/v/langchain-prompt-feedback)
![GitHub stars](https://img.shields.io/github/stars/yourusername/langchain-prompt-feedback?style=social)

## Features

- ✅ Real-time feedback on prompt quality as users type
- ✅ Evaluation based on configurable criteria
- ✅ Suggestions for prompt improvements
- ✅ Support for both heuristic and LLM-based evaluation
- ✅ Streaming API for responsive UI integration
- ✅ Compatible with both string prompts and chat prompts
- ✅ Customizable feedback criteria

## Installation

```bash
npm install langchain-prompt-feedback
```

## Quick Start

```typescript
import { PromptFeedbackChain } from 'langchain-prompt-feedback';
import { createFeedbackCriteria } from 'langchain-prompt-feedback';

// Create feedback criteria
const criteria = createFeedbackCriteria({
  clarity: true,
  context: true,
  constraints: true,
  examples: true,
  format: true
});

// Create the feedback chain
const feedbackChain = new PromptFeedbackChain({
  criteria,
  useLLM: true, // Set to false to use only heuristic evaluation
  debounceTime: 300
});

// Process a prompt and get feedback
const result = await feedbackChain.call({ input: "Tell me about AI" });
console.log(result.feedback);
```

## Using the Streaming API

```typescript
// Subscribe to feedback events
const subscription = feedbackChain.streamFeedback("What are the best practices for prompt engineering?")
  .subscribe(event => {
    console.log(`Event type: ${event.type}`);
    console.log(`Feedback: ${JSON.stringify(event.feedback)}`);
    
    if (event.type === 'complete') {
      subscription.unsubscribe();
    }
  });
```

## React Integration

```tsx
import React, { useState, useEffect } from 'react';
import { PromptFeedbackChain } from 'langchain-prompt-feedback';

const PromptInput = () => {
  const [prompt, setPrompt] = useState('');
  const [feedback, setFeedback] = useState(null);
  const feedbackChainRef = React.useRef(null);
  
  // Initialize the feedback chain
  useEffect(() => {
    feedbackChainRef.current = new PromptFeedbackChain({
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
    
    // Subscribe to feedback events
    const subscription = feedbackChainRef.current.getFeedbackHandler()
      .getFeedbackStream()
      .subscribe(event => {
        if (event.type === 'complete') {
          setFeedback(event.feedback);
        }
      });
      
    return () => subscription.unsubscribe();
  }, []);
  
  const handlePromptChange = (e) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    
    if (newPrompt.length > 5 && feedbackChainRef.current) {
      feedbackChainRef.current.getFeedbackHandler().processInput(newPrompt);
    }
  };
  
  return (
    <div>
      <textarea 
        value={prompt} 
        onChange={handlePromptChange} 
        placeholder="Type your prompt here..."
      />
      
      {feedback && (
        <div>
          <h3>Prompt Score: {feedback.score}/100</h3>
          
          {feedback.strengths.length > 0 && (
            <div>
              <h4>Strengths:</h4>
              <ul>
                {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          
          {feedback.suggestions.length > 0 && (
            <div>
              <h4>Suggestions:</h4>
              <ul>
                {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

## Documentation

- [API Reference](API.md)
- [Architecture](docs/architecture.md)
- [Requirements](docs/requirements.md)
- [Feedback Workflow](docs/feedback_workflow.md)
- [Deployment Guide](deployment-guide-html.zip)

## Examples

- [Basic Usage](examples/basic-usage.ts)
- [React Integration](examples/react-integration.tsx)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- LangChain team for creating the amazing framework
- All contributors who have helped with code, documentation, and testing