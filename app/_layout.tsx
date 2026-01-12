import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { NAV_THEME } from '@/lib/theme';

import '../global.css';

export default function RootLayout() {
  const { colorScheme: theme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <GestureHandlerRootView style={{ flex: 1 }} className={theme}>
        <Stack screenOptions={{ headerShown: false }} />
        <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
