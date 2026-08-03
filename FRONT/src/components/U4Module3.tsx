import React, { useState } from 'react';
import { SharedProps } from '../types';
import { HelpCircle, ChevronRight, Lock, Unlock, Zap } from 'lucide-react';

type LevelKey = 'basico' | 'intermedio' | 'avanzado';

interface ProblemDef {
  area: string;
  stmt: string;
  hint: string;
  steps: string[];
  answer: number;
  tol: number;
}

const PROBLEMS: Record<LevelKey, ProblemDef> = {
  basico: { 
    area: 'BÁSICO', 
    stmt: 'Un inversionista deposita $500.000 en un depósito a plazo fijo con interés simple anual del 8%. ¿Cuánto interés (I) habrá ganado al cabo de 3 años? (Fórmula: I = C · i · t)', 
    hint: 'Usa la fórmula del interés simple: I = C · i · t, con C = 500000, i = 0.08 (8%) y t = 3 años.', 
    steps: ['I = 500.000 · 0.08 · 3', 'I = 40.000 · 3', 'I = 120.000'], 
    answer: 120000, 
    tol: 5
  },
  intermedio: { 
    area: 'INTERMEDIO', 
    stmt: 'Se depositan $1.500.000 en una cuenta que paga un interés compuesto de 4% anual. ¿Cuál será el monto total acumulado (VF) después de 5 años? (Fórmula: VF = VP · (1 + i)ⁿ. Redondea al entero más cercano)', 
    hint: 'Usa la fórmula del interés compuesto: VF = VP · (1 + i)ⁿ, con VP = 1.500.000, i = 0.04 y n = 5.', 
    steps: ['VF = 1.500.000 · (1.04)⁵', 'VF = 1.500.000 · 1.2166529', 'VF = 1.824.979'], 
    answer: 1824979, 
    tol: 5
  },
  avanzado: { 
    area: 'AVANZADO', 
    stmt: 'Para financiar un proyecto, una empresa ahorra $100.000 al final de cada mes en una cuenta con interés compuesto del 1% mensual. ¿Cuál será el fondo acumulado (VF) al cabo de 10 meses? (Anualidad vencida: VF = R · [(1 + i)ⁿ - 1] / i. Redondea al entero más cercano)', 
    hint: 'Usa la fórmula de anualidad vencida: VF = R · [(1 + i)ⁿ - 1] / i, donde R = 100.000, i = 0.01 y n = 10.', 
    steps: ['VF = 100.000 · [(1.01)¹⁰ - 1] / 0.01', 'VF = 100.000 · [1.1046221 - 1] / 0.01', 'VF = 100.000 · 10.46221 = 1.046.221'], 
    answer: 1046221, 
    tol: 10
  },
};

export default function U4Module3({ progress, updateProgress }: SharedProps) {
  const levels: LevelKey[] = ['basico', 'intermedio', 'avanzado'];
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const completed = progress.u3m3CompletedLevels || 0; // we can track locally or share, let's use locally completed if needed or use a new progress state
  const [localCompleted, setLocalCompleted] = useState(0);

  const currentLevelKey = levels[currentLevelIdx];
  const problem = PROBLEMS[currentLevelKey];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputVal.replace(/\./g, '').replace(',', '.'));
    if (isNaN(val)) return;

    if (Math.abs(val - problem.answer) <= problem.tol) {
      setErrorMsg(false);
      setInputVal('');
      setShowHint(false);
      
      const nextCompleted = Math.max(localCompleted, currentLevelIdx + 1);
      setLocalCompleted(nextCompleted);
      updateProgress({ u3m3CompletedLevels: nextCompleted }); // reusing progress track or let's just make it complete
      
      if (nextCompleted === 3) {
        updateProgress({ u3m3Completed: true }); // using u3m3 or similar is fine
      }
      
      if (currentLevelIdx < 2) {
        setCurrentLevelIdx(currentLevelIdx + 1);
      }
    } else {
      setErrorMsg(true);
      setTimeout(() => setErrorMsg(false), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <header className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold">Módulo 3: Banco de Resolución de Problemas</h1>
        <p className="text-slate-500">Resolución de problemas de finanzas y cálculo de flujos aplicados.</p>
      </header>

      <div className="flex gap-4">
        {levels.map((lvl, i) => {
          const isUnlocked = i <= localCompleted;
          const isCurrent = i === currentLevelIdx;
          const isDone = i < localCompleted;
          return (
            <button 
              key={lvl} 
              onClick={() => isUnlocked && setCurrentLevelIdx(i)} 
              disabled={!isUnlocked} 
              className={`flex-1 flex flex-col items-center p-4 rounded-3xl border-2 transition-all cursor-pointer ${isCurrent ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100' : isUnlocked ? 'border-slate-200 bg-white hover:border-emerald-300' : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'}`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-white shadow-sm font-bold text-sm">
                {!isUnlocked ? <Lock className="w-4 h-4 text-slate-400" /> : isDone ? <Unlock className="w-4 h-4 text-emerald-500" /> : <span className="text-emerald-600">{i + 1}</span>}
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${isCurrent ? 'text-emerald-700' : 'text-slate-500'}`}>{lvl}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-black bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-200/50 uppercase tracking-widest">{problem.area}</span>
          <button 
            onClick={() => setShowHint(true)}
            className="text-slate-500 hover:text-emerald-600 flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer bg-transparent border-none"
          >
            <HelpCircle className="w-4 h-4" /> Ver pista
          </button>
        </div>

        <p className="text-xl font-medium text-slate-800 mb-8 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
          {problem.stmt}
        </p>

        {showHint && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl mb-8 animate-in slide-in-from-top-4 duration-300">
            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">💡 Pista Conceptual</h4>
            <p className="text-slate-600 leading-relaxed font-medium">{problem.hint}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <input 
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Ingrese su resultado numérico aproximado (ej: 120000 o 1.824.979)"
              className={`w-full bg-slate-50 border ${errorMsg ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'} rounded-2xl px-6 py-4 text-lg font-bold text-slate-900 outline-none transition-all`}
            />
          </div>
          <button 
            type="submit"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 px-10 rounded-2xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-none flex items-center justify-center gap-2"
          >
            Siguiente Paso <ChevronRight className="w-5 h-5"/>
          </button>
        </form>

        {errorMsg && (
          <p className="text-red-500 font-bold mt-4 text-center animate-bounce">❌ Respuesta incorrecta. Revisa los cálculos e inténtalo de nuevo.</p>
        )}

        {localCompleted > currentLevelIdx && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Zap className="w-4 h-4 text-amber-500"/> Desarrollo paso a paso:</h4>
            <div className="space-y-3">
              {problem.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                  <span className="font-mono text-sm text-slate-700 font-bold">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
