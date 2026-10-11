import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary';
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
}: EmptyStateProps) {
  return (
    <div className="py-8 px-6 rounded-xl border border-charcoal-750 bg-charcoal-850/60 text-center flex flex-col items-center justify-center">
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-charcoal-400 mb-3.5">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-charcoal-200 mb-1">{title}</h4>
      <p className="text-xs text-charcoal-400 max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal-900 ${
            actionVariant === 'primary'
              ? 'bg-charcoal-100 text-charcoal-950 hover:bg-white focus:ring-charcoal-300'
              : 'bg-charcoal-800 text-charcoal-300 border border-charcoal-700 hover:bg-charcoal-750 hover:text-charcoal-100 focus:ring-charcoal-600'
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
