import SignOutButton from '@/components/Signout';
import { View } from 'react-native';

export default function SettingsPage() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <SignOutButton />
    </View>
  );
}
