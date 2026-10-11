import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { users } from '../models/schema';
import type { SafeUser, User } from '../types';

const SALT_ROUNDS = 12;

// ─── Helpers ─────────────────────────────────────

/** Strip the password hash before sending a user to the client */
function toSafeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

/** Basic email format validation */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Password strength rules */
function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true, message: '' };
}

// ─── Email / Password ────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ user?: SafeUser; error?: string }> {
  // Validate inputs
  if (!name || name.trim().length === 0) {
    return { error: 'Name is required' };
  }
  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address' };
  }
  const pwCheck = validatePassword(password);
  if (!pwCheck.valid) {
    return { error: pwCheck.message };
  }

  // Check for duplicate email
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (existing) {
    return { error: 'An account with this email already exists' };
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [newUser] = await db
    .insert(users)
    .values({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      emailVerified: false,
    })
    .returning();

  return { user: toSafeUser(newUser) };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user?: SafeUser; error?: string }> {
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user) {
    // Generic message to avoid email enumeration
    return { error: 'Invalid email or password' };
  }

  // Google-only accounts don't have a password
  if (!user.passwordHash) {
    return {
      error: 'This account uses Google sign-in. Please continue with Google.',
    };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { error: 'Invalid email or password' };
  }

  return { user: toSafeUser(user) };
}

// ─── Google OAuth ────────────────────────────────

/**
 * Find an existing user by Google ID or email, or create a new one.
 *
 * Account linking logic:
 * - If a user with this googleId exists → return them.
 * - If a user with this email exists but no googleId → link the Google account.
 *   This is safe because Google has verified the email ownership.
 * - Otherwise → create a brand-new user.
 */
export async function findOrCreateGoogleUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<SafeUser> {
  // 1. Try by Google ID first
  const [byGoogleId] = await db
    .select()
    .from(users)
    .where(eq(users.googleId, profile.googleId))
    .limit(1);

  if (byGoogleId) {
    return toSafeUser(byGoogleId);
  }

  // 2. Try by email — link accounts if found
  const [byEmail] = await db
    .select()
    .from(users)
    .where(eq(users.email, profile.email.toLowerCase()))
    .limit(1);

  if (byEmail) {
    const [linked] = await db
      .update(users)
      .set({
        googleId: profile.googleId,
        avatarUrl: profile.avatarUrl || byEmail.avatarUrl,
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, byEmail.id))
      .returning();

    return toSafeUser(linked);
  }

  // 3. Create new user
  const [newUser] = await db
    .insert(users)
    .values({
      name: profile.name,
      email: profile.email.toLowerCase(),
      googleId: profile.googleId,
      avatarUrl: profile.avatarUrl,
      emailVerified: true,
    })
    .returning();

  return toSafeUser(newUser);
}

// ─── Lookup ──────────────────────────────────────

export async function findUserById(id: string): Promise<SafeUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user ? toSafeUser(user) : null;
}
