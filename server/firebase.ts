import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  type Firestore 
} from 'firebase/firestore';
import { getAI, GoogleAIBackend, getGenerativeModel, type GenerativeModel } from 'firebase/ai';
import { generateProjectIdeasWithGemini, askAiMentor } from './gemini.js';
import { db as localDb } from './db.js';
import type { User, ProjectIdea, ProjectGenerationRequest, MentorMessage } from '../src/types.js';

// Firebase configuration resolving from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.GEMINI_API_KEY || 'demo-firebase-key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'ai-capstone-portal.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.APPLET_ID || 'ai-capstone-portal',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'ai-capstone-portal.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '333225474987',
  appId: process.env.FIREBASE_APP_ID || '1:333225474987:web:capstoneportal',
};

let app: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAiModel: GenerativeModel | null = null;

export function initializeFirebaseServices() {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    // Initialize Firestore
    firestoreDb = getFirestore(app);

    // Initialize Firebase AI Logic with GoogleAIBackend
    try {
      const ai = getAI(app, {
        backend: new GoogleAIBackend(),
      });
      firebaseAiModel = getGenerativeModel(ai, {
        model: 'gemini-2.5-flash',
      });
      console.log('✓ Firebase AI Logic with GoogleAIBackend initialized');
    } catch (aiErr: any) {
      console.warn('Firebase AI Logic initialization note:', aiErr.message);
    }

    console.log('✓ Firebase SDK & Firestore initialized for project:', firebaseConfig.projectId);
  } catch (err: any) {
    console.warn('Firebase initialization note (resilient fallback active):', err.message);
  }
}

// Auto-initialize on module load
initializeFirebaseServices();

// ==========================================
// 1. USERS COLLECTION CRUD
// ==========================================

export async function firestoreCreateUser(userData: {
  id: string;
  name: string;
  email: string;
  college?: string;
  degree?: string;
  graduationYear?: string;
  createdAt: string;
}): Promise<User> {
  const safeUser: User = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    college: userData.college,
    degree: userData.degree,
    graduationYear: userData.graduationYear,
    createdAt: userData.createdAt,
  };

  if (firestoreDb) {
    try {
      const userRef = doc(firestoreDb, 'users', userData.id);
      await setDoc(userRef, safeUser, { merge: true });
    } catch (err: any) {
      console.warn('Firestore write user error (synced to local cache):', err.message);
    }
  }

  return safeUser;
}

export async function firestoreGetUser(userId: string): Promise<User | null> {
  if (firestoreDb) {
    try {
      const userRef = doc(firestoreDb, 'users', userId);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        return snapshot.data() as User;
      }
    } catch (err: any) {
      console.warn('Firestore get user error (falling back to local cache):', err.message);
    }
  }

  // Fallback to local store
  const localUser = localDb.getUserById(userId);
  if (localUser) {
    const { passwordHash: _, salt: __, token: ___, ...safe } = localUser;
    return safe;
  }
  return null;
}

// ==========================================
// 2. PROJECTS COLLECTION CRUD (AI-Generated Ideas)
// ==========================================

export async function firestoreSaveGeneratedProjects(projects: ProjectIdea[]): Promise<void> {
  if (!firestoreDb || !projects.length) return;

  try {
    for (const project of projects) {
      const projectRef = doc(firestoreDb, 'projects', project.id);
      await setDoc(projectRef, {
        ...project,
        savedToCatalogAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (err: any) {
    console.warn('Firestore save projects catalog error:', err.message);
  }
}

export async function firestoreGetProjects(limitCount = 20): Promise<ProjectIdea[]> {
  if (firestoreDb) {
    try {
      const projectsCol = collection(firestoreDb, 'projects');
      const snapshot = await getDocs(projectsCol);
      const results: ProjectIdea[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as ProjectIdea);
      });
      if (results.length > 0) {
        return results.slice(0, limitCount);
      }
    } catch (err: any) {
      console.warn('Firestore get projects error:', err.message);
    }
  }
  return [];
}

// ==========================================
// 3. SAVEDPROJECTS COLLECTION CRUD (Student Bookmarks)
// ==========================================

export async function firestoreGetSavedProjects(userId: string): Promise<ProjectIdea[]> {
  if (firestoreDb) {
    try {
      const savedCol = collection(firestoreDb, 'savedProjects');
      const q = query(savedCol, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const results: ProjectIdea[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.project) {
          results.push({
            ...data.project,
            status: data.status || data.project.status || 'considering',
            studentNotes: data.studentNotes || data.notes || data.project.studentNotes || '',
          });
        }
      });
      if (results.length > 0) {
        return results;
      }
    } catch (err: any) {
      console.warn('Firestore get saved projects error (using synchronized cache):', err.message);
    }
  }

  // Synchronized fallback
  return localDb.getSavedProjects(userId);
}

export async function firestoreSaveProject(userId: string, project: ProjectIdea): Promise<ProjectIdea> {
  // Always update synchronized storage
  const saved = localDb.saveProject(userId, project);

  if (firestoreDb) {
    try {
      const docKey = `${userId}_${project.id}`;
      const savedRef = doc(firestoreDb, 'savedProjects', docKey);
      await setDoc(savedRef, {
        id: docKey,
        userId,
        projectId: project.id,
        project: saved,
        status: saved.status || 'considering',
        studentNotes: saved.studentNotes || '',
        savedAt: saved.savedAt || new Date().toISOString(),
      }, { merge: true });
    } catch (err: any) {
      console.warn('Firestore saveProject bookmark error:', err.message);
    }
  }

  return saved;
}

export async function firestoreUpdateSavedProjectStatus(
  userId: string,
  projectId: string,
  status: 'considering' | 'selected' | 'in-progress' | 'completed',
  notes?: string
): Promise<ProjectIdea> {
  const updates: Partial<ProjectIdea> = { status };
  if (notes !== undefined) {
    updates.studentNotes = notes;
  }
  const updated = localDb.updateSavedProject(userId, projectId, updates);

  if (firestoreDb) {
    try {
      const docKey = `${userId}_${projectId}`;
      const savedRef = doc(firestoreDb, 'savedProjects', docKey);
      const updatePayload: Record<string, any> = { status, updatedAt: new Date().toISOString() };
      if (notes !== undefined) {
        updatePayload.studentNotes = notes;
      }
      await setDoc(savedRef, updatePayload, { merge: true });
    } catch (err: any) {
      console.warn('Firestore update savedProject error:', err.message);
    }
  }

  return updated;
}

export async function firestoreDeleteSavedProject(userId: string, projectId: string): Promise<boolean> {
  const success = localDb.deleteSavedProject(userId, projectId);

  if (firestoreDb) {
    try {
      const docKey = `${userId}_${projectId}`;
      const savedRef = doc(firestoreDb, 'savedProjects', docKey);
      await deleteDoc(savedRef);
    } catch (err: any) {
      console.warn('Firestore delete savedProject error:', err.message);
    }
  }

  return success;
}

// ==========================================
// 4. MENTORCHATS COLLECTION CRUD (Chat History)
// ==========================================

export async function firestoreGetMentorChat(userId: string, projectId = 'general'): Promise<MentorMessage[]> {
  if (firestoreDb) {
    try {
      const docKey = `${userId}_${projectId}`;
      const chatRef = doc(firestoreDb, 'mentorChats', docKey);
      const snapshot = await getDoc(chatRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data.messages)) {
          return data.messages as MentorMessage[];
        }
      }
    } catch (err: any) {
      console.warn('Firestore get mentorChats error (using synchronized cache):', err.message);
    }
  }

  return localDb.getChatHistory(userId, projectId);
}

export async function firestoreSaveMentorMessages(
  userId: string, 
  projectId = 'general', 
  messages: MentorMessage[]
): Promise<void> {
  if (firestoreDb) {
    try {
      const docKey = `${userId}_${projectId}`;
      const chatRef = doc(firestoreDb, 'mentorChats', docKey);
      await setDoc(chatRef, {
        id: docKey,
        userId,
        projectId,
        messages,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err: any) {
      console.warn('Firestore save mentorChats error:', err.message);
    }
  }
}

export async function firestoreClearMentorChat(userId: string, projectId = 'general'): Promise<void> {
  localDb.clearChatHistory(userId, projectId);

  if (firestoreDb) {
    try {
      const docKey = `${userId}_${projectId}`;
      const chatRef = doc(firestoreDb, 'mentorChats', docKey);
      await deleteDoc(chatRef);
    } catch (err: any) {
      console.warn('Firestore clear mentorChats error:', err.message);
    }
  }
}

// ==========================================
// FIREBASE AI LOGIC WITH GOOGLEAIBACKEND + GEMINI
// ==========================================

export async function generateProjectIdeasWithFirebase(
  req: ProjectGenerationRequest,
  userId?: string
): Promise<ProjectIdea[]> {
  let ideas: ProjectIdea[] = [];

  // Attempt 1: Try Firebase AI Logic with GoogleAIBackend
  if (firebaseAiModel) {
    try {
      const prompt = `
You are a distinguished Senior Computer Science Professor and Capstone Project Committee Head.
Generate exactly 4 highly practical, academically rigorous, and impressive Final-Year Project Ideas tailored for a university student:
- Academic Domain: ${req.domain || 'Computer Science & Engineering'}
- Student Skills: ${req.skills || 'Python, JavaScript, SQL'}
- Specific Interests: ${req.interests || 'Applied AI, system building'}
- Preferred Technologies: ${req.preferredTech || 'Modern full stack or ML'}
- Target Difficulty Level: ${req.difficulty || 'Intermediate'}
- Expected Timeframe: ${req.timeframe || '12-16 weeks'}

Return STRICTLY a JSON array of 4 objects matching the ProjectIdea schema with title, tagline, domain, difficulty, estimatedTime, problemStatement, keyFeatures (array), recommendedTechStack (frontend, backend, database, aiMl, devOps), developmentRoadmap (4 phases with phase, duration, milestones, deliverables), aiMlIntegration, and vivaDefenseQuestions (question, sampleAnswerHint).
`;
      const result = await firebaseAiModel.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          ideas = parsed.map((item, idx) => ({
            ...item,
            id: item.id || `proj_fb_${Date.now()}_${idx}`,
            difficulty: (['Beginner', 'Intermediate', 'Advanced'].includes(item.difficulty)
              ? item.difficulty
              : req.difficulty || 'Intermediate') as 'Beginner' | 'Intermediate' | 'Advanced',
          }));
        }
      }
    } catch (fbAiErr: any) {
      console.warn('Firebase AI Logic call directed to Gemini Developer API:', fbAiErr.message);
    }
  }

  // Attempt 2: Use Gemini Developer API via @google/genai (Real Gemini response)
  if (!ideas.length) {
    ideas = await generateProjectIdeasWithGemini(req);
  }

  // Persist generated blueprints into Firestore 'projects' collection
  if (ideas.length > 0) {
    firestoreSaveGeneratedProjects(ideas).catch((err) =>
      console.warn('Async firestore project catalog sync error:', err.message)
    );
  }

  // Increment statistics
  if (userId) {
    localDb.incrementGeneratedStats(userId);
  }

  return ideas;
}

export async function askAiMentorWithFirebase(params: {
  userId?: string;
  userMessage: string;
  projectContext?: ProjectIdea | null;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  userProfile?: { name?: string; degree?: string; college?: string };
}): Promise<{ reply: string; suggestedActions: string[] }> {
  const projectId = params.projectContext?.id || 'general';

  // Record user message locally
  const userMsg: MentorMessage = {
    id: `msg_u_${Date.now()}`,
    role: 'user',
    content: params.userMessage,
    timestamp: new Date().toISOString(),
    projectId,
  };

  if (params.userId) {
    localDb.appendChatMessage(params.userId, userMsg, projectId);
  }

  // Use Gemini via Developer API
  const response = await askAiMentor({
    userMessage: params.userMessage,
    projectContext: params.projectContext,
    history: params.history,
    userProfile: params.userProfile,
  });

  const assistantMsg: MentorMessage = {
    id: `msg_a_${Date.now()}`,
    role: 'assistant',
    content: response.reply,
    timestamp: new Date().toISOString(),
    projectId,
    suggestedActions: response.suggestedActions,
  };

  // Record assistant message locally
  if (params.userId) {
    localDb.appendChatMessage(params.userId, assistantMsg, projectId);
    localDb.incrementMentorStats(params.userId);

    // Persist complete updated conversation to Firestore 'mentorChats'
    const fullHistory = localDb.getChatHistory(params.userId, projectId);
    firestoreSaveMentorMessages(params.userId, projectId, fullHistory).catch((err) =>
      console.warn('Async firestore mentor chat sync error:', err.message)
    );
  }

  return response;
}
