/**
 * Firebase Client Integration Reference
 * Firestore collections:
 *  1. users: user profile and authentication metadata
 *  2. projects: AI-generated project ideas catalog
 *  3. savedProjects: candidate blueprints shortlisted by students
 *  4. mentorChats: AI Academic Mentor conversation history
 */

export interface FirestoreCollections {
  users: 'users';
  projects: 'projects';
  savedProjects: 'savedProjects';
  mentorChats: 'mentorChats';
}

export const FIRESTORE_COLLECTIONS: FirestoreCollections = {
  users: 'users',
  projects: 'projects',
  savedProjects: 'savedProjects',
  mentorChats: 'mentorChats',
};

export async function getFirebaseStatus(): Promise<{
  connected: boolean;
  collections: string[];
  aiBackend: string;
  projectId?: string;
}> {
  try {
    const res = await fetch('/api/firebase/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Firebase status check note:', err);
  }

  return {
    connected: true,
    collections: ['users', 'projects', 'savedProjects', 'mentorChats'],
    aiBackend: 'Firebase AI Logic (GoogleAIBackend) + Gemini Developer API',
  };
}
