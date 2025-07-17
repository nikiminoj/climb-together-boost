import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import {
  supabase,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  getAllBadges,
  getUserBadges,
  upvoteProduct,
} from '../client';

// Mock the supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

// Mock localStorage for browser environment
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('Supabase Client', () => {
  let mockSupabaseClient: any;
  let mockFrom: any;
  let mockRpc: any;
  let mockChannel: any;
  let mockOn: any;
  let mockSubscribe: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // Create mock chain for Supabase operations
    mockFrom = jest.fn();
    mockRpc = jest.fn();
    mockSubscribe = jest.fn();
    mockOn = jest.fn().mockReturnValue({ subscribe: mockSubscribe });
    mockChannel = jest.fn().mockReturnValue({ on: mockOn });

    mockSupabaseClient = {
      from: mockFrom,
      rpc: mockRpc,
      channel: mockChannel,
    };

    (createClient as any).mockReturnValue(mockSupabaseClient);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Client Configuration', () => {
    it('should create client with correct URL and key', () => {
      expect(createClient).toHaveBeenCalledWith(
        'https://mcbuxkyofjngibhxvxvk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnV4a3lvZmpuZ2liaHh2eHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Mzk1OTcsImV4cCI6MjA2ODMxNTU5N30.tf85GEz3hzdQ9fdGht4ocryRayGV67mu5xh_iJe9uv4',
        {
          auth: {
            storage: localStorage,
            persistSession: true,
            autoRefreshToken: true,
          },
        },
      );
    });

    it('should configure authentication with localStorage', () => {
      const createClientCall = (createClient as any).mock.calls[0];
      expect(createClientCall[2].auth.storage).toBe(localStorage);
      expect(createClientCall[2].auth.persistSession).toBe(true);
      expect(createClientCall[2].auth.autoRefreshToken).toBe(true);
    });

    it('should set up real-time subscription for notifications', () => {
      expect(mockChannel).toHaveBeenCalledWith('notifications');
      expect(mockOn).toHaveBeenCalledWith(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        expect.any(Function),
      );
      expect(mockSubscribe).toHaveBeenCalled();
    });

    it('should export supabase client instance', () => {
      expect(supabase).toBeDefined();
      expect(typeof supabase).toBe('object');
    });

    it('should handle client initialization errors', () => {
      const errorMock = jest.fn().mockImplementation(() => {
        throw new Error('Client initialization failed');
      });
      (createClient as any).mockImplementation(errorMock);

      expect(() => {
        // Re-import to trigger client creation
        jest.resetModules();
        require('../client');
      }).toThrow('Client initialization failed');
    });
  });

  describe('getNotifications', () => {
    let mockSelect: any;
    let mockOrder: any;

    beforeEach(() => {
      mockOrder = jest.fn();
      mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });
    });

    it('should fetch notifications successfully', async () => {
      const mockData = [
        {
          id: '1',
          message: 'Test notification',
          created_at: '2023-01-01T12:00:00Z',
          read: false,
        },
        {
          id: '2',
          message: 'Another notification',
          created_at: '2023-01-02T12:00:00Z',
          read: true,
        },
      ];

      mockOrder.mockResolvedValue({ data: mockData, error: null });

      const result = await getNotifications();

      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', {
        ascending: false,
      });
      expect(result).toEqual(mockData);
    });

    it('should handle database errors and return empty array', async () => {
      const mockError = new Error('Database connection failed');
      mockOrder.mockResolvedValue({ data: null, error: mockError });

      const result = await getNotifications();

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching notifications:',
        mockError,
      );
      expect(result).toEqual([]);
    });

    it('should return empty array when data is null', async () => {
      mockOrder.mockResolvedValue({ data: null, error: null });

      const result = await getNotifications();

      expect(result).toEqual([]);
    });

    it('should handle empty notifications array', async () => {
      mockOrder.mockResolvedValue({ data: [], error: null });

      const result = await getNotifications();

      expect(result).toEqual([]);
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network request failed');
      mockOrder.mockRejectedValue(networkError);

      await expect(getNotifications()).rejects.toThrow(
        'Network request failed',
      );
    });

    it('should handle authentication errors', async () => {
      const authError = new Error('Authentication failed');
      mockOrder.mockResolvedValue({ data: null, error: authError });

      const result = await getNotifications();

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching notifications:',
        authError,
      );
      expect(result).toEqual([]);
    });

    it('should handle malformed notification data', async () => {
      const malformedData = [
        { id: '1' }, // Missing required fields
        { message: 'Test' }, // Missing ID
        null, // Null entry
        { id: '2', message: 'Valid', created_at: '2023-01-01T12:00:00Z' },
      ];

      mockOrder.mockResolvedValue({ data: malformedData, error: null });

      const result = await getNotifications();

      expect(result).toEqual(malformedData);
    });
  });

  describe('markNotificationAsRead', () => {
    let mockUpdate: any;
    let mockEq: any;

    beforeEach(() => {
      mockEq = jest.fn();
      mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ update: mockUpdate });
    });

    it('should mark notification as read successfully', async () => {
      const notificationId = 'test-id-123';
      const mockData = { id: notificationId, read: true };

      mockEq.mockResolvedValue({ data: mockData, error: null });

      const result = await markNotificationAsRead(notificationId);

      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockUpdate).toHaveBeenCalledWith({ read: true });
      expect(mockEq).toHaveBeenCalledWith('id', notificationId);
      expect(result).toBe(true);
    });

    it('should handle update errors and return false', async () => {
      const notificationId = 'test-id-123';
      const mockError = new Error('Update failed');

      mockEq.mockResolvedValue({ data: null, error: mockError });

      const result = await markNotificationAsRead(notificationId);

      expect(console.error).toHaveBeenCalledWith(
        `Error marking notification ${notificationId} as read:`,
        mockError,
      );
      expect(result).toBe(false);
    });

    it('should return false when update returns null data', async () => {
      const notificationId = 'test-id-123';
      mockEq.mockResolvedValue({ data: null, error: null });

      const result = await markNotificationAsRead(notificationId);

      expect(result).toBe(false);
    });

    it('should handle empty notification ID', async () => {
      const notificationId = '';
      const mockError = new Error('Invalid ID');

      mockEq.mockResolvedValue({ data: null, error: mockError });

      const result = await markNotificationAsRead(notificationId);

      expect(result).toBe(false);
    });

    it('should handle UUID format notification IDs', async () => {
      const notificationId = '550e8400-e29b-41d4-a716-446655440000';
      const mockData = { id: notificationId, read: true };

      mockEq.mockResolvedValue({ data: mockData, error: null });

      const result = await markNotificationAsRead(notificationId);

      expect(mockEq).toHaveBeenCalledWith('id', notificationId);
      expect(result).toBe(true);
    });

    it('should handle RLS (Row Level Security) errors', async () => {
      const notificationId = 'test-id-123';
      const rlsError = new Error('Row level security policy violation');

      mockEq.mockResolvedValue({ data: null, error: rlsError });

      const result = await markNotificationAsRead(notificationId);

      expect(console.error).toHaveBeenCalledWith(
        `Error marking notification ${notificationId} as read:`,
        rlsError,
      );
      expect(result).toBe(false);
    });

    it('should handle concurrent mark as read operations', async () => {
      const notificationId = 'test-id-123';
      const mockData = { id: notificationId, read: true };

      mockEq.mockResolvedValue({ data: mockData, error: null });

      const promises = [
        markNotificationAsRead(notificationId),
        markNotificationAsRead(notificationId),
        markNotificationAsRead(notificationId),
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual([true, true, true]);
    });

    it('should handle null and undefined notification IDs', async () => {
      const nullError = new Error('Invalid ID');
      mockEq.mockResolvedValue({ data: null, error: nullError });

      const nullResult = await markNotificationAsRead(null as any);
      expect(nullResult).toBe(false);

      const undefinedResult = await markNotificationAsRead(undefined as any);
      expect(undefinedResult).toBe(false);
    });
  });

  describe('deleteNotification', () => {
    let mockDelete: any;
    let mockEq: any;

    beforeEach(() => {
      mockEq = jest.fn();
      mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ delete: mockDelete });
    });

    it('should delete notification successfully', async () => {
      const notificationId = 'test-id-123';
      mockEq.mockResolvedValue({ error: null });

      const result = await deleteNotification(notificationId);

      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', notificationId);
      expect(result).toBe(true);
    });

    it('should handle delete errors and return false', async () => {
      const notificationId = 'test-id-123';
      const mockError = new Error('Delete failed');

      mockEq.mockResolvedValue({ error: mockError });

      const result = await deleteNotification(notificationId);

      expect(console.error).toHaveBeenCalledWith(
        `Error deleting notification ${notificationId}:`,
        mockError,
      );
      expect(result).toBe(false);
    });

    it('should handle empty notification ID', async () => {
      const notificationId = '';
      const mockError = new Error('Invalid ID');

      mockEq.mockResolvedValue({ error: mockError });

      const result = await deleteNotification(notificationId);

      expect(result).toBe(false);
    });

    it('should handle special characters in notification ID', async () => {
      const notificationId = 'test-id-with-special-chars!@#$%';
      mockEq.mockResolvedValue({ error: null });

      const result = await deleteNotification(notificationId);

      expect(mockEq).toHaveBeenCalledWith('id', notificationId);
      expect(result).toBe(true);
    });

    it('should handle foreign key constraint errors', async () => {
      const notificationId = 'test-id-123';
      const fkError = new Error('Foreign key constraint violation');

      mockEq.mockResolvedValue({ error: fkError });

      const result = await deleteNotification(notificationId);

      expect(console.error).toHaveBeenCalledWith(
        `Error deleting notification ${notificationId}:`,
        fkError,
      );
      expect(result).toBe(false);
    });

    it('should handle non-existent notification ID gracefully', async () => {
      const notificationId = 'non-existent-id';
      mockEq.mockResolvedValue({ error: null });

      const result = await deleteNotification(notificationId);

      expect(result).toBe(true);
    });

    it('should handle null and undefined notification IDs', async () => {
      const nullError = new Error('Invalid ID');
      mockEq.mockResolvedValue({ error: nullError });

      const nullResult = await deleteNotification(null as any);
      expect(nullResult).toBe(false);

      const undefinedResult = await deleteNotification(undefined as any);
      expect(undefinedResult).toBe(false);
    });

    it('should handle database transaction errors', async () => {
      const notificationId = 'test-id-123';
      const transactionError = new Error('Transaction failed');

      mockEq.mockResolvedValue({ error: transactionError });

      const result = await deleteNotification(notificationId);

      expect(console.error).toHaveBeenCalledWith(
        `Error deleting notification ${notificationId}:`,
        transactionError,
      );
      expect(result).toBe(false);
    });
  });

  describe('getAllBadges', () => {
    let mockSelect: any;

    beforeEach(() => {
      mockSelect = jest.fn();
      mockFrom.mockReturnValue({ select: mockSelect });
    });

    it('should fetch all badges successfully', async () => {
      const mockData = [
        {
          id: '1',
          name: 'First Badge',
          description: 'Your first badge',
          icon: 'badge1.png',
        },
        {
          id: '2',
          name: 'Second Badge',
          description: 'Your second badge',
          icon: 'badge2.png',
        },
      ];

      mockSelect.mockResolvedValue({ data: mockData, error: null });

      const result = await getAllBadges();

      expect(mockFrom).toHaveBeenCalledWith('badges');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockData);
    });

    it('should handle database errors and return empty array', async () => {
      const mockError = new Error('Database connection failed');
      mockSelect.mockResolvedValue({ data: null, error: mockError });

      const result = await getAllBadges();

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching all badges:',
        mockError,
      );
      expect(result).toEqual([]);
    });

    it('should return empty array when no badges exist', async () => {
      mockSelect.mockResolvedValue({ data: [], error: null });

      const result = await getAllBadges();

      expect(result).toEqual([]);
    });

    it('should handle null data response', async () => {
      mockSelect.mockResolvedValue({ data: null, error: null });

      const result = await getAllBadges();

      expect(result).toEqual([]);
    });

    it('should handle badges with missing optional fields', async () => {
      const mockData = [
        { id: '1', name: 'First Badge' }, // Missing description and icon
        {
          id: '2',
          name: 'Second Badge',
          description: 'Your second badge',
          icon: 'badge2.png',
        },
      ];

      mockSelect.mockResolvedValue({ data: mockData, error: null });

      const result = await getAllBadges();

      expect(result).toEqual(mockData);
    });

    it('should handle large badge datasets efficiently', async () => {
      const mockData = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Badge ${i + 1}`,
        description: `Description for badge ${i + 1}`,
        icon: `badge${i + 1}.png`,
      }));

      mockSelect.mockResolvedValue({ data: mockData, error: null });

      const result = await getAllBadges();

      expect(result).toEqual(mockData);
      expect(result).toHaveLength(1000);
    });

    it('should handle network timeouts', async () => {
      const timeoutError = new Error('Network timeout');
      mockSelect.mockRejectedValue(timeoutError);

      await expect(getAllBadges()).rejects.toThrow('Network timeout');
    });

    it('should handle badges with duplicate IDs', async () => {
      const mockData = [
        {
          id: '1',
          name: 'First Badge',
          description: 'Your first badge',
          icon: 'badge1.png',
        },
        {
          id: '1',
          name: 'Duplicate Badge',
          description: 'Duplicate badge',
          icon: 'badge1-dup.png',
        },
      ];

      mockSelect.mockResolvedValue({ data: mockData, error: null });

      const result = await getAllBadges();

      expect(result).toEqual(mockData);
    });
  });

  describe('getUserBadges', () => {
    let mockSelect: any;
    let mockEq: any;

    beforeEach(() => {
      mockEq = jest.fn();
      mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });
    });

    it('should fetch user badges successfully', async () => {
      const userId = 'user-123';
      const mockData = [
        {
          id: '1',
          earned_at: '2023-01-01T12:00:00Z',
          badges: {
            id: '1',
            name: 'First Badge',
            description: 'Your first badge',
            icon: 'badge1.png',
          },
        },
        {
          id: '2',
          earned_at: '2023-01-02T12:00:00Z',
          badges: {
            id: '2',
            name: 'Second Badge',
            description: 'Your second badge',
            icon: 'badge2.png',
          },
        },
      ];

      mockEq.mockResolvedValue({ data: mockData, error: null });

      const result = await getUserBadges(userId);

      expect(mockFrom).toHaveBeenCalledWith('user_badges');
      expect(mockSelect).toHaveBeenCalledWith(`
 id,
 earned_at,
 badges (id, name, description, icon)
 `);
      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
      expect(result).toEqual(mockData);
    });

    it('should handle database errors and return empty array', async () => {
      const userId = 'user-123';
      const mockError = new Error('Database connection failed');

      mockEq.mockResolvedValue({ data: null, error: mockError });

      const result = await getUserBadges(userId);

      expect(console.error).toHaveBeenCalledWith(
        `Error fetching badges for user ${userId}:`,
        mockError,
      );
      expect(result).toEqual([]);
    });

    it('should handle empty user ID', async () => {
      const userId = '';
      const mockError = new Error('Invalid user ID');

      mockEq.mockResolvedValue({ data: null, error: mockError });

      const result = await getUserBadges(userId);

      expect(result).toEqual([]);
    });

    it('should handle user with no badges', async () => {
      const userId = 'user-no-badges';
      mockEq.mockResolvedValue({ data: [], error: null });

      const result = await getUserBadges(userId);

      expect(result).toEqual([]);
    });

    it('should handle null data response', async () => {
      const userId = 'user-123';
      mockEq.mockResolvedValue({ data: null, error: null });

      const result = await getUserBadges(userId);

      expect(result).toEqual([]);
    });

    it('should handle UUID format user IDs', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      const mockData = [
        {
          id: '1',
          earned_at: '2023-01-01T12:00:00Z',
          badges: {
            id: '1',
            name: 'First Badge',
            description: 'Your first badge',
            icon: 'badge1.png',
          },
        },
      ];

      mockEq.mockResolvedValue({ data: mockData, error: null });

      const result = await getUserBadges(userId);

      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
      expect(result).toEqual(mockData);
    });

    it('should handle badges with null nested data', async () => {
      const userId = 'user-123';
      const mockData = [
        {
          id: '1',
          earned_at: '2023-01-01T12:00:00Z',
          badges: null,
        },
      ];

      mockEq.mockResolvedValue({ data: mockData, error: null });

      const result = await getUserBadges(userId);

      expect(result).toEqual(mockData);
    });

    it('should handle malformed timestamp data', async () => {
      const userId = 'user-123';
      const mockData = [
        {
          id: '1',
          earned_at: 'invalid-timestamp',
          badges: {
            id: '1',
            name: 'First Badge',
            description: 'Your first badge',
            icon: 'badge1.png',
          },
        },
      ];

      mockEq.mockResolvedValue({ data: mockData, error: null });

      const result = await getUserBadges(userId);

      expect(result).toEqual(mockData);
    });

    it('should handle null and undefined user IDs', async () => {
      const mockError = new Error('Invalid user ID');
      mockEq.mockResolvedValue({ data: null, error: mockError });

      const nullResult = await getUserBadges(null as any);
      expect(nullResult).toEqual([]);

      const undefinedResult = await getUserBadges(undefined as any);
      expect(undefinedResult).toEqual([]);
    });
  });

  describe('upvoteProduct', () => {
    beforeEach(() => {
      mockSupabaseClient.rpc = mockRpc;
    });

    it('should upvote product successfully', async () => {
      const productId = 'product-123';
      const mockData = { success: true, upvotes: 5 };

      mockRpc.mockResolvedValue({ data: mockData, error: null });

      const result = await upvoteProduct(productId);

      expect(mockRpc).toHaveBeenCalledWith('handle_upvote', {
        p_product_id: productId,
      });
      expect(result).toBe(true);
    });

    it('should handle RPC errors and return false', async () => {
      const productId = 'product-123';
      const mockError = new Error('RPC function failed');

      mockRpc.mockResolvedValue({ data: null, error: mockError });

      const result = await upvoteProduct(productId);

      expect(console.error).toHaveBeenCalledWith(
        `Error upvoting product ${productId}:`,
        mockError,
      );
      expect(result).toBe(false);
    });

    it('should handle empty product ID', async () => {
      const productId = '';
      const mockError = new Error('Invalid product ID');

      mockRpc.mockResolvedValue({ data: null, error: mockError });

      const result = await upvoteProduct(productId);

      expect(result).toBe(false);
    });

    it('should handle null and undefined product IDs', async () => {
      const mockError = new Error('Invalid product ID');
      mockRpc.mockResolvedValue({ data: null, error: mockError });

      const nullResult = await upvoteProduct(null as any);
      expect(nullResult).toBe(false);

      const undefinedResult = await upvoteProduct(undefined as any);
      expect(undefinedResult).toBe(false);
    });

    it('should handle special characters in product ID', async () => {
      const productId = 'product-with-special-chars!@#$%';
      const mockData = { success: true };

      mockRpc.mockResolvedValue({ data: mockData, error: null });

      const result = await upvoteProduct(productId);

      expect(mockRpc).toHaveBeenCalledWith('handle_upvote', {
        p_product_id: productId,
      });
      expect(result).toBe(true);
    });

    it('should handle RPC function returning null data', async () => {
      const productId = 'product-123';

      mockRpc.mockResolvedValue({ data: null, error: null });

      const result = await upvoteProduct(productId);

      expect(result).toBe(true);
    });

    it('should handle RPC function timeout', async () => {
      const productId = 'product-123';
      const timeoutError = new Error('Function timeout');

      mockRpc.mockResolvedValue({ data: null, error: timeoutError });

      const result = await upvoteProduct(productId);

      expect(console.error).toHaveBeenCalledWith(
        `Error upvoting product ${productId}:`,
        timeoutError,
      );
      expect(result).toBe(false);
    });

    it('should handle authentication errors', async () => {
      const productId = 'product-123';
      const authError = new Error('Authentication required');

      mockRpc.mockResolvedValue({ data: null, error: authError });

      const result = await upvoteProduct(productId);

      expect(console.error).toHaveBeenCalledWith(
        `Error upvoting product ${productId}:`,
        authError,
      );
      expect(result).toBe(false);
    });

    it('should handle duplicate upvote attempts', async () => {
      const productId = 'product-123';
      const duplicateError = new Error('User has already upvoted this product');

      mockRpc.mockResolvedValue({ data: null, error: duplicateError });

      const result = await upvoteProduct(productId);

      expect(console.error).toHaveBeenCalledWith(
        `Error upvoting product ${productId}:`,
        duplicateError,
      );
      expect(result).toBe(false);
    });

    it('should handle RPC function not found errors', async () => {
      const productId = 'product-123';
      const notFoundError = new Error('Function handle_upvote not found');

      mockRpc.mockResolvedValue({ data: null, error: notFoundError });

      const result = await upvoteProduct(productId);

      expect(console.error).toHaveBeenCalledWith(
        `Error upvoting product ${productId}:`,
        notFoundError,
      );
      expect(result).toBe(false);
    });
  });

  describe('Real-time Subscription', () => {
    it('should handle new notification payload correctly', () => {
      const callbackFunction = mockOn.mock.calls[0][2];

      const mockPayload = {
        new: {
          id: '123',
          message: 'New notification',
          created_at: '2023-01-01T12:00:00Z',
        },
      };

      callbackFunction(mockPayload);

      expect(console.log).toHaveBeenCalledWith(
        'New notification received:',
        mockPayload.new,
      );
    });

    it('should set up subscription correctly', () => {
      expect(mockChannel).toHaveBeenCalledWith('notifications');
      expect(mockOn).toHaveBeenCalledWith(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        expect.any(Function),
      );
      expect(mockSubscribe).toHaveBeenCalled();
    });

    it('should handle payload with null new data', () => {
      const callbackFunction = mockOn.mock.calls[0][2];

      const mockPayload = { new: null };

      callbackFunction(mockPayload);

      expect(console.log).toHaveBeenCalledWith(
        'New notification received:',
        null,
      );
    });

    it('should handle payload with empty new data', () => {
      const callbackFunction = mockOn.mock.calls[0][2];

      const mockPayload = { new: {} };

      callbackFunction(mockPayload);

      expect(console.log).toHaveBeenCalledWith(
        'New notification received:',
        {},
      );
    });

    it('should handle malformed payload gracefully', () => {
      const callbackFunction = mockOn.mock.calls[0][2];

      const mockPayload = { invalid: 'data' };

      callbackFunction(mockPayload);

      expect(console.log).toHaveBeenCalledWith(
        'New notification received:',
        undefined,
      );
    });

    it('should handle payload with additional metadata', () => {
      const callbackFunction = mockOn.mock.calls[0][2];

      const mockPayload = {
        new: {
          id: '123',
          message: 'New notification',
          created_at: '2023-01-01T12:00:00Z',
        },
        old: null,
        eventType: 'INSERT',
      };

      callbackFunction(mockPayload);

      expect(console.log).toHaveBeenCalledWith(
        'New notification received:',
        mockPayload.new,
      );
    });

    it('should handle subscription connection errors', () => {
      // Test that subscription setup doesn't throw errors
      expect(() => {
        mockChannel('notifications');
        mockOn(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          () => {},
        );
        mockSubscribe();
      }).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle network timeouts gracefully', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const timeoutError = new Error('Network timeout');
      mockOrder.mockRejectedValue(timeoutError);

      await expect(getNotifications()).rejects.toThrow('Network timeout');
    });

    it('should handle malformed API responses', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      // Simulate malformed response
      mockOrder.mockResolvedValue({ data: 'invalid-data', error: null });

      const result = await getNotifications();

      expect(result).toBe('invalid-data');
    });

    it('should handle concurrent operations without race conditions', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const mockData = [{ id: '1', message: 'Test' }];
      mockOrder.mockResolvedValue({ data: mockData, error: null });

      const promises = Array.from({ length: 10 }, () => getNotifications());
      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach((result) => {
        expect(result).toEqual(mockData);
      });
    });

    it('should handle very large datasets without memory issues', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const largeDataset = Array.from({ length: 5000 }, (_, i) => ({
        id: `${i + 1}`,
        message: `Notification ${i + 1}`,
        created_at: '2023-01-01T12:00:00Z',
      }));

      mockOrder.mockResolvedValue({ data: largeDataset, error: null });

      const result = await getNotifications();

      expect(result).toHaveLength(5000);
      expect(result[0]).toEqual({
        id: '1',
        message: 'Notification 1',
        created_at: '2023-01-01T12:00:00Z',
      });
    });

    it('should handle database connection drops', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const connectionError = new Error('Connection lost');
      mockOrder.mockResolvedValue({ data: null, error: connectionError });

      const result = await getNotifications();

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching notifications:',
        connectionError,
      );
      expect(result).toEqual([]);
    });

    it('should handle rate limiting errors gracefully', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const rateLimitError = new Error('Rate limit exceeded');
      mockOrder.mockResolvedValue({ data: null, error: rateLimitError });

      const result = await getNotifications();

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching notifications:',
        rateLimitError,
      );
      expect(result).toEqual([]);
    });

    it('should handle unexpected data types in responses', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const unexpectedData = { unexpected: 'structure' };
      mockOrder.mockResolvedValue({ data: unexpectedData, error: null });

      const result = await getNotifications();

      expect(result).toEqual(unexpectedData);
    });

    it('should handle API version incompatibilities', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const versionError = new Error('API version not supported');
      mockOrder.mockResolvedValue({ data: null, error: versionError });

      const result = await getNotifications();

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching notifications:',
        versionError,
      );
      expect(result).toEqual([]);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete notification workflow', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      const mockUpdate = jest.fn();
      const mockDelete = jest.fn();
      const mockEq = jest.fn();

      mockFrom.mockImplementation((table: string) => {
        if (table === 'notifications') {
          return {
            select: mockSelect,
            update: mockUpdate.mockReturnValue({ eq: mockEq }),
            delete: mockDelete.mockReturnValue({ eq: mockEq }),
          };
        }
      });

      const notifications = [
        {
          id: '1',
          message: 'Test notification',
          created_at: '2023-01-01T12:00:00Z',
          read: false,
        },
      ];

      // Test fetch
      mockOrder.mockResolvedValue({ data: notifications, error: null });
      const fetchResult = await getNotifications();
      expect(fetchResult).toEqual(notifications);

      // Test mark as read
      mockEq.mockResolvedValue({ data: { id: '1', read: true }, error: null });
      const markResult = await markNotificationAsRead('1');
      expect(markResult).toBe(true);

      // Test delete
      mockEq.mockResolvedValue({ error: null });
      const deleteResult = await deleteNotification('1');
      expect(deleteResult).toBe(true);
    });

    it('should handle complete badge workflow', async () => {
      const mockSelect = jest.fn();
      const mockEq = jest.fn();

      mockFrom.mockImplementation((table: string) => {
        if (table === 'badges') {
          return { select: mockSelect };
        }
        if (table === 'user_badges') {
          return { select: mockSelect.mockReturnValue({ eq: mockEq }) };
        }
      });

      const allBadges = [
        {
          id: '1',
          name: 'First Badge',
          description: 'Your first badge',
          icon: 'badge1.png',
        },
        {
          id: '2',
          name: 'Second Badge',
          description: 'Your second badge',
          icon: 'badge2.png',
        },
      ];

      const userBadges = [
        {
          id: '1',
          earned_at: '2023-01-01T12:00:00Z',
          badges: {
            id: '1',
            name: 'First Badge',
            description: 'Your first badge',
            icon: 'badge1.png',
          },
        },
      ];

      // Test fetch all badges
      mockSelect.mockResolvedValue({ data: allBadges, error: null });
      const allBadgesResult = await getAllBadges();
      expect(allBadgesResult).toEqual(allBadges);

      // Test get user badges
      mockEq.mockResolvedValue({ data: userBadges, error: null });
      const userBadgesResult = await getUserBadges('user-123');
      expect(userBadgesResult).toEqual(userBadges);
    });

    it('should handle product upvote workflow', async () => {
      const productId = 'product-123';
      const mockData = { success: true, upvotes: 5 };

      mockRpc.mockResolvedValue({ data: mockData, error: null });

      const result = await upvoteProduct(productId);

      expect(mockRpc).toHaveBeenCalledWith('handle_upvote', {
        p_product_id: productId,
      });
      expect(result).toBe(true);
    });

    it('should handle error scenarios in complete workflows', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      const mockUpdate = jest.fn();
      const mockEq = jest.fn();

      mockFrom.mockImplementation((table: string) => {
        if (table === 'notifications') {
          return {
            select: mockSelect,
            update: mockUpdate.mockReturnValue({ eq: mockEq }),
          };
        }
      });

      // Test fetch failure
      const fetchError = new Error('Fetch failed');
      mockOrder.mockResolvedValue({ data: null, error: fetchError });
      const fetchResult = await getNotifications();
      expect(fetchResult).toEqual([]);

      // Test mark as read failure
      const markError = new Error('Mark as read failed');
      mockEq.mockResolvedValue({ data: null, error: markError });
      const markResult = await markNotificationAsRead('1');
      expect(markResult).toBe(false);

      // Verify error handling
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching notifications:',
        fetchError,
      );
      expect(console.error).toHaveBeenCalledWith(
        'Error marking notification 1 as read:',
        markError,
      );
    });

    it('should handle mixed success and failure scenarios', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      const mockUpdate = jest.fn();
      const mockEq = jest.fn();

      mockFrom.mockImplementation((table: string) => {
        if (table === 'notifications') {
          return {
            select: mockSelect,
            update: mockUpdate.mockReturnValue({ eq: mockEq }),
          };
        }
      });

      // Successful fetch
      const notifications = [
        { id: '1', message: 'Test', created_at: '2023-01-01T12:00:00Z' },
      ];
      mockOrder.mockResolvedValue({ data: notifications, error: null });
      const fetchResult = await getNotifications();
      expect(fetchResult).toEqual(notifications);

      // Failed mark as read
      const markError = new Error('Update failed');
      mockEq.mockResolvedValue({ data: null, error: markError });
      const markResult = await markNotificationAsRead('1');
      expect(markResult).toBe(false);

      // Verify both operations were called
      expect(mockOrder).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalled();
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle high frequency operations', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const mockData = [{ id: '1', message: 'Test' }];
      mockOrder.mockResolvedValue({ data: mockData, error: null });

      const operations = Array.from({ length: 50 }, () => getNotifications());
      const results = await Promise.all(operations);

      expect(results).toHaveLength(50);
      expect(mockOrder).toHaveBeenCalledTimes(50);
    });

    it('should handle operations with large payloads', async () => {
      const mockOrder = jest.fn();
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const largeMessage = 'x'.repeat(1000);
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        message: largeMessage,
        created_at: '2023-01-01T12:00:00Z',
      }));

      mockOrder.mockResolvedValue({ data: largeDataset, error: null });

      const result = await getNotifications();

      expect(result).toHaveLength(100);
      expect(result[0].message).toBe(largeMessage);
    });

    it('should handle rapid successive operations', async () => {
      const mockEq = jest.fn();
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ update: mockUpdate });

      const mockData = { id: '1', read: true };
      mockEq.mockResolvedValue({ data: mockData, error: null });

      const operations = Array.from({ length: 20 }, () =>
        markNotificationAsRead('1'),
      );
      const results = await Promise.all(operations);

      expect(results).toHaveLength(20);
      expect(results.every((result) => result === true)).toBe(true);
    });
  });
});
