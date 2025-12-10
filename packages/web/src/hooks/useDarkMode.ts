import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Check localStorage for saved preference
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      setIsDark(saved === 'dark');
      return;
    }

    // 2. Fallback to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    // Apply dark class to <html> element
    if (isDark === null) return;
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  };

  return { isDark, toggle };
}
