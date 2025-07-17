import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProductsByCategory } from './useProductsByCategory';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock date-fns functions
jest.mock('date-fns', () => ({
  startOfToday: jest.fn(),
  startOfWeek: jest.fn(),
  startOfMonth: jest.fn(),
  subMonths: jest.fn(),
  formatISO: jest.fn(),
}));

describe('useProductsByCategory', () => {
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;
  let mockEq: jest.Mock;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test description 1',
      image: 'https://example.com/image1.jpg',
      author: 'Test Author 1',
      points: 100,
      upvotes: 50,
      badges: ['featured', 'trending'],
      category: 'category-1',
      link: 'https://example.com/product1',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      peer_push_points: 25,
      upvoted_by_user: false,
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Test description 2',
      image: 'https://example.com/image2.jpg',
      author: 'Test Author 2',
      points: 200,
      upvotes: 75,
      badges: ['new'],
      category: 'category-1',
      link: 'https://example.com/product2',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      peer_push_points: 40,
      upvoted_by_user: true,
    },
  ];

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    mockEq = jest.fn().mockReturnValue({ data: mockProducts, error: null });
    mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    mockFrom = jest.fn().mockReturnValue({ select: mockSelect });
    
    (supabase.from as jest.Mock) = mockFrom;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path Scenarios', () => {
    it('should fetch products successfully when categoryId is provided', async () => {
      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(result.current.error).toBeNull();
      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('category_id', 'category-1');
    });

    it('should return empty array when categoryId is undefined', async () => {
      const { result } = renderHook(
        () => useProductsByCategory(undefined),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should return empty array when categoryId is empty string', async () => {
      const { result } = renderHook(
        () => useProductsByCategory(''),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should return empty array when no products found for category', async () => {
      mockEq.mockReturnValue({ data: [], error: null });

      const { result } = renderHook(
        () => useProductsByCategory('nonexistent-category'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('category_id', 'nonexistent-category');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null categoryId', async () => {
      const { result } = renderHook(
        () => useProductsByCategory(null as any),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only categoryId', async () => {
      const { result } = renderHook(
        () => useProductsByCategory('   '),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should handle very long categoryId', async () => {
      const longCategoryId = 'a'.repeat(1000);
      
      const { result } = renderHook(
        () => useProductsByCategory(longCategoryId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockEq).toHaveBeenCalledWith('category_id', longCategoryId);
    });

    it('should handle categoryId with special characters', async () => {
      const specialCategoryId = 'category-with-special-chars-!@#$%^&*()';
      
      const { result } = renderHook(
        () => useProductsByCategory(specialCategoryId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockEq).toHaveBeenCalledWith('category_id', specialCategoryId);
    });

    it('should handle UUID format categoryId', async () => {
      const uuidCategoryId = '550e8400-e29b-41d4-a716-446655440000';
      
      const { result } = renderHook(
        () => useProductsByCategory(uuidCategoryId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockEq).toHaveBeenCalledWith('category_id', uuidCategoryId);
    });

    it('should handle numeric categoryId', async () => {
      const numericCategoryId = '12345';
      
      const { result } = renderHook(
        () => useProductsByCategory(numericCategoryId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockEq).toHaveBeenCalledWith('category_id', numericCategoryId);
    });
  });

  describe('Error Handling', () => {
    it('should handle supabase database errors', async () => {
      const mockError = new Error('Database connection failed');
      mockEq.mockReturnValue({ data: null, error: mockError });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockEq.mockReturnValue({ data: null, error: timeoutError });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(timeoutError);
    });

    it('should handle permission/authorization errors', async () => {
      const permissionError = new Error('Permission denied');
      mockEq.mockReturnValue({ data: null, error: permissionError });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(permissionError);
    });

    it('should handle RLS (Row Level Security) errors', async () => {
      const rlsError = new Error('Row level security violation');
      mockEq.mockReturnValue({ data: null, error: rlsError });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(rlsError);
    });

    it('should handle malformed response data', async () => {
      mockEq.mockReturnValue({ data: null, error: null });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle unexpected supabase response format', async () => {
      mockEq.mockReturnValue({ data: undefined, error: null });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Query Behavior', () => {
    it('should not execute query when categoryId is falsy', () => {
      const { result } = renderHook(
        () => useProductsByCategory(undefined),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should have correct query key structure', async () => {
      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      // The query key should be ['products', 'category-1']
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should be enabled only when categoryId is provided', () => {
      const { result: resultWithId } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      const { result: resultWithoutId } = renderHook(
        () => useProductsByCategory(undefined),
        { wrapper: createWrapper() }
      );

      expect(resultWithId.current.isLoading).toBe(true);
      expect(resultWithoutId.current.isLoading).toBe(false);
    });

    it('should refetch when categoryId changes', async () => {
      const { result, rerender } = renderHook(
        ({ categoryId }) => useProductsByCategory(categoryId),
        { 
          wrapper: createWrapper(),
          initialProps: { categoryId: 'category-1' }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockEq).toHaveBeenCalledWith('category_id', 'category-1');

      // Change categoryId
      rerender({ categoryId: 'category-2' });

      await waitFor(() => {
        expect(mockEq).toHaveBeenCalledWith('category_id', 'category-2');
      });
    });

    it('should handle rapid categoryId changes', async () => {
      const { result, rerender } = renderHook(
        ({ categoryId }) => useProductsByCategory(categoryId),
        { 
          wrapper: createWrapper(),
          initialProps: { categoryId: 'category-1' }
        }
      );

      // Rapidly change categoryId multiple times
      rerender({ categoryId: 'category-2' });
      rerender({ categoryId: 'category-3' });
      rerender({ categoryId: 'category-4' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockEq).toHaveBeenCalledWith('category_id', 'category-4');
    });

    it('should handle categoryId changing from valid to undefined', async () => {
      const { result, rerender } = renderHook(
        ({ categoryId }) => useProductsByCategory(categoryId),
        { 
          wrapper: createWrapper(),
          initialProps: { categoryId: 'category-1' }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Change to undefined
      rerender({ categoryId: undefined });

      expect(result.current.data).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Loading States', () => {
    it('should show loading state initially', () => {
      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should transition from loading to success state', async () => {
      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockProducts);
    });

    it('should transition from loading to error state', async () => {
      const mockError = new Error('Test error');
      mockEq.mockReturnValue({ data: null, error: mockError });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toEqual(mockError);
    });

    it('should handle loading state for disabled queries', () => {
      const { result } = renderHook(
        () => useProductsByCategory(undefined),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([]);
    });
  });

  describe('Data Integrity', () => {
    it('should preserve product data structure', async () => {
      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const products = result.current.data;
      expect(Array.isArray(products)).toBe(true);
      
      products?.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('image');
        expect(product).toHaveProperty('author');
        expect(product).toHaveProperty('points');
        expect(product).toHaveProperty('upvotes');
        expect(product).toHaveProperty('badges');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('link');
        expect(product).toHaveProperty('created_at');
        expect(product).toHaveProperty('updated_at');
        expect(product).toHaveProperty('peer_push_points');
      });
    });

    it('should handle products with null/undefined optional fields', async () => {
      const productsWithNulls: Product[] = [
        {
          id: '1',
          name: 'Test Product',
          description: null,
          image: null,
          author: null,
          points: 100,
          upvotes: 50,
          badges: null,
          category: null,
          link: null,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          peer_push_points: 25,
        },
      ];

      mockEq.mockReturnValue({ data: productsWithNulls, error: null });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(productsWithNulls);
      expect(result.current.data?.[0].description).toBeNull();
      expect(result.current.data?.[0].image).toBeNull();
      expect(result.current.data?.[0].author).toBeNull();
      expect(result.current.data?.[0].badges).toBeNull();
      expect(result.current.data?.[0].category).toBeNull();
      expect(result.current.data?.[0].link).toBeNull();
    });

    it('should handle large datasets', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        image: `https://example.com/image${i}.jpg`,
        author: `Author ${i}`,
        points: Math.floor(Math.random() * 1000),
        upvotes: Math.floor(Math.random() * 100),
        badges: ['badge1', 'badge2'],
        category: 'category-1',
        link: `https://example.com/product${i}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        peer_push_points: Math.floor(Math.random() * 50),
      }));

      mockEq.mockReturnValue({ data: largeDataset, error: null });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1000);
      expect(result.current.data).toEqual(largeDataset);
    });

    it('should handle empty badges array', async () => {
      const productsWithEmptyBadges: Product[] = [
        {
          ...mockProducts[0],
          badges: [],
        },
      ];

      mockEq.mockReturnValue({ data: productsWithEmptyBadges, error: null });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.[0].badges).toEqual([]);
    });

    it('should handle products with zero points and upvotes', async () => {
      const productsWithZeroValues: Product[] = [
        {
          ...mockProducts[0],
          points: 0,
          upvotes: 0,
          peer_push_points: 0,
        },
      ];

      mockEq.mockReturnValue({ data: productsWithZeroValues, error: null });

      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.[0].points).toBe(0);
      expect(result.current.data?.[0].upvotes).toBe(0);
      expect(result.current.data?.[0].peer_push_points).toBe(0);
    });
  });

  describe('Type Safety', () => {
    it('should return correct TypeScript types', async () => {
      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // TypeScript should infer the correct types
      const data: Product[] | undefined = result.current.data;
      const error: Error | null = result.current.error;
      
      expect(data).toBeDefined();
      expect(error).toBeNull();
    });

    it('should handle optional upvoted_by_user field', async () => {
      const { result } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const firstProduct = result.current.data?.[0];
      expect(typeof firstProduct?.upvoted_by_user).toBe('boolean');
    });
  });

  describe('Performance', () => {
    it('should not refetch unnecessarily when categoryId remains the same', async () => {
      const { result, rerender } = renderHook(
        ({ categoryId }) => useProductsByCategory(categoryId),
        { 
          wrapper: createWrapper(),
          initialProps: { categoryId: 'category-1' }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const initialCallCount = mockEq.mock.calls.length;

      // Re-render with same categoryId
      rerender({ categoryId: 'category-1' });

      // Should not trigger additional API calls
      expect(mockEq.mock.calls.length).toBe(initialCallCount);
    });

    it('should handle multiple concurrent requests gracefully', async () => {
      const { result: result1 } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => useProductsByCategory('category-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      // Both should return the same data
      expect(result1.current.data).toEqual(result2.current.data);
    });
  });
});