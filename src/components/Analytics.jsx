// components/Analytics.jsx - Analytics Dashboard
import { useTheme } from '../contexts/ThemeContext';
import { calculateUserStats, getKeyboardHeatmap } from '../services/analyticsService';

export const Analytics = ({ history }) => {
  const { colors } = useTheme();
  const stats = calculateUserStats(history);
  const keyboardHeatmap = getKeyboardHeatmap(history);

  const StatCard = ({ title, value, subtitle, icon, trend }) => (
    <div className={`${colors.bgSecondary} backdrop-blur-sm rounded-xl p-4 sm:p-6 border ${colors.border} hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        {trend && (
          <div className={`text-sm px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/20 text-green-400' : trend < 0 ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className={`text-3xl font-bold ${colors.primaryText} mb-2`}>{value}</div>
      <div className={`text-sm ${colors.textSecondary}`}>{title}</div>
      {subtitle && <div className={`text-xs ${colors.textMuted} mt-1`}>{subtitle}</div>}
    </div>
  );

  const KeyboardKey = ({ letter, accuracy }) => {
    const getHeatColor = (acc) => {
      if (acc >= 95) return 'bg-green-500/80 text-white';
      if (acc >= 85) return 'bg-green-400/60 text-white';
      if (acc >= 75) return 'bg-yellow-400/60 text-black';
      if (acc >= 65) return 'bg-orange-400/60 text-white';
      return 'bg-red-500/60 text-white';
    };

    return (
      <div 
        className={`w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110 ${getHeatColor(accuracy)}`}
        title={`${letter.toUpperCase()}: ${Math.round(accuracy)}% accuracy`}
      >
        {letter.toUpperCase()}
      </div>
    );
  };

  if (history.length === 0) {
    return (
      <div className={`text-center py-12 ${colors.bgSecondary} rounded-2xl border ${colors.border}`}>
        <div className="text-6xl mb-4">📊</div>
        <div className={`${colors.textSecondary} text-lg mb-2`}>No Analytics Data Yet</div>
        <div className={`${colors.textMuted} text-sm`}>Complete some typing tests to see your purr-formance analytics! 🐱</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">📊</span>
          <h2 className={`text-4xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
            Analytics Dashboard
          </h2>
          <span className="text-4xl">📈</span>
        </div>
        <p className={`${colors.textSecondary} text-lg`}>Your typing journey in numbers and purr-formance insights! 🐱</p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard 
          icon="🏆" 
          title="Best Speed" 
          value={`${stats.bestWPM} WPM`}
          subtitle="Personal record"
        />
        <StatCard 
          icon="🎯" 
          title="Best Accuracy" 
          value={`${stats.bestAccuracy}%`}
          subtitle="Most precise test"
        />
        <StatCard 
          icon="📝" 
          title="Total Tests" 
          value={stats.totalTests}
          subtitle={`${stats.totalWordsTyped.toLocaleString()} words typed`}
        />
        <StatCard 
          icon="⚡" 
          title="Average Speed" 
          value={`${stats.averageWPM} WPM`}
          subtitle={`${stats.averageAccuracy}% avg accuracy`}
          trend={stats.improvementTrend}
        />
      </div>

      {/* Performance Chart */}
      <div className={`${colors.bgSecondary} backdrop-blur-sm rounded-xl p-6 border ${colors.border}`}>
        <h3 className={`text-2xl font-bold ${colors.text} mb-6 flex items-center gap-3`}>
          📈 Recent Performance
          <span className="text-sm font-normal text-gray-400">(Last 10 Tests)</span>
        </h3>
        
        {stats.recentPerformance.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-gray-400 px-4">
              <span>Test #</span>
              <span>WPM</span>
              <span>Accuracy</span>
            </div>
            {stats.recentPerformance.map((test, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="font-mono">{stats.totalTests - index}</span>
                <span className={`font-bold ${colors.primaryText}`}>{test.wpm} WPM</span>
                <span className={`font-semibold ${test.accuracy >= 90 ? 'text-green-400' : test.accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {test.accuracy}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">Complete more tests to see your progress chart! 📊</div>
        )}
      </div>

      {/* Difficulty Breakdown */}
      <div className={`${colors.bgSecondary} backdrop-blur-sm rounded-xl p-6 border ${colors.border}`}>
        <h3 className={`text-2xl font-bold ${colors.text} mb-6`}>🎯 Difficulty Breakdown</h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center p-2 sm:p-4 bg-green-400/10 rounded-lg border border-green-400/30">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🟢</div>
            <div className="font-bold text-green-400 text-lg sm:text-xl">{stats.easyTests}</div>
            <div className="text-xs sm:text-sm text-gray-400">Easy Tests</div>
          </div>
          <div className="text-center p-2 sm:p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🟡</div>
            <div className="font-bold text-yellow-400 text-lg sm:text-xl">{stats.mediumTests}</div>
            <div className="text-xs sm:text-sm text-gray-400">Medium Tests</div>
          </div>
          <div className="text-center p-2 sm:p-4 bg-red-400/10 rounded-lg border border-red-400/30">
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔴</div>
            <div className="font-bold text-red-400 text-lg sm:text-xl">{stats.hardTests}</div>
            <div className="text-xs sm:text-sm text-gray-400">Hard Tests</div>
          </div>
        </div>
      </div>

      {/* Keyboard Heatmap */}
      <div className={`${colors.bgSecondary} backdrop-blur-sm rounded-xl p-6 border ${colors.border}`}>
        <h3 className={`text-2xl font-bold ${colors.text} mb-6`}>⌨️ Keyboard Heatmap</h3>
        <p className={`${colors.textSecondary} text-sm mb-6`}>Colors show your accuracy for each key: 🟢 Excellent • 🟡 Good • 🟠 Fair • 🔴 Needs Practice</p>
        
        <div className="flex flex-col items-center space-y-1 sm:space-y-2">
          {/* Top row */}
          <div className="flex space-x-0.5 sm:space-x-1">
            {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(letter => (
              <KeyboardKey key={letter} letter={letter} accuracy={keyboardHeatmap[letter] || 0} />
            ))}
          </div>
          
          {/* Middle row */}
          <div className="flex space-x-0.5 sm:space-x-1">
            {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(letter => (
              <KeyboardKey key={letter} letter={letter} accuracy={keyboardHeatmap[letter] || 0} />
            ))}
          </div>
          
          {/* Bottom row */}
          <div className="flex space-x-0.5 sm:space-x-1">
            {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(letter => (
              <KeyboardKey key={letter} letter={letter} accuracy={keyboardHeatmap[letter] || 0} />
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${colors.bgSecondary} backdrop-blur-sm rounded-xl p-6 border ${colors.border}`}>
          <h3 className={`text-xl font-bold ${colors.text} mb-4`}>📊 Session Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={colors.textSecondary}>Total Time Spent</span>
              <span className={colors.text}>{Math.round(stats.totalTimeSpent / 60)} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className={colors.textSecondary}>Total Errors</span>
              <span className={colors.text}>{stats.totalErrors.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className={colors.textSecondary}>Words per Test</span>
              <span className={colors.text}>{Math.round(stats.totalWordsTyped / stats.totalTests)}</span>
            </div>
            <div className="flex justify-between">
              <span className={colors.textSecondary}>Consistency Score</span>
              <span className={`font-bold ${stats.consistencyScore >= 80 ? 'text-green-400' : stats.consistencyScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {stats.consistencyScore}%
              </span>
            </div>
          </div>
        </div>

        <div className={`${colors.bgSecondary} backdrop-blur-sm rounded-xl p-6 border ${colors.border}`}>
          <h3 className={`text-xl font-bold ${colors.text} mb-4`}>🎯 Goals & Tips</h3>
          <div className="space-y-3 text-sm">
            {stats.averageWPM < 40 && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-blue-400 font-semibold">🎯 Speed Goal</div>
                <div className={colors.textSecondary}>Try to reach 40 WPM for good typing speed!</div>
              </div>
            )}
            {stats.averageAccuracy < 90 && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-green-400 font-semibold">🎯 Accuracy Goal</div>
                <div className={colors.textSecondary}>Focus on accuracy - aim for 90%+ precision!</div>
              </div>
            )}
            {stats.consistencyScore < 70 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="text-yellow-400 font-semibold">🎯 Consistency Goal</div>
                <div className={colors.textSecondary}>Practice regularly to improve consistency!</div>
              </div>
            )}
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="text-purple-400 font-semibold">💡 Pro Tip</div>
              <div className={colors.textSecondary}>Keep your wrists straight and take breaks every 15 minutes! 🐾</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};