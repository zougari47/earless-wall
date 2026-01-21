import { View, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from '@/hooks/UseAuthContext';
import { Text } from '@/components/ui/Text';
import { useKey } from '@/hooks/UseKey';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { AddContactDialog } from '@/components/AddContactDialog';

type Contact = {
  id: string;
  created_at: string;
  friend_id: string;
  user_id: string;
  status: string;
  friend: {
    id: string;
    name: string;
    username: string;
  } | null;
};

export default function ContactPage() {
  const { session } = useAuthContext();
  const keyPair = useKey();

  const {
    data: contacts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contacts', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('No user session');

      const { data, error } = await supabase
        .from('contacts')
        .select(
          `
          *,
          receiver:profiles!friend_id(*),
          sender:profiles!user_id(*)
        `
        )
        .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`);

      if (error) throw error;

      return data.map((contact) => {
        // Determine which profile is the "friend" (the one that isn't the current user)
        const isSender = contact.user_id === session.user.id;
        // @ts-ignore - Supabase types are complex with joins
        const friendProfile = isSender ? contact.receiver : contact.sender;

        return {
          ...contact,
          friend: friendProfile,
        };
      }) as Contact[];
    },
    enabled: !!session?.user?.id,
  });

  console.log({ keyPair });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="mb-2 text-destructive">Error loading contacts</Text>
        <Text className="text-center text-muted-foreground">{(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Contacts</Text>
        <AddContactDialog />
      </View>

      {/* Search Bar */}
      <Input placeholder="Search" className="mb-4" />

      {/* Contact List */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center border-b border-gray-200 py-3 dark:border-gray-700">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-500">
              <Text className="text-lg font-bold text-white">
                {item.friend?.name?.charAt(0) || '?'}
              </Text>
            </View>
            <View>
              <Text className="text-lg text-foreground">
                {item.friend?.name || 'Unknown Contact'}
              </Text>
              {item.friend?.username && (
                <Text className="text-sm text-muted-foreground">@{item.friend.username}</Text>
              )}
              <Text className="text-xs capitalize text-muted-foreground">{item.status}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center pt-8">
            <Text className="text-muted-foreground">No contacts found</Text>
          </View>
        }
      />
    </View>
  );
}
