/**
 * Vitest Global Test Setup
 *
 * Runs once before all tests.
 * Sets up environment variables for test environment.
 * In future: can seed test database, mock external services, etc.
 */

import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Fallback test env values if .env.test doesn't exist
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:test@localhost:5432/quickkart_test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test_access_secret_for_testing_only';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_for_testing_only';

