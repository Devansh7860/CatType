// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { TimerDisplay } from './components/TimerDisplay';
import TypingArea from './components/TypingArea';
import { Results } from './components/Results';
import { History } from './components/History';
import { Analytics } from './components/Analytics';
import { Achievements } from './components/Achievements';
import { fetchQuotes } from './services/textService';
import { calculateWPM, calculateAccuracy } from './utils/calculations';
import { useTheme } from './contexts/ThemeContext';
import './App.css';

const App = () => {
  const { colors } = useTheme();
  
  // State management
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedWords, setTypedWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [wordStatuses, setWordStatuses] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [lineOffset, setLineOffset] = useState(0);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);

  const intervalRef = useRef(null);
  const resultsRef = useRef(null);
  const WORDS_PER_LINE = 10;
  const VISIBLE_LINES = 3;
  const FETCH_THRESHOLD = WORDS_PER_LINE * 2; // Fetch when 2 lines remain

  // Initial text fetch
  const initializeText = async () => {
    setLoading(true);
    try {
      const initialWords = await fetchQuotes(difficulty, WORDS_PER_LINE * 6); // Fetch 6 lines initially
      setWords(initialWords);
      setWordStatuses(new Array(initialWords.length).fill('pending'));
    } catch (error) {
      console.error('Error initializing text:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch more text when needed
  const fetchMoreText = async () => {
    if (isFetchingMore) return;
    
    setIsFetchingMore(true);
    try {
      const newWords = await fetchQuotes(difficulty, WORDS_PER_LINE * 3); // Fetch 3 more lines
      setWords(prev => [...prev, ...newWords]);
      setWordStatuses(prev => [...prev, ...new Array(newWords.length).fill('pending')]);
    } catch (error) {
      console.error('Error fetching more text:', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Check if we need to fetch more text or scroll
  useEffect(() => {
    if (!isActive || isFinished) return;

    const wordsRemaining = words.length - currentWordIndex;
    const currentLine = Math.floor((currentWordIndex - lineOffset * WORDS_PER_LINE) / WORDS_PER_LINE);
    
    // Scroll when reaching the third line
    if (currentLine >= 2 && lineOffset < Math.floor(words.length / WORDS_PER_LINE) - VISIBLE_LINES) {
      setLineOffset(prev => prev + 1);
    }
    
    // Fetch more text when running low
    if (wordsRemaining < FETCH_THRESHOLD && !isFetchingMore) {
      fetchMoreText();
    }
  }, [currentWordIndex, isActive, words.length]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('typingHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    initializeText();
  }, []);

  // Reload text when difficulty changes
  useEffect(() => {
    if (!isActive && !isFinished) {
      initializeText();
    }
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            finishTest();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  // Calculate results with improved WPM logic
  const calculateResults = () => {
    const timeElapsed = selectedTime - timeLeft;
    const minutes = Math.max(timeElapsed / 60, 1/60); // Prevent division by zero
    
    let correctChars = 0;
    let totalChars = 0;
    let correctWords = 0;
    let totalWords = 0;
    
    // Count all typed words including those scrolled past
    const allTypedWords = typedWords.slice(0, totalWordsTyped);
    
    allTypedWords.forEach((typedWord, index) => {
      const actualWord = words[index];
      if (actualWord) {
        totalWords++;
        
        // Check if entire word is correct
        if (typedWord === actualWord) {
          correctWords++;
          correctChars += actualWord.length;
        } else {
          // Count only matching characters for incorrect words
          for (let i = 0; i < Math.min(typedWord.length, actualWord.length); i++) {
            if (typedWord[i] === actualWord[i]) {
              correctChars++;
            }
          }
        }
        
        totalChars += actualWord.length;
        
        // Add space between words (except last word)
        if (index < allTypedWords.length - 1) {
          totalChars++;
          if (typedWord === actualWord) {
            correctChars++; // Count space as correct if word was correct
          }
        }
      }
    });

    // Add current word if still typing
    if (!isFinished && currentInput && words[currentWordIndex]) {
      const actualWord = words[currentWordIndex];
      totalWords++;
      
      for (let i = 0; i < Math.min(currentInput.length, actualWord.length); i++) {
        if (currentInput[i] === actualWord[i]) {
          correctChars++;
        }
      }
      totalChars += actualWord.length;
    }

    // Calculate accuracy-adjusted WPM
    const rawAccuracy = totalKeystrokes > 0 ? (correctKeystrokes / totalKeystrokes) : 1;
    const characterAccuracy = totalChars > 0 ? (correctChars / totalChars) : 0;
    
    // Use the more conservative accuracy measure
    const effectiveAccuracy = Math.min(rawAccuracy, characterAccuracy);
    
    // Calculate WPM based on correct characters only (standard method)
    const rawWPM = (correctChars / 5) / minutes;
    
    // Apply accuracy penalty for more realistic WPM
    // If accuracy is below 90%, reduce WPM proportionally
    const accuracyMultiplier = effectiveAccuracy < 0.9 ? effectiveAccuracy : 1;
    const adjustedWPM = Math.round(rawWPM * accuracyMultiplier);
    
    const finalAccuracy = Math.round(effectiveAccuracy * 100);
    
    return {
      wpm: Math.max(0, adjustedWPM), // Ensure non-negative WPM
      accuracy: finalAccuracy,
      time: selectedTime,
      characters: correctChars,
      errors: totalKeystrokes - correctKeystrokes,
      keystrokes: totalKeystrokes,
      timeElapsed: Math.round(timeElapsed),
      wordsTyped: totalWordsTyped,
      correctWords,
      totalWords: Math.max(totalWords, 1)
    };
  };

  // Finish test
  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    
    // Save current word if partially typed
    if (currentInput.length > 0) {
      const newTypedWords = [...typedWords];
      newTypedWords[currentWordIndex] = currentInput;
      setTypedWords(newTypedWords);
    }
    
    const results = calculateResults();
    const newEntry = {
      ...results,
      difficulty: difficulty, // Add current difficulty to history entry
      date: new Date().toISOString(),
      id: Date.now()
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('typingHistory', JSON.stringify(updatedHistory));
    
    // Auto-scroll to results after a short delay
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 300);
  };

  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (isFinished || loading) return;

    if (!isActive && e.key.length === 1) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (wordStatuses[currentWordIndex] === 'correct') {
        if (currentInput === '' && currentWordIndex > 0) {
          if (wordStatuses[currentWordIndex - 1] === 'incorrect') {
            setCurrentWordIndex(currentWordIndex - 1);
            setCurrentInput(typedWords[currentWordIndex - 1] || '');
            setTotalWordsTyped(prev => Math.max(0, prev - 1));
          }
        }
        return;
      }
      
      if (currentInput.length > 0) {
        setCurrentInput(currentInput.slice(0, -1));
      } else if (currentWordIndex > 0 && wordStatuses[currentWordIndex - 1] === 'incorrect') {
        setCurrentWordIndex(currentWordIndex - 1);
        setCurrentInput(typedWords[currentWordIndex - 1] || '');
        setTotalWordsTyped(prev => Math.max(0, prev - 1));
      }
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      
      if (currentInput.trim() === '') return;
      
      const newTypedWords = [...typedWords];
      newTypedWords[currentWordIndex] = currentInput;
      setTypedWords(newTypedWords);
      
      const newWordStatuses = [...wordStatuses];
      newWordStatuses[currentWordIndex] = currentInput === currentWord ? 'correct' : 'incorrect';
      setWordStatuses(newWordStatuses);
      
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentInput('');
      setTotalWordsTyped(prev => prev + 1);
      
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      
      if (wordStatuses[currentWordIndex] === 'correct') {
        return;
      }
      
      setTotalKeystrokes(totalKeystrokes + 1);
      
      const expectedChar = currentWord[currentInput.length];
      if (e.key === expectedChar) {
        setCorrectKeystrokes(correctKeystrokes + 1);
      }
      
      setCurrentInput(currentInput + e.key);
    }
  };

  // Reset test
  const resetTest = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(selectedTime);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedWords([]);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setWordStatuses([]);
    setLineOffset(0);
    setTotalWordsTyped(0);
    initializeText();
  };

  // Change timer
  const changeTimer = (time) => {
    if (!isActive && !isFinished) {
      setSelectedTime(time);
      setTimeLeft(time);
    }
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('typingHistory');
  };

  const currentResults = isFinished ? calculateResults() : null;

  // Determine current view
  const getCurrentView = () => {
    if (showHistory) return 'history';
    if (showAnalytics) return 'analytics';
    if (showAchievements) return 'achievements';
    return 'main';
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${colors.bg} ${colors.text}`}>
      <Header 
        onHistoryToggle={() => {
          setShowHistory(!showHistory);
          setShowAnalytics(false);
          setShowAchievements(false);
        }}
        showHistory={showHistory}
        onAnalyticsToggle={() => {
          setShowAnalytics(!showAnalytics);
          setShowHistory(false);
          setShowAchievements(false);
        }}
        showAnalytics={showAnalytics}
        onAchievementsToggle={() => {
          setShowAchievements(!showAchievements);
          setShowHistory(false);
          setShowAnalytics(false);
        }}
        showAchievements={showAchievements}
        currentView={getCurrentView()}
      />

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 relative z-10">
        {getCurrentView() === 'main' ? (
          <>
            {/* Sleek Control Bar */}
            <ControlBar
              selectedTime={selectedTime}
              onTimeChange={changeTimer}
              selectedDifficulty={difficulty}
              onDifficultyChange={setDifficulty}
              disabled={isActive || isFinished}
            />
            
            <TimerDisplay timeLeft={timeLeft} isActive={isActive} />
            
            <TypingArea
              words={words}
              currentWordIndex={currentWordIndex}
              currentInput={currentInput}
              typedWords={typedWords}
              isFinished={isFinished}
              onKeyDown={handleKeyDown}
              loading={loading}
              wordStatuses={wordStatuses}
              lineOffset={lineOffset}
              wordsPerLine={WORDS_PER_LINE}
              visibleLines={VISIBLE_LINES}
            />
            
            {isFinished && (
              <div ref={resultsRef}>
                <Results results={currentResults} />
              </div>
            )}
            
            <div className="flex justify-center gap-4">
              {!isActive && !isFinished && !loading && (
                <button
                  onClick={() => document.querySelector('[tabindex="0"]').focus()}
                  className={`px-6 py-3 bg-gradient-to-r ${colors.primary} text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-base`}
                >
                  <span className="text-lg">🐾</span>
                  Click here and start typing
                  <span className="text-lg">🐾</span>
                </button>
              )}
              
              {(isActive || isFinished) && (
                <button
                  onClick={resetTest}
                  className={`px-6 py-3 ${colors.button} ${colors.buttonText} rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2 text-base shadow-md`}
                >
                  <span className="text-lg">🔄</span>
                  New Test
                </button>
              )}
            </div>
          </>
        ) : getCurrentView() === 'history' ? (
          <History history={history} onClearHistory={clearHistory} />
        ) : getCurrentView() === 'analytics' ? (
          <Analytics history={history} />
        ) : getCurrentView() === 'achievements' ? (
          <Achievements history={history} />
        ) : null}
      </main>
    </div>
  );
};

export default App;
