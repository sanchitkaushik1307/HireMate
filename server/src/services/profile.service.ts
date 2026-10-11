import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { eq, desc } from 'drizzle-orm';
import { db } from '../config/database';
import { careerProfiles, resumes, type EducationData, type ProjectData } from '../models/schema';
import type { SafeUser } from '../types';

export const UPLOAD_DIR = path.resolve(__dirname, '../../../uploads/resumes');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface CareerProfileInput {
  targetRoles?: string[];
  opportunityType?: string | null;
  preferredLocations?: string[];
  workArrangement?: string | null;
  skills?: string[];
  education?: EducationData;
  experienceLevel?: string | null;
  projects?: ProjectData[];
  onboardingStep?: number;
  onboardingCompleted?: boolean;
}

export interface ProfileCompletionResult {
  score: number;
  isComplete: boolean;
  breakdown: {
    account: boolean;
    targetRoles: boolean;
    preferences: boolean;
    skills: boolean;
    education: boolean;
    experienceLevel: boolean;
    resume: boolean;
  };
  missingSteps: string[];
}

/** Deduplicate strings case-insensitively and trim */
function sanitizeStringArray(arr?: unknown[]): string[] {
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of arr) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      const lower = trimmed.toLowerCase();
      if (trimmed.length > 0 && !seen.has(lower) && trimmed.length <= 100) {
        seen.add(lower);
        result.push(trimmed);
      }
    }
  }
  return result.slice(0, 50);
}

/** Calculate authoritative profile completion score (0-100%) */
export function calculateProfileCompletion(
  profile: (typeof careerProfiles.$inferSelect) | null,
  hasResume: boolean,
  user?: SafeUser | null
): ProfileCompletionResult {
  let score = 20; // Base: Account exists
  const breakdown = {
    account: true,
    targetRoles: false,
    preferences: false,
    skills: false,
    education: false,
    experienceLevel: false,
    resume: hasResume,
  };
  const missingSteps: string[] = [];

  if (profile) {
    // Target roles: at least 1 role (+10%)
    if (Array.isArray(profile.targetRoles) && profile.targetRoles.length > 0) {
      breakdown.targetRoles = true;
      score += 10;
    } else {
      missingSteps.push('Add target roles');
    }

    // Opportunity type & work arrangement (+10%)
    if (profile.opportunityType && profile.workArrangement) {
      breakdown.preferences = true;
      score += 10;
    } else {
      missingSteps.push('Set opportunity type and work arrangement');
    }

    // Skills: at least 3 skills (+15%)
    if (Array.isArray(profile.skills) && profile.skills.length >= 3) {
      breakdown.skills = true;
      score += 15;
    } else {
      missingSteps.push('Add at least 3 skills');
    }

    // Education: degree or institution specified (+10%)
    const edu = profile.education as EducationData | undefined;
    if (edu && ((edu.degree && edu.degree.trim().length > 0) || (edu.institution && edu.institution.trim().length > 0))) {
      breakdown.education = true;
      score += 10;
    } else {
      missingSteps.push('Add education details');
    }

    // Experience level selected (+5%)
    if (profile.experienceLevel && profile.experienceLevel.trim().length > 0) {
      breakdown.experienceLevel = true;
      score += 5;
    } else {
      missingSteps.push('Select experience level');
    }
  } else {
    missingSteps.push('Complete career goals', 'Add skills and education');
  }

  // Resume (+30%)
  if (hasResume) {
    score += 30;
  } else {
    missingSteps.push('Upload resume');
  }

  score = Math.min(Math.max(score, 0), 100);

  return {
    score,
    isComplete: score >= 90 && Boolean(profile?.onboardingCompleted),
    breakdown,
    missingSteps,
  };
}

/** Get career profile & resume metadata for a user */
export async function getProfileByUserId(userId: string, user?: SafeUser | null) {
  const [profile] = await db
    .select()
    .from(careerProfiles)
    .where(eq(careerProfiles.userId, userId))
    .limit(1);

  const [resume] = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.createdAt))
    .limit(1);

  const completion = calculateProfileCompletion(profile || null, Boolean(resume), user);

  return {
    profile: profile || null,
    resume: resume
      ? {
          id: resume.id,
          fileName: resume.fileName,
          mimeType: resume.mimeType,
          fileSize: resume.fileSize,
          createdAt: resume.createdAt,
          updatedAt: resume.updatedAt,
        }
      : null,
    completion,
  };
}

/** Upsert career profile for a user */
export async function upsertProfile(
  userId: string,
  input: CareerProfileInput,
  user?: SafeUser | null
) {
  const sanitizedTargetRoles = input.targetRoles ? sanitizeStringArray(input.targetRoles) : undefined;
  const sanitizedPreferredLocations = input.preferredLocations
    ? sanitizeStringArray(input.preferredLocations)
    : undefined;
  const sanitizedSkills = input.skills ? sanitizeStringArray(input.skills) : undefined;

  const validOpportunityTypes = ['internship', 'full-time', 'both'];
  const sanitizedOpportunityType =
    input.opportunityType && validOpportunityTypes.includes(input.opportunityType)
      ? input.opportunityType
      : input.opportunityType === null
      ? null
      : undefined;

  const validWorkArrangements = ['on-site', 'hybrid', 'remote', 'flexible'];
  const sanitizedWorkArrangement =
    input.workArrangement && validWorkArrangements.includes(input.workArrangement)
      ? input.workArrangement
      : input.workArrangement === null
      ? null
      : undefined;

  const validExpLevels = ['student', 'fresher', 'internship', 'entry-level', 'experienced'];
  const sanitizedExpLevel =
    input.experienceLevel && validExpLevels.includes(input.experienceLevel)
      ? input.experienceLevel
      : input.experienceLevel === null
      ? null
      : undefined;

  const sanitizedEducation: EducationData | undefined = input.education
    ? {
        degree: typeof input.education.degree === 'string' ? input.education.degree.trim().slice(0, 100) : '',
        institution: typeof input.education.institution === 'string' ? input.education.institution.trim().slice(0, 150) : '',
        fieldOfStudy: typeof input.education.fieldOfStudy === 'string' ? input.education.fieldOfStudy.trim().slice(0, 100) : '',
        gradYear: typeof input.education.gradYear === 'string' ? input.education.gradYear.trim().slice(0, 10) : '',
      }
    : undefined;

  const sanitizedProjects: ProjectData[] | undefined = Array.isArray(input.projects)
    ? input.projects
        .filter((p) => p && typeof p === 'object' && typeof p.title === 'string' && p.title.trim().length > 0)
        .slice(0, 10)
        .map((p) => ({
          title: String(p.title).trim().slice(0, 100),
          organization: typeof p.organization === 'string' ? p.organization.trim().slice(0, 100) : undefined,
          description: typeof p.description === 'string' ? p.description.trim().slice(0, 1000) : undefined,
          startDate: typeof p.startDate === 'string' ? p.startDate.trim().slice(0, 20) : undefined,
          endDate: typeof p.endDate === 'string' ? p.endDate.trim().slice(0, 20) : undefined,
        }))
    : undefined;

  const [existing] = await db
    .select()
    .from(careerProfiles)
    .where(eq(careerProfiles.userId, userId))
    .limit(1);

  let updatedProfile;

  if (existing) {
    const updateData: Partial<typeof careerProfiles.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (sanitizedTargetRoles !== undefined) updateData.targetRoles = sanitizedTargetRoles;
    if (sanitizedOpportunityType !== undefined) updateData.opportunityType = sanitizedOpportunityType;
    if (sanitizedPreferredLocations !== undefined) updateData.preferredLocations = sanitizedPreferredLocations;
    if (sanitizedWorkArrangement !== undefined) updateData.workArrangement = sanitizedWorkArrangement;
    if (sanitizedSkills !== undefined) updateData.skills = sanitizedSkills;
    if (sanitizedEducation !== undefined) updateData.education = sanitizedEducation;
    if (sanitizedExpLevel !== undefined) updateData.experienceLevel = sanitizedExpLevel;
    if (sanitizedProjects !== undefined) updateData.projects = sanitizedProjects;
    if (typeof input.onboardingStep === 'number' && input.onboardingStep >= 1 && input.onboardingStep <= 4) {
      updateData.onboardingStep = input.onboardingStep;
    }
    if (typeof input.onboardingCompleted === 'boolean') {
      updateData.onboardingCompleted = input.onboardingCompleted;
    }

    [updatedProfile] = await db
      .update(careerProfiles)
      .set(updateData)
      .where(eq(careerProfiles.userId, userId))
      .returning();
  } else {
    [updatedProfile] = await db
      .insert(careerProfiles)
      .values({
        userId,
        targetRoles: sanitizedTargetRoles || [],
        opportunityType: sanitizedOpportunityType || null,
        preferredLocations: sanitizedPreferredLocations || [],
        workArrangement: sanitizedWorkArrangement || null,
        skills: sanitizedSkills || [],
        education: sanitizedEducation || {},
        experienceLevel: sanitizedExpLevel || null,
        projects: sanitizedProjects || [],
        onboardingStep: input.onboardingStep || 1,
        onboardingCompleted: input.onboardingCompleted || false,
      })
      .returning();
  }

  const [resume] = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .limit(1);

  const completion = calculateProfileCompletion(updatedProfile, Boolean(resume), user);

  return {
    profile: updatedProfile,
    completion,
  };
}

/** Verify magic bytes for uploaded resume to prevent disguised file formats */
export function verifyFileSignature(filePath: string, expectedMime: string): boolean {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(8);
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    // PDF magic bytes: %PDF (25 50 44 46)
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
      return expectedMime === 'application/pdf';
    }

    // DOCX / ZIP magic bytes: PK\x03\x04 (50 4b 03 04)
    if (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
      return (
        expectedMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        expectedMime === 'application/zip' ||
        expectedMime === 'application/msword'
      );
    }

    return false;
  } catch (err) {
    console.error('[ResumeVerification] Error reading file header:', err);
    return false;
  }
}

/** Save an uploaded resume file and update database record */
export async function saveResumeFile(
  userId: string,
  file: { originalname: string; mimetype: string; size: number; path: string }
) {
  // Validate magic bytes
  const isSignatureValid = verifyFileSignature(file.path, file.mimetype);
  if (!isSignatureValid) {
    try {
      fs.unlinkSync(file.path);
    } catch {
      // ignore
    }
    throw new Error('Invalid file format. The file content does not match a valid PDF or DOCX document.');
  }

  // Create clean internal storage key
  const ext = path.extname(file.originalname).toLowerCase() || (file.mimetype === 'application/pdf' ? '.pdf' : '.docx');
  const safeStorageKey = `${userId}-${randomUUID()}${ext}`;
  const finalDestPath = path.join(UPLOAD_DIR, safeStorageKey);

  // Move temp file to final storage destination
  fs.renameSync(file.path, finalDestPath);

  // Check and delete existing resume files for this user
  const existingResumes = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId));

  for (const oldResume of existingResumes) {
    try {
      const oldPath = path.join(UPLOAD_DIR, oldResume.storageKey);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    } catch (e) {
      console.warn('[ResumeStorage] Warning deleting old resume file:', e);
    }
  }

  // Clear previous resume records in DB
  await db.delete(resumes).where(eq(resumes.userId, userId));

  // Insert new resume record
  const [newResume] = await db
    .insert(resumes)
    .values({
      userId,
      fileName: file.originalname.slice(0, 255),
      storageKey: safeStorageKey,
      mimeType: file.mimetype,
      fileSize: file.size,
    })
    .returning();

  return newResume;
}

/** Delete resume file and database record */
export async function deleteResumeFile(userId: string) {
  const [existing] = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .limit(1);

  if (!existing) {
    return false;
  }

  try {
    const filePath = path.join(UPLOAD_DIR, existing.storageKey);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.warn('[ResumeStorage] Could not remove file on disk:', e);
  }

  await db.delete(resumes).where(eq(resumes.userId, userId));
  return true;
}

/** Retrieve resume file path for authorized download/preview */
export async function getResumeFilePath(userId: string) {
  const [existing] = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .limit(1);

  if (!existing) {
    return null;
  }

  const filePath = path.join(UPLOAD_DIR, existing.storageKey);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return {
    filePath,
    fileName: existing.fileName,
    mimeType: existing.mimeType,
  };
}
