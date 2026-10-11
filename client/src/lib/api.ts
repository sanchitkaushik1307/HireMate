/**
 * API client for the HireMate backend.
 *
 * All requests use relative URLs (e.g. `/api/auth/login`) so they
 * go through Vite's dev proxy in development. In production the
 * frontend should be served from the same origin or VITE_API_URL
 * can be set to the backend's absolute URL.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include', // Always send cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const body = await response.json();

    if (!response.ok) {
      return { error: body.error || 'Something went wrong' };
    }

    return { data: body };
  } catch {
    return { error: 'Network error. Please check your connection and try again.' };
  }
}

// ─── Auth endpoints ──────────────────────────────

export interface UserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    googleId: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  matchPercentage: number;
  skills: string[];
  salaryRange: string;
  isSaved?: boolean;
}

export interface ApplicationStats {
  applied: number;
  interview: number;
  offer: number;
}

export interface ResumeData {
  id: string;
  fileName: string;
  lastUpdated: string;
  completeness: string;
}

export interface DashboardOverview {
  profileCompletion: number;
  nextStep: {
    title: string;
    description: string;
    progress: number;
    ctaText: string;
    ctaLink: string;
  };
  recommendedJobs: JobItem[];
  applications: ApplicationStats;
  resume: ResumeData | null;
}

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

export interface CareerProfile {
  id: string;
  userId: string;
  targetRoles: string[];
  opportunityType: 'internship' | 'full-time' | 'both' | null;
  preferredLocations: string[];
  workArrangement: 'on-site' | 'hybrid' | 'remote' | 'flexible' | null;
  skills: string[];
  education: EducationData;
  experienceLevel: 'student' | 'fresher' | 'internship' | 'entry-level' | 'experienced' | null;
  projects: ProjectData[];
  onboardingStep: number;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeMeta {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ProfileCompletion {
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

export interface ProfileResponse {
  profile: CareerProfile | null;
  resume: ResumeMeta | null;
  completion: ProfileCompletion;
}

export const api = {
  auth: {
    register(name: string, email: string, password: string) {
      return request<UserResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
    },

    login(email: string, password: string) {
      return request<UserResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    logout() {
      return request<{ message: string }>('/api/auth/logout', {
        method: 'POST',
      });
    },

    me() {
      return request<UserResponse>('/api/auth/me');
    },

    /** Full URL for the Google OAuth redirect (browser navigation, not fetch) */
    googleUrl() {
      return `${API_BASE}/api/auth/google`;
    },
  },

  dashboard: {
    overview() {
      return request<DashboardOverview>('/api/dashboard/overview');
    },
  },

  profile: {
    get() {
      return request<ProfileResponse>('/api/profile');
    },

    save(data: Partial<CareerProfile>) {
      return request<{ profile: CareerProfile; completion: ProfileCompletion }>('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async uploadResume(file: File) {
      const formData = new FormData();
      formData.append('resume', file);
      try {
        const response = await fetch(`${API_BASE}/api/profile/resume`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        const body = await response.json();
        if (!response.ok) {
          return { error: body.error || 'Failed to upload resume' };
        }
        return { data: body };
      } catch {
        return { error: 'Network error uploading resume. Please try again.' };
      }
    },

    deleteResume() {
      return request<{ message: string; completion: ProfileCompletion }>('/api/profile/resume', {
        method: 'DELETE',
      });
    },

    resumeDownloadUrl() {
      return `${API_BASE}/api/profile/resume/download`;
    },
  },
};

