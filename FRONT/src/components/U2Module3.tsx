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
    stmt: 'Una dosis inicial de 1000 mg de paracetamol se elimina del organismo a una tasa del 10% por hora. Calcula la cantidad restante en el cuerpo al cabo de 2 horas.', 
    hint: 'La población decrece, así que la base es (1 - 0.10) = 0.90. Aplica el modelo C(t) = 1000 * 0.90^t.', 
    steps: ['C(t) = 1000 · (0.90)^t', 'C(2) = 1000 · (0.90)^2', 'C(2) = 1000 · 0.81', 'C(2) = 810 mg'], 
    answer: 810, 
    tol: 1
  },
  intermedio: { 
    area: 'INTERMEDIO', 
    stmt: 'En un experimento, una placa Petri contiene inicialmente 100 bacterias y crecen a una tasa del 20% por hora. ¿Cuál será la población de bacterias después de 5 horas a partir del inicio?', 
    hint: 'Aplica el modelo exponencial de crecimiento: P(t) = P_0 * (1 + r)^t. Luego evalúa en t = 5.', 
    steps: ['P(t) = 100 · (1 + 0.20)^t', 'P(5) = 100 · (1.20)^5', 'P(5) = 100 · 2.48832', 'P(5) ≈ 249 bacterias'], 
    answer: 249, 
    tol: 1 
  },
  avanzado: { 
    area: 'AVANZADO', 
    stmt: 'El crecimiento de seguidores de un influencer en Instagram se modela con la función logarítmica f(x) = 418 + 1619*ln(x), donde x es el número del mes. ¿Aproximadamente cuántos seguidores se esperan para el mes 6?', 
    hint: 'Evalúa la función logarítmica en x = 6. Recuerda que ln(6) ≈ 1.7917.', 
    steps: ['f(x) = 418 + 1619 · ln(x)', 'f(6) = 418 + 1619 · ln(6)', 'f(6) ≈ 418 + 1619 · 1.7917', 'f(6) ≈ 418 + 2901 = 3319 seguidores'], 
    answer: 3319, 
    tol: 2
  },
};

export default function U2Module3({ progress, updateProgress }: SharedProps) {
  const levels: LevelKey[] = ['basico', 'intermedio', 'avanzado'];
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const completed = progress.u2m3CompletedLevels || 0;
  const currentLevelKey = levels[currentLevelIdx];
  const problem = PROBLEMS[currentLevelKey];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputVal.replace(',', '.'));
    if (isNaN(val)) return;

    if (Math.abs(val - problem.answer) <= problem.tol) {
      setErrorMsg(false);
      setInputVal('');
      setShowHint(false);
      if (currentLevelIdx >= completed) {
        const next = Math.min(3, currentLevelIdx + 1);
        updateProgress({ u2m3CompletedLevels: next });
        if (next === 3) updateProgress({ u2m3Completed: true });
        if (next < 3) setCurrentLevelIdx(next);
      } else {
        if (currentLevelIdx < 2) setCurrentLevelIdx(currentLevelIdx + 1);
      }
    } else {
      setErrorMsg(true);
      setTimeout(() => setErrorMsg(false), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <header className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold">Módulo 3: Banco de Resolución</h1>
        <p className="text-slate-500">Problemas modelados con funciones exponenciales y logarítmicas.</p>
      </header>

      <div className="flex gap-4">
        {levels.map((lvl, i) => {
          const isUnlocked = i <= completed;
          const isCurrent = i === currentLevelIdx;
          const isDone = i < completed;
          return (
            <button key={lvl} onClick={() => isUnlocked && setCurrentLevelIdx(i)} disabled={!isUnlocked} className={`flex-1 flex flex-col items-center p-4 rounded-3xl border-2 transition-all ${isCurrent ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-100' : isUnlocked ? 'border-slate-200 bg-white hover:border-violet-300' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-white shadow-sm font-bold text-sm">
                {!isUnlocked ? <Lock className="w-4 h-4 text-slate-400" /> : isDone ? <Unlock className="w-4 h-4 text-emerald-500" /> : <span className="text-violet-600">{i + 1}</span>}
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${isCurrent ? 'text-violet-700' : 'text-slate-500'}`}>{lvl}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
        <div className="text-xs font-extrabold text-violet-700 bg-violet-100 px-4 py-1.5 rounded-full inline-block mb-6 uppercase tracking-widest">{problem.area}</div>
        <p className="text-xl text-slate-800 mb-8 font-medium leading-relaxed">{problem.stmt}</p>

        {showHint && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl mb-8 animate-in fade-in zoom-in-95 duration-300">
            <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2"><Zap className="w-5 h-5"/> Pista de razonamiento</h4>
            <p className="text-yellow-900">{problem.hint}</p>
            <div className="mt-4 pt-4 border-t border-yellow-200/50">
              <h5 className="font-bold text-yellow-800 mb-3 text-sm uppercase tracking-wider">Pasos sugeridos:</h5>
              <div className="space-y-2">
                {problem.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-yellow-900 bg-yellow-100/50 p-2.5 rounded-xl text-sm font-medium">
                    <span className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 font-bold shrink-0">{idx + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="relative flex-1">
            <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Ingresa el valor y presiona Enter..." className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 text-lg font-bold text-slate-800 outline-none transition-all ${errorMsg ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-violet-500 focus:bg-white focus:ring-4 ring-violet-500/10'}`} />
            {errorMsg && <div className="absolute -bottom-8 left-4 text-sm font-bold text-red-500 animate-in fade-in slide-in-from-top-2">Respuesta incorrecta. Revisa el planteamiento.</div>}
          </div>
          <button type="button" onClick={() => setShowHint(h => !h)} className="px-6 py-4 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors flex items-center gap-2"><HelpCircle className="w-5 h-5"/> {showHint ? 'Ocultar pista' : 'Ver Pista'}</button>
          <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-4 rounded-2xl shadow-sm border border-violet-700 transition-colors flex items-center gap-2 cursor-pointer">Enviar <ChevronRight className="w-5 h-5"/></button>
        </form>
      </div>
    </div>
  );
}
