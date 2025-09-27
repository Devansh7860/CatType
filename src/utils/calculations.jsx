
// utils/calculations.js
export const calculateWPM = (correctChars, minutes) => {
  if (minutes <= 0) return 0;
  return Math.round((correctChars / 5) / minutes);
};

export const calculateAccuracy = (correctKeystrokes, totalKeystrokes) => {
  if (totalKeystrokes === 0) return 100;
  return Math.round((correctKeystrokes / totalKeystrokes) * 100);
};

// Additional utility functions for better UX
export const getTypingSpeedCategory = (wpm) => {
  if (wpm >= 70) return { category: 'expert', emoji: '🚀', message: 'Lightning fast! You\'re a typing master!' };
  if (wpm >= 50) return { category: 'advanced', emoji: '⚡', message: 'Excellent typing speed!' };
  if (wpm >= 35) return { category: 'good', emoji: '🎯', message: 'Great job! Keep it up!' };
  if (wpm >= 20) return { category: 'average', emoji: '👍', message: 'Good progress! Practice more!' };
  return { category: 'beginner', emoji: '🐾', message: 'Keep practicing! You\'re getting better!' };
};

export const getAccuracyFeedback = (accuracy) => {
  if (accuracy >= 95) return { level: 'perfect', emoji: '🎯', message: 'Perfect precision!' };
  if (accuracy >= 90) return { level: 'excellent', emoji: '✨', message: 'Excellent accuracy!' };
  if (accuracy >= 80) return { level: 'good', emoji: '👌', message: 'Good accuracy!' };
  if (accuracy >= 70) return { level: 'fair', emoji: '🎈', message: 'Keep focusing on accuracy!' };
  return { level: 'needs-improvement', emoji: '💪', message: 'Slow down and focus on accuracy!' };
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
};

export const calculateProgress = (currentIndex, totalWords) => {
  return Math.round((currentIndex / totalWords) * 100);
};