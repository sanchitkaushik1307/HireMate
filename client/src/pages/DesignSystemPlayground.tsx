import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  MousePointerClick,
  Compass,
  Briefcase,
  BellRing,
  Activity,
} from 'lucide-react';

// Design System Imports
import {
  colors,
  Button,
  Input,
  Select,
  Checkbox,
  Switch,
  Dialog,
  DropdownMenu,
  Tabs,
  Tooltip,
  Drawer,
  Skeleton,
  Separator,
  useToast,
  HireMateButton,
  HireMateIconButton,
  HireMateSearch,
  HireMateFilter,
  HireMateSidebar,
  HireMateTopbar,
  HireMateBreadcrumb,
  HireMateMobileNav,
  HireMatePageHeader,
  HireMateSection,
  HireMateEmptyState,
  HireMateJobCard,
  HireMateCompanyCard,
  HireMateMatchScore,
  HireMateSkillTag,
  HireMateApplicationStatus,
  HireMateResumeCard,
  HireMateProfileCompletion,
  HireMateOpportunityCard,
  PageTransition,
  Reveal,
  Stagger,
  HoverLift,
  ScaleIn,
} from '../design-system';

export function DesignSystemPlayground() {
  const { toast } = useToast();

  // Active playground section
  const [activeSection, setActiveSection] = useState<'foundations' | 'buttons' | 'navigation' | 'career' | 'feedback' | 'motion'>('foundations');

  // Interactive control states
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectVal, setSelectVal] = useState('swe');
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [switchVal, setSwitchVal] = useState(true);
  const [filterTags, setFilterTags] = useState<string[]>(['react', 'ts']);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Modal / Drawer / Nav state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [staggerKey, setStaggerKey] = useState(0);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    toast({
      title: 'Copied to clipboard',
      description: text,
      variant: 'info',
      duration: 2000,
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const sections = [
    { id: 'foundations', label: 'Foundations', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'buttons', label: 'Buttons & Forms', icon: <MousePointerClick className="w-3.5 h-3.5" /> },
    { id: 'navigation', label: 'Navigation', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'career', label: 'Career Components', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'feedback', label: 'Feedback & States', icon: <BellRing className="w-3.5 h-3.5" /> },
    { id: 'motion', label: 'Motion System', icon: <Activity className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#080D0F] text-[#F2F0E9] antialiased">
        {/* ── Top Header ── */}
        <header className="sticky top-0 z-40 bg-[#0E1518]/95 backdrop-blur-md border-b border-[#273438] px-4 sm:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs text-[#A0ADB0] hover:text-[#F2F0E9] transition-colors p-1.5 rounded-lg hover:bg-[#141D20]"
                title="Return to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="h-4 w-px bg-[#273438]" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-[#F2F0E9]">HireMate</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#70D6E8]/10 text-[#70D6E8] border border-[#70D6E8]/20 font-medium">
                  Design System v1.0
                </span>
              </div>
            </div>

            {/* Quick Section Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-[#080D0F] p-1 rounded-lg border border-[#273438]">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeSection === sec.id
                      ? 'bg-[#141D20] text-[#70D6E8] border border-[#70D6E8]/30 shadow-xs'
                      : 'text-[#A0ADB0] hover:text-[#F2F0E9] hover:bg-[#141D20]/50'
                  }`}
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#607074] hidden sm:inline">DEV ONLY</span>
              <Button
                size="xs"
                variant="accent"
                onClick={() =>
                  toast({
                    title: 'System Healthy',
                    description: 'HireMate design tokens and primitives loaded cleanly.',
                    variant: 'success',
                  })
                }
              >
                Health Check
              </Button>
            </div>
          </div>

          {/* Mobile Section Tabs */}
          <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pt-3 pb-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs whitespace-nowrap rounded-md font-medium shrink-0 ${
                  activeSection === sec.id
                    ? 'bg-[#141D20] text-[#70D6E8] border border-[#70D6E8]/30'
                    : 'text-[#A0ADB0] bg-[#0E1518]'
                }`}
              >
                {sec.icon}
                <span>{sec.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* ── Main Container ── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
          {/* Subheader */}
          <div className="pb-6 border-b border-[#273438] flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#70D6E8] mb-1">
                Visual Language & Component Playground
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F2F0E9]">
                HireMate Design System
              </h1>
              <p className="text-xs sm:text-sm text-[#A0ADB0] mt-1 max-w-2xl leading-relaxed">
                Centralized production tokens, accessible primitives, and career product components designed specifically for early-career software engineers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#77B7A5] bg-[#77B7A5]/10 border border-[#77B7A5]/25 px-2.5 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#77B7A5]" />
                Zero generic AI SaaS gradients
              </span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION A: FOUNDATIONS
          ══════════════════════════════════════════════════════════════ */}
          {(activeSection === 'foundations' || true) && (
            <section id="foundations" className={activeSection !== 'foundations' ? 'hidden' : 'space-y-8 animate-fade-in'}>
              <div>
                <h2 className="text-lg font-semibold text-[#F2F0E9] tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#70D6E8]" />
                  A. Foundations & Semantic Tokens
                </h2>
                <p className="text-xs text-[#A0ADB0] mt-0.5">
                  Curated color swatches, typography scale, spacing tokens, and border geometry.
                </p>
              </div>

              {/* 1. Color Palette */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Surface & Typography Hierarchy
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { name: 'Background', hex: colors.background, role: 'Base page canvas', text: '#F2F0E9' },
                    { name: 'Surface', hex: colors.surface, role: 'Cards & Sidebar', text: '#F2F0E9' },
                    { name: 'Elevated Surface', hex: colors.surfaceElevated, role: 'Active cards & inputs', text: '#F2F0E9' },
                    { name: 'Surface Hover', hex: colors.surfaceHover, role: 'Interactive hover', text: '#F2F0E9' },
                    { name: 'Border Subtle', hex: colors.border, role: 'Dividers & outlines', text: '#F2F0E9' },
                    { name: 'Border Strong', hex: colors.borderStrong, role: 'Hover borders', text: '#F2F0E9' },
                    { name: 'Primary Text', hex: colors.foreground, role: 'Headings & active', text: '#080D0F' },
                    { name: 'Muted Text', hex: colors.foregroundMuted, role: 'Body & metadata', text: '#080D0F' },
                    { name: 'Subtle Text', hex: colors.foregroundSubtle, role: 'Labels & icons', text: '#F2F0E9' },
                    { name: 'Focus Ring', hex: colors.focusRing, role: 'Keyboard accessibility', text: '#080D0F' },
                  ].map((c) => (
                    <div
                      key={c.name}
                      onClick={() => copyToClipboard(c.hex, c.name)}
                      className="group p-3 rounded-xl border border-[#273438] bg-[#0E1518] hover:border-[#3A4C52] cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div
                        className="w-full h-12 rounded-lg border border-black/20 flex items-center justify-end p-2 transition-transform group-hover:scale-[1.02]"
                        style={{ backgroundColor: c.hex }}
                      >
                        {copiedToken === c.name ? (
                          <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: c.text }} />
                        )}
                      </div>
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#F2F0E9] truncate">{c.name}</p>
                          <span className="text-[10px] font-mono text-[#607074]">{c.hex}</span>
                        </div>
                        <p className="text-[10px] text-[#A0ADB0] mt-0.5 truncate">{c.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Restrained Accent & Status Colors */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Accent & Semantic Statuses (Selective & Restrained)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {[
                    { name: 'Accent Cyan', hex: colors.accent, role: 'Active nav & highlights' },
                    { name: 'Accent Hover', hex: colors.accentHover, role: 'Interactive focus' },
                    { name: 'Muted Teal', hex: colors.teal, role: 'Secondary progress' },
                    { name: 'Warm Cream', hex: colors.cream, role: 'Key notifications' },
                    { name: 'Success', hex: colors.success, role: 'Offers & accepted' },
                    { name: 'Warning', hex: colors.warning, role: 'Interviews & deadlines' },
                    { name: 'Danger', hex: colors.danger, role: 'Declined & errors' },
                  ].map((c) => (
                    <div
                      key={c.name}
                      onClick={() => copyToClipboard(c.hex, c.name)}
                      className="group p-3 rounded-xl border border-[#273438] bg-[#0E1518] hover:border-[#3A4C52] cursor-pointer transition-all"
                    >
                      <div
                        className="w-full h-9 rounded-lg border border-black/20 flex items-center justify-end p-1.5"
                        style={{ backgroundColor: c.hex }}
                      >
                        {copiedToken === c.name ? (
                          <Check className="w-3 h-3 text-[#080D0F]" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#080D0F] opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-[#F2F0E9] truncate">{c.name}</p>
                        <p className="text-[10px] font-mono text-[#A0ADB0]">{c.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Typography Scale */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Editorial Type Scale
                </h3>
                <div className="rounded-xl border border-[#273438] bg-[#0E1518] p-5 divide-y divide-[#273438]/70">
                  <div className="pb-4 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#70D6E8] w-36">Display (3xl)</span>
                    <h1 className="text-3xl font-semibold text-[#F2F0E9] tracking-tight flex-1">
                      Land your dream software role
                    </h1>
                    <span className="text-[11px] font-mono text-[#607074]">1.875rem / 600</span>
                  </div>

                  <div className="py-4 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#70D6E8] w-36">Page Heading (2xl)</span>
                    <h2 className="text-2xl font-semibold text-[#F2F0E9] tracking-tight flex-1">
                      Good morning, Alex.
                    </h2>
                    <span className="text-[11px] font-mono text-[#607074]">1.5rem / 600</span>
                  </div>

                  <div className="py-4 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#70D6E8] w-36">Section Title (lg)</span>
                    <h3 className="text-lg font-semibold text-[#F2F0E9] tracking-tight flex-1">
                      Recommended Opportunities
                    </h3>
                    <span className="text-[11px] font-mono text-[#607074]">1.125rem / 600</span>
                  </div>

                  <div className="py-4 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#70D6E8] w-36">Body Text (sm)</span>
                    <p className="text-sm text-[#F2F0E9] flex-1 leading-relaxed">
                      Track applications seamlessly with automated match scoring and tailor your resume for early-career software engineering roles.
                    </p>
                    <span className="text-[11px] font-mono text-[#607074]">0.875rem / 400</span>
                  </div>

                  <div className="py-4 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#70D6E8] w-36">Muted Metadata (xs)</span>
                    <p className="text-xs text-[#A0ADB0] flex-1">
                      San Francisco, CA • Hybrid • Posted 2 days ago • 14 applicant records
                    </p>
                    <span className="text-[11px] font-mono text-[#607074]">0.75rem / 400</span>
                  </div>

                  <div className="pt-4 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#70D6E8] w-36">Mono / Numbers</span>
                    <p className="text-xs font-mono font-medium text-[#70D6E8] flex-1">
                      $125,000 – $145,000 USD • 94% MATCH SCORE • 2026-Q1
                    </p>
                    <span className="text-[11px] font-mono text-[#607074]">ui-monospace / 500</span>
                  </div>
                </div>
              </div>

              {/* 4. Geometry & Radii */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Restrained Geometry & Corner Radii
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'sm (6px)', radius: 'rounded-md', desc: 'Badges, small tags' },
                    { label: 'md (8px)', radius: 'rounded-lg', desc: 'Inputs, buttons, dropdowns' },
                    { label: 'lg (12px)', radius: 'rounded-xl', desc: 'Job cards, modals, popovers' },
                    { label: 'full (Pill)', radius: 'rounded-full', desc: 'Status indicators only' },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className={`p-4 bg-[#0E1518] border border-[#273438] ${r.radius} flex flex-col justify-between h-24`}
                    >
                      <span className="text-xs font-semibold text-[#F2F0E9]">{r.label}</span>
                      <span className="text-[11px] text-[#A0ADB0]">{r.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Dividers & Separators */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Subtle Dividers & Separators
                </h3>
                <div className="p-5 rounded-xl border border-[#273438] bg-[#0E1518] space-y-3">
                  <p className="text-xs text-[#A0ADB0]">Minimalist horizontal boundary lines and labeled dividers:</p>
                  <Separator />
                  <Separator label="Alternative Actions" />
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION B: BUTTONS & FORMS
          ══════════════════════════════════════════════════════════════ */}
          {(activeSection === 'buttons' || true) && (
            <section id="buttons" className={activeSection !== 'buttons' ? 'hidden' : 'space-y-8 animate-fade-in'}>
              <div>
                <h2 className="text-lg font-semibold text-[#F2F0E9] tracking-tight flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-[#70D6E8]" />
                  B. Buttons & Form Controls
                </h2>
                <p className="text-xs text-[#A0ADB0] mt-0.5">
                  Consistent variants, sizing, focus rings, disabled, and loading feedback.
                </p>
              </div>

              {/* State Toggles bar */}
              <div className="p-3 rounded-lg bg-[#0E1518] border border-[#273438] flex flex-wrap items-center gap-4 text-xs">
                <span className="font-semibold text-[#A0ADB0] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Test Interactive States:
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={btnLoading}
                    onChange={(e) => setBtnLoading(e.target.checked)}
                    className="rounded bg-[#080D0F] border-[#273438] text-[#70D6E8]"
                  />
                  <span>Loading State</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={btnDisabled}
                    onChange={(e) => setBtnDisabled(e.target.checked)}
                    className="rounded bg-[#080D0F] border-[#273438] text-[#70D6E8]"
                  />
                  <span>Disabled State</span>
                </label>
              </div>

              {/* 1. Button Variants */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Button Variants
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <HireMateButton
                    variant="primary"
                    loading={btnLoading}
                    disabled={btnDisabled}
                    onClick={() => toast({ title: 'Primary clicked', variant: 'info' })}
                  >
                    Primary Button
                  </HireMateButton>

                  <HireMateButton
                    variant="secondary"
                    loading={btnLoading}
                    disabled={btnDisabled}
                    onClick={() => toast({ title: 'Secondary clicked', variant: 'info' })}
                  >
                    Secondary Button
                  </HireMateButton>

                  <HireMateButton
                    variant="accent"
                    loading={btnLoading}
                    disabled={btnDisabled}
                    onClick={() => toast({ title: 'Accent clicked', variant: 'success' })}
                  >
                    Accent Cyan
                  </HireMateButton>

                  <HireMateButton
                    accentStyle="cream"
                    loading={btnLoading}
                    disabled={btnDisabled}
                    onClick={() => toast({ title: 'Warm Cream clicked', variant: 'warning' })}
                  >
                    Warm Cream
                  </HireMateButton>

                  <HireMateButton
                    variant="outline"
                    loading={btnLoading}
                    disabled={btnDisabled}
                    onClick={() => toast({ title: 'Outline clicked', variant: 'info' })}
                  >
                    Outline
                  </HireMateButton>

                  <HireMateButton
                    variant="ghost"
                    loading={btnLoading}
                    disabled={btnDisabled}
                    onClick={() => toast({ title: 'Ghost clicked', variant: 'info' })}
                  >
                    Ghost
                  </HireMateButton>

                  <HireMateButton
                    variant="destructive"
                    loading={btnLoading}
                    disabled={btnDisabled}
                    onClick={() => toast({ title: 'Destructive clicked', variant: 'error' })}
                  >
                    Destructive
                  </HireMateButton>
                </div>
              </div>

              {/* 2. Button Sizes */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Button Sizes
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs" variant="secondary">Size XS</Button>
                  <Button size="sm" variant="secondary">Size SM</Button>
                  <Button size="md" variant="secondary">Size MD (Default)</Button>
                  <Button size="lg" variant="primary">Size LG (Action)</Button>
                  <HireMateIconButton
                    icon={<Sparkles className="w-4 h-4 text-[#70D6E8]" />}
                    aria-label="Icon button"
                  />
                </div>
              </div>

              {/* 3. Form Inputs */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Form Inputs & Selectors
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 rounded-xl border border-[#273438] bg-[#0E1518]">
                  {/* Standard Text Input */}
                  <Input
                    label="Full Name"
                    placeholder="e.g. Alex Vance"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    helperText="As it should appear on your career profile."
                  />

                  {/* Input with Error */}
                  <Input
                    label="Target Email"
                    defaultValue="invalid-email"
                    error={inputError || 'Please provide a valid university or personal email.'}
                    onChange={(e) => {
                      if (e.target.value.includes('@')) setInputError('');
                      else setInputError('Please provide a valid university email.');
                    }}
                  />

                  {/* Search Input with Clear */}
                  <div>
                    <label className="block text-xs font-medium text-[#A0ADB0] mb-1.5">
                      Job & Skill Search
                    </label>
                    <HireMateSearch
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onClear={() => setSearchValue('')}
                      placeholder="Search roles, skills..."
                    />
                  </div>

                  {/* Accessible Select */}
                  <Select
                    label="Primary Engineering Track"
                    value={selectVal}
                    onChange={(e) => setSelectVal(e.target.value)}
                    options={[
                      { value: 'swe', label: 'Software Engineering (Full Stack)' },
                      { value: 'frontend', label: 'Frontend & UI Engineering' },
                      { value: 'backend', label: 'Distributed Systems & Backend' },
                      { value: 'ml', label: 'Machine Learning & AI Engineering' },
                      { value: 'devops', label: 'Cloud Infrastructure & DevOps' },
                    ]}
                    helperText="Personalizes your match percentage algorithm."
                  />

                  {/* Filter Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-[#A0ADB0] mb-1.5">
                      Skill Filter
                    </label>
                    <HireMateFilter
                      label="Select Tech Stack"
                      options={[
                        { id: 'react', label: 'React / Next.js', count: 42 },
                        { id: 'ts', label: 'TypeScript', count: 38 },
                        { id: 'python', label: 'Python / PyTorch', count: 29 },
                        { id: 'go', label: 'Go / Microservices', count: 18 },
                        { id: 'sql', label: 'PostgreSQL / SQL', count: 31 },
                      ]}
                      selectedIds={filterTags}
                      onChange={setFilterTags}
                    />
                  </div>

                  {/* Checkbox and Switch */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs font-medium text-[#A0ADB0]">
                      Toggles & Preferences
                    </label>
                    <Checkbox
                      checked={checkboxVal}
                      onChange={setCheckboxVal}
                      label="Early-career roles only"
                      description="Filters for internships, new grad, and junior roles."
                    />
                    <Switch
                      checked={switchVal}
                      onChange={setSwitchVal}
                      label="Email match notifications"
                      description="Receive digests when role match exceeds 85%."
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION C: NAVIGATION
          ══════════════════════════════════════════════════════════════ */}
          {(activeSection === 'navigation' || true) && (
            <section id="navigation" className={activeSection !== 'navigation' ? 'hidden' : 'space-y-8 animate-fade-in'}>
              <div>
                <h2 className="text-lg font-semibold text-[#F2F0E9] tracking-tight flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#70D6E8]" />
                  C. Navigation Components
                </h2>
                <p className="text-xs text-[#A0ADB0] mt-0.5">
                  Refined dark sidebar, topbar with search, breadcrumb navigation, and mobile drawer.
                </p>
              </div>

              {/* Breadcrumb Demo */}
              <div className="p-4 rounded-xl border border-[#273438] bg-[#0E1518]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074] mb-3">
                  Breadcrumb Hierarchy
                </h3>
                <HireMateBreadcrumb
                  items={[
                    { label: 'HireMate', href: '#' },
                    { label: 'Opportunities', href: '#' },
                    { label: 'Stripe — Software Engineer (New Grad 2026)' },
                  ]}
                  onNavigate={(href) => toast({ title: `Navigated to ${href}`, variant: 'info' })}
                />
              </div>

              {/* Tabs Showcase */}
              <div className="p-4 rounded-xl border border-[#273438] bg-[#0E1518] space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Tab Navigation (Underline & Pill variants)
                </h3>
                <div className="space-y-4">
                  <Tabs
                    tabs={[
                      { id: 'all', label: 'All Jobs', badge: 34 },
                      { id: 'applied', label: 'Active Applications', badge: 3 },
                      { id: 'interviews', label: 'Interviews Scheduled', badge: 1 },
                    ]}
                    activeTab="all"
                    onChange={(tab) => toast({ title: `Switched to ${tab} tab`, variant: 'info' })}
                  />
                  <Tabs
                    variant="pill"
                    tabs={[
                      { id: 'recommended', label: 'Recommended' },
                      { id: 'recent', label: 'Recently Added' },
                      { id: 'saved', label: 'Saved (5)' },
                    ]}
                    activeTab="recommended"
                    onChange={(tab) => toast({ title: `Pill tab switched: ${tab}`, variant: 'info' })}
                  />
                </div>
              </div>

              {/* Topbar Preview */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Topbar Preview (Integrated Search & Account Dropdown)
                </h3>
                <div className="rounded-xl border border-[#273438] overflow-hidden">
                  <HireMateTopbar
                    user={{ name: 'Alex Vance', email: 'alex@stanford.edu' }}
                    breadcrumbItems={[
                      { label: 'HireMate', href: '#' },
                      { label: 'Career Hub' },
                    ]}
                    onOpenMobileNav={() => setMobileNavOpen(true)}
                    onLogout={() => toast({ title: 'Logout initiated', variant: 'warning' })}
                    onSearch={(q) => console.log('Searching:', q)}
                  />
                </div>
              </div>

              {/* Sidebar Preview in Frame */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                    HireMateSidebar (Restrained Active Surface & Slim Accent Indicator)
                  </h3>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setMobileNavOpen(true)}
                  >
                    Open Mobile Drawer Preview
                  </Button>
                </div>

                <div className="rounded-xl border border-[#273438] bg-[#080D0F] p-4 flex justify-center">
                  <div className="h-[480px] rounded-lg overflow-hidden border border-[#273438] shadow-2xl">
                    <HireMateSidebar
                      activePath="/dashboard"
                      onNavigate={(path) => toast({ title: `Navigating to ${path}`, variant: 'info' })}
                      onLogout={() => toast({ title: 'Sign out clicked', variant: 'warning' })}
                      user={{ name: 'Alex Vance', email: 'alex@stanford.edu' }}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Drawer */}
              <HireMateMobileNav
                open={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
                activePath="/dashboard"
                onNavigate={(p) => {
                  toast({ title: `Mobile navigated to ${p}`, variant: 'info' });
                  setMobileNavOpen(false);
                }}
                onLogout={() => {
                  toast({ title: 'Logged out from mobile menu', variant: 'warning' });
                  setMobileNavOpen(false);
                }}
              />
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION D: CAREER COMPONENTS
          ══════════════════════════════════════════════════════════════ */}
          {(activeSection === 'career' || true) && (
            <section id="career" className={activeSection !== 'career' ? 'hidden' : 'space-y-8 animate-fade-in'}>
              <HireMatePageHeader
                title="Career Product Components"
                description="High-signal, scannable job cards, company profiles, match scoring, and status tags tailored for software engineers."
                badge={
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#70D6E8]/10 text-[#70D6E8] border border-[#70D6E8]/20 font-medium">
                    Early Career Core
                  </span>
                }
              />

              {/* 1. Skill Tags & Match Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-[#273438] bg-[#0E1518] space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                    Skill Tags (Default, Matched, Missing)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <HireMateSkillTag label="TypeScript" variant="matched" />
                    <HireMateSkillTag label="React 19" variant="matched" />
                    <HireMateSkillTag label="Node.js" variant="default" />
                    <HireMateSkillTag label="PostgreSQL" variant="default" />
                    <HireMateSkillTag label="GraphQL (Optional)" variant="missing" />
                    <HireMateSkillTag label="Kubernetes" variant="missing" />
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-[#273438] bg-[#0E1518] space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                    Match Score Variants
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <HireMateMatchScore score={95} variant="compact" />
                    <HireMateMatchScore score={78} variant="compact" />
                    <HireMateMatchScore score={54} variant="compact" />
                    <HireMateMatchScore score={88} variant="expanded" />
                  </div>
                </div>
              </div>

              {/* 2. Application Status Badges */}
              <div className="p-5 rounded-xl border border-[#273438] bg-[#0E1518] space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Application Status Pipeline
                </h3>
                <div className="flex flex-wrap gap-3">
                  <HireMateApplicationStatus status="saved" date="Oct 2" />
                  <HireMateApplicationStatus status="applied" date="Oct 4" />
                  <HireMateApplicationStatus status="assessment" date="Oct 7" />
                  <HireMateApplicationStatus status="interview" date="Oct 12" />
                  <HireMateApplicationStatus status="offer" date="Oct 18" />
                  <HireMateApplicationStatus status="rejected" date="Oct 1" />
                </div>
              </div>

              {/* 3. Job Cards Grid */}
              <HireMateSection
                title="HireMateJobCard"
                subtitle="Compact, structured, and scannable role listings"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <HireMateJobCard
                    job={{
                      id: 'job-1',
                      title: 'Software Engineer, Core Infrastructure',
                      company: 'Stripe',
                      location: 'San Francisco, CA',
                      workMode: 'Hybrid',
                      employmentType: 'Full-time (New Grad)',
                      salary: '$135,000 – $155,000',
                      skills: ['Go', 'Distributed Systems', 'PostgreSQL', 'AWS'],
                      matchScore: 94,
                      isSaved: true,
                    }}
                    onView={(jobId) => toast({ title: `Viewing job details: ${jobId}`, variant: 'info' })}
                    onToggleSave={(_id, saved) =>
                      toast({
                        title: saved ? 'Job saved' : 'Job removed from saved',
                        variant: 'info',
                      })
                    }
                  />

                  <HireMateJobCard
                    job={{
                      id: 'job-2',
                      title: 'Frontend Engineer, Design Systems',
                      company: 'Vercel',
                      location: 'San Francisco / Remote',
                      workMode: 'Remote',
                      employmentType: 'Full-time',
                      salary: '$120,000 – $140,000',
                      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
                      matchScore: 89,
                      isSaved: false,
                    }}
                    onView={(jobId) => toast({ title: `Viewing job details: ${jobId}`, variant: 'info' })}
                    onToggleSave={(_id, saved) =>
                      toast({
                        title: saved ? 'Job saved' : 'Job removed from saved',
                        variant: 'info',
                      })
                    }
                  />

                  <HireMateJobCard
                    job={{
                      id: 'job-3',
                      title: 'Applied AI & Systems Intern',
                      company: 'Anthropic',
                      location: 'San Francisco, CA',
                      workMode: 'On-site',
                      employmentType: 'Internship (Summer 2026)',
                      salary: '$55 – $65 / hour',
                      skills: ['Python', 'PyTorch', 'C++', 'LLM Evaluation'],
                      matchScore: 76,
                      isSaved: false,
                    }}
                    onView={(jobId) => toast({ title: `Viewing job details: ${jobId}`, variant: 'info' })}
                    onToggleSave={(_id, saved) =>
                      toast({
                        title: saved ? 'Job saved' : 'Job removed from saved',
                        variant: 'info',
                      })
                    }
                  />
                </div>
              </HireMateSection>

              {/* 4. Company Profile & Opportunities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                    HireMateCompanyCard
                  </h3>
                  <HireMateCompanyCard
                    company={{
                      id: 'comp-1',
                      name: 'Linear',
                      industry: 'Developer Tools & Productivity',
                      location: 'San Francisco / Remote',
                      openRolesCount: 8,
                      description:
                        'Linear is an issue tracker built for high-performance software engineering teams. Focused on speed, craftsmanship, and keyboard efficiency.',
                    }}
                    onView={(id) => toast({ title: `Viewing company ${id}`, variant: 'info' })}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                    HireMateOpportunityCard (Hackathons & Fellowships)
                  </h3>
                  <HireMateOpportunityCard
                    opportunity={{
                      id: 'opp-1',
                      title: 'AGI Systems Hackathon 2026',
                      organizer: 'Open Source AI Collective',
                      type: 'Hackathon',
                      deadline: 'Oct 28, 2026',
                      prizePool: '$75,000',
                      format: 'Remote',
                      tags: ['AI Agents', 'Open Source', 'Early Career Track'],
                    }}
                    onApply={(id) => toast({ title: `Viewing opportunity ${id}`, variant: 'info' })}
                  />
                </div>
              </div>

              {/* 5. Resume Card & Profile Completion */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                    HireMateResumeCard
                  </h3>
                  <HireMateResumeCard
                    fileName="Alex_Vance_Software_Engineer_Resume.pdf"
                    lastUpdated="Yesterday at 4:30 PM"
                    completeness="92% ATS score"
                    onView={() => toast({ title: 'Opening PDF viewer', variant: 'info' })}
                    onReplace={() => toast({ title: 'Opening upload file dialog', variant: 'info' })}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                    HireMateProfileCompletion
                  </h3>
                  <HireMateProfileCompletion
                    percentage={75}
                    title="Finish adding your core skills"
                    description="Adding 3 more project experiences unlocks automated matching for Stripe and Linear."
                    ctaText="Add skills"
                    onAction={() => toast({ title: 'Navigating to Profile Editor', variant: 'info' })}
                  />
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION E: FEEDBACK & STATES
          ══════════════════════════════════════════════════════════════ */}
          {(activeSection === 'feedback' || true) && (
            <section id="feedback" className={activeSection !== 'feedback' ? 'hidden' : 'space-y-8 animate-fade-in'}>
              <div>
                <h2 className="text-lg font-semibold text-[#F2F0E9] tracking-tight flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-[#70D6E8]" />
                  E. Feedback, Overlays & States
                </h2>
                <p className="text-xs text-[#A0ADB0] mt-0.5">
                  Dialogs, drawers, dropdown menus, toasts, skeletons, and empty states.
                </p>
              </div>

              {/* Interactive Modal & Drawer Triggers */}
              <div className="p-6 rounded-xl border border-[#273438] bg-[#0E1518] space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Interactive Overlays
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                    Open Accessible Dialog
                  </Button>

                  <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                    Open Side Drawer
                  </Button>

                  <DropdownMenu
                    trigger={
                      <Button variant="outline">
                        Dropdown Menu Trigger ▼
                      </Button>
                    }
                    items={[
                      { id: '1', label: 'Export Application Data' },
                      { id: '2', label: 'View Match Breakdown' },
                      { id: '3', label: 'Archive Application', variant: 'destructive' },
                    ]}
                  />

                  <Tooltip content="Tooltip showing contextual help on hover">
                    <Button variant="ghost">Hover for Tooltip</Button>
                  </Tooltip>
                </div>
              </div>

              {/* Toast Variants */}
              <div className="p-6 rounded-xl border border-[#273438] bg-[#0E1518] space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Interactive Toast Triggers
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      toast({
                        title: 'Application Submitted',
                        description: 'Your application to Stripe has been recorded in your dashboard.',
                        variant: 'info',
                      })
                    }
                  >
                    Info Toast
                  </Button>

                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() =>
                      toast({
                        title: 'Profile Updated',
                        description: 'Skills updated successfully. 4 new matching jobs found.',
                        variant: 'success',
                      })
                    }
                  >
                    Success Toast
                  </Button>

                  <HireMateButton
                    size="sm"
                    accentStyle="cream"
                    onClick={() =>
                      toast({
                        title: 'Deadline Approaching',
                        description: 'Vercel internship applications close in 48 hours.',
                        variant: 'warning',
                      })
                    }
                  >
                    Warning Toast
                  </HireMateButton>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      toast({
                        title: 'Upload Failed',
                        description: 'Resume file size exceeds 5MB limit. Please upload a smaller PDF.',
                        variant: 'error',
                      })
                    }
                  >
                    Error Toast
                  </Button>
                </div>
              </div>

              {/* Empty State */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  HireMateEmptyState (Calm, structured, action-oriented)
                </h3>
                <HireMateEmptyState
                  title="No active applications yet"
                  description="When you apply to jobs through HireMate or import records from external job boards, they will be tracked here."
                  actionLabel="Discover matching jobs"
                  onAction={() => toast({ title: 'Navigating to jobs feed', variant: 'info' })}
                />
              </div>

              {/* Skeletons & Loading States */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                  Skeleton Loading States
                </h3>
                <div className="p-6 rounded-xl border border-[#273438] bg-[#0E1518] space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="space-y-2 flex-1">
                      <Skeleton variant="text" width="30%" />
                      <Skeleton variant="text" width="50%" />
                    </div>
                  </div>
                  <Skeleton variant="rectangular" height={60} />
                </div>
              </div>

              {/* Dialog Component Instance */}
              <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title="Confirm Application Submission"
                description="Your HireMate profile and resume will be sent directly to the recruiting team."
                footer={
                  <>
                    <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setDialogOpen(false);
                        toast({ title: 'Application submitted successfully', variant: 'success' });
                      }}
                    >
                      Submit Application
                    </Button>
                  </>
                }
              >
                <div className="space-y-3 text-xs text-[#A0ADB0]">
                  <p>
                    Position: <span className="text-[#F2F0E9] font-medium">Software Engineer (Core Systems)</span>
                  </p>
                  <p>
                    Company: <span className="text-[#F2F0E9] font-medium">Stripe</span>
                  </p>
                  <p>
                    Resume attached: <span className="text-[#70D6E8] font-mono">Alex_Vance_Resume.pdf</span>
                  </p>
                </div>
              </Dialog>

              {/* Drawer Component Instance */}
              <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Job Match Insights"
                description="Detailed skill overlap for Stripe — Software Engineer"
                footer={
                  <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                    Close Drawer
                  </Button>
                }
              >
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-[#141D20] border border-[#273438]">
                    <span className="text-[11px] text-[#A0ADB0] block uppercase font-mono">Role Overlap</span>
                    <span className="text-xl font-mono font-semibold text-[#70D6E8]">94%</span>
                  </div>
                  <p className="text-xs text-[#A0ADB0] leading-relaxed">
                    Your profile matches 4 out of 4 required core competencies: Go, Distributed Systems, SQL, and AWS.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <HireMateSkillTag label="Go" variant="matched" />
                    <HireMateSkillTag label="Distributed Systems" variant="matched" />
                    <HireMateSkillTag label="PostgreSQL" variant="matched" />
                    <HireMateSkillTag label="AWS" variant="matched" />
                  </div>
                </div>
              </Drawer>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION F: MOTION SYSTEM
          ══════════════════════════════════════════════════════════════ */}
          {(activeSection === 'motion' || true) && (
            <section id="motion" className={activeSection !== 'motion' ? 'hidden' : 'space-y-8 animate-fade-in'}>
              <div>
                <h2 className="text-lg font-semibold text-[#F2F0E9] tracking-tight flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#70D6E8]" />
                  F. Restrained Motion System
                </h2>
                <p className="text-xs text-[#A0ADB0] mt-0.5">
                  150–250ms microinteractions, smooth entrances, hover lifts, and zero distracting animations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. HoverLift Feedback */}
                <div className="p-6 rounded-xl border border-[#273438] bg-[#0E1518] space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                    HoverLift Interaction
                  </h3>
                  <p className="text-xs text-[#A0ADB0]">
                    Subtle -2px elevation with smooth shadow transition on interactive job cards.
                  </p>
                  <HoverLift>
                    <div className="p-4 rounded-xl border border-[#273438] bg-[#141D20] text-xs">
                      <p className="font-semibold text-[#F2F0E9]">Hover over this card</p>
                      <p className="text-[#A0ADB0] mt-1">Calm 200ms ease-out elevation feedback.</p>
                    </div>
                  </HoverLift>
                </div>

                {/* 2. Staggered Item Entrance */}
                <div className="p-6 rounded-xl border border-[#273438] bg-[#0E1518] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                      Staggered Reveal (Replayable)
                    </h3>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => setStaggerKey((k) => k + 1)}
                      leftIcon={<RotateCcw className="w-3 h-3" />}
                    >
                      Replay
                    </Button>
                  </div>

                  <Stagger key={staggerKey} interval={60} className="space-y-2">
                    {[
                      '1. Fetching applicant matches...',
                      '2. Calculating semantic skill embeddings...',
                      '3. 4 high-match opportunities ready.',
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-[#273438] bg-[#141D20] text-xs text-[#F2F0E9] font-mono"
                      >
                        {step}
                      </div>
                    ))}
                  </Stagger>
                </div>

                {/* 3. Reveal & ScaleIn Primitives */}
                <div className="p-6 rounded-xl border border-[#273438] bg-[#0E1518] space-y-4 md:col-span-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607074]">
                    Reveal & ScaleIn Primitives
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Reveal delay={100}>
                      <div className="p-3 rounded-lg border border-[#273438] bg-[#141D20] text-xs">
                        <span className="text-[11px] font-mono text-[#70D6E8] block mb-1">Reveal (100ms delay)</span>
                        <p className="text-[#F2F0E9]">Soft vertical slide-up entrance for editorial content.</p>
                      </div>
                    </Reveal>
                    <ScaleIn>
                      <div className="p-3 rounded-lg border border-[#273438] bg-[#141D20] text-xs">
                        <span className="text-[11px] font-mono text-[#E9D8B4] block mb-1">ScaleIn (Pop-in)</span>
                        <p className="text-[#F2F0E9]">150ms subtle pop-in for modal badges and notifications.</p>
                      </div>
                    </ScaleIn>
                  </div>
                </div>
              </div>

              {/* Reduced Motion Support Note */}
              <div className="p-4 rounded-xl border border-[#273438] bg-[#0E1518] flex items-start gap-3">
                <span className="p-1 rounded bg-[#70D6E8]/10 text-[#70D6E8]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-[#F2F0E9]">Reduced Motion Compliance</p>
                  <p className="text-[#A0ADB0] mt-0.5 leading-relaxed">
                    All animations globally respect the user's OS preference via <code className="text-[#70D6E8] bg-[#141D20] px-1 py-0.5 rounded">prefers-reduced-motion: reduce</code>, disabling transforms and shortening transition durations to 0.01ms.
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </PageTransition>
  );
}

export default DesignSystemPlayground;
