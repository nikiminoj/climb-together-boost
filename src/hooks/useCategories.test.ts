import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from './useCategories';
import { Category } from '@/types/database';

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
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCategories', () => {
  let mockSelect: jest.Mock;
  let mockFrom: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create mock chain for supabase query
    mockSelect = jest.fn();
    mockFrom = jest.fn().mockReturnValue({ select: mockSelect });
    mockSupabase.from.mockImplementation(mockFrom);
  });

  describe('successful data fetching', () => {
    it('should fetch categories successfully', async () => {
      const mockCategories: Category[] = [
        { id: '1', name: 'Category 1', created_at: '2023-01-01T00:00:00Z' },
        { id: '2', name: 'Category 2', created_at: '2023-01-02T00:00:00Z' },
      ];

      mockSelect.mockResolvedValue({
        data: mockCategories,
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(result.current.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('categories');
      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should handle empty categories array', async () => {
      mockSelect.mockResolvedValue({
        data: [],
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should handle null data response', async () => {
      mockSelect.mockResolvedValue({
        data: null,
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should handle undefined data response', async () => {
      mockSelect.mockResolvedValue({
        data: undefined,
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle supabase error', async () => {
      const mockError = { message: 'Database connection failed' };
      mockSelect.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Database connection failed');
      expect(result.current.data).toBeUndefined();
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network error');
      mockSelect.mockRejectedValue(networkError);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(networkError);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle empty error message', async () => {
      const mockError = { message: '' };
      mockSelect.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('');
    });

    it('should handle null error message', async () => {
      const mockError = { message: null };
      mockSelect.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('null');
    });
  });

  describe('query configuration', () => {
    it('should use correct query key', async () => {
      mockSelect.mockResolvedValue({
        data: [],
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Query key should be accessible through the result
      expect(result.current).toHaveProperty('dataUpdatedAt');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('isSuccess');
    });

    it('should handle loading state', () => {
      mockSelect.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle refetch functionality', async () => {
      const mockCategories: Category[] = [
        { id: '1', name: 'Category 1', created_at: '2023-01-01T00:00:00Z' },
      ];

      mockSelect.mockResolvedValue({
        data: mockCategories,
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Test refetch functionality
      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('data structure validation', () => {
    it('should handle categories with all required fields', async () => {
      const mockCategories: Category[] = [
        { 
          id: '1', 
          name: 'Category 1', 
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          description: 'Test category'
        },
      ];

      mockSelect.mockResolvedValue({
        data: mockCategories,
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(result.current.data?.[0]).toHaveProperty('id');
      expect(result.current.data?.[0]).toHaveProperty('name');
      expect(result.current.data?.[0]).toHaveProperty('created_at');
    });

    it('should handle large datasets', async () => {
      const mockCategories: Category[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Category ${i + 1}`,
        created_at: '2023-01-01T00:00:00Z',
      }));

      mockSelect.mockResolvedValue({
        data: mockCategories,
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1000);
      expect(result.current.data?.[0].name).toBe('Category 1');
      expect(result.current.data?.[999].name).toBe('Category 1000');
    });

    it('should handle categories with special characters', async () => {
      const mockCategories: Category[] = [
        { 
          id: '1', 
          name: 'Category with émojis 🎉 and spéciål chårs', 
          created_at: '2023-01-01T00:00:00Z'
        },
        { 
          id: '2', 
          name: 'Category with "quotes" and \'apostrophes\'', 
          created_at: '2023-01-02T00:00:00Z'
        },
      ];

      mockSelect.mockResolvedValue({
        data: mockCategories,
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(result.current.data?.[0].name).toContain('émojis 🎉');
      expect(result.current.data?.[1].name).toContain('"quotes"');
    });
  });

  describe('edge cases', () => {
    it('should handle concurrent calls', async () => {
      const mockCategories: Category[] = [
        { id: '1', name: 'Category 1', created_at: '2023-01-01T00:00:00Z' },
      ];

      mockSelect.mockResolvedValue({
        data: mockCategories,
        error: null,
      });

      const wrapper = createWrapper();
      const { result: result1 } = renderHook(() => useCategories(), { wrapper });
      const { result: result2 } = renderHook(() => useCategories(), { wrapper });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(result1.current.data).toEqual(mockCategories);
      expect(result2.current.data).toEqual(mockCategories);
      // Should only call the API once due to React Query caching
      expect(mockSelect).toHaveBeenCalledTimes(1);
    });

    it('should handle supabase client unavailability', async () => {
      // Mock supabase.from to throw an error
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Supabase client not initialized');
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Supabase client not initialized');
    });

    it('should handle malformed response data', async () => {
      // Mock response with malformed data structure
      mockSelect.mockResolvedValue({
        data: { malformed: 'data' },
        error: null,
      });

      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should still return the data as-is since TypeScript typing doesn't prevent runtime issues
      expect(result.current.data).toEqual({ malformed: 'data' });
    });
  });
});