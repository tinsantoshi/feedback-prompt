#!/usr/bin/env node

/**
 * Script to run the examples for the LangChain Prompt Feedback Component
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.blue}=== LangChain Prompt Feedback Component Examples ====${colors.reset}\n`);

// Check if ts-node is installed
try {
  console.log(`${colors.yellow}Checking dependencies...${colors.reset}`);
  execSync('ts-node --version', { stdio: 'ignore' });
  console.log(`${colors.green}✓ ts-node is installed${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ ts-node is not installed. Installing...${colors.reset}`);
  try {
    execSync('npm install -g ts-node typescript', { stdio: 'inherit' });
    console.log(`${colors.green}✓ ts-node installed successfully${colors.reset}`);
  } catch (installError) {
    console.error(`${colors.red}✗ Failed to install ts-node. Please install manually: npm install -g ts-node typescript${colors.reset}`);
    process.exit(1);
  }
}

// Get list of examples
const examplesDir = path.join(__dirname, 'examples');
const examples = fs.readdirSync(examplesDir)
  .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
  .map(file => ({
    name: file.replace(/\.(ts|tsx)$/, ''),
    path: path.join(examplesDir, file),
    type: file.endsWith('.tsx') ? 'React' : 'TypeScript'
  }));

if (examples.length === 0) {
  console.error(`${colors.red}No examples found in ${examplesDir}${colors.reset}`);
  process.exit(1);
}

// Display available examples
console.log(`${colors.yellow}Available examples:${colors.reset}`);
examples.forEach((example, index) => {
  console.log(`${colors.bright}${index + 1}. ${example.name}${colors.reset} (${example.type})`);
});

// Get user input for which example to run
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question(`\n${colors.cyan}Enter the number of the example to run (1-${examples.length}): ${colors.reset}`, (answer) => {
  const exampleIndex = parseInt(answer) - 1;
  
  if (isNaN(exampleIndex) || exampleIndex < 0 || exampleIndex >= examples.length) {
    console.error(`${colors.red}Invalid selection. Please enter a number between 1 and ${examples.length}.${colors.reset}`);
    readline.close();
    process.exit(1);
  }
  
  const selectedExample = examples[exampleIndex];
  console.log(`\n${colors.yellow}Running example: ${colors.bright}${selectedExample.name}${colors.reset}`);
  
  try {
    if (selectedExample.type === 'React') {
      console.log(`${colors.yellow}Note: This is a React component example. It cannot be run directly with ts-node.${colors.reset}`);
      console.log(`${colors.yellow}The code is displayed below for reference:${colors.reset}\n`);
      
      const exampleCode = fs.readFileSync(selectedExample.path, 'utf8');
      console.log(exampleCode);
    } else {
      execSync(`ts-node ${selectedExample.path}`, { stdio: 'inherit' });
      console.log(`\n${colors.green}Example completed successfully.${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}Failed to run example: ${error.message}${colors.reset}`);
  }
  
  readline.close();
});