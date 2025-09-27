import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

const TypingArea = ({ 
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
  visibleLines
}) => {
  const { colors } = useTheme();
  const containerRef = useRef(null);
  const hiddenInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !isFinished) {
      // Focus the hidden input to trigger mobile keyboard
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
      // Also focus container for desktop
      if (containerRef.current) {
        containerRef.current.focus();
      }
    }
  }, [loading, isFinished]);

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

  const startIdx = lineOffset * wordsPerLine;
  const endIdx = startIdx + (wordsPerLine * visibleLines);
  const visibleWords = Array.isArray(words) ? words.slice(startIdx, endIdx) : [];

  return (
    <div 
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 cursor-text focus:outline-none focus:ring-2 focus:ring-purple-400/20 relative transition-all duration-300 hover:shadow-lg border border-purple-800/40"
    >
      {/* Hidden input for mobile keyboard */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text"
        onInput={handleHiddenInput}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value=""
        placeholder=""
      />
      
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
            <span className="sm:hidden">Tap here and start typing...</span>
            <span className="text-base">🐾</span>
          </div>
          <div className="sm:hidden text-xs text-gray-500 mt-1">
            📱 Mobile keyboard will appear when you tap
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingArea;
