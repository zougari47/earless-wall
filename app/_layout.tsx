import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { NAV_THEME } from '@/lib/theme';

import '../global.css';
import { useAuthContext } from '@/hooks/UseAuthContext';
import AuthProvider from '@/providers/AuthProvider';
import { SplashScreenController } from '@/components/SplashScreenController';
import QueryProvider from '@/providers/QueryProvider';

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn } = useAuthContext();

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const { colorScheme: theme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme('dark');
  }, []);

  return (
    <ThemeProvider value={NAV_THEME[theme ?? 'dark']}>
      <QueryProvider>
        <AuthProvider>
          <SplashScreenController />
          <RootNavigator />
          <StatusBar style="auto" />
          <PortalHost />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
