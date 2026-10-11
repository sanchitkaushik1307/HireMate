import type { ResumeData } from '../../lib/api';
import { EmptyState } from './EmptyState';
import { SectionSkeleton } from './SectionSkeleton';

interface ResumeStatusProps {
  resume: ResumeData | null;
  loading?: boolean;
  onUpload?: () => void;
  onView?: (resumeId: string) => void;
}

export function ResumeStatus({
  resume,
  loading = false,
  onUpload,
  onView,
}: ResumeStatusProps) {
  return (
    <section aria-labelledby="resume-title" className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 id="resume-title" className="text-base sm:text-lg font-semibold text-charcoal-100">
          Your resume
        </h2>
        {resume && (
          <span className="text-xs text-charcoal-400">
            Active version
          </span>
        )}
      </div>

      {loading ? (
        <SectionSkeleton lines={2} />
      ) : !resume ? (
        <EmptyState
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          title="No resume uploaded yet."
          description="Your resume is the foundation of your HireMate profile."
          actionLabel="Upload resume"
          onAction={onUpload}
          actionVariant="secondary"
        />
      ) : (
        <div className="rounded-xl border border-charcoal-750 bg-charcoal-850/80 p-4 sm:p-5">
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-charcoal-300 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-charcoal-100 truncate">
                {resume.fileName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-charcoal-400">
                <span>Updated {resume.lastUpdated}</span>
                <span aria-hidden="true" className="text-charcoal-600">•</span>
                <span className="text-cream-400">{resume.completeness}</span>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-charcoal-750/70 flex justify-end">
            <button
              onClick={() => onView?.(resume.id)}
              className="text-xs font-medium text-charcoal-300 hover:text-white transition-colors inline-flex items-center gap-1 focus:outline-none focus:underline"
            >
              View resume
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
