interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'dark' | 'light';
}

/**
 * HireMate logo component — SVG icon with optional wordmark.
 * The icon represents connected people forming a bridge/path motif.
 */
export function Logo({ size = 'md', showText = true, variant = 'dark' }: LogoProps) {
  const iconSizes = { sm: 28, md: 36, lg: 44 };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };
  const s = iconSizes[size];
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const mateColor = variant === 'light' ? 'text-brand-300' : 'text-brand-500';

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hm-icon-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#hm-icon-grad)" />
        {/* Left person */}
        <circle cx="17" cy="16" r="4" fill="white" />
        {/* Right person */}
        <circle cx="31" cy="16" r="4" fill="white" />
        {/* Connected body shapes */}
        <path
          d="M10 34c0-4 3.5-7 7-7 2 0 3.5.8 4.5 2 .5.6 1.5.6 2 0 1-1.2 2.5-2 4.5-2 3.5 0 7 3 7 7v1.5a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V34Z"
          fill="white"
          fillOpacity="0.9"
        />
      </svg>

      {showText && (
        <span className={`font-bold ${textSizes[size]} tracking-tight ${textColor}`}>
          Hire<span className={mateColor}>Mate</span>
        </span>
      )}
    </div>
  );
}
