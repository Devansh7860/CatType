// data/words.js - Word database with difficulty levels

export const WORD_LISTS = {
  easy: [
    'cat', 'dog', 'run', 'fun', 'sun', 'big', 'top', 'red', 'new', 'old',
    'man', 'car', 'boy', 'day', 'way', 'sea', 'sky', 'tree', 'book', 'room',
    'home', 'time', 'work', 'play', 'food', 'hand', 'head', 'eye', 'face', 'back',
    'door', 'road', 'fish', 'bird', 'girl', 'house', 'water', 'light', 'green', 'blue',
    'write', 'right', 'think', 'small', 'large', 'quick', 'happy', 'clean', 'chair', 'table',
    'mouse', 'phone', 'music', 'movie', 'paper', 'money', 'color', 'white', 'black', 'brown',
    'apple', 'bread', 'smile', 'laugh', 'dream', 'sleep', 'start', 'place', 'world', 'peace'
  ],
  
  medium: [
    'computer', 'keyboard', 'monitor', 'program', 'software', 'internet', 'website', 'password', 'username', 'database',
    'language', 'function', 'variable', 'algorithm', 'structure', 'framework', 'library', 'package', 'version', 'update',
    'developer', 'engineer', 'designer', 'manager', 'project', 'meeting', 'schedule', 'deadline', 'budget', 'client',
    'business', 'company', 'service', 'product', 'market', 'customer', 'quality', 'process', 'system', 'network',
    'security', 'privacy', 'backup', 'restore', 'install', 'configure', 'optimize', 'analyze', 'execute', 'validate',
    'creative', 'innovative', 'efficient', 'reliable', 'scalable', 'flexible', 'practical', 'logical', 'digital', 'modern',
    'keyboard', 'document', 'template', 'calendar', 'contact', 'message', 'notification', 'settings', 'profile', 'account'
  ],
  
  hard: [
    'extraordinarily', 'incomprehensible', 'responsibilities', 'characteristics', 'transformation', 'implementation', 'authentication', 'authorization', 'infrastructure', 'architecture',
    'psychological', 'philosophical', 'technological', 'entrepreneurial', 'experimental', 'environmental', 'international', 'constitutional', 'revolutionary', 'evolutionary',
    'pronunciation', 'communication', 'documentation', 'configuration', 'optimization', 'synchronization', 'standardization', 'personalization', 'internationalization', 'localization',
    'unprecedented', 'conscientious', 'distinguished', 'acknowledgment', 'entrepreneur', 'bureaucratic', 'sophisticated', 'rehabilitation', 'representative', 'collaboration',
    'circumstances', 'automatically', 'approximately', 'significantly', 'unfortunately', 'extraordinary', 'traditionally', 'fundamentally', 'professionally', 'exceptionally',
    'comprehensive', 'controversial', 'disadvantages', 'manufacturing', 'overwhelming', 'uncomfortable', 'neighborhood', 'breakthrough', 'contemporary',
    'susceptibility', 'differentiation', 'interdisciplinary', 'counterproductive', 'disproportionate', 'incompatibility', 'indistinguishable', 'uncharacteristic', 'interconnectedness', 'unanticipated'
  ]
};

export const DIFFICULTY_CONFIG = {
  easy: {
    name: 'Easy',
    description: 'Short, common words (3-5 letters)',
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    borderColor: 'border-green-400/30'
  },
  medium: {
    name: 'Medium', 
    description: 'Regular words (6-10 letters)',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400/30'
  },
  hard: {
    name: 'Hard',
    description: 'Complex, long words (10+ letters)',
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
    borderColor: 'border-red-400/30'
  }
};

// Helper function to get random words from a difficulty level
export const getRandomWords = (difficulty = 'medium', count = 100) => {
  const wordList = WORD_LISTS[difficulty] || WORD_LISTS.medium;
  const words = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    words.push(wordList[randomIndex]);
  }
  
  return words;
};

// Alternative: get words without repetition (until all words used)
export const getRandomWordsNoRepeat = (difficulty = 'medium', count = 100) => {
  const wordList = [...(WORD_LISTS[difficulty] || WORD_LISTS.medium)];
  const words = [];
  
  for (let i = 0; i < count; i++) {
    if (wordList.length === 0) {
      // Reset the word list if we've used all words
      wordList.push(...(WORD_LISTS[difficulty] || WORD_LISTS.medium));
    }
    
    const randomIndex = Math.floor(Math.random() * wordList.length);
    words.push(wordList.splice(randomIndex, 1)[0]);
  }
  
  return words;
};