import { forwardRef } from 'react';

export interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      checked,
      onChange,
      label,
      description,
      disabled = false,
      className = '',
    },
    ref
  ) => {
    return (
      <div className={`flex items-start justify-between gap-3 ${className}`}>
        {(label || description) && (
          <div
            className={`text-xs select-none pr-2 ${
              disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={() => !disabled && onChange(!checked)}
          >
            {label && <p className="font-medium text-[#F2F0E9]">{label}</p>}
            {description && <p className="text-[#A0ADB0] mt-0.5">{description}</p>}
          </div>
        )}

        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out
            focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8] focus-visible:ring-offset-1 focus-visible:ring-offset-[#080D0F]
            ${checked ? 'bg-[#70D6E8]' : 'bg-[#273438]'}
            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          `}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#080D0F] shadow-sm ring-0 transition duration-200 ease-in-out ${
              checked ? 'translate-x-4 bg-[#080D0F]' : 'translate-x-0.5 bg-[#A0ADB0]'
            }`}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
export default Switch;
