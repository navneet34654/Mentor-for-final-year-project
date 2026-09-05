import React from 'react';
import { 
  Menu, 
  Sparkles, 
  Bookmark, 
  MessageSquare, 
  Zap, 
  Search, 
  Bell, 
  ShieldCheck,
  Terminal,
  Layers,
  GraduationCap
} from 'lucide-react';
import type { User, ProjectIdea } from '../types';

interface TopBarProps {
  activeTab: 'landing' | 'generator' | 'saved' | 'mentor' | 'dashboard';
  setActiveTab: (tab: 'landing' | 'generator' | 'saved' | 'mentor' | 'dashboard') => void;
  currentUser: User | null;
  savedCount: number;
  onOpenMobileSidebar: () => void;
  onOpenAuth: () => void;
  onDemoLogin: () => void;
}

export function TopBar({
  activeTab,
  setActiveTab,
  currentUser,
  savedCount,
  onOpenMobileSidebar,
  onOpenAuth,
  onDemoLogin,
}: TopBarProps) {
  const titles: Record<string, { title: string; subtitle: string; tag: string }> = {
    dashboard: {
      title: 'Capstone Dashboard & Metrics',
      subtitle: 'Project feasibility, phased roadmap, and viva defense scores',
      tag: 'AB-2025 Standard',
    },
    generator: {
      title: 'AI Capstone Idea Generator',
      subtitle: 'Synthesize production-grade final year project blueprints with Gemini',
      tag: 'Neural Synthesis',
    },
    saved: {
      title: 'Candidate Repository',
      subtitle: 'Review committee approvals, status tags, and advisor notes',
      tag: `${savedCount} Blueprints`,
    },
    mentor: {
      title: 'AI Capstone Mentor Console',
      subtitle: 'Direct technical advising, viva simulation, and architecture audits',
      tag: 'Prof. Vance AI',
    },
    landing: {
      title: 'Curriculum Standards & Rubrics',
      subtitle: 'ABET & IEEE accreditation guidelines for computer science capstones',
      tag: 'Curriculum Guide',
    },
  };

  const currentMeta = titles[activeTab] || titles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-[#090d16]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Drawer Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle-btn"
          onClick={onOpenMobileSidebar}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 hidden sm:inline">ProjectMentor</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-cyan-400 font-semibold uppercase tracking-wider">{activeTab}</span>
          <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-400 border border-white/[0.06]">
            {currentMeta.tag}
          </span>
        </div>
      </div>

      {/* Center/Right: Status pill + Quick Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* System Health Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f172a]/70 border border-cyan-500/20 text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
          <span className="text-slate-300 font-mono text-[11px]">Gemini 3.8 Flash</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-mono text-[11px] font-semibold">Firestore Active</span>
        </div>

        {/* Quick Launch Generator */}
        {activeTab !== 'generator' && (
          <button
            onClick={() => setActiveTab('generator')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 hover:from-cyan-500/30 hover:to-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">Synthesize Ideas</span>
          </button>
        )}

        {/* User quick pill if guest */}
        {!currentUser && (
          <button
            onClick={onDemoLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Demo Student</span>
          </button>
        )}

        {/* Saved Count Shortcut */}
        <button
          onClick={() => setActiveTab('saved')}
          title="Saved Blueprints"
          className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-mono font-extrabold text-[10px] flex items-center justify-center shadow-xs">
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
