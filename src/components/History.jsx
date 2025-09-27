// components/History.jsx
import { useTheme } from '../contexts/ThemeContext';
import { getDifficultyConfig } from '../services/textService';

export const History = ({ history, onClearHistory }) => {
  const { colors } = useTheme();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDifficultyBadge = (difficulty) => {
    const config = getDifficultyConfig(difficulty);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color} ${config.borderColor} border`}>
        {config.name}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <h2 className={`text-3xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
            Typing History
          </h2>
          <span className="text-3xl">🐱</span>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 hover:scale-105 font-semibold text-sm flex items-center gap-2"
          >
            🗑️ Clear History
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div
              key={entry.id}
              className={`${colors.bgSecondary} backdrop-blur-sm rounded-xl p-6 hover:scale-[1.01] transition-all duration-200 border ${colors.border} shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`text-3xl font-bold ${colors.textMuted} flex items-center gap-2`}>
                    <span className="text-2xl">
                      {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📝'}
                    </span>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`text-xl font-bold ${colors.primaryText}`}>{entry.wpm} WPM</span>
                      <span className="text-green-400 font-semibold">{entry.accuracy}%</span>
                      <span className={`${colors.textSecondary} text-sm`}>{entry.time}s</span>
                      {getDifficultyBadge(entry.difficulty || 'medium')}
                    </div>
                    <div className={`text-sm ${colors.textSecondary} flex items-center gap-2`}>
                      <span>📅</span>
                      {formatDate(entry.date)}
                    </div>
                  </div>
                </div>
                <div className={`text-sm ${colors.textSecondary} text-right`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>📝</span>
                    {entry.wordsTyped} words
                  </div>
                  <div className="flex items-center gap-2">
                    <span>❌</span>
                    {entry.errors} errors
                  </div>
                </div>
              </div>
              
              {/* Progress bar based on WPM */}
              <div className={`mt-4 bg-gray-600/20 rounded-full h-2 overflow-hidden`}>
                <div 
                  className={`h-full bg-gradient-to-r ${colors.primary} transition-all duration-500 rounded-full`}
                  style={{ width: `${Math.min((entry.wpm / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${colors.bgSecondary} rounded-2xl border ${colors.border}`}>
          <div className="text-6xl mb-4">🐱</div>
          <div className={`${colors.textSecondary} text-lg`}>
            No typing history yet
          </div>
          <div className={`${colors.textMuted} text-sm mt-2`}>
            Complete a test to see your purrfect progress here! 🐾
          </div>
        </div>
      )}
    </div>
  );
};