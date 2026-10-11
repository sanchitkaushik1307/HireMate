import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { register, login, logout, me } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/requireAuth';
import { env } from '../config/env';
import type { SafeUser } from '../types';

const router = Router();

// ─── Email / Password ────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ─── Protected ───────────────────────────────────
router.get('/me', requireAuth, me);

// ─── Google OAuth ────────────────────────────────

/**
 * GET /api/auth/google
 * Redirect the user to Google's consent screen.
 * Returns 503 if Google credentials aren't configured.
 */
router.get('/google', (req: Request, res: Response, next: NextFunction) => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    res.status(503).json({
      error: 'Google sign-in is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
    });
    return;
  }

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false, // We manage sessions ourselves
  })(req, res, next);
});

/**
 * GET /api/auth/google/callback
 * Handle Google's redirect after user consents.
 * Creates an express-session and redirects to the frontend dashboard.
 */
router.get(
  '/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    // 1. Handle error directly returned in query parameters from Google (e.g. access_denied)
    if (req.query.error) {
      console.warn(`[OAuth] Google redirected with query error: ${req.query.error}`);
      res.redirect(`${env.CLIENT_URL}/login?error=google_auth_failed`);
      return;
    }

    // 2. Invoke Passport with a custom callback to intercept TokenErrors, strategy errors, and db failures
    passport.authenticate(
      'google',
      { session: false },
      (err: Error | null, user: SafeUser | false, info?: { message?: string }) => {
        if (err) {
          console.error('[OAuth] Google authentication error:', err.message || err);
          res.redirect(`${env.CLIENT_URL}/login?error=google_auth_failed`);
          return;
        }

        if (!user) {
          console.warn('[OAuth] Google authentication failed: No user returned', info?.message || '');
          res.redirect(`${env.CLIENT_URL}/login?error=google_auth_failed`);
          return;
        }

        // 3. Create session and persist securely
        req.session.userId = user.id;
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('[OAuth] Session save error after Google auth:', saveErr.message || saveErr);
            res.redirect(`${env.CLIENT_URL}/login?error=session_error`);
            return;
          }
          console.log(`[OAuth] Successfully authenticated user: ${user.id}`);
          res.redirect(`${env.CLIENT_URL}/dashboard`);
        });
      }
    )(req, res, next);
  }
);

export default router;
