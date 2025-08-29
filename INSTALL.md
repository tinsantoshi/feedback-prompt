# Installation Guide

This guide provides detailed instructions for installing and setting up the LangChain Prompt Feedback Component.

## Prerequisites

Before installing, ensure you have the following:

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)
- A LangChain project or a new project where you want to use this component

## Installation Methods

### Method 1: Install from NPM (Recommended)

The simplest way to install the component is directly from NPM:

```bash
# Using npm
npm install langchain-prompt-feedback

# Using yarn
yarn add langchain-prompt-feedback
```

### Method 2: Install from GitHub

You can also install directly from the GitHub repository:

```bash
# Using npm
npm install github:yourusername/langchain-prompt-feedback

# Using yarn
yarn add github:yourusername/langchain-prompt-feedback
```

### Method 3: Clone and Link (For Development)

If you want to modify the component or contribute to its development:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/langchain-prompt-feedback.git
   cd langchain-prompt-feedback
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the component:
   ```bash
   npm run build
   ```

4. Link the package locally:
   ```bash
   npm link
   ```

5. In your project, link to the local package:
   ```bash
   cd your-project
   npm link langchain-prompt-feedback
   ```

## Verifying Installation

To verify that the installation was successful, create a simple test file:

```typescript
// test.ts
import { PromptFeedbackChain } from 'langchain-prompt-feedback';

// Create a simple feedback chain
const feedbackChain = new PromptFeedbackChain({
  criteria: {
    clarity: true,
    context: true,
    constraints: true,
    examples: true,
    format: true
  },
  useLLM: false // Use heuristic evaluation for quick testing
});

// Test with a simple prompt
async function testFeedback() {
  const result = await feedbackChain.call({ input: "Tell me about artificial intelligence" });
  console.log("Feedback:", result.feedback);
}

testFeedback().catch(console.error);
```

Run the test file:

```bash
# If you have ts-node installed
ts-node test.ts

# Or compile and run
tsc test.ts
node test.js
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**:
   - Ensure you have TypeScript installed: `npm install -g typescript`
   - Check your tsconfig.json for compatibility

2. **Dependency Conflicts**:
   - If you encounter dependency conflicts, try using `npm install --legacy-peer-deps`
   - Ensure you have compatible versions of LangChain packages

3. **Import Errors**:
   - Verify that the package is correctly installed in your node_modules
   - Check for any path issues in your import statements

### Getting Help

If you encounter any issues that aren't covered here:

1. Check the [GitHub Issues](https://github.com/yourusername/langchain-prompt-feedback/issues) to see if someone has reported a similar problem
2. Open a new issue with details about your environment and the specific error
3. Join our community discussions for more interactive help

## Next Steps

Once installed, check out the [Getting Started Guide](GETTING_STARTED.md) for instructions on how to use the component in your project.