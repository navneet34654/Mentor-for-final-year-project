import { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  MessageSquare, 
  ExternalLink, 
  Filter, 
  Sparkles, 
  Calendar, 
  Clock, 
  Layers, 
  FileText,
  Search,
  CheckCircle2,
  Award,
  Edit3
} from 'lucide-react';
import type { ProjectIdea } from '../types';

interface SavedProjectsViewProps {
  savedProjects: ProjectIdea[];
  onViewDetails: (project: ProjectIdea) => void;
  onConsultMentor: (project: ProjectIdea) => void;
  onDeleteProject: (projectId: string) => void;
  onUpdateProject: (projectId: string, updates: Partial<ProjectIdea>) => void;
  onNavigateToGenerator: () => void;
}

export function SavedProjectsView({
  savedProjects,
  onViewDetails,
  onConsultMentor,
  onDeleteProject,
  onUpdateProject,
  onNavigateToGenerator,
}: SavedProjectsViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');

  const filteredProjects = savedProjects.filter((p) => {
    const matchesStatus = filterStatus === 'all' || (p.status || 'considering') === filterStatus;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColors: Record<string, string> = {
    considering: 'bg-slate-800 text-slate-300 border-slate-700',
    selected: 'bg-cyan-950 text-cyan-300 border-cyan-800 font-bold',
    'in-progress': 'bg-indigo-950 text-indigo-300 border-indigo-800 font-bold',
    completed: 'bg-emerald-950 text-emerald-300 border-emerald-800 font-bold',
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-[#0d1424]/90 backdrop-blur-xl border border-cyan-500/20 p-6 sm:p-8 shadow-xl shadow-black/50">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 text-xs font-mono font-bold mb-2 border border-amber-800/80">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Candidate Capstone Repository</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Saved Project Blueprints ({savedProjects.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Track committee review statuses, save advisor notes, and run dedicated AI mentor consultations for each candidate proposal.
          </p>
        </div>

        <button
          onClick={onNavigateToGenerator}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-950/50 transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Generate More Ideas</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0e1424]/80 backdrop-blur-xl border border-white/[0.08] shadow-lg flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['all', 'considering', 'selected', 'in-progress', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-xl capitalize transition-all whitespace-nowrap text-xs cursor-pointer ${
                  filterStatus === st
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {st.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, domain, stack..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-white/[0.1] bg-[#090d18] text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-3xl bg-[#0e1424]/50 border border-dashed border-white/[0.1] p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/50 text-amber-400 border border-amber-800/50 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-display text-base font-bold text-white">No project blueprints found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {savedProjects.length === 0
              ? 'You have not saved any project ideas yet. Generate ideas and click "Save" to build your capstone portfolio.'
              : 'Try modifying your filter or search query.'}
          </p>
          <button
            onClick={onNavigateToGenerator}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Explore & Generate Ideas</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const currentStatus = project.status || 'considering';
            const isEditingNotes = editingNotesId === project.id;

            return (
              <div
                key={project.id}
                id={`saved-item-${project.id}`}
                className="rounded-2xl bg-[#0e1424]/90 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/30 shadow-xl shadow-black/40 p-5 sm:p-6 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        {project.domain}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {project.estimatedTime}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.07]">
                        {project.difficulty}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onViewDetails(project)}
                      className="font-display text-lg font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Status Dropdown & Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <select
                      value={currentStatus}
                      onChange={(e) => onUpdateProject(project.id, { status: e.target.value as any })}
                      className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-xl border transition-colors cursor-pointer ${statusColors[currentStatus] || statusColors.considering}`}
                    >
                      <option value="considering">Status: Considering</option>
                      <option value="selected">Status: Selected (Primary)</option>
                      <option value="in-progress">Status: In Progress</option>
                      <option value="completed">Status: Completed</option>
                    </select>

                    <button
                      onClick={() => onConsultMentor(project)}
                      className="p-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 transition-colors cursor-pointer"
                      title="Consult AI Mentor"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onViewDetails(project)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Blueprint</span>
                    </button>

                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove from Repository"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Student / Advisor Remarks Section */}
                <div className="mt-4 pt-2">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      Advisor Remarks & Student Notes
                    </span>
                    {!isEditingNotes && (
                      <button
                        onClick={() => {
                          setEditingNotesId(project.id);
                          setNotesDraft(project.studentNotes || '');
                        }}
                        className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{project.studentNotes ? 'Edit Notes' : '+ Add Notes'}</span>
                      </button>
                    )}
                  </div>

                  {isEditingNotes ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        rows={2}
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        placeholder="Write committee notes, advisor suggestions, or next steps..."
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#090d18] border border-cyan-500/40 text-white placeholder-slate-500 focus:outline-hidden"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            onUpdateProject(project.id, { studentNotes: notesDraft });
                            setEditingNotesId(null);
                          }}
                          className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#090d18] border border-white/[0.06] text-xs text-slate-300">
                      {project.studentNotes ? (
                        <p>{project.studentNotes}</p>
                      ) : (
                        <p className="text-slate-500 italic">No notes logged yet. Click "+ Add Notes" to record project guide feedback.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
