import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Sizing tokens
    const sizeClasses = {
      xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-md',
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-9 px-4 text-sm gap-2 rounded-lg',
      lg: 'h-11 px-5 text-sm gap-2.5 rounded-lg font-medium',
      icon: 'h-9 w-9 p-0 flex items-center justify-center rounded-lg',
    };

    // Variant styling tokens
    const variantClasses = {
      // Primary: Warm off-white or charcoal inverted, solid and confident
      primary:
        'bg-[#F2F0E9] text-[#080D0F] hover:bg-[#FFFFFF] active:bg-[#E5E2D9] font-medium shadow-sm border border-transparent disabled:bg-[#273438] disabled:text-[#607074]',
      // Secondary: Deep surface with subtle border
      secondary:
        'bg-[#141D20] text-[#F2F0E9] hover:bg-[#1A2528] active:bg-[#1F2E32] border border-[#273438] hover:border-[#3A4C52] disabled:opacity-50 disabled:pointer-events-none',
      // Accent: Cyan highlight, selective usage
      accent:
        'bg-[#70D6E8] text-[#080D0F] hover:bg-[#8DE0EE] active:bg-[#5DCADF] font-medium shadow-sm disabled:opacity-50',
      // Outline: Transparent with muted border
      outline:
        'bg-transparent text-[#F2F0E9] border border-[#273438] hover:border-[#3A4C52] hover:bg-[#0E1518] active:bg-[#141D20] disabled:opacity-50',
      // Ghost: Subtle hover state
      ghost:
        'bg-transparent text-[#A0ADB0] hover:text-[#F2F0E9] hover:bg-[#141D20] active:bg-[#1A2528] disabled:opacity-40',
      // Destructive: Muted red styling, not glaring neon
      destructive:
        'bg-[#2A1616] text-[#F87171] hover:bg-[#3D1E1E] hover:text-[#FFA3A3] border border-[#4D2222] active:bg-[#4D2222] disabled:opacity-50',
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center font-medium transition-colors duration-150 select-none
          focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8] focus-visible:ring-offset-1 focus-visible:ring-offset-[#080D0F]
          disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span className="truncate">{children}</span>}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
