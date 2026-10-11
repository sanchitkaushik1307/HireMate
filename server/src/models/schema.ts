import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';

/**
 * Users table — the single source of identity for HireMate.
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  avatarUrl: text('avatar_url'),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export interface EducationData {
  degree?: string;
  institution?: string;
  fieldOfStudy?: string;
  gradYear?: string;
}

export interface ProjectData {
  title: string;
  organization?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Career Profiles table — stores structured career goals, skills, education, and onboarding progress.
 */
export const careerProfiles = pgTable('career_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  targetRoles: jsonb('target_roles').$type<string[]>().notNull().default([]),
  opportunityType: varchar('opportunity_type', { length: 50 }), // 'internship' | 'full-time' | 'both'
  preferredLocations: jsonb('preferred_locations').$type<string[]>().notNull().default([]),
  workArrangement: varchar('work_arrangement', { length: 50 }), // 'on-site' | 'hybrid' | 'remote' | 'flexible'
  skills: jsonb('skills').$type<string[]>().notNull().default([]),
  education: jsonb('education').$type<EducationData>().notNull().default({}),
  experienceLevel: varchar('experience_level', { length: 50 }), // 'student' | 'fresher' | 'internship' | 'entry-level' | 'experienced'
  projects: jsonb('projects').$type<ProjectData[]>().notNull().default([]),
  onboardingStep: integer('onboarding_step').notNull().default(1),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Resumes table — stores metadata for user-uploaded resumes.
 */
export const resumes = pgTable('resumes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  storageKey: varchar('storage_key', { length: 255 }).notNull().unique(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: integer('file_size').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

