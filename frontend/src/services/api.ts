const API_BASE_URL = 'http://localhost:4000/api';

export interface RosterStudent {
  name: string;
  email: string;
  career?: string;
}

export const api = {
  async healthCheck() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  async listCourses() {
    const res = await fetch(`${API_BASE_URL}/courses`);
    return res.json();
  },

  async createCourse(name: string, description?: string) {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    return res.json();
  },

  async createSection(courseId: string, title?: string) {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return res.json();
  },

  async importSectionRoster(courseId: string, sectionId: string, students: RosterStudent[]) {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/sections/${sectionId}/roster`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students }),
    });
    return res.json();
  },

  async getSectionStudents(courseId: string, sectionId: string) {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/sections/${sectionId}/students`);
    return res.json();
  },

  async login(email: string, password?: string, role: string = 'student') {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return res.json();
  },
};
