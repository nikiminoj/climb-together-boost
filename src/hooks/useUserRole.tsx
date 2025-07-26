
import { useQuery } from '@tanstack/react-query';
import { getUserRole } from '@/integrations/drizzle/client';
import { useAuth } from './useAuth';

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_role', user?.id],
    queryFn: () => user?.id ? getUserRole(user.id) : Promise.resolve('user'),
    enabled: !!user?.id,
  });
};
