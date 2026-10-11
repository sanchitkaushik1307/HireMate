/**
 * Database setup script.
 *
 * Run with: npx tsx src/scripts/setup-db.ts
 *
 * This script:
 * 1. Tests the PostgreSQL connection
 * 2. Pushes the Drizzle schema (creates tables if they don't exist)
 */

import { env, validateEnv } from '../config/env';
import { pool, testConnection } from '../config/database';
import { sql } from 'drizzle-orm';
import { db } from '../config/database';
import { users } from '../models/schema';

async function setup() {
  console.log('🔧 HireMate Database Setup\n');

  // Validate env
  validateEnv();
  console.log(`   Database: ${env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')}\n`);

  // Test connection
  await testConnection();

  // Create users table using raw SQL (matching our Drizzle schema)
  console.log('📦 Creating tables...\n');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT,
      google_id VARCHAR(255) UNIQUE,
      avatar_url TEXT,
      email_verified BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('   ✅ users table ready');

  // Session table is auto-created by connect-pg-simple, but let's create it now
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      sid VARCHAR NOT NULL COLLATE "default",
      sess JSON NOT NULL,
      expire TIMESTAMP(6) NOT NULL,
      PRIMARY KEY (sid)
    );
    CREATE INDEX IF NOT EXISTS idx_session_expire ON user_sessions (expire);
  `);
  console.log('   ✅ user_sessions table ready');

  // Career profiles table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS career_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      target_roles JSONB NOT NULL DEFAULT '[]'::jsonb,
      opportunity_type VARCHAR(50),
      preferred_locations JSONB NOT NULL DEFAULT '[]'::jsonb,
      work_arrangement VARCHAR(50),
      skills JSONB NOT NULL DEFAULT '[]'::jsonb,
      education JSONB NOT NULL DEFAULT '{}'::jsonb,
      experience_level VARCHAR(50),
      projects JSONB NOT NULL DEFAULT '[]'::jsonb,
      onboarding_step INTEGER NOT NULL DEFAULT 1,
      onboarding_completed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_career_profiles_user_id ON career_profiles (user_id);
  `);
  console.log('   ✅ career_profiles table ready');

  // Resumes table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS resumes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      file_name VARCHAR(255) NOT NULL,
      storage_key VARCHAR(255) NOT NULL UNIQUE,
      mime_type VARCHAR(100) NOT NULL,
      file_size INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes (user_id);
  `);
  console.log('   ✅ resumes table ready');

  // Verify
  const result = await pool.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  console.log('\n📋 Tables in database:');
  for (const row of result.rows) {
    console.log(`   - ${row.table_name}`);
  }

  console.log('\n✅ Database setup complete!\n');
  await pool.end();
  process.exit(0);
}

setup().catch((err) => {
  console.error('\n❌ Setup failed:', err.message);
  process.exit(1);
});
