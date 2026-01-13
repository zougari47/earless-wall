import { supabase } from '@/lib/supabase';
import React from 'react';
import { Button } from './ui/Button';
import { Text } from './ui/Text';

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
  }
}

export default function SignOutButton() {
  return (
    <Button className="w-full" onPress={onSignOutButtonPress}>
      <Text>Signout</Text>
    </Button>
  );
}
