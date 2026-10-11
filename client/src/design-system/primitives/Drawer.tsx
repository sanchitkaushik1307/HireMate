import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  position = 'right',
  size = 'md',
}: DrawerProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose();
    }
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: position === 'bottom' ? 'h-72' : 'w-72',
    md: position === 'bottom' ? 'h-96' : 'w-96',
    lg: position === 'bottom' ? 'h-[500px]' : 'w-[480px]',
  };

  const positionClasses = {
    right: 'inset-y-0 right-0 border-l',
    left: 'inset-y-0 left-0 border-r',
    bottom: 'inset-x-0 bottom-0 border-t rounded-t-2xl',
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-150 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Surface */}
      <div
        className={`fixed ${positionClasses[position]} ${sizeClasses[size]} bg-[#0E1518] border-[#273438] shadow-2xl flex flex-col justify-between z-10 animate-fade-in`}
      >
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#273438]">
            <div>
              {title && (
                <h3 className="text-sm font-semibold text-[#F2F0E9] tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-[11px] text-[#A0ADB0] mt-0.5">{description}</p>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1 rounded-md text-[#607074] hover:text-[#F2F0E9] hover:bg-[#141D20] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-140px)] text-xs text-[#F2F0E9]">
            {children}
          </div>
        </div>

        {footer && (
          <div className="p-4 border-t border-[#273438] bg-[#0E1518] flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Drawer;
