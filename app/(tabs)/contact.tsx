import { View } from 'react-native';

import { useAuthContext } from '@/hooks/UseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import SignOut from '@/components/Signout';
import { useKey } from '@/hooks/UseKey';

export default function ContactPage() {
  const { session } = useAuthContext();
  const keyPair = useKey();

  console.log({ keyPair });

  // Show welcome message for authenticated users
  return (
    <View className="flex-1 bg-background">
      <Card className="m-4">
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <CardTitle className="text-xl">Welcome!</CardTitle>
          </View>
          <CardDescription>{`Welcome, ${session?.user?.email}!`}</CardDescription>
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
