// components/ControlBar.jsx - Sleek unified control bar
import { useTheme } from '../contexts/ThemeContext';
import { getDifficultyLevels } from '../services/textService';

export const ControlBar = ({ 
  selectedTime, 
  onTimeChange, 
  selectedDifficulty, 
  onDifficultyChange, 
  disabled 
}) => {
  const { colors } = useTheme();
  const times = [15, 30, 60];
  const difficulties = getDifficultyLevels();
  
  return (
    <div className="flex justify-center mb-6 sm:mb-8 px-2">
      <div className="flex flex-col sm:flex-row items-center bg-gray-900/60 backdrop-blur-xl rounded-2xl sm:rounded-full p-3 sm:p-2 border border-gray-700/50 shadow-2xl gap-3 sm:gap-0">
        
        {/* Timer Section */}
        <div className="flex items-center gap-1 px-2 sm:px-4 py-1">
          <div className="flex items-center gap-2 mr-2 sm:mr-3">
            <span className="text-pink-400 text-sm">⏱</span>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">time</span>
          </div>
          <div className="flex gap-1">
            {times.map((time, index) => (
              <button
                key={time}
                onClick={() => onTimeChange(time)}
                disabled={disabled}
                className={`
                  px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ease-out
                  ${selectedTime === time 
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                `}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px sm:h-8 w-8 sm:w-px bg-gray-600/50 mx-0 sm:mx-2"></div>

        {/* Difficulty Section */}
        <div className="flex items-center gap-1 px-2 sm:px-4 py-1">
          <div className="flex items-center gap-2 mr-2 sm:mr-3">
            <span className="text-purple-400 text-sm">⚡</span>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">words</span>
          </div>
          <div className="flex gap-1">
            {difficulties.map((difficulty, index) => (
              <button
                key={difficulty.id}
                onClick={() => onDifficultyChange(difficulty.id)}
                disabled={disabled}
                className={`
                  px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ease-out
                  ${selectedDifficulty === difficulty.id 
                    ? `${difficulty.color === 'text-green-400' ? 'bg-green-500' : 
                         difficulty.color === 'text-yellow-400' ? 'bg-yellow-500' : 'bg-red-500'} 
                       text-white shadow-lg scale-105` +
                      `${difficulty.id === 'easy' ? ' shadow-green-500/30' : 
                         difficulty.id === 'medium' ? ' shadow-yellow-500/30' : ' shadow-red-500/30'}`
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                `}
                title={difficulty.description}
              >
                {difficulty.name.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};