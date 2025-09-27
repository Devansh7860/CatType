// components/ProgressBar.jsx
import { useTheme } from '../contexts/ThemeContext';

export const ProgressBar = ({ currentWordIndex, totalWords, isActive }) => {
  const { colors } = useTheme();
  const progress = totalWords > 0 ? (currentWordIndex / totalWords) * 100 : 0;
  
  if (!isActive || totalWords === 0) return null;
  
  return (
    <div className={`w-full mb-6 ${colors.bgSecondary} rounded-full p-1 border ${colors.border}`}>
      <div 
        className={`h-2 bg-gradient-to-r ${colors.primary} rounded-full transition-all duration-300 ease-out relative overflow-hidden`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
      <div className={`text-xs ${colors.textSecondary} text-center mt-2 flex items-center justify-center gap-2`}>
        <span>🐾</span>
        <span>{Math.round(progress)}% complete</span>
        <span>🐾</span>
      </div>
    </div>
  );
};