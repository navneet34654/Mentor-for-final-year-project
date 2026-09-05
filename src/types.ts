export interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  degree?: string;
  graduationYear?: string;
  createdAt: string;
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  aiMl: string[];
  devOps: string[];
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  milestones: string[];
  deliverables: string[];
}

export interface AiMlIntegration {
  overview: string;
  algorithmsOrModels: string[];
  datasetSuggestions: string[];
  evaluationMetrics: string[];
}

export interface VivaQuestion {
  question: string;
  sampleAnswerHint: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  tagline: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  problemStatement: string;
  keyFeatures: string[];
  recommendedTechStack: TechStack;
  developmentRoadmap: RoadmapPhase[];
  aiMlIntegration: AiMlIntegration;
  futureImprovements: string[];
  academicEvaluationTips: string[];
  vivaDefenseQuestions: VivaQuestion[];
  savedAt?: string;
  status?: 'considering' | 'selected' | 'in-progress' | 'completed';
  studentNotes?: string;
  isCustom?: boolean;
}

export interface ProjectGenerationRequest {
  interests: string;
  skills: string;
  domain: string;
  preferredTech: string;
  difficulty: string;
  timeframe?: string;
  teamSize?: string;
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  projectId?: string;
  suggestedActions?: string[];
}

export interface UserStats {
  projectsGenerated: number;
  projectsSaved: number;
  activeProjectTitle?: string;
  mentorQueriesCount: number;
  selectedDomain?: string;
}
