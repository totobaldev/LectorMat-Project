import { useProgressStore, type ProgressState } from '../store/useProgressStore';

// ─── Computed Progress Values ────────────────────────────────────────────────
// Centralizes all unit progress calculations that were duplicated across
// MainLayout, CoursesPage, and DashboardPage.
// ─────────────────────────────────────────────────────────────────────────────

export interface UnitComputedProgress {
  id: string;
  unitNum: number;
  m1Pct: number;
  m2Pct: number;
  m3Pct: number;
  overall: number;
  isCompleted: boolean;
}

export interface StudentProgressData {
  units: UnitComputedProgress[];
  overallPct: number;
  activeMaterial: {
    title: string;
    subtitle: string;
    path: string;
    pct: number;
    unitName: string;
    unitPct: number;
  };
  isAdmin: boolean;
  u3Title: string;
}

export function useStudentProgress(): StudentProgressData {
  const p = useProgressStore();

  // ── U1 ──────────────────────────────────────────────────────────────────────
  const u1m1 = p.m1Completed ? 100 : Math.round((p.m1SlotsPlaced / 3) * 55);
  const u1m2 = p.m2Completed ? 100 : Math.min(85, p.m2NodesVisited * 30);
  const u1m3 = Math.round((p.m3CompletedLevels / 3) * 100);
  const overallU1 = Math.round((u1m1 + u1m2 + u1m3) / 3);

  // ── U2 ──────────────────────────────────────────────────────────────────────
  const u2m1 = p.u2m1Completed ? 100 : Math.round(((p.u2m1SlotsPlaced || 0) / 4) * 55);
  const u2m2 = p.u2m2Completed ? 100 : Math.min(85, (p.u2m2NodesVisited || 0) * 30);
  const u2m3 = Math.round(((p.u2m3CompletedLevels || 0) / 3) * 100);
  const overallU2 = Math.round((u2m1 + u2m2 + u2m3) / 3);

  // ── U3 ──────────────────────────────────────────────────────────────────────
  const u3m1 = p.u3m1Completed ? 100 : Math.round(((p.u3m1SlotsPlaced || 0) / 4) * 55);
  const u3m2 = p.u3m2Completed ? 100 : Math.min(85, (p.u3m2NodesVisited || 0) * 30);
  const u3m3 = Math.round(((p.u3m3CompletedLevels || 0) / 3) * 100);
  const overallU3 = Math.round((u3m1 + u3m2 + u3m3) / 3);

  // ── U4 ──────────────────────────────────────────────────────────────────────
  const u4m1 = p.u4m1Completed ? 100 : Math.round(((p.u4m1SlotsPlaced || 0) / 3) * 100);
  const u4m2 = p.u4m2Completed ? 100 : Math.min(85, (p.u4m2NodesVisited || 0) * 30);
  const u4m3 = Math.round(((p.u4m3CompletedLevels || 0) / 3) * 100);
  const overallU4 = Math.round((u4m1 + u4m2 + u4m3) / 3);

  const isAdmin = p.preSpecialty === 'administracion';
  const u3Title = p.preSpecialty === 'mecanica'
    ? 'Unidad 3: Trigonometría y Geometría'
    : 'Unidad 3: Progresiones y Sucesiones';

  const units: UnitComputedProgress[] = [
    { id: 'u1', unitNum: 1, m1Pct: u1m1, m2Pct: u1m2, m3Pct: u1m3, overall: overallU1, isCompleted: p.m1Completed && p.m2Completed && p.m3Completed },
    { id: 'u2', unitNum: 2, m1Pct: u2m1, m2Pct: u2m2, m3Pct: u2m3, overall: overallU2, isCompleted: p.u2m1Completed && p.u2m2Completed && p.u2m3Completed },
    { id: 'u3', unitNum: 3, m1Pct: u3m1, m2Pct: u3m2, m3Pct: u3m3, overall: overallU3, isCompleted: p.u3m1Completed && p.u3m2Completed && p.u3m3Completed },
    ...(isAdmin ? [{ id: 'u4', unitNum: 4, m1Pct: u4m1, m2Pct: u4m2, m3Pct: u4m3, overall: overallU4, isCompleted: p.u4m1Completed && p.u4m2Completed && p.u4m3Completed }] : []),
  ];

  const totalUnits = units.length;
  const prePct = p.preCompleted ? 100 : (p.preScore ? Math.round((p.preScore / 10) * 100) : 0);
  const overallPct = Math.round((prePct + units.reduce((acc, u) => acc + u.overall, 0)) / (totalUnits + 1));

  // ── Continuity target ─────────────────────────────────────────────────────
  const getActiveMaterial = () => {
    if (!p.preCompleted) {
      return {
        title: 'Módulo Comprensión Lectora',
        subtitle: 'Nivelación Inicial de Lectura',
        path: '/pre',
        pct: prePct || 15,
        unitName: 'Lectura Avanzada',
        unitPct: prePct || 15,
      };
    }
    if (!p.m1Completed) {
      return { title: 'U1 M1: Comprensión', subtitle: 'Funciones Polinómicas', path: '/unit/1/module/1', pct: u1m1 || 20, unitName: 'Unidad 1', unitPct: overallU1 };
    }
    if (!p.m2Completed) {
      return { title: 'U1 M2: Método', subtitle: 'Árbol de Decisión Polinómico', path: '/unit/1/module/2', pct: u1m2 || 35, unitName: 'Unidad 1', unitPct: overallU1 };
    }
    if (!p.m3Completed) {
      return { title: 'U1 M3: Banco de Problemas', subtitle: 'Ejercicios Polinómicos', path: '/unit/1/module/3', pct: u1m3 || 15, unitName: 'Unidad 1', unitPct: overallU1 };
    }
    if (!p.u2m1Completed || !p.u2m2Completed || !p.u2m3Completed) {
      return {
        title: 'U2: Func. Exponenciales',
        subtitle: !p.u2m1Completed ? 'M1: Comprensión' : !p.u2m2Completed ? 'M2: Método' : 'M3: Banco',
        path: !p.u2m1Completed ? '/unit/2/module/1' : !p.u2m2Completed ? '/unit/2/module/2' : '/unit/2/module/3',
        pct: overallU2 || 20,
        unitName: 'Unidad 2',
        unitPct: overallU2,
      };
    }
    if (!p.u3m1Completed || !p.u3m2Completed || !p.u3m3Completed) {
      return {
        title: p.preSpecialty === 'administracion' ? 'U3: Progresiones' : 'U3: Trigonometría',
        subtitle: !p.u3m1Completed ? 'M1: Comprensión' : !p.u3m2Completed ? 'M2: Método' : 'M3: Banco',
        path: !p.u3m1Completed ? '/unit/3/module/1' : !p.u3m2Completed ? '/unit/3/module/2' : '/unit/3/module/3',
        pct: overallU3 || 15,
        unitName: 'Unidad 3',
        unitPct: overallU3,
      };
    }
    if (isAdmin && (!p.u4m1Completed || !p.u4m2Completed || !p.u4m3Completed)) {
      return {
        title: 'U4: Finanzas',
        subtitle: !p.u4m1Completed ? 'M1: Comprensión' : !p.u4m2Completed ? 'M2: Método' : 'M3: Banco',
        path: !p.u4m1Completed ? '/unit/4/module/1' : !p.u4m2Completed ? '/unit/4/module/2' : '/unit/4/module/3',
        pct: overallU4 || 15,
        unitName: 'Unidad 4',
        unitPct: overallU4,
      };
    }
    return {
      title: '¡Nivelación Completada!',
      subtitle: 'Has dominado todos los módulos',
      path: '/dashboard',
      pct: 100,
      unitName: 'Finalizado',
      unitPct: 100,
    };
  };

  return {
    units,
    overallPct,
    activeMaterial: getActiveMaterial(),
    isAdmin,
    u3Title,
  };
}
