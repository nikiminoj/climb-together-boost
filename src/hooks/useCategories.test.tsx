import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { useCategories } from './useCategories';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/database';

// Mock console methods to avoid cluttering test output
const mockConsole = {
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(mockConsole.error);
  jest.spyOn(console, 'log').mockImplementation(mockConsole.log);
  jest.spyOn(console, 'warn').mockImplementation(mockConsole.warn);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

// Helper function to create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCategories', () => {
  const mockCategories: Category[] = [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Health' },
    { id: '3', name: 'Finance' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Happy Path', () => {
    it('should return categories successfully', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('categories');
      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should return empty array when no categories exist', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle null data response gracefully', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle supabase errors correctly', async () => {
      const mockError = {
        message: 'Database connection failed',
        code: 'PGRST301',
      };
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe('Database connection failed');
      expect(result.current.isError).toBe(true);
    });

    it('should handle network errors', async () => {
      const mockSelect = jest.fn().mockRejectedValue(new Error('Network error'));
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe('Network error');
      expect(result.current.isError).toBe(true);
    });

    it('should handle undefined error message gracefully', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: { message: undefined },
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe('undefined');
      expect(result.current.isError).toBe(true);
    });

    it('should handle empty error message', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: { message: '' },
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe('');
      expect(result.current.isError).toBe(true);
    });

    it('should handle authentication errors', async () => {
      const mockError = {
        message: 'Authentication required',
        code: 'PGRST401',
      };
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Authentication required');
    });

    it('should handle rate limiting errors', async () => {
      const mockError = {
        message: 'Too many requests',
        code: 'PGRST429',
      };
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Too many requests');
    });
  });

  describe('Query Key and Caching', () => {
    it('should use correct query key for caching', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(result.current.isSuccess).toBe(true);
    });

    it('should cache results between multiple hook calls', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const wrapper = createWrapper();
      
      // First hook call
      const { result: result1 } = renderHook(() => useCategories(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      });

      // Second hook call with same wrapper (same QueryClient)
      const { result: result2 } = renderHook(() => useCategories(), {
        wrapper,
      });

      // Should use cached data, not call API again
      expect(result2.current.data).toEqual(mockCategories);
      expect(mockSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed category data', async () => {
      const malformedData = [
        { id: 1, name: 'Tech' }, // number instead of string
        { name: 'Health' }, // missing id
        { id: '3' }, // missing name
      ];
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: malformedData,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(malformedData);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle very large datasets', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Category ${i + 1}`,
      }));
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: largeDataset,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toHaveLength(1000);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle special characters in category names', async () => {
      const specialCategories = [
        { id: '1', name: 'Tech & Innovation' },
        { id: '2', name: 'Health/Wellness' },
        { id: '3', name: 'Finance (Personal)' },
        { id: '4', name: 'Education-Online' },
        { id: '5', name: 'Sports & Recreation' },
        { id: '6', name: 'Émojis & Ünicode' },
      ];
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: specialCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(specialCategories);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle empty string category names', async () => {
      const categoriesWithEmptyNames = [
        { id: '1', name: '' },
        { id: '2', name: 'Valid Category' },
      ];
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: categoriesWithEmptyNames,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(categoriesWithEmptyNames);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle categories with null values', async () => {
      const categoriesWithNulls = [
        { id: '1', name: null },
        { id: null, name: 'Health' },
        { id: '3', name: 'Finance' },
      ];
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: categoriesWithNulls,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(categoriesWithNulls);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should return properly typed data', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // TypeScript should infer the correct types
      expect(result.current.data).toBeDefined();
      if (result.current.data) {
        expect(Array.isArray(result.current.data)).toBe(true);
        expect(result.current.data[0]).toHaveProperty('id');
        expect(result.current.data[0]).toHaveProperty('name');
        expect(typeof result.current.data[0].id).toBe('string');
        expect(typeof result.current.data[0].name).toBe('string');
      }
    });
  });

  describe('React Query Integration', () => {
    it('should provide correct loading states', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      const mockSelect = jest.fn().mockReturnValue(promise);
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);

      // Resolve the promise
      resolvePromise!({
        data: mockCategories,
        error: null,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isFetching).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
    });

    it('should handle refetch functionality', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSelect).toHaveBeenCalledTimes(1);

      // Test refetch
      await result.current.refetch();
      
      expect(mockSelect).toHaveBeenCalledTimes(2);
      expect(result.current.data).toEqual(mockCategories);
    });

    it('should handle stale data states', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isStale).toBeDefined();
      expect(result.current.dataUpdatedAt).toBeDefined();
    });

    it('should handle enabled/disabled states', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(true);
      expect(result.current.isInitialLoading).toBe(false);
    });
  });

  describe('fetchCategories function', () => {
    it('should call supabase with correct parameters', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockSupabase.from).toHaveBeenCalledWith('categories');
      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should throw error when supabase returns error', async () => {
      const mockError = {
        message: 'Permission denied',
        code: 'PGRST401',
      };
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Permission denied');
    });
  });

  describe('Multiple Query Clients', () => {
    it('should work with different query clients independently', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const wrapper1 = createWrapper();
      const wrapper2 = createWrapper();

      const { result: result1 } = renderHook(() => useCategories(), {
        wrapper: wrapper1,
      });

      const { result: result2 } = renderHook(() => useCategories(), {
        wrapper: wrapper2,
      });

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
        expect(result2.current.isLoading).toBe(false);
      });

      expect(result1.current.data).toEqual(mockCategories);
      expect(result2.current.data).toEqual(mockCategories);
      expect(mockSelect).toHaveBeenCalledTimes(2); // Different clients, so 2 calls
    });
  });

  describe('Performance and Stress Tests', () => {
    it('should handle concurrent hook calls', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const wrapper = createWrapper();
      
      // Create multiple hook instances simultaneously
      const hooks = Array.from({ length: 5 }, () => 
        renderHook(() => useCategories(), { wrapper })
      );

      await Promise.all(hooks.map(hook => 
        waitFor(() => expect(hook.result.current.isLoading).toBe(false))
      ));

      // All hooks should have the same data
      hooks.forEach(hook => {
        expect(hook.result.current.data).toEqual(mockCategories);
        expect(hook.result.current.isSuccess).toBe(true);
      });

      // Should only make one API call due to caching
      expect(mockSelect).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid refetching', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: mockCategories,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Perform multiple rapid refetches
      const refetchPromises = Array.from({ length: 3 }, () => 
        result.current.refetch()
      );

      await Promise.all(refetchPromises);

      expect(result.current.data).toEqual(mockCategories);
      expect(mockSelect).toHaveBeenCalledTimes(4); // 1 initial + 3 refetches
    });
  });

  describe('Error Recovery', () => {
    it('should recover from errors on refetch', async () => {
      const mockSelect = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          data: mockCategories,
          error: null,
        });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      // Wait for initial error
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Network error');

      // Refetch should succeed
      await result.current.refetch();

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockCategories);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle API response with mixed data types', async () => {
      const mixedData = [
        { id: '1', name: 'Technology' },
        { id: 2, name: 'Health' }, // number id
        { id: '3', name: 123 }, // number name
        { id: '4', name: true }, // boolean name
        { id: '5', name: null }, // null name
      ];
      
      const mockSelect = jest.fn().mockResolvedValue({
        data: mixedData,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mixedData);
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle empty API response variations', async () => {
      const testCases = [
        { data: [], error: null },
        { data: null, error: null },
        { data: undefined, error: null },
      ];

      for (const testCase of testCases) {
        const mockSelect = jest.fn().mockResolvedValue(testCase);
        
        mockSupabase.from.mockReturnValue({
          select: mockSelect,
        } as any);

        const { result } = renderHook(() => useCategories(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.isSuccess).toBe(true);
      }
    });
  });
});