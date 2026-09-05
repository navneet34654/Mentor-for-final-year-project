import { 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  MessageSquareCode, 
  FileCheck2, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  Stethoscope, 
  Cloud, 
  Coins, 
  Bot, 
  Zap,
  GraduationCap,
  Award,
  Terminal,
  Compass,
  Activity,
  Code2
} from 'lucide-react';

interface LandingPageProps {
  onStartGenerating: () => void;
  onExploreSaved: () => void;
  onDemoLogin: () => void;
}

export function LandingPage({
  onStartGenerating,
  onExploreSaved,
  onDemoLogin,
}: LandingPageProps) {
  const domains = [
    { name: 'Artificial Intelligence & ML', icon: Bot, count: '35+ Blueprints' },
    { name: 'Healthcare & Clinical Informatics', icon: Stethoscope, count: '18+ Blueprints' },
    { name: 'Cloud & Distributed Systems', icon: Cloud, count: '22+ Blueprints' },
    { name: 'Cybersecurity & Auditing', icon: ShieldCheck, count: '15+ Blueprints' },
    { name: 'IoT & Edge Computing', icon: Cpu, count: '19+ Blueprints' },
    { name: 'FinTech & Applied Blockchain', icon: Coins, count: '14+ Blueprints' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e1628] via-[#0c1220] to-[#090d16] border border-cyan-500/20 p-6 sm:p-12 shadow-2xl shadow-black/80 text-center">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-mono font-bold mb-6 border border-cyan-800/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>ABET & IEEE Curriculum Aligned Capstone Intelligence</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight sm:leading-tight">
            Engineering & CS Final-Year Project Mentor
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Move beyond generic to-do lists and standard CRUD clones. Generate academically rigorous project blueprints complete with <strong className="text-cyan-300 font-semibold">12–16 week phased development roadmaps</strong>, <strong className="text-amber-300 font-semibold">production tech stacks</strong>, and <strong className="text-white font-semibold">Viva Voce defense coaching</strong>.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="hero-start-generator-button"
              onClick={onStartGenerating}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-950/60 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Synthesize Capstone Blueprints</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-demo-login-button"
              onClick={onDemoLogin}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Instant Demo Student Profile</span>
            </button>

            <button
              id="hero-explore-saved-button"
              onClick={onExploreSaved}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Inspect Sample Spec
            </button>
          </div>

          {/* Trust benchmarks */}
          <div className="mt-10 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-mono font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>IEEE & ABET Rubrics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Gemini 3.8 Flash Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Viva Defense Simulation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Phased Milestone Deliverables</span>
            </div>
          </div>
        </div>

        {/* Interactive Specimen Box */}
        <div className="relative z-10 mt-10 max-w-4xl mx-auto rounded-2xl bg-[#080d19]/90 border border-cyan-500/20 p-5 sm:p-6 text-left shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              <span className="font-mono text-xs font-bold text-cyan-300">BLUEPRINT SPECIMEN: MED-2025-09</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                A+ Caliber
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">Duration: 14 Weeks • Difficulty: Intermediate</span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <h3 className="font-display font-bold text-white text-base">
                Multimodal Clinical Diagnostic Assistant with Explainable AI (Grad-CAM)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Addresses radiologist fatigue by fusing chest X-Ray vision transformers (DeiT) with clinical EHR text embeddings, generating heatmaps highlighting pulmonary nodules with quantifiable AUROC benchmarking.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['PyTorch', 'FastAPI', 'React', 'TorchXRayVision', 'Docker', 'Grad-CAM'].map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-white/[0.05] text-cyan-300 text-[11px] font-mono border border-white/[0.08]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[#0e1628] border border-white/[0.08] p-3 text-xs space-y-2">
              <span className="font-mono font-bold text-amber-300 flex items-center gap-1.5 text-[11px]">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Examiner Defense Prep
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                "How do you mitigate distribution shift when evaluating on external hospital PACS data?"
              </p>
              <div className="text-[10px] font-mono text-cyan-400 pt-1 border-t border-white/[0.06]">
                Includes sample model response & mathematical derivation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Domains Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Supported Academic Disciplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Calibrated for undergraduate and master's degree criteria across major engineering faculties.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {domains.map((dom, idx) => {
            const Icon = dom.icon;
            return (
              <div
                key={idx}
                onClick={onStartGenerating}
                className="p-5 rounded-2xl bg-[#0e1424]/80 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 shadow-lg shadow-black/40 hover:shadow-cyan-950/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/50">
                    {dom.count}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                  {dom.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  SRS blueprints, architectural benchmarks, and defense Q&A.
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
