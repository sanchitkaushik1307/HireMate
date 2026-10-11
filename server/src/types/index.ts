import { type InferSelectModel } from 'drizzle-orm';
import { type users } from '../models/schema';

// ─── User types ──────────────────────────────────

/** Full user row from the database */
export type User = InferSelectModel<typeof users>;

/** User object safe to send to the client (no password hash) */
export type SafeUser = Omit<User, 'passwordHash'>;

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends SafeUser {}
  }
}
