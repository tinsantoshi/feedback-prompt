import { FeedbackCriteria } from './interfaces';

/**
 * Create default feedback criteria
 * @returns Default feedback criteria configuration
 */
export function createDefaultFeedbackCriteria(): FeedbackCriteria {
  return {
    clarity: true,
    context: true,
    constraints: true,
    examples: true,
    format: true
  };
}

/**
 * Create custom feedback criteria
 * @param options Options to override default criteria
 * @returns Custom feedback criteria
 */
export function createFeedbackCriteria(options: Partial<FeedbackCriteria>): FeedbackCriteria {
  return {
    ...createDefaultFeedbackCriteria(),
    ...options
  };
}

/**
 * Calculate a prompt quality score based on basic heuristics
 * @param prompt The prompt to evaluate
 * @returns Score between 0-100
 */
export function calculateBasicPromptScore(prompt: string): number {
  if (!prompt || prompt.length === 0) return 0;
  
  let score = 50; // Start with a neutral score
  
  // Length factor (0-20 points)
  const lengthScore = Math.min(20, Math.floor(prompt.length / 10));
  score += lengthScore;
  
  // Specificity factor (0-10 points)
  const specificityWords = ['specific', 'exactly', 'precisely', 'detailed'];
  const specificityScore = specificityWords.some(word => prompt.toLowerCase().includes(word)) ? 10 : 0;
  score += specificityScore;
  
  // Question clarity (0-10 points)
  const hasQuestion = prompt.includes('?');
  score += hasQuestion ? 10 : 0;
  
  // Context factor (0-10 points)
  const contextWords = ['because', 'since', 'given that', 'context'];
  const contextScore = contextWords.some(word => prompt.toLowerCase().includes(word)) ? 10 : 0;
  score += contextScore;
  
  // Format specification (0-10 points)
  const formatWords = ['format', 'structure', 'style', 'bullet points', 'numbered', 'list', 'table', 'json'];
  const formatScore = formatWords.some(word => prompt.toLowerCase().includes(word)) ? 10 : 0;
  score += formatScore;
  
  // Vague language penalty (-10 points)
  const vagueWords = ['thing', 'stuff', 'etc', 'something', 'anything', 'good', 'nice', 'great'];
  const vagueScore = vagueWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(prompt);
  }) ? -10 : 0;
  score += vagueScore;
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Extract key topics from a prompt
 * @param prompt The prompt to analyze
 * @returns Array of key topics
 */
export function extractKeyTopics(prompt: string): string[] {
  // This is a simplified implementation
  // In a real-world scenario, you might use NLP techniques or an LLM
  
  // Remove common words and punctuation
  const cleanPrompt = prompt.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s{2,}/g, ' ');
  
  // Split into words
  const words = cleanPrompt.split(' ');
  
  // Filter out common stop words
  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
                    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
                    'to', 'from', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
                    'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
                    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
                    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
                    'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
                    'should', 'now', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours',
                    'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
                    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
                    'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
                    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
                    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
                    'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'would',
                    'should', 'could', 'ought', 'i\'m', 'you\'re', 'he\'s', 'she\'s',
                    'it\'s', 'we\'re', 'they\'re', 'i\'ve', 'you\'ve', 'we\'ve',
                    'they\'ve', 'i\'d', 'you\'d', 'he\'d', 'she\'d', 'we\'d', 'they\'d',
                    'i\'ll', 'you\'ll', 'he\'ll', 'she\'ll', 'we\'ll', 'they\'ll',
                    'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'hasn\'t', 'haven\'t',
                    'hadn\'t', 'doesn\'t', 'don\'t', 'didn\'t', 'won\'t', 'wouldn\'t',
                    'shan\'t', 'shouldn\'t', 'can\'t', 'cannot', 'couldn\'t', 'mustn\'t',
                    'let\'s', 'that\'s', 'who\'s', 'what\'s', 'here\'s', 'there\'s',
                    'when\'s', 'where\'s', 'why\'s', 'how\'s', 'a', 'an', 'the', 'and',
                    'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at',
                    'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
                    'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
                    'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
                    'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
                    'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
                    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'];
  
  const significantWords = words.filter(word => 
    word.length > 3 && !stopWords.includes(word)
  );
  
  // Count word frequency
  const wordFrequency: Record<string, number> = {};
  significantWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Sort by frequency
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Return top 5 words or fewer if there aren't 5
  return sortedWords.slice(0, 5);
}

/**
 * Suggest improvements for a prompt based on basic heuristics
 * @param prompt The prompt to analyze
 * @returns Array of improvement suggestions
 */
export function suggestBasicImprovements(prompt: string): string[] {
  const suggestions: string[] = [];
  
  // Check length
  if (prompt.length < 20) {
    suggestions.push('Add more details to your prompt');
  }
  
  // Check for question mark
  if (!prompt.includes('?') && prompt.length > 15) {
    suggestions.push('Consider phrasing your request as a question');
  }
  
  // Check for context
  const contextWords = ['because', 'since', 'as', 'given that', 'context'];
  if (!contextWords.some(word => prompt.toLowerCase().includes(word))) {
    suggestions.push('Add background information or context');
  }
  
  // Check for vague language
  const vagueWords = ['thing', 'stuff', 'etc', 'something', 'anything', 'good', 'nice', 'great'];
  if (vagueWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(prompt);
  })) {
    suggestions.push('Replace vague terms with specific descriptions');
  }
  
  // Check for output format specification
  const formatWords = ['format', 'structure', 'style', 'bullet points', 'numbered', 'list', 'table', 'json'];
  if (!formatWords.some(word => prompt.toLowerCase().includes(word))) {
    suggestions.push('Specify your preferred output format');
  }
  
  return suggestions;
}