import { vi, beforeEach, afterEach } from 'vitest'

// Global test setup for database migration tests
beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

// Mock Supabase client utilities
export const createMockSupabaseClient = () => {
  return {
    rpc: vi.fn(),
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
      uid: vi.fn()
    },
    sql: vi.fn()
  }
}

// Common validation utilities for database schema testing
export const validateTableExists = async (client: any, tableName: string) => {
  const result = await client.rpc('check_table_exists', { table_name: tableName })
  return result.data
}

export const validateColumnExists = async (client: any, tableName: string, columnName: string) => {
  const result = await client.rpc('check_column_exists', { 
    table_name: tableName, 
    column_name: columnName 
  })
  return result.data
}

export const validateConstraintExists = async (client: any, tableName: string, constraintType: string) => {
  const result = await client.rpc('check_constraint_exists', { 
    table_name: tableName, 
    constraint_type: constraintType 
  })
  return result.data
}

export const validatePolicyExists = async (client: any, tableName: string, policyName: string) => {
  const result = await client.rpc('check_policy_exists', { 
    table_name: tableName, 
    policy_name: policyName 
  })
  return result.data
}

// Test fixtures for consistent test data
export const testFixtures = {
  mockUserId: '123e4567-e89b-12d3-a456-426614174000',
  mockProductId: '987fcdeb-51a2-43d1-b789-123456789abc',
  mockBadgeId: '456789ab-cdef-1234-5678-9abcdef01234',
  mockNotificationId: '789abc12-3456-789a-bcde-f0123456789a',
  
  sampleNotification: {
    id: '789abc12-3456-789a-bcde-f0123456789a',
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    type: 'achievement',
    message: 'You earned a new badge!',
    read: false,
    created_at: '2023-01-01T00:00:00Z',
    link: '/badges/1'
  },
  
  sampleBadge: {
    id: '456789ab-cdef-1234-5678-9abcdef01234',
    name: 'First Upload',
    description: 'Uploaded your first product',
    icon: 'upload-icon.svg'
  },
  
  sampleUserBadge: {
    id: 'user-badge-123',
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    badge_id: '456789ab-cdef-1234-5678-9abcdef01234',
    earned_at: '2023-01-01T00:00:00Z'
  }
}

// Common error scenarios for testing
export const errorScenarios = {
  databaseConnectionError: new Error('Database connection failed'),
  invalidUUIDError: { 
    message: 'invalid input syntax for type uuid', 
    code: '22P02' 
  },
  foreignKeyViolation: { 
    message: 'insert or update violates foreign key constraint', 
    code: '23503' 
  },
  uniqueConstraintViolation: { 
    message: 'duplicate key value violates unique constraint', 
    code: '23505' 
  },
  notNullViolation: { 
    message: 'null value in column violates not-null constraint', 
    code: '23502' 
  },
  permissionDenied: { 
    message: 'permission denied', 
    code: '42501' 
  }
}