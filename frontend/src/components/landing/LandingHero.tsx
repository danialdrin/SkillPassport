import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Cpu, GitFork, CheckCircle2 } from 'lucide-react';
import { WaterWaveSkillCard } from './WaterWaveSkillCard';

export const LandingHero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background ambient subtle glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-mastered/10 via-developing/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Hero Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-line bg-surface text-ink-muted text-[11px] font-mono uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-mastered" />
              YOUR SKILLS. ONE INTELLIGENT PASSPORT.
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-ink leading-[1.08] tracking-tight">
              Know what you know.{' '}
              <span className="block text-mastered italic font-normal">
                Prove what you can do.
              </span>
            </h1>

            <p className="text-base sm:text-lg xl:text-xl text-ink-muted leading-relaxed max-w-2xl">
              Turn scattered learning into verified skill intelligence. Learn from anywhere, get assessed on what you actually understand, and build an evidence-based Digital Skill Passport that continuously reflects your real competency.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/register"
                className="btn btn-primary text-sm sm:text-base font-medium py-3.5 px-7 rounded-md flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
              >
                Build My Skill Passport
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="btn btn-secondary text-sm sm:text-base py-3.5 px-7 rounded-md hover:bg-surface transition-colors cursor-pointer"
              >
                See How It Works
              </button>
            </div>

            {/* Feature Pills */}
            <div className="pt-6 border-t border-line/70 grid grid-cols-3 gap-3 text-xs font-mono text-ink-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-mastered shrink-0" />
                <span>Evidence-Backed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-mastered shrink-0" />
                <span>AI Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-mastered shrink-0" />
                <span>Sub-Skill Graph</span>
              </div>
            </div>
          </div>

          {/* Right Column: Single Featured Digital Skill Passport Interface */}
          <div className="lg:col-span-5 relative w-full max-w-lg mx-auto">
            {/* Passport Container Box */}
            <div className="relative bg-surface/90 backdrop-blur-md border border-line rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
              
              {/* Passport Header */}
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center font-serif font-bold text-lg shadow-sm">
                    SP
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block">
                      VERIFIED SKILL PROFILE
                    </span>
                    <h2 className="font-serif font-bold text-ink text-sm sm:text-base">
                      Digital Skill Passport
                    </h2>
                  </div>
                </div>

                <div className="px-2.5 py-1 bg-mastered/10 text-mastered border border-mastered/30 rounded-full text-[10px] font-mono font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Live Verified
                </div>
              </div>

              {/* Single Featured 3D Flip Skill Card */}
              <div className="w-full">
                <WaterWaveSkillCard
                  skillName="React"
                  percentage={76}
                  statusLabel="Developing → Strong"
                  subSkills={[
                    { name: 'Components', score: 90 },
                    { name: 'Props & Data Flow', score: 87 },
                    { name: 'State Management', score: 72 },
                    { name: 'React Hooks', score: 64 },
                    { name: 'Context API', score: 51 },
                    { name: 'React Routing', score: 81 },
                  ]}
                />
              </div>

              {/* Passport Footer Meta */}
              <div className="pt-3 text-center border-t border-line/60">
                <span className="text-[11px] font-mono text-ink-muted flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-mastered" />
                  Hover card to flip 180° &amp; inspect sub-skill concept nodes
                </span>
              </div>
            </div>

            {/* Decorative Floating Badges */}
            <div className="absolute -top-4 -right-4 bg-paper border border-line p-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-mono hidden sm:flex">
              <ShieldCheck className="w-4 h-4 text-mastered" />
              <span>Evidence Nodes: <strong>24 Logs</strong></span>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-paper border border-line p-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-mono hidden sm:flex">
              <Cpu className="w-4 h-4 text-developing" />
              <span>AI Focus: <strong>Context API (51%)</strong></span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
