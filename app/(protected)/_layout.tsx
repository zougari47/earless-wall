import { Redirect, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import AuthProvider from '@/providers/AuthProvider';
import { useAuthContext } from '@/hooks/UseAuthContext';

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuthContext();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isLoggedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
      </Stack>
      {children}
    </View>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </AuthProvider>
  );
}
