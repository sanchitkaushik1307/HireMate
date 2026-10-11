import type { JobItem } from '../../lib/api';
import { JobPreview } from './JobPreview';
import { EmptyState } from './EmptyState';
import { SectionSkeleton } from './SectionSkeleton';

interface RecommendedJobsProps {
  jobs: JobItem[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCompleteProfile?: () => void;
  onViewJob?: (jobId: string) => void;
}

export function RecommendedJobs({
  jobs,
  loading = false,
  error = null,
  onRetry,
  onCompleteProfile,
  onViewJob,
}: RecommendedJobsProps) {
  return (
    <section aria-labelledby="recommended-jobs-title" className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 id="recommended-jobs-title" className="text-base sm:text-lg font-semibold text-charcoal-100">
          Recommended for you
        </h2>
        {jobs.length > 0 && (
          <span className="text-xs text-charcoal-400">
            Showing top {jobs.length} matches
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          <SectionSkeleton lines={3} />
          <SectionSkeleton lines={3} />
        </div>
      ) : error ? (
        <div className="p-5 rounded-xl border border-red-900/40 bg-red-950/20 text-center">
          <p className="text-xs text-red-300 mb-3">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 text-xs rounded-lg bg-charcoal-800 text-charcoal-200 border border-charcoal-700 hover:bg-charcoal-750"
            >
              Try again
            </button>
          )}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
          title="No recommendations yet."
          description="Complete your profile to help us find relevant opportunities."
          actionLabel="Complete profile"
          onAction={onCompleteProfile}
          actionVariant="secondary"
        />
      ) : (
        <div className="space-y-3">
          {jobs.slice(0, 3).map((job) => (
            <JobPreview key={job.id} job={job} onView={onViewJob} />
          ))}
        </div>
      )}
    </section>
  );
}
