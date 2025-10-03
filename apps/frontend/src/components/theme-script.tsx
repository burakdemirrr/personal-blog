'use client';

import { useEffect } from 'react';

export function ThemeScript() {
  useEffect(() => {
    // This runs only on the client side after hydration
    const theme = localStorage.getItem('theme') || 'system';
    
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return null;
}