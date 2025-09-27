// data/achievements.js - Cat-themed achievement system

export const ACHIEVEMENTS = {
  // Speed Achievements
  'first-steps': {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first typing test',
    icon: '🐾',
    category: 'milestone',
    condition: (stats) => stats.totalTests >= 1,
    rarity: 'common'
  },
  
  'kitten-speed': {
    id: 'kitten-speed',
    name: 'Kitten Speed',
    description: 'Reach 20 WPM',
    icon: '🐱',
    category: 'speed',
    condition: (stats) => stats.bestWPM >= 20,
    rarity: 'common'
  },
  
  'cat-speed': {
    id: 'cat-speed',
    name: 'Cat Speed', 
    description: 'Reach 40 WPM',
    icon: '🐈',
    category: 'speed',
    condition: (stats) => stats.bestWPM >= 40,
    rarity: 'uncommon'
  },
  
  'cheetah-paws': {
    id: 'cheetah-paws',
    name: 'Cheetah Paws',
    description: 'Reach 60 WPM',
    icon: '🐆',
    category: 'speed',
    condition: (stats) => stats.bestWPM >= 60,
    rarity: 'rare'
  },
  
  'lightning-paws': {
    id: 'lightning-paws',
    name: 'Lightning Paws',
    description: 'Reach 80 WPM',
    icon: '⚡',
    category: 'speed',
    condition: (stats) => stats.bestWPM >= 80,
    rarity: 'epic'
  },
  
  'supersonic-cat': {
    id: 'supersonic-cat',
    name: 'Supersonic Cat',
    description: 'Reach 100 WPM',
    icon: '🚀',
    category: 'speed',
    condition: (stats) => stats.bestWPM >= 100,
    rarity: 'legendary'
  },
  
  // Accuracy Achievements
  'sharp-claws': {
    id: 'sharp-claws',
    name: 'Sharp Claws',
    description: 'Achieve 90% accuracy',
    icon: '🔪',
    category: 'accuracy',
    condition: (stats) => stats.bestAccuracy >= 90,
    rarity: 'uncommon'
  },
  
  'purr-fect-precision': {
    id: 'purr-fect-precision',
    name: 'Purr-fect Precision',
    description: 'Achieve 95% accuracy',
    icon: '🎯',
    category: 'accuracy', 
    condition: (stats) => stats.bestAccuracy >= 95,
    rarity: 'rare'
  },
  
  'flawless-feline': {
    id: 'flawless-feline',
    name: 'Flawless Feline',
    description: 'Achieve 100% accuracy',
    icon: '💎',
    category: 'accuracy',
    condition: (stats) => stats.bestAccuracy >= 100,
    rarity: 'legendary'
  },
  
  // Consistency Achievements  
  'steady-paws': {
    id: 'steady-paws',
    name: 'Steady Paws',
    description: 'Complete 10 tests',
    icon: '🐾',
    category: 'consistency',
    condition: (stats) => stats.totalTests >= 10,
    rarity: 'common'
  },
  
  'dedicated-cat': {
    id: 'dedicated-cat',
    name: 'Dedicated Cat',
    description: 'Complete 50 tests',
    icon: '🏆',
    category: 'consistency',
    condition: (stats) => stats.totalTests >= 50,
    rarity: 'rare'
  },
  
  'typing-master': {
    id: 'typing-master',
    name: 'Typing Master',
    description: 'Complete 100 tests',
    icon: '👑',
    category: 'consistency',
    condition: (stats) => stats.totalTests >= 100,
    rarity: 'legendary'
  },
  
  'night-owl': {
    id: 'night-owl',
    name: 'Night Owl Cat',
    description: 'Practice between 10 PM - 6 AM',
    icon: '🌙',
    category: 'special',
    condition: (stats, testTime) => {
      const hour = new Date(testTime).getHours();
      return hour >= 22 || hour <= 6;
    },
    rarity: 'uncommon'
  },
  
  'early-bird': {
    id: 'early-bird',
    name: 'Early Bird Cat',
    description: 'Practice between 5 AM - 8 AM',
    icon: '🌅',
    category: 'special',
    condition: (stats, testTime) => {
      const hour = new Date(testTime).getHours();
      return hour >= 5 && hour <= 8;
    },
    rarity: 'uncommon'
  },
  
  // Difficulty Achievements
  'brave-kitten': {
    id: 'brave-kitten',
    name: 'Brave Kitten',
    description: 'Complete a Hard difficulty test',
    icon: '🦁',
    category: 'difficulty',
    condition: (stats) => stats.hardTests >= 1,
    rarity: 'uncommon'
  },
  
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 10 tests in Easy mode',
    icon: '😈',
    category: 'difficulty',
    condition: (stats) => stats.easyTests >= 10,
    rarity: 'common'
  },
  
  // Fun Achievements
  'palindrome-paws': {
    id: 'palindrome-paws',
    name: 'Palindrome Paws',
    description: 'Get exactly the same WPM and accuracy (e.g., 55 WPM, 55%)',
    icon: '🔄',
    category: 'fun',
    condition: (stats, currentTest) => currentTest && currentTest.wpm === currentTest.accuracy,
    rarity: 'rare'
  },
  
  'lucky-cat': {
    id: 'lucky-cat',
    name: 'Lucky Cat',
    description: 'Get exactly 77 WPM',
    icon: '🍀',
    category: 'fun',
    condition: (stats, currentTest) => currentTest && currentTest.wpm === 77,
    rarity: 'epic'
  }
};

export const RARITY_COLORS = {
  common: { text: 'text-gray-400', border: '#9ca3af50' },
  uncommon: { text: 'text-green-400', border: '#10b98150' },
  rare: { text: 'text-blue-400', border: '#60a5fa50' },
  epic: { text: 'text-purple-400', border: '#a78bfa50' },
  legendary: { text: 'text-yellow-400', border: '#fbbf2450' }
};

export const RARITY_BACKGROUNDS = {
  common: 'bg-gray-400/10',
  uncommon: 'bg-green-400/10', 
  rare: 'bg-blue-400/10',
  epic: 'bg-purple-400/10',
  legendary: 'bg-yellow-400/10'
};

export const ACHIEVEMENT_CATEGORIES = {
  all: { name: 'All', icon: '🏆' },
  speed: { name: 'Speed', icon: '⚡' },
  accuracy: { name: 'Accuracy', icon: '🎯' },
  milestone: { name: 'Milestones', icon: '🗓️' },
  consistency: { name: 'Consistency', icon: '📈' },
  special: { name: 'Special', icon: '⭐' },
  fun: { name: 'Fun', icon: '🎉' }
};