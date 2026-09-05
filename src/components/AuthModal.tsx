import React, { useState } from 'react';
import { X, Lock, Mail, User, School, Calendar, Eye, EyeOff, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { api } from '../api';
import type { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech in Computer Science');
  const [graduationYear, setGraduationYear] = useState('2025');

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login({ email, password });
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.register({
          name,
          email,
          password,
          college,
          degree,
          graduationYear,
        });
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.demoLogin();
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="auth-modal-dialog"
        className="relative w-full max-w-md bg-[#0c1220] rounded-3xl shadow-2xl shadow-cyan-950/80 border border-cyan-500/30 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#080d19] p-6 text-white text-center relative border-b border-white/[0.08]">
          <button
            id="close-auth-modal-button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-amber-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-md shadow-cyan-950/50">
            <Sparkles className="w-5 h-5" />
          </div>
          
          <h2 className="font-display text-xl font-bold tracking-tight text-white">
            {mode === 'login' ? 'Student & Scholar Sign In' : 'Create Scholar Profile'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {mode === 'login' 
              ? 'Access saved blueprints, viva defense notes & mentor chats' 
              : 'Setup your graduation profile for tailored IEEE project recommendations'}
          </p>
        </div>

        {/* Mode switcher segmented control */}
        <div className="p-3 bg-[#090e1b] border-b border-white/[0.06]">
          <div className="flex bg-[#050811] p-1 rounded-xl text-xs font-semibold border border-white/[0.06]">
            <button
              id="tab-select-login"
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-select-register"
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
                mode === 'register' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#080d1a] border border-white/[0.1] text-white focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">University / College</label>
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. NIT Trichy"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#080d1a] border border-white/[0.1] text-white focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      required
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      placeholder="2025"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#080d1a] border border-white/[0.1] text-white focus:outline-hidden focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Degree Program</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="B.Tech Computer Science"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#080d1a] border border-white/[0.1] text-white focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">University / Scholar Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#080d1a] border border-white/[0.1] text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-xl bg-[#080d1a] border border-white/[0.1] text-white focus:outline-hidden focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/60 transition-all cursor-pointer mt-2"
            >
              {loading ? 'Validating...' : mode === 'login' ? 'Sign In' : 'Create Scholar Account'}
            </button>
          </form>

          {/* Quick Demo Student Button */}
          <div className="pt-2 border-t border-white/[0.08]">
            <button
              id="auth-modal-demo-login-btn"
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>Use Instant Demo Student Profile</span>
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-2">
              Auto-fills credentials for NIT Trichy B.Tech Computer Science Scholar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
