import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Default to light for premium light-purple focus
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    console.log('Theme toggle triggered. Current theme state:', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      console.log('Added dark class. documentElement classes:', root.classList.toString());
    } else {
      root.classList.remove('dark');
      console.log('Removed dark class. documentElement classes:', root.classList.toString());
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
