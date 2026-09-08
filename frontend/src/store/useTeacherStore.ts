import { create } from 'zustand';
import { api } from '../services/api';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ModuleCategory = 'comprension' | 'metodo' | 'interactivo';
export type ResourceType = 'h5p' | 'pdf' | 'word';

export interface SectionResource {
  id: string;
  name: string;
  description: string;
  resourceType: ResourceType; // 'h5p' | 'pdf' | 'word'
  fileName: string;
  fileSize?: number;
  createdAt: string;
  courseId: string;
  sectionId: string;
  unitId?: string;
  moduleType?: ModuleCategory; // 'comprension' | 'metodo' | 'interactivo'
}

// Legacy alias for backward compatibility
export type H5PResource = SectionResource;

export interface CourseStudent {
  id: string;
  name: string;
  email: string;
  career: string;
  dateEnrolled: string;
  sectionId?: string;
  sectionTitle?: string;
  username?: string;
  password?: string;
  timeSpentReading?: number; // M1 reading time in minutes
  timeSpentCalculating?: number; // M2 calculating time in minutes
}

export interface SectionUnit {
  id: string;
  title: string;              // e.g. "Unidad 3: Trigonometría y Geometría"
  subtitle?: string;           // e.g. "Programa Transforma 2026"
  order: number;
  modules: {
    comprension: SectionResource[];
    metodo: SectionResource[];
    interactivo: SectionResource[];
  };
}

export interface CourseSection {
  id: string;
  title: string;              // e.g. "C1", "C4"
  order: number;
  units: SectionUnit[];
  resources: SectionResource[]; // fallback direct section resources
}

export interface TeacherCourse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  sections: CourseSection[];
  enrolledStudents: CourseStudent[];
}

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

  teacherCourses: TeacherCourse[];
  addTeacherCourse: (name: string, description: string) => void;
  addSection: (courseId: string, title: string) => void;
  addUnit: (courseId: string, sectionId: string, title: string, subtitle?: string) => void;
  removeUnit: (courseId: string, sectionId: string, unitId: string) => void;
  addResource: (
    courseId: string,
    sectionId: string,
    unitId: string,
    moduleType: ModuleCategory,
    resource: { name: string; description: string; resourceType: ResourceType; fileName: string; fileSize?: number }
  ) => void;
  addH5PResource: (
    courseId: string,
    sectionId: string,
    resource: Omit<SectionResource, 'id' | 'createdAt' | 'courseId' | 'sectionId'>
  ) => void;
  removeResource: (courseId: string, sectionId: string, unitId: string, moduleType: ModuleCategory, resourceId: string) => void;

  enrollStudent: (courseId: string, name: string, email: string, career?: string, sectionId?: string, password?: string) => void;
  importSectionStudents: (
    courseId: string,
    sectionId: string,
    students: Array<{ name: string; email: string; career?: string; username?: string; password?: string }>
  ) => void;
  unenrollStudent: (courseId: string, studentId: string) => void;

  getAllH5PResources: () => SectionResource[];
}

// ── Initial Mock Data ──────────────────────────────────────────────────────────

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

const INITIAL_COURSES: TeacherCourse[] = [
  {
    id: 'tc1',
    name: 'Trigonometría y Geometría',
    description: 'Curso de trigonometría básica y sus aplicaciones geométricas.',
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: 'c1',
        title: 'C1',
        order: 1,
        units: [
          {
            id: 'u3',
            title: 'Unidad 3: Trigonometría y Geometría',
            subtitle: 'Programa Transforma 2026',
            order: 1,
            modules: {
              comprension: [
                {
                  id: 'res_1',
                  name: 'Deducción de Medidas y Distancias',
                  description: 'Guía práctica en formato PDF.',
                  resourceType: 'pdf',
                  fileName: 'Guia_Trigonometria_U3.pdf',
                  fileSize: 1548576,
                  createdAt: new Date().toISOString(),
                  courseId: 'tc1',
                  sectionId: 'c1',
                  unitId: 'u3',
                  moduleType: 'comprension'
                }
              ],
              metodo: [
                {
                  id: 'res_2',
                  name: 'Clasificador de Teoremas y Funciones',
                  description: 'Documento Word con tablas y teoría.',
                  resourceType: 'word',
                  fileName: 'Clasificador_Teoremas.docx',
                  fileSize: 854000,
                  createdAt: new Date().toISOString(),
                  courseId: 'tc1',
                  sectionId: 'c1',
                  unitId: 'u3',
                  moduleType: 'metodo'
                }
              ],
              interactivo: [
                {
                  id: 'res_3',
                  name: 'Resolución de problemas de Trigonometría aplicados',
                  description: 'Actividad interactiva paquete H5P.',
                  resourceType: 'h5p',
                  fileName: 'Trigonometria_Interactivas.h5p',
                  fileSize: 4200000,
                  createdAt: new Date().toISOString(),
                  courseId: 'tc1',
                  sectionId: 'c1',
                  unitId: 'u3',
                  moduleType: 'interactivo'
                }
              ]
            }
          }
        ],
        resources: []
      },
      {
        id: 'c4',
        title: 'C4',
        order: 2,
        units: [],
        resources: []
      }
    ],
    enrolledStudents: []
  }
];

export const useTeacherStore = create<TeacherState>((set, get) => ({
  courses: [],
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  teacherCourses: INITIAL_COURSES,

  addTeacherCourse: async (name, description) => {
    // API Call
    api.createCourse(name, description).catch(console.error);
    
    // Optimistic Update
    set((state) => {
      const newCourse: TeacherCourse = {
        id: `tc-${Date.now()}`,
        name,
        description,
        createdAt: new Date().toISOString(),
        sections: [
          { id: `c-${Date.now()}-1`, title: 'C1', order: 1, units: [], resources: [] },
          { id: `c-${Date.now()}-2`, title: 'C4', order: 2, units: [], resources: [] },
        ],
        enrolledStudents: [],
      };
      return { teacherCourses: [newCourse, ...state.teacherCourses] };
    });
  },

  addSection: async (courseId, title) => {
    // API Call
    api.createSection(courseId, title).catch(console.error);

    // Optimistic Update
    set((state) => ({
      teacherCourses: state.teacherCourses.map((c) => {
        if (c.id !== courseId) return c;
        const newSec: CourseSection = {
          id: `c-${Date.now()}`,
          title,
          order: c.sections.length + 1,
          units: [],
          resources: [],
        };
        return { ...c, sections: [...c.sections, newSec] };
      }),
    }));
  },

  addUnit: async (courseId, sectionId, title, subtitle) => {
    api.createUnit(courseId, sectionId, title, subtitle).catch(console.error);

    set((state) => ({
      teacherCourses: state.teacherCourses.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          sections: course.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const newUnit: SectionUnit = {
              id: `unit-${Date.now()}`,
              title,
              subtitle: subtitle || 'Programa Transforma 2026',
              order: (section.units?.length || 0) + 1,
              modules: {
                comprension: [],
                metodo: [],
                interactivo: [],
              },
            };
            return {
              ...section,
              units: [...(section.units || []), newUnit],
            };
          }),
        };
      }),
    }));
  },

  removeUnit: (courseId, sectionId, unitId) =>
    set((state) => ({
      teacherCourses: state.teacherCourses.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          sections: course.sections.map((section) => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              units: (section.units || []).filter((u) => u.id !== unitId),
            };
          }),
        };
      }),
    })),

  addResource: (courseId, sectionId, unitId, moduleType, resourceData) =>
    set((state) => ({
      teacherCourses: state.teacherCourses.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          sections: course.sections.map((section) => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              units: (section.units || []).map((unit) => {
                if (unit.id !== unitId) return unit;
                const newRes: SectionResource = {
                  id: `res-${Date.now()}`,
                  name: resourceData.name,
                  description: resourceData.description,
                  resourceType: resourceData.resourceType,
                  fileName: resourceData.fileName,
                  fileSize: resourceData.fileSize,
                  createdAt: new Date().toISOString(),
                  courseId,
                  sectionId,
                  unitId,
                  moduleType,
                };
                return {
                  ...unit,
                  modules: {
                    ...unit.modules,
                    [moduleType]: [...(unit.modules[moduleType] || []), newRes],
                  },
                };
              }),
            };
          }),
        };
      }),
    })),

  addH5PResource: (courseId, sectionId, resource) =>
    set((state) => {
      const resId = `h5p-${Date.now()}`;
      const newRes: SectionResource = {
        id: resId,
        name: resource.name,
        description: resource.description,
        fileName: resource.fileName,
        fileSize: resource.fileSize,
        resourceType: 'h5p',
        createdAt: new Date().toISOString(),
        courseId,
        sectionId,
      };

      return {
        teacherCourses: state.teacherCourses.map((c) => {
          if (c.id !== courseId) return c;
          return {
            ...c,
            sections: c.sections.map((sec) => {
              if (sec.id !== sectionId) return sec;
              // If unit exists, place into first unit interactivo module, else section resources
              if (sec.units && sec.units.length > 0) {
                const updatedUnits = [...sec.units];
                updatedUnits[0].modules.interactivo.push(newRes);
                return { ...sec, units: updatedUnits };
              }
              return { ...sec, resources: [...(sec.resources || []), newRes] };
            }),
          };
        }),
      };
    }),

  removeResource: (courseId, sectionId, unitId, moduleType, resourceId) =>
    set((state) => ({
      teacherCourses: state.teacherCourses.map((course) => {
        if (course.id !== courseId) return course;
        return {
          ...course,
          sections: course.sections.map((section) => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              units: (section.units || []).map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  modules: {
                    ...unit.modules,
                    [moduleType]: (unit.modules[moduleType] || []).filter((r) => r.id !== resourceId),
                  },
                };
              }),
            };
          }),
        };
      }),
    })),

  enrollStudent: (courseId, name, email, career = 'Técnico-Profesional', sectionId, password) =>
    set((state) => ({
      teacherCourses: state.teacherCourses.map((c) => {
        if (c.id !== courseId) return c;
        const newStudent: CourseStudent = {
          id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          name,
          email,
          career,
          dateEnrolled: new Date().toISOString(),
          sectionId: sectionId || c.sections[0]?.id,
          password: password || 'NOMBREalbornoz',
          timeSpentReading: Math.floor(Math.random() * 30) + 10,
          timeSpentCalculating: Math.floor(Math.random() * 40) + 15,
        };
        return { ...c, enrolledStudents: [...(c.enrolledStudents || []), newStudent] };
      }),
    })),

  importSectionStudents: async (courseId, sectionId, students) => {
    // Map to expected format
    const payload = students.map(s => ({ name: s.name, email: s.email, career: s.career }));
    api.importSectionRoster(courseId, sectionId, payload).catch(console.error);

    set((state) => ({
      teacherCourses: state.teacherCourses.map((c) => {
        if (c.id !== courseId) return c;

        const sec = c.sections.find((s) => s.id === sectionId);
        const existingEmails = new Set((c.enrolledStudents || []).map((s) => s.email));

        const newStudents: CourseStudent[] = students
          .filter((s) => !existingEmails.has(s.email.toLowerCase()))
          .map((s) => ({
            id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            name: s.name,
            email: s.email.toLowerCase(),
            career: s.career || 'Técnico-Profesional',
            dateEnrolled: new Date().toISOString(),
            sectionId,
            sectionTitle: sec?.title,
            username: s.username || s.email,
            password: s.password,
            timeSpentReading: Math.floor(Math.random() * 30) + 10,
            timeSpentCalculating: Math.floor(Math.random() * 40) + 15,
          }));

        return { ...c, enrolledStudents: [...(c.enrolledStudents || []), ...newStudents] };
      }),
    }));
  },

  unenrollStudent: (courseId, studentId) =>
    set((state) => ({
      teacherCourses: state.teacherCourses.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          enrolledStudents: (c.enrolledStudents || []).filter((s) => s.id !== studentId),
        };
      }),
    })),

  getAllH5PResources: () => {
    const all: SectionResource[] = [];
    get().teacherCourses.forEach((course) => {
      course.sections.forEach((sec) => {
        (sec.resources || []).forEach((r) => all.push(r));
        (sec.units || []).forEach((u) => {
          Object.values(u.modules).forEach((modResList) => {
            modResList.forEach((r) => all.push(r));
          });
        });
      });
    });
    return all;
  },
}));
