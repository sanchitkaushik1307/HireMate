interface SectionSkeletonProps {
  lines?: number;
  className?: string;
}

export function SectionSkeleton({ lines = 3, className = '' }: SectionSkeletonProps) {
  return (
    <div className={`p-6 rounded-xl border border-charcoal-750 bg-charcoal-850 animate-pulse ${className}`}>
      <div className="h-4 bg-charcoal-750 rounded w-1/3 mb-4" />
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-charcoal-800 rounded"
            style={{ width: `${Math.max(45, 90 - i * 15)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
