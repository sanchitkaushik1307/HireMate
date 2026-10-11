import { Request, Response } from 'express';
import { getProfileByUserId } from '../services/profile.service';

export interface DashboardOverviewResponse {
  profileCompletion: number;
  nextStep: {
    title: string;
    description: string;
    progress: number;
    ctaText: string;
    ctaLink: string;
  };
  recommendedJobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    jobType: string;
    matchPercentage: number;
    skills: string[];
    salaryRange: string;
    isSaved?: boolean;
  }>;
  applications: {
    applied: number;
    interview: number;
    offer: number;
  };
  resume: {
    id: string;
    fileName: string;
    lastUpdated: string;
    completeness: string;
  } | null;
}

/**
 * GET /api/dashboard/overview
 * Returns career dashboard overview for the authenticated user based on real profile & resume data.
 */
export async function getDashboardOverview(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const profileData = await getProfileByUserId(user.id, user);
    const profile = profileData.profile;
    const resume = profileData.resume;
    const completionScore = profileData.completion.score;

    let nextStepTitle = 'Complete your career profile';
    let nextStepDesc = 'Add your skills, preferred roles and resume to get relevant opportunities.';
    let nextStepCta = 'Complete profile';
    let nextStepLink = '/onboarding';

    if (!profile || !profile.targetRoles || profile.targetRoles.length === 0) {
      nextStepTitle = 'Define your career goals';
      nextStepDesc = 'Set your target roles and work preferences to find the best match.';
      nextStepCta = 'Set goals';
      nextStepLink = '/onboarding?step=1';
    } else if (!profile.skills || profile.skills.length < 3) {
      nextStepTitle = 'Add your top skills';
      nextStepDesc = 'Highlight your technical and professional skills for opportunity matching.';
      nextStepCta = 'Add skills';
      nextStepLink = '/onboarding?step=2';
    } else if (!resume) {
      nextStepTitle = 'Upload your resume';
      nextStepDesc = 'Upload your latest PDF or DOCX resume to complete your career profile.';
      nextStepCta = 'Upload resume';
      nextStepLink = '/onboarding?step=3';
    } else if (profile.onboardingCompleted) {
      nextStepTitle = 'Career profile complete';
      nextStepDesc = 'Your career preferences, skills, and resume are active. Edit anytime as you gain experience.';
      nextStepCta = 'Edit profile';
      nextStepLink = '/onboarding?step=4';
    }

    const overview: DashboardOverviewResponse = {
      profileCompletion: completionScore,
      nextStep: {
        title: nextStepTitle,
        description: nextStepDesc,
        progress: completionScore,
        ctaText: nextStepCta,
        ctaLink: nextStepLink,
      },
      recommendedJobs: [],
      applications: {
        applied: 0,
        interview: 0,
        offer: 0,
      },
      resume: resume
        ? {
            id: resume.id,
            fileName: resume.fileName,
            lastUpdated: new Date(resume.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            completeness: 'Verified',
          }
        : null,
    };

    res.json(overview);
  } catch (error) {
    console.error('Failed to get dashboard overview:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
}

