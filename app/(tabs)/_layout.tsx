import { Tabs } from 'expo-router';
import { BookUser, MessageSquare } from 'lucide-react-native';

import { Icon } from '@/components/ui/Icon';

export default function TabLayout() {
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
    </Tabs>
  );
}
