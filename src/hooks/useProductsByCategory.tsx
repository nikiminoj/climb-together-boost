
import { useQuery } from '@tanstack/react-query';
import { getProductsByCategory } from '@/integrations/drizzle/client';
import { Product } from '@/types/database';

interface ProductFilters {
  isPromoted?: boolean;
  publishedDateRange?: 'today' | 'this-week' | 'this-month' | 'previous-month';
}

export const useProductsByCategory = (categoryId: string | undefined, filters?: ProductFilters) => {
  return useQuery<Product[], Error>({
    queryKey: ['products', categoryId, filters],
    queryFn: () => categoryId ? getProductsByCategory(categoryId, filters) : Promise.resolve([]),
    enabled: !!categoryId,
  });
};
