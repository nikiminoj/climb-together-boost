
import { useQuery } from '@tanstack/react-query';
import { getUserBadges } from '@/integrations/drizzle/client';

export const useUserBadges = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user_badges', userId],
    queryFn: () => (userId ? getUserBadges(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};
