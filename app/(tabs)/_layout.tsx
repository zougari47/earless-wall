import { Tabs, useRouter } from 'expo-router';
import { BookUser, MessageSquare, LogOut } from 'lucide-react-native';
import { Icon } from '@/components/ui/Icon';
import { useAuthContext } from '@/hooks/UseAuthContext';
import { useEffect } from 'react';

export default function TabLayout() {
  const { profile } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!profile) {
      router.push('/(tabs)/complete-profile');
    }
  });

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color, size }) => <Icon as={BookUser} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <Icon as={MessageSquare} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color, size }) => <Icon as={LogOut} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'index',
          tabBarItemStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
        name="complete-profile"
        options={{
          title: 'Complete Profile',
          tabBarStyle: { display: 'none' },
          tabBarItemStyle: {
            display: 'none',
          },
        }}
      />
    </Tabs>
  );
}
