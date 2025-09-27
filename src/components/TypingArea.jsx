import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useTheme } from "../contexts/ThemeContext";

const TypingArea = forwardRef(({ 
  words, 
  currentWordIndex, 
  currentInput,
  typedWords,
  isFinished,
  onKeyDown,
  loading,
  wordStatuses,
  lineOffset,
  wordsPerLine,
  visibleLines,
  showCountdown,
  countdown
}, ref) => {
  const { colors } = useTheme();
  const containerRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Expose focus method to parent component
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (isMobile && hiddenInputRef.current) {
        hiddenInputRef.current.focus();
        setIsFocused(true);
      } else if (containerRef.current) {
        containerRef.current.focus();
      }
    }
  }));

  useEffect(() => {
    // Simplified mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!loading && !isFinished && !showCountdown) {
      if (isMobile && hiddenInputRef.current) {
        // Auto-focus on mobile
        setTimeout(() => {
          hiddenInputRef.current.focus();
          setIsFocused(true);
        }, 100);
      } else if (containerRef.current) {
        // Focus container for desktop
        containerRef.current.focus();
      }
    }
  }, [loading, isFinished, isMobile, showCountdown]);

  // Focus immediately when countdown finishes (showCountdown changes from true to false)
  useEffect(() => {
    if (!showCountdown && !loading && !isFinished) {
      // Small delay to ensure the countdown overlay is gone
      setTimeout(() => {
        if (isMobile && hiddenInputRef.current) {
          hiddenInputRef.current.focus();
          setIsFocused(true);
        } else if (containerRef.current) {
          containerRef.current.focus();
        }
      }, 50);
    }
  }, [showCountdown, loading, isFinished, isMobile]);

  // Handle input from hidden field (mobile)
  const handleHiddenInput = (e) => {
    const inputValue = e.target.value;
    
    if (inputValue.length > 0) {
      // New character typed
      const newChar = inputValue[inputValue.length - 1];
      const syntheticEvent = {
        key: newChar,
        preventDefault: () => {},
        target: e.target
      };
      onKeyDown(syntheticEvent);
    }
    
    // Clear the input
    setTimeout(() => {
      e.target.value = '';
    }, 0);
  };

  // Handle backspace on mobile
  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      onKeyDown(e);
      e.preventDefault();
    } else if (e.key === ' ') {
      onKeyDown(e);
      e.preventDefault();
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 mb-6 flex items-center justify-center min-h-[150px] border border-purple-800/40">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm">Loading words... 🐱</span>
        </div>
      </div>
    );
  }

  if (!words || words.length === 0) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 mb-6 flex items-center justify-center min-h-[150px] border border-purple-800/40">
        <span className="text-gray-400 text-sm">No words available</span>
      </div>
    );
  }

  // Show countdown overlay
  if (showCountdown) {
    const displayText = countdown > 0 ? countdown : "GO!";
    const isGo = countdown === 0;
    
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 mb-6 flex flex-col items-center justify-center min-h-[150px] border border-purple-800/40 relative overflow-hidden">
        <div className="text-center z-10 relative">
          <div className={`text-8xl sm:text-9xl font-bold mb-4 transition-all duration-300 ${
            isGo 
              ? 'text-green-400 animate-bounce scale-110' 
              : 'text-purple-400 animate-pulse'
          }`}>
            {displayText}
          </div>
          <div className="text-gray-400 text-lg flex items-center justify-center gap-2">
            <span>🐾</span>
            <span>{isGo ? "Start typing!" : "Get ready to type..."}</span>
            <span>🐾</span>
          </div>
        </div>
        
        {/* Animated background effect */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
          isGo 
            ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 animate-pulse' 
            : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5 animate-pulse'
        }`}></div>
        
        {/* Ripple effect for GO */}
        {isGo && (
          <div className="absolute inset-4 rounded-xl border-2 border-green-400/30 animate-ping"></div>
        )}
      </div>
    );
  }

  const startIdx = lineOffset * wordsPerLine;
  const endIdx = startIdx + (wordsPerLine * visibleLines);
  const visibleWords = Array.isArray(words) ? words.slice(startIdx, endIdx) : [];

  return (
    <div 
      ref={containerRef}
      tabIndex={!isMobile ? 0 : -1}
      onKeyDown={!isMobile ? onKeyDown : undefined}
      onClick={() => {
        if (isMobile && hiddenInputRef.current && !isFocused) {
          hiddenInputRef.current.focus();
          setIsFocused(true);
        }
      }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 cursor-text focus:outline-none focus:ring-2 focus:ring-purple-400/20 relative transition-all duration-300 hover:shadow-lg border border-purple-800/40"
    >
      {/* Hidden input for mobile keyboard */}
      {isMobile && (
        <input
          ref={hiddenInputRef}
          type="text"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text z-10"
          onInput={handleHiddenInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          value=""
          placeholder=""
        />
      )}
      
      <div className="relative">
        <div className="text-lg sm:text-xl md:text-2xl leading-relaxed font-mono select-none tracking-normal">
          {Array.from({ length: visibleLines }).map((_, lineIdx) => {
            const lineStart = lineIdx * wordsPerLine;
            const lineEnd = lineStart + wordsPerLine;
            const lineWords = Array.isArray(visibleWords) ? visibleWords.slice(lineStart, lineEnd) : [];
            
            if (!Array.isArray(lineWords) || lineWords.length === 0) return null;
            
            return (
              <div key={`line-${lineOffset + lineIdx}`} className="flex flex-wrap gap-2 sm:gap-3 mb-2 sm:mb-3">
                {lineWords.map((word, wordIdxInLine) => {
                  const globalWordIdx = startIdx + lineStart + wordIdxInLine;
                  const isCurrentWord = globalWordIdx === currentWordIndex;
                  const isPastWord = globalWordIdx < currentWordIndex;
                  const wordStatus = wordStatuses[globalWordIdx];
                  
                  return (
                    <div key={`word-${globalWordIdx}`} className="flex relative">
                      {word.split("").map((char, charIdx) => {
                        let charClass = "relative ";
                        
                        if (isPastWord) {
                          if (wordStatus === "correct") {
                            charClass += "text-emerald-400";
                          } else {
                            const typedWord = typedWords[globalWordIdx] || "";
                            if (charIdx < typedWord.length) {
                              charClass += typedWord[charIdx] === char 
                                ? "text-gray-100"
                                : "text-red-400";
                            } else {
                              charClass += "text-red-400";
                            }
                          }
                        } else if (isCurrentWord) {
                          if (charIdx < currentInput.length) {
                            charClass += currentInput[charIdx] === char 
                              ? "text-gray-100"
                              : "text-red-400";
                          } else {
                            charClass += "text-gray-600";
                          }
                        } else {
                          charClass += "text-gray-600";
                        }

                        const showCursor = isCurrentWord && charIdx === currentInput.length && !isFinished;
                        
                        return (
                          <span key={charIdx} className={charClass + " relative"}>
                            {showCursor && (
                              <span className="absolute -left-0.5 top-0 w-0.5 h-full bg-purple-400 animate-pulse"></span>
                            )}
                            {char}
                          </span>
                        );
                      })}
                      
                      {isCurrentWord && currentInput.length > word.length && (
                        <span className="text-red-400 font-bold bg-red-500/20 px-1 rounded ml-1">
                          {currentInput.slice(word.length)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      
      {!isFinished && (
        <div className="mt-6 text-sm text-gray-400 text-center flex flex-col sm:flex-row items-center justify-center gap-2 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-base">🐾</span>
            <span className="hidden sm:inline">Start typing to begin the test...</span>
            <span className="sm:hidden">
              {isFocused ? "Start typing..." : "Tap to start typing..."}
            </span>
            <span className="text-base">🐾</span>
          </div>
          {isMobile && !isFocused && (
            <div className="sm:hidden text-xs text-gray-500 mt-1 animate-pulse">
              📱 Tap anywhere to open keyboard
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TypingArea.displayName = 'TypingArea';

export default TypingArea;
