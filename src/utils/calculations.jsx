
// utils/calculations.js - Industry-standard typing test calculations (MonkeyType compatible)

/**
 * Calculate WPM using the industry standard method
 * WPM = (Total correct characters / 5) / (time in minutes)
 * @param {number} correctChars - Number of correct characters typed
 * @param {number} timeInSeconds - Actual typing time in seconds
 * @returns {number} Words per minute
 */
export const calculateWPM = (correctChars, timeInSeconds) => {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  return Math.round((correctChars / 5) / minutes);
};

/**
 * Calculate raw WPM without accuracy considerations
 * @param {number} totalChars - Total characters typed (including errors)
 * @param {number} timeInSeconds - Actual typing time in seconds
 * @returns {number} Raw words per minute
 */
export const calculateRawWPM = (totalChars, timeInSeconds) => {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  return Math.round((totalChars / 5) / minutes);
};

/**
 * Calculate accuracy based on character-level comparison
 * @param {number} correctChars - Number of correct characters
 * @param {number} totalChars - Total characters in the text attempted
 * @returns {number} Accuracy percentage (0-100)
 */
export const calculateAccuracy = (correctChars, totalChars) => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

/**
 * Calculate comprehensive typing results using industry standards
 * @param {Object} testData - Test data object
 * @returns {Object} Complete results object
 */
export const calculateComprehensiveResults = ({
  words,
  typedWords,
  currentInput = '',
  currentWordIndex,
  startTime,
  endTime,
  totalKeystrokes,
  correctKeystrokes,
  isFinished,
  totalWordsTyped = 0
}) => {
  // Calculate actual typing time
  const actualTypingTime = endTime && startTime ? (endTime - startTime) / 1000 : 0;
  
  let correctChars = 0;
  let totalCharsAttempted = 0;
  let correctWords = 0;
  
  // Process all completed words (up to totalWordsTyped)
  const wordsToProcess = Math.min(totalWordsTyped, typedWords.length);
  for (let i = 0; i < wordsToProcess; i++) {
    const typedWord = typedWords[i];
    const actualWord = words[i];
    if (!actualWord) continue;
    
    totalCharsAttempted += actualWord.length;
    
    if (typedWord === actualWord) {
      correctWords++;
      correctChars += actualWord.length;
    } else {
      // Count correct characters in incorrect words
      for (let j = 0; j < Math.min(typedWord.length, actualWord.length); j++) {
        if (typedWord[j] === actualWord[j]) {
          correctChars++;
        }
      }
    }
  }
  
  // Process current word being typed (if any)
  if (!isFinished && currentInput && words[currentWordIndex]) {
    const currentWord = words[currentWordIndex];
    totalCharsAttempted += currentWord.length;
    
    for (let i = 0; i < Math.min(currentInput.length, currentWord.length); i++) {
      if (currentInput[i] === currentWord[i]) {
        correctChars++;
      }
    }
  }
  
  // Calculate metrics
  const wpm = calculateWPM(correctChars, actualTypingTime);
  const rawWPM = calculateRawWPM(totalKeystrokes, actualTypingTime);
  const accuracy = calculateAccuracy(correctChars, totalCharsAttempted);
  const keystrokeAccuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
  
  return {
    wpm: Math.max(0, wpm),
    rawWPM: Math.max(0, rawWPM),
    accuracy,
    keystrokeAccuracy,
    correctChars,
    totalCharsAttempted,
    correctWords,
    totalWords: totalWordsTyped + (currentInput && !isFinished ? 1 : 0),
    wordsTyped: totalWordsTyped, // Use the actual counter from App state
    errors: totalKeystrokes - correctKeystrokes,
    totalKeystrokes,
    actualTypingTime: Math.round(actualTypingTime),
    consistency: calculateConsistency(typedWords, words)
  };
};

/**
 * Calculate typing consistency (character accuracy variance)
 * @param {Array} typedWords - Array of typed words
 * @param {Array} actualWords - Array of actual words
 * @returns {number} Consistency percentage
 */
export const calculateConsistency = (typedWords, actualWords) => {
  if (typedWords.length === 0) return 100;
  
  const wordAccuracies = typedWords.map((typedWord, index) => {
    const actualWord = actualWords[index];
    if (!actualWord) return 0;
    
    let correct = 0;
    for (let i = 0; i < Math.min(typedWord.length, actualWord.length); i++) {
      if (typedWord[i] === actualWord[i]) correct++;
    }
    return (correct / actualWord.length) * 100;
  });
  
  if (wordAccuracies.length === 0) return 100;
  
  const average = wordAccuracies.reduce((sum, acc) => sum + acc, 0) / wordAccuracies.length;
  const variance = wordAccuracies.reduce((sum, acc) => sum + Math.pow(acc - average, 2), 0) / wordAccuracies.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Convert to consistency score (higher is better)
  return Math.max(0, Math.round(100 - (standardDeviation / 10)));
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