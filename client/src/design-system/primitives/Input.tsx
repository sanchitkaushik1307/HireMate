import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftElement,
      rightElement,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#A0ADB0]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#607074]">
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full h-9 rounded-lg bg-[#0E1518] text-[#F2F0E9] text-xs sm:text-sm placeholder-[#607074]
              border transition-colors duration-150
              ${leftElement ? 'pl-9' : 'pl-3.5'}
              ${rightElement ? 'pr-9' : 'pr-3.5'}
              ${
                error
                  ? 'border-[#F87171] focus:border-[#F87171] focus:ring-1 focus:ring-[#F87171]'
                  : 'border-[#273438] hover:border-[#3A4C52] focus:border-[#70D6E8] focus:ring-1 focus:ring-[#70D6E8]'
              }
              focus:outline-none
              disabled:opacity-50 disabled:bg-[#080D0F] disabled:cursor-not-allowed
              ${className}`}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 flex items-center text-[#607074]">
              {rightElement}
            </div>
          )}
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

Input.displayName = 'Input';
export default Input;
