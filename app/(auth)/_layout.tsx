import { Stack, Redirect } from 'expo-router';
import { View } from 'react-native';
import { useAuthContext } from '@/hooks/UseAuthContext';

export default function AuthLayout() {
  const { isLoggedIn } = useAuthContext();

  // If already authenticated, redirect to protected area
  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
        <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      </Stack>
    </View>
  );
}
