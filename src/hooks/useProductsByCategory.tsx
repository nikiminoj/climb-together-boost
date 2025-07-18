
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfToday, startOfWeek, startOfMonth, subMonths, formatISO } from 'date-fns';
import { Product } from '@/types/database';

interface ProductFilters {
  isPromoted?: boolean;
  publishedDateRange?: 'today' | 'this-week' | 'this-month' | 'previous-month';
}

const fetchProductsByCategory = async (categoryId: string | undefined, filters?: ProductFilters) => {
  if (!categoryId) {
    return [];
  }

  let query = supabase
    .from('products')
    .select('*')
    .eq('category', categoryId); // Using category field instead of category_id

  // Apply filters if provided
  if (filters?.isPromoted) {
    // Assuming promoted products have specific badges
    query = query.contains('badges', ['Trending', 'Product of the Day', 'Hot']);
  }

  if (filters?.publishedDateRange) {
    const now = new Date();
    let startDate: Date;

    switch (filters.publishedDateRange) {
      case 'today':
        startDate = startOfToday();
        break;
      case 'this-week':
        startDate = startOfWeek(now);
        break;
      case 'this-month':
        startDate = startOfMonth(now);
        break;
      case 'previous-month':
        startDate = startOfMonth(subMonths(now, 1));
        const endDate = startOfMonth(now);
        query = query.gte('created_at', formatISO(startDate)).lt('created_at', formatISO(endDate));
        break;
    }

    if (filters.publishedDateRange !== 'previous-month') {
      query = query.gte('created_at', formatISO(startDate));
    }
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
};

export const useProductsByCategory = (categoryId: string | undefined, filters?: ProductFilters) => {
  return useQuery<Product[], Error>({
    queryKey: ['products', categoryId, filters],
    queryFn: () => fetchProductsByCategory(categoryId, filters),
    enabled: !!categoryId,
  });
};
