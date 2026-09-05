import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  GraduationCap, 
  User, 
  Layers, 
  Lightbulb, 
  FileQuestion, 
  Database, 
  ArrowRight,
  Bot,
  Terminal,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import Markdown from 'react-markdown';
import { api } from '../api';
import type { ProjectIdea, MentorMessage, User as UserType } from '../types';

interface MentorChatViewProps {
  currentUser: UserType | null;
  savedProjects: ProjectIdea[];
  selectedProject: ProjectIdea | null;
  onSelectProject: (project: ProjectIdea | null) => void;
  onOpenAuth: () => void;
}

const QUICK_PROMPTS = [
  { label: '3 Tough Viva Inquiries', icon: FileQuestion, prompt: 'What are the 3 hardest technical questions the external examiner will ask me about this project during the viva defense, and how should I answer them?' },
  { label: 'System Architecture Review', icon: Layers, prompt: 'Review the high-level system architecture and API boundaries. How should I design the database and inference pipeline to prevent performance bottlenecks?' },
  { label: 'Datasets & Open APIs', icon: Database, prompt: 'What specific open-source datasets (e.g., Kaggle, Hugging Face, UCI) and open APIs can I immediately use to build and benchmark this project?' },
  { label: 'Chapter 1 Problem Statement', icon: Lightbulb, prompt: 'Draft a rigorous, publication-ready Problem Statement and Research Objective for Chapter 1 of my final-year project report.' },
  { label: 'Novelty & Grade Differentiation', icon: Sparkles, prompt: 'What innovative feature or technical twist can our team implement to truly impress the university evaluation committee and stand out from generic projects?' },
];

export function MentorChatView({
  currentUser,
  savedProjects,
  selectedProject,
  onSelectProject,
  onOpenAuth,
}: MentorChatViewProps) {
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      if (!currentUser) {
        setMessages([
          {
            id: 'welcome_guest',
            role: 'assistant',
            content: `Welcome to your **AI Capstone Mentor Console**! I am **Professor Vance**, Head of the Academic Project Committee.

Whether you need help selecting a project topic, refining your **Software Requirements Specification (SRS)**, architecting your **production stack**, or preparing for your high-stakes **Viva Voce defense**, I am here to guide you.

${selectedProject ? `Currently grounded on: **${selectedProject.title}** (${selectedProject.domain})` : 'Select a saved project from the dropdown above to ground our discussion, or ask me any question directly below.'}`,
            timestamp: new Date().toISOString(),
            suggestedActions: [
              'Predict 3 tough Viva Voce questions',
              'Draft Chapter 1 Problem Statement',
              'Recommend verified open datasets',
            ],
          },
        ]);
        return;
      }

      try {
        const history = await api.getMentorHistory(selectedProject?.id);
        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([
            {
              id: 'welcome_student',
              role: 'assistant',
              content: `Hello ${currentUser.name}! I am your **AI Capstone Mentor (Professor Vance)**.

${
  selectedProject
    ? `I have loaded the complete technical blueprint for **${selectedProject.title}** (${selectedProject.domain}). We can dive into architecture diagrams, dataset sources, implementation roadmaps, or viva defense rehearsal.`
    : `We are currently in open consultation mode. You can attach any of your **${savedProjects.length} saved project blueprints** using the selector above, or ask me any question regarding your capstone thesis.`
}`,
              timestamp: new Date().toISOString(),
              suggestedActions: [
                'Predict 3 tough Viva Voce questions',
                'Recommend verified open datasets',
                'Draft System Architecture & ER guidelines',
              ],
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load mentor chat history:', err);
      }
    }

    loadHistory();
  }, [currentUser, selectedProject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSendMessage(textToSend?: string) {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: MentorMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      projectId: selectedProject?.id,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.askMentor({
        message: text,
        projectContext: selectedProject,
        history: historyPayload,
      });

      setMessages((prev) => [...prev, res.assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `I encountered an issue processing your consultation request: ${err.message || 'Please check your connection and retry.'}`,
          timestamp: new Date().toISOString(),
          projectId: selectedProject?.id,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    if (confirm('Clear chat history with your AI Mentor?')) {
      try {
        await api.clearMentorHistory(selectedProject?.id);
        setMessages([]);
      } catch (err) {
        console.error('Failed to clear chat history:', err);
      }
    }
  }

  function handleCopyMessage(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="rounded-3xl bg-[#0d1424]/90 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl shadow-black/60 flex flex-col h-[calc(100vh-140px)] min-h-[600px] overflow-hidden">
      {/* Mentor Header Bar */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#090e1a]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-amber-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-md shadow-cyan-950/60">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-[#0b0f19] shadow-[0_0_6px_#22d3ee] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-white">
                Professor Vance, Ph.D.
              </h2>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                AI Committee Head
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>IEEE Fellow Advisor</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">Gemini 3.8 Flash Online</span>
            </p>
          </div>
        </div>

        {/* Project Grounding Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const found = savedProjects.find((p) => p.id === e.target.value) || null;
                onSelectProject(found);
              }}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium rounded-xl bg-[#11192e] border border-cyan-500/30 text-white focus:outline-hidden focus:border-cyan-400 cursor-pointer max-w-[240px] truncate"
            >
              <option value="">(Open Capstone Consultation)</option>
              {savedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/[0.08] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2.5 bg-[#090d18] border-b border-white/[0.05] overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Quick Inquiries:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] hover:bg-cyan-500/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-medium border border-white/[0.07] transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold font-display shadow-sm ${
                  isAssistant
                    ? 'bg-gradient-to-br from-cyan-400/20 to-slate-900 border border-cyan-400/50 text-cyan-300'
                    : 'bg-gradient-to-br from-amber-400/20 to-slate-900 border border-amber-400/50 text-amber-300'
                }`}
              >
                {isAssistant ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-2xl rounded-2xl p-4 sm:p-5 relative group ${
                  isAssistant
                    ? 'bg-[#11192e]/80 border border-white/[0.08] text-slate-200'
                    : 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-100 shadow-md shadow-cyan-950/30'
                }`}
              >
                {/* Copy button for assistant responses */}
                {isAssistant && (
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    title="Copy response"
                    className="absolute right-3 top-3 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                {/* Markdown content */}
                <div className="markdown-body">
                  <Markdown>{msg.content}</Markdown>
                </div>

                {/* Suggested follow-up action chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/[0.07] space-y-1.5">
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Suggested Academic Follow-ups:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleSendMessage(action)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30 transition-colors cursor-pointer text-left"
                        >
                          <ArrowRight className="w-3 h-3 text-cyan-400" />
                          <span>{action}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-[10px] font-mono text-slate-500 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-4 rounded-2xl bg-[#11192e]/80 border border-cyan-500/20 flex items-center gap-2 text-xs font-mono text-cyan-300">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-150" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-300" />
              <span className="ml-1 text-slate-400">Professor Vance is analyzing project rubrics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#090e1a]/90 border-t border-white/[0.08] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            placeholder={
              selectedProject
                ? `Ask Professor Vance regarding "${selectedProject.title}" (architecture, datasets, viva questions)...`
                : 'Ask anything regarding your final-year capstone, literature review, or viva defense...'
            }
            className="flex-1 px-4 py-3 rounded-xl bg-[#11192e] border border-white/[0.1] focus:outline-hidden focus:border-cyan-400 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className={`px-5 py-3 rounded-xl text-xs font-bold text-slate-950 flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
              !inputValue.trim() || loading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 shadow-cyan-950/60'
            }`}
          >
            <Send className="w-4 h-4 fill-slate-950" />
            <span className="hidden sm:inline">Inquire</span>
          </button>
        </form>
      </div>
    </div>
  );
}
