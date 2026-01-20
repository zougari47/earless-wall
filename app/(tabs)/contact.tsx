import { View, FlatList, TouchableOpacity } from 'react-native';
import { UserPlus } from 'lucide-react-native';

import { useAuthContext } from '@/hooks/UseAuthContext';
import { Text } from '@/components/ui/Text';
import { useKey } from '@/hooks/UseKey';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';

// Dummy contact data for demonstration
const DUMMY_CONTACTS = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
  { id: '4', name: 'David' },
  { id: '5', name: 'Eve' },
  { id: '6', name: 'Frank' },
  { id: '7', name: 'Grace' },
  { id: '8', name: 'Heidi' },
  { id: '9', name: 'Ivan' },
  { id: '10', name: 'Judy' },
];

export default function ContactPage() {
  const { session } = useAuthContext();
  const keyPair = useKey();

  console.log({ keyPair });

  return (
    <View className="flex-1 bg-background p-4">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Contacts</Text>
        <TouchableOpacity onPress={() => console.log('Add Contact')}>
          <Icon as={UserPlus} size={24} className="text-primary" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <Input placeholder="Search" className="mb-4" />

      {/* Contact List */}
      <FlatList
        data={DUMMY_CONTACTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center border-b border-gray-200 py-3 dark:border-gray-700">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-500">
              <Text className="text-lg font-bold text-white">{item.name.charAt(0)}</Text>
            </View>
            <Text className="text-lg text-foreground">{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}
