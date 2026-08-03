import React, { useState } from 'react';
import { useFrontProps } from '../../../hooks/useFrontProps';

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

// MECANICA (Trigonometria)
const MEC_PROBLEMS: Record<LevelKey, ProblemDef> = {
  basico: { 
    area: 'BÁSICO', 
    stmt: 'Desde una estaca, el ángulo de elevación a la cúspide de la pirámide es 30°. Si la altura de la pirámide es 138 m, calcula aproximadamente la distancia en línea recta desde la estaca a la cúspide (hipotenusa). (Usa sen 30° = 0.5)', 
    hint: 'La razón que relaciona cateto opuesto e hipotenusa es el seno. Por tanto: sen(30°) = opuesto / hipotenusa.', 
    steps: ['sen(30°) = 138 / hipotenusa', '0.5 = 138 / h', 'h = 138 / 0.5 = 276 m'], 
    answer: 276, 
    tol: 2
  },
  intermedio: { 
    area: 'INTERMEDIO', 
    stmt: 'En un parque, Emilio y Fernanda están separados por 850 m. Ven una fogata formando ángulos de 55° y 18° respecto de la línea que los une. ¿Cuál es el valor del tercer ángulo (en la fogata)?', 
    hint: 'La suma de los ángulos interiores de todo triángulo es 180°.', 
    steps: ['Ángulo + 55° + 18° = 180°', 'Ángulo + 73° = 180°', 'Ángulo = 180° - 73° = 107°'], 
    answer: 107, 
    tol: 1 
  },
  avanzado: { 
    area: 'AVANZADO', 
    stmt: 'El péndulo de un reloj oscila siguiendo la función angular f(t) = 0.35 sen(3.14t + 1.55). ¿Cuál es la amplitud máxima (en radianes) que alcanza el péndulo durante su oscilación?', 
    hint: 'En una función de la forma f(t) = A * sen(wt + φ), el coeficiente A representa la amplitud máxima de la oscilación.', 
    steps: ['Identifica la forma de la función: f(t) = A · sen(...)', 'El valor que multiplica la función seno es 0.35.', 'Por ende, la amplitud es 0.35 rad.'], 
    answer: 0.35, 
    tol: 0.05
  },
};

// ADMINISTRACION (Progresiones)
const ADM_PROBLEMS: Record<LevelKey, ProblemDef> = {
  basico: { 
    area: 'BÁSICO', 
    stmt: 'Una tienda de retail vendió 80 prendas el primer día de una campaña de invierno, y cada día vende 12 prendas más que el anterior. ¿Cuántas prendas venderá en el día 10 de la campaña?', 
    hint: 'Usa la fórmula del término general de una progresión aritmética: a_n = a_1 + (n - 1)d, donde a_1 = 80, d = 12 y n = 10.', 
    steps: ['a₁₀ = 80 + (10 - 1) · 12', 'a₁₀ = 80 + 9 · 12', 'a₁₀ = 80 + 108 = 188'], 
    answer: 188, 
    tol: 2
  },
  intermedio: { 
    area: 'INTERMEDIO', 
    stmt: 'El valor de una maquinaria pesada se deprecia un 10% anual (se multiplica por una razón r = 0.9 cada año). Si su valor inicial es de $2.000.000, ¿cuál será su valor al iniciar el año 4? (Fórmula: a_4 = a_1 · r³)', 
    hint: 'Usa la fórmula del término general de una progresión geométrica: a_n = a_1 · r^(n-1), con a_1 = 2.000.000, r = 0.9 y n = 4.', 
    steps: ['a₄ = 2.000.000 · (0.9)³', 'a₄ = 2.000.000 · 0.729', 'a₄ = 1.458.000'], 
    answer: 1458000, 
    tol: 10
  },
  avanzado: { 
    area: 'AVANZADO', 
    stmt: 'Un plan de ahorro corporativo consiste en depositar $50.000 el primer mes, e incrementar el depósito en $5.000 cada mes sucesivo (mes 2: $55.000, mes 3: $60.000...). ¿Cuál será el capital total acumulado tras completar 12 meses de ahorro?', 
    hint: 'Usa la suma de los primeros n términos de una progresión aritmética: S_n = n · (a_1 + a_n) / 2, primero hallando a₁₂ = 50.000 + 11 · 5.000 = 105.000.', 
    steps: ['Calcula a₁₂ = 50.000 + (12 - 1) · 5.000 = 105.000', 'S₁₂ = 12 · (50.000 + 105.000) / 2', 'S₁₂ = 6 · 155.000 = 930.000'], 
    answer: 930000, 
    tol: 50
  },
};

export default function U3Module3() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const isAdm = progress.preSpecialty === 'administracion';
  
  const PROBLEMS = isAdm ? ADM_PROBLEMS : MEC_PROBLEMS;
  const levels: LevelKey[] = ['basico', 'intermedio', 'avanzado'];
  
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const completed = progress.u3m3CompletedLevels || 0;
  const currentLevelKey = levels[currentLevelIdx];
  const problem = PROBLEMS[currentLevelKey];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // parse input, removing any dots (for thousands) and replacing comma with dot for decimals
    const val = parseFloat(inputVal.replace(/\./g, '').replace(',', '.'));
    if (isNaN(val)) return;

    if (Math.abs(val - problem.answer) <= problem.tol) {
      setErrorMsg(false);
      setInputVal('');
      setShowHint(false);
      if (currentLevelIdx >= completed) {
        const next = Math.min(3, currentLevelIdx + 1);
        updateProgress({ u3m3CompletedLevels: next });
        if (next === 3) updateProgress({ u3m3Completed: true });
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
        <p className="text-slate-500">
          {isAdm ? 'Resolución de problemas de Progresiones Aplicados.' : 'Resolución de problemas de Trigonometría.'}
        </p>
      </header>

      <div className="flex gap-4">
        {levels.map((lvl, i) => {
          const isUnlocked = i <= completed;
          const isCurrent = i === currentLevelIdx;
          const isDone = i < completed;
          return (
            <button 
              key={lvl} 
              onClick={() => isUnlocked && setCurrentLevelIdx(i)} 
              disabled={!isUnlocked} 
              className={`flex-1 flex flex-col items-center p-4 rounded-3xl border-2 transition-all cursor-pointer ${isCurrent ? (isAdm ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-sky-500 bg-sky-50 shadow-md shadow-sky-100') : isUnlocked ? 'border-slate-200 bg-white hover:border-indigo-300' : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'}`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-white shadow-sm font-bold text-sm">
                {!isUnlocked ? <Lock className="w-4 h-4 text-slate-400" /> : isDone ? <Unlock className="w-4 h-4 text-emerald-500" /> : <span className={isAdm ? 'text-indigo-600' : 'text-sky-600'}>{i + 1}</span>}
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${isCurrent ? (isAdm ? 'text-indigo-700' : 'text-sky-700') : 'text-slate-500'}`}>{lvl}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <span className={`text-xs font-black ${isAdm ? 'bg-indigo-100 text-indigo-700 border-indigo-200/50' : 'bg-sky-100 text-sky-700 border-sky-200/50'} px-4 py-1.5 rounded-full border uppercase tracking-widest`}>{problem.area}</span>
          <button 
            onClick={() => setShowHint(true)}
            className={`text-slate-500 hover:${isAdm ? 'text-indigo-600' : 'text-sky-600'} flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer bg-transparent border-none`}
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
              placeholder={isAdm ? "Ingrese su resultado (ej: 188 o 1.458.000)" : "Ingrese su resultado numérico (ej: 276 o 0.35)"}
              className={`w-full bg-slate-50 border ${errorMsg ? 'border-red-400 ring-2 ring-red-100' : `border-slate-200 focus:${isAdm ? 'border-indigo-500' : 'border-sky-500'} focus:ring-2 focus:ring-${isAdm ? 'indigo-500/20' : 'sky-500/20'}`} rounded-2xl px-6 py-4 text-lg font-bold text-slate-900 outline-none transition-all`}
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

        {completed > currentLevelIdx && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Zap className="w-4 h-4 text-amber-500"/> Desarrollo paso a paso:</h4>
            <div className="space-y-3">
              {problem.steps.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-3 ${isAdm ? 'bg-indigo-50/50 border-indigo-100/50' : 'bg-sky-50/50 border-sky-100/50'} p-4 rounded-xl border`}>
                  <span className={`w-6 h-6 rounded-full ${isAdm ? 'bg-indigo-100 text-indigo-700' : 'bg-sky-100 text-sky-700'} flex items-center justify-center font-bold text-xs`}>{idx + 1}</span>
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
