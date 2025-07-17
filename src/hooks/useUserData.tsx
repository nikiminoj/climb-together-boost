import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  id: string;
  id: string;
  name: string; // Assuming 'name' comes from profiles or auth.users
  points: number; // Assuming 'points' comes from profiles
  rank: number; // Placeholder or fetched from a ranking system
  dailyLimits: {
    // Placeholder for daily limits
    sharing: { used: number; max: number };
    upvoting: { used: number; max: number };
    commenting: { used: number; max: number };
    following: { used: number; max: number };
  };
}

interface UseUserDataResult {
  data: UserData | null;
  data: UserData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const useUserData = (userId: string | null): UseUserDataResult => {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setData(null);
        setIsLoading(false);
        setIsError(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Fetch data from auth.users and profiles table
      const { data: authUserData, error: authError } = await supabase
        .from('auth.users') // Assuming auth.users table
        .select('id')
        .eq('id', userId)
        .single();

      if (authError) {
        setIsError(true);
        setError(authError);
        setData(null);
        setIsLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles') // Assuming profiles table name
        .select('username, points') // Select the columns you need from profiles
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 is "Planned no rows" - handle case where profile doesn't exist yet
        setIsError(true);
        setError(profileError);
        setData(null);
        setIsLoading(false);
        return;
      } else {
        // Combine data from both tables and add placeholders
        const combinedUserData: UserData = {
          id: userId, // Use the provided userId
          name: profileData?.username || authUserData?.id || 'User', // Use username from profile or user ID
          points: profileData?.points || 0, // Use points from profile or default to 0
          rank: 0, // Placeholder rank
          dailyLimits: {
            // Placeholder daily limits
            sharing: { used: 0, max: 5 },
            upvoting: { used: 0, max: 10 },
            commenting: { used: 0, max: 5 },
            following: { used: 0, max: 5 },
          },
        };
        setData(combinedUserData);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [userId]);

  return { data, isLoading, isError, error };
};

export default useUserData;
