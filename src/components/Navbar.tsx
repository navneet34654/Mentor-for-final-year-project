import { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Bookmark, 
  MessageSquare, 
  LayoutDashboard, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Compass,
  Zap
} from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  activeTab: 'landing' | 'generator' | 'saved' | 'mentor' | 'dashboard';
  setActiveTab: (tab: 'landing' | 'generator' | 'saved' | 'mentor' | 'dashboard') => void;
  currentUser: User | null;
  savedCount: number;
  onOpenAuth: () => void;
  onDemoLogin: () => void;
  onLogout: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  savedCount,
  onOpenAuth,
  onDemoLogin,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div 
            id="brand-logo-button"
            onClick={() => setActiveTab(currentUser ? 'dashboard' : 'landing')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center border border-slate-800 shadow-xs group-hover:bg-slate-800 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-slate-900 text-base tracking-tight">
                  ProjectMentor
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">
                  IEEE • ABET
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block leading-none mt-0.5">
                Capstone & Dissertation Advisor
              </p>
            </div>
          </div>

          {/* Desktop Navigation Segmented Controls */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            <button
              id="nav-tab-landing"
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'landing'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Overview
            </button>

            <button
              id="nav-tab-generator"
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'generator'
                  ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Generator
            </button>

            <button
              id="nav-tab-saved"
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'saved'
                  ? 'bg-white text-amber-900 shadow-xs border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              Saved Projects
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-mentor"
              onClick={() => setActiveTab('mentor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'mentor'
                  ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              AI Mentor
            </button>

            {currentUser && (
              <button
                id="nav-tab-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-700" />
                Dashboard
              </button>
            )}
          </nav>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <button 
                  id="user-profile-badge"
                  onClick={() => setActiveTab('dashboard')} 
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-[11px] font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-slate-800 whitespace-nowrap">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[110px]">{currentUser.degree || 'Student'}</p>
                  </div>
                </button>

                <button
                  id="logout-button"
                  onClick={onLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="demo-student-login-nav-button"
                  onClick={onDemoLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/70 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  Demo Student
                </button>
                <button
                  id="open-login-modal-button"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            {!currentUser && (
              <button
                onClick={onDemoLogin}
                className="px-2.5 py-1 rounded-md border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold"
              >
                Demo
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5">
          <button
            onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'landing' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
            }`}
          >
            <Compass className="w-4 h-4" />
            Overview & Vision
          </button>
          <button
            onClick={() => { setActiveTab('generator'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'generator' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Project Generator
          </button>
          <button
            onClick={() => { setActiveTab('saved'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'saved' ? 'bg-amber-50 text-amber-900' : 'text-slate-600'
            }`}
          >
            <span className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-amber-600" />
              Saved Projects
            </span>
            {savedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('mentor'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'mentor' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            AI Mentor Chat
          </button>
          {currentUser && (
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-700" />
              Student Dashboard
            </button>
          )}

          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 text-xs text-rose-600 border border-rose-200 rounded-md bg-rose-50 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center rounded-xl bg-slate-900 text-white text-xs font-semibold"
                >
                  Sign In / Create Account
                </button>
                <button
                  onClick={() => { onDemoLogin(); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-center rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold"
                >
                  Sign In as Demo Student
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
