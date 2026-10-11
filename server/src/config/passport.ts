import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env';
import { findOrCreateGoogleUser } from '../services/auth.service';

/**
 * Configure Passport with the Google OAuth 2.0 strategy.
 *
 * We use the server-side authorization-code flow:
 *   1. User clicks "Continue with Google" → browser navigates to /api/auth/google
 *   2. Passport redirects to Google's consent screen
 *   3. Google redirects back to /api/auth/google/callback with an auth code
 *   4. Passport exchanges the code for tokens server-side
 *   5. We extract profile info and find/create the HireMate user
 *   6. The route handler creates an express-session and redirects to the dashboard
 *
 * Only configured if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set.
 * This allows the app to start without Google credentials (email/password still works).
 */
export function configurePassport(): void {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    console.warn(
      '⚠️  Google OAuth credentials not configured — Google sign-in will be unavailable.'
    );
    console.warn(
      '   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable it.'
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(
              new Error('No email address returned from Google'),
              undefined
            );
          }

          const user = await findOrCreateGoogleUser({
            googleId: profile.id,
            email,
            name: profile.displayName || email.split('@')[0],
            avatarUrl: profile.photos?.[0]?.value,
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  console.log('✅ Google OAuth strategy configured');
}
