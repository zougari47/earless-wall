import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Search } from 'lucide-react-native';

// Dummy chat data for demonstration
const DUMMY_CHATS = [
  { id: '1', name: 'Alice', lastMessage: 'See you tomorrow!', timestamp: '10:42 AM' },
  { id: '2', name: 'Bob', lastMessage: 'Okay, sounds good.', timestamp: '9:30 AM' },
  { id: '3', name: 'Charlie', lastMessage: 'Can you send me the file?', timestamp: 'Yesterday' },
  { id: '4', name: 'David', lastMessage: 'Haha, that\'s funny.', timestamp: 'Yesterday' },
  { id: '5', name: 'Eve', lastMessage: 'Project update is ready.', timestamp: '1/15/2026' },
];

export default function ChatPage() {
  return (
    <View className="flex-1 bg-background pt-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4 px-4">
        <Text className="text-2xl font-bold text-foreground">Chats</Text>
        <TouchableOpacity onPress={() => console.log('Search')}>
          <Icon as={Search} size={22} className="text-foreground" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={DUMMY_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View className="flex-row items-center py-3 px-4 border-b border-gray-200 dark:border-gray-800">
              {/* Avatar */}
              <View className="w-12 h-12 rounded-full bg-green-500 items-center justify-center mr-4">
                <Text className="text-white text-xl font-bold">{item.name.charAt(0)}</Text>
              </View>
              {/* Chat Info */}
              <View className="flex-1">
                <Text className="text-foreground text-lg font-semibold">{item.name}</Text>
                <Text className="text-muted-foreground" numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              {/* Timestamp */}
              <Text className="text-muted-foreground text-xs">{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
