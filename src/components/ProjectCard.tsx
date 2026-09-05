import React from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  Layers, 
  CheckCircle2,
  Award,
  Sparkles
} from 'lucide-react';
import type { ProjectIdea } from '../types';

interface ProjectCardProps {
  project: ProjectIdea;
  isSaved: boolean;
  onViewDetails: (project: ProjectIdea) => void;
  onToggleSave: (project: ProjectIdea) => void;
  onConsultMentor: (project: ProjectIdea) => void;
}

export function ProjectCard({
  project,
  isSaved,
  onViewDetails,
  onToggleSave,
  onConsultMentor,
}: ProjectCardProps) {
  const diffColors: Record<string, string> = {
    Beginner: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    Intermediate: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
    Advanced: 'bg-purple-950/70 text-purple-300 border-purple-800/60',
  };

  return (
    <div 
      id={`project-card-${project.id}`}
      className="group rounded-2xl bg-[#0e1424]/80 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 shadow-xl shadow-black/40 hover:shadow-cyan-950/30 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
    >
      {/* Subtle top ambient rim light on hover */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-400/50 transition-all duration-500" />

      <div className="p-5 sm:p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider truncate max-w-[210px]">
            {project.domain}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border whitespace-nowrap ${diffColors[project.difficulty] || diffColors.Intermediate}`}>
              {project.difficulty}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.07] whitespace-nowrap">
              <Clock className="w-3 h-3 text-cyan-400" />
              {project.estimatedTime}
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 
          onClick={() => onViewDetails(project)}
          className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer leading-snug line-clamp-2"
        >
          {project.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {project.tagline}
        </p>

        {/* Problem Statement snippet */}
        <div className="mt-4 p-3 rounded-xl bg-[#080d1a] border border-white/[0.06] text-xs text-slate-300 line-clamp-3 leading-relaxed">
          <span className="font-mono font-bold text-amber-400">Problem: </span>
          {project.problemStatement}
        </div>

        {/* Key Deliverables Preview */}
        <div className="mt-4 space-y-1.5">
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            Key Academic Milestones
          </p>
          {project.keyFeatures.slice(0, 2).map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{f}</span>
            </div>
          ))}
        </div>

        {/* Viva Defense Teaser */}
        {project.vivaDefenseQuestions && project.vivaDefenseQuestions.length > 0 && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 flex items-start gap-2 text-[11px] text-amber-200">
            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="line-clamp-1">
              <span className="font-semibold text-amber-300 font-mono">Viva Defense: </span>
              {project.vivaDefenseQuestions[0].question}
            </div>
          </div>
        )}

        {/* Tech Stack Chips */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Layers className="w-3 h-3 text-cyan-400" />
            Architecture Stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              ...project.recommendedTechStack.backend.slice(0, 2),
              ...project.recommendedTechStack.frontend.slice(0, 1),
              ...project.recommendedTechStack.aiMl.slice(0, 2),
            ].map((tech, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 text-[10px] font-mono border border-white/[0.07] whitespace-nowrap hover:border-cyan-500/30 transition-colors"
              >
                {tech}
              </span>
            ))}
            <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 self-center">
              +more
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#080d18]/90 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <button
          id={`save-project-btn-${project.id}`}
          type="button"
          onClick={() => onToggleSave(project)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            isSaved
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
              <span>Save</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            id={`mentor-project-btn-${project.id}`}
            type="button"
            onClick={() => onConsultMentor(project)}
            title="Ask AI Mentor about this project"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/60 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Consult Mentor</span>
          </button>

          <button
            id={`view-details-btn-${project.id}`}
            type="button"
            onClick={() => onViewDetails(project)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Blueprint</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
