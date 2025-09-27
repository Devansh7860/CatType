// services/textService.js - Advanced word generation with difficulty levels
import { getRandomWordsNoRepeat, DIFFICULTY_CONFIG } from '../data/words.js';

// Fallback words in case of any issues
const FALLBACK_WORDS = [
  'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'typing', 'practice',
  'keyboard', 'fingers', 'speed', 'accuracy', 'words', 'letters', 'sentence', 'paragraph'
];

export const fetchQuotes = async (difficulty = 'medium', wordCount = 100) => {
  try {
    // Get random words based on difficulty level
    const words = getRandomWordsNoRepeat(difficulty, wordCount);
    
    if (!words || words.length === 0) {
      console.warn('No words found for difficulty:', difficulty);
      return FALLBACK_WORDS.slice(0, wordCount);
    }
    
    return words;
  } catch (error) {
    console.error('Error generating words:', error);
    return FALLBACK_WORDS.slice(0, wordCount);
  }
};

// Get available difficulty levels
export const getDifficultyLevels = () => {
  return Object.keys(DIFFICULTY_CONFIG).map(key => ({
    id: key,
    ...DIFFICULTY_CONFIG[key]
  }));
};

// Get difficulty config
export const getDifficultyConfig = (difficulty) => {
  return DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
};