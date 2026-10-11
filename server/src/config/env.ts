import dotenv from 'dotenv';
import path from 'path';

// Load .env from the project root (one level above /server)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL:
    process.env.GOOGLE_CALLBACK_URL ||
    'http://localhost:5000/api/auth/google/callback',

  // Session
  SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret-change-me',

  // Client
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
} as const;

/**
 * Validate that critical environment variables are present.
 * Exits the process in production if anything is missing.
 */
export function validateEnv(): void {
  const required: string[] = ['DATABASE_URL', 'SESSION_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(', ')}`
    );
    console.error('   Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }

  if (
    env.SESSION_SECRET === 'dev-secret-change-me' &&
    env.NODE_ENV === 'production'
  ) {
    console.error('❌ SESSION_SECRET must be changed in production');
    process.exit(1);
  }
}
