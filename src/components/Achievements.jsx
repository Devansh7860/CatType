// components/Achievements.jsx - Cat-themed Achievement System
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  getUserAchievements,
  checkAchievements,
  calculateUserStats,
} from "../services/analyticsService";
import {
  ACHIEVEMENTS,
  RARITY_BACKGROUNDS,
  RARITY_COLORS,
  ACHIEVEMENT_CATEGORIES,
} from "../data/achievements";

export const Achievements = ({ history }) => {
  const { colors } = useTheme();
  const [userAchievements, setUserAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewAchievement, setShowNewAchievement] = useState(null);

  useEffect(() => {
    const achievements = getUserAchievements();
    setUserAchievements(achievements);

    // Check for new achievements
    if (history.length > 0) {
      const userStats = calculateUserStats(history);
      const currentTest = history[0]; // Most recent test
      const newUnlocks = checkAchievements(userStats, currentTest, history);
      if (newUnlocks.length > 0) {
        // Show celebration for newest achievement
        setShowNewAchievement(newUnlocks[newUnlocks.length - 1]);
        setTimeout(() => setShowNewAchievement(null), 5000);
      }
    }
  }, [history]);

  const AchievementCard = ({ achievement, isUnlocked, progress = 0 }) => {
    const rarityColor = RARITY_COLORS[achievement.rarity];
    const rarityBg = RARITY_BACKGROUNDS[achievement.rarity];

    return (
      <div
        className={`
        relative overflow-hidden rounded-xl p-4 sm:p-6 transition-all duration-500 group
        ${
          isUnlocked
            ? `${colors.bgSecondary} border-2 hover:scale-105 shadow-lg hover:shadow-xl ${rarityColor.text}`
            : `bg-gray-800/30 border border-gray-700/50 grayscale hover:grayscale-0`
        }
      `}
        style={{ borderColor: isUnlocked ? rarityColor.border : undefined }}
      >
        {/* Rarity glow effect for unlocked achievements */}
        {isUnlocked && (
          <div
            className={`absolute inset-0 opacity-20 blur-xl ${rarityBg}`}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="text-3xl sm:text-4xl">{achievement.icon}</div>
            <div className="flex flex-col items-end">
              <div
                className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isUnlocked ? `${rarityColor.text} ${rarityBg}` : "text-gray-500 bg-gray-700"
                }`}
              >
                {achievement.rarity}
              </div>
              {isUnlocked && (
                <div className="text-xs text-green-400 mt-1 flex items-center">
                  ✅ Unlocked
                </div>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <h3
            className={`text-lg sm:text-xl font-bold mb-2 ${
              isUnlocked ? colors.text : "text-gray-400"
            }`}
          >
            {achievement.name}
          </h3>
          <p
            className={`text-xs sm:text-sm mb-3 sm:mb-4 ${
              isUnlocked ? colors.textSecondary : "text-gray-500"
            }`}
          >
            {achievement.description}
          </p>

          {/* Progress Bar */}
          {!isUnlocked && progress > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(progress * 100, 100)}%`,
                  backgroundColor: rarityColor.border,
                }}
              />
            </div>
          )}

          {/* Unlock Requirement */}
          <div
            className={`text-xs ${
              isUnlocked ? colors.textMuted : "text-gray-600"
            }`}
          >
            {achievement.requirement}
          </div>
        </div>

        {/* Sparkle effect for legendary achievements */}
        {isUnlocked && achievement.rarity === "legendary" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 right-2 text-yellow-300 animate-pulse">
              ✨
            </div>
            <div
              className="absolute bottom-2 left-2 text-yellow-300 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            >
              ✨
            </div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 animate-pulse"
              style={{ animationDelay: "1s" }}
            >
              ⭐
            </div>
          </div>
        )}
      </div>
    );
  };

  const NewAchievementModal = ({ achievement }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className={`
        ${colors.bgSecondary} rounded-2xl p-8 mx-4 max-w-md w-full
        border-2 shadow-2xl animate-bounce-in
      `}
        style={{ borderColor: RARITY_COLORS[achievement.rarity].border }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{achievement.icon}</div>
          <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
            Achievement Unlocked!
          </h2>
          <h3
            className={`text-xl font-semibold mb-4`}
            style={{ color: RARITY_COLORS[achievement.rarity].text }}
          >
            {achievement.name}
          </h3>
          <p className={`${colors.textSecondary} mb-4`}>
            {achievement.description}
          </p>
          <div
            className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider text-white mx-auto inline-block"
            style={{ backgroundColor: RARITY_COLORS[achievement.rarity].bg }}
          >
            {achievement.rarity}
          </div>
        </div>
      </div>
    </div>
  );

  const getFilteredAchievements = () => {
    const allAchievements = Object.values(ACHIEVEMENTS);
    if (selectedCategory === "all") return allAchievements;
    return allAchievements.filter((ach) => ach.category === selectedCategory);
  };

  const getProgressForAchievement = (achievement) => {
    if (history.length === 0) return 0;

    // Calculate progress based on achievement type
    const latest = history[history.length - 1];
    const stats = {
      totalTests: history.length,
      bestWPM: Math.max(...history.map((h) => h.wpm)),
      bestAccuracy: Math.max(...history.map((h) => h.accuracy)),
      avgWPM: history.reduce((sum, h) => sum + h.wpm, 0) / history.length,
      avgAccuracy:
        history.reduce((sum, h) => sum + h.accuracy, 0) / history.length,
    };

    // Simple progress calculation (this could be more sophisticated)
    switch (achievement.id) {
      case "kitten_speed":
        return latest.wpm / 20;
      case "cat_speed":
        return latest.wpm / 40;
      case "lightning_paws":
        return latest.wpm / 80;
      case "purr_precision":
        return latest.accuracy / 95;
      case "perfect_cat":
        return latest.accuracy / 100;
      case "consistency_king":
        return stats.avgAccuracy / 92;
      case "test_master":
        return stats.totalTests / 100;
      case "speed_demon":
        return stats.bestWPM / 120;
      default:
        return 0;
    }
  };

  const unlockedCount = userAchievements.length;
  const totalCount = Object.keys(ACHIEVEMENTS).length;

  if (history.length === 0) {
    return (
      <div
        className={`text-center py-12 ${colors.bgSecondary} rounded-2xl border ${colors.border}`}
      >
        <div className="text-6xl mb-4">🏆</div>
        <div className={`${colors.textSecondary} text-lg mb-2`}>
          No Achievements Yet
        </div>
        <div className={`${colors.textMuted} text-sm`}>
          Complete some typing tests to start earning cat-themed achievements!
          🐱
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* New Achievement Modal */}
      {showNewAchievement && (
        <NewAchievementModal achievement={showNewAchievement} />
      )}

      {/* Header */}
      <div className="text-center">
        <h2
          className={`text-4xl font-bold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent mb-4`}
        >
          🏆 Cat Achievements 🐾
        </h2>
        <p className={`${colors.textSecondary} text-lg mb-6`}>
          Collect all the cat-themed achievements by improving your typing
          skills! 🎯
        </p>

        {/* Progress Overview */}
        <div
          className={`${colors.bgSecondary} rounded-xl p-4 inline-block border ${colors.border}`}
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">📊</div>
            <div>
              <div className={`text-2xl font-bold ${colors.text}`}>
                {unlockedCount}/{totalCount}
              </div>
              <div className={`text-sm ${colors.textSecondary}`}>
                Achievements Unlocked
              </div>
            </div>
            <div className="w-32 bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
            <div className={`text-lg font-bold ${colors.primaryText}`}>
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === "all"
              ? `${colors.primaryBg} ${colors.primaryText}`
              : `${colors.bgSecondary} ${colors.textSecondary} hover:${colors.textPrimary}`
          }`}
        >
          All ({totalCount})
        </button>
        {Object.keys(ACHIEVEMENT_CATEGORIES).filter(key => key !== 'all').map((category) => {
          const count = Object.values(ACHIEVEMENTS).filter(
            (a) => a.category === category
          ).length;
          const unlockedInCategory = userAchievements.filter(
            (a) => ACHIEVEMENTS[a] && ACHIEVEMENTS[a].category === category
          ).length;

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all capitalize ${
                selectedCategory === category
                  ? `${colors.primaryBg} ${colors.primaryText}`
                  : `${colors.bgSecondary} ${colors.textSecondary} hover:${colors.textPrimary}`
              }`}
            >
              {ACHIEVEMENT_CATEGORIES[category].name} ({unlockedInCategory}/{count})
            </button>
          );
        })}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {getFilteredAchievements().map((achievement) => {
          const isUnlocked = userAchievements.includes(achievement.id);
          const progress = getProgressForAchievement(achievement);

          return (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={isUnlocked}
              progress={progress}
            />
          );
        })}
      </div>

      {/* Rarity Legend */}
      <div
        className={`${colors.bgSecondary} rounded-xl p-6 border ${colors.border}`}
      >
        <h3 className={`text-xl font-bold ${colors.text} mb-4`}>
          🌟 Achievement Rarity Guide
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(RARITY_COLORS).map(([rarity, colors]) => (
            <div key={rarity} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                }}
              />
              <span
                className={`capitalize font-medium ${colors.text}`}
                style={{ color: colors.text }}
              >
                {rarity}
              </span>
            </div>
          ))}
        </div>
        <p className={`text-sm ${colors.textMuted} mt-4`}>
          💎 Legendary achievements are the rarest and hardest to unlock! Keep
          typing to collect them all! 🐾
        </p>
      </div>
    </div>
  );
};
