import React from 'react';
import { useProgressStore, selectOverallProgress, selectNextUnit } from '../store/useProgressStore';
import { CheckCircle, Circle, Lock } from 'lucide-react';

const UNITS = [
  { id: 0, label: 'Pre-Módulo', sub: 'Diagnóstico inicial' },
  { id: 1, label: 'Unidad 1', sub: 'Números y operaciones' },
  { id: 2, label: 'Unidad 2', sub: 'Álgebra básica' },
  { id: 3, label: 'Unidad 3', sub: 'Geometría aplicada' },
  { id: 4, label: 'Unidad 4', sub: 'Estadística y probabilidad' },
] as const;

const DashboardPage: React.FC = () => {
  const career = useProgressStore((s) => s.selectedCareer);
  const area = useProgressStore((s) => s.selectedArea);
  const module = useProgressStore((s) => s.activeModule);
  const progress = useProgressStore((s) => s.progress);
  const overallProgress = useProgressStore(selectOverallProgress);
  const nextUnit = useProgressStore(selectNextUnit);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const getUnitData = (id: number) => {
    if (id === 0) return progress.preModule;
    return progress.units[id as 1 | 2 | 3 | 4];
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Mi Progreso</h1>
          {career && (
            <p className="dashboard-subtitle">
              {career} · {area} · Módulo {module}
            </p>
          )}
        </div>
        <button className="btn-ghost" onClick={resetProgress}>
          Reiniciar progreso
        </button>
      </div>

      {/* Overall progress */}
      <div className="progress-card">
        <div className="progress-card-header">
          <span>Progreso general</span>
          <span className="progress-pct">{overallProgress}%</span>
        </div>
        <div className="progress-bar-wrap large">
          <div
            className="progress-bar-fill"
            style={{ width: `${overallProgress}%`, transition: 'width 0.6s ease' }}
          />
        </div>
        {nextUnit >= 0 ? (
          <p className="progress-hint">
            Siguiente: {nextUnit === 0 ? 'Pre-Módulo' : `Unidad ${nextUnit}`}
          </p>
        ) : (
          <p className="progress-hint success">¡Has completado todas las unidades! 🎉</p>
        )}
      </div>

      {/* Unit cards */}
      <div className="units-grid">
        {UNITS.map((unit) => {
          const data = getUnitData(unit.id);
          const isNext = unit.id === nextUnit;
          const isLocked = unit.id !== 0 && !progress.preModule.isCompleted && unit.id > 0 && nextUnit !== -1 && unit.id > nextUnit;

          return (
            <div
              key={unit.id}
              className={`unit-card ${data.isCompleted ? 'completed' : ''} ${isNext ? 'next' : ''} ${isLocked ? 'locked' : ''}`}
            >
              <div className="unit-card-icon">
                {data.isCompleted
                  ? <CheckCircle size={22} className="icon-success" />
                  : isLocked
                    ? <Lock size={22} className="icon-muted" />
                    : <Circle size={22} className="icon-pending" />}
              </div>
              <div className="unit-card-body">
                <h3>{unit.label}</h3>
                <p>{unit.sub}</p>
                {data.score !== null && (
                  <span className="unit-score">Puntaje: {data.score.toFixed(1)}%</span>
                )}
              </div>
              {isNext && <span className="unit-badge">Continuar →</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
