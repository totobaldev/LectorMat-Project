// ─── LectorMat API Service ────────────────────────────────────────────────────
// Centralizes all HTTP calls to the backend.
// Uses VITE_API_URL env variable (falls back to localhost:4000 in dev).
// Attaches JWT token automatically when available.
// ──────────────────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('lectormat-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { ...getAuthHeaders(), ...(options?.headers || {}) },
    });

    const json = await res.json();

    if (!res.ok) {
      return { ok: false, message: json.message || `Error ${res.status}` };
    }

    return { ok: true, data: json };
  } catch (err: any) {
    console.warn('[API Offline]', err?.message || err);
    return { ok: false, message: 'API no disponible. Modo offline activo.' };
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface RosterStudent {
  name: string;
  email: string;
  career?: string;
}

export interface LoginResponse {
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    career: string;
  };
  token: string;
  message?: string;
}

export interface ProgressPayload {
  unitId: number;
  moduleId: string; // 'M1' | 'M2' | 'M3'
  score: number;
  isCompleted: boolean;
}

// ── API Object ───────────────────────────────────────────────────────────────

export const api = {
  // ── Health ──────────────────────────────────────────────────────────────────
  async healthCheck() {
    return apiRequest(`${API_BASE_URL}/health`);
  },

  // ── Auth ────────────────────────────────────────────────────────────────────
  async login(email: string, password: string, role: string = 'student'): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return res.json();
  },

  // ── Courses ─────────────────────────────────────────────────────────────────
  async listCourses() {
    return apiRequest(`${API_BASE_URL}/courses`);
  },

  async listEnrolledCourses() {
    return apiRequest(`${API_BASE_URL}/courses/enrolled`);
  },

  async createCourse(name: string, description?: string) {
    return apiRequest(`${API_BASE_URL}/courses`, {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  async createSection(courseId: string, title?: string) {
    return apiRequest(`${API_BASE_URL}/courses/${courseId}/sections`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  async deleteSection(courseId: string, sectionId: string) {
    return apiRequest(`${API_BASE_URL}/courses/${courseId}/sections/${sectionId}`, {
      method: 'DELETE',
    });
  },


  async createUnit(courseId: string, sectionId: string, title: string, subtitle?: string) {
    return apiRequest(`${API_BASE_URL}/courses/${courseId}/sections/${sectionId}/units`, {
      method: 'POST',
      body: JSON.stringify({ title, subtitle }),
    });
  },

  // ── Roster ──────────────────────────────────────────────────────────────────
  async importSectionRoster(courseId: string, sectionId: string, students: RosterStudent[]) {
    return apiRequest(`${API_BASE_URL}/courses/${courseId}/sections/${sectionId}/roster`, {
      method: 'POST',
      body: JSON.stringify({ students }),
    });
  },

  async getSectionStudents(courseId: string, sectionId: string) {
    return apiRequest(`${API_BASE_URL}/courses/${courseId}/sections/${sectionId}/students`);
  },

  // ── Progress ────────────────────────────────────────────────────────────────
  async saveProgress(payload: ProgressPayload) {
    return apiRequest(`${API_BASE_URL}/progress`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMyProgress() {
    return apiRequest(`${API_BASE_URL}/progress/me`);
  },
};
