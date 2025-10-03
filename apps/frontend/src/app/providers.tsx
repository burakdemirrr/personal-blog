"use client";

import React, { memo, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from '@/store/store';
import { api } from '@/services/api';
import { JSX } from 'react';

type ProvidersProps = {
  children: React.ReactNode;
};

// Memoized theme provider wrapper
const OptimizedThemeProvider = memo(({ children }: { children: React.ReactNode }) => (
  <ThemeProvider 
    attribute="class" 
    defaultTheme="system" 
    enableSystem
    disableTransitionOnChange={false}
    storageKey="theme"
    enableColorScheme={false}
  >
    {children}
  </ThemeProvider>
));

OptimizedThemeProvider.displayName = 'OptimizedThemeProvider';

// Component to prefetch data on mount
const DataPrefetcher = memo(({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Prefetch posts data immediately on mount for faster navigation
    store.dispatch(api.util.prefetch('getPublishedPosts', undefined, { force: false }));
  }, []);

  return <>{children}</>;
});

DataPrefetcher.displayName = 'DataPrefetcher';

export const Providers = ({ children }: ProvidersProps): JSX.Element => {
  return (
    <OptimizedThemeProvider>
      <Provider store={store}>
        <DataPrefetcher>
          {children}
        </DataPrefetcher>
      </Provider>
    </OptimizedThemeProvider>
  );
};
