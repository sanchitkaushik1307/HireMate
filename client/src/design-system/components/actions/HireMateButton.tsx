import React, { forwardRef } from 'react';
import { Button, type ButtonProps } from '../../primitives/Button';

export interface HireMateButtonProps extends ButtonProps {
  /** Warm cream accent variant or restrained cyan highlight */
  accentStyle?: 'cyan' | 'cream' | 'default';
}

export const HireMateButton = forwardRef<HTMLButtonElement, HireMateButtonProps>(
  ({ accentStyle = 'default', variant = 'secondary', className = '', ...props }, ref) => {
    let customVariantClass = '';

    if (accentStyle === 'cream') {
      customVariantClass =
        'bg-[#E9D8B4] text-[#080D0F] hover:bg-[#F2ECDE] active:bg-[#D5C4A1] border-transparent font-medium';
    } else if (accentStyle === 'cyan' || variant === 'accent') {
      customVariantClass =
        'bg-[#70D6E8] text-[#080D0F] hover:bg-[#8DE0EE] active:bg-[#5DCADF] border-transparent font-medium';
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        className={`${customVariantClass} ${className}`}
        {...props}
      />
    );
  }
);

HireMateButton.displayName = 'HireMateButton';

export interface HireMateIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'secondary' | 'ghost' | 'outline';
}

export const HireMateIconButton = forwardRef<HTMLButtonElement, HireMateIconButtonProps>(
  ({ icon, size = 'md', variant = 'secondary', className = '', ...props }, ref) => {
    const sizeMap = {
      sm: 'w-7 h-7 text-xs',
      md: 'w-8 h-8 text-sm',
      lg: 'w-9 h-9 text-base',
    };

    const variantMap = {
      secondary: 'bg-[#141D20] text-[#A0ADB0] hover:text-[#F2F0E9] hover:bg-[#1A2528] border border-[#273438]',
      ghost: 'bg-transparent text-[#A0ADB0] hover:text-[#F2F0E9] hover:bg-[#141D20]',
      outline: 'bg-transparent text-[#A0ADB0] hover:text-[#F2F0E9] border border-[#273438] hover:border-[#3A4C52]',
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8] disabled:opacity-40 disabled:cursor-not-allowed ${sizeMap[size]} ${variantMap[variant]} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

HireMateIconButton.displayName = 'HireMateIconButton';

export default HireMateButton;
