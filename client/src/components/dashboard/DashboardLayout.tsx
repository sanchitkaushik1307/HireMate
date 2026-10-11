import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import type { User } from '../../context/AuthContext';
import { Logo } from '../Logo';

interface DashboardLayoutProps {
  user: User;
  children: ReactNode;
  activePath?: string;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}

export function DashboardLayout({
  user,
  children,
  activePath = '/dashboard',
  onNavigate,
  onLogout,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-charcoal-950 text-charcoal-100 flex flex-col lg:flex-row antialiased selection:bg-charcoal-700 selection:text-white">
      {/* ─── Desktop Sidebar ─── */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-40">
        <Sidebar
          user={user}
          activePath={activePath}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      </div>

      {/* ─── Mobile Sidebar Overlay Drawer ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 bg-charcoal-900 border-r border-charcoal-750 shadow-2xl flex flex-col justify-between z-50">
            <div>
              <div className="h-16 px-6 flex items-center justify-between border-b border-charcoal-750">
                <Logo size="sm" variant="light" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-charcoal-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="p-4 space-y-1">
                {[
                  { label: 'Dashboard', path: '/dashboard' },
                  { label: 'Jobs', path: '/jobs' },
                  { label: 'Applications', path: '/applications' },
                  { label: 'Resume', path: '/resume' },
                  { label: 'Hackathons', path: '/hackathons' },
                  { label: 'Saved', path: '/saved' },
                  { label: 'Settings', path: '/settings' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate?.(item.path);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activePath === item.path
                        ? 'bg-charcoal-800 text-charcoal-100 font-semibold'
                        : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-850'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-charcoal-750">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout?.();
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-charcoal-800 rounded-lg flex items-center gap-2"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Content Shell ─── */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <TopBar
          user={user}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={onLogout}
        />

        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav
        aria-label="Mobile bottom navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 h-14 bg-charcoal-900/95 backdrop-blur-md border-t border-charcoal-750 flex items-center justify-around z-40 px-2"
      >
        {[
          {
            label: 'Home',
            path: '/dashboard',
            icon: (active: boolean) => (
              <svg className={`w-5 h-5 ${active ? 'text-charcoal-100' : 'text-charcoal-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            ),
          },
          {
            label: 'Jobs',
            path: '/jobs',
            icon: (active: boolean) => (
              <svg className={`w-5 h-5 ${active ? 'text-charcoal-100' : 'text-charcoal-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ),
          },
          {
            label: 'Applications',
            path: '/applications',
            icon: (active: boolean) => (
              <svg className={`w-5 h-5 ${active ? 'text-charcoal-100' : 'text-charcoal-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            ),
          },
          {
            label: 'Resume',
            path: '/resume',
            icon: (active: boolean) => (
              <svg className={`w-5 h-5 ${active ? 'text-charcoal-100' : 'text-charcoal-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          },
        ].map((tab) => {
          const isActive = activePath === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => onNavigate?.(tab.path)}
              className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors"
            >
              {tab.icon(isActive)}
              <span className={`mt-0.5 ${isActive ? 'text-charcoal-100 font-semibold' : 'text-charcoal-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
