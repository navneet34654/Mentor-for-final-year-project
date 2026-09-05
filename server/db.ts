import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { User, ProjectIdea, MentorMessage, UserStats } from '../src/types.js';

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
  token?: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  savedProjects: Record<string, ProjectIdea[]>; // userId -> ProjectIdea[]
  chatHistories: Record<string, MentorMessage[]>; // `${userId}_${projectId || 'general'}` -> MentorMessage[]
  stats: Record<string, UserStats>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Helper to hash password
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, s, 64).toString('hex');
  return { hash, salt: s };
}

// Ensure data folder and db file exist
function initializeDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const defaultDb: DatabaseSchema = {
    users: [],
    savedProjects: {},
    chatHistories: {},
    stats: {},
  };

  if (!fs.existsSync(DB_FILE)) {
    // Seed default demo user
    const { hash, salt } = hashPassword('demostudent123');
    const demoUserId = 'user_demo_student_01';
    const demoUser: StoredUser = {
      id: demoUserId,
      name: 'Alex Chen',
      email: 'demo@student.edu',
      college: 'Institute of Technology',
      degree: 'B.Tech in Computer Science',
      graduationYear: '2025',
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      salt: salt,
      token: 'demo-token-123456789',
    };

    const demoProject: ProjectIdea = {
      id: 'proj_mediscan_ai_sample',
      title: 'MediScan AI: Multimodal Clinical Summarization & Diagnostic Assist',
      tagline: 'End-to-end clinical workflow assistant for analyzing EHR records and chest radiography with explainable heatmaps',
      domain: 'Artificial Intelligence & Healthcare',
      difficulty: 'Intermediate',
      estimatedTime: '12 - 16 weeks',
      problemStatement: 'Doctors and hospital residents face diagnostic burnout when manually reviewing multi-page unstructured electronic health records (EHR) alongside medical imaging. An accessible AI copilot that cross-references radiological findings with patient lab histories can drastically shorten triage response times.',
      keyFeatures: [
        'Automated Clinical Note Summarization: Extracts chief complaints, active medications, and contraindications into structured SOAP notes.',
        'Chest X-Ray Pathology Screening: Detects Cardiomegaly, Pneumothorax, and Consolidation with Grad-CAM visual attention overlays.',
        'Interactive Medical Q&A: Doctor can query patient lab metrics and clinical guidelines in natural language.',
        'FHIR-Compliant Data Ingestion: Accepts synthetic patient records in standard HL7/FHIR JSON format.',
        'Privacy-Preserving Local Inference option for sensitive health data.'
      ],
      recommendedTechStack: {
        frontend: ['React 19', 'Tailwind CSS', 'Lucide React', 'Canvas/DICOM Viewer'],
        backend: ['FastAPI (Python)', 'Express / Node.js API Gateway'],
        database: ['PostgreSQL / SQLite', 'ChromaDB (Vector Database for Clinical Guidelines)'],
        aiMl: ['Gemini 3.8 Flash (Summarization & Clinical Reasoning)', 'PyTorch TorchVision DenseNet-121 (Chest X-Ray Pretrained)', 'Grad-CAM'],
        devOps: ['Docker', 'Hugging Face Spaces / Google Cloud Run']
      },
      developmentRoadmap: [
        {
          phase: 'Phase 1: Requirements & Dataset Prep',
          duration: 'Weeks 1-3',
          milestones: ['Literature review on clinical summarization', 'Download & preprocess NIH ChestX-ray8 & MIMIC-III synthetic subset', 'Define system architecture & FHIR schema'],
          deliverables: ['System Requirements Specification (SRS)', 'Preprocessed image and text dataset pipeline']
        },
        {
          phase: 'Phase 2: Core ML Pipeline & API',
          duration: 'Weeks 4-7',
          milestones: ['Fine-tune/Prompt DenseNet-121 on thoracic pathologies', 'Implement Grad-CAM explainability heatmap generator', 'Build FastAPI REST endpoints for inference'],
          deliverables: ['Functional AI Inference Service with >88% AUROC baseline', 'API documentation with Swagger']
        },
        {
          phase: 'Phase 3: Web Dashboard & EHR Integration',
          duration: 'Weeks 8-11',
          milestones: ['Design responsive radiologist workbench in React', 'Implement interactive heatmaps and PDF clinical report exporter', 'Conduct latency and error handling stress tests'],
          deliverables: ['Complete interactive UI connected to backend API', 'Exportable clinical summary report']
        },
        {
          phase: 'Phase 4: Academic Evaluation & Viva Defense',
          duration: 'Weeks 12-14',
          milestones: ['Evaluate with Clinical F1, ROUGE-L, and User Study survey', 'Draft final-year project dissertation report', 'Prepare slide deck and viva rehearsal'],
          deliverables: ['Comprehensive Final Dissertation (Chapters 1-7)', 'Demonstration video and slide deck']
        }
      ],
      aiMlIntegration: {
        overview: 'Combines computer vision classification for radiograph anomaly detection with generative clinical LLM reasoning for patient history reconciliation.',
        algorithmsOrModels: ['DenseNet-121 CNN for multi-label chest radiography classification', 'Gemini 3.8 Flash for zero-shot clinical narrative extraction', 'Grad-CAM for Class Activation Mapping'],
        datasetSuggestions: ['NIH ChestX-ray14 (NIH Clinical Center)', 'MIMIC-CXR-JPG (PhysioNet open synthetic samples)', 'PubMed Central Open Access Articles'],
        evaluationMetrics: ['Area Under ROC Curve (AUROC)', 'ROUGE-1, ROUGE-2, ROUGE-L for narrative summaries', 'Inference Latency (< 1.5s per radiograph)']
      },
      futureImprovements: [
        'Federated Learning support to train across multiple hospital nodes without sharing raw patient data.',
        'DICOM 3D volumetric CT scan support.',
        'Multi-lingual patient summary translation for regional languages.'
      ],
      academicEvaluationTips: [
        'Examiners love explainability: highlight your Grad-CAM heatmaps so the AI is not a black-box.',
        'Emphasize ethical considerations: explain HIPAA/GDPR mock compliance and safety disclaimers.',
        'Have a live benchmark comparison table (e.g. ResNet vs DenseNet performance) in your slides.'
      ],
      vivaDefenseQuestions: [
        {
          question: 'Why did you select DenseNet-121 over standard ResNet-50 for chest radiograph classification?',
          sampleAnswerHint: 'DenseNet connects all layers directly, promoting feature reuse and gradient flow while requiring fewer parameters, which reduces overfitting on medical datasets with high visual redundancy.'
        },
        {
          question: 'How do you prevent hallucination in the clinical note summary?',
          sampleAnswerHint: 'We constrain the LLM via strict retrieval-grounded prompts, provide strict schema constraints, and append verbatim source citations from the original EHR text.'
        },
        {
          question: 'What metric did you prioritize and why?',
          sampleAnswerHint: 'In clinical screening, false negatives are catastrophic, so we prioritized Sensitivity/Recall and AUROC over raw accuracy to capture true pathology cases.'
        }
      ],
      savedAt: new Date().toISOString(),
      status: 'selected',
      studentNotes: 'Selected as team final year project! Advisor approved the scope and suggested focusing on Grad-CAM explainability.'
    };

    defaultDb.users.push(demoUser);
    defaultDb.savedProjects[demoUserId] = [demoProject];
    defaultDb.stats[demoUserId] = {
      projectsGenerated: 4,
      projectsSaved: 1,
      activeProjectTitle: demoProject.title,
      mentorQueriesCount: 3,
      selectedDomain: 'Artificial Intelligence & Healthcare',
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf8');
    return defaultDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return defaultDb;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to write database:', err);
  }
}

export const db = {
  // Auth & User Management
  getUserByEmail(email: string): StoredUser | undefined {
    const data = initializeDb();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserByToken(token: string): StoredUser | undefined {
    if (!token) return undefined;
    const data = initializeDb();
    return data.users.find(u => u.token === token);
  },

  getUserById(id: string): StoredUser | undefined {
    if (!id) return undefined;
    const data = initializeDb();
    return data.users.find(u => u.id === id);
  },

  createUser(userData: {
    name: string;
    email: string;
    password: string;
    college?: string;
    degree?: string;
    graduationYear?: string;
  }): { user: User; token: string } {
    const data = initializeDb();
    const existing = data.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const { hash, salt } = hashPassword(userData.password);
    const userId = `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const token = `tok_${crypto.randomBytes(24).toString('hex')}`;

    const newUser: StoredUser = {
      id: userId,
      name: userData.name,
      email: userData.email,
      college: userData.college || 'Engineering College',
      degree: userData.degree || 'B.Tech / B.E. Computer Science',
      graduationYear: userData.graduationYear || '2025',
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      salt: salt,
      token: token,
    };

    data.users.push(newUser);
    data.savedProjects[userId] = [];
    data.stats[userId] = {
      projectsGenerated: 0,
      projectsSaved: 0,
      mentorQueriesCount: 0,
    };

    writeDb(data);

    // Return sanitized user object without password
    const { passwordHash, salt: _, ...safeUser } = newUser;
    return { user: safeUser, token };
  },

  authenticateUser(email: string, password: string): { user: User; token: string } {
    const data = initializeDb();
    const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const { hash } = hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      throw new Error('Invalid email or password.');
    }

    const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
    user.token = token;
    writeDb(data);

    const { passwordHash: _, salt: __, ...safeUser } = user;
    return { user: safeUser, token };
  },

  getDemoUser(): { user: User; token: string } {
    const data = initializeDb();
    let demo = data.users.find(u => u.email === 'demo@student.edu');
    if (!demo) {
      initializeDb();
      demo = initializeDb().users.find(u => u.email === 'demo@student.edu')!;
    }
    const token = demo.token || 'demo-token-123456789';
    demo.token = token;
    writeDb(data);

    const { passwordHash: _, salt: __, ...safeUser } = demo;
    return { user: safeUser, token };
  },

  // Saved Projects
  getSavedProjects(userId: string): ProjectIdea[] {
    const data = initializeDb();
    return data.savedProjects[userId] || [];
  },

  saveProject(userId: string, project: ProjectIdea): ProjectIdea {
    const data = initializeDb();
    if (!data.savedProjects[userId]) {
      data.savedProjects[userId] = [];
    }

    const existingIndex = data.savedProjects[userId].findIndex(p => p.id === project.id);
    const enrichedProject: ProjectIdea = {
      ...project,
      savedAt: project.savedAt || new Date().toISOString(),
      status: project.status || 'considering',
    };

    if (existingIndex >= 0) {
      data.savedProjects[userId][existingIndex] = enrichedProject;
    } else {
      data.savedProjects[userId].unshift(enrichedProject);
    }

    if (!data.stats[userId]) {
      data.stats[userId] = { projectsGenerated: 0, projectsSaved: 0, mentorQueriesCount: 0 };
    }
    data.stats[userId].projectsSaved = data.savedProjects[userId].length;

    writeDb(data);
    return enrichedProject;
  },

  updateSavedProject(userId: string, projectId: string, updates: Partial<ProjectIdea>): ProjectIdea {
    const data = initializeDb();
    const list = data.savedProjects[userId] || [];
    const index = list.findIndex(p => p.id === projectId);
    if (index === -1) {
      throw new Error('Project not found in saved list.');
    }

    list[index] = { ...list[index], ...updates };
    data.savedProjects[userId] = list;

    if (updates.status === 'selected' || updates.status === 'in-progress') {
      if (!data.stats[userId]) {
        data.stats[userId] = { projectsGenerated: 0, projectsSaved: 0, mentorQueriesCount: 0 };
      }
      data.stats[userId].activeProjectTitle = list[index].title;
    }

    writeDb(data);
    return list[index];
  },

  deleteSavedProject(userId: string, projectId: string): boolean {
    const data = initializeDb();
    if (!data.savedProjects[userId]) return false;

    const initialLen = data.savedProjects[userId].length;
    data.savedProjects[userId] = data.savedProjects[userId].filter(p => p.id !== projectId);
    
    if (!data.stats[userId]) {
      data.stats[userId] = { projectsGenerated: 0, projectsSaved: 0, mentorQueriesCount: 0 };
    }
    data.stats[userId].projectsSaved = data.savedProjects[userId].length;

    writeDb(data);
    return data.savedProjects[userId].length < initialLen;
  },

  // Stats
  getUserStats(userId: string): UserStats {
    const data = initializeDb();
    const stats = data.stats[userId] || {
      projectsGenerated: 0,
      projectsSaved: 0,
      mentorQueriesCount: 0,
    };
    stats.projectsSaved = (data.savedProjects[userId] || []).length;
    const selected = (data.savedProjects[userId] || []).find(p => p.status === 'selected' || p.status === 'in-progress');
    if (selected) {
      stats.activeProjectTitle = selected.title;
      stats.selectedDomain = selected.domain;
    }
    return stats;
  },

  incrementGeneratedStats(userId: string): void {
    const data = initializeDb();
    if (!data.stats[userId]) {
      data.stats[userId] = { projectsGenerated: 0, projectsSaved: 0, mentorQueriesCount: 0 };
    }
    data.stats[userId].projectsGenerated += 1;
    writeDb(data);
  },

  incrementMentorStats(userId: string): void {
    const data = initializeDb();
    if (!data.stats[userId]) {
      data.stats[userId] = { projectsGenerated: 0, projectsSaved: 0, mentorQueriesCount: 0 };
    }
    data.stats[userId].mentorQueriesCount += 1;
    writeDb(data);
  },

  // Chat History
  getChatHistory(userId: string, projectId?: string): MentorMessage[] {
    const data = initializeDb();
    const key = `${userId}_${projectId || 'general'}`;
    return data.chatHistories[key] || [];
  },

  appendChatMessage(userId: string, message: MentorMessage, projectId?: string): void {
    const data = initializeDb();
    const key = `${userId}_${projectId || 'general'}`;
    if (!data.chatHistories[key]) {
      data.chatHistories[key] = [];
    }
    data.chatHistories[key].push(message);
    // Keep last 50 messages per session
    if (data.chatHistories[key].length > 50) {
      data.chatHistories[key] = data.chatHistories[key].slice(-50);
    }
    writeDb(data);
  },

  clearChatHistory(userId: string, projectId?: string): void {
    const data = initializeDb();
    const key = `${userId}_${projectId || 'general'}`;
    data.chatHistories[key] = [];
    writeDb(data);
  }
};
