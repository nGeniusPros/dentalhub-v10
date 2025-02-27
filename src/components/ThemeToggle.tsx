import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from './ui/icon-strategy';
import { useTheme } from '../hooks/use-theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Icon name="Moon" className="w-5 h-5 text-gray-800" />
      ) : (
        <Icon name="Sun" className="w-5 h-5 text-white" />
      )}
    </motion.button>
  );
}