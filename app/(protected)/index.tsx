import { useAuthContext } from '@/hooks/UseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import SignOut from '@/components/Signout';
import { View } from 'react-native';

export default function ProtectedHome() {
  const { session, profile, isLoading } = useAuthContext();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  // Show welcome message for authenticated users
  return (
    <View className="flex-1 bg-background">
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-xl">Welcome!</CardTitle>
          <CardDescription>
            {profile
              ? `Hello, ${profile.full_name || session?.user?.email}!`
              : `Welcome, ${session?.user?.email}!`}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="mb-6">
            <Text className="text-muted-foreground">
              You are now signed in and can start using the encrypted chat features.
            </Text>
          </View>

          <SignOut />
        </CardContent>
      </Card>
    </View>
  );
}
