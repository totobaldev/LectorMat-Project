export type Screen = 'home' | 'dashboard' | 'pre_m1' | 'm1' | 'm2' | 'm3' | 'm4' | 'feedback' | 'u2m1' | 'u2m2' | 'u2m3' | 'u3m1' | 'u3m2' | 'u3m3' | 'u4m1' | 'u4m2' | 'u4m3';

export interface ProgressState {
  preCompleted?: boolean;
  preSpecialty?: 'mecanica' | 'administracion' | null;
  career?: 'Ingeniería en Administración' | 'Administración' | 'Técnico en Mecánica y Electromovilidad Automotriz' | 'Ingeniería en Mecánica y Electromovilidad Automotriz' | null;
  subject?: 'Funciones y Progresiones' | 'Funciones y Geometría' | null;
  preScore?: number;
  m1SlotsPlaced: number;
  m1Completed: boolean;
  m2NodesVisited: number;
  m2Completed: boolean;
  m3CompletedLevels: number;
  m3Completed: boolean;
  u2m1SlotsPlaced?: number;
  u2m1Completed?: boolean;
  u2m2NodesVisited?: number;
  u2m2Completed?: boolean;
  u2m3CompletedLevels?: number;
  u2m3Completed?: boolean;
  u3m1SlotsPlaced?: number;
  u3m1Completed?: boolean;
  u3m2NodesVisited?: number;
  u3m2Completed?: boolean;
  u3m3CompletedLevels?: number;
  u3m3Completed?: boolean;
  u4m1SlotsPlaced?: number;
  u4m1Completed?: boolean;
  u4m2NodesVisited?: number;
  u4m2Completed?: boolean;
  u4m3CompletedLevels?: number;
  u4m3Completed?: boolean;
}

export interface SharedProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  progress: ProgressState;
  updateProgress: (updates: Partial<ProgressState>) => void;
  isTeacher: boolean;
  setIsTeacher: (val: boolean) => void;
}
