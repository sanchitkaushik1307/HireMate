import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-[#A0ADB0]">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full h-9 appearance-none rounded-lg bg-[#0E1518] text-[#F2F0E9] text-xs sm:text-sm pl-3.5 pr-8
              border transition-colors duration-150 cursor-pointer
              ${
                error
                  ? 'border-[#F87171] focus:border-[#F87171] focus:ring-1 focus:ring-[#F87171]'
                  : 'border-[#273438] hover:border-[#3A4C52] focus:border-[#70D6E8] focus:ring-1 focus:ring-[#70D6E8]'
              }
              focus:outline-none
              disabled:opacity-50 disabled:bg-[#080D0F] disabled:cursor-not-allowed
              ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-[#0E1518] text-[#F2F0E9]"
              >
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="w-4 h-4 text-[#607074] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {error ? (
          <p className="text-[11px] text-[#F87171] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#607074]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
