import React, { useState, useEffect } from 'react';
import { useFrontProps } from '../../../hooks/useFrontProps';

import { Lock, Check, Lightbulb } from 'lucide-react';

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
    stmt: 'La tarifa de un servicio eléctrico incluye $900 de cargo fijo mensual y $200 por cada kWh consumido. Si un cliente recibe una boleta por un total a pagar de $8300, ¿cuántos kWh de energía alcanzó a consumir?', 
    hint: 'Plantea una función afín donde f(x) es el costo total y x el consumo. Despeja x de: 8300 = 200 · x + 900.', 
    steps: ['8300 = 200x + 900', '7400 = 200x', 'x = 7400 / 200', 'x = 37 kWh'], 
    answer: 37, 
    tol: 0.1 
  },
  intermedio: { 
    area: 'INTERMEDIO', 
    stmt: 'Una piedra es lanzada hacia arriba desde una azotea. Su altura h en metros respecto al suelo a los t segundos está dada por h(t) = -5t² + 30t + 40. ¿Cuál fue la altura máxima que alcanzó la piedra?', 
    hint: 'Busca la coordenada y del vértice de la parábola. Para ello, primero encuentra el tiempo t del vértice con la fórmula t = -b/(2a).', 
    steps: ['t = -30 / (2 · -5) = 3 segundos', 'h(3) = -5(3)² + 30(3) + 40', 'h(3) = -45 + 90 + 40 = 85 metros'], 
    answer: 85, 
    tol: 0.1 
  },
  avanzado: { 
    area: 'AVANZADO', 
    stmt: 'El precio de la bencina es de $1140 por litro. El sistema de estabilización limita las alzas a $9 por semana. Si el precio sube el máximo posible cada semana, ¿cuál será el precio exacto de la bencina en la semana 18?', 
    hint: 'La función lineal que modela el precio a las x semanas es f(x) = 9x + 1140. Solo debes evaluar f(18).', 
    steps: ['f(x) = 9x + 1140', 'f(18) = 9(18) + 1140', 'f(18) = 162 + 1140 = $1302'], 
    answer: 1302, 
    tol: 0.1 
  },
};

const LEVELS: {key: LevelKey, label: string}[] = [
  { key: 'basico', label: 'Básico' },
  { key: 'intermedio', label: 'Intermedio' },
  { key: 'avanzado', label: 'Avanzado' },
];

export default function Module3() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const [level, setLevel] = useState<LevelKey>('basico');
  const [completed, setCompleted] = useState<Record<string, 'ok' | 'hint'>>({});
  const [answer, setAnswer] = useState('');
  const [hintOpen, setHintOpen] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [verified, setVerified] = useState<'ok' | 'bad' | null>(null);

  const prob = PROBLEMS[level];
  const compCount = Object.keys(completed).length;

  useEffect(() => {
    updateProgress({ m3CompletedLevels: compCount });
    if (completed['avanzado'] === 'ok') updateProgress({ m3Completed: true });
  }, [compCount, completed]);

  const levelLocked = (k: LevelKey) => {
    if (k === 'basico') return false;
    if (k === 'intermedio') return !completed.basico;
    if (k === 'avanzado') return !completed.intermedio;
    return false;
  };

  const handleSetLevel = (k: LevelKey) => {
    if (levelLocked(k)) return;
    setLevel(k);
    setAnswer('');
    setVerified(null);
    setHintOpen(false);
    setUsedHint(false);
  };

  const verify = () => {
    const val = parseFloat(answer.replace(',', '.'));
    const isOk = !isNaN(val) && Math.abs(val - prob.answer) <= prob.tol;
    if (isOk) {
      setCompleted(prev => ({ ...prev, [level]: usedHint ? 'hint' : 'ok' }));
      setVerified('ok');
    } else {
      setVerified('bad');
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-amber-50 to-orange-50 p-6 sm:p-8 rounded-[2rem] border border-orange-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">M3: Banco <span className="text-orange-500">interactivo</span></h1>
          <p className="text-orange-600 font-medium">Problemas escalonados con pistas y verificación.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-40 transform translate-x-1/3 -translate-y-1/3"></div>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4">
        {LEVELS.map(lv => {
          const locked = levelLocked(lv.key);
          const active = lv.key === level;
          const done = !!completed[lv.key];
          
          return (
            <button
              key={lv.key}
              onClick={() => handleSetLevel(lv.key)}
              disabled={locked}
              className={`flex items-center gap-2 text-base font-extrabold py-3.5 px-7 rounded-2xl transition-all ${
                active 
                  ? 'border-none bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-105' 
                  : locked 
                    ? 'border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'border-2 border-orange-100 bg-white text-orange-600 hover:bg-orange-50 cursor-pointer shadow-sm hover:shadow-md'
              }`}
            >
              <span>{lv.label}</span>
              {locked && <Lock className="w-5 h-5 ml-1 opacity-70" />}
              {done && <Check className="w-5 h-5 ml-1" strokeWidth={3} />}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full">
        {/* Problem space */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="text-xs font-black text-orange-700 bg-orange-100 border border-orange-200 px-4 py-1.5 rounded-full inline-block mb-6 tracking-wide">{prob.area}</div>
          <p className="text-xl sm:text-2xl text-slate-800 font-medium leading-relaxed mb-10 bg-gradient-to-br from-slate-50 to-orange-50/30 p-8 rounded-[2rem] border border-orange-100/50 shadow-inner">
            {prob.stmt}
          </p>

          <div className="flex flex-col md:flex-row items-end gap-5">
            <div className="flex-1 w-full">
              <label className="text-xs text-slate-400 font-extrabold uppercase tracking-widest block mb-3 pl-1">Tu respuesta (m)</label>
              <input 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Ej: 4.5" 
                inputMode="decimal" 
                className="w-full bg-white border-2 border-orange-200/60 rounded-2xl px-6 py-4 text-xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
              <button 
                onClick={verify}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold py-4 px-10 rounded-2xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 cursor-pointer text-lg"
              >
                Verificar
              </button>
              <button 
                onClick={() => { setHintOpen(!hintOpen); setUsedHint(true); }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-2 border-yellow-200 font-extrabold py-4 px-8 rounded-2xl transition-colors cursor-pointer text-lg"
              >
                <Lightbulb className="w-6 h-6" /> Pista
              </button>
            </div>
          </div>

          {hintOpen && (
             <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50/50 border border-yellow-200 rounded-2xl p-6 shadow-sm animate-in zoom-in-95 duration-300">
               <div className="flex items-center gap-2 text-yellow-700 mb-3">
                 <Lightbulb className="w-6 h-6" />
                 <span className="text-base font-extrabold">Consejo guiado</span>
               </div>
               <p className="text-yellow-900/80 font-medium leading-relaxed">{prob.hint}</p>
             </div>
          )}

          {verified && (
            <div className={`mt-8 rounded-2xl p-8 border-2 shadow-sm animate-in slide-in-from-top-4 duration-300 ${verified === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
              <div className={`font-black text-2xl flex items-center gap-3 mb-6 ${verified === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
                 {verified === 'ok' ? '✨ ¡Resultado correcto!' : '✕ Revisa tus cálculos'}
              </div>
              {verified === 'ok' && (
                <div className="space-y-3">
                  <p className="text-emerald-700/80 font-bold uppercase tracking-wider text-xs mb-4">Desarrollo paso a paso</p>
                  {prob.steps.map((st, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-emerald-100/50 font-mono text-base font-bold text-emerald-800 shadow-sm">{st}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rubric */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6">Rúbrica de evaluación</h3>
          <div className="space-y-4">
            <div className="flex gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <span className="w-8 h-8 shrink-0 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-black shadow-sm">1</span>
              <span className="text-base font-bold text-slate-700 leading-snug pt-1">¿Identifiqué correctamente el tipo de función polinómica en base al problema?</span>
            </div>
            <div className="flex gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <span className="w-8 h-8 shrink-0 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-black shadow-sm">2</span>
              <span className="text-base font-bold text-slate-700 leading-snug pt-1">¿Determiné correctamente los parámetros (grado, tasa de cambio y valor inicial)?</span>
            </div>
            <div className="flex gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <span className="w-8 h-8 shrink-0 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-black shadow-sm">3</span>
              <span className="text-base font-bold text-slate-700 leading-snug pt-1">¿El resultado es matemáticamente correcto y tiene sentido respecto a la unidad pedida?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
