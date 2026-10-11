import React from 'react';
import { Separator } from '../../primitives/Separator';
import { Button } from '../../primitives/Button';

export interface HireMatePageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function HireMatePageHeader({
  title,
  description,
  badge,
  actions,
  className = '',
}: HireMatePageHeaderProps) {
  return (
    <header className={`mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#F2F0E9] tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-[#A0ADB0] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </header>
  );
}

export interface HireMateSectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function HireMateSection({
  title,
  subtitle,
  action,
  children,
  className = '',
}: HireMateSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-sm sm:text-base font-semibold text-[#F2F0E9] tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-[#A0ADB0] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

export const HireMateDivider = Separator;

export interface HireMateEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary';
  className?: string;
}

export function HireMateEmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'secondary',
  className = '',
}: HireMateEmptyStateProps) {
  return (
    <div
      className={`py-10 px-6 rounded-xl border border-[#273438] bg-[#0E1518]/70 text-center flex flex-col items-center justify-center ${className}`}
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-[#141D20] border border-[#273438] flex items-center justify-center text-[#A0ADB0] mb-3.5">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#F2F0E9] mb-1">{title}</h3>
      <p className="text-xs text-[#A0ADB0] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && (
        <Button
          size="sm"
          variant={actionVariant}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
