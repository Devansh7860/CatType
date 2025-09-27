// components/DifficultySelector.jsx
import { useTheme } from '../contexts/ThemeContext';
import { getDifficultyLevels } from '../services/textService';

export const DifficultySelector = ({ selectedDifficulty, onDifficultyChange, disabled }) => {
  const { colors } = useTheme();
  const difficulties = getDifficultyLevels();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm font-medium">Difficulty:</span>
      {difficulties.map(difficulty => (
        <button
          key={difficulty.id}
          onClick={() => onDifficultyChange(difficulty.id)}
          disabled={disabled}
          className={`px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 transform text-sm ${
            selectedDifficulty === difficulty.id 
              ? `${difficulty.bgColor} ${difficulty.color} ${difficulty.borderColor} border scale-105 shadow-lg` 
              : `text-gray-400 hover:text-gray-200 disabled:opacity-50 hover:bg-gray-700/50`
          }`}
          title={difficulty.description}
        >
          {difficulty.name}
        </button>
      ))}
    </div>
  );
};