
import { useQuery } from '@tanstack/react-query';
<<<<<<< Updated upstream
import { getUserBadges } from '@/integrations/drizzle/client';
=======
import { getUserBadges } from '@/integrations/supabase/client';
>>>>>>> Stashed changes

export const useUserBadges = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user_badges', userId],
    queryFn: () => (userId ? getUserBadges(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};
