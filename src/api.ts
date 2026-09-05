import type { User, ProjectIdea, ProjectGenerationRequest, MentorMessage, UserStats } from './types';

const TOKEN_KEY = 'capstone_ai_token';
const USER_KEY = 'capstone_ai_user';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

function getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  const token = authStorage.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Health
  async getHealth(): Promise<{ status: string; aiConfigured: boolean }> {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Auth
  async register(data: {
    name: string;
    email: string;
    password: string;
    college?: string;
    degree?: string;
    graduationYear?: string;
  }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Registration failed');
    authStorage.setToken(json.token);
    authStorage.setUser(json.user);
    return json;
  },

  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    authStorage.setToken(json.token);
    authStorage.setUser(json.user);
    return json;
  },

  async demoLogin(): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/demo', {
      method: 'POST',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Demo login failed');
    authStorage.setToken(json.token);
    authStorage.setUser(json.user);
    return json;
  },

  async getMe(): Promise<{ user: User; stats: UserStats }> {
    const res = await fetch('/api/auth/me', {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch user');
    authStorage.setUser(json.user);
    return json;
  },

  logout(): void {
    authStorage.removeToken();
  },

  // Projects
  async generateProjects(params: ProjectGenerationRequest): Promise<ProjectIdea[]> {
    const res = await fetch('/api/projects/generate', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to generate projects');
    return json.projects || [];
  },

  async getSavedProjects(): Promise<ProjectIdea[]> {
    const res = await fetch('/api/projects/saved', {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch saved projects');
    return json.projects || [];
  },

  async saveProject(project: ProjectIdea): Promise<ProjectIdea> {
    const res = await fetch('/api/projects/save', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save project');
    return json.project;
  },

  async updateSavedProject(id: string, updates: Partial<ProjectIdea>): Promise<ProjectIdea> {
    const res = await fetch(`/api/projects/saved/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update project');
    return json.project;
  },

  async deleteSavedProject(id: string): Promise<boolean> {
    const res = await fetch(`/api/projects/saved/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete project');
    return true;
  },

  // Mentor Chat
  async askMentor(data: {
    message: string;
    projectContext?: ProjectIdea | null;
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
  }): Promise<{ userMessage: MentorMessage; assistantMessage: MentorMessage }> {
    const res = await fetch('/api/mentor/chat', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'AI Mentor failed to respond');
    return json;
  },

  async getMentorHistory(projectId?: string): Promise<MentorMessage[]> {
    const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const res = await fetch(`/api/mentor/history${query}`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load chat history');
    return json.history || [];
  },

  async clearMentorHistory(projectId?: string): Promise<void> {
    const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const res = await fetch(`/api/mentor/history${query}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to clear chat history');
  },

  async getUserStats(): Promise<UserStats> {
    const res = await fetch('/api/user/stats', {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch stats');
    return json.stats;
  },
};
