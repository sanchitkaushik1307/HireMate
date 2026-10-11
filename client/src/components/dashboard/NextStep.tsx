import { SectionSkeleton } from './SectionSkeleton';

interface NextStepProps {
  progress?: number;
  title?: string;
  description?: string;
  ctaText?: string;
  onAction?: () => void;
  loading?: boolean;
}

export function NextStep({
  progress = 40,
  title = 'Complete your career profile',
  description = 'Add your skills, preferred roles and resume to get relevant opportunities.',
  ctaText = 'Complete profile',
  onAction,
  loading = false,
}: NextStepProps) {
  if (loading) {
    return <SectionSkeleton lines={4} className="border-charcoal-700 bg-charcoal-850" />;
  }

  return (
    <section
      aria-label="Your primary next step"
      className="relative rounded-2xl border border-charcoal-700/80 bg-gradient-to-b from-charcoal-800/90 to-charcoal-850/90 p-6 sm:p-7 shadow-sm transition-colors hover:border-charcoal-600"
    >
      {/* Top Header Tag */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-cream-400 bg-cream-500/10 border border-cream-500/20 px-2.5 py-0.5 rounded-md">
          Your Next Step
        </span>
        <span className="text-xs font-mono font-medium text-charcoal-300">
          Profile {progress}%
        </span>
      </div>

      {/* Main Title & Description */}
      <div className="max-w-xl mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-100 tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-sm text-charcoal-300 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Progress Track & Action */}
      <div className="space-y-4">
        {/* Subtle Progress Bar */}
        <div className="w-full bg-charcoal-900/80 rounded-full h-1.5 overflow-hidden border border-charcoal-750">
          <div
            className="h-full bg-gradient-to-r from-cream-500 to-cream-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion progress"
          />
        </div>

        {/* Action Button */}
        <div className="pt-1 flex items-center justify-between">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl text-charcoal-950 bg-charcoal-100 hover:bg-white active:bg-charcoal-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal-900 focus:ring-charcoal-200 shadow-sm"
          >
            <span>{ctaText}</span>
            <span aria-hidden="true" className="text-base leading-none">→</span>
          </button>

          <span className="text-xs text-charcoal-400 hidden sm:inline">
            Estimated ~3 minutes
          </span>
        </div>
      </div>
    </section>
  );
}
