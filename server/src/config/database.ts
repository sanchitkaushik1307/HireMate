import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../models/schema';
import { env } from './env';

/** Shared connection pool — used by Drizzle ORM and the session store */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/** Drizzle ORM instance with full schema awareness */
export const db = drizzle(pool, { schema });

/**
 * Test the database connection at startup.
 * Exits the process if PostgreSQL is unreachable.
 */
export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    console.error('   Make sure PostgreSQL is running and DATABASE_URL is correct.');
    process.exit(1);
  }
}
