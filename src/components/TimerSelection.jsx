
// components/TimerSelection.jsx
import { useTheme } from '../contexts/ThemeContext';

export const TimerSelection = ({ selectedTime, onTimeChange, disabled }) => {
  const { colors } = useTheme();
  const times = [15, 30, 60];
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm font-medium">Timer:</span>
      {times.map(time => (
        <button
          key={time}
          onClick={() => onTimeChange(time)}
          disabled={disabled}
          className={`px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 transform shadow-md text-sm ${
            selectedTime === time 
              ? `bg-gradient-to-r ${colors.primary} text-white shadow-lg scale-105` 
              : `${colors.button} ${colors.buttonText} disabled:opacity-50 hover:shadow-lg`
          }`}
        >
          {time}s
        </button>
      ))}
    </div>
  );
};