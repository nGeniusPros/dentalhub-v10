import React, { useEffect } from 'react';
import { useTheme } from '../../hooks/use-theme';

/**
 * ThemeInitializer component
 * This component ensures that the theme is properly initialized on application startup
 * It adds appropriate classes to the document element based on the current theme
 */
export const ThemeInitializer: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Remove any existing theme classes
    document.documentElement.classList.remove('light', 'dark');
    
    // Add the current theme class
    document.documentElement.classList.add(theme);
    
    // Add custom color properties based on theme
    document.documentElement.style.setProperty('--primary-color', theme === 'dark' ? '#4BC5BD' : '#1B2B5B');
    document.documentElement.style.setProperty('--secondary-color', theme === 'dark' ? '#A992CC' : '#C5A572');
    document.documentElement.style.setProperty('--accent-color', theme === 'dark' ? '#95D5BE' : '#7D9BB9');
    document.documentElement.style.setProperty('--background-color', theme === 'dark' ? '#121212' : '#FFFFFF');
    document.documentElement.style.setProperty('--card-shadow', theme === 'dark' ? '0 0 20px rgba(0, 0, 0, 0.4)' : '0 0 20px rgba(27, 43, 91, 0.1)');
  }, [theme]);

  return null; // This component doesn't render anything
};
