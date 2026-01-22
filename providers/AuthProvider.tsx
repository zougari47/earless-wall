import { AuthContext } from '@/hooks/UseAuthContext';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | undefined | null>();
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      setIsSessionLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
      }

      setSession(session);
      setIsSessionLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { event: _event, session });
      setSession(session);
      setIsSessionLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;

      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id);
      if (error) {
        console.error('Error fetching profile:', error);
      }

      console.log('this is from auth privder', 'the result is ', data);

      // Return data or null (useQuery will treat undefined as "no data" but we want explicit null if not found)
      return data?.[0] || null;
    },
    enabled: !!session?.user?.id,
  });

  const isLoading = isSessionLoading || (!!session?.user && isProfileLoading);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        profile,
        isLoggedIn: !!session,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
