
import { useState, useEffect } from 'react';
import { getUserProfile } from '@/integrations/drizzle/client';

interface UserData {
  id: string;
  name: string;
  points: number;
  rank: number;
  dailyLimits: {
    sharing: { used: number; max: number };
    upvoting: { used: number; max: number };
    commenting: { used: number; max: number };
    following: { used: number; max: number };
  };
}

interface UseUserDataResult {
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

      try {
        const profileData = await getUserProfile(userId);

        const combinedUserData: UserData = {
          id: userId,
          name: profileData?.username || 'User',
          points: 0,
          rank: 0,
          dailyLimits: {
            sharing: { used: 0, max: 5 },
            upvoting: { used: 0, max: 10 },
            commenting: { used: 0, max: 5 },
            following: { used: 0, max: 5 },
          },
        };
        setData(combinedUserData);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
        setData(null);
      }
      
      setIsLoading(false);
    };

    fetchUserData();
  }, [userId]);

  return { data, isLoading, isError, error };
};

export default useUserData;
