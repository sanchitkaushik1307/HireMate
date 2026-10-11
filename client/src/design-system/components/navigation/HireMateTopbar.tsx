import React, { useState } from 'react';
import {
  Bell,
  Menu,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { HireMateSearch } from '../actions/HireMateForms';
import { DropdownMenu, type DropdownMenuItem } from '../../primitives/DropdownMenu';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function HireMateBreadcrumb({
  items,
  onNavigate,
  className = '',
}: {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#607074] shrink-0" />}
            {isLast ? (
              <span className="font-medium text-[#F2F0E9] truncate" aria-current="page">
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => item.href && onNavigate?.(item.href)}
                className="text-[#A0ADB0] hover:text-[#F2F0E9] transition-colors truncate focus:outline-none focus:underline"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export interface HireMateTopbarProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  breadcrumbItems?: BreadcrumbItem[];
  onOpenMobileNav?: () => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  hasUnreadNotifications?: boolean;
  className?: string;
}

export function HireMateTopbar({
  user = { name: 'Alex Vance', email: 'alex@stanford.edu' },
  breadcrumbItems = [{ label: 'HireMate', href: '/' }, { label: 'Dashboard' }],
  onOpenMobileNav,
  onLogout,
  onSearch,
  hasUnreadNotifications = true,
  className = '',
}: HireMateTopbarProps) {
  const [searchVal, setSearchVal] = useState('');

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'HM';

  const menuItems: DropdownMenuItem[] = [
    {
      id: 'profile',
      label: 'Profile & Preferences',
      icon: <UserIcon className="w-3.5 h-3.5" />,
    },
    {
      id: 'logout',
      label: 'Sign out',
      icon: <LogOut className="w-3.5 h-3.5" />,
      variant: 'destructive',
      onClick: onLogout,
    },
  ];

  return (
    <header
      className={`h-16 px-4 sm:px-8 border-b border-[#273438] bg-[#0E1518]/90 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between gap-4 ${className}`}
    >
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-[#A0ADB0] hover:text-[#F2F0E9] hover:bg-[#141D20] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <HireMateBreadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Center: Search input */}
      <div className="flex-1 max-w-sm hidden md:block">
        <HireMateSearch
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            onSearch?.(e.target.value);
          }}
          onClear={() => {
            setSearchVal('');
            onSearch?.('');
          }}
          placeholder="Search jobs, companies, skills..."
        />
      </div>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-lg text-[#A0ADB0] hover:text-[#F2F0E9] hover:bg-[#141D20] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8]"
        >
          <Bell className="w-4 h-4" />
          {hasUnreadNotifications && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#E9D8B4]" />
          )}
        </button>

        <DropdownMenu
          align="right"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#141D20] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8]"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full border border-[#273438]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#1A2528] border border-[#273438] flex items-center justify-center text-xs font-semibold text-[#F2F0E9]">
                  {initials}
                </div>
              )}
            </button>
          }
          items={menuItems}
        />
      </div>
    </header>
  );
}

export function HireMateMobileNav({
  open,
  onClose,
  activePath = '/dashboard',
  onNavigate,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}) {
  if (!open) return null;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'Applications', path: '/applications' },
    { label: 'Resume', path: '/resume' },
    { label: 'Hackathons', path: '/hackathons' },
    { label: 'AI Assistant', path: '/assistant' },
    { label: 'Saved', path: '/saved' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 w-72 bg-[#0E1518] border-r border-[#273438] p-6 flex flex-col justify-between shadow-2xl animate-fade-in">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-[#273438]">
            <span className="font-bold text-base text-[#F2F0E9] tracking-tight">HireMate</span>
            <button
              onClick={onClose}
              className="text-[#607074] hover:text-[#F2F0E9] p-1"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate?.(item.path);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  activePath === item.path
                    ? 'bg-[#141D20] text-[#70D6E8] font-semibold border-l-2 border-[#70D6E8]'
                    : 'text-[#A0ADB0] hover:text-[#F2F0E9] hover:bg-[#141D20]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#273438]">
          <button
            onClick={() => {
              onClose();
              onLogout?.();
            }}
            className="w-full text-left px-3 py-2 text-xs font-medium text-[#F87171] hover:bg-[#2A1616] rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
