import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';

const UNIT_INFO: Record<string, { title: string; desc: string }> = {
  '0': { title: 'Pre-Módulo Diagnóstico', desc: 'Evaluación inicial para conocer tu nivel de partida.' },
  '1': { title: 'Unidad 1: Números y Operaciones', desc: 'Domina las operaciones aritméticas fundamentales.' },
  '2': { title: 'Unidad 2: Álgebra Básica', desc: 'Expresiones algebraicas, ecuaciones y desigualdades.' },
  '3': { title: 'Unidad 3: Geometría Aplicada', desc: 'Figuras, áreas, volúmenes y trigonometría básica.' },
  '4': { title: 'Unidad 4: Estadística y Probabilidad', desc: 'Análisis de datos, medidas de tendencia y probabilidad.' },
};

const UnitPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const unitId = Number(id ?? 0) as 0 | 1 | 2 | 3 | 4;
  const info = UNIT_INFO[String(unitId)] ?? { title: `Unidad ${unitId}`, desc: '' };

  const progress = useProgressStore((s) => s.progress);
  const updateUnit = useProgressStore((s) => s.updateUnit);
  const updatePreModule = useProgressStore((s) => s.updatePreModule);

  const unitData = unitId === 0
    ? progress.preModule
    : progress.units[unitId as 1 | 2 | 3 | 4];

  const handleComplete = () => {
    const score = Math.floor(Math.random() * 41) + 60; // demo: 60-100
    if (unitId === 0) updatePreModule(score, true);
    else updateUnit(unitId, score, true);
  };

  return (
    <div className="unit-page">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={16} />
        <span>Volver al dashboard</span>
      </Link>

      <div className="unit-header">
        <h1>{info.title}</h1>
        <p>{info.desc}</p>
      </div>

      {/* Status banner */}
      {unitData.isCompleted ? (
        <div className="status-banner success">
          <CheckCircle size={20} />
          <span>
            Completado · Puntaje: <strong>{unitData.score?.toFixed(1)}%</strong>
            &nbsp;· Intentos: {unitData.attempts}
          </span>
        </div>
      ) : (
        <div className="status-banner pending">
          <span>No completado aún · Intentos: {unitData.attempts}</span>
        </div>
      )}

      {/* Placeholder content */}
      <div className="unit-content-placeholder">
        <p>
          📝 El contenido interactivo de esta unidad se cargará aquí.
          <br />
          (Ejercicios, videos, evaluaciones, etc.)
        </p>
      </div>

      {/* Demo action */}
      <button className="btn-primary" onClick={handleComplete}>
        {unitData.isCompleted ? 'Repetir unidad (demo)' : 'Marcar como completado (demo)'}
      </button>
    </div>
  );
};

export default UnitPage;
