import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  Search,
  FileText,
  Video,
  Code2,
  Terminal,
  BrainCircuit,
  MessageSquare,
  Target,
  Briefcase,
  GraduationCap,
  Sparkles,
  BookOpen,
  LineChart,
  HelpCircle,
  FolderCheck,
  Check,
  Building2,
  Compass,
} from 'lucide-react';

export const LandingSections: React.FC = () => {
  const [activeHintState, setActiveHintState] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<string>('frontend');

  return (
    <div className="space-y-24 md:space-y-32">
      {/* ================= 4. TRUST / LEARNING SOURCES STRIP ================= */}
      <section className="py-10 border-y border-line/70 bg-surface/40">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-ink-muted">
            Your learning is everywhere. Your skill intelligence shouldn&apos;t be.
          </h2>

          {/* Sources Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {[
              'YouTube',
              'NPTEL',
              'PDFs & Books',
              'Online Courses',
              'GitHub',
              'Projects',
              'ChatGPT & AI Assistants',
              'Self Learning',
            ].map((src) => (
              <span
                key={src}
                className="px-3 py-1.5 bg-surface-raised border border-line rounded-md text-xs font-mono text-ink shadow-2xs hover:border-ink/30 transition-colors"
              >
                {src}
              </span>
            ))}
          </div>

          {/* Convergence Arrow */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="h-px w-12 bg-line" />
            <span className="text-[10px] font-mono uppercase text-mastered tracking-widest px-3 py-1 bg-mastered/10 border border-mastered/30 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Converges into Digital Skill Passport
            </span>
            <span className="h-px w-12 bg-line" />
          </div>
        </div>
      </section>

      {/* ================= 5. THE PROBLEM SECTION ================= */}
      <section id="problem" className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gap font-semibold">
                THE PROBLEM
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
                You learn everywhere.{' '}
                <span className="block text-ink-muted font-normal text-2xl sm:text-3xl mt-1">
                  But where is the proof of what you actually know?
                </span>
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                Certificates show completion. Course platforms show progress percentages. Coding sites show isolated challenge scores. None create a continuously updated, verified picture of your <strong>true competency</strong> across sub-skills.
              </p>
            </div>

            <div className="lg:col-span-6 bg-paper border border-line rounded-xl p-6 space-y-4 shadow-xs">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted block border-b border-line pb-2">
                Fragmented Learning vs. Skill Intelligence
              </span>
              
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-surface rounded-lg border border-line space-y-1">
                  <span className="text-gap font-semibold block">Disconnected</span>
                  <p className="text-[11px] text-ink-muted">Course certificates &amp; tutorial progress logs</p>
                </div>
                <div className="p-3 bg-mastered/10 border border-mastered/30 rounded-lg space-y-1">
                  <span className="text-mastered font-semibold block">Unified</span>
                  <p className="text-[11px] text-ink">One Living Student Skill Intelligence Layer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. SOLUTION PIPELINE ================= */}
      <section id="how-it-works" className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mastered font-semibold">
            ONE INTELLIGENCE LAYER
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
            From learning activity to verified competency.
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            The platform continuously converts learning materials and assessment evidence into structured skill intelligence.
          </p>
        </div>

        {/* 6 Pipeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { step: '01', title: 'Learn', desc: 'Learn from any resource, video, PDF, or course.' },
            { step: '02', title: 'Understand', desc: 'AI extracts concepts, definitions, & topics.' },
            { step: '03', title: 'Assess', desc: 'Demonstrate real understanding via quizzes & tasks.' },
            { step: '04', title: 'Verify', desc: 'Competency is established through evidence.' },
            { step: '05', title: 'Track', desc: 'Results update your living Digital Skill Passport.' },
            { step: '06', title: 'Grow', desc: 'Discover exact skill gaps & targeted recommendations.' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-surface-raised border border-line p-4 rounded-xl space-y-2 hover:border-mastered/50 transition-colors shadow-2xs"
            >
              <span className="text-xs font-mono text-mastered font-bold">{item.step}</span>
              <h3 className="font-serif font-bold text-ink text-base">{item.title}</h3>
              <p className="text-[11px] text-ink-muted leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 7. HOW RESOURCE INTELLIGENCE WORKS ================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-developing font-semibold">
              SMARTER THAN A RESOURCE LIST
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink">
              The platform understands the material before you learn from it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stage 1: Medium Analysis */}
            <div className="bg-surface-raised border border-line p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-developing/10 text-developing flex items-center justify-center font-mono font-bold text-xs">
                  01
                </span>
                <div>
                  <h3 className="font-serif font-bold text-ink text-lg">Medium Analysis</h3>
                  <span className="text-[11px] font-mono text-ink-muted">Before you choose</span>
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Automatically evaluates search results to ensure you pick high-value learning material matched to your prerequisites.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-ink">
                <div className="p-2 bg-surface rounded border border-line">Difficulty &amp; Quality</div>
                <div className="p-2 bg-surface rounded border border-line">Prerequisite Check</div>
                <div className="p-2 bg-surface rounded border border-line">Topic Relevance</div>
                <div className="p-2 bg-surface rounded border border-line">Est. Learning Time</div>
              </div>
            </div>

            {/* Stage 2: Strong Analysis */}
            <div className="bg-surface-raised border border-line p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-mastered/10 text-mastered flex items-center justify-center font-mono font-bold text-xs">
                  02
                </span>
                <div>
                  <h3 className="font-serif font-bold text-ink text-lg">Strong Analysis</h3>
                  <span className="text-[11px] font-mono text-ink-muted">After you choose</span>
                </div>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Deeply analyzes selected material to extract definitions, relationships, and video transcripts into an interactive workspace.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-ink">
                <div className="p-2 bg-surface rounded border border-line">Concept Extraction</div>
                <div className="p-2 bg-surface rounded border border-line">Knowledge Graphs</div>
                <div className="p-2 bg-surface rounded border border-line">Transcript Hotspots</div>
                <div className="p-2 bg-surface rounded border border-line">Assessment Generator</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. KNOWLEDGE GRAPH SECTION ================= */}
      <section id="intelligence" className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mastered font-semibold">
            SEE THE KNOWLEDGE BEHIND THE SKILL
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink">
            A skill is more than a single number.
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            &ldquo;React — 76%&rdquo; doesn&apos;t tell the whole story. The platform maps connected concept nodes to reveal exactly where you excel and where you need focus.
          </p>
        </div>

        {/* Interactive Graph Node Component Mock */}
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-mastered" />
              <h3 className="font-serif font-bold text-ink text-base sm:text-lg">
                React Knowledge Topology
              </h3>
            </div>
            <span className="text-xs font-mono text-mastered bg-mastered/10 px-2.5 py-1 rounded-full border border-mastered/30">
              Overall: 76% (Developing → Strong)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            {[
              { node: 'Components', score: 90, status: 'Mastered', color: 'text-mastered bg-mastered/10 border-mastered/30' },
              { node: 'Props & Data', score: 87, status: 'Mastered', color: 'text-mastered bg-mastered/10 border-mastered/30' },
              { node: 'State', score: 72, status: 'Developing', color: 'text-developing bg-developing/10 border-developing/30' },
              { node: 'Hooks', score: 64, status: 'Developing', color: 'text-developing bg-developing/10 border-developing/30' },
              { node: 'Context API', score: 51, status: 'Needs Work', color: 'text-gap bg-gap/10 border-gap/30' },
              { node: 'Routing', score: 81, status: 'Mastered', color: 'text-mastered bg-mastered/10 border-mastered/30' },
            ].map((item) => (
              <div key={item.node} className={`p-3 rounded-lg border space-y-1 ${item.color}`}>
                <div className="font-bold">{item.node}</div>
                <div className="text-base font-bold">{item.score}%</div>
                <div className="text-[10px] uppercase">{item.status}</div>
              </div>
            ))}
          </div>

          {/* AI Focus Recommendation Pill */}
          <div className="p-4 bg-paper border border-line rounded-xl flex items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-developing shrink-0" />
              <span>
                <strong>Recommended Focus:</strong> Strengthen <strong>React Context API (51%)</strong> and <strong>Hooks (64%)</strong>.
              </span>
            </div>
            <Link to="/skill-graph" className="text-ink font-semibold hover:underline shrink-0">
              Inspect Full Topology &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 9. INTERACTIVE AI TUTOR SECTION ================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-mastered font-semibold">
                LEARN WITH CONTEXT
              </span>
              <h2 className="font-serif text-3xl font-bold text-ink">
                An AI tutor that knows what you&apos;re learning.
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Not a generic chatbot. The AI assistant understands your active material, extracted concepts, quiz history, and specific knowledge gaps to give grounded explanations.
              </p>
            </div>

            {/* Chat Thread Component */}
            <div className="lg:col-span-7 bg-surface-raised border border-line rounded-xl p-5 space-y-4 shadow-sm text-xs font-mono">
              <div className="flex items-center justify-between border-b border-line pb-2 text-[10px] text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-mastered" /> Contextual AI Learning Assistant
                </span>
                <span>Active Material: React Fundamentals</span>
              </div>

              {/* Message 1: Student */}
              <div className="bg-surface p-3 rounded-lg border border-line space-y-1">
                <span className="text-[10px] text-ink-muted block">Student</span>
                <p className="text-ink font-sans">
                  &ldquo;I understand props, but I&apos;m confused about when I should use state instead.&rdquo;
                </p>
              </div>

              {/* Message 2: AI Tutor */}
              <div className="bg-mastered/5 border border-mastered/30 p-3 rounded-lg space-y-1">
                <span className="text-[10px] text-mastered font-bold block flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Tutor (Grounded in Material)
                </span>
                <p className="text-ink font-sans">
                  &ldquo;Props allow a parent component to pass data down. Based on your current React Hooks material, use state when data needs to change over time within the component itself...&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. ASSESSMENT & VERIFICATION ================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mastered font-semibold">
            DON&apos;T JUST CLAIM THE SKILL. DEMONSTRATE IT.
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
            Certificates show completion. We measure competency.
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Claims are evidence, not proof. Competency is verified through adaptive quizzes, structured interviews, and coding evaluations.
          </p>
        </div>

        {/* Verification Flow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-4xl mx-auto text-xs font-mono">
          {['Evidence Ingestion', 'AI Assessment', 'Competency Scoring', 'Verified Skill', 'Digital Passport'].map((step, idx) => (
            <div key={step} className="p-3 bg-surface-raised border border-line rounded-lg space-y-1 shadow-2xs">
              <span className="text-[10px] text-mastered font-bold block">0{idx + 1}</span>
              <span className="text-ink font-semibold block">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 11. PROGRAMMING INTELLIGENCE SECTION ================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-developing font-semibold">
              WHEN THE SKILL IS CODE, THE ASSESSMENT GOES DEEPER
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink">
              AI that mentors your thinking — not writes the answer for you.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 4 Hint States */}
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-mono uppercase text-ink-muted block mb-2">
                Select Student State:
              </span>

              {[
                { id: 1, title: 'No idea where to begin', detail: 'Provides concept guidance & progressive scaffolding without spoiling code.' },
                { id: 2, title: 'I know the logic', detail: 'Helps translate logic into pseudocode & structural hints.' },
                { id: 3, title: 'I have partial code', detail: 'Analyzes intent, pinpoints syntax bugs, and suggests targeted improvements.' },
                { id: 4, title: 'I have a solution', detail: 'Evaluates time complexity, readability, and best practices.' },
              ].map((state) => (
                <button
                  key={state.id}
                  type="button"
                  onClick={() => setActiveHintState(state.id)}
                  className={`w-full text-left p-3 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                    activeHintState === state.id
                      ? 'bg-ink text-paper border-ink font-semibold'
                      : 'bg-surface-raised text-ink border-line hover:border-ink/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>0{state.id}. {state.title}</span>
                    {activeHintState === state.id && <Check className="w-3.5 h-3.5 text-mastered" />}
                  </div>
                  <p className="text-[11px] opacity-80 mt-1 font-sans">{state.detail}</p>
                </button>
              ))}
            </div>

            {/* 6 Code Dimensions */}
            <div className="lg:col-span-6 bg-surface-raised border border-line rounded-xl p-6 space-y-4 text-xs font-mono">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted block border-b border-line pb-2">
                Code Evaluation Dimensions
              </span>
              <div className="grid grid-cols-2 gap-3">
                {['Logic & Flow', 'Algorithm Choice', 'Time Complexity', 'Edge Cases', 'Readability', 'Best Practices'].map((dim) => (
                  <div key={dim} className="p-2.5 bg-surface rounded border border-line flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-mastered" />
                    <span className="text-ink font-medium">{dim}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 12. DIGITAL SKILL PASSPORT SHOWCASE ================= */}
      <section id="passport" className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mastered font-semibold">
            YOUR SKILLS. YOUR EVIDENCE. YOUR HISTORY.
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink">
            One living record of what you can actually do.
          </h2>
        </div>

        {/* Big Dashboard Showcase Box */}
        <div className="bg-surface-raised border border-line rounded-2xl p-6 sm:p-10 space-y-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 bg-surface rounded-xl border border-line">
              <span className="text-ink-muted text-[10px] block">VERIFIED SKILLS</span>
              <span className="text-2xl font-bold text-ink">14 Concepts</span>
            </div>
            <div className="p-4 bg-surface rounded-xl border border-line">
              <span className="text-ink-muted text-[10px] block">EVIDENCE EVENTS</span>
              <span className="text-2xl font-bold text-ink">28 Assessments</span>
            </div>
            <div className="p-4 bg-surface rounded-xl border border-line">
              <span className="text-ink-muted text-[10px] block">COMPETENCY SCORE</span>
              <span className="text-2xl font-bold text-mastered">84 / 100</span>
            </div>
            <div className="p-4 bg-surface rounded-xl border border-line">
              <span className="text-ink-muted text-[10px] block">STATUS</span>
              <span className="text-2xl font-bold text-ink">Active Student</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 13. SKILL GAP INTELLIGENCE ================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gap font-semibold">
              KNOW WHAT TO LEARN NEXT
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink">
              From &ldquo;I want to become a developer&rdquo; to exactly what you&apos;re missing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Target Role Verified vs Gaps */}
            <div className="bg-surface-raised p-5 rounded-xl border border-line space-y-3">
              <div className="flex justify-between items-center border-b border-line pb-2">
                <span className="font-bold text-ink">Target: Full-Stack Developer</span>
                <span className="text-mastered">78% Match</span>
              </div>
              <div className="space-y-1 text-ink">
                <div className="text-mastered">✓ HTML &amp; CSS (Verified)</div>
                <div className="text-mastered">✓ JavaScript (Verified)</div>
                <div className="text-mastered">✓ React (Verified 76%)</div>
                <div className="text-gap mt-2">○ Node.js (Missing Prerequisite)</div>
                <div className="text-gap">○ Express &amp; REST APIs (Missing)</div>
                <div className="text-gap">○ SQL / Database Systems (Missing)</div>
              </div>
            </div>

            {/* Within-Skill Gaps */}
            <div className="bg-surface-raised p-5 rounded-xl border border-line space-y-3">
              <div className="flex justify-between items-center border-b border-line pb-2">
                <span className="font-bold text-ink">Within-Skill Gap: React</span>
                <span className="text-developing">76% Overall</span>
              </div>
              <div className="space-y-2 text-ink">
                <div>Components: 90% (Strong)</div>
                <div>Props: 87% (Strong)</div>
                <div className="text-developing font-bold">Hooks: 64% (Recommended Next)</div>
                <div className="text-gap font-bold">Context API: 51% (Critical Gap)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 14. CAREER READINESS ================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-mastered font-semibold">
            CAREER READINESS, BUILT ON REAL SKILLS
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink">
            Know where your skills can take you.
          </h2>
        </div>

        <div className="bg-surface border border-line rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {[
            { title: 'Frontend Developer', match: 91, status: 'High Match' },
            { title: 'Full-Stack Developer', match: 82, status: 'Prerequisites Needed' },
            { title: 'React Specialist', match: 95, status: 'Ready for Interview' },
          ].map((role) => (
            <div key={role.title} className="p-4 bg-surface-raised border border-line rounded-xl space-y-2">
              <div className="flex justify-between font-bold text-ink">
                <span>{role.title}</span>
                <span className="text-mastered">{role.match}%</span>
              </div>
              <span className="text-[10px] text-ink-muted block">{role.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 16 & 17. FOR STUDENTS & INSTITUTIONS ================= */}
      <section id="students" className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-8 space-y-4">
          <GraduationCap className="w-8 h-8 text-mastered" />
          <h3 className="font-serif text-2xl font-bold text-ink">For Students</h3>
          <ul className="space-y-2 text-xs font-mono text-ink-muted">
            <li>✓ Understand what you actually know &amp; where you stand.</li>
            <li>✓ Prove your real competency backed by evidence.</li>
            <li>✓ Discover sub-skill gaps with clear actionable steps.</li>
            <li>✓ Maintain a living Digital Skill Passport.</li>
          </ul>
          <Link to="/register" className="btn btn-primary text-xs py-2 px-4 inline-flex items-center gap-1">
            Start Building Passport &rarr;
          </Link>
        </div>

        <div id="institutions" className="bg-surface border border-line rounded-2xl p-6 sm:p-8 space-y-4">
          <Building2 className="w-8 h-8 text-developing" />
          <h3 className="font-serif text-2xl font-bold text-ink">For Institutions</h3>
          <ul className="space-y-2 text-xs font-mono text-ink-muted">
            <li>✓ Access structured, read-only student capability profiles.</li>
            <li>✓ View verified skills &amp; assessment evidence.</li>
            <li>✓ Track authentic competency progression over time.</li>
            <li>✓ Identify curriculum knowledge gaps per student.</li>
          </ul>
        </div>
      </section>

      {/* ================= 18. FINAL CTA BANNER ================= */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-ink text-paper rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-paper/70">
            YOUR SKILLS ARE ALREADY BEING BUILT.
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Now build the intelligence behind them.
          </h2>
          <p className="text-xs sm:text-sm text-paper/80 max-w-xl mx-auto leading-relaxed">
            Learn anywhere. Demonstrate what you know. Verify your competency. Build a Digital Skill Passport that grows with you.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 bg-paper text-ink rounded-md text-sm font-semibold hover:bg-surface transition-colors"
            >
              Build My Digital Skill Passport
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-paper/40 text-paper rounded-md text-sm hover:border-paper transition-colors"
            >
              Sign In to Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 19. FOOTER ================= */}
      <footer className="border-t border-line/70 pt-12 pb-8 bg-surface/30">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8 text-xs font-mono text-ink-muted">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <span className="text-ink font-bold block">Product</span>
              <p>How It Works</p>
              <p>Skill Passport</p>
              <p>Learning Intelligence</p>
              <p>Assessments</p>
            </div>
            <div className="space-y-2">
              <span className="text-ink font-bold block">Students</span>
              <p>Learning Workspace</p>
              <p>Assessments</p>
              <p>Skill Gaps</p>
              <p>Career Readiness</p>
            </div>
            <div className="space-y-2">
              <span className="text-ink font-bold block">Institutions</span>
              <p>Student Intelligence</p>
              <p>Verification</p>
              <p>Institutional Access</p>
            </div>
            <div className="space-y-2">
              <span className="text-ink font-bold block">Company</span>
              <p>About Project</p>
              <p>Research</p>
              <p>Contact</p>
            </div>
          </div>

          <div className="pt-8 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>
              &copy; {new Date().getFullYear()} AI-Powered Student Skill Intelligence Platform. Building a Digital Skill Passport.
            </p>
            <span className="text-mastered font-semibold">Verified Student Skill Intelligence Layer</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
