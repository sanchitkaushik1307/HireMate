import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}: TabsProps) {
  if (variant === 'pill') {
    return (
      <div className={`inline-flex p-1 rounded-lg bg-[#0E1518] border border-[#273438] ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 select-none
                focus:outline-none focus-visible:ring-1 focus-visible:ring-[#70D6E8]
                ${
                  isActive
                    ? 'bg-[#141D20] text-[#F2F0E9] shadow-xs border border-[#3A4C52]/50'
                    : 'text-[#A0ADB0] hover:text-[#F2F0E9] hover:bg-[#141D20]/50'
                }
              `}
            >
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                    isActive ? 'bg-[#70D6E8]/15 text-[#70D6E8]' : 'bg-[#141D20] text-[#607074]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`border-b border-[#273438] flex items-center gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative pb-3 flex items-center gap-2 text-xs font-medium transition-colors duration-150 select-none
              focus:outline-none focus-visible:text-[#F2F0E9]
              ${isActive ? 'text-[#F2F0E9]' : 'text-[#A0ADB0] hover:text-[#F2F0E9]'}
            `}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                  isActive ? 'bg-[#70D6E8]/20 text-[#70D6E8]' : 'bg-[#141D20] text-[#607074]'
                }`}
              >
                {tab.badge}
              </span>
            )}

            {/* Restrained indicator line */}
            {isActive && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#70D6E8] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
