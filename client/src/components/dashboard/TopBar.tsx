import { useState, useRef, useEffect } from 'react';
import type { User } from '../../context/AuthContext';

interface TopBarProps {
  user: User;
  onOpenMobileMenu?: () => void;
  onLogout?: () => void;
}

export function TopBar({ user, onOpenMobileMenu, onLogout }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-charcoal-750/80 bg-charcoal-900/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation menu"
          className="lg:hidden p-2 rounded-lg text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-1 focus:ring-charcoal-500"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Section title */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-charcoal-400">
          <span className="text-charcoal-200 font-medium">HireMate</span>
          <span className="text-charcoal-600">/</span>
          <span className="text-charcoal-400">Dashboard</span>
        </div>
      </div>

      {/* Center: Search only if useful */}
      <div className="flex-1 max-w-xs sm:max-w-sm mx-4 hidden md:block">
        <div className="relative">
          <svg
            className="w-4 h-4 text-charcoal-500 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search roles, companies, skills..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-charcoal-850 border border-charcoal-750 text-charcoal-200 placeholder-charcoal-500 focus:outline-none focus:border-charcoal-600 focus:ring-1 focus:ring-charcoal-600 transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications & User profile menu */}
      <div className="flex items-center gap-2.5">
        {/* Notifications button */}
        <button
          aria-label="View notifications"
          title="Notifications"
          className="relative p-2 rounded-lg text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-1 focus:ring-charcoal-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Subtle indicator dot */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cream-400" />
        </button>

        {/* User avatar menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="User account menu"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-1 focus:ring-charcoal-500"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-charcoal-700"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-charcoal-750 border border-charcoal-700 flex items-center justify-center text-xs font-semibold text-charcoal-200">
                {initials}
              </div>
            )}
            <svg
              className={`w-3.5 h-3.5 text-charcoal-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-charcoal-750 bg-charcoal-850 shadow-xl py-1.5 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-charcoal-750/70">
                <p className="font-semibold text-charcoal-100 truncate">{user.name}</p>
                <p className="text-charcoal-400 truncate mt-0.5">{user.email}</p>
                <span className="inline-block mt-1.5 text-[10px] font-mono text-cream-400 bg-cream-500/10 border border-cream-500/20 px-1.5 py-0.5 rounded">
                  {user.googleId ? 'Google Account' : 'Standard Account'}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full px-3.5 py-2 text-left text-red-400 hover:bg-charcoal-800 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
