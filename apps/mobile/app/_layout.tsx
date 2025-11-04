import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ColorSchemeName, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { NativeWindStyleSheet } from 'nativewind';
import { initializeDatabase } from '../src/db/setup';
import { queryClient } from '../src/services/queryClient';

NativeWindStyleSheet.setOutput({ default: 'native' });

const useAppTheme = (colorScheme: ColorSchemeName) =>
  useMemo(() => {
    if (colorScheme === 'dark') {
      return {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: '#0f172a',
          card: '#111827',
          text: '#f8fafc',
          border: '#1e293b',
          primary: '#22d3ee'
        }
      };
    }
    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: '#f8fafc',
        card: '#e2e8f0',
        text: '#0f172a',
        border: '#cbd5f5',
        primary: '#0891b2'
      }
    };
  }, [colorScheme]);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useAppTheme(colorScheme);
  const [isDbReady, setDbReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await initializeDatabase();
      setDbReady(true);
    };
    prepare();
  }, []);

  if (!isDbReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator color="#22d3ee" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={theme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="reviews/new" options={{ title: 'Add Review', presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

