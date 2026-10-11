export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

export function Separator({
  orientation = 'horizontal',
  className = '',
  label,
}: SeparatorProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 my-4 ${className}`}>
        <div className="flex-1 h-px bg-[#273438]" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#607074]">
          {label}
        </span>
        <div className="flex-1 h-px bg-[#273438]" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`bg-[#273438] shrink-0 ${
        orientation === 'horizontal' ? 'h-px w-full my-4' : 'w-px h-full mx-2 self-stretch'
      } ${className}`}
    />
  );
}

export default Separator;
