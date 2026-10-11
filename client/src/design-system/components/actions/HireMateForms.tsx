import { forwardRef, useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input, type InputProps } from '../../primitives/Input';
import { Select, type SelectProps } from '../../primitives/Select';

export type { SelectProps as HireMateSelectProps };
export const HireMateInput = Input;
export const HireMateSelect = Select;

export interface HireMateSearchProps extends Omit<InputProps, 'leftElement' | 'rightElement'> {
  onClear?: () => void;
}

export const HireMateSearch = forwardRef<HTMLInputElement, HireMateSearchProps>(
  ({ value, onChange, onClear, placeholder = 'Search jobs, companies, skills...', className = '', ...props }, ref) => {
    const hasValue = Boolean(value);

    return (
      <Input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        leftElement={<Search className="w-4 h-4 text-[#607074]" />}
        rightElement={
          hasValue && onClear ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="p-0.5 rounded text-[#607074] hover:text-[#F2F0E9] transition-colors focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : undefined
        }
        className={className}
        {...props}
      />
    );
  }
);

HireMateSearch.displayName = 'HireMateSearch';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface HireMateFilterProps {
  label: string;
  options: FilterOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  className?: string;
}

export function HireMateFilter({
  label,
  options,
  selectedIds,
  onChange,
  className = '',
}: HireMateFilterProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const activeCount = selectedIds.length;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 h-9 px-3 rounded-lg text-xs font-medium border transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8] ${
          activeCount > 0
            ? 'bg-[#141D20] text-[#70D6E8] border-[#70D6E8]/40'
            : 'bg-[#0E1518] text-[#A0ADB0] hover:text-[#F2F0E9] border-[#273438] hover:border-[#3A4C52]'
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>{label}</span>
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-[#70D6E8]/20 text-[#70D6E8] text-[10px] flex items-center justify-center font-mono">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 mt-1.5 w-56 rounded-xl bg-[#0E1518] border border-[#273438] p-2 shadow-xl z-50 animate-scale-in">
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#273438] px-2 text-[11px] font-semibold tracking-wider uppercase text-[#607074]">
              <span>{label}</span>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-[10px] text-[#A0ADB0] hover:text-[#70D6E8] lowercase"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-0.5 max-h-52 overflow-y-auto">
              {options.map((opt) => {
                const isChecked = selectedIds.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#141D20] cursor-pointer text-xs text-[#F2F0E9] select-none"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleOption(opt.id)}
                        className="rounded border-[#273438] bg-[#080D0F] text-[#70D6E8] focus:ring-[#70D6E8] focus:ring-offset-0 w-3.5 h-3.5"
                      />
                      <span>{opt.label}</span>
                    </div>
                    {opt.count !== undefined && (
                      <span className="text-[10px] font-mono text-[#607074]">{opt.count}</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
