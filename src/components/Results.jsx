
// components/Results.jsx
import { useTheme } from '../contexts/ThemeContext';

export const Results = ({ results }) => {
  const { theme, colors } = useTheme();
  
  if (!results) return null;
  
  const isPremium = theme === 'purple';
  
  return (
    <div className={`${colors.bgSecondary} backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 border-2 ${colors.border} ${
      isPremium ? 'shadow-2xl shadow-violet-500/20 animate-premium-glow' : 'shadow-xl'
    }`}>
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <span className="text-3xl sm:text-4xl md:text-5xl animate-bounce">🎉</span>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent ${
            isPremium ? 'animate-float' : ''
          }`}>
            {isPremium ? 'Premium Results!' : 'Test Complete!'}
          </h2>
          <span className="text-3xl sm:text-4xl md:text-5xl animate-bounce">🐱</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        <div className={`text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-400/30 ${
          isPremium ? 'shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform duration-300' : ''
        }`}>
          <div className={`text-4xl sm:text-5xl md:text-6xl font-bold text-orange-400 ${isPremium ? 'filter drop-shadow-lg' : ''}`}>
            {results.wpm}
          </div>
          <div className={`text-xs sm:text-sm ${colors.textSecondary} mt-2 font-semibold`}>WPM</div>
          <div className="text-xs text-orange-400/70 mt-1 flex items-center justify-center gap-1">
            <span>🚀</span>Speed
          </div>
        </div>

        <div className={`text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-400/30 ${
          isPremium ? 'shadow-lg shadow-green-500/20 hover:scale-105 transition-transform duration-300' : ''
        }`}>
          <div className={`text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 ${isPremium ? 'filter drop-shadow-lg' : ''}`}>
            {results.accuracy}%
          </div>
          <div className={`text-xs sm:text-sm ${colors.textSecondary} mt-2 font-semibold`}>Accuracy</div>
          <div className="text-xs text-green-400/70 mt-1 flex items-center justify-center gap-1">
            <span>🎯</span>Precision
          </div>
        </div>

        <div className={`text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-400/30 ${
          isPremium ? 'shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform duration-300' : ''
        }`}>
          <div className={`text-4xl sm:text-5xl md:text-6xl font-bold text-blue-400 ${isPremium ? 'filter drop-shadow-lg' : ''}`}>
            {results.wordsTyped}
          </div>
          <div className={`text-xs sm:text-sm ${colors.textSecondary} mt-2 font-semibold`}>Words</div>
          <div className="text-xs text-blue-400/70 mt-1 flex items-center justify-center gap-1">
            <span>📝</span>Typed
          </div>
        </div>

        <div className={`text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-400/30 ${
          isPremium ? 'shadow-lg shadow-red-500/20 hover:scale-105 transition-transform duration-300' : ''
        }`}>
          <div className={`text-4xl sm:text-5xl md:text-6xl font-bold text-red-400 ${isPremium ? 'filter drop-shadow-lg' : ''}`}>
            {results.errors}
          </div>
          <div className={`text-xs sm:text-sm ${colors.textSecondary} mt-2 font-semibold`}>Errors</div>
          <div className="text-xs text-red-400/70 mt-1 flex items-center justify-center gap-1">
            <span>❌</span>Mistakes
          </div>
        </div>
      </div>
      
      {/* Enhanced cat-themed feedback */}
      <div className={`text-center mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl ${
        isPremium 
          ? 'bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-400/30' 
          : 'bg-gradient-to-r from-orange-500/5 to-amber-500/5'
      } ${isPremium ? 'shadow-lg shadow-violet-500/10' : ''}`}>
        <div className={`text-4xl mb-3 ${isPremium ? 'animate-bounce-gentle' : ''}`}>
          {results.wpm >= 60 ? '😻' : results.wpm >= 40 ? '😸' : results.wpm >= 25 ? '🐱' : '😿'}
        </div>
        <p className={`text-lg ${colors.textSecondary} font-medium`}>
          {results.wpm >= 60 && (isPremium ? "Outstanding! You're a premium typing machine! 🏆" : "Amazing! You're a typing cheetah! 🐆")}
          {results.wpm >= 40 && results.wpm < 60 && (isPremium ? "Excellent work! Premium skills showing! ✨" : "Great job! You're getting the hang of it! 🐱")}
          {results.wpm >= 25 && results.wpm < 40 && (isPremium ? "Good progress! Keep refining your technique! 💎" : "Nice work! Keep practicing! 🐾")}
          {results.wpm < 25 && (isPremium ? "Starting strong! Premium practice makes perfect! 🌟" : "Keep trying! Practice makes purrfect! 💪")}
        </p>
      </div>
    </div>
  );
};