
// components/Header.jsx
import { Moon, Sun, History, ArrowLeft, BarChart3, Trophy } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Header = ({ 
  onHistoryToggle, 
  showHistory, 
  onAnalyticsToggle, 
  showAnalytics,
  onAchievementsToggle,
  showAchievements,
  currentView 
}) => {
  const { isDark, toggleTheme, colors } = useTheme();

  const getViewTitle = () => {
    switch (currentView) {
      case 'history': return 'History';
      case 'analytics': return 'Analytics';
      case 'achievements': return 'Achievements';
      default: return null;
    }
  };

  return (
    <header className={`border-b ${colors.border} backdrop-blur-xl ${colors.bgSecondary} sticky top-0 z-50 shadow-lg`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo with purple/pink styling */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${colors.primary} rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200`}>
            <span className="text-2xl filter drop-shadow-sm">🐱</span>
          </div>
          <div>
            <h1 className={`text-2xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent hover:scale-105 transform transition-transform duration-200`}>
              CatType
            </h1>
            <p className={`text-xs ${colors.textSecondary} -mt-1 font-medium`}>
              purrfect typing practice
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 sm:p-2.5 rounded-xl ${colors.button} ${colors.buttonText} transition-all duration-300 hover:scale-110 transform shadow-md`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Navigation */}
          {currentView !== 'main' ? (
            // Back button when in a view
            <button
              onClick={() => {
                if (showHistory) onHistoryToggle();
                if (showAnalytics) onAnalyticsToggle();
                if (showAchievements) onAchievementsToggle();
              }}
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl ${colors.button} ${colors.buttonText} transition-all duration-300 flex items-center gap-1 sm:gap-2 hover:scale-105 transform shadow-md font-medium text-sm`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Typing</span>
              <span className="sm:hidden">Back</span>
            </button>
          ) : (
            // Navigation menu when on main view
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={onHistoryToggle}
                className={`px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl ${colors.button} ${colors.buttonText} transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 hover:scale-105 transform shadow-md font-medium text-xs sm:text-sm`}
              >
                <History className="w-4 h-4" />
                <span className="hidden md:inline">History</span>
              </button>
              
              <button
                onClick={onAnalyticsToggle}
                className={`px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl ${colors.button} ${colors.buttonText} transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 hover:scale-105 transform shadow-md font-medium text-xs sm:text-sm`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden md:inline">Analytics</span>
              </button>
              
              <button
                onClick={onAchievementsToggle}
                className={`px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl ${colors.button} ${colors.buttonText} transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 hover:scale-105 transform shadow-md font-medium text-xs sm:text-sm`}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden md:inline">Achievements</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};