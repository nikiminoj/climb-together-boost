import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfToday, startOfWeek, startOfMonth, subMonths, formatISO } from 'date-fns';
import { Product } from '@/types/database';

const fetchProductsByCategory = async (categoryId: string | undefined) => {
  if (!categoryId) {
    return [];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId); // Assuming a 'category_id' column links products to categories

  if (error) {
    throw error;
  }

  return data;
};

export const useProductsByCategory = (categoryId: string | undefined) => {
  return useQuery<Product[], Error>({
    queryKey: ['products', categoryId],
    queryFn: () => fetchProductsByCategory(categoryId),
    enabled: !!categoryId, // Only run the query if categoryId is provided
  });
};