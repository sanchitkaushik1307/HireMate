import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CrowdCanvas } from '../components/landing/CrowdCanvas';
import { Timeline } from '../components/landing/Timeline';
import { TiltedGridHero, type TiltedGridImage } from '../components/landing/TiltedGridHero';
import { Logo } from '../components/Logo';
import { ArrowRight, Sparkles, Compass, ShieldCheck, ChevronDown } from 'lucide-react';

const companyImages: TiltedGridImage[] = [
  { src: '/cards/google-card.svg', alt: 'Google', companyName: 'Google' },
  { src: '/cards/microsoft-card.svg', alt: 'Microsoft', companyName: 'Microsoft' },
  { src: '/cards/amazon-card.svg', alt: 'Amazon', companyName: 'Amazon' },
  { src: '/cards/meta-card.svg', alt: 'Meta', companyName: 'Meta' },
  { src: '/cards/nvidia-card.svg', alt: 'NVIDIA', companyName: 'NVIDIA' },
  { src: '/cards/adobe-card.svg', alt: 'Adobe', companyName: 'Adobe' },
  { src: '/cards/oracle-card.svg', alt: 'Oracle', companyName: 'Oracle' },
  { src: '/cards/sap-card.svg', alt: 'SAP', companyName: 'SAP' },
  { src: '/cards/flipkart-card.svg', alt: 'Flipkart', companyName: 'Flipkart' },
  { src: '/cards/zoho-card.svg', alt: 'Zoho', companyName: 'Zoho' },
  { src: '/cards/freshworks-card.svg', alt: 'Freshworks', companyName: 'Freshworks' },
  { src: '/cards/razorpay-card.svg', alt: 'Razorpay', companyName: 'Razorpay' },
  { src: '/cards/phonepe-card.svg', alt: 'PhonePe', companyName: 'PhonePe' },
  { src: '/cards/paytm-card.svg', alt: 'Paytm', companyName: 'Paytm' },
  { src: '/cards/cred-card.svg', alt: 'CRED', companyName: 'CRED' },
  { src: '/cards/groww-card.svg', alt: 'Groww', companyName: 'Groww' },
  { src: '/cards/swiggy-card.svg', alt: 'Swiggy', companyName: 'Swiggy' },
  { src: '/cards/zomato-card.svg', alt: 'Zomato', companyName: 'Zomato' },
  { src: '/cards/dream11-card.svg', alt: 'Dream11', companyName: 'Dream11' },
  { src: '/cards/zerodha-card.svg', alt: 'Zerodha', companyName: 'Zerodha' },
];

export function LandingPage() {
  const [touchTriggered, setTouchTriggered] = useState(false);
  const [beaconGlow, setBeaconGlow] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // When focal character touches the HireMate emblem
  const handleTouchContact = () => {
    if (touchTriggered) return;
    setTouchTriggered(true);
    setBeaconGlow(true);

    // After brief radiant illumination, smoothly scroll to timeline
    setTimeout(() => {
      if (timelineRef.current) {
        timelineRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  };

  const scrollToTimeline = () => {
    setTouchTriggered(true);
    if (timelineRef.current) {
      timelineRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-hm-bg text-hm-fg selection:bg-hm-accent/20 selection:text-hm-accent font-sans overflow-x-hidden">
      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-hm-bg/80 border-b border-hm-border/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size="sm" variant="light" showText={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-hm-fg-muted">
            <a
              href="#timeline"
              className="hover:text-hm-fg transition-colors"
            >
              Workflow
            </a>
            <a
              href="#companies"
              className="hover:text-hm-fg transition-colors"
            >
              Target Companies
            </a>
            <Link
              to="/login"
              className="hover:text-hm-fg transition-colors"
            >
              Sign In
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-medium text-hm-fg-muted hover:text-hm-fg md:hidden"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-hm-surface-elevated border border-hm-border-strong text-xs font-semibold text-hm-fg hover:border-hm-accent hover:text-hm-accent transition-all duration-200 shadow-sm"
            >
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── SCENE 1 & 2: THE CROWD & THE DISCOVERY ────────────── */}
      <section className="relative h-screen w-full flex flex-col justify-between pt-24 pb-8 overflow-hidden">
        {/* Editorial Top Headline */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-hm-border/80 bg-hm-surface/60 backdrop-blur-sm text-xs text-hm-fg-muted font-mono tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-hm-accent animate-pulse" />
            <span>Thousands searching. One clear path.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-hm-fg max-w-3xl mx-auto leading-[1.08]">
            In a sea of job seekers,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-hm-fg via-hm-cream to-hm-accent">
              stand out with intention.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-hm-fg-muted max-w-xl mx-auto leading-relaxed">
            Students and software engineers searching endlessly across platforms. Until one discovers a focused career accelerator.
          </p>
        </div>

        {/* Central HireMate Beacon / Brand Emblem (Focal Touch Target) */}
        <div className="relative z-20 flex flex-col items-center justify-center -my-6">
          <div
            onClick={scrollToTimeline}
            className={`cursor-pointer group relative p-5 rounded-2xl border transition-all duration-700 ${
              beaconGlow
                ? 'border-hm-accent bg-hm-surface-elevated shadow-[0_0_50px_rgba(112,214,232,0.35)] scale-110'
                : 'border-hm-border bg-hm-surface/90 hover:border-hm-accent/60 shadow-xl'
            }`}
          >
            {/* Ambient Aura */}
            <div
              className={`absolute -inset-4 rounded-3xl transition-opacity duration-700 pointer-events-none ${
                beaconGlow
                  ? 'bg-hm-accent/20 blur-xl opacity-100'
                  : 'bg-hm-accent/5 blur-lg opacity-40 group-hover:opacity-80'
              }`}
            />

            <div className="relative flex items-center gap-3">
              <Logo size="md" variant="light" showText={false} />
              <div className="text-left">
                <span className="text-sm font-bold tracking-tight block text-hm-fg">
                  Hire<span className="text-hm-accent">Mate</span>
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-hm-accent">
                  Touch to begin &darr;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Crowd Canvas (Scene 1 & 2 Background and Interactive Peeps) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <CrowdCanvas
            src="/crowd-sprites.png"
            rows={15}
            cols={7}
            onContactReached={handleTouchContact}
            isTransitioning={touchTriggered}
          />
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="relative z-20 text-center flex flex-col items-center gap-2">
          <button
            onClick={scrollToTimeline}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-hm-fg-subtle hover:text-hm-accent transition-colors"
          >
            <span>Scroll or touch HireMate to explore</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-hm-accent" />
          </button>
        </div>
      </section>

      {/* ─── SCENE 3: THE TIMELINE OPENS ("Automate your job search") ── */}
      <div ref={timelineRef}>
        <Timeline
          title="Automate your job search"
          periodLabel="The continuous pipeline from discovery to offers"
          textColor="#F2F0E9"
          mutedTextColor="#A0ADB0"
          activeColor="#70D6E8"
          backgroundColor="#080D0F"
        />
      </div>

      {/* ─── SCENE 4: TILTED GRID OF PRODUCT COMPANIES ───────────── */}
      <section id="companies" className="relative py-28 bg-hm-bg border-t border-hm-border/30 overflow-hidden">
        {/* Subtle Radial Atmosphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-hm-accent/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.25em] text-hm-accent">
            TARGET HIGH-GROWTH ENGINEERING TEAMS
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-hm-fg">
            Where our engineers build their careers.
          </h2>

          <p className="text-sm sm:text-base text-hm-fg-muted max-w-xl mx-auto leading-relaxed">
            Prepare for high-growth software engineering roles across leading global tech companies and high-impact fintech product unicorns.
          </p>
        </div>

        {/* 3D Perspective Cylindrical Tilted Grid Hero */}
        <div className="relative w-full h-[580px] max-[640px]:h-[460px]">
          <TiltedGridHero
            images={companyImages}
            speed={3.8}
            tileHeight={30}
            aspectRatio={16 / 9}
            gap={6}
            axis={52}
            curve={78}
            fade={15}
            className="w-full h-full"
          >
            {/* Centered Overlay Pill */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-hm-border/80 bg-hm-surface/80 backdrop-blur-md text-xs font-mono text-hm-fg-muted shadow-xl">
                <span className="w-2 h-2 rounded-full bg-hm-success" />
                <span>Verified high-growth engineering teams &amp; unicorns</span>
              </div>
            </div>
          </TiltedGridHero>
        </div>
      </section>

      {/* ─── SCENE 5: FINAL CALL TO ACTION ────────────────────────── */}
      <section className="relative py-32 bg-gradient-to-b from-hm-bg to-hm-surface border-t border-hm-border/40">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-hm-surface-elevated border border-hm-border text-hm-accent shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-hm-fg">
              Start your job search now.
            </h2>
            <p className="text-base sm:text-lg text-hm-fg-muted max-w-xl mx-auto leading-relaxed">
              Discover opportunities, tailor your resume, and manage your applications in one place with HireMate.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-hm-accent text-hm-bg font-semibold text-sm hover:bg-hm-accent-hover transition-all duration-200 shadow-[0_0_30px_rgba(112,214,232,0.25)] hover:shadow-[0_0_40px_rgba(112,214,232,0.4)]"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={scrollToTimeline}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-hm-surface-elevated border border-hm-border text-hm-fg font-medium text-sm hover:border-hm-border-strong hover:text-hm-accent transition-all duration-200"
            >
              <Compass className="w-4 h-4 text-hm-fg-muted" />
              <span>Explore how it works</span>
            </button>
          </div>

          {/* Security / Quality Indicators */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-hm-fg-subtle">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-hm-accent" />
              <span>Free for early career engineers</span>
            </div>
            <span className="hidden sm:inline text-hm-border">•</span>
            <div>Zero spam, no cold scrapers</div>
            <span className="hidden sm:inline text-hm-border">•</span>
            <div>Google OAuth verified</div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-hm-border/30 bg-hm-bg py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-hm-fg-subtle">
          <div className="flex items-center gap-3">
            <Logo size="sm" variant="light" showText={true} />
            <span className="text-hm-border">|</span>
            <span>Career acceleration for software engineers</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} HireMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
