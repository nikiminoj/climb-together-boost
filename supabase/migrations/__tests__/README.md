# Database Migration Tests

This directory contains comprehensive unit tests for the `init_001.sql` migration file.

## Overview

The test suite validates:

- **Database Schema**: Table creation, column definitions, data types, and constraints
- **Row Level Security (RLS)**: Policy creation and enforcement
- **Foreign Key Relationships**: Referential integrity and CASCADE behavior
- **Unique Constraints**: Prevention of duplicate records
- **Default Values**: Proper application of column defaults
- **Functions**: PL/pgSQL function creation and behavior
- **Error Handling**: Graceful handling of various error scenarios
- **Performance**: Index creation and optimization validation

## Test Framework

This project uses **Vitest** as the testing framework with the following configuration:

- **Environment**: Node.js
- **Global Functions**: Enabled for `describe`, `it`, `expect`, etc.
- **Mocking**: Vitest's built-in `vi` mocking utilities
- **Coverage**: V8 provider with text, HTML, and JSON reporters

## Running Tests

```bash
# Run all tests
npm test

# Run migration tests specifically
npm run test:migrations

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Structure

### Schema Validation
- Table creation with correct column types
- Primary key and foreign key constraints
- Unique constraints and indexes
- Default value application

### Security Testing
- RLS policy creation and enforcement
- Authentication context validation
- Permission-based access control

### Function Testing
- PL/pgSQL function creation
- Parameter validation
- ON CONFLICT clause behavior
- Duplicate function definition detection

### Error Handling
- Database connection failures
- Invalid UUID formats
- Foreign key violations
- Unique constraint violations
- Permission denied scenarios

### Performance Testing
- Index creation on foreign key columns
- CASCADE delete behavior
- Timestamp timezone handling

## Mock Implementation

The tests use a comprehensive mock of the Supabase client that simulates:

- RPC function calls for schema inspection
- Authentication context (`auth.uid()`)
- Database query responses
- Error scenarios and edge cases

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Use descriptive test names that explain the expected behavior
3. Include both happy path and error scenarios
4. Use the provided test fixtures for consistent data
5. Mock external dependencies appropriately

## Notes

- Tests are designed to validate the migration file structure, not execute actual database operations
- The test suite uses mocking to simulate database responses
- All tests should be deterministic and not depend on external state
- Error scenarios are thoroughly tested to ensure robust error handling