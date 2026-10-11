import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { env, validateEnv } from './config/env';
import { testConnection } from './config/database';
import { sessionMiddleware } from './config/session';
import { configurePassport } from './config/passport';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import profileRoutes from './routes/profile.routes';

// Import type augmentations
import './types';

// ─── Validate environment ────────────────────────
validateEnv();

// ─── Create Express app ──────────────────────────
const app = express();

// ─── Global middleware ───────────────────────────

// CORS — allow the frontend origin with credentials (cookies)
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Server-managed sessions (PostgreSQL-backed)
app.use(sessionMiddleware);

// Passport initialization (no passport sessions — we use express-session directly)
app.use(passport.initialize());
configurePassport();

// ─── Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global error handling middleware ─────────────
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('❌ Unhandled application error:', err?.message || err);
    if (res.headersSent) {
      return;
    }
    if (req.accepts('html') && req.path.startsWith('/api/auth/')) {
      res.redirect(`${env.CLIENT_URL}/login?error=google_auth_failed`);
      return;
    }
    res.status(500).json({ error: 'An unexpected internal error occurred' });
  }
);

// ─── Start ───────────────────────────────────────
async function start(): Promise<void> {
  await testConnection();

  app.listen(env.PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log('  ║                                          ║');
    console.log(`  ║   🚀 HireMate API — http://localhost:${env.PORT}  ║`);
    console.log(`  ║   📋 Environment: ${env.NODE_ENV.padEnd(22)}║`);
    console.log('  ║                                          ║');
    console.log('  ╚══════════════════════════════════════════╝');
    console.log('');
  });
}

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
