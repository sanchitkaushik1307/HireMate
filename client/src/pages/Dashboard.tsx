import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api, type DashboardOverview } from '../lib/api';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { NextStep } from '../components/dashboard/NextStep';
import { RecommendedJobs } from '../components/dashboard/RecommendedJobs';
import { ApplicationProgress } from '../components/dashboard/ApplicationProgress';
import { ResumeStatus } from '../components/dashboard/ResumeStatus';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from backend
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: overview, error: apiError } = await api.dashboard.overview();
      if (apiError) {
        setError(apiError);
      } else if (overview) {
        setData(overview);
      }
    } catch {
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  // Extract first name dynamically from authenticated user
  const firstName = user.name ? user.name.trim().split(' ')[0] : 'there';

  // Dynamic time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout
      user={user}
      activePath="/dashboard"
      onLogout={handleLogout}
      onNavigate={(path) => {
        if (path === '/dashboard') return;
        if (path === '/resume') {
          navigate('/onboarding?step=3');
          return;
        }
        if (path === '/profile') {
          navigate('/onboarding');
          return;
        }
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {/* ─── 1. Greeting ─── */}
        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal-100 tracking-tight">
            {getGreeting()}, {firstName}.
          </h1>
          <p className="mt-1 text-sm sm:text-base text-charcoal-400">
            Let's make progress on your career today.
          </p>
        </header>

        {/* Global Error Notice if API fails */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-900/50 bg-red-950/20 flex items-center justify-between text-xs text-red-300">
            <span>{error}</span>
            <button
              onClick={fetchDashboardData}
              className="px-3 py-1 rounded bg-charcoal-800 text-charcoal-200 border border-charcoal-750 hover:bg-charcoal-700 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* ─── Structured Responsive Layout ─── */}
        {/* Desktop: Asymmetric 2-column layout (7 cols main / 5 cols secondary) */}
        {/* Mobile: 1-column priority order: Next step -> Recommended jobs -> Applications -> Resume */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column (Priority 1 & 2) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* ─── 2. Primary Next Step ─── */}
            <NextStep
              progress={data?.nextStep?.progress ?? 20}
              title={data?.nextStep?.title ?? 'Complete your career profile'}
              description={
                data?.nextStep?.description ??
                'Add your skills, preferred roles and resume to get relevant opportunities.'
              }
              ctaText={data?.nextStep?.ctaText ?? 'Complete profile'}
              loading={loading}
              onAction={() => {
                navigate(data?.nextStep?.ctaLink || '/onboarding');
              }}
            />

            {/* ─── 3. Recommended Jobs ─── */}
            <RecommendedJobs
              jobs={data?.recommendedJobs ?? []}
              loading={loading}
              error={error}
              onRetry={fetchDashboardData}
              onCompleteProfile={() => {
                navigate('/onboarding');
              }}
              onViewJob={(_jobId) => {
                // View job details
              }}
            />
          </div>

          {/* Secondary Column (Priority 3 & 4) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            {/* ─── 4. Application Progress ─── */}
            <ApplicationProgress
              stats={
                data?.applications ?? {
                  applied: 0,
                  interview: 0,
                  offer: 0,
                }
              }
              loading={loading}
              onExploreJobs={() => {
                // Explore jobs action
              }}
              onViewAll={() => {
                // View all applications
              }}
            />

            {/* ─── 5. Resume Status ─── */}
            <ResumeStatus
              resume={data?.resume ?? null}
              loading={loading}
              onUpload={() => {
                navigate('/onboarding?step=3');
              }}
              onView={(_resumeId) => {
                window.open(api.profile.resumeDownloadUrl(), '_blank');
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
