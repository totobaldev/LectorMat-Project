import { create } from 'zustand';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface H5PResource {
  id: string;
  name: string;
  description: string;
  fileName: string;         // e.g. "interaction.h5p"
  fileSize?: number;        // bytes, optional
  createdAt: string;        // ISO date string
  courseId: string;
  sectionId: string;
}

export interface CourseStudent {
  id: string;
  name: string;
  email: string;
  career: string;
  dateEnrolled: string;
}

export interface CourseSection {
  id: string;
  title: string;            // e.g. "Sección 1: Introducción"
  order: number;
  resources: H5PResource[];
}

export interface TeacherCourse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  sections: CourseSection[];
  enrolledStudents: CourseStudent[];
}

/** Legacy Course type for CourseSearch/CourseCard components — preserved */
export interface Course {
  id: string;
  code: string;
  name: string;
  area: string;
  career: string;
  enrolledStudents: number;
}

export interface TeacherState {
  // Legacy course search state
  courses: Course[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Teacher course management
  teacherCourses: TeacherCourse[];
  addTeacherCourse: (name: string, description: string) => void;
  addSection: (courseId: string, title: string) => void;
  addH5PResource: (
    courseId: string,
    sectionId: string,
    resource: Omit<H5PResource, 'id' | 'createdAt' | 'courseId' | 'sectionId'>
  ) => void;

  // Participant management
  enrollStudent: (courseId: string, name: string, email: string, career: string) => void;
  unenrollStudent: (courseId: string, studentId: string) => void;

  // Content bank
  getAllH5PResources: () => H5PResource[];
}

// ── Mock legacy data & Global Users ────────────────────────────────────────────

export interface GlobalStudent {
  id: string;
  name: string;
  email: string;
  career: string;
}

export const globalStudents: GlobalStudent[] = [
  { id: 'usr_1', name: 'Ana Gómez', email: 'a.gomez@inacapmail.cl', career: 'Ingeniería en Informática' },
  { id: 'usr_2', name: 'Luis Martínez', email: 'l.martinez@inacapmail.cl', career: 'Diseño Gráfico' },
  { id: 'usr_3', name: 'Sofía Castro', email: 's.castro@inacapmail.cl', career: 'Ingeniería en Administración' },
  { id: 'usr_4', name: 'Pedro Morales', email: 'p.morales@inacapmail.cl', career: 'Técnico en Mecánica Automotriz' },
  { id: 'usr_5', name: 'Camila Silva', email: 'c.silva@inacapmail.cl', career: 'Gastronomía Internacional' },
];


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

// ── Mock teacher courses ───────────────────────────────────────────────────────

const mockTeacherCourses: TeacherCourse[] = [
  {
    id: 'tc1',
    name: 'Matemática Básica Aplicada · MAT101',
    description: 'Nivelación matemática para primer año de ingeniería. Cubre álgebra, funciones y aplicaciones.',
    createdAt: '2026-07-15T10:00:00Z',
    sections: [
      {
        id: 'sec1',
        title: 'Sección 1: Funciones Polinómicas',
        order: 1,
        resources: [
          {
            id: 'r1',
            name: 'Introducción a Funciones Polinómicas',
            description: 'Actividad interactiva de comprensión lectora sobre funciones.',
            fileName: 'funciones-intro.h5p',
            fileSize: 245760,
            createdAt: '2026-07-16T09:00:00Z',
            courseId: 'tc1',
            sectionId: 'sec1',
          },
        ],
      },
    ],
    enrolledStudents: [
      {
        id: 'std1',
        name: 'Juan Vega',
        email: 'j.vega@inacapmail.cl',
        career: 'Técnico en Mecánica y Electromovilidad Automotriz',
        dateEnrolled: '2026-07-20T08:00:00Z',
      },
      {
        id: 'std2',
        name: 'María Rojas',
        email: 'm.rojas@inacapmail.cl',
        career: 'Ingeniería en Administración',
        dateEnrolled: '2026-07-21T09:30:00Z',
      },
      {
        id: 'std3',
        name: 'Carlos Torres',
        email: 'c.torres@inacapmail.cl',
        career: 'Técnico en Mecánica y Electromovilidad Automotriz',
        dateEnrolled: '2026-07-22T11:00:00Z',
      },
    ],
  },
];

// ── Store ──────────────────────────────────────────────────────────────────────

let _idCounter = 100;
const uid = () => `id-${++_idCounter}`;

export const useTeacherStore = create<TeacherState>((set, get) => ({
  // Legacy
  courses: mockCourses,
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  // Teacher courses
  teacherCourses: mockTeacherCourses,

  addTeacherCourse: (name, description) =>
    set((state) => ({
      teacherCourses: [
        ...state.teacherCourses,
        {
          id: uid(),
          name,
          description,
          createdAt: new Date().toISOString(),
          sections: [],
          enrolledStudents: [],
        },
      ],
    })),

  addSection: (courseId, title) =>
    set((state) => ({
      teacherCourses: state.teacherCourses.map((c) => {
        if (c.id !== courseId) return c;
        const order = c.sections.length + 1;
        return {
          ...c,
          sections: [
            ...c.sections,
            { id: uid(), title: title || `Sección ${order}`, order, resources: [] },
          ],
        };
      }),
    })),

  addH5PResource: (courseId, sectionId, resource) =>
    set((state) => ({
      teacherCourses: state.teacherCourses.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          sections: c.sections.map((sec) => {
            if (sec.id !== sectionId) return sec;
            return {
              ...sec,
              resources: [
                ...sec.resources,
                {
                  ...resource,
                  id: uid(),
                  createdAt: new Date().toISOString(),
                  courseId,
                  sectionId,
                },
              ],
            };
          }),
        };
      }),
    })),

  enrollStudent: (courseId, name, email, career) =>
    set((state) => ({
      teacherCourses: state.teacherCourses.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          enrolledStudents: [
            ...c.enrolledStudents,
            {
              id: uid(),
              name,
              email,
              career,
              dateEnrolled: new Date().toISOString(),
            },
          ],
        };
      }),
    })),

  unenrollStudent: (courseId, studentId) =>
    set((state) => ({
      teacherCourses: state.teacherCourses.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          enrolledStudents: c.enrolledStudents.filter((s) => s.id !== studentId),
        };
      }),
    })),

  getAllH5PResources: () =>
    get().teacherCourses.flatMap((c) =>
      c.sections.flatMap((sec) => sec.resources)
    ),
}));
