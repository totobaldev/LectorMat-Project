import { create } from 'zustand';

export interface Course {
  id: string;
  code: string;
  name: string;
  area: string;
  career: string;
  enrolledStudents: number;
}

export interface TeacherState {
  courses: Course[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const mockCourses: Course[] = [
  {
    id: 'c1',
    code: 'MAT101',
    name: 'Matemática Básica Aplicada',
    area: 'Ciencias Básicas',
    career: 'Ingeniería en Administración',
    enrolledStudents: 32,
  },
  {
    id: 'c2',
    code: 'MAT201',
    name: 'Funciones y Geometría',
    area: 'Matemática Aplicada',
    career: 'Técnico en Mecánica y Electromovilidad Automotriz',
    enrolledStudents: 28,
  },
  {
    id: 'c3',
    code: 'FIN302',
    name: 'Finanzas Pyme',
    area: 'Administración y Finanzas',
    career: 'Administración',
    enrolledStudents: 45,
  },
  {
    id: 'c4',
    code: 'MEC205',
    name: 'Termodinámica y Motores',
    area: 'Mecánica Automotriz',
    career: 'Ingeniería en Mecánica y Electromovilidad Automotriz',
    enrolledStudents: 24,
  },
];

export const useTeacherStore = create<TeacherState>((set) => ({
  courses: mockCourses,
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
