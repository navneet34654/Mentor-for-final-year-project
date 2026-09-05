import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Stethoscope, 
  ShieldCheck, 
  Cloud, 
  Cpu, 
  Globe, 
  Coins, 
  Smartphone, 
  RotateCcw,
  Zap,
  Check,
  AlertCircle,
  GraduationCap,
  Layers,
  Clock,
  Users
} from 'lucide-react';
import type { ProjectGenerationRequest } from '../types';

interface ProjectGeneratorFormProps {
  onGenerate: (req: ProjectGenerationRequest) => Promise<void>;
  isLoading: boolean;
}

const DOMAINS = [
  { id: 'Artificial Intelligence & Machine Learning', name: 'AI & Machine Learning', icon: Bot },
  { id: 'Healthcare & Clinical Informatics', name: 'Healthcare & BioTech', icon: Stethoscope },
  { id: 'Cybersecurity & Auditing', name: 'Cybersecurity & Privacy', icon: ShieldCheck },
  { id: 'Cloud, DevOps & Distributed Systems', name: 'Cloud & Distributed', icon: Cloud },
  { id: 'IoT & Edge Computing', name: 'IoT & Embedded Edge', icon: Cpu },
  { id: 'Full Stack & Enterprise Software', name: 'Full-Stack Web & SaaS', icon: Globe },
  { id: 'FinTech & Applied Blockchain', name: 'FinTech & Cryptography', icon: Coins },
  { id: 'Mobile & Pervasive Computing', name: 'Mobile App Engineering', icon: Smartphone },
];

const POPULAR_SKILLS = [
  'Python', 'React', 'PyTorch', 'Node.js', 'FastAPI', 'Docker', 
  'PostgreSQL', 'OpenCV', 'TensorFlow', 'TypeScript', 'Next.js', 
  'MongoDB', 'Scikit-learn', 'Kubernetes', 'Flutter', 'Tailwind CSS'
];

const PRESETS = [
  {
    name: 'Clinical AI Assistant',
    domain: 'Healthcare & Clinical Informatics',
    skills: 'Python, PyTorch, FastAPI, React, Docker',
    interests: 'Multimodal medical imaging diagnostic assistance and clinical note summarization with Grad-CAM explainability',
    preferredTech: 'FastAPI + React + PyTorch',
    difficulty: 'Intermediate'
  },
  {
    name: 'Smart Contract Auditor',
    domain: 'Cybersecurity & Auditing',
    skills: 'Python, Node.js, React, AST Parsing, Solidity',
    interests: 'Automated vulnerability detection for EVM smart contracts using static analysis and LLM verification',
    preferredTech: 'FastAPI + Next.js + PyTorch',
    difficulty: 'Advanced'
  },
  {
    name: 'Edge Sign Language Translator',
    domain: 'Artificial Intelligence & Machine Learning',
    skills: 'Python, OpenCV, MediaPipe, React, WebSockets',
    interests: 'Real-time gesture translation from webcam video stream to synthesized speech running locally at the edge',
    preferredTech: 'MediaPipe + ONNX Runtime Web + React',
    difficulty: 'Intermediate'
  },
  {
    name: 'Green Cloud FinOps Optimizer',
    domain: 'Cloud, DevOps & Distributed Systems',
    skills: 'Go, Python, Docker, Kubernetes, Prometheus',
    interests: 'Predictive workload autoscaling for Kubernetes clusters to minimize electricity consumption and carbon footprint',
    preferredTech: 'Kubernetes + Prometheus + TimescaleDB',
    difficulty: 'Advanced'
  }
];

export function ProjectGeneratorForm({ onGenerate, isLoading }: ProjectGeneratorFormProps) {
  const [domain, setDomain] = useState<string>('Artificial Intelligence & Machine Learning');
  const [skills, setSkills] = useState<string>('Python, React, PyTorch, FastAPI');
  const [interests, setInterests] = useState<string>('Applied deep learning, multimodal systems, and clinical healthcare diagnostics');
  const [preferredTech, setPreferredTech] = useState<string>('FastAPI (Python) backend + React frontend');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [timeframe, setTimeframe] = useState<string>('12-14 weeks');
  const [teamSize, setTeamSize] = useState<string>('2-3 students');
  const [validationError, setValidationError] = useState<string | null>(null);

  function toggleSkill(skill: string) {
    const list = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (list.includes(skill)) {
      setSkills(list.filter(s => s !== skill).join(', '));
    } else {
      setSkills([...list, skill].join(', '));
    }
  }

  function applyPreset(preset: typeof PRESETS[0]) {
    setDomain(preset.domain);
    setSkills(preset.skills);
    setInterests(preset.interests);
    setPreferredTech(preset.preferredTech);
    setDifficulty(preset.difficulty);
    setValidationError(null);
  }

  function handleReset() {
    setDomain('Artificial Intelligence & Machine Learning');
    setSkills('');
    setInterests('');
    setPreferredTech('');
    setDifficulty('Intermediate');
    setTimeframe('12-14 weeks');
    setTeamSize('2-3 students');
    setValidationError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) {
      setValidationError('Please select a project domain.');
      return;
    }
    if (!skills.trim() && !interests.trim()) {
      setValidationError('Please specify at least your current skills or topics of interest.');
      return;
    }

    setValidationError(null);
    await onGenerate({
      domain,
      skills,
      interests,
      preferredTech,
      difficulty,
      timeframe,
      teamSize,
    });
  }

  const selectedSkillsArray = skills.split(',').map(s => s.trim().toLowerCase());

  return (
    <div className="rounded-3xl bg-[#0d1424]/90 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl shadow-black/60 p-6 sm:p-8 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-mono font-bold mb-2 border border-cyan-800/80 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Capstone Synthesis Engine</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Design Your Final-Year Project Blueprint
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Specify your technical skills and domain. Gemini will synthesize 4 production-grade project blueprints with phased semester roadmaps, datasets, and viva defense guidance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Presets Bar */}
      <div className="relative z-10 pt-5 pb-2">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            High-Impact Academic Presets (Click to autofill)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-medium border border-white/[0.08] transition-all cursor-pointer whitespace-nowrap"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div className="relative z-10 mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-6">
        {/* Domain Selection Grid */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3">
            1. Select Academic & Engineering Domain <span className="text-cyan-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DOMAINS.map((d) => {
              const Icon = d.icon;
              const isSelected = domain === d.id;
              return (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 border-cyan-400/80 text-white shadow-lg shadow-cyan-950/60'
                      : 'bg-[#11192e]/60 border-white/[0.07] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-white/[0.05] text-slate-400 group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold leading-tight line-clamp-2">
                    {d.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Skills & Quick Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
              2. Student Team Technical Skills <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Python, PyTorch, React, Docker, FastAPI"
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-[#090e1a] border border-white/[0.1] focus:outline-hidden focus:border-cyan-400 text-white placeholder-slate-500 transition-colors"
            />
            
            {/* Quick Skill Chips */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.map((sk) => {
                const isPicked = selectedSkillsArray.includes(sk.toLowerCase());
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      isPicked
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-white/[0.04] text-slate-400 border border-white/[0.07] hover:text-slate-200'
                    }`}
                  >
                    {isPicked ? `✓ ${sk}` : `+ ${sk}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
              3. Specific Interests / Application Area
            </label>
            <textarea
              rows={3}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Healthcare diagnostics, automated code auditing, edge robotics, real-time audio translation..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#090e1a] border border-white/[0.1] focus:outline-hidden focus:border-cyan-400 text-white placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Difficulty, Timeframe, Tech Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Academic Difficulty
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#090e1a] border border-white/[0.1]">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                    difficulty === lvl
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Duration / Timeline
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#090e1a] border border-white/[0.1] text-white focus:outline-hidden focus:border-cyan-400"
            >
              <option value="8-10 weeks">8 - 10 Weeks (Mini-Project)</option>
              <option value="12-14 weeks">12 - 14 Weeks (Standard Semester)</option>
              <option value="16-20 weeks">16 - 20 Weeks (Two-Semester Thesis)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              Team Composition
            </label>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#090e1a] border border-white/[0.1] text-white focus:outline-hidden focus:border-cyan-400"
            >
              <option value="1 student">Individual Scholar (Solo)</option>
              <option value="2-3 students">2 - 3 Students (Recommended)</option>
              <option value="4 students">4 Students (Comprehensive)</option>
            </select>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>All generated proposals conform to standard IEEE Dissertation and SRS formats.</span>
          </div>

          <button
            id="synthesize-blueprints-submit-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-cyan-950/60 cursor-pointer ${
              isLoading
                ? 'bg-cyan-600/50 cursor-wait'
                : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 hover:scale-[1.02]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Academic Blueprints...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Synthesize 4 Project Blueprints</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
