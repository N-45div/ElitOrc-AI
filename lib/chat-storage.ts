export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: File[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'elitorc_chat_sessions';
const CURRENT_SESSION_KEY = 'elitorc_current_session';

export class ChatStorage {
  static getAllSessions(): ChatSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      return sessions.map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      return [];
    }
  }

  static getSession(sessionId: string): ChatSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(session => session.id === sessionId) || null;
  }

  static saveSession(session: ChatSession): void {
    try {
      const sessions = this.getAllSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.unshift(session); // Add new sessions to the beginning
      }

      // Keep only the last 50 sessions to prevent storage bloat
      const trimmedSessions = sessions.slice(0, 50);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedSessions));
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  }

  static deleteSession(sessionId: string): void {
    try {
      const sessions = this.getAllSessions();
      const filteredSessions = sessions.filter(session => session.id !== sessionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  }

  static getCurrentSessionId(): string | null {
    try {
      return localStorage.getItem(CURRENT_SESSION_KEY);
    } catch (error) {
      console.error('Error getting current session ID:', error);
      return null;
    }
  }

  static setCurrentSessionId(sessionId: string): void {
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
    } catch (error) {
      console.error('Error setting current session ID:', error);
    }
  }

  static createNewSession(): ChatSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: ChatSession = {
      id: sessionId,
      title: 'New Clinical Consultation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.saveSession(session);
    this.setCurrentSessionId(sessionId);
    return session;
  }

  static updateSessionTitle(sessionId: string, title: string): void {
    const session = this.getSession(sessionId);
    if (session) {
      session.title = title;
      session.updatedAt = new Date();
      this.saveSession(session);
    }
  }

  static addMessageToSession(sessionId: string, message: ChatMessage): void {
    const session = this.getSession(sessionId);
    if (session) {
      session.messages.push(message);
      session.updatedAt = new Date();
      
      // Auto-generate title from first user message
      if (session.messages.length === 1 && message.role === 'user') {
        const title = message.content.length > 50 
          ? message.content.substring(0, 50) + '...'
          : message.content;
        session.title = title;
      }
      
      this.saveSession(session);
    }
  }

  static clearAllSessions(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CURRENT_SESSION_KEY);
    } catch (error) {
      console.error('Error clearing chat sessions:', error);
    }
  }
}
