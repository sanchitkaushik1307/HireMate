import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

/**
 * POST /api/auth/register
 * Create a new email/password account and start a session.
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const result = await registerUser(name, email, password);

    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }

    // Create authenticated session
    req.session.userId = result.user!.id;

    res.status(201).json({ user: result.user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
}

/**
 * POST /api/auth/login
 * Authenticate with email/password and start a session.
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await loginUser(email, password);

    if (result.error) {
      res.status(401).json({ error: result.error });
      return;
    }

    // Create authenticated session
    req.session.userId = result.user!.id;

    res.json({ user: result.user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
}

/**
 * POST /api/auth/logout
 * Destroy the session and clear the cookie.
 */
export async function logout(req: Request, res: Response): Promise<void> {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Failed to log out' });
      return;
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
}

/**
 * GET /api/auth/me
 * Return the currently authenticated user (requires requireAuth middleware).
 */
export async function me(req: Request, res: Response): Promise<void> {
  res.json({ user: req.user });
}
