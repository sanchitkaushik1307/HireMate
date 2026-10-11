import React from 'react';

/**
 * PageTransition - Smooth entrance for route transitions
 */
export function PageTransition({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`animate-fade-in transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Reveal - Small vertical entrance movement (150-200ms)
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-slide-up transition-opacity duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Stagger - Sequentially animates direct children with configurable interval
 */
export function Stagger({
  children,
  interval = 40,
  className = '',
}: {
  children: React.ReactNode;
  interval?: number;
  className?: string;
}) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          style={{ animationDelay: `${index * interval}ms` }}
          className="animate-slide-up fill-mode-backwards"
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * HoverLift - Subtle interactive lift feedback for cards and elevated elements
 */
export function HoverLift({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * ScaleIn - Pop-in for modals, popovers, and badges
 */
export function ScaleIn({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`animate-scale-in transition-all duration-150 ${className}`}>
      {children}
    </div>
  );
}
