import { Logo } from '../Logo';
import type { User } from '../../context/AuthContext';

interface SidebarProps {
  user: User;
  activePath?: string;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: (props: { className?: string }) => JSX.Element;
  badge?: string;
}

const mainNav: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: 'Jobs',
    path: '/jobs',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Applications',
    path: '/applications',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Resume',
    path: '/resume',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Hackathons',
    path: '/hackathons',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: 'AI Assistant',
    path: '/assistant',
    badge: 'Soon',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

const secondaryNav: NavItem[] = [
  {
    label: 'Saved',
    path: '/saved',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function Sidebar({
  user,
  activePath = '/dashboard',
  onNavigate,
  onLogout,
}: SidebarProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      aria-label="Main sidebar"
      className="w-64 h-screen bg-charcoal-900 border-r border-charcoal-750 flex flex-col justify-between select-none"
    >
      {/* Top brand header */}
      <div>
        <div className="h-16 px-6 flex items-center border-b border-charcoal-750/70">
          <Logo size="sm" variant="light" />
        </div>

        {/* Main navigation */}
        <nav className="px-3 pt-5 pb-3 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-charcoal-500">
            Platform
          </p>
          {mainNav.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => onNavigate?.(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left focus:outline-none focus:ring-1 focus:ring-charcoal-500 ${
                  isActive
                    ? 'bg-charcoal-800 text-charcoal-100 font-semibold'
                    : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-850'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-charcoal-100' : 'text-charcoal-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-charcoal-800 text-charcoal-400 border border-charcoal-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Secondary navigation */}
        <div className="px-3 pt-3 border-t border-charcoal-750/70 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-charcoal-500">
            Workspace
          </p>
          {secondaryNav.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => onNavigate?.(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left focus:outline-none focus:ring-1 focus:ring-charcoal-500 ${
                  isActive
                    ? 'bg-charcoal-800 text-charcoal-100'
                    : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-850'
                }`}
              >
                <Icon className="w-4 h-4 text-charcoal-500 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom user profile card */}
      <div className="p-3 border-t border-charcoal-750/70">
        <div className="flex items-center justify-between p-2 rounded-lg bg-charcoal-850/60 border border-charcoal-800">
          <div className="flex items-center gap-2.5 min-w-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-charcoal-700 shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-charcoal-750 border border-charcoal-700 flex items-center justify-center text-xs font-semibold text-charcoal-200 shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-charcoal-200 truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-charcoal-500 truncate leading-tight">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out"
            aria-label="Sign out"
            className="p-1.5 rounded-md text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-750 transition-colors focus:outline-none focus:ring-1 focus:ring-charcoal-500 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
