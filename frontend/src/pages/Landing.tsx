import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingSections } from '../components/landing/LandingSections';
import { ShieldCheck, ArrowRight, LayoutDashboard } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { status, user } = useAuth();
  const isAuthenticated = status === 'authenticated' && !!user;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-mastered/20">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-line">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          
          {/* Left: Product Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-ink text-paper flex items-center justify-center font-serif font-bold text-base shadow-2xs group-hover:bg-mastered transition-colors">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-ink text-base leading-none">
                SkillPass
              </span>
              <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest leading-none mt-0.5">
                Skill Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-ink-muted">
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-ink transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('passport')}
              className="hover:text-ink transition-colors cursor-pointer"
            >
              Skill Passport
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('intelligence')}
              className="hover:text-ink transition-colors cursor-pointer"
            >
              Intelligence
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('students')}
              className="hover:text-ink transition-colors cursor-pointer"
            >
              For Students
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('institutions')}
              className="hover:text-ink transition-colors cursor-pointer"
            >
              For Institutions
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/home"
                className="btn btn-primary text-xs py-2 px-4 rounded-md flex items-center gap-1.5 shadow-2xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-mono text-ink hover:text-mastered transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-xs py-2 px-4 rounded-md flex items-center gap-1 shadow-2xs"
                >
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Main Narrative Page Content */}
      <main>
        <LandingHero />
        <LandingSections />
      </main>
    </div>
  );
};
