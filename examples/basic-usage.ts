import { PromptFeedbackChain } from '../src/PromptFeedbackChain';
import { createFeedbackCriteria } from '../src/utils';

// Example of using the PromptFeedbackChain
async function main() {
  // Create feedback criteria
  const criteria = createFeedbackCriteria({
    clarity: true,
    context: true,
    constraints: true,
    examples: false,
    format: true
  });

  // Create the feedback chain
  const feedbackChain = new PromptFeedbackChain({
    criteria,
    useLLM: true, // Set to false to use only heuristic evaluation
    debounceTime: 300
  });

  // Example prompts to evaluate
  const prompts = [
    "Tell me about AI",
    "Can you explain how neural networks work in detail? Include examples and diagrams if possible.",
    "What's the weather like?",
    "I need a comprehensive analysis of the impact of climate change on global agriculture, focusing on crop yields in the last decade. Please format the response as a structured report with sections for different regions."
  ];

  // Process each prompt and display feedback
  for (const prompt of prompts) {
    console.log(`\n\nEvaluating prompt: "${prompt}"`);
    
    // Option 1: Using the chain directly
    const result = await feedbackChain.call({ input: prompt });
    const feedback = result.feedback;
    
    console.log(`Score: ${feedback.score}/100`);
    console.log('Strengths:');
    feedback.strengths.forEach(s => console.log(`- ${s}`));
    
    console.log('Weaknesses:');
    feedback.weaknesses.forEach(w => console.log(`- ${w}`));
    
    console.log('Suggestions:');
    feedback.suggestions.forEach(s => console.log(`- ${s}`));
    
    if (feedback.improvedPrompt) {
      console.log(`\nImproved prompt: "${feedback.improvedPrompt}"`);
    }
  }

  // Option 2: Using the streaming API
  console.log("\n\nStreaming feedback example:");
  const streamingPrompt = "What are the best practices for prompt engineering?";
  
  console.log(`Evaluating prompt: "${streamingPrompt}"`);
  
  // Subscribe to feedback events
  const subscription = feedbackChain.streamFeedback(streamingPrompt).subscribe(event => {
    console.log(`\nEvent type: ${event.type}`);
    
    if (event.feedback.score !== undefined) {
      console.log(`Score: ${event.feedback.score}/100`);
    }
    
    if (event.feedback.strengths && event.feedback.strengths.length > 0) {
      console.log('Strengths:');
      event.feedback.strengths.forEach(s => console.log(`- ${s}`));
    }
    
    if (event.feedback.weaknesses && event.feedback.weaknesses.length > 0) {
      console.log('Weaknesses:');
      event.feedback.weaknesses.forEach(w => console.log(`- ${w}`));
    }
    
    if (event.feedback.suggestions && event.feedback.suggestions.length > 0) {
      console.log('Suggestions:');
      event.feedback.suggestions.forEach(s => console.log(`- ${s}`));
    }
    
    if (event.type === 'complete') {
      subscription.unsubscribe();
    }
  });

  // Wait for streaming to complete
  await new Promise(resolve => setTimeout(resolve, 5000));
}

// Run the example
main().catch(console.error);