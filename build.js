#!/usr/bin/env node

/**
 * Build script for the LangChain Prompt Feedback Component
 * 
 * This script handles the build process for the component,
 * including TypeScript compilation and bundling.
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
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.blue}=== LangChain Prompt Feedback Component Build ====${colors.reset}\n`);

// Check if TypeScript is installed
try {
  console.log(`${colors.yellow}Checking dependencies...${colors.reset}`);
  execSync('tsc --version', { stdio: 'ignore' });
  console.log(`${colors.green}✓ TypeScript is installed${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ TypeScript is not installed. Please run: npm install -g typescript${colors.reset}`);
  process.exit(1);
}

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  console.log(`${colors.yellow}Creating dist directory...${colors.reset}`);
  fs.mkdirSync('dist');
  console.log(`${colors.green}✓ Created dist directory${colors.reset}`);
}

// Compile TypeScript
try {
  console.log(`${colors.yellow}Compiling TypeScript...${colors.reset}`);
  execSync('tsc', { stdio: 'inherit' });
  console.log(`${colors.green}✓ TypeScript compilation successful${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ TypeScript compilation failed${colors.reset}`);
  process.exit(1);
}

// Copy package.json to dist
try {
  console.log(`${colors.yellow}Copying package.json to dist...${colors.reset}`);
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Remove dev dependencies for the distribution
  delete packageJson.devDependencies;
  
  // Write the modified package.json to dist
  fs.writeFileSync(
    path.join('dist', 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log(`${colors.green}✓ Copied package.json to dist${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ Failed to copy package.json: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Copy README.md to dist
try {
  console.log(`${colors.yellow}Copying README.md to dist...${colors.reset}`);
  fs.copyFileSync('README.md', path.join('dist', 'README.md'));
  console.log(`${colors.green}✓ Copied README.md to dist${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ Failed to copy README.md: ${error.message}${colors.reset}`);
}

// Copy LICENSE to dist
try {
  console.log(`${colors.yellow}Copying LICENSE to dist...${colors.reset}`);
  fs.copyFileSync('LICENSE', path.join('dist', 'LICENSE'));
  console.log(`${colors.green}✓ Copied LICENSE to dist${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}✗ Failed to copy LICENSE: ${error.message}${colors.reset}`);
}

console.log(`\n${colors.bright}${colors.green}Build completed successfully!${colors.reset}`);
console.log(`\nYou can now publish the package with: ${colors.bright}cd dist && npm publish${colors.reset}`);