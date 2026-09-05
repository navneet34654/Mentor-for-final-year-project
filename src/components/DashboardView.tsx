import { useState } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Award, 
  Calendar, 
  Layers, 
  ExternalLink,
  Target,
  School,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Check,
  Zap,
  Activity,
  Code2
} from 'lucide-react';
import type { User, ProjectIdea, UserStats } from '../types';

interface DashboardViewProps {
  currentUser: User | null;
  userStats: UserStats | null;
  savedProjects: ProjectIdea[];
  onNavigateToGenerator: () => void;
  onNavigateToSaved: () => void;
  onNavigateToMentor: (project?: ProjectIdea | null) => void;
  onViewProjectDetails: (project: ProjectIdea) => void;
}

export function DashboardView({
  currentUser,
  userStats,
  savedProjects,
  onNavigateToGenerator,
  onNavigateToSaved,
  onNavigateToMentor,
  onViewProjectDetails,
}: DashboardViewProps) {
  const activeProject = 
    savedProjects.find((p) => p.status === 'selected' || p.status === 'in-progress') ||
    savedProjects[0] || 
    null;

  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    'Project Proposal & Domain Approval': true,
    'SRS & Architecture Design Review': true,
    'Core Model / Algorithmic Prototype': false,
    'Full-Stack Integration & UI Polish': false,
    'Dissertation Report & Viva Voce Defense': false,
  });

  function toggleMilestone(title: string) {
    setCompletedMilestones((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }

  const milestonesList = [
    { title: 'Project Proposal & Domain Approval', target: 'Month 1', note: 'Formal approval from University Project Guide & HoD', weight: 20 },
    { title: 'SRS & Architecture Design Review', target: 'Month 2', note: 'Mid-term presentation with data flow diagrams & schemas', weight: 20 },
    { title: 'Core Model / Algorithmic Prototype', target: 'Month 3', note: 'Working functional baseline validated with evaluation metrics', weight: 25 },
    { title: 'Full-Stack Integration & UI Polish', target: 'Month 4', note: 'End-to-end API, client dashboard, and test suites', weight: 20 },
    { title: 'Dissertation Report & Viva Voce Defense', target: 'Month 5', note: 'Final evaluation defense with external university examiner', weight: 15 },
  ];

  // Calculate live progress
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / milestonesList.length) * 100);

  // Computed AI project scores based on active project or standards
  const feasibilityScore = activeProject ? 94 : 85;
  const innovationIndex = activeProject ? 96 : 88;
  const vivaReadinessScore = Math.min(95, 60 + progressPercent * 0.35);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Scholar Profile & Quick Mission Control Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1627] via-[#0f1d33] to-[#0c1322] border border-cyan-500/20 p-6 sm:p-8 shadow-xl shadow-cyan-950/20">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 via-slate-900 to-amber-500/20 border border-cyan-400/40 text-cyan-300 font-display font-bold text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-950/50">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-[#0b0f19] flex items-center justify-center text-[9px] text-slate-950 font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {currentUser?.name || 'Candidate Scholar'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 flex items-center gap-1">
                  <Award className="w-3 h-3 text-cyan-400" />
                  Senior Capstone Track
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
                  ABET / IEEE Aligned
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 flex items-center gap-2">
                <School className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  {currentUser?.degree || 'B.Tech in Computer Science & Engineering'} • {currentUser?.college || 'National Institute of Technology'} (Class of {currentUser?.graduationYear || '2025'})
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dashboard-generate-btn"
              onClick={onNavigateToGenerator}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Synthesize Ideas</span>
            </button>
            <button
              id="dashboard-mentor-btn"
              onClick={() => onNavigateToMentor(activeProject)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold text-xs border border-white/10 hover:border-cyan-500/40 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Consult Advisor Vance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Project Scores & Progress Metrics Widget (Highlighted prominently) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Feasibility Score */}
        <div className="p-5 rounded-2xl bg-[#0e1424]/80 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all shadow-lg shadow-black/40 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Feasibility Score
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              High
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tracking-tight">
              {feasibilityScore}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">9.4/10 Academic Viability</span>
          </div>
          {/* Progress gauge bar */}
          <div className="mt-3 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-700 shadow-[0_0_8px_#22d3ee]" 
              style={{ width: `${feasibilityScore}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Resource & computation within budget</p>
        </div>

        {/* Innovation Index */}
        <div className="p-5 rounded-2xl bg-[#0e1424]/80 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg shadow-black/40 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Innovation Index
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800/60">
              Tier A+
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tracking-tight">
              {innovationIndex}%
            </span>
            <span className="text-xs text-amber-400 font-medium">IEEE Distinctive</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700 shadow-[0_0_8px_#f59e0b]" 
              style={{ width: `${innovationIndex}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Differentiates from standard CRUD repos</p>
        </div>

        {/* Viva Defense Readiness */}
        <div className="p-5 rounded-2xl bg-[#0e1424]/80 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all shadow-lg shadow-black/40 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              Viva Voce Readiness
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              Committee
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tracking-tight">
              {Math.round(vivaReadinessScore)}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">{completedCount}/5 Milestones</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 shadow-[0_0_8px_#10b981]" 
              style={{ width: `${vivaReadinessScore}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Sample examiner Q&A grounded</p>
        </div>

        {/* Saved Repository count */}
        <div className="p-5 rounded-2xl bg-[#0e1424]/80 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all shadow-lg shadow-black/40 group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              Saved Blueprints
            </span>
            <button 
              onClick={onNavigateToSaved}
              className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tracking-tight">
              {savedProjects.length}
            </span>
            <span className="text-xs text-slate-400">Candidate specs</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 rounded-full" 
              style={{ width: `${Math.min(100, (savedProjects.length / 5) * 100)}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Saved across 4 disciplines</p>
        </div>
      </div>

      {/* 3. Active Capstone Spotlight & Detailed Phased Roadmap */}
      {activeProject ? (
        <div className="rounded-3xl bg-[#0d1424]/90 backdrop-blur-2xl border border-cyan-500/20 shadow-xl shadow-black/50 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                  Primary Capstone Track
                </span>
                <span className="text-xs font-mono text-slate-400">• {activeProject.domain}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                  {activeProject.estimatedTime}
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeProject.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
                {activeProject.tagline}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => onViewProjectDetails(activeProject)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Blueprint</span>
              </button>
              <button
                onClick={() => onNavigateToMentor(activeProject)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-950/50 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>Consult Mentor Vance</span>
              </button>
            </div>
          </div>

          {/* Phased Roadmap Timeline - Interactive with node connectors */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Phased Development Roadmap (12–16 Weeks)
              </h3>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                Semester Target: 4 Critical Phases
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {activeProject.developmentRoadmap.map((phase, idx) => (
                <div 
                  key={idx} 
                  className="relative p-4 rounded-2xl bg-[#11192e]/70 border border-white/[0.07] hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <span className="w-7 h-7 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                        0{idx + 1}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {phase.phase}
                    </p>
                    <div className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                      {phase.milestones.slice(0, 2).map((m, mI) => (
                        <div key={mI} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 font-bold shrink-0">•</span>
                          <span className="line-clamp-2">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono font-semibold text-amber-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">Deliverable: {phase.deliverables[0] || 'Phase Report'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approved Tech Stack Badges */}
          <div className="pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Approved Production Stack
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                ...activeProject.recommendedTechStack.backend,
                ...activeProject.recommendedTechStack.frontend,
                ...activeProject.recommendedTechStack.aiMl,
                ...activeProject.recommendedTechStack.database,
                ...activeProject.recommendedTechStack.devOps,
              ].map((t, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 rounded-lg bg-[#0b101c] text-slate-300 font-mono text-[11px] border border-white/[0.08] hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0e1424]/80 border border-white/[0.08] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/60">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">No Primary Capstone Selected Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Generate tailored project blueprints based on your domain. Save candidate blueprints and mark one as your selected capstone track.
          </p>
          <button
            onClick={onNavigateToGenerator}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Launch Idea Generator</span>
          </button>
        </div>
      )}

      {/* 4. University Capstone Review Milestones & Committee Checklist */}
      <div className="rounded-3xl bg-[#0e1424]/80 backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Capstone Review Milestones & Committee Checklist
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive checkpoints tracked directly against university semester guidelines.
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/60 self-start sm:self-auto">
            {progressPercent}% Semester Readiness
          </div>
        </div>

        <div className="space-y-2.5">
          {milestonesList.map((m, idx) => {
            const isDone = Boolean(completedMilestones[m.title]);
            return (
              <div
                key={idx}
                onClick={() => toggleMilestone(m.title)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-cyan-950/30 border-cyan-500/30 text-slate-200'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    isDone ? 'bg-cyan-500 text-slate-950' : 'border border-slate-600 bg-white/[0.04]'
                  }`}>
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-semibold ${isDone ? 'text-white' : 'text-slate-300'}`}>
                      {m.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{m.note}</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50 shrink-0">
                  {m.target}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
