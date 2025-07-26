
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/integrations/drizzle/client';
import { Category } from '@/types/database';

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export default useCategories;
