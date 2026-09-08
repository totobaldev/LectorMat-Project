import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { U3_ROOT_NODE_ID } from '../features/decision-tree/data/u3Nodes';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModuleType = 'M1' | 'M2' | 'M3';

export interface UnitProgress {
  score: number | null;
  isCompleted: boolean;
  attempts: number;
}

export interface StudentProgress {
  preModule: UnitProgress;
  units: Record<1 | 2 | 3 | 4, UnitProgress>;
}

/** Entrada del historial del árbol de decisión */
export interface M2PathEntry {
  question: string;
  answer: 'Sí' | 'No';
}

export type AppRole = 'student' | 'teacher' | null;

export interface ProgressState {
  // ── Auth / Session ────────────────────────────────────────────────────────
  isAuthenticated: boolean;
  isTeacherUnlocked: boolean;

  // ── Role Gateway ──────────────────────────────────────────────────────────
  role: AppRole;
  studentEmail: string | null;
  studentName: string | null;
  setStudentSession: (email: string, name: string) => void;

  // ── Identity ──────────────────────────────────────────────────────────────
  selectedCareer: string | null;
  selectedArea: string | null;
  activeModule: ModuleType;

  // ── General progress ──────────────────────────────────────────────────────
  progress: StudentProgress;

  // ── M2: Árbol de Decisión ─────────────────────────────────────────────────
  /** ID del nodo actual en el árbol */
  currentM2NodeId: string;
  /** Historial de preguntas respondidas */
  m2PathHistory: M2PathEntry[];

  // ── Actions ───────────────────────────────────────────────────────────────
  login: () => void;
  logout: () => void;
  setRole: (role: 'student' | 'teacher') => void;
  unlockTeacherPanel: () => void;
  setCareer: (career: string, area: string) => void;
  setActiveModule: (module: ModuleType) => void;
  updatePreModule: (score: number, completed?: boolean) => void;
  updateUnit: (unitId: 1 | 2 | 3 | 4, score: number, completed?: boolean) => void;
  resetProgress: () => void;
  clearSession: () => void;

  // ── FRONT compatibility ───────────────────────────────────────────────────
  /** Carrera seleccionada (alias del prototipo FRONT) */
  career: string | null;
  subject: 'Funciones y Progresiones' | 'Funciones y Geometría' | null;
  preSpecialty: 'mecanica' | 'administracion' | null;
  preCompleted: boolean;
  preScore: number | null;
  // U1
  m1SlotsPlaced: number;
  m1Completed: boolean;
  m2NodesVisited: number;
  m2Completed: boolean;
  m3CompletedLevels: number;
  m3Completed: boolean;
  // U2
  u2m1SlotsPlaced: number;
  u2m1Completed: boolean;
  u2m2NodesVisited: number;
  u2m2Completed: boolean;
  u2m3CompletedLevels: number;
  u2m3Completed: boolean;
  // U3
  u3m1SlotsPlaced: number;
  u3m1Completed: boolean;
  u3m2NodesVisited: number;
  u3m2Completed: boolean;
  u3m3CompletedLevels: number;
  u3m3Completed: boolean;
  // U4
  u4m1SlotsPlaced: number;
  u4m1Completed: boolean;
  u4m2NodesVisited: number;
  u4m2Completed: boolean;
  u4m3CompletedLevels: number;
  u4m3Completed: boolean;
  /** Merge-update any FRONT progress field */
  updateProgress: (updates: Partial<ProgressState>) => void;

  // ── M2 actions ────────────────────────────────────────────────────────────
  /**
   * Registra la respuesta a la pregunta actual y avanza al siguiente nodo.
   * @param nextNodeId  Nodo al que se navega
   * @param question    Texto de la pregunta respondida
   * @param answer      "Sí" | "No"
   */
  answerM2Question: (nextNodeId: string, question: string, answer: 'Sí' | 'No') => void;

  /** Reinicia el árbol al nodo raíz y limpia historial */
  resetM2: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultUnitProgress = (): UnitProgress => ({
  score: null,
  isCompleted: false,
  attempts: 0,
});

const defaultProgress = (): StudentProgress => ({
  preModule: defaultUnitProgress(),
  units: {
    1: defaultUnitProgress(),
    2: defaultUnitProgress(),
    3: defaultUnitProgress(),
    4: defaultUnitProgress(),
  },
});

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isTeacherUnlocked: false,
      role: null,
      studentEmail: null,
      studentName: null,
      selectedCareer: null,
      selectedArea: null,
      activeModule: 'M1',
      progress: defaultProgress(),

      // M2 initial state
      currentM2NodeId: U3_ROOT_NODE_ID,
      m2PathHistory: [],

      // FRONT compatibility initial state
      career: null,
      subject: null,
      preSpecialty: null,
      preCompleted: false,
      preScore: null,
      m1SlotsPlaced: 0,
      m1Completed: false,
      m2NodesVisited: 0,
      m2Completed: false,
      m3CompletedLevels: 0,
      m3Completed: false,
      u2m1SlotsPlaced: 0,
      u2m1Completed: false,
      u2m2NodesVisited: 0,
      u2m2Completed: false,
      u2m3CompletedLevels: 0,
      u2m3Completed: false,
      u3m1SlotsPlaced: 0,
      u3m1Completed: false,
      u3m2NodesVisited: 0,
      u3m2Completed: false,
      u3m3CompletedLevels: 0,
      u3m3Completed: false,
      u4m1SlotsPlaced: 0,
      u4m1Completed: false,
      u4m2NodesVisited: 0,
      u4m2Completed: false,
      u4m3CompletedLevels: 0,
      u4m3Completed: false,

       // Auth actions
      login: () => set({ isAuthenticated: true }),
      setStudentSession: (email, name) => set({ studentEmail: email, studentName: name }),
      logout: () => set({ 
        isAuthenticated: false, 
        role: null, 
        studentEmail: null,
        studentName: null,
        isTeacherUnlocked: false,
        career: null,
        subject: null,
        preSpecialty: null,
        preCompleted: false,
        preScore: null,
        m1SlotsPlaced: 0,
        m1Completed: false,
        m2NodesVisited: 0,
        m2Completed: false,
        m3CompletedLevels: 0,
        m3Completed: false,
        u2m1SlotsPlaced: 0,
        u2m1Completed: false,
        u2m2NodesVisited: 0,
        u2m2Completed: false,
        u2m3CompletedLevels: 0,
        u2m3Completed: false,
        u3m1SlotsPlaced: 0,
        u3m1Completed: false,
        u3m2NodesVisited: 0,
        u3m2Completed: false,
        u3m3CompletedLevels: 0,
        u3m3Completed: false,
        u4m1SlotsPlaced: 0,
        u4m1Completed: false,
        u4m2NodesVisited: 0,
        u4m2Completed: false,
        u4m3CompletedLevels: 0,
        u4m3Completed: false,
        progress: defaultProgress(),
        selectedCareer: null,
        selectedArea: null,
        activeModule: 'M1',
        currentM2NodeId: U3_ROOT_NODE_ID,
        m2PathHistory: [],
      }),
      unlockTeacherPanel: () => set({ isTeacherUnlocked: true }),

      // Role actions
      setRole: (role) => set({ role }),

      // FRONT updateProgress action
      updateProgress: (updates) => set((state) => ({ ...state, ...updates })),

      // General actions
      setCareer: (career, area) => set({ selectedCareer: career, selectedArea: area }),
      setActiveModule: (module) => set({ activeModule: module }),

      updatePreModule: (score, completed = false) =>
        set((state) => ({
          progress: {
            ...state.progress,
            preModule: {
              score,
              isCompleted: completed,
              attempts: state.progress.preModule.attempts + 1,
            },
          },
        })),

      updateUnit: (unitId, score, completed = false) =>
        set((state) => ({
          progress: {
            ...state.progress,
            units: {
              ...state.progress.units,
              [unitId]: {
                score,
                isCompleted: completed,
                attempts: state.progress.units[unitId].attempts + 1,
              },
            },
          },
        })),

      resetProgress: () => set({ progress: defaultProgress() }),

      clearSession: () =>
        set({
          studentEmail: null,
          studentName: null,
          selectedCareer: null,
          selectedArea: null,
          activeModule: 'M1',
          progress: defaultProgress(),
          currentM2NodeId: U3_ROOT_NODE_ID,
          m2PathHistory: [],
        }),

      // M2 actions
      answerM2Question: (nextNodeId, question, answer) =>
        set((state) => ({
          currentM2NodeId: nextNodeId,
          m2PathHistory: [...state.m2PathHistory, { question, answer }],
        })),

      resetM2: () =>
        set({
          currentM2NodeId: U3_ROOT_NODE_ID,
          m2PathHistory: [],
        }),
    }),
    {
      name: 'lectormat-progress',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isTeacherUnlocked: state.isTeacherUnlocked,
        role: state.role,
        studentEmail: state.studentEmail,
        studentName: state.studentName,
        selectedCareer: state.selectedCareer,
        selectedArea: state.selectedArea,
        activeModule: state.activeModule,
        progress: state.progress,
        currentM2NodeId: state.currentM2NodeId,
        m2PathHistory: state.m2PathHistory,
        // FRONT fields
        career: state.career,
        subject: state.subject,
        preSpecialty: state.preSpecialty,
        preCompleted: state.preCompleted,
        preScore: state.preScore,
        m1SlotsPlaced: state.m1SlotsPlaced,
        m1Completed: state.m1Completed,
        m2NodesVisited: state.m2NodesVisited,
        m2Completed: state.m2Completed,
        m3CompletedLevels: state.m3CompletedLevels,
        m3Completed: state.m3Completed,
        u2m1SlotsPlaced: state.u2m1SlotsPlaced,
        u2m1Completed: state.u2m1Completed,
        u2m2NodesVisited: state.u2m2NodesVisited,
        u2m2Completed: state.u2m2Completed,
        u2m3CompletedLevels: state.u2m3CompletedLevels,
        u2m3Completed: state.u2m3Completed,
        u3m1SlotsPlaced: state.u3m1SlotsPlaced,
        u3m1Completed: state.u3m1Completed,
        u3m2NodesVisited: state.u3m2NodesVisited,
        u3m2Completed: state.u3m2Completed,
        u3m3CompletedLevels: state.u3m3CompletedLevels,
        u3m3Completed: state.u3m3Completed,
        u4m1SlotsPlaced: state.u4m1SlotsPlaced,
        u4m1Completed: state.u4m1Completed,
        u4m2NodesVisited: state.u4m2NodesVisited,
        u4m2Completed: state.u4m2Completed,
        u4m3CompletedLevels: state.u4m3CompletedLevels,
        u4m3Completed: state.u4m3Completed,
      }),
    }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectOverallProgress = (state: ProgressState): number => {
  const { preModule, units } = state.progress;
  const all = [preModule, units[1], units[2], units[3], units[4]];
  const completed = all.filter((u) => u.isCompleted).length;
  return Math.round((completed / all.length) * 100);
};

export const selectNextUnit = (state: ProgressState): number => {
  const { preModule, units } = state.progress;
  if (!preModule.isCompleted) return 0;
  for (let i = 1; i <= 4; i++) {
    if (!units[i as 1 | 2 | 3 | 4].isCompleted) return i;
  }
  return -1;
};
