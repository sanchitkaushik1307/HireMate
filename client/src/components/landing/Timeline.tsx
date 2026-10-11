import {
  type CSSProperties,
  useRef,
  useSyncExternalStore,
  useEffect,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type TimelineMilestone = {
  id: string;
  step: string;
  title: string;
  content: string;
};

export type TimelineProps = {
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  duration?: number;
  scrollDuration?: number;
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener('change', callback);
  return () => mediaQueryList.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  );
}

// HireMate core 4-stage pipeline milestones
const topMilestones: TimelineMilestone[] = [
  {
    id: 'step-01',
    step: '01',
    title: 'Build your profile',
    content: 'Bring your resume, skills, experience, and career preferences into one place.',
  },
  {
    id: 'step-03',
    step: '03',
    title: 'Tailor your resume',
    content: 'Prepare a role-specific resume and review the proposed changes before using them.',
  },
];

const bottomMilestones: TimelineMilestone[] = [
  {
    id: 'step-02',
    step: '02',
    title: 'Discover opportunities',
    content: 'Find relevant jobs and internships based on your target roles and background.',
  },
  {
    id: 'step-04',
    step: '04',
    title: 'Manage applications',
    content: 'Keep applications organized and follow their progress from one workspace.',
  },
];

const allMilestones: TimelineMilestone[] = [
  ...topMilestones,
  ...bottomMilestones,
].sort((a, b) => a.step.localeCompare(b.step));

export function Timeline({
  title = 'Automate your job search',
  periodLabel = 'The continuous pipeline from discovery to offers',
  textColor = '#F2F0E9',
  mutedTextColor = '#A0ADB0',
  activeColor = '#70D6E8', // HireMate cyan accent
  backgroundColor = '#080D0F',
  imageUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  imageAlt = 'Software engineering workspace',
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  // GSAP matchMedia handles desktop horizontal pinning & scrub, and mobile clean layout
  useRef<gsap.Context | null>(null);

  // Set up ScrollTrigger animation with GSAP matchMedia
  useRef<(() => void) | undefined>(undefined);

  // We use standard React useEffect / useLayoutEffect safely
  const setupGSAP = useRef(() => {
    const section = sectionRef.current;
    const pinContainer = pinContainerRef.current;
    const slider = wholeSliderRef.current;
    if (!section || !pinContainer || !slider) return;

    const mm = gsap.matchMedia();

    // Desktop: Pin and scrub horizontally
    mm.add('(min-width: 768px)', () => {
      // Calculate real travel distance so the last milestone is fully in view
      const getScrollDistance = () => {
        const trackWidth = slider.scrollWidth;
        const viewportWidth = window.innerWidth;
        // Travel until the end card is fully in view with generous padding
        return Math.max(trackWidth - viewportWidth + 80, 600);
      };

      if (reducedMotion) {
        // Reduced motion: set everything fully visible, no scrub animation
        gsap.set('.journey-line', { width: '100%' });
        allMilestones.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { scaleY: 1 });
          gsap.set(`.jd-${item.id}`, { scale: 1 });
          gsap.set(`.card-${item.id}`, { opacity: 1, y: 0 });
        });
        return;
      }

      // Initial state for animation elements
      gsap.set('.journey-line', { width: '0%' });
      allMilestones.forEach((item) => {
        const isTop = topMilestones.some((top) => top.id === item.id);
        gsap.set(`.jl-${item.id}`, {
          scaleY: 0,
          transformOrigin: isTop ? 'bottom bottom' : 'top top',
        });
        gsap.set(`.jd-${item.id}`, { scale: 0 });
        gsap.set(`.card-${item.id}`, {
          opacity: 0,
          y: isTop ? -20 : 20,
        });
      });

      // Master scrubbing timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pinContainer,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      });

      // 1. Move horizontal slider across viewport
      tl.to(
        slider,
        {
          x: () => -getScrollDistance(),
          duration: 1,
        },
        0
      );

      // 2. Draw continuous journey line across axis
      tl.to(
        '.journey-line',
        {
          width: '100%',
          duration: 1,
        },
        0
      );

      // 3. Staggered reveal of milestone nodes and cards as they enter view
      // Step 01 (build profile)
      tl.to('.jl-step-01', { scaleY: 1, duration: 0.1 }, 0.08)
        .to('.jd-step-01', { scale: 1, duration: 0.08 }, 0.08)
        .to('.card-step-01', { opacity: 1, y: 0, duration: 0.12 }, 0.1);

      // Step 02 (discover opportunities)
      tl.to('.jl-step-02', { scaleY: 1, duration: 0.1 }, 0.28)
        .to('.jd-step-02', { scale: 1, duration: 0.08 }, 0.28)
        .to('.card-step-02', { opacity: 1, y: 0, duration: 0.12 }, 0.3);

      // Step 03 (tailor resume)
      tl.to('.jl-step-03', { scaleY: 1, duration: 0.1 }, 0.52)
        .to('.jd-step-03', { scale: 1, duration: 0.08 }, 0.52)
        .to('.card-step-03', { opacity: 1, y: 0, duration: 0.12 }, 0.54);

      // Step 04 (manage applications)
      tl.to('.jl-step-04', { scaleY: 1, duration: 0.1 }, 0.74)
        .to('.jd-step-04', { scale: 1, duration: 0.08 }, 0.74)
        .to('.card-step-04', { opacity: 1, y: 0, duration: 0.12 }, 0.76);
    });

    // Mobile: Natural vertical milestone progression (no pin, no dead scrolling)
    mm.add('(max-width: 767px)', () => {
      if (reducedMotion) return;

      gsap.from('.mobile-milestone-card', {
        scrollTrigger: {
          trigger: '.mobile-milestones-container',
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out',
      });
    });

    return () => {
      mm.revert();
    };
  });

  // Execute GSAP setup & cleanup with React lifecycle
  useEffect(() => {
    const cleanup = setupGSAP.current();
    // Refresh ScrollTrigger after DOM renders and fonts/images settle
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(t);
      cleanup?.();
    };
  }, [reducedMotion]);


  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative w-full bg-hm-bg text-hm-fg"
      style={sectionStyle}
    >
      {/* ─── DESKTOP VIEW: PINNED HORIZONTAL STORYTELLING TRACK ─── */}
      <div
        ref={pinContainerRef}
        className="hidden md:flex h-screen w-full flex-col justify-center overflow-hidden relative pt-14"
      >
        <div
          ref={wholeSliderRef}
          className="flex items-center gap-10 px-12 w-max"
        >
          {/* Visual Lead Card */}
          <div className="w-[340px] h-[360px] shrink-0 rounded-2xl overflow-hidden border border-hm-border bg-hm-surface relative shadow-2xl flex flex-col justify-end p-6">
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hm-bg via-hm-bg/60 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="inline-block text-xs font-mono tracking-widest uppercase text-hm-accent">
                Guided Career Engine
              </span>
              <p className="text-base font-semibold text-hm-fg leading-snug">
                From application chaos to focused software engineering offers.
              </p>
            </div>
          </div>

          {/* Section Heading Card */}
          <div className="w-[320px] shrink-0 space-y-3 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-hm-border/80 bg-hm-surface/60 text-xs text-hm-accent font-mono tracking-wider uppercase">
              <span>Workflow</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-hm-fg leading-tight">
              {title}
            </h2>
            <p className="text-sm leading-relaxed" style={mutedTextStyle}>
              {periodLabel}
            </p>
          </div>

          {/* Interactive Pipeline Axis & Milestones */}
          <div className="relative w-[1500px] h-[380px] shrink-0 flex flex-col justify-between">
            {/* Horizontal Timeline Center Axis */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center z-10 pointer-events-none">
              <div
                className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_10px_rgba(112,214,232,0.8)]"
                style={activeStyle}
              />
              <div className="relative w-full h-[2px] bg-hm-border/60">
                <div
                  className="absolute left-0 top-0 h-full journey-line rounded-full"
                  style={activeStyle}
                />
              </div>
              <div
                className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_10px_rgba(112,214,232,0.8)]"
                style={activeStyle}
              />
            </div>

            {/* TOP ROW: Steps 01 & 03 */}
            <div className="h-[170px] w-full flex items-end pl-12 gap-x-[380px] pb-4">
              {topMilestones.map((item) => (
                <div
                  key={`top-${item.id}`}
                  className="relative w-[300px] shrink-0 pl-6"
                >
                  {/* Stem and Node pointing down to axis */}
                  <div className="absolute left-0 bottom-[-16px] top-0 w-4 flex flex-col items-center justify-between">
                    <div
                      className={`w-0.5 flex-1 origin-bottom jl-${item.id}`}
                      style={activeStyle}
                    />
                    <div
                      className={`w-3.5 h-3.5 rounded-full aspect-square jd-${item.id} shadow-[0_0_12px_rgba(112,214,232,0.9)]`}
                      style={activeStyle}
                    />
                  </div>

                  {/* Milestone Content Card */}
                  <div
                    className={`card-${item.id} space-y-1.5 p-4 rounded-xl border border-hm-border/60 bg-hm-surface/70 backdrop-blur-sm shadow-lg`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-hm-accent">
                        {item.step}
                      </span>
                      <h4 className="text-base font-semibold text-hm-fg leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs leading-relaxed" style={mutedTextStyle}>
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM ROW: Steps 02 & 04 */}
            <div className="h-[170px] w-full flex items-start pl-[280px] gap-x-[380px] pt-4">
              {bottomMilestones.map((item) => (
                <div
                  key={`bottom-${item.id}`}
                  className="relative w-[300px] shrink-0 pl-6"
                >
                  {/* Stem and Node pointing down from axis */}
                  <div className="absolute left-0 top-[-16px] bottom-0 w-4 flex flex-col items-center justify-between">
                    <div
                      className={`w-3.5 h-3.5 rounded-full aspect-square jd-${item.id} shadow-[0_0_12px_rgba(112,214,232,0.9)]`}
                      style={activeStyle}
                    />
                    <div
                      className={`w-0.5 flex-1 origin-top jl-${item.id}`}
                      style={activeStyle}
                    />
                  </div>

                  {/* Milestone Content Card */}
                  <div
                    className={`card-${item.id} space-y-1.5 p-4 rounded-xl border border-hm-border/60 bg-hm-surface/70 backdrop-blur-sm shadow-lg`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-hm-accent">
                        {item.step}
                      </span>
                      <h4 className="text-base font-semibold text-hm-fg leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs leading-relaxed" style={mutedTextStyle}>
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* End of Pipeline Release Card */}
          <div className="w-[300px] shrink-0 p-6 rounded-2xl border border-hm-border bg-hm-surface/80 backdrop-blur-md space-y-3 shadow-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-hm-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pipeline Complete</span>
            </div>
            <h4 className="text-lg font-bold text-hm-fg">
              Ready for Top Engineering Teams
            </h4>
            <p className="text-xs text-hm-fg-muted leading-relaxed">
              Continue scrolling to explore verified high-growth companies recruiting software engineers right now.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-hm-accent pt-1">
              <span>Target Companies below</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE VIEW: READABLE RESPONSIVE VERTICAL PIPELINE ─── */}
      <div className="flex md:hidden w-full flex-col px-6 py-20 space-y-10">
        {/* Mobile Header */}
        <div className="space-y-3 text-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-hm-accent">
            Workflow
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-hm-fg">
            {title}
          </h2>
          <p className="text-xs text-hm-fg-muted max-w-sm mx-auto leading-relaxed">
            {periodLabel}
          </p>
        </div>

        {/* Vertical Pipeline Spine */}
        <div className="relative pl-6 space-y-6 mobile-milestones-container">
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-hm-accent via-hm-accent/60 to-hm-accent/20" />

          {allMilestones.map((item) => (
            <div
              key={`mob-${item.id}`}
              className="relative mobile-milestone-card group"
            >
              {/* Dot on spine */}
              <div
                className="absolute -left-6 top-3 size-3 rounded-full shadow-[0_0_8px_rgba(112,214,232,0.8)]"
                style={activeStyle}
              />

              <div className="p-4 rounded-xl border border-hm-border/80 bg-hm-surface/80 backdrop-blur-sm space-y-1.5 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-hm-accent">
                    {item.step}
                  </span>
                  <h4 className="text-sm font-semibold text-hm-fg">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-hm-fg-muted leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Transition Prompt */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-hm-accent">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Workflow verified — scroll for target companies</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
