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

export interface ProgressState {
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
  setCareer: (career: string, area: string) => void;
  setActiveModule: (module: ModuleType) => void;
  updatePreModule: (score: number, completed?: boolean) => void;
  updateUnit: (unitId: 1 | 2 | 3 | 4, score: number, completed?: boolean) => void;
  resetProgress: () => void;
  clearSession: () => void;

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
      selectedCareer: null,
      selectedArea: null,
      activeModule: 'M1',
      progress: defaultProgress(),

      // M2 initial state
      currentM2NodeId: U3_ROOT_NODE_ID,
      m2PathHistory: [],

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
        selectedCareer: state.selectedCareer,
        selectedArea: state.selectedArea,
        activeModule: state.activeModule,
        progress: state.progress,
        currentM2NodeId: state.currentM2NodeId,
        m2PathHistory: state.m2PathHistory,
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
