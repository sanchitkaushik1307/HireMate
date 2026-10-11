import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const icons = {
    info: <Info className="w-4 h-4 text-[#70D6E8]" />,
    success: <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#FBBF24]" />,
    error: <AlertCircle className="w-4 h-4 text-[#F87171]" />,
  };

  const borders = {
    info: 'border-[#70D6E8]/30',
    success: 'border-[#4ADE80]/30',
    warning: 'border-[#FBBF24]/30',
    error: 'border-[#F87171]/30',
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {/* Toast container floating at bottom right */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto p-3.5 rounded-lg bg-[#0E1518] border ${
              borders[t.variant || 'info']
            } shadow-xl flex items-start gap-3 transition-all animate-slide-up`}
          >
            <span className="shrink-0 mt-0.5">{icons[t.variant || 'info']}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#F2F0E9] leading-tight">{t.title}</p>
              {t.description && (
                <p className="text-[11px] text-[#A0ADB0] mt-1 leading-snug">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded text-[#607074] hover:text-[#F2F0E9] hover:bg-[#141D20] transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
