import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  X,
  Plus,
  Trash2,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { api, type CareerProfile, type ResumeMeta, type EducationData, type ProjectData } from '../lib/api';
import { Logo } from '../components/Logo';

// Quick suggestions for target roles
const ROLE_SUGGESTIONS = [
  'Software Development Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineering Intern',
  'Graduate Engineer Trainee',
  'DevOps Engineer',
  'Machine Learning Engineer',
];

// Quick suggestions for locations
const LOCATION_SUGGESTIONS = [
  'Remote',
  'Bengaluru',
  'Delhi NCR',
  'Hyderabad',
  'Mumbai',
  'Pune',
  'San Francisco, CA',
  'New York, NY',
];

// Quick suggestions for skills
const SKILL_SUGGESTIONS = [
  'TypeScript',
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'SQL',
  'PostgreSQL',
  'Git',
  'Docker',
  'Tailwind CSS',
  'Next.js',
  'REST APIs',
  'Data Structures',
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Current Step: 1 (Goals), 2 (Background), 3 (Resume), 4 (Review)
  const stepParam = parseInt(searchParams.get('step') || '1', 10);
  const currentStep = Math.min(Math.max(isNaN(stepParam) ? 1 : stepParam, 1), 4);

  const setStep = (step: number) => {
    setSearchParams({ step: step.toString() });
  };

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState('');
  const [opportunityType, setOpportunityType] = useState<'internship' | 'full-time' | 'both'>('both');
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState('');
  const [workArrangement, setWorkArrangement] = useState<'on-site' | 'hybrid' | 'remote' | 'flexible'>('hybrid');

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [education, setEducation] = useState<EducationData>({
    degree: '',
    institution: '',
    fieldOfStudy: '',
    gradYear: '',
  });
  const [experienceLevel, setExperienceLevel] = useState<string>('student');
  const [projects, setProjects] = useState<ProjectData[]>([]);

  // Project form modal/inline state
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState<ProjectData>({
    title: '',
    organization: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  // Resume State
  const [resumeMeta, setResumeMeta] = useState<ResumeMeta | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing profile & resume on mount
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setSaveError(null);
    try {
      const { data, error } = await api.profile.get();
      if (error) {
        setSaveError(error);
      } else if (data) {
        if (data.profile) {
          const p = data.profile;
          if (Array.isArray(p.targetRoles)) setTargetRoles(p.targetRoles);
          if (p.opportunityType) setOpportunityType(p.opportunityType);
          if (Array.isArray(p.preferredLocations)) setPreferredLocations(p.preferredLocations);
          if (p.workArrangement) setWorkArrangement(p.workArrangement);
          if (Array.isArray(p.skills)) setSkills(p.skills);
          if (p.education) setEducation(p.education);
          if (p.experienceLevel) setExperienceLevel(p.experienceLevel);
          if (Array.isArray(p.projects)) setProjects(p.projects);
        }
        if (data.resume) {
          setResumeMeta(data.resume);
        }
      }
    } catch {
      setSaveError('Unable to load saved profile. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Persist current state to backend
  const saveProgress = async (stepToSave: number, isFinishing = false): Promise<boolean> => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload: Partial<CareerProfile> = {
        targetRoles,
        opportunityType,
        preferredLocations,
        workArrangement,
        skills,
        education,
        experienceLevel: experienceLevel as any,
        projects,
        onboardingStep: Math.max(currentStep, stepToSave),
        onboardingCompleted: isFinishing,
      };

      const { data, error } = await api.profile.save(payload);
      if (error) {
        setSaveError(error);
        setSaving(false);
        return false;
      }
      if (data?.profile) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
      setSaving(false);
      return true;
    } catch {
      setSaveError('Failed to save progress. Please try again.');
      setSaving(false);
      return false;
    }
  };

  // Step 1: Role helper
  const addRole = (roleToAdd: string) => {
    const trimmed = roleToAdd.trim();
    if (!trimmed) return;
    if (targetRoles.some((r) => r.toLowerCase() === trimmed.toLowerCase())) return;
    setTargetRoles([...targetRoles, trimmed]);
    setRoleInput('');
  };

  const removeRole = (index: number) => {
    setTargetRoles(targetRoles.filter((_, i) => i !== index));
  };

  // Step 1: Location helper
  const addLocation = (locToAdd: string) => {
    const trimmed = locToAdd.trim();
    if (!trimmed) return;
    if (preferredLocations.some((l) => l.toLowerCase() === trimmed.toLowerCase())) return;
    setPreferredLocations([...preferredLocations, trimmed]);
    setLocationInput('');
  };

  const removeLocation = (index: number) => {
    setPreferredLocations(preferredLocations.filter((_, i) => i !== index));
  };

  // Step 2: Skill helper
  const addSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    setSkills([...skills, trimmed]);
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Step 2: Project helper
  const handleSaveProject = () => {
    if (!newProject.title.trim()) return;
    setProjects([...projects, newProject]);
    setNewProject({ title: '', organization: '', description: '', startDate: '', endDate: '' });
    setShowAddProject(false);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Step 3: Resume upload handler
  const handleFileUpload = async (file: File) => {
    setResumeError(null);

    // Validate size (5MB max)
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setResumeError('File size exceeds 5MB limit. Please upload a smaller PDF or DOCX file.');
      return;
    }

    // Validate extension
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx') {
      setResumeError('Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    setUploadingResume(true);
    try {
      const { data, error } = await api.profile.uploadResume(file);
      if (error) {
        setResumeError(error);
      } else if (data?.resume) {
        setResumeMeta(data.resume);
      }
    } catch {
      setResumeError('Failed to upload file. Please check your connection and retry.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove your uploaded resume?')) return;
    setUploadingResume(true);
    setResumeError(null);
    try {
      const { error } = await api.profile.deleteResume();
      if (error) {
        setResumeError(error);
      } else {
        setResumeMeta(null);
      }
    } catch {
      setResumeError('Failed to remove resume.');
    } finally {
      setUploadingResume(false);
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    const success = await saveProgress(currentStep + 1);
    if (success && currentStep < 4) {
      setStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinish = async () => {
    const success = await saveProgress(4, true);
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  // Step items
  const steps = [
    { number: 1, title: 'Career Goals', icon: Briefcase },
    { number: 2, title: 'Background', icon: GraduationCap },
    { number: 3, title: 'Resume', icon: FileText },
    { number: 4, title: 'Review', icon: CheckCircle2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D0E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#70D6E8] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#A0ADB0] font-mono">Loading your career profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D0E] text-[#F2F0E9] flex flex-col">
      {/* ─── Top Bar ─────────────────────────────────────────── */}
      <header className="border-b border-[#273438] bg-[#0E1518]/90 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="focus:outline-none focus:ring-1 focus:ring-[#70D6E8] rounded">
            <Logo size="sm" />
          </Link>
          <span className="text-xs text-[#607074]">/</span>
          <span className="text-xs font-medium text-[#A0ADB0]">Career Onboarding</span>
        </div>

        <div className="flex items-center gap-4">
          {saveSuccess && (
            <span className="text-xs text-[#70D6E8] flex items-center gap-1.5 transition-opacity duration-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}
          {saving && (
            <span className="text-xs text-[#A0ADB0] flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-[#70D6E8] border-t-transparent rounded-full animate-spin" />
              <span>Saving…</span>
            </span>
          )}
          <Link
            to="/dashboard"
            className="text-xs text-[#A0ADB0] hover:text-[#F2F0E9] transition-colors px-3 py-1.5 rounded-lg border border-[#273438] hover:border-[#3A4C52] bg-[#141D20]"
          >
            Save & Exit
          </Link>
        </div>
      </header>

      {/* ─── Main Content Container ─────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Progress Tracker */}
        <nav aria-label="Onboarding Progress" className="mb-10 sm:mb-12">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = s.number === currentStep;
              const isPast = s.number < currentStep;

              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => setStep(s.number)}
                  className={`flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 rounded-xl border text-left transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#70D6E8] ${
                    isActive
                      ? 'bg-[#141D20] border-[#70D6E8]/60 text-[#F2F0E9] shadow-sm shadow-[#70D6E8]/5'
                      : isPast
                      ? 'bg-[#0E1518] border-[#273438] text-[#70D6E8] hover:border-[#3A4C52]'
                      : 'bg-[#0E1518]/50 border-[#273438]/50 text-[#607074]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#70D6E8]/15 text-[#70D6E8] border border-[#70D6E8]/30'
                        : isPast
                        ? 'bg-[#70D6E8]/10 text-[#70D6E8]'
                        : 'bg-[#141D20] text-[#607074] border border-[#273438]'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#607074]">
                      Step 0{s.number}
                    </p>
                    <p className="text-xs font-medium truncate">{s.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Global Error Banner */}
        {saveError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/50 flex items-center justify-between text-xs text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{saveError}</span>
            </div>
            <button
              onClick={() => setSaveError(null)}
              className="text-red-400 hover:text-red-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ─── STEP 1: CAREER GOALS ──────────────────────────── */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fade-in">
            <header className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F2F0E9]">
                What roles are you targeting?
              </h1>
              <p className="text-sm text-[#A0ADB0]">
                Tell us your career preferences so we can match you with the right internships and job openings.
              </p>
            </header>

            {/* 1.1 Target Roles */}
            <section className="space-y-3.5 rounded-2xl border border-[#273438] bg-[#0E1518] p-5 sm:p-7">
              <div>
                <label htmlFor="target-role-input" className="block text-xs font-semibold uppercase tracking-wider text-[#A0ADB0] mb-1">
                  Target Roles <span className="text-[#70D6E8]">*</span>
                </label>
                <p className="text-xs text-[#607074]">
                  Add job titles you are actively seeking.
                </p>
              </div>

              {/* Tag Input */}
              <div className="flex gap-2">
                <input
                  id="target-role-input"
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRole(roleInput);
                    }
                  }}
                  placeholder="e.g. Software Development Engineer"
                  className="flex-1 h-10 px-3.5 rounded-xl bg-[#141D20] border border-[#273438] text-sm text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8] focus:ring-1 focus:ring-[#70D6E8] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => addRole(roleInput)}
                  className="px-4 h-10 rounded-xl bg-[#141D20] hover:bg-[#202B2E] border border-[#273438] text-xs font-medium text-[#F2F0E9] flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#70D6E8]" />
                  <span>Add</span>
                </button>
              </div>

              {/* Active Roles Tags */}
              {targetRoles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {targetRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#70D6E8]/10 text-[#70D6E8] border border-[#70D6E8]/25 text-xs font-medium"
                    >
                      <span>{role}</span>
                      <button
                        type="button"
                        onClick={() => removeRole(idx)}
                        className="hover:text-white transition-colors focus:outline-none"
                        aria-label={`Remove ${role}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              <div className="pt-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#607074] mb-2">
                  Quick suggestions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_SUGGESTIONS.map((sug) => {
                    const isAdded = targetRoles.some((r) => r.toLowerCase() === sug.toLowerCase());
                    return (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => addRole(sug)}
                        disabled={isAdded}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          isAdded
                            ? 'opacity-40 cursor-default bg-[#141D20] border-[#273438] text-[#607074]'
                            : 'bg-[#141D20] border-[#273438] text-[#A0ADB0] hover:text-[#F2F0E9] hover:border-[#3A4C52]'
                        }`}
                      >
                        + {sug}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 1.2 Opportunity Type */}
            <section className="space-y-3.5 rounded-2xl border border-[#273438] bg-[#0E1518] p-5 sm:p-7">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0ADB0] mb-1">
                  Opportunity Type
                </label>
                <p className="text-xs text-[#607074]">
                  What type of positions are you currently interested in?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'internship', title: 'Internship', desc: 'Summer & semester internships' },
                  { id: 'full-time', title: 'Full-time', desc: 'New graduate & early career roles' },
                  { id: 'both', title: 'Both', desc: 'Open to both internships and full-time' },
                ].map((opt) => {
                  const isSelected = opportunityType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setOpportunityType(opt.id as any)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#141D20] border-[#70D6E8]/60 text-[#F2F0E9] ring-1 ring-[#70D6E8]/30'
                          : 'bg-[#141D20]/50 border-[#273438] text-[#A0ADB0] hover:border-[#3A4C52]'
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1 text-[#F2F0E9]">{opt.title}</p>
                      <p className="text-xs text-[#607074]">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 1.3 Work Arrangement & Locations */}
            <section className="space-y-5 rounded-2xl border border-[#273438] bg-[#0E1518] p-5 sm:p-7">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0ADB0] mb-1">
                  Work Arrangement
                </label>
                <p className="text-xs text-[#607074]">How do you prefer to work?</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'remote', label: 'Remote' },
                  { id: 'hybrid', label: 'Hybrid' },
                  { id: 'on-site', label: 'On-site' },
                  { id: 'flexible', label: 'Flexible' },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWorkArrangement(w.id as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                      workArrangement === w.id
                        ? 'bg-[#141D20] border-[#70D6E8]/50 text-[#70D6E8]'
                        : 'bg-[#141D20]/50 border-[#273438] text-[#A0ADB0] hover:border-[#3A4C52]'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>

              {/* Preferred Cities */}
              <div className="pt-2 border-t border-[#273438]/70 space-y-3">
                <label htmlFor="pref-location-input" className="block text-xs font-semibold uppercase tracking-wider text-[#A0ADB0]">
                  Preferred Cities / Regions
                </label>
                <div className="flex gap-2">
                  <input
                    id="pref-location-input"
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocation(locationInput);
                      }
                    }}
                    placeholder="e.g. Bengaluru, Remote, San Francisco"
                    className="flex-1 h-10 px-3.5 rounded-xl bg-[#141D20] border border-[#273438] text-sm text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8] focus:ring-1 focus:ring-[#70D6E8] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => addLocation(locationInput)}
                    className="px-4 h-10 rounded-xl bg-[#141D20] hover:bg-[#202B2E] border border-[#273438] text-xs font-medium text-[#F2F0E9] flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-[#70D6E8]" />
                    <span>Add</span>
                  </button>
                </div>

                {preferredLocations.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {preferredLocations.map((loc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141D20] text-[#A0ADB0] border border-[#273438] text-xs"
                      >
                        <span>{loc}</span>
                        <button
                          type="button"
                          onClick={() => removeLocation(idx)}
                          className="hover:text-white transition-colors focus:outline-none"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {LOCATION_SUGGESTIONS.map((sug) => {
                    const isAdded = preferredLocations.some((l) => l.toLowerCase() === sug.toLowerCase());
                    return (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => addLocation(sug)}
                        disabled={isAdded}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          isAdded
                            ? 'opacity-40 cursor-default bg-[#141D20] border-[#273438] text-[#607074]'
                            : 'bg-[#141D20] border-[#273438] text-[#A0ADB0] hover:text-[#F2F0E9] hover:border-[#3A4C52]'
                        }`}
                      >
                        + {sug}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ─── STEP 2: SKILLS AND BACKGROUND ─────────────────── */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fade-in">
            <header className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F2F0E9]">
                Your Skills & Background
              </h1>
              <p className="text-sm text-[#A0ADB0]">
                Add your technical proficiencies, education, and experience level.
              </p>
            </header>

            {/* 2.1 Skills */}
            <section className="space-y-3.5 rounded-2xl border border-[#273438] bg-[#0E1518] p-5 sm:p-7">
              <div>
                <label htmlFor="skill-input" className="block text-xs font-semibold uppercase tracking-wider text-[#A0ADB0] mb-1">
                  Technical & Professional Skills <span className="text-[#70D6E8]">*</span>
                </label>
                <p className="text-xs text-[#607074]">
                  Add languages, frameworks, developer tools, or domain specializations.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  id="skill-input"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="e.g. React, PostgreSQL, Docker"
                  className="flex-1 h-10 px-3.5 rounded-xl bg-[#141D20] border border-[#273438] text-sm text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8] focus:ring-1 focus:ring-[#70D6E8] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="px-4 h-10 rounded-xl bg-[#141D20] hover:bg-[#202B2E] border border-[#273438] text-xs font-medium text-[#F2F0E9] flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#70D6E8]" />
                  <span>Add</span>
                </button>
              </div>

              {/* Skills Tags */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#70D6E8]/10 text-[#70D6E8] border border-[#70D6E8]/25 text-xs font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="hover:text-white transition-colors focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Quick skill suggestions */}
              <div className="pt-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#607074] mb-2">
                  Popular skills:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_SUGGESTIONS.map((sug) => {
                    const isAdded = skills.some((s) => s.toLowerCase() === sug.toLowerCase());
                    return (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => addSkill(sug)}
                        disabled={isAdded}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          isAdded
                            ? 'opacity-40 cursor-default bg-[#141D20] border-[#273438] text-[#607074]'
                            : 'bg-[#141D20] border-[#273438] text-[#A0ADB0] hover:text-[#F2F0E9] hover:border-[#3A4C52]'
                        }`}
                      >
                        + {sug}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 2.2 Education */}
            <section className="space-y-4 rounded-2xl border border-[#273438] bg-[#0E1518] p-5 sm:p-7">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0ADB0] mb-1">
                  Education
                </label>
                <p className="text-xs text-[#607074]">
                  Your highest or current level of study.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edu-degree" className="block text-xs text-[#A0ADB0] mb-1">
                    Degree / Qualification
                  </label>
                  <input
                    id="edu-degree"
                    type="text"
                    value={education.degree || ''}
                    onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                    placeholder="e.g. Bachelor of Technology (B.Tech)"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#141D20] border border-[#273438] text-sm text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="edu-institution" className="block text-xs text-[#A0ADB0] mb-1">
                    Institution / University
                  </label>
                  <input
                    id="edu-institution"
                    type="text"
                    value={education.institution || ''}
                    onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#141D20] border border-[#273438] text-sm text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="edu-field" className="block text-xs text-[#A0ADB0] mb-1">
                    Field of Study
                  </label>
                  <input
                    id="edu-field"
                    type="text"
                    value={education.fieldOfStudy || ''}
                    onChange={(e) => setEducation({ ...education, fieldOfStudy: e.target.value })}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#141D20] border border-[#273438] text-sm text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="edu-year" className="block text-xs text-[#A0ADB0] mb-1">
                    Graduation Year (or expected)
                  </label>
                  <input
                    id="edu-year"
                    type="text"
                    value={education.gradYear || ''}
                    onChange={(e) => setEducation({ ...education, gradYear: e.target.value })}
                    placeholder="e.g. 2026"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#141D20] border border-[#273438] text-sm text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8] transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* 2.3 Experience Level */}
            <section className="space-y-3.5 rounded-2xl border border-[#273438] bg-[#0E1518] p-5 sm:p-7">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0ADB0] mb-1">
                  Experience Level
                </label>
                <p className="text-xs text-[#607074]">Select where you are in your career journey.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'student', label: 'Student', desc: 'Currently enrolled in an academic program' },
                  { id: 'fresher', label: 'Fresher / Recent Grad', desc: 'Graduated within the last 12 months' },
                  { id: 'internship', label: 'Internship Experience', desc: 'Completed one or more internships' },
                  { id: 'entry-level', label: 'Entry-Level Professional', desc: '1-2 years of industry experience' },
                  { id: 'experienced', label: 'Experienced Professional', desc: '3+ years of professional experience' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperienceLevel(exp.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      experienceLevel === exp.id
                        ? 'bg-[#141D20] border-[#70D6E8]/60 text-[#F2F0E9] ring-1 ring-[#70D6E8]/30'
                        : 'bg-[#141D20]/50 border-[#273438] text-[#A0ADB0] hover:border-[#3A4C52]'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#F2F0E9] mb-0.5">{exp.label}</p>
                    <p className="text-[11px] text-[#607074]">{exp.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* 2.4 Projects / Experience (Optional) */}
            <section className="space-y-4 rounded-2xl border border-[#273438] bg-[#0E1518] p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0ADB0] mb-1">
                    Projects & Experience (Optional)
                  </label>
                  <p className="text-xs text-[#607074]">
                    Highlight key software projects, open-source work, or previous roles.
                  </p>
                </div>
                {!showAddProject && (
                  <button
                    type="button"
                    onClick={() => setShowAddProject(true)}
                    className="px-3 py-1.5 rounded-lg border border-[#273438] bg-[#141D20] hover:bg-[#202B2E] text-xs font-medium text-[#70D6E8] flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              {/* Add Project Form */}
              {showAddProject && (
                <div className="p-4 rounded-xl border border-[#70D6E8]/30 bg-[#141D20] space-y-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="proj-title" className="block text-[11px] text-[#A0ADB0] mb-1">Project Title *</label>
                      <input
                        id="proj-title"
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="e.g. Distributed Task Queue"
                        className="w-full h-9 px-3 rounded-lg bg-[#0E1518] border border-[#273438] text-xs text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8]"
                      />
                    </div>
                    <div>
                      <label htmlFor="proj-org" className="block text-[11px] text-[#A0ADB0] mb-1">Organization / Github</label>
                      <input
                        id="proj-org"
                        type="text"
                        value={newProject.organization || ''}
                        onChange={(e) => setNewProject({ ...newProject, organization: e.target.value })}
                        placeholder="e.g. Personal Project / Hackathon"
                        className="w-full h-9 px-3 rounded-lg bg-[#0E1518] border border-[#273438] text-xs text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="proj-desc" className="block text-[11px] text-[#A0ADB0] mb-1">Description</label>
                    <textarea
                      id="proj-desc"
                      rows={2}
                      value={newProject.description || ''}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Built a fault-tolerant job queue using Redis and Go..."
                      className="w-full p-2.5 rounded-lg bg-[#0E1518] border border-[#273438] text-xs text-[#F2F0E9] placeholder-[#607074] focus:outline-none focus:border-[#70D6E8]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddProject(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#A0ADB0] hover:text-[#F2F0E9]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProject}
                      disabled={!newProject.title.trim()}
                      className="px-3 py-1.5 rounded-lg bg-[#70D6E8] text-[#090D0E] font-medium text-xs hover:bg-[#8AE0F0] disabled:opacity-50"
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              )}

              {/* Projects List */}
              {projects.length > 0 ? (
                <div className="space-y-2.5">
                  {projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#141D20]/60 border border-[#273438] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#F2F0E9]">{proj.title}</span>
                          {proj.organization && (
                            <span className="text-[10px] text-[#70D6E8] bg-[#70D6E8]/10 px-2 py-0.5 rounded">
                              {proj.organization}
                            </span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-xs text-[#A0ADB0] line-clamp-2 leading-relaxed">
                            {proj.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProject(idx)}
                        className="text-[#607074] hover:text-red-400 p-1 transition-colors"
                        aria-label="Remove project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : !showAddProject ? (
                <p className="text-xs text-[#607074] italic">
                  No projects added yet. You can leave this blank if you are just starting out.
                </p>
              ) : null}
            </section>
          </div>
        )}

        {/* ─── STEP 3: RESUME UPLOAD ─────────────────────────── */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fade-in">
            <header className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F2F0E9]">
                Upload your Resume
              </h1>
              <p className="text-sm text-[#A0ADB0]">
                Upload your latest resume in PDF or DOCX format (up to 5MB).
              </p>
            </header>

            {/* Resume Card / Uploader */}
            <section className="rounded-2xl border border-[#273438] bg-[#0E1518] p-6 sm:p-8 space-y-6">
              {resumeError && (
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/50 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{resumeError}</span>
                </div>
              )}

              {/* Already Uploaded Card */}
              {resumeMeta ? (
                <div className="p-5 sm:p-6 rounded-xl border border-[#70D6E8]/40 bg-[#141D20] space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#70D6E8]/10 border border-[#70D6E8]/20 flex items-center justify-center text-[#70D6E8] shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#F2F0E9] break-all">
                          {resumeMeta.fileName}
                        </h3>
                        <p className="text-xs text-[#A0ADB0] mt-0.5">
                          {(resumeMeta.fileSize / 1024).toFixed(1)} KB • Uploaded {new Date(resumeMeta.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-[#70D6E8] bg-[#70D6E8]/15 px-2.5 py-1 rounded-md border border-[#70D6E8]/30 shrink-0">
                      Active
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#273438] flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={api.profile.resumeDownloadUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#70D6E8] hover:text-[#8AE0F0] font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview / Download</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingResume}
                        className="px-3 py-1.5 rounded-lg border border-[#273438] bg-[#0E1518] hover:bg-[#1A2529] text-xs font-medium text-[#F2F0E9] transition-colors"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteResume}
                        disabled={uploadingResume}
                        className="px-3 py-1.5 rounded-lg border border-red-900/40 bg-red-950/20 hover:bg-red-950/40 text-xs font-medium text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Drag & Drop Upload Zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                    isDragOver
                      ? 'border-[#70D6E8] bg-[#70D6E8]/5'
                      : 'border-[#273438] hover:border-[#3A4C52] bg-[#141D20]/40'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#141D20] border border-[#273438] mx-auto flex items-center justify-center text-[#70D6E8] mb-4">
                    <UploadCloud className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-semibold text-[#F2F0E9] mb-1">
                    Drag and drop your resume here
                  </h3>
                  <p className="text-xs text-[#A0ADB0] max-w-sm mx-auto mb-5 leading-relaxed">
                    Accepted formats: PDF or DOCX. Maximum file size is 5MB.
                  </p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingResume}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141D20] hover:bg-[#202B2E] text-xs font-medium text-[#F2F0E9] border border-[#273438] hover:border-[#70D6E8]/50 transition-all shadow-sm"
                  >
                    {uploadingResume ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#70D6E8] border-t-transparent rounded-full animate-spin" />
                        <span>Uploading & verifying…</span>
                      </>
                    ) : (
                      <>
                        <span>Browse file</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#607074]" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="pt-2">
                <p className="text-xs text-[#607074] leading-relaxed">
                  💡 <strong>Privacy Note:</strong> Your resume is encrypted at rest and stored securely on the backend. Only you can download or preview your uploaded file.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* ─── STEP 4: REVIEW & FINISH ────────────────────────── */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fade-in">
            <header className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F2F0E9]">
                Review your Career Profile
              </h1>
              <p className="text-sm text-[#A0ADB0]">
                Everything looks great! Review your details below before completing your onboarding.
              </p>
            </header>

            {/* Summary Cards */}
            <div className="space-y-5">
              {/* 4.1 Career Goals Review */}
              <div className="p-5 sm:p-6 rounded-2xl border border-[#273438] bg-[#0E1518] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#70D6E8]" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F2F0E9]">
                      Career Goals
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#70D6E8] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#607074] block mb-1">Target Roles</span>
                    {targetRoles.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {targetRoles.map((r, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#141D20] text-[#70D6E8] border border-[#273438]">
                            {r}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#A0ADB0] italic">Not specified</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[#607074] block mb-1">Opportunity Type</span>
                    <span className="text-[#F2F0E9] capitalize font-medium">{opportunityType}</span>
                  </div>

                  <div>
                    <span className="text-[#607074] block mb-1">Work Arrangement</span>
                    <span className="text-[#F2F0E9] capitalize font-medium">{workArrangement}</span>
                  </div>

                  <div>
                    <span className="text-[#607074] block mb-1">Preferred Locations</span>
                    {preferredLocations.length > 0 ? (
                      <span className="text-[#F2F0E9]">{preferredLocations.join(', ')}</span>
                    ) : (
                      <span className="text-[#A0ADB0] italic">Any location</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4.2 Background & Skills Review */}
              <div className="p-5 sm:p-6 rounded-2xl border border-[#273438] bg-[#0E1518] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#70D6E8]" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F2F0E9]">
                      Skills & Background
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-[#70D6E8] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[#607074] block mb-1.5">Skills ({skills.length})</span>
                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#141D20] text-[#A0ADB0] border border-[#273438]">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#A0ADB0] italic">None added</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#273438]/60">
                    <div>
                      <span className="text-[#607074] block mb-0.5">Education</span>
                      <p className="text-[#F2F0E9] font-medium">
                        {education.degree || 'Degree not specified'}
                      </p>
                      <p className="text-[#A0ADB0]">
                        {education.institution || ''} {education.gradYear ? `(${education.gradYear})` : ''}
                      </p>
                    </div>

                    <div>
                      <span className="text-[#607074] block mb-0.5">Experience Level</span>
                      <p className="text-[#F2F0E9] capitalize font-medium">{experienceLevel}</p>
                    </div>
                  </div>

                  {projects.length > 0 && (
                    <div className="pt-2 border-t border-[#273438]/60">
                      <span className="text-[#607074] block mb-1.5">Projects ({projects.length})</span>
                      <div className="space-y-1.5">
                        {projects.map((p, i) => (
                          <div key={i} className="text-[#F2F0E9]">
                            • <strong className="font-medium">{p.title}</strong>
                            {p.organization && <span className="text-[#A0ADB0]"> ({p.organization})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4.3 Resume Review */}
              <div className="p-5 sm:p-6 rounded-2xl border border-[#273438] bg-[#0E1518] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#70D6E8]" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#F2F0E9]">
                      Resume
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs text-[#70D6E8] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="text-xs">
                  {resumeMeta ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#141D20] border border-[#273438]">
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-4 h-4 text-[#70D6E8]" />
                        <span className="text-[#F2F0E9] font-medium">{resumeMeta.fileName}</span>
                      </div>
                      <span className="text-[10px] text-[#70D6E8] bg-[#70D6E8]/10 px-2 py-0.5 rounded">
                        Ready
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#141D20]/50 border border-[#273438] text-[#A0ADB0] flex items-center justify-between">
                      <span>No resume uploaded yet.</span>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="text-xs text-[#70D6E8] hover:underline"
                      >
                        Upload now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Bottom Actions Bar ─────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-[#273438] flex items-center justify-between gap-4">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#273438] bg-[#141D20] hover:bg-[#202B2E] text-xs font-medium text-[#F2F0E9] transition-colors focus:outline-none focus:ring-1 focus:ring-[#70D6E8]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#70D6E8] text-[#090D0E] font-semibold text-xs hover:bg-[#8AE0F0] active:bg-[#5BC2D6] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#70D6E8] focus:ring-offset-2 focus:ring-offset-[#090D0E]"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#70D6E8] text-[#090D0E] font-semibold text-xs hover:bg-[#8AE0F0] active:bg-[#5BC2D6] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#70D6E8] focus:ring-offset-2 focus:ring-offset-[#090D0E]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save & Complete Profile</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
