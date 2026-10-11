import type { ApplicationStats } from '../../lib/api';
import { EmptyState } from './EmptyState';
import { SectionSkeleton } from './SectionSkeleton';

interface ApplicationProgressProps {
  stats: ApplicationStats;
  loading?: boolean;
  onExploreJobs?: () => void;
  onViewAll?: () => void;
}

export function ApplicationProgress({
  stats,
  loading = false,
  onExploreJobs,
  onViewAll,
}: ApplicationProgressProps) {
  const total = stats.applied + stats.interview + stats.offer;

  return (
    <section aria-labelledby="applications-title" className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 id="applications-title" className="text-base sm:text-lg font-semibold text-charcoal-100">
          Your applications
        </h2>
        {total > 0 && (
          <span className="text-xs text-charcoal-400">
            {total} active {total === 1 ? 'record' : 'records'}
          </span>
        )}
      </div>

      {loading ? (
        <SectionSkeleton lines={2} />
      ) : total === 0 ? (
        <EmptyState
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          title="Your application journey starts here."
          description="Track every application from submission to offer in one calm overview."
          actionLabel="Explore jobs"
          onAction={onExploreJobs}
          actionVariant="secondary"
        />
      ) : (
        <div className="rounded-xl border border-charcoal-750 bg-charcoal-850/80 p-4 sm:p-5">
          {/* Status summary columns */}
          <div className="grid grid-cols-3 divide-x divide-charcoal-750 py-1 text-center">
            <div className="px-2">
              <span className="text-[11px] font-medium tracking-wide text-charcoal-400 block uppercase">
                Applied
              </span>
              <span className="mt-1 block text-2xl font-mono font-semibold text-charcoal-100">
                {stats.applied}
              </span>
            </div>

            <div className="px-2">
              <span className="text-[11px] font-medium tracking-wide text-charcoal-400 block uppercase">
                Interview
              </span>
              <span className="mt-1 block text-2xl font-mono font-semibold text-cream-400">
                {stats.interview}
              </span>
            </div>

            <div className="px-2">
              <span className="text-[11px] font-medium tracking-wide text-charcoal-400 block uppercase">
                Offer
              </span>
              <span className="mt-1 block text-2xl font-mono font-semibold text-emerald-400">
                {stats.offer}
              </span>
            </div>
          </div>

          {/* Action link */}
          <div className="mt-4 pt-3 border-t border-charcoal-750/70 flex justify-end">
            <button
              onClick={onViewAll}
              className="text-xs font-medium text-charcoal-300 hover:text-white transition-colors inline-flex items-center gap-1 focus:outline-none focus:underline"
            >
              View all applications
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
