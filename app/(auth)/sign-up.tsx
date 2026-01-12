import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { Text } from '@/components/ui/Text';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { AlertCircleIcon } from 'lucide-react-native';

const signUpSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  const onSubmit = handleSubmit(async (data: SignUpFormData) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        // Alert.alert('Error', error.message);
      } else {
        // Alert.alert(
        //   'Success!',
        //   'Account created successfully. Please check your email to verify your account.',
        //   [{ text: 'OK' }]
        // );
      }
    } catch {
      // Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <View className="flex h-screen w-screen bg-background">
      <Card className=" m-auto w-11/12 max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Create your account</CardTitle>
          <CardDescription className="text-center">
            Welcome! Please fill in details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="m@example.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    onSubmitEditing={onEmailSubmitEditing}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                )}
              />
              {errors.email && (
                <Text className="text-sm text-destructive">{errors.email.message}</Text>
              )}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
              </View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    returnKeyType="send"
                    onSubmitEditing={onSubmit}
                  />
                )}
              />
              {errors.password && (
                <Text className="text-sm text-destructive">{errors.password.message}</Text>
              )}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Creating Account...' : 'Continue'}</Text>
            </Button>
          </View>
          <Text className="block py-4 text-center text-sm">
            Already have an account?{' '}
            <Pressable
              onPress={() => {
                router.push('/sign-in' as any);
              }}>
              <Text className="text-sm underline underline-offset-4">Sign in</Text>
            </Pressable>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="px-4 text-sm text-muted-foreground">or</Text>
            <Separator className="flex-1" />
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
