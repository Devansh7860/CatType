// components/TimerDisplay.jsx
import { useTheme } from '../contexts/ThemeContext';

export const TimerDisplay = ({ timeLeft, isActive }) => {
  const { theme, colors } = useTheme();
  
  return (
    <div className="text-center mb-8">
      <div className={`inline-flex items-center gap-3 text-5xl font-mono transition-all duration-200 ${
        timeLeft <= 5 && isActive ? 'text-red-400 animate-pulse scale-110' : colors.primaryText
      }`}>
        <span className="tabular-nums tracking-wider">{String(timeLeft).padStart(2, '0')}</span>
        <span className="text-2xl">🕐</span>
      </div>
      {isActive && (
        <div className={`text-sm ${colors.textSecondary} mt-2 flex items-center justify-center gap-2 font-medium`}>
          <span className="text-base">🐾</span>
          <span>Keep typing...</span>
          <span className="text-base">🐾</span>
        </div>
      )}
    </div>
  );
};