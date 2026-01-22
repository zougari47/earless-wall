import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Text } from '@/components/ui/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { AlertCircleIcon } from 'lucide-react-native';
import { useAuthContext } from '@/hooks/UseAuthContext';
import SignOutButton from '@/components/Signout';
import { useEffect } from 'react';

const completeProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

export default function CompleteProfile() {
  const { session, profile: currentProfile } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (currentProfile) {
      router.push('/(tabs)/contact');
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      username: currentProfile?.username || '',
      name: currentProfile?.name || '',
    },
  });

  const onSubmit = handleSubmit(async (data: CompleteProfileFormData) => {
    if (!session?.user) return;

    try {
      setIsLoading(true);
      setError(null);

      const updates = {
        id: session.user.id,
        username: data.username,
        name: data.name,
        onboarding_completed: true,
      };

      const { error: upsertError } = await supabase.from('profiles').upsert(updates);

      if (upsertError) {
        throw upsertError;
      }

      // Refresh the page or navigate (the auth provider should pick up the change)
      // We can force navigation to index
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'An error occurred updating your profile.');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <View className="flex h-screen w-screen justify-center gap-4 bg-background p-4">
      <SignOutButton />
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Please choose a username and display name to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          {error && (
            <Alert icon={AlertCircleIcon} variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <View className="gap-4">
            <View className="gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="username"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="cooluser123"
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.username && (
                <Text className="text-sm text-destructive">{errors.username.message}</Text>
              )}
            </View>

            <View className="gap-1.5">
              <Label htmlFor="name">Display Name</Label>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="John Doe"
                    autoCapitalize="words"
                    onSubmitEditing={onSubmit}
                  />
                )}
              />
              {errors.name && (
                <Text className="text-sm text-destructive">{errors.name.message}</Text>
              )}
            </View>

            <Button className="mt-2 w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Saving...' : 'Save & Continue'}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
