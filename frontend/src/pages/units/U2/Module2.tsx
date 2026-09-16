import React, { useState } from 'react';
import { TeacherResources } from '../../../components/ui/TeacherResources';
import { useFrontProps } from '../../../hooks/useFrontProps';
import { QuizRunner } from '../../../components/ui/QuizRunner';
import { U2_PROBLEMS } from '../../../data/u2Questions';

import { BrainCircuit, ArrowRight, ArrowLeft, Terminal } from 'lucide-react';

interface NodeDef { id: string; q: string; yes: number | string; no: number | string; }
interface TerminalDef { method: string; sub: string; detail: string; }

const NODES: Record<number, NodeDef> = {
  1: { id: '01', q: '¿El problema describe un fenómeno multiplicativo (crece o decrece un \% en cada período) o de escalas?', yes: 2, no: 3 },
  2: { id: '02', q: '¿La incógnita principal es el exponente o el tiempo necesario para alcanzar cierto valor?', yes: 'T:Log', no: 'T:Exp' },
  3: { id: '03', q: '¿La tasa de cambio es constante (valor fijo en cada paso)?', yes: 'T:Linea', no: 'T:Other' },
};

const TERMINALS: Record<string, TerminalDef> = {
  'T:Exp': { method: 'Función Exponencial', sub: 'f(x) = a · b^x', detail: 'Modela crecimiento poblacional, interés compuesto y decaimiento radiactivo. La incógnita suele ser el valor final o inicial.' },
  'T:Log': { method: 'Función Logarítmica', sub: 'f(x) = log_b(x)', detail: 'Se utiliza para despejar el exponente (tiempo) en problemas exponenciales, y también para escalas como Richter o decibelios.' },
  'T:Linea': { method: 'Modelos Lineales/Afines', sub: 'f(x) = mx + n', detail: 'Tasas de cambio aditivas constantes. Revisar Unidad 1.' },
  'T:Other': { method: 'Otros Modelos', sub: 'Polinómicos, trigonométricos', detail: 'Revisa las características de la curva.' }
};

export default function U2Module2() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const [history, setHistory] = useState<number[]>([1]);
  const [current, setCurrent] = useState<number | string>(1);
  const [showQuiz, setShowQuiz] = useState(false);

  const isTerminal = typeof current === 'string';

  const handleChoice = (next: number | string) => {
    if (!isTerminal) {
      setHistory(h => [...h, current as number]);
      setCurrent(next);
      const visited = new Set([...history, current as number, ...(typeof next === 'number' ? [next] : [])]).size;
      updateProgress({ u2m2NodesVisited: visited });
      if (typeof next === 'string') updateProgress({ u2m2Completed: true });
    }
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = [...history];
      const last = prev.pop()!;
      setHistory(prev);
      setCurrent(last);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <header className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Módulo 2: Identificación del método</h1>
        <p className="text-slate-500">Funciones Exponenciales y Logarítmicas.</p>
      </header>

      <TeacherResources unitId="u2" moduleType="metodo" />

      {/* ── Situación a Analizar ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div className="space-y-2 relative z-10 flex-1">
          <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Situación a analizar</span>
          <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Crecimiento Bacteriano / Interés Compuesto</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Supongamos que un cultivo bacteriano crece a una tasa del 15% por hora, o que se deposita un capital en una cuenta con interés compuesto anual. Se busca determinar cuánto tiempo debe pasar para que la población o el capital alcance un valor específico. Responde el siguiente árbol de decisiones para elegir la mejor herramienta matemática.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200">
        <div className="p-12 relative flex items-center justify-center min-h-[400px]">
          {!isTerminal ? (
            <div className="text-center max-w-lg w-full relative z-10">
              <h2 className="text-3xl font-black text-slate-800 mb-10 leading-tight">{NODES[current as number].q}</h2>
              <div className="flex gap-4 justify-center">
                <button onClick={() => handleChoice(NODES[current as number].yes)} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl">Sí</button>
                <button onClick={() => handleChoice(NODES[current as number].no)} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl">No</button>
              </div>
            </div>
          ) : (
            <div className="text-center max-w-xl w-full">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><Terminal className="w-10 h-10"/></div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">{TERMINALS[current as string].method}</h3>
              <p className="text-emerald-600 font-bold mb-6">{TERMINALS[current as string].sub}</p>
              <p className="text-slate-600 bg-slate-50 p-6 rounded-2xl mb-8">{TERMINALS[current as string].detail}</p>
              
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-1 cursor-pointer"
              >
                Realizar Cuestionario M2
              </button>
            </div>
          )}
        </div>
        <div className="bg-slate-50 p-5 px-8 flex justify-between items-center border-t border-slate-100">
          <button onClick={goBack} disabled={history.length === 0} className={`flex items-center gap-2 font-bold ${history.length === 0 ? 'text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}>
            <ArrowLeft className="w-5 h-5"/> Volver
          </button>
          <div className="flex gap-2">
            {[1,2,3].map(step => (
               <div key={step} className={`w-2.5 h-2.5 rounded-full ${history.length + (isTerminal ? 1 : 0) >= step ? 'bg-violet-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
      </div>

      {showQuiz && (
        <QuizRunner
          problem={U2_PROBLEMS.find(p => p.id === 'u2-s1-farmacos')!}
          onClose={() => setShowQuiz(false)}
          onComplete={(scorePct, totalPts, earnedPts) => {
            setShowQuiz(false);
          }}
        />
      )}
    </div>
  );
}
