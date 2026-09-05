import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import { 
  firestoreCreateUser, 
  firestoreGetUser, 
  generateProjectIdeasWithFirebase, 
  firestoreGetSavedProjects, 
  firestoreSaveProject, 
  firestoreUpdateSavedProjectStatus, 
  firestoreDeleteSavedProject, 
  askAiMentorWithFirebase, 
  firestoreGetMentorChat, 
  firestoreClearMentorChat 
} from './server/firebase.js';
import type { User, ProjectGenerationRequest, ProjectIdea, MentorMessage } from './src/types.js';

dotenv.config();

// Custom interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: User;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Authentication middleware
function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const user = db.getUserByToken(token);
  if (!user) {
    res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    return;
  }

  const { passwordHash: _, salt: __, ...safeUser } = user;
  req.user = safeUser;
  next();
}

// Optional auth middleware (attaches user if present, does not block if not)
function optionalAuthMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = db.getUserByToken(token);
    if (user) {
      const { passwordHash: _, salt: __, ...safeUser } = user;
      req.user = safeUser;
    }
  }
  next();
}

// --- API ROUTES ---

// Health check & environment status
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    firebaseAILogic: true,
    firestoreCollections: ['users', 'projects', 'savedProjects', 'mentorChats'],
    timestamp: new Date().toISOString(),
  });
});

// Firebase status
app.get('/api/firebase/status', (_req, res) => {
  res.json({
    connected: true,
    backend: 'Firebase AI Logic (GoogleAIBackend) + Gemini Developer API',
    collections: ['users', 'projects', 'savedProjects', 'mentorChats'],
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.APPLET_ID || 'ai-capstone-portal',
  });
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, college, degree, graduationYear } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const result = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      college: college?.trim(),
      degree: degree?.trim(),
      graduationYear: graduationYear?.trim(),
    });

    // Sync to Firestore 'users' collection
    await firestoreCreateUser(result.user);

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const result = db.authenticateUser(email.trim().toLowerCase(), password);
    // Ensure in Firestore 'users' collection
    firestoreCreateUser(result.user).catch((e) => console.warn('Firestore user sync:', e.message));

    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Invalid credentials' });
  }
});

app.post('/api/auth/demo', async (_req, res) => {
  try {
    const result = db.getDemoUser();
    firestoreCreateUser(result.user).catch((e) => console.warn('Firestore demo user sync:', e.message));
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load demo user' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const firestoreUser = await firestoreGetUser(user.id);
  const stats = db.getUserStats(user.id);
  res.json({ user: firestoreUser || user, stats });
});

// Project Generation using Firebase AI Logic + Gemini Developer API
app.post('/api/projects/generate', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const body: ProjectGenerationRequest = req.body;
    if (!body.domain && !body.interests && !body.skills) {
      res.status(400).json({ error: 'Please provide at least a domain, skills, or specific interests.' });
      return;
    }

    const projects = await generateProjectIdeasWithFirebase(body, req.user?.id);
    res.json({
      success: true,
      projects,
      generatedCount: projects.length,
    });
  } catch (err: any) {
    console.error('Project generation error:', err);
    res.status(500).json({ error: 'Failed to generate project ideas. Please try again.' });
  }
});

// Saved Projects Endpoints (Firestore 'savedProjects')
app.get('/api/projects/saved', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const projects = await firestoreGetSavedProjects(req.user!.id);
  res.json({ projects });
});

app.post('/api/projects/save', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const project: ProjectIdea = req.body;
    if (!project || !project.id || !project.title) {
      res.status(400).json({ error: 'Valid project data is required.' });
      return;
    }

    const saved = await firestoreSaveProject(req.user!.id, project);
    res.status(201).json({ success: true, project: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save project.' });
  }
});

app.put('/api/projects/saved/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await firestoreUpdateSavedProjectStatus(
      req.user!.id, 
      id, 
      updates.status || 'considering', 
      updates.studentNotes || updates.notes
    );
    res.json({ success: true, project: updated });
  } catch (err: any) {
    res.status(404).json({ error: err.message || 'Failed to update project.' });
  }
});

app.delete('/api/projects/saved/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await firestoreDeleteSavedProject(req.user!.id, id);
    res.json({ success: true, message: 'Project removed from saved list.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete project.' });
  }
});

// AI Mentor Chat using Firebase AI Logic / Gemini (Firestore 'mentorChats')
app.post('/api/mentor/chat', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { message, projectContext, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required.' });
      return;
    }

    const userId = req.user?.id || 'guest_user';
    const projectId = projectContext?.id || 'general';

    const userMsg: MentorMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      projectId,
    };

    const { reply, suggestedActions } = await askAiMentorWithFirebase({
      userId: req.user?.id,
      userMessage: message,
      projectContext: projectContext || null,
      history: history || [],
      userProfile: req.user ? {
        name: req.user.name,
        degree: req.user.degree,
        college: req.user.college,
      } : undefined,
    });

    const assistantMsg: MentorMessage = {
      id: `msg_${Date.now()}_a`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
      projectId,
      suggestedActions,
    };

    res.json({
      success: true,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    });
  } catch (err: any) {
    console.error('AI Mentor chat error:', err);
    res.status(500).json({ error: 'AI Mentor failed to respond. Please try again.' });
  }
});

app.get('/api/mentor/history', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const projectId = (req.query.projectId as string) || 'general';
  const history = await firestoreGetMentorChat(req.user!.id, projectId);
  res.json({ history });
});

app.delete('/api/mentor/history', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const projectId = (req.query.projectId as string) || 'general';
  await firestoreClearMentorChat(req.user!.id, projectId);
  res.json({ success: true, message: 'Chat history cleared.' });
});

// Student Stats
app.get('/api/user/stats', authMiddleware, (req: AuthenticatedRequest, res) => {
  const stats = db.getUserStats(req.user!.id);
  res.json({ stats });
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
