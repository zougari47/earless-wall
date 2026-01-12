import { SignUpForm } from '@/components/SignUpForm';
import { Stack, Link } from 'expo-router';

import { Text, View } from 'react-native';

export default function Home() {
  return (
    <View className={styles.container}>
      <SignUpForm />
    </View>
  );
}

const styles = {
  container: 'flex flex-1 bg-background',
};
