import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { LandingPage } from './components/LandingPage';
import { ProjectGeneratorForm } from './components/ProjectGeneratorForm';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { SavedProjectsView } from './components/SavedProjectsView';
import { MentorChatView } from './components/MentorChatView';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { api, authStorage } from './api';
import type { User, ProjectIdea, ProjectGenerationRequest, UserStats } from './types';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'generator' | 'saved' | 'mentor' | 'dashboard'>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [savedProjects, setSavedProjects] = useState<ProjectIdea[]>([]);
  const [generatedProjects, setGeneratedProjects] = useState<ProjectIdea[]>([]);
  
  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals & Navigation state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [detailModalProject, setDetailModalProject] = useState<ProjectIdea | null>(null);
  const [mentorProject, setMentorProject] = useState<ProjectIdea | null>(null);
  
  // Loading & notification states
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  function showToast(text: string, type: 'success' | 'error' = 'success') {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Active project computed
  const activeProject = 
    savedProjects.find((p) => p.status === 'selected' || p.status === 'in-progress') ||
    savedProjects[0] || 
    null;

  // Check current session on mount
  useEffect(() => {
    async function initAuth() {
      const token = authStorage.getToken();
      if (token) {
        try {
          const res = await api.getMe();
          setCurrentUser(res.user);
          setUserStats(res.stats);
          const saved = await api.getSavedProjects();
          setSavedProjects(saved);
        } catch {
          authStorage.removeToken();
          setCurrentUser(null);
        }
      }
    }
    initAuth();
  }, []);

  // Refresh saved projects when user changes
  async function refreshUserData() {
    try {
      if (authStorage.getToken()) {
        const res = await api.getMe();
        setCurrentUser(res.user);
        setUserStats(res.stats);
        const saved = await api.getSavedProjects();
        setSavedProjects(saved);
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  }

  // Handle Demo Login
  async function handleDemoLogin() {
    try {
      const res = await api.demoLogin();
      setCurrentUser(res.user);
      await refreshUserData();
      showToast(`Signed in as Demo Student (${res.user.name})!`);
      setActiveTab('dashboard');
    } catch (err: any) {
      showToast(err.message || 'Demo login failed', 'error');
    }
  }

  // Handle Logout
  function handleLogout() {
    api.logout();
    setCurrentUser(null);
    setUserStats(null);
    setSavedProjects([]);
    showToast('Signed out successfully');
    setActiveTab('dashboard');
  }

  // Handle Project Generation
  async function handleGenerate(request: ProjectGenerationRequest) {
    setIsGenerating(true);
    try {
      const ideas = await api.generateProjects(request);
      setGeneratedProjects(ideas);
      showToast(`Synthesized ${ideas.length} tailored project blueprints!`);
      // Scroll to generated results smoothly
      setTimeout(() => {
        const resultsEl = document.getElementById('generated-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      if (currentUser) {
        refreshUserData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to generate project ideas', 'error');
    } finally {
      setIsGenerating(false);
    }
  }

  // Handle Save / Unsave
  async function handleToggleSave(project: ProjectIdea) {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Please sign in or use Demo Student to save projects', 'error');
      return;
    }

    const isAlreadySaved = savedProjects.some((p) => p.id === project.id);
    try {
      if (isAlreadySaved) {
        await api.deleteSavedProject(project.id);
        setSavedProjects((prev) => prev.filter((p) => p.id !== project.id));
        showToast(`Removed "${project.title}" from saved blueprints`);
      } else {
        const saved = await api.saveProject({
          ...project,
          savedAt: new Date().toISOString(),
          status: 'considering',
        });
        setSavedProjects((prev) => [saved, ...prev.filter((p) => p.id !== project.id)]);
        showToast(`Saved "${project.title}" to your candidate repository!`);
      }
      refreshUserData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update saved project', 'error');
    }
  }

  // Update Project (notes, status)
  async function handleUpdateProject(projectId: string, updates: Partial<ProjectIdea>) {
    if (!currentUser) return;
    try {
      const updated = await api.updateSavedProject(projectId, updates);
      setSavedProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
      showToast('Project blueprint details updated');
      refreshUserData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update project', 'error');
    }
  }

  // Delete project
  async function handleDeleteSavedProject(projectId: string) {
    if (!currentUser) return;
    if (confirm('Are you sure you want to remove this project from your repository?')) {
      try {
        await api.deleteSavedProject(projectId);
        setSavedProjects((prev) => prev.filter((p) => p.id !== projectId));
        showToast('Project removed');
        refreshUserData();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete project', 'error');
      }
    }
  }

  // Direct transition to AI mentor with project attached
  function handleConsultMentor(project: ProjectIdea) {
    setMentorProject(project);
    setActiveTab('mentor');
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f1f5f9] font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col relative overflow-x-hidden">
      {/* Subtle ambient lighting orbs in background */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-2.5 text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-[#0f1d33]/90 text-cyan-200 border-cyan-500/40 shadow-cyan-950/60'
                : 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/60'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-rose-400 text-slate-950 flex items-center justify-center shrink-0">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Fixed Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        savedCount={savedProjects.length}
        activeProject={activeProject}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onDemoLogin={handleDemoLogin}
        onLogout={handleLogout}
        onConsultMentor={handleConsultMentor}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Workspace Wrapper (padded for fixed sidebar on lg screens) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Bar for Desktop & Mobile */}
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          savedCount={savedProjects.length}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onDemoLogin={handleDemoLogin}
        />

        {/* Dynamic Main Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'landing' && (
            <LandingPage
              onStartGenerating={() => setActiveTab('generator')}
              onExploreSaved={() => {
                if (savedProjects.length > 0) {
                  setDetailModalProject(savedProjects[0]);
                } else {
                  setActiveTab('generator');
                }
              }}
              onDemoLogin={handleDemoLogin}
            />
          )}

          {activeTab === 'generator' && (
            <div className="space-y-10">
              <ProjectGeneratorForm
                onGenerate={handleGenerate}
                isLoading={isGenerating}
              />

              {/* Recommended Generated Blueprints Section */}
              {generatedProjects.length > 0 && (
                <section id="generated-results-section" className="space-y-6 pt-4 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Synthesized Capstone Blueprints</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                        Recommended Project Blueprints ({generatedProjects.length})
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Explore detailed architectural diagrams, phased semester roadmaps, open datasets, and viva defense questions.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedProjects.map((proj) => (
                      <ProjectCard
                        key={proj.id}
                        project={proj}
                        isSaved={savedProjects.some((s) => s.id === proj.id)}
                        onViewDetails={(p) => setDetailModalProject(p)}
                        onToggleSave={handleToggleSave}
                        onConsultMentor={handleConsultMentor}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <SavedProjectsView
              savedProjects={savedProjects}
              onViewDetails={(p) => setDetailModalProject(p)}
              onConsultMentor={handleConsultMentor}
              onDeleteProject={handleDeleteSavedProject}
              onUpdateProject={handleUpdateProject}
              onNavigateToGenerator={() => setActiveTab('generator')}
            />
          )}

          {activeTab === 'mentor' && (
            <MentorChatView
              currentUser={currentUser}
              savedProjects={savedProjects}
              selectedProject={mentorProject}
              onSelectProject={setMentorProject}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              userStats={userStats}
              savedProjects={savedProjects}
              onNavigateToGenerator={() => setActiveTab('generator')}
              onNavigateToSaved={() => setActiveTab('saved')}
              onNavigateToMentor={handleConsultMentor}
              onViewProjectDetails={(p) => setDetailModalProject(p)}
            />
          )}
        </main>

        {/* Modern Dark Minimalist Footer */}
        <footer className="bg-[#070a12] border-t border-white/[0.06] mt-auto py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">ProjectMentor AI</span>
              <span>• Capstone & Dissertation Advisor for Final-Year Engineering</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-cyan-400">Google Gemini 3.8 Flash</span>
              <span>•</span>
              <span className="text-amber-400">IEEE & ABET Rubrics</span>
              <span>•</span>
              <span className="text-emerald-400">Firestore Live</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={detailModalProject}
        isOpen={Boolean(detailModalProject)}
        isSaved={Boolean(detailModalProject && savedProjects.some((s) => s.id === detailModalProject.id))}
        onClose={() => setDetailModalProject(null)}
        onToggleSave={handleToggleSave}
        onConsultMentor={handleConsultMentor}
        onUpdateNotes={(id, notes, status) => handleUpdateProject(id, { studentNotes: notes, status })}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          refreshUserData();
          showToast(`Welcome back, ${user.name}!`);
        }}
      />
    </div>
  );
}
