// contexts/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cattype-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Default to dark theme or system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('cattype-theme', newTheme ? 'dark' : 'light');
  };

  const getThemeColors = () => {
    if (isDark) {
      return {
        // Dark theme with purple/pink accents
        primary: 'from-purple-400 via-pink-400 to-rose-400',
        primaryText: 'text-purple-400',
        secondary: 'from-violet-400 to-purple-500',
        secondaryText: 'text-violet-400',
        
        // Background layers
        bg: 'bg-[#141221]',
        bgSecondary: 'bg-gray-800/30 backdrop-blur-md',
        bgTertiary: 'bg-gray-800/60',
        
        // Text colors
        text: 'text-gray-200',
        textSecondary: 'text-gray-400',
        textMuted: 'text-gray-600',
        
        // Interactive elements with purple accents
        button: 'bg-gradient-to-r from-purple-800/50 to-pink-800/50 hover:from-purple-700/60 hover:to-pink-700/60 border border-purple-600/30',
        buttonText: 'text-gray-200',
        
        // Borders with purple tints
        border: 'border-purple-800/40',
        borderSecondary: 'border-purple-700/50',
        
        // Typing feedback colors
        correct: 'text-emerald-400',
        incorrect: 'text-rose-400',
        pending: 'text-gray-600',
        current: 'text-gray-100',
        typed: 'text-gray-300',
        
        // Enhanced cursor with purple glow
        cursor: 'bg-gradient-to-b from-purple-400 to-pink-400',
        cursorShadow: 'shadow-lg shadow-purple-400/50',
      };
    } else {
      return {
        // Light theme with purple/pink accents
        primary: 'from-purple-500 to-pink-500',
        primaryText: 'text-purple-600',
        secondary: 'from-violet-500 to-purple-600',
        secondaryText: 'text-violet-600',
        
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        bgSecondary: 'bg-white/80 backdrop-blur-md border border-purple-200/50',
        bgTertiary: 'bg-purple-100/50',
        
        text: 'text-gray-800',
        textSecondary: 'text-gray-600',
        textMuted: 'text-gray-500',
        
        button: 'bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border border-purple-300/50',
        buttonText: 'text-gray-800',
        
        border: 'border-purple-200/60',
        borderSecondary: 'border-purple-300/70',
        
        correct: 'text-green-600',
        incorrect: 'text-red-600',
        pending: 'text-gray-400',
        current: 'text-gray-900',
        typed: 'text-gray-700',
        
        cursor: 'bg-purple-500',
        cursorShadow: 'shadow-md shadow-purple-400/40',
      };
    }
  };

  const themeData = {
    isDark,
    toggleTheme,
    colors: getThemeColors(),
  };

  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  );
};