import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  BookmarkCheck, 
  MessageSquare, 
  Clock, 
  Layers, 
  Database, 
  Award, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Calendar,
  Code2,
  FileText,
  AlertCircle
} from 'lucide-react';
import type { ProjectIdea } from '../types';

interface ProjectDetailModalProps {
  project: ProjectIdea | null;
  isOpen: boolean;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (project: ProjectIdea) => void;
  onConsultMentor: (project: ProjectIdea) => void;
  onUpdateNotes?: (projectId: string, notes: string, status?: any) => void;
}

export function ProjectDetailModal({
  project,
  isOpen,
  isSaved,
  onClose,
  onToggleSave,
  onConsultMentor,
}: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'roadmap' | 'viva' | 'datasets'>('overview');

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="project-detail-modal-dialog"
        className="relative w-full max-w-4xl bg-[#0c1220] rounded-3xl shadow-2xl shadow-cyan-950/80 border border-cyan-500/30 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#080d19] border-b border-white/[0.08] relative shrink-0">
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/80">
              {project.domain}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.07]">
              <Clock className="w-3 h-3 text-cyan-400" />
              {project.estimatedTime}
            </span>
            <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              {project.difficulty} Level
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight pr-8">
            {project.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            {project.tagline}
          </p>

          {/* Tab Navigation */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: 'Overview & Objectives', icon: FileText },
              { id: 'architecture', label: 'Tech Architecture', icon: Layers },
              { id: 'roadmap', label: 'Phased Roadmap', icon: Calendar },
              { id: 'viva', label: 'Viva Voce Defense', icon: Award },
              { id: 'datasets', label: 'Datasets & APIs', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Academic Problem Statement
                </h3>
                <div className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08] text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {project.problemStatement}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
                  Core Engineering Scope & Deliverables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.keyFeatures.map((feat, i) => (
                    <div 
                      key={i} 
                      className="p-3.5 rounded-xl bg-[#090e1b] border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {project.futureImprovements && project.futureImprovements.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Future Research & Improvements
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.futureImprovements.map((req, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 font-mono text-xs border border-white/[0.07]">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08]">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
                    Backend / Application Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.recommendedTechStack.backend.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-950/40 text-cyan-300 text-xs font-mono border border-cyan-800/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08]">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
                    Frontend / Presentation UI
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.recommendedTechStack.frontend.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-950/40 text-cyan-300 text-xs font-mono border border-cyan-800/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08]">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2">
                    AI / ML & Algorithmic Pipeline
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.recommendedTechStack.aiMl.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-300 text-xs font-mono border border-amber-800/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08]">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Database & Storage Persistence
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.recommendedTechStack.database.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-200 text-xs font-mono border border-white/[0.08]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {project.aiMlIntegration && (
                <div className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    AI / ML Architecture & Algorithmic Design
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {project.aiMlIntegration.overview}
                  </p>
                  {project.aiMlIntegration.algorithmsOrModels && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.aiMlIntegration.algorithmsOrModels.map((algo, aIdx) => (
                        <span key={aIdx} className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 text-xs font-mono border border-cyan-800/50">
                          {algo}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              {project.developmentRoadmap.map((phase, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08]">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-display font-bold text-sm text-white">
                      Phase 0{idx + 1}: {phase.phase}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/60">
                      {phase.duration}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {phase.milestones.map((m, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-amber-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Deliverable: {phase.deliverables.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: VIVA DEFENSE */}
          {activeTab === 'viva' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
                <p className="font-bold text-amber-300 mb-1">External Examiner Viva Voce Simulation</p>
                Anticipated defense inquiries formulated according to ABET & IEEE senior design review rubrics.
              </div>

              {project.vivaDefenseQuestions?.map((vq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08] space-y-2">
                  <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-white">
                    <span className="text-amber-400 font-mono">Q{idx + 1}:</span>
                    <span>{vq.question}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs text-slate-300 leading-relaxed">
                    <span className="font-mono text-cyan-400 font-bold">Recommended Model Defense: </span>
                    {vq.sampleAnswerHint}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: DATASETS */}
          {activeTab === 'datasets' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08] space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Recommended Open Datasets & Benchmarks
                </h4>
                <div className="space-y-2">
                  {project.aiMlIntegration?.datasetSuggestions?.map((ds, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-200 flex items-center justify-between">
                      <span className="font-mono">{ds}</span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                        Kaggle / Open ML
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#090e1b] border border-white/[0.08] space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Academic Evaluation Metrics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.aiMlIntegration?.evaluationMetrics?.map((metric, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-300 text-xs font-mono border border-amber-800/50">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#080d19] border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => onToggleSave(project)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isSaved
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-white/[0.05] text-slate-300 border border-white/[0.1] hover:bg-white/[0.1]'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved in Repository' : 'Save to Repository'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onConsultMentor(project);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-950/50 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Consult Advisor Vance</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
