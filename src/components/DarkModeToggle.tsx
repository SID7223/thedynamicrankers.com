import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Fade out when scrolled more than 2 screen heights
      if (scrollY > windowHeight * 2) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div 
      className={`fixed top-20 right-6 z-40 transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <button
        onClick={toggleDarkMode}
        className={`
          relative w-16 h-8 rounded-full p-1 transition-all duration-300 ease-out
          ${isDark 
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25'
          }
          hover:scale-110 hover:shadow-xl active:scale-95
          backdrop-blur-lg border border-white/20
        `}
        aria-label="Toggle dark mode"
      >
        <div
          className={`
            absolute top-1 w-6 h-6 bg-white rounded-full shadow-md
            flex items-center justify-center transition-all duration-300 ease-out
            ${isDark ? 'translate-x-8' : 'translate-x-0'}
          `}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-purple-600" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-500" />
          )}
        </div>
      </button>
    </div>
  );
};

export default DarkModeToggle;
