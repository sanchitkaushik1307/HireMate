import { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
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
      <div className={`flex items-start gap-2.5 ${className}`}>
        <button
          ref={ref}
          id={id}
          type="button"
          role="checkbox"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center transition-colors duration-150 border
            focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8] focus-visible:ring-offset-1 focus-visible:ring-offset-[#080D0F]
            ${
              checked
                ? 'bg-[#70D6E8] border-[#70D6E8] text-[#080D0F]'
                : 'bg-[#0E1518] border-[#273438] hover:border-[#3A4C52] text-transparent'
            }
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Check className={`w-3 h-3 stroke-[3] ${checked ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        {(label || description) && (
          <div
            className={`text-xs select-none ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !disabled && onChange(!checked)}
          >
            {label && <p className="font-medium text-[#F2F0E9]">{label}</p>}
            {description && <p className="text-[#A0ADB0] mt-0.5">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
