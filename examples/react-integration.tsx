// This is a conceptual example of how to integrate the PromptFeedbackChain
// with a React application. This is not a complete React component but
// demonstrates the integration pattern.

import React, { useState, useEffect } from 'react';
import { PromptFeedbackChain } from '../src/PromptFeedbackChain';
import { createFeedbackCriteria } from '../src/utils';
import { FeedbackResult } from '../src/interfaces';

// Example React component for a prompt input with real-time feedback
const PromptInputWithFeedback: React.FC = () => {
  // State for the prompt input
  const [prompt, setPrompt] = useState('');
  
  // State for feedback
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference to the feedback chain
  const feedbackChainRef = React.useRef<PromptFeedbackChain | null>(null);
  
  // Initialize the feedback chain
  useEffect(() => {
    // Create feedback criteria
    const criteria = createFeedbackCriteria({
      clarity: true,
      context: true,
      constraints: true,
      examples: true,
      format: true
    });

    // Create the feedback chain
    feedbackChainRef.current = new PromptFeedbackChain({
      criteria,
      useLLM: true,
      debounceTime: 500 // Adjust based on your needs
    });
    
    // Clean up subscription on unmount
    return () => {
      // Any cleanup if needed
    };
  }, []);
  
  // Handle prompt changes
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    
    // Only process if we have a substantial prompt
    if (newPrompt.length > 5 && feedbackChainRef.current) {
      setIsLoading(true);
      
      // Get the feedback handler
      const handler = feedbackChainRef.current.getFeedbackHandler();
      
      // Process the input
      handler.processInput(newPrompt);
    }
  };
  
  // Subscribe to feedback events
  useEffect(() => {
    if (!feedbackChainRef.current) return;
    
    const handler = feedbackChainRef.current.getFeedbackHandler();
    const subscription = handler.getFeedbackStream().subscribe(event => {
      if (event.type === 'heuristic' || event.type === 'complete') {
        setFeedback(event.feedback as FeedbackResult);
        
        if (event.type === 'complete') {
          setIsLoading(false);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [feedbackChainRef.current]);
  
  // Render the component
  return (
    <div className="prompt-input-container">
      <h2>Enter your prompt</h2>
      
      <textarea
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Type your prompt here..."
        rows={5}
        className="prompt-textarea"
      />
      
      {isLoading && <div className="loading-indicator">Analyzing prompt...</div>}
      
      {feedback && (
        <div className="feedback-container">
          <h3>Prompt Feedback</h3>
          
          <div className="score-container">
            <div 
              className="score-indicator" 
              style={{ 
                backgroundColor: getScoreColor(feedback.score),
                width: `${feedback.score}%`
              }}
            />
            <span className="score-text">{feedback.score}/100</span>
          </div>
          
          {feedback.strengths.length > 0 && (
            <div className="strengths">
              <h4>Strengths</h4>
              <ul>
                {feedback.strengths.map((strength, index) => (
                  <li key={`strength-${index}`}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.weaknesses.length > 0 && (
            <div className="weaknesses">
              <h4>Areas for Improvement</h4>
              <ul>
                {feedback.weaknesses.map((weakness, index) => (
                  <li key={`weakness-${index}`}>{weakness}</li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.suggestions.length > 0 && (
            <div className="suggestions">
              <h4>Suggestions</h4>
              <ul>
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={`suggestion-${index}`}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.improvedPrompt && (
            <div className="improved-prompt">
              <h4>Improved Prompt</h4>
              <p>{feedback.improvedPrompt}</p>
              <button 
                onClick={() => setPrompt(feedback.improvedPrompt || '')}
                className="use-suggestion-button"
              >
                Use This Prompt
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on score
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#4CAF50'; // Green
  if (score >= 60) return '#FFC107'; // Yellow
  if (score >= 40) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

export default PromptInputWithFeedback;