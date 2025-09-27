// services/analyticsService.js - Analytics and statistics service

import { ACHIEVEMENTS } from '../data/achievements.js';

export const calculateUserStats = (history) => {
  if (!history || history.length === 0) {
    return {
      totalTests: 0,
      bestWPM: 0,
      bestAccuracy: 0,
      averageWPM: 0,
      averageAccuracy: 0,
      totalWordsTyped: 0,
      totalErrors: 0,
      totalTimeSpent: 0,
      easyTests: 0,
      mediumTests: 0,
      hardTests: 0,
      improvementTrend: 0,
      consistencyScore: 0,
      weakestKeys: [],
      strongestKeys: [],
      recentPerformance: []
    };
  }

  const stats = {
    totalTests: history.length,
    bestWPM: Math.max(...history.map(h => h.wpm)),
    bestAccuracy: Math.max(...history.map(h => h.accuracy)),
    averageWPM: Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length),
    averageAccuracy: Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / history.length),
    totalWordsTyped: history.reduce((sum, h) => sum + (h.wordsTyped || 0), 0),
    totalErrors: history.reduce((sum, h) => sum + (h.errors || 0), 0),
    totalTimeSpent: history.reduce((sum, h) => sum + (h.time || 0), 0),
    easyTests: history.filter(h => h.difficulty === 'easy').length,
    mediumTests: history.filter(h => h.difficulty === 'medium').length,
    hardTests: history.filter(h => h.difficulty === 'hard').length
  };

  // Calculate improvement trend (last 5 vs first 5 tests)
  if (history.length >= 5) {
    const recent5 = history.slice(0, 5);
    const first5 = history.slice(-5);
    const recentAvg = recent5.reduce((sum, h) => sum + h.wpm, 0) / 5;
    const firstAvg = first5.reduce((sum, h) => sum + h.wpm, 0) / 5;
    stats.improvementTrend = Math.round(((recentAvg - firstAvg) / firstAvg) * 100);
  }

  // Calculate consistency score (lower standard deviation = higher consistency)
  if (history.length > 1) {
    const wpmValues = history.map(h => h.wpm);
    const mean = stats.averageWPM;
    const variance = wpmValues.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpmValues.length;
    const stdDev = Math.sqrt(variance);
    stats.consistencyScore = Math.max(0, Math.round(100 - (stdDev / mean) * 100));
  }

  // Recent performance (last 10 tests for charts)
  stats.recentPerformance = history.slice(0, 10).reverse().map((test, index) => ({
    test: index + 1,
    wpm: test.wpm,
    accuracy: test.accuracy,
    date: test.date
  }));

  return stats;
};

export const checkAchievements = (userStats, currentTest, history) => {
  const unlockedAchievements = [];
  const currentTime = currentTest ? new Date(currentTest.date) : new Date();

  Object.values(ACHIEVEMENTS).forEach(achievement => {
    // Check if already unlocked
    const existingAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    if (existingAchievements.includes(achievement.id)) return;

    // Check achievement condition
    let unlocked = false;
    if (achievement.condition.length === 1) {
      // Only requires stats
      unlocked = achievement.condition(userStats);
    } else {
      // Requires additional parameters
      unlocked = achievement.condition(userStats, currentTest, currentTime);
    }

    if (unlocked) {
      unlockedAchievements.push(achievement);
      
      // Save to localStorage
      const updated = [...existingAchievements, achievement.id];
      localStorage.setItem('achievements', JSON.stringify(updated));
    }
  });

  return unlockedAchievements;
};

export const getUserAchievements = () => {
  const unlockedIds = JSON.parse(localStorage.getItem('achievements') || '[]');
  return unlockedIds;
};

export const getKeyboardHeatmap = (history) => {
  // This is a simplified version - in a real implementation, 
  // you'd track individual keystrokes and their success rates
  const keyData = {};
  
  // Common keys that often cause problems
  const commonProblems = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 
                         'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
                         'z', 'x', 'c', 'v', 'b', 'n', 'm'];
  
  commonProblems.forEach(key => {
    // Simulate accuracy data based on user's overall performance
    const avgAccuracy = history.length > 0 ? 
      history.reduce((sum, h) => sum + h.accuracy, 0) / history.length : 90;
    
    // Add some variation for different keys
    const variation = (Math.random() - 0.5) * 20;
    keyData[key] = Math.max(0, Math.min(100, avgAccuracy + variation));
  });
  
  return keyData;
};