/**
 * useFrontProps – Puente de compatibilidad entre el prototipo FRONT
 * (que usa SharedProps + setScreen) y el /frontend actual
 * (que usa Zustand + React Router useNavigate).
 *
 * Los componentes migrados de FRONT desestructuran estas props
 * directamente sin necesidad de modificar su lógica interna.
 */
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';

// Mapa de Screen → ruta de React Router
const SCREEN_TO_PATH: Record<string, string> = {
  home:      '/',
  dashboard: '/dashboard',
  pre_m1:    '/pre',
  m1:        '/unit/1/module/1',
  m2:        '/unit/1/module/2',
  m3:        '/unit/1/module/3',
  m4:        '/unit/1/module/4',
  u2m1:      '/unit/2/module/1',
  u2m2:      '/unit/2/module/2',
  u2m3:      '/unit/2/module/3',
  u3m1:      '/unit/3/module/1',
  u3m2:      '/unit/3/module/2',
  u3m3:      '/unit/3/module/3',
  u4m1:      '/unit/4/module/1',
  u4m2:      '/unit/4/module/2',
  u4m3:      '/unit/4/module/3',
  feedback:  '/feedback',
};

// Mapa inverso: ruta → Screen
const PATH_TO_SCREEN: Record<string, string> = Object.fromEntries(
  Object.entries(SCREEN_TO_PATH).map(([k, v]) => [v, k])
);

export function useFrontProps() {
  const navigate = useNavigate();
  const store    = useProgressStore();

  /** Navega usando el sistema Screen del prototipo FRONT */
  const setScreen = (screen: string) => {
    const path = SCREEN_TO_PATH[screen];
    if (path) navigate(path);
  };

  /** Devuelve el Screen equivalente a la ruta actual */
  const currentScreen = PATH_TO_SCREEN[window.location.pathname] ?? 'home';

  const progress = {
    career:            store.career,
    subject:           store.subject,
    preSpecialty:      store.preSpecialty,
    preCompleted:      store.preCompleted,
    preScore:          store.preScore,
    m1SlotsPlaced:     store.m1SlotsPlaced,
    m1Completed:       store.m1Completed,
    m2NodesVisited:    store.m2NodesVisited,
    m2Completed:       store.m2Completed,
    m3CompletedLevels: store.m3CompletedLevels,
    m3Completed:       store.m3Completed,
    u2m1SlotsPlaced:   store.u2m1SlotsPlaced,
    u2m1Completed:     store.u2m1Completed,
    u2m2NodesVisited:  store.u2m2NodesVisited,
    u2m2Completed:     store.u2m2Completed,
    u2m3CompletedLevels: store.u2m3CompletedLevels,
    u2m3Completed:     store.u2m3Completed,
    u3m1SlotsPlaced:   store.u3m1SlotsPlaced,
    u3m1Completed:     store.u3m1Completed,
    u3m2NodesVisited:  store.u3m2NodesVisited,
    u3m2Completed:     store.u3m2Completed,
    u3m3CompletedLevels: store.u3m3CompletedLevels,
    u3m3Completed:     store.u3m3Completed,
    u4m1SlotsPlaced:   store.u4m1SlotsPlaced,
    u4m1Completed:     store.u4m1Completed,
    u4m2NodesVisited:  store.u4m2NodesVisited,
    u4m2Completed:     store.u4m2Completed,
    u4m3CompletedLevels: store.u4m3CompletedLevels,
    u4m3Completed:     store.u4m3Completed,
  };

  return {
    currentScreen,
    setScreen,
    progress,
    updateProgress: store.updateProgress,
    isTeacher:      store.isTeacherUnlocked,
    setIsTeacher:   (val: boolean) => {
      if (val) {
        store.unlockTeacherPanel();
      } else {
        useProgressStore.setState({ isTeacherUnlocked: false });
      }
    },
  };
}
