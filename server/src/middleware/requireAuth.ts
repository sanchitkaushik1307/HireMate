import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../services/auth.service';

/**
 * Express middleware that protects routes requiring authentication.
 *
 * Reads the userId from the server-managed session, looks up the user,
 * and attaches them to `req.user`. Returns 401 if the session is
 * missing, expired, or references a deleted user.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.session?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const user = await findUserById(userId);

    if (!user) {
      // Session references a user that no longer exists
      req.session.destroy(() => {});
      res.status(401).json({ error: 'Session expired. Please sign in again.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
