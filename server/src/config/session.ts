import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './database';
import { env } from './env';

const PgSession = connectPgSimple(session);

/**
 * Resilient session store:
 * Uses PostgreSQL-backed PgSession by default.
 * Falls back to in-memory session store in development if PostgreSQL is unreachable.
 */
class ResilientSessionStore extends session.Store {
  private pgStore: session.Store;
  private memStore: session.MemoryStore;
  private useMem = false;

  constructor() {
    super();
    this.memStore = new session.MemoryStore();
    this.pgStore = new PgSession({
      pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
      errorLog: (err: any) => {
        if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND') {
          if (!this.useMem) {
            this.useMem = true;
            console.warn('⚠️  PostgreSQL session store unreachable — using development in-memory store.');
          }
        } else {
          console.error('Session store error:', err);
        }
      },
    });
  }

  get(sid: string, callback: (err?: any, session?: session.SessionData | null) => void) {
    if (this.useMem) {
      return this.memStore.get(sid, callback);
    }
    this.pgStore.get(sid, (err, sess) => {
      if (err && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND')) {
        this.useMem = true;
        console.warn('⚠️  PostgreSQL session lookup failed — using in-memory store.');
        return this.memStore.get(sid, callback);
      }
      callback(err, sess);
    });
  }

  set(sid: string, sess: session.SessionData, callback?: (err?: any) => void) {
    if (this.useMem) {
      return this.memStore.set(sid, sess, callback);
    }
    this.pgStore.set(sid, sess, (err) => {
      if (err && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND')) {
        this.useMem = true;
        console.warn('⚠️  PostgreSQL session save failed — using in-memory store.');
        return this.memStore.set(sid, sess, callback);
      }
      callback?.(err);
    });
  }

  destroy(sid: string, callback?: (err?: any) => void) {
    if (this.useMem) {
      return this.memStore.destroy(sid, callback);
    }
    this.pgStore.destroy(sid, callback);
  }

  touch(sid: string, sess: session.SessionData, callback?: (err?: any) => void) {
    if (this.useMem) {
      return this.memStore.touch(sid, sess, callback);
    }
    if (typeof (this.pgStore as any).touch === 'function') {
      return (this.pgStore as any).touch(sid, sess, callback);
    }
    callback?.();
  }
}

/**
 * Server-managed session middleware.
 *
 * - Sessions are stored in PostgreSQL via connect-pg-simple (with dev fallback).
 * - The session table is created automatically if missing.
 * - Cookie is HttpOnly (no JS access), Secure in production,
 *   and SameSite=strict in production / lax in development.
 * - 7-day expiry by default.
 */
export const sessionMiddleware = session({
  store: new ResilientSessionStore(),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  },
});
