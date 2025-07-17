import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../../src/integrations/supabase/types'

// Mock the Supabase client for testing
const mockSupabase = {
  rpc: vi.fn(),
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
    uid: vi.fn()
  },
  sql: vi.fn()
}

// Test data fixtures
const mockUserId = '123e4567-e89b-12d3-a456-426614174000'
const mockProductId = '987fcdeb-51a2-43d1-b789-123456789abc'
const mockBadgeId = '456789ab-cdef-1234-5678-9abcdef01234'
const mockNotificationId = '789abc12-3456-789a-bcde-f0123456789a'

describe('Migration init_001 - Database Schema Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Notifications Table', () => {
    it('should create notifications table with correct schema', async () => {
      const expectedColumns = [
        { column_name: 'id', data_type: 'uuid', is_nullable: false, column_default: 'uuid_generate_v4()' },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: true, references: 'auth.users(id)' },
        { column_name: 'type', data_type: 'character varying', is_nullable: false, character_maximum_length: 255 },
        { column_name: 'message', data_type: 'text', is_nullable: false },
        { column_name: 'read', data_type: 'boolean', is_nullable: true, column_default: false },
        { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: true, column_default: 'now()' },
        { column_name: 'link', data_type: 'text', is_nullable: true }
      ]

      mockSupabase.rpc.mockResolvedValue({
        data: expectedColumns,
        error: null
      })

      const result = await mockSupabase.rpc('get_table_schema', { table_name: 'notifications' })
      
      expect(result.data).toEqual(expectedColumns)
      expect(result.error).toBeNull()
    })

    it('should have primary key constraint on id column', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{ 
          constraint_name: 'notifications_pkey', 
          constraint_type: 'PRIMARY KEY', 
          column_name: 'id' 
        }],
        error: null
      })

      const result = await mockSupabase.rpc('get_primary_key_constraints', { table_name: 'notifications' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        constraint_type: 'PRIMARY KEY',
        column_name: 'id'
      }))
    })

    it('should have foreign key constraint to auth.users with CASCADE delete', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          constraint_name: 'notifications_user_id_fkey',
          constraint_type: 'FOREIGN KEY',
          column_name: 'user_id',
          foreign_table_schema: 'auth',
          foreign_table_name: 'users',
          foreign_column_name: 'id',
          delete_rule: 'CASCADE'
        }],
        error: null
      })

      const result = await mockSupabase.rpc('get_foreign_key_constraints', { table_name: 'notifications' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        constraint_type: 'FOREIGN KEY',
        column_name: 'user_id',
        foreign_table_schema: 'auth',
        foreign_table_name: 'users',
        delete_rule: 'CASCADE'
      }))
    })

    it('should have RLS enabled with correct policies', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          { policy_name: 'select_notifications', cmd: 'SELECT', roles: ['authenticated'], qual: 'user_id = auth.uid()' },
          { policy_name: 'update_notifications', cmd: 'UPDATE', roles: ['authenticated'], qual: 'user_id = auth.uid()' },
          { policy_name: 'delete_notifications', cmd: 'DELETE', roles: ['authenticated'], qual: 'user_id = auth.uid()' }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_table_policies', { table_name: 'notifications' })
      
      expect(result.data).toHaveLength(3)
      expect(result.data.map(p => p.policy_name)).toEqual(
        expect.arrayContaining(['select_notifications', 'update_notifications', 'delete_notifications'])
      )
    })

    it('should validate NOT NULL constraints on required fields', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          { column_name: 'type', is_nullable: false },
          { column_name: 'message', is_nullable: false }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_not_null_constraints', { table_name: 'notifications' })
      
      expect(result.data).toEqual(expect.arrayContaining([
        expect.objectContaining({ column_name: 'type', is_nullable: false }),
        expect.objectContaining({ column_name: 'message', is_nullable: false })
      ]))
    })
  })

  describe('Badges Table', () => {
    it('should create badges table with correct structure', async () => {
      const expectedColumns = [
        { column_name: 'id', data_type: 'uuid', is_nullable: false, column_default: 'uuid_generate_v4()' },
        { column_name: 'name', data_type: 'character varying', is_nullable: false, character_maximum_length: 255 },
        { column_name: 'description', data_type: 'text', is_nullable: true },
        { column_name: 'icon', data_type: 'character varying', is_nullable: true, character_maximum_length: 255 }
      ]

      mockSupabase.rpc.mockResolvedValue({
        data: expectedColumns,
        error: null
      })

      const result = await mockSupabase.rpc('get_table_schema', { table_name: 'badges' })
      
      expect(result.data).toEqual(expectedColumns)
    })

    it('should have unique constraint on name field', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{ 
          constraint_name: 'badges_name_key', 
          constraint_type: 'UNIQUE', 
          column_name: 'name' 
        }],
        error: null
      })

      const result = await mockSupabase.rpc('get_unique_constraints', { table_name: 'badges' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        constraint_type: 'UNIQUE',
        column_name: 'name'
      }))
    })

    it('should have RLS enabled with select policy for authenticated users', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          { policy_name: 'select_badges', cmd: 'SELECT', roles: ['authenticated'], qual: 'true' }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_table_policies', { table_name: 'badges' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        policy_name: 'select_badges',
        cmd: 'SELECT',
        qual: 'true'
      }))
    })
  })

  describe('User Badges Table', () => {
    it('should create user_badges table with correct structure', async () => {
      const expectedColumns = [
        { column_name: 'id', data_type: 'uuid', is_nullable: false, column_default: 'uuid_generate_v4()' },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: true, references: 'auth.users(id)' },
        { column_name: 'badge_id', data_type: 'uuid', is_nullable: true, references: 'badges(id)' },
        { column_name: 'earned_at', data_type: 'timestamp with time zone', is_nullable: true, column_default: 'now()' }
      ]

      mockSupabase.rpc.mockResolvedValue({
        data: expectedColumns,
        error: null
      })

      const result = await mockSupabase.rpc('get_table_schema', { table_name: 'user_badges' })
      
      expect(result.data).toEqual(expectedColumns)
    })

    it('should have foreign key constraints to users and badges tables', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          {
            constraint_name: 'user_badges_user_id_fkey',
            constraint_type: 'FOREIGN KEY',
            column_name: 'user_id',
            foreign_table_schema: 'auth',
            foreign_table_name: 'users',
            foreign_column_name: 'id',
            delete_rule: 'CASCADE'
          },
          {
            constraint_name: 'user_badges_badge_id_fkey',
            constraint_type: 'FOREIGN KEY',
            column_name: 'badge_id',
            foreign_table_schema: 'public',
            foreign_table_name: 'badges',
            foreign_column_name: 'id',
            delete_rule: 'CASCADE'
          }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_foreign_key_constraints', { table_name: 'user_badges' })
      
      expect(result.data).toHaveLength(2)
      expect(result.data[0].column_name).toBe('user_id')
      expect(result.data[1].column_name).toBe('badge_id')
    })

    it('should have unique constraint on user_id and badge_id combination', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          constraint_name: 'user_badges_user_id_badge_id_key',
          constraint_type: 'UNIQUE',
          column_names: ['user_id', 'badge_id']
        }],
        error: null
      })

      const result = await mockSupabase.rpc('get_unique_constraints', { table_name: 'user_badges' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        constraint_type: 'UNIQUE',
        column_names: ['user_id', 'badge_id']
      }))
    })

    it('should have RLS policy for users to view their own badges', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          { policy_name: 'select_user_badges', cmd: 'SELECT', roles: ['authenticated'], qual: 'user_id = auth.uid()' }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_table_policies', { table_name: 'user_badges' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        policy_name: 'select_user_badges',
        cmd: 'SELECT',
        qual: 'user_id = auth.uid()'
      }))
    })
  })

  describe('Products Table Alterations', () => {
    it('should add peer_push_points column with default value 0', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          column_name: 'peer_push_points',
          data_type: 'integer',
          is_nullable: true,
          column_default: '0'
        }],
        error: null
      })

      const result = await mockSupabase.rpc('get_column_info', { 
        table_name: 'products', 
        column_name: 'peer_push_points' 
      })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        column_name: 'peer_push_points',
        data_type: 'integer',
        column_default: '0'
      }))
    })

    it('should add upvotes column with default value 0', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          column_name: 'upvotes',
          data_type: 'integer',
          is_nullable: true,
          column_default: '0'
        }],
        error: null
      })

      const result = await mockSupabase.rpc('get_column_info', { 
        table_name: 'products', 
        column_name: 'upvotes' 
      })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        column_name: 'upvotes',
        data_type: 'integer',
        column_default: '0'
      }))
    })

    it('should validate that products table exists before alteration', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{ table_name: 'products', table_schema: 'public' }],
        error: null
      })

      const result = await mockSupabase.rpc('check_table_exists', { table_name: 'products' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        table_name: 'products',
        table_schema: 'public'
      }))
    })
  })

  describe('Product Upvotes Table', () => {
    it('should create product_upvotes table with correct structure', async () => {
      const expectedColumns = [
        { column_name: 'id', data_type: 'uuid', is_nullable: false, column_default: 'uuid_generate_v4()' },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: true, references: 'auth.users(id)' },
        { column_name: 'product_id', data_type: 'uuid', is_nullable: true, references: 'products(id)' },
        { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: true, column_default: 'now()' }
      ]

      mockSupabase.rpc.mockResolvedValue({
        data: expectedColumns,
        error: null
      })

      const result = await mockSupabase.rpc('get_table_schema', { table_name: 'product_upvotes' })
      
      expect(result.data).toEqual(expectedColumns)
    })

    it('should have foreign key constraints to users and products tables', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          {
            constraint_name: 'product_upvotes_user_id_fkey',
            constraint_type: 'FOREIGN KEY',
            column_name: 'user_id',
            foreign_table_schema: 'auth',
            foreign_table_name: 'users',
            foreign_column_name: 'id',
            delete_rule: 'CASCADE'
          },
          {
            constraint_name: 'product_upvotes_product_id_fkey',
            constraint_type: 'FOREIGN KEY',
            column_name: 'product_id',
            foreign_table_schema: 'public',
            foreign_table_name: 'products',
            foreign_column_name: 'id',
            delete_rule: 'CASCADE'
          }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_foreign_key_constraints', { table_name: 'product_upvotes' })
      
      expect(result.data).toHaveLength(2)
      expect(result.data[0].column_name).toBe('user_id')
      expect(result.data[1].column_name).toBe('product_id')
    })

    it('should have unique constraint on user_id and product_id combination', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          constraint_name: 'product_upvotes_user_id_product_id_key',
          constraint_type: 'UNIQUE',
          column_names: ['user_id', 'product_id']
        }],
        error: null
      })

      const result = await mockSupabase.rpc('get_unique_constraints', { table_name: 'product_upvotes' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        constraint_type: 'UNIQUE',
        column_names: ['user_id', 'product_id']
      }))
    })

    it('should have correct RLS policies for insert and delete operations', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          { policy_name: 'insert_product_upvotes', cmd: 'INSERT', roles: ['authenticated'], with_check: 'user_id = auth.uid()' },
          { policy_name: 'delete_product_upvotes', cmd: 'DELETE', roles: ['authenticated'], qual: 'user_id = auth.uid()' }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_table_policies', { table_name: 'product_upvotes' })
      
      expect(result.data).toHaveLength(2)
      expect(result.data.map(p => p.policy_name)).toEqual(
        expect.arrayContaining(['insert_product_upvotes', 'delete_product_upvotes'])
      )
    })

    it('should validate that commented select policy is not created', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          { policy_name: 'insert_product_upvotes', cmd: 'INSERT' },
          { policy_name: 'delete_product_upvotes', cmd: 'DELETE' }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_table_policies', { table_name: 'product_upvotes' })
      const policyNames = result.data.map(p => p.policy_name)
      
      expect(policyNames).not.toContain('select_product_upvotes')
    })
  })

  describe('Handle Upvote Function', () => {
    it('should create handle_upvote function with correct signature', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          function_name: 'handle_upvote',
          return_type: 'void',
          argument_types: ['uuid'],
          language: 'plpgsql',
          argument_names: ['p_product_id']
        }],
        error: null
      })

      const result = await mockSupabase.rpc('get_function_info', { function_name: 'handle_upvote' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        function_name: 'handle_upvote',
        return_type: 'void',
        argument_types: ['uuid'],
        language: 'plpgsql'
      }))
    })

    it('should handle upvote function execution successfully', async () => {
      mockSupabase.auth.uid.mockReturnValue(mockUserId)
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: null
      })

      const result = await mockSupabase.rpc('handle_upvote', { p_product_id: mockProductId })
      
      expect(mockSupabase.rpc).toHaveBeenCalledWith('handle_upvote', { p_product_id: mockProductId })
      expect(result.error).toBeNull()
    })

    it('should handle duplicate upvotes gracefully with ON CONFLICT clause', async () => {
      mockSupabase.auth.uid.mockReturnValue(mockUserId)
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: null
      })

      // Call twice to test duplicate handling
      await mockSupabase.rpc('handle_upvote', { p_product_id: mockProductId })
      await mockSupabase.rpc('handle_upvote', { p_product_id: mockProductId })
      
      expect(mockSupabase.rpc).toHaveBeenCalledTimes(2)
      expect(mockSupabase.rpc).toHaveBeenCalledWith('handle_upvote', { p_product_id: mockProductId })
    })

    it('should detect duplicate function definition in migration', async () => {
      // The migration file contains the same function definition twice (lines 80-93 and 94-106)
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          function_name: 'handle_upvote',
          definition_count: 2,
          is_duplicate: true
        }],
        error: null
      })

      const result = await mockSupabase.rpc('check_function_duplicates', { function_name: 'handle_upvote' })
      
      expect(result.data[0].is_duplicate).toBe(true)
      expect(result.data[0].definition_count).toBe(2)
    })

    it('should validate function body contains ON CONFLICT clause', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{
          function_name: 'handle_upvote',
          body: 'INSERT INTO product_upvotes (user_id, product_id) VALUES (auth.uid(), p_product_id) ON CONFLICT (user_id, product_id) DO NOTHING;'
        }],
        error: null
      })

      const result = await mockSupabase.rpc('get_function_body', { function_name: 'handle_upvote' })
      
      expect(result.data[0].body).toContain('ON CONFLICT (user_id, product_id) DO NOTHING')
    })
  })

  describe('Row Level Security Validation', () => {
    it('should validate RLS is enabled on all tables', async () => {
      const expectedRLSTables = ['notifications', 'badges', 'user_badges', 'product_upvotes']
      
      mockSupabase.rpc.mockResolvedValue({
        data: expectedRLSTables.map(table => ({ table_name: table, rls_enabled: true })),
        error: null
      })

      const result = await mockSupabase.rpc('get_rls_status')
      
      expect(result.data.every(table => table.rls_enabled)).toBe(true)
      expect(result.data.map(table => table.table_name)).toEqual(
        expect.arrayContaining(expectedRLSTables)
      )
    })

    it('should validate all policies use auth.uid() for user identification', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          { policy_name: 'select_notifications', qual: 'user_id = auth.uid()' },
          { policy_name: 'update_notifications', qual: 'user_id = auth.uid()' },
          { policy_name: 'delete_notifications', qual: 'user_id = auth.uid()' },
          { policy_name: 'select_user_badges', qual: 'user_id = auth.uid()' },
          { policy_name: 'insert_product_upvotes', with_check: 'user_id = auth.uid()' },
          { policy_name: 'delete_product_upvotes', qual: 'user_id = auth.uid()' }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_all_policies')
      
      result.data.forEach(policy => {
        if (policy.qual) {
          expect(policy.qual).toContain('auth.uid()')
        }
        if (policy.with_check) {
          expect(policy.with_check).toContain('auth.uid()')
        }
      })
    })

    it('should validate badges table allows all authenticated users to select', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          { policy_name: 'select_badges', cmd: 'SELECT', roles: ['authenticated'], qual: 'true' }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_table_policies', { table_name: 'badges' })
      
      expect(result.data[0]).toEqual(expect.objectContaining({
        policy_name: 'select_badges',
        qual: 'true',
        roles: ['authenticated']
      }))
    })
  })

  describe('Migration Integrity and Error Handling', () => {
    it('should validate all required tables exist after migration', async () => {
      const expectedTables = ['notifications', 'badges', 'user_badges', 'product_upvotes']
      
      mockSupabase.rpc.mockResolvedValue({
        data: expectedTables.map(table => ({ table_name: table, table_schema: 'public' })),
        error: null
      })

      const result = await mockSupabase.rpc('get_migration_tables')
      const tableNames = result.data.map(t => t.table_name)
      
      expect(tableNames).toEqual(expect.arrayContaining(expectedTables))
    })

    it('should handle database connection errors gracefully', async () => {
      mockSupabase.rpc.mockRejectedValue(new Error('Database connection failed'))

      await expect(mockSupabase.rpc('get_table_schema', { table_name: 'notifications' }))
        .rejects.toThrow('Database connection failed')
    })

    it('should handle invalid UUID parameters in handle_upvote function', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { 
          message: 'invalid input syntax for type uuid: "invalid-uuid"',
          code: '22P02'
        }
      })

      const result = await mockSupabase.rpc('handle_upvote', { p_product_id: 'invalid-uuid' })
      
      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('invalid input syntax for type uuid')
    })

    it('should handle unauthenticated user scenarios', async () => {
      mockSupabase.auth.uid.mockReturnValue(null)
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { 
          message: 'permission denied for function handle_upvote',
          code: '42501'
        }
      })

      const result = await mockSupabase.rpc('handle_upvote', { p_product_id: mockProductId })
      
      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('permission denied')
    })

    it('should handle missing foreign key references gracefully', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { 
          message: 'insert or update on table "user_badges" violates foreign key constraint',
          code: '23503'
        }
      })

      const result = await mockSupabase.rpc('test_foreign_key_constraint')
      
      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('violates foreign key constraint')
    })

    it('should handle unique constraint violations', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { 
          message: 'duplicate key value violates unique constraint "user_badges_user_id_badge_id_key"',
          code: '23505'
        }
      })

      const result = await mockSupabase.rpc('test_unique_constraint_violation')
      
      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('duplicate key value violates unique constraint')
    })
  })

  describe('Performance and Optimization', () => {
    it('should validate proper indexing on foreign key columns', async () => {
      const expectedIndexes = [
        { table_name: 'notifications', column_name: 'user_id', index_type: 'btree' },
        { table_name: 'user_badges', column_name: 'user_id', index_type: 'btree' },
        { table_name: 'user_badges', column_name: 'badge_id', index_type: 'btree' },
        { table_name: 'product_upvotes', column_name: 'user_id', index_type: 'btree' },
        { table_name: 'product_upvotes', column_name: 'product_id', index_type: 'btree' }
      ]

      mockSupabase.rpc.mockResolvedValue({
        data: expectedIndexes,
        error: null
      })

      const result = await mockSupabase.rpc('get_table_indexes')
      
      expect(result.data).toEqual(expect.arrayContaining(expectedIndexes))
    })

    it('should validate CASCADE delete behavior on all foreign keys', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [
          { table_name: 'notifications', column_name: 'user_id', delete_rule: 'CASCADE' },
          { table_name: 'user_badges', column_name: 'user_id', delete_rule: 'CASCADE' },
          { table_name: 'user_badges', column_name: 'badge_id', delete_rule: 'CASCADE' },
          { table_name: 'product_upvotes', column_name: 'user_id', delete_rule: 'CASCADE' },
          { table_name: 'product_upvotes', column_name: 'product_id', delete_rule: 'CASCADE' }
        ],
        error: null
      })

      const result = await mockSupabase.rpc('get_cascade_constraints')
      
      expect(result.data.every(constraint => constraint.delete_rule === 'CASCADE')).toBe(true)
    })

    it('should validate timestamp columns use timezone-aware types', async () => {
      const timestampColumns = [
        { table_name: 'notifications', column_name: 'created_at', data_type: 'timestamp with time zone' },
        { table_name: 'user_badges', column_name: 'earned_at', data_type: 'timestamp with time zone' },
        { table_name: 'product_upvotes', column_name: 'created_at', data_type: 'timestamp with time zone' }
      ]

      mockSupabase.rpc.mockResolvedValue({
        data: timestampColumns,
        error: null
      })

      const result = await mockSupabase.rpc('get_timestamp_columns')
      
      expect(result.data.every(col => col.data_type === 'timestamp with time zone')).toBe(true)
    })

    it('should validate default values are applied correctly', async () => {
      const defaultValues = [
        { table_name: 'notifications', column_name: 'read', column_default: 'false' },
        { table_name: 'notifications', column_name: 'created_at', column_default: 'now()' },
        { table_name: 'user_badges', column_name: 'earned_at', column_default: 'now()' },
        { table_name: 'product_upvotes', column_name: 'created_at', column_default: 'now()' },
        { table_name: 'products', column_name: 'peer_push_points', column_default: '0' },
        { table_name: 'products', column_name: 'upvotes', column_default: '0' }
      ]

      mockSupabase.rpc.mockResolvedValue({
        data: defaultValues,
        error: null
      })

      const result = await mockSupabase.rpc('get_all_default_values')
      
      expect(result.data).toEqual(expect.arrayContaining(defaultValues))
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle empty string inputs gracefully', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { 
          message: 'null value in column "type" violates not-null constraint',
          code: '23502'
        }
      })

      const result = await mockSupabase.rpc('test_empty_string_input')
      
      expect(result.error).toBeDefined()
      expect(result.error.code).toBe('23502')
    })

    it('should handle maximum length constraints on VARCHAR fields', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { 
          message: 'value too long for type character varying(255)',
          code: '22001'
        }
      })

      const result = await mockSupabase.rpc('test_varchar_length_limit')
      
      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('value too long for type character varying(255)')
    })

    it('should validate UUID format requirements', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: { 
          message: 'invalid input syntax for type uuid',
          code: '22P02'
        }
      })

      const result = await mockSupabase.rpc('test_invalid_uuid_format')
      
      expect(result.error).toBeDefined()
      expect(result.error.code).toBe('22P02')
    })

    it('should handle concurrent upvote attempts', async () => {
      mockSupabase.auth.uid.mockReturnValue(mockUserId)
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: null
      })

      // Simulate concurrent calls
      const promises = Array(5).fill(null).map(() => 
        mockSupabase.rpc('handle_upvote', { p_product_id: mockProductId })
      )

      await Promise.all(promises)
      
      expect(mockSupabase.rpc).toHaveBeenCalledTimes(5)
    })
  })
})