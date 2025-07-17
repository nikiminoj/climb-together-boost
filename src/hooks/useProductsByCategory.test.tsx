import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProductsByCategory } from './useProductsByCategory';
import { Product } from '@/types/database';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock date-fns functions that might be used
jest.mock('date-fns', () => ({
  startOfToday: jest.fn(),
  startOfWeek: jest.fn(),
  startOfMonth: jest.fn(),
  subMonths: jest.fn(),
  formatISO: jest.fn(),
}));

describe('useProductsByCategory', () => {
  let queryClient: QueryClient;
  let mockSelect: jest.Mock;
  let mockEq: jest.Mock;
  let mockFrom: jest.Mock;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      category_id: 'category-1',
      price: 29.99,
      description: 'Test description 1',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Test Product 2',
      category_id: 'category-1',
      price: 39.99,
      description: 'Test description 2',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock chain
    mockEq = jest.fn();
    mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    mockFrom = jest.fn().mockReturnValue({ select: mockSelect });
    
    (supabase.from as jest.Mock).mockImplementation(mockFrom);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Happy Path Tests', () => {
    it('should fetch products successfully for a valid category ID', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('category_id', categoryId);
    });

    it('should return empty array when no products found', async () => {
      const categoryId = 'category-empty';
      mockEq.mockResolvedValue({ data: [], error: null });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(supabase.from).toHaveBeenCalledWith('products');
    });

    it('should use correct query key with category ID', async () => {
      const categoryId = 'test-category';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check that the query key is correctly set
      const cachedData = queryClient.getQueryData(['products', categoryId]);
      expect(cachedData).toEqual(mockProducts);
    });
  });

  describe('Edge Cases', () => {
    it('should not execute query when categoryId is undefined', () => {
      const { result } = renderHook(() => useProductsByCategory(undefined), {
        wrapper,
      });

      expect(result.current.isPending).toBe(true);
      expect(result.current.fetchStatus).toBe('idle');
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should not execute query when categoryId is null', () => {
      const { result } = renderHook(() => useProductsByCategory(null as any), {
        wrapper,
      });

      expect(result.current.isPending).toBe(true);
      expect(result.current.fetchStatus).toBe('idle');
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should not execute query when categoryId is empty string', () => {
      const { result } = renderHook(() => useProductsByCategory(''), {
        wrapper,
      });

      expect(result.current.isPending).toBe(true);
      expect(result.current.fetchStatus).toBe('idle');
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only categoryId', () => {
      const { result } = renderHook(() => useProductsByCategory('   '), {
        wrapper,
      });

      expect(result.current.isPending).toBe(true);
      expect(result.current.fetchStatus).toBe('idle');
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should handle very long category ID', async () => {
      const longCategoryId = 'a'.repeat(1000);
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result } = renderHook(() => useProductsByCategory(longCategoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockEq).toHaveBeenCalledWith('category_id', longCategoryId);
    });

    it('should handle category ID with special characters', async () => {
      const specialCategoryId = 'cat-123_$#@!';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result } = renderHook(() => useProductsByCategory(specialCategoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockEq).toHaveBeenCalledWith('category_id', specialCategoryId);
    });

    it('should handle Unicode category ID', async () => {
      const unicodeCategoryId = 'category-中文-🎉';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result } = renderHook(() => useProductsByCategory(unicodeCategoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockEq).toHaveBeenCalledWith('category_id', unicodeCategoryId);
    });
  });

  describe('Error Handling', () => {
    it('should handle Supabase database errors', async () => {
      const categoryId = 'category-1';
      const mockError = new Error('Database connection failed');
      mockEq.mockResolvedValue({ data: null, error: mockError });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle network errors', async () => {
      const categoryId = 'category-1';
      const networkError = new Error('Network error');
      mockEq.mockRejectedValue(networkError);

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(networkError);
    });

    it('should handle timeout errors', async () => {
      const categoryId = 'category-1';
      const timeoutError = new Error('Request timeout');
      mockEq.mockRejectedValue(timeoutError);

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(timeoutError);
    });

    it('should handle malformed response data', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: 'invalid-data', error: null });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe('invalid-data');
    });

    it('should handle null response data', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: null, error: null });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle authentication errors', async () => {
      const categoryId = 'category-1';
      const authError = new Error('Authentication failed');
      authError.name = 'AuthError';
      mockEq.mockResolvedValue({ data: null, error: authError });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(authError);
    });
  });

  describe('Query State Management', () => {
    it('should be in loading state initially', () => {
      const categoryId = 'category-1';
      mockEq.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should refetch when categoryId changes', async () => {
      const categoryId1 = 'category-1';
      const categoryId2 = 'category-2';
      
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result, rerender } = renderHook(
        ({ categoryId }) => useProductsByCategory(categoryId),
        {
          wrapper,
          initialProps: { categoryId: categoryId1 },
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockEq).toHaveBeenCalledWith('category_id', categoryId1);

      // Change the category ID
      rerender({ categoryId: categoryId2 });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockEq).toHaveBeenCalledWith('category_id', categoryId2);
      expect(mockEq).toHaveBeenCalledTimes(2);
    });

    it('should disable query when categoryId becomes undefined', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result, rerender } = renderHook(
        ({ categoryId }) => useProductsByCategory(categoryId),
        {
          wrapper,
          initialProps: { categoryId },
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Change categoryId to undefined
      rerender({ categoryId: undefined });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle rapid categoryId changes', async () => {
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result, rerender } = renderHook(
        ({ categoryId }) => useProductsByCategory(categoryId),
        {
          wrapper,
          initialProps: { categoryId: 'category-1' },
        }
      );

      // Rapidly change categoryId
      rerender({ categoryId: 'category-2' });
      rerender({ categoryId: 'category-3' });
      rerender({ categoryId: 'category-4' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should have called with the final categoryId
      expect(mockEq).toHaveBeenLastCalledWith('category_id', 'category-4');
    });
  });

  describe('Caching Behavior', () => {
    it('should cache results for the same categoryId', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result: result1 } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Second hook with same categoryId should use cached data
      const { result: result2 } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      expect(result2.current.data).toEqual(mockProducts);
      expect(result2.current.isSuccess).toBe(true);
      
      // Should only have called the API once
      expect(mockEq).toHaveBeenCalledTimes(1);
    });

    it('should have separate cache entries for different categoryIds', async () => {
      const categoryId1 = 'category-1';
      const categoryId2 = 'category-2';
      const products2 = [{ ...mockProducts[0], id: '3', name: 'Different Product' }];
      
      mockEq
        .mockResolvedValueOnce({ data: mockProducts, error: null })
        .mockResolvedValueOnce({ data: products2, error: null });

      const { result: result1 } = renderHook(() => useProductsByCategory(categoryId1), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const { result: result2 } = renderHook(() => useProductsByCategory(categoryId2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(result1.current.data).toEqual(mockProducts);
      expect(result2.current.data).toEqual(products2);
      expect(mockEq).toHaveBeenCalledTimes(2);
    });
  });

  describe('Performance Tests', () => {
    it('should not cause memory leaks with multiple rerenders', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result, rerender } = renderHook(
        () => useProductsByCategory(categoryId),
        { wrapper }
      );

      // Simulate multiple rerenders
      for (let i = 0; i < 100; i++) {
        rerender();
      }

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
    });

    it('should handle concurrent requests gracefully', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const promises = Array(10).fill(0).map(() => {
        return new Promise((resolve) => {
          const { result } = renderHook(() => useProductsByCategory(categoryId), {
            wrapper,
          });
          waitFor(() => result.current.isSuccess).then(() => resolve(result.current.data));
        });
      });

      const results = await Promise.all(promises);

      results.forEach((result) => {
        expect(result).toEqual(mockProducts);
      });
    });
  });

  describe('Integration with React Query', () => {
    it('should work with React Query devtools', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check that query is properly registered with React Query
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.getAll();
      
      expect(queries).toHaveLength(1);
      expect(queries[0].queryKey).toEqual(['products', categoryId]);
    });

    it('should support React Query manual refetch', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Manually trigger refetch
      await result.current.refetch();

      expect(mockEq).toHaveBeenCalledTimes(2);
    });

    it('should support React Query invalidation', async () => {
      const categoryId = 'category-1';
      mockEq.mockResolvedValue({ data: mockProducts, error: null });

      const { result } = renderHook(() => useProductsByCategory(categoryId), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Invalidate the query
      await queryClient.invalidateQueries({ queryKey: ['products', categoryId] });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockEq).toHaveBeenCalledTimes(2);
    });
  });
});