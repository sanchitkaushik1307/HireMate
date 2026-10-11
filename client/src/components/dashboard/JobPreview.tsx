import { useState } from 'react';
import type { JobItem } from '../../lib/api';

interface JobPreviewProps {
  job: JobItem;
  onView?: (jobId: string) => void;
  onToggleSave?: (jobId: string) => void;
}

export function JobPreview({ job, onView, onToggleSave }: JobPreviewProps) {
  const [saved, setSaved] = useState(job.isSaved || false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    onToggleSave?.(job.id);
  };

  return (
    <article className="group relative rounded-xl border border-charcoal-750 bg-charcoal-850/80 p-4 sm:p-5 transition-all duration-200 hover:border-charcoal-650 hover:bg-charcoal-800/80">
      {/* Top row: Role, Company & Bookmark */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-charcoal-100 group-hover:text-white transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-xs text-charcoal-300 font-medium mt-0.5">
            {job.company}
          </p>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          aria-label={saved ? 'Remove saved job' : 'Save job'}
          title={saved ? 'Saved' : 'Save job'}
          className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
            saved
              ? 'border-cream-500/40 bg-cream-500/10 text-cream-400'
              : 'border-charcoal-700 bg-charcoal-800/60 text-charcoal-400 hover:text-charcoal-200 hover:border-charcoal-600'
          }`}
        >
          <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {/* Meta row: Location, Job Type & Match % */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal-400 mb-3">
        <span>{job.location}</span>
        <span aria-hidden="true" className="text-charcoal-600">•</span>
        <span>{job.jobType}</span>
        <span aria-hidden="true" className="text-charcoal-600">•</span>
        <span className="inline-flex items-center gap-1 font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          {job.matchPercentage}% match
        </span>
      </div>

      {/* Matching Skills */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="text-[11px] font-medium text-charcoal-300 bg-charcoal-800 border border-charcoal-700/80 px-2 py-0.5 rounded-md"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Bottom row: Salary and View Action */}
      <div className="flex items-center justify-between pt-2.5 border-t border-charcoal-750/70 text-xs">
        <span className="font-mono text-charcoal-200 font-medium">
          {job.salaryRange}
        </span>
        <button
          onClick={() => onView?.(job.id)}
          className="font-medium text-charcoal-200 hover:text-white transition-colors flex items-center gap-1 focus:outline-none focus:underline"
        >
          View job
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}
