import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { getScoreSemantic } from '../../lib/utils';

export interface SubSkill {
  name: string;
  score: number;
  statusLabel?: string;
}

export interface WaterWaveSkillCardProps {
  skillName: string;
  percentage: number;
  statusLabel?: string;
  subSkills?: SubSkill[];
  className?: string;
}

export const WaterWaveSkillCard: React.FC<WaterWaveSkillCardProps> = ({
  skillName,
  percentage,
  statusLabel,
  subSkills = [],
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const semantic = getScoreSemantic(percentage);
  const displayStatus = statusLabel || semantic.label;

  // Find weakest sub-skill for AI FOCUS box
  const weakestSubSkill = React.useMemo(() => {
    if (!subSkills || subSkills.length === 0) return null;
    return [...subSkills].sort((a, b) => a.score - b.score)[0];
  }, [subSkills]);

  const handleMobileClick = () => {
    // Allows tap-to-flip on touch devices
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`${skillName} skill card, overall competency ${percentage}%. Hover or focus to explore concept nodes.`}
      onClick={handleMobileClick}
      onKeyDown={handleKeyDown}
      className={`group relative h-[380px] w-full [perspective:1000px] outline-none select-none cursor-pointer ${className}`}
    >
      <div
        className={`relative h-full w-full rounded-xl border transition-transform duration-600 [transform-style:preserve-3d] shadow-sm ${
          isFlipped ? '[transform:rotateY(180deg)]' : 'group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]'
        } ${semantic.borderClass} bg-surface-raised`}
      >
        {/* ================= FRONT SIDE — SKILL OVERVIEW ================= */}
        <div className="absolute inset-0 h-full w-full rounded-xl p-5 flex flex-col justify-between overflow-hidden [backface-visibility:hidden] bg-surface-raised">
          {/* Animated Water-wave Liquid Background */}
          <div
            className="absolute bottom-0 left-0 right-0 w-full transition-all duration-700 ease-out pointer-events-none overflow-hidden"
            style={{ height: `${percentage}%` }}
          >
            <div
              className="absolute inset-0 opacity-15 text-current"
              style={{ color: `var(--color-${percentage >= 80 ? 'mastered' : percentage >= 60 ? 'developing' : 'gap'})` }}
            >
              <svg
                className="absolute top-0 left-0 w-[200%] h-6 -translate-y-full animate-[wave_6s_linear_infinite]"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 C150,90 350,-40 500,40 C650,120 900,-20 1200,40 L1200,120 L0,120 Z"
                  fill="currentColor"
                />
              </svg>
              <div className="w-full h-full bg-current opacity-30" />
            </div>
          </div>

          {/* Front Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-line/60 pb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${semantic.colorClass} ${semantic.bgClass.replace('/10', '')}`} />
              <h3 className="font-serif font-bold text-lg text-ink leading-none">{skillName}</h3>
            </div>
            <span className={`text-xs font-mono font-medium ${semantic.colorClass}`}>
              {displayStatus}
            </span>
          </div>

          {/* Front Center: Prominent Overall Competency */}
          <div className="relative z-10 my-auto text-center py-2">
            <span className="font-mono text-5xl font-extrabold text-ink tracking-tight block">
              {percentage}<span className="text-xl text-ink-muted">%</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-ink-muted uppercase block mt-1">
              Overall Competency
            </span>
          </div>

          {/* Front Footer: Verification Badge & Hover Affordance */}
          <div className="relative z-10 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-ink-muted">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-mastered shrink-0" />
              <span>Verified Evidence &bull; Continuous</span>
            </div>

            <div className="flex items-center gap-1 text-ink-muted group-hover:text-ink font-medium transition-colors">
              <span>Hover to explore</span>
              <ArrowRight className="w-3.5 h-3.5 text-mastered transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE — CONCEPT NODE INTELLIGENCE ================= */}
        <div className="absolute inset-0 h-full w-full rounded-xl p-4 sm:p-5 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface border-t-2 border-t-current ${semantic.colorClass}">
          
          {/* Back Header */}
          <div className="border-b border-line pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted font-bold block">
              CONCEPT NODES
            </span>
            <span className="text-xs font-serif font-bold text-ink block">
              {skillName} competency breakdown
            </span>
          </div>

          {/* Concept Node Rows */}
          <div className="my-auto space-y-2 py-1">
            {subSkills.map((sub) => {
              const subSemantic = getScoreSemantic(sub.score);
              const nodeStatus =
                sub.statusLabel ||
                (sub.score >= 80 ? 'Strong' : sub.score >= 60 ? 'Developing' : 'Needs Focus');

              return (
                <div key={sub.name} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-ink font-medium truncate max-w-[140px] sm:max-w-[170px]">
                      {sub.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`font-semibold ${subSemantic.colorClass}`}>{sub.score}%</span>
                      <span className="text-[9px] uppercase text-ink-muted px-1 rounded bg-paper border border-line">
                        {nodeStatus}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-line/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sub.score >= 80 ? 'bg-mastered' : sub.score >= 60 ? 'bg-developing' : 'bg-gap'
                      }`}
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI FOCUS Insight Box */}
          {weakestSubSkill && (
            <div className="p-2 rounded bg-paper border border-line flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-developing shrink-0" />
                <span>
                  <strong>AI FOCUS:</strong> {weakestSubSkill.name} —{' '}
                  <strong className="text-gap">{weakestSubSkill.score}%</strong>
                </span>
              </div>
              <span className="text-ink-muted hidden sm:inline">Recommended focus area</span>
            </div>
          )}

          {/* Back Footer */}
          <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[10px] font-mono text-ink-muted">
            <span>
              {subSkills.length} Concept Nodes &bull; Verified assessment
            </span>
            <span className="flex items-center gap-1 text-ink-faint">
              <RotateCcw className="w-3 h-3 opacity-60" /> Front
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
