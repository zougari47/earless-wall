import { useState } from 'react';
import { View, TouchableOpacity, Alert as RNAlert } from 'react-native';
import { UserPlus, AlertCircle } from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthContext } from '@/hooks/UseAuthContext';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export function AddContactDialog() {
  const { session } = useAuthContext();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState('');

  const addContactMutation = useMutation({
    mutationFn: async (targetUsername: string) => {
      if (!session?.user?.id) throw new Error('No user session');

      // 1. Find user by username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', targetUsername)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          throw new Error('There is no user with that username');
        }
        throw profileError;
      }

      if (!profile) {
        throw new Error('There is no user with that username');
      }

      if (profile.id === session.user.id) {
        throw new Error('You cannot add yourself');
      }

      // 2. Create contact relationship
      const { error: contactError } = await supabase.from('contacts').insert({
        user_id: session.user.id,
        friend_id: profile.id,
        status: 'pending',
      });

      if (contactError) {
        if (contactError.code === '23505') {
          // Unique violation
          throw new Error('Contact already added');
        }
        throw contactError;
      }

      return profile.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', session?.user?.id] });
      setIsDialogOpen(false);
      setUsername('');
      RNAlert.alert('Success', 'Contact request sent');
    },
    onError: (error) => {
      // Error handled in UI
    },
  });

  const handleAddContact = () => {
    if (!username.trim()) return;
    addContactMutation.mutate(username.trim());
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <TouchableOpacity>
          <Icon as={UserPlus} size={24} className="text-primary" />
        </TouchableOpacity>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
          <DialogDescription>Enter the username of the person you want to add.</DialogDescription>
        </DialogHeader>
        <View className="grid gap-4 py-4">
          <View className="grid gap-2">
            <Label nativeID="username">Username</Label>
            <Input
              nativeID="username"
              placeholder="@username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                addContactMutation.reset();
              }}
              autoCapitalize="none"
            />
          </View>
          {addContactMutation.isError && (
            <Alert variant="destructive" icon={AlertCircle}>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{addContactMutation.error.message}</AlertDescription>
            </Alert>
          )}
        </View>
        <DialogFooter>
          <Button onPress={handleAddContact} disabled={addContactMutation.isPending}>
            <Text>{addContactMutation.isPending ? 'Adding...' : 'Add Contact'}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
