import React, { useState } from 'react';
import {
  Bookmark,
  MapPin,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
  Users,
} from 'lucide-react';

/* ─── 1. Skill Tag ────────────────────────────────────────── */

export interface HireMateSkillTagProps {
  label: string;
  variant?: 'default' | 'matched' | 'missing';
  size?: 'sm' | 'md';
}

export function HireMateSkillTag({
  label,
  variant = 'default',
  size = 'md',
}: HireMateSkillTagProps) {
  const variantStyles = {
    default: 'bg-[#141D20] text-[#A0ADB0] border-[#273438]',
    matched: 'bg-[#70D6E8]/10 text-[#70D6E8] border-[#70D6E8]/25',
    missing: 'bg-[#273438]/50 text-[#607074] border-dashed border-[#273438]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-[11px] px-2 py-0.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border transition-colors ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {label}
    </span>
  );
}

/* ─── 2. Match Score ───────────────────────────────────────── */

export interface HireMateMatchScoreProps {
  score?: number | null;
  variant?: 'compact' | 'expanded';
  showLabel?: boolean;
}

export function HireMateMatchScore({
  score,
  variant = 'compact',
  showLabel = true,
}: HireMateMatchScoreProps) {
  if (score === null || score === undefined) {
    return null;
  }

  // Restrained semantic status styling based on score thresholds
  const getBadgeStyle = () => {
    if (score >= 80) return 'text-[#70D6E8] bg-[#70D6E8]/10 border-[#70D6E8]/25';
    if (score >= 60) return 'text-[#77B7A5] bg-[#77B7A5]/10 border-[#77B7A5]/25';
    return 'text-[#E9D8B4] bg-[#E9D8B4]/10 border-[#E9D8B4]/25';
  };

  if (variant === 'expanded') {
    return (
      <div className="flex items-center gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono font-medium text-xs ${getBadgeStyle()}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{score}%</span>
        </div>
        {showLabel && (
          <span className="text-xs text-[#A0ADB0]">
            {score >= 80 ? 'Strong match' : score >= 60 ? 'Good match' : 'Moderate match'}
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded border ${getBadgeStyle()}`}
      title={`${score}% role match based on profile & skills`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {score}% {showLabel && 'match'}
    </span>
  );
}

/* ─── 3. Application Status ────────────────────────────────── */

export type ApplicationStatusType =
  | 'saved'
  | 'applied'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface HireMateApplicationStatusProps {
  status: ApplicationStatusType;
  date?: string;
  className?: string;
}

export function HireMateApplicationStatus({
  status,
  date,
  className = '',
}: HireMateApplicationStatusProps) {
  const statusConfig: Record<
    ApplicationStatusType,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    saved: {
      label: 'Saved',
      bg: 'bg-[#141D20]',
      text: 'text-[#A0ADB0]',
      border: 'border-[#273438]',
      icon: <Bookmark className="w-3 h-3" />,
    },
    applied: {
      label: 'Applied',
      bg: 'bg-[#141D20]',
      text: 'text-[#F2F0E9]',
      border: 'border-[#3A4C52]',
      icon: <Clock className="w-3 h-3" />,
    },
    assessment: {
      label: 'Assessment',
      bg: 'bg-[#70D6E8]/10',
      text: 'text-[#70D6E8]',
      border: 'border-[#70D6E8]/30',
      icon: <FileText className="w-3 h-3" />,
    },
    interview: {
      label: 'Interview',
      bg: 'bg-[#E9D8B4]/10',
      text: 'text-[#E9D8B4]',
      border: 'border-[#E9D8B4]/30',
      icon: <Calendar className="w-3 h-3" />,
    },
    offer: {
      label: 'Offer',
      bg: 'bg-[#4ADE80]/10',
      text: 'text-[#4ADE80]',
      border: 'border-[#4ADE80]/30',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    rejected: {
      label: 'Declined',
      bg: 'bg-[#2A1616]',
      text: 'text-[#F87171]',
      border: 'border-[#4D2222]',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-current" />,
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
      {date && <span className="text-[11px] text-[#607074]">{date}</span>}
    </div>
  );
}

/* ─── 4. Job Card ──────────────────────────────────────────── */

export interface JobData {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workMode?: 'Remote' | 'Hybrid' | 'On-site';
  employmentType?: string;
  salary?: string;
  skills?: string[];
  matchScore?: number | null;
  postedDate?: string;
  isSaved?: boolean;
}

export interface HireMateJobCardProps {
  job: JobData;
  onView?: (id: string) => void;
  onToggleSave?: (id: string, saved: boolean) => void;
  className?: string;
}

export function HireMateJobCard({
  job,
  onView,
  onToggleSave,
  className = '',
}: HireMateJobCardProps) {
  const [saved, setSaved] = useState(job.isSaved || false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    onToggleSave?.(job.id, next);
  };

  return (
    <article
      onClick={() => onView?.(job.id)}
      className={`group rounded-xl border border-[#273438] bg-[#0E1518] p-5 transition-all duration-200 hover:border-[#3A4C52] hover:bg-[#141D20]/80 cursor-pointer ${className}`}
    >
      {/* Top Header: Logo, Company & Role, Bookmark */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-10 h-10 rounded-lg border border-[#273438] object-cover shrink-0 bg-[#141D20]"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg border border-[#273438] bg-[#141D20] flex items-center justify-center text-[#A0ADB0] font-semibold text-xs shrink-0">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#F2F0E9] group-hover:text-white transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-xs text-[#A0ADB0] font-medium mt-0.5 truncate">
              {job.company}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          aria-label={saved ? 'Remove saved job' : 'Save job'}
          className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
            saved
              ? 'bg-[#E9D8B4]/10 text-[#E9D8B4] border-[#E9D8B4]/30'
              : 'bg-[#141D20] text-[#607074] hover:text-[#F2F0E9] border-[#273438]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#A0ADB0] mb-3.5">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#607074]" />
          {job.location}
        </span>
        {job.workMode && (
          <>
            <span className="text-[#273438]">•</span>
            <span>{job.workMode}</span>
          </>
        )}
        {job.employmentType && (
          <>
            <span className="text-[#273438]">•</span>
            <span>{job.employmentType}</span>
          </>
        )}
        {job.matchScore !== undefined && (
          <>
            <span className="text-[#273438]">•</span>
            <HireMateMatchScore score={job.matchScore} />
          </>
        )}
      </div>

      {/* Skills Row */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.map((skill) => (
            <HireMateSkillTag key={skill} label={skill} />
          ))}
        </div>
      )}

      {/* Footer: Salary & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-[#273438]/70 text-xs">
        <span className="font-mono text-[#F2F0E9] font-medium">
          {job.salary || 'Competitive'}
        </span>
        <span className="text-xs font-medium text-[#70D6E8] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          View details
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
}

/* ─── 5. Company Card ──────────────────────────────────────── */

export interface CompanyData {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  openRolesCount?: number;
  description?: string;
}

export interface HireMateCompanyCardProps {
  company: CompanyData;
  onView?: (id: string) => void;
  className?: string;
}

export function HireMateCompanyCard({
  company,
  onView,
  className = '',
}: HireMateCompanyCardProps) {
  return (
    <article
      onClick={() => onView?.(company.id)}
      className={`rounded-xl border border-[#273438] bg-[#0E1518] p-5 transition-all duration-200 hover:border-[#3A4C52] hover:bg-[#141D20]/80 cursor-pointer ${className}`}
    >
      <div className="flex items-start gap-3.5 mb-3">
        {company.logo ? (
          <img
            src={company.logo}
            alt={company.name}
            className="w-11 h-11 rounded-lg border border-[#273438] object-cover bg-[#141D20] shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-lg border border-[#273438] bg-[#141D20] flex items-center justify-center text-[#A0ADB0] font-semibold text-xs shrink-0">
            <Building2 className="w-5 h-5 text-[#607074]" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#F2F0E9] truncate">{company.name}</h3>
          <p className="text-xs text-[#A0ADB0] mt-0.5">{company.industry}</p>
          <p className="text-[11px] text-[#607074] mt-0.5">{company.location}</p>
        </div>
      </div>

      {company.description && (
        <p className="text-xs text-[#A0ADB0] line-clamp-2 mb-4 leading-relaxed">
          {company.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[#273438]/70 text-xs">
        <span className="text-[#A0ADB0]">
          {company.openRolesCount !== undefined ? (
            <span className="font-mono text-[#70D6E8]">{company.openRolesCount} open roles</span>
          ) : (
            'Actively hiring'
          )}
        </span>
        <span className="text-[#A0ADB0] hover:text-[#F2F0E9] flex items-center gap-1 font-medium">
          Explore
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
}

/* ─── 6. Resume Card ───────────────────────────────────────── */

export interface HireMateResumeCardProps {
  fileName: string;
  lastUpdated: string;
  completeness: string | number;
  onView?: () => void;
  onReplace?: () => void;
  className?: string;
}

export function HireMateResumeCard({
  fileName,
  lastUpdated,
  completeness,
  onView,
  onReplace,
  className = '',
}: HireMateResumeCardProps) {
  return (
    <div
      className={`rounded-xl border border-[#273438] bg-[#0E1518] p-5 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#141D20] border border-[#273438] flex items-center justify-center text-[#70D6E8] shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-semibold text-[#F2F0E9] truncate">{fileName}</h4>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#607074]">
            <span>Updated {lastUpdated}</span>
            <span>•</span>
            <span className="text-[#E9D8B4] font-medium">{completeness}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#273438]/70 flex items-center justify-between text-xs">
        {onReplace && (
          <button
            type="button"
            onClick={onReplace}
            className="text-[11px] text-[#607074] hover:text-[#A0ADB0] transition-colors"
          >
            Update file
          </button>
        )}
        <button
          type="button"
          onClick={onView}
          className="text-xs font-medium text-[#70D6E8] hover:underline flex items-center gap-1 ml-auto"
        >
          View resume
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── 7. Profile Completion ────────────────────────────────── */

export interface HireMateProfileCompletionProps {
  percentage: number;
  title?: string;
  description?: string;
  ctaText?: string;
  onAction?: () => void;
  className?: string;
}

export function HireMateProfileCompletion({
  percentage,
  title = 'Complete your career profile',
  description = 'Add preferred roles and key skills to boost matching accuracy by 3x.',
  ctaText = 'Complete profile',
  onAction,
  className = '',
}: HireMateProfileCompletionProps) {
  return (
    <div
      className={`rounded-xl border border-[#273438] bg-[#0E1518] p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E9D8B4] bg-[#E9D8B4]/10 border border-[#E9D8B4]/20 px-2 py-0.5 rounded">
          Profile Progress
        </span>
        <span className="text-xs font-mono font-medium text-[#F2F0E9]">{percentage}%</span>
      </div>

      <h3 className="text-base font-semibold text-[#F2F0E9] mb-1">{title}</h3>
      <p className="text-xs text-[#A0ADB0] mb-4 leading-relaxed">{description}</p>

      {/* Progress Track */}
      <div className="w-full bg-[#141D20] rounded-full h-1.5 overflow-hidden border border-[#273438] mb-4">
        <div
          className="h-full bg-gradient-to-r from-[#77B7A5] to-[#70D6E8] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#080D0F] bg-[#F2F0E9] hover:bg-white px-3.5 py-1.5 rounded-lg transition-colors"
        >
          <span>{ctaText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* ─── 8. Opportunity Card (Hackathons / Fellowships) ────────── */

export interface OpportunityData {
  id: string;
  title: string;
  organizer: string;
  type: 'Hackathon' | 'Fellowship' | 'Grant' | 'Incubator';
  deadline: string;
  prizePool?: string;
  format?: 'Remote' | 'In-person' | 'Hybrid';
  tags?: string[];
}

export interface HireMateOpportunityCardProps {
  opportunity: OpportunityData;
  onApply?: (id: string) => void;
  className?: string;
}

export function HireMateOpportunityCard({
  opportunity,
  onApply,
  className = '',
}: HireMateOpportunityCardProps) {
  return (
    <article
      className={`rounded-xl border border-[#273438] bg-[#0E1518] p-5 transition-all duration-200 hover:border-[#3A4C52] hover:bg-[#141D20]/80 ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#70D6E8] bg-[#70D6E8]/10 border border-[#70D6E8]/20 px-2 py-0.5 rounded">
            {opportunity.type}
          </span>
          <h3 className="text-sm font-semibold text-[#F2F0E9] mt-2">{opportunity.title}</h3>
          <p className="text-xs text-[#A0ADB0] mt-0.5">{opportunity.organizer}</p>
        </div>

        {opportunity.prizePool && (
          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#607074] uppercase block">Prize Pool</span>
            <span className="text-xs font-mono font-semibold text-[#E9D8B4]">
              {opportunity.prizePool}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-[#A0ADB0] mb-3.5">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#607074]" />
          Deadline: {opportunity.deadline}
        </span>
        {opportunity.format && (
          <>
            <span className="text-[#273438]">•</span>
            <span>{opportunity.format}</span>
          </>
        )}
      </div>

      {opportunity.tags && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {opportunity.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium text-[#A0ADB0] bg-[#141D20] border border-[#273438] px-2 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-[#273438]/70 flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#607074] flex items-center gap-1">
          <Users className="w-3 h-3" />
          Early-career eligible
        </span>
        <button
          type="button"
          onClick={() => onApply?.(opportunity.id)}
          className="text-xs font-medium text-[#70D6E8] hover:underline flex items-center gap-1"
        >
          View details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
