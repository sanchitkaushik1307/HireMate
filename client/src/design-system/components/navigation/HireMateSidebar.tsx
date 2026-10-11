import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  FileText,
  Trophy,
  Sparkles,
  Bookmark,
  Settings,
  LogOut,
} from 'lucide-react';
import { Logo } from '../../../components/Logo';

export interface NavItemDef {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface HireMateSidebarProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  className?: string;
}

export function HireMateNavItem({
  label,
  icon,
  badge,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  badge?: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 text-left select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8] ${
        isActive
          ? 'bg-[#141D20] text-[#F2F0E9] font-semibold'
          : 'text-[#A0ADB0] hover:text-[#F2F0E9] hover:bg-[#141D20]/60'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`shrink-0 transition-colors duration-150 ${
            isActive ? 'text-[#70D6E8]' : 'text-[#607074] group-hover:text-[#A0ADB0]'
          }`}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>

      {badge && (
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#141D20] text-[#70D6E8] border border-[#273438]">
          {badge}
        </span>
      )}

      {/* Slim accent indicator on active item */}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1.5 bottom-1.5 w-0.75 bg-[#70D6E8] rounded-r-full"
        />
      )}
    </button>
  );
}

export function HireMateSidebar({
  activePath = '/dashboard',
  onNavigate,
  onLogout,
  user = { name: 'Alex Vance', email: 'alex@stanford.edu' },
  className = '',
}: HireMateSidebarProps) {
  const primaryNav: NavItemDef[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Jobs', path: '/jobs', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Applications', path: '/applications', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'Resume', path: '/resume', icon: <FileText className="w-4 h-4" /> },
    { label: 'Hackathons', path: '/hackathons', icon: <Trophy className="w-4 h-4" /> },
    {
      label: 'AI Assistant',
      path: '/assistant',
      icon: <Sparkles className="w-4 h-4 text-[#70D6E8]" />,
      badge: 'BETA',
    },
  ];

  const secondaryNav: NavItemDef[] = [
    { label: 'Saved', path: '/saved', icon: <Bookmark className="w-4 h-4" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'HM';

  return (
    <aside
      aria-label="HireMate sidebar"
      className={`w-64 h-full bg-[#0E1518] border-r border-[#273438] flex flex-col justify-between select-none ${className}`}
    >
      <div>
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center border-b border-[#273438]/70">
          <Logo size="sm" variant="light" />
        </div>

        {/* Primary nav group */}
        <div className="px-3 pt-5 pb-3 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-[#607074]">
            Platform
          </p>
          {primaryNav.map((item) => (
            <HireMateNavItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              isActive={activePath === item.path}
              onClick={() => onNavigate?.(item.path)}
            />
          ))}
        </div>

        {/* Secondary nav group */}
        <div className="px-3 pt-3 border-t border-[#273438]/60 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-[#607074]">
            Workspace
          </p>
          {secondaryNav.map((item) => (
            <HireMateNavItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              isActive={activePath === item.path}
              onClick={() => onNavigate?.(item.path)}
            />
          ))}
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-[#273438]/70">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#141D20] border border-[#273438]/80">
          <div className="flex items-center gap-2.5 min-w-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-[#273438] shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1A2528] border border-[#273438] flex items-center justify-center text-xs font-semibold text-[#F2F0E9] shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#F2F0E9] truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-[#A0ADB0] truncate leading-tight">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out"
            aria-label="Sign out"
            className="p-1.5 rounded-md text-[#607074] hover:text-[#F87171] hover:bg-[#1A2528] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8] shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default HireMateSidebar;
