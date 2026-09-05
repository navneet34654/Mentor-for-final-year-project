import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Bookmark, 
  MessageSquare, 
  LayoutDashboard, 
  LogOut, 
  Compass, 
  Zap, 
  CheckCircle2, 
  User as UserIcon,
  Award,
  ChevronRight,
  TrendingUp,
  Database
} from 'lucide-react';
import type { User, ProjectIdea } from '../types';

interface SidebarProps {
  activeTab: 'landing' | 'generator' | 'saved' | 'mentor' | 'dashboard';
  setActiveTab: (tab: 'landing' | 'generator' | 'saved' | 'mentor' | 'dashboard') => void;
  currentUser: User | null;
  savedCount: number;
  activeProject: ProjectIdea | null;
  onOpenAuth: () => void;
  onDemoLogin: () => void;
  onLogout: () => void;
  onConsultMentor: (project: ProjectIdea) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: 'landing' | 'generator' | 'saved' | 'mentor' | 'dashboard';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
  badgeColor?: string;
  description: string;
  requiresAuth: boolean;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  savedCount,
  activeProject,
  onOpenAuth,
  onDemoLogin,
  onLogout,
  onConsultMentor,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Scores, roadmap & progress',
      requiresAuth: false,
    },
    {
      id: 'generator',
      label: 'AI Generator',
      icon: Sparkles,
      badge: 'Gemini',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
      description: 'Synthesize capstone ideas',
      requiresAuth: false,
    },
    {
      id: 'saved',
      label: 'Saved Blueprints',
      icon: Bookmark,
      badge: savedCount > 0 ? String(savedCount) : null,
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      description: 'Candidate repository',
      requiresAuth: false,
    },
    {
      id: 'mentor',
      label: 'AI Mentor Console',
      icon: MessageSquare,
      badge: 'Live',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      description: 'Viva & architecture coach',
      requiresAuth: false,
    },
    {
      id: 'landing',
      label: 'Curriculum Guide',
      icon: Compass,
      badge: 'IEEE',
      badgeColor: 'text-slate-400 bg-slate-800/60 border-slate-700/60',
      description: 'Standards & rubric overview',
      requiresAuth: false,
    },
  ] as const;

  function handleNavClick(tabId: typeof activeTab) {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0b0f19] border-r border-white/[0.07] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl shadow-cyan-950/50' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Brand Identity */}
        <div>
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div 
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-amber-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-950/60 group-hover:border-cyan-400/60 transition-all">
                <GraduationCap className="w-5 h-5 text-cyan-400 group-hover:scale-105 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-[#0b0f19] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-white text-base tracking-tight">
                    ProjectMentor
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
                  Capstone Intelligence Suite
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Platform Modules
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 via-cyan-500/10 to-transparent text-white border border-cyan-500/30 shadow-md shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  {/* Active glowing indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    <div className="text-left">
                      <div className="leading-none">{item.label}</div>
                      <div className="text-[10px] font-normal text-slate-500 mt-0.5 leading-none">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${item.badgeColor || 'text-slate-400 bg-slate-800/80 border-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Active Project Quick Widget */}
          {activeProject && (
            <div className="mx-3 mt-3 p-3.5 rounded-2xl bg-[#0f172a]/70 border border-cyan-500/20 shadow-inner">
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Active Capstone
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50">
                  Phase 2 of 4
                </span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">
                {activeProject.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                {activeProject.domain}
              </p>

              {/* Progress bar */}
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Semester Progress</span>
                  <span className="text-cyan-300 font-bold">50%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 rounded-full w-1/2" />
                </div>
              </div>

              {/* Quick AI Mentor Consultation button */}
              <button
                onClick={() => {
                  onConsultMentor(activeProject);
                  setIsMobileOpen(false);
                }}
                className="mt-3 w-full py-1.5 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-[11px] font-semibold border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3 h-3 text-cyan-400" />
                <span>Ask Advisor Vance</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Section: User Profile & Firebase Connectivity */}
        <div className="p-3 border-t border-white/[0.06] bg-[#080b13]/80 space-y-2">
          {/* Cloud Sync Status Indicator */}
          <div className="flex items-center justify-between px-2 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              Firestore & Gemini Synced
            </span>
            <span className="text-slate-600">v2.5</span>
          </div>

          {currentUser ? (
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-cyan-500/20 border border-amber-400/40 text-amber-300 font-display font-bold text-sm flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {currentUser.degree || 'Computer Science'} ({currentUser.graduationYear || '2025'})
                  </p>
                </div>
              </div>

              <button
                id="sidebar-logout-button"
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <button
                id="sidebar-demo-login-btn"
                onClick={onDemoLogin}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Instant Demo Student</span>
              </button>

              <button
                id="sidebar-signin-btn"
                onClick={onOpenAuth}
                className="w-full py-1.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
