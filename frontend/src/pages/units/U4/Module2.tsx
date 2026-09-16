import React, { useState } from 'react';
import { TeacherResources } from '../../../components/ui/TeacherResources';
import { useFrontProps } from '../../../hooks/useFrontProps';
import { QuizRunner } from '../../../components/ui/QuizRunner';
import { U4_PROBLEMS } from '../../../data/u4Questions';

import { BrainCircuit, ArrowLeft, Terminal } from 'lucide-react';

interface NodeDef { id: string; q: string; yes: number | string; no: number | string; }
interface TerminalDef { method: string; sub: string; detail: string; }

const NODES: Record<number, NodeDef> = {
  1: { id: '01', q: '¿El interés generado se calcula únicamente sobre el capital inicial (no se capitaliza)?', yes: 'T:Simple', no: 2 },
  2: { id: '02', q: '¿Se trata de un único depósito o préstamo inicial (en lugar de una serie de pagos periódicos)?', yes: 'T:Compuesto', no: 3 },
  3: { id: '03', q: '¿Los depósitos o pagos periódicos (cuotas) se realizan al final de cada período (vencidos)?', yes: 'T:Vencida', no: 'T:Anticipada' },
};

const TERMINALS: Record<string, TerminalDef> = {
  'T:Simple': { 
    method: 'Interés Simple', 
    sub: 'I = C · i · t', 
    detail: 'El interés no se acumula al capital para producir nuevos intereses. Es proporcional al capital inicial, la tasa de interés periódica y el tiempo total de la operación.' 
  },
  'T:Compuesto': { 
    method: 'Interés Compuesto', 
    sub: 'VF = VP · (1 + i)ⁿ', 
    detail: 'Los intereses generados en cada período se suman (capitalizan) al monto principal, de modo que generan nuevos intereses en los períodos siguientes.' 
  },
  'T:Vencida': { 
    method: 'Anualidad Vencida o Ordinaria', 
    sub: 'VF = R · [(1 + i)ⁿ - 1] / i', 
    detail: 'Serie de depósitos o pagos periódicos e iguales (R) efectuados al final de cada período de capitalización (por ejemplo, pagos mensuales de un préstamo bancario o ahorro a fin de mes).' 
  },
  'T:Anticipada': { 
    method: 'Anualidad Anticipada', 
    sub: 'VF = R · [(1 + i)ⁿ - 1] / i · (1 + i)', 
    detail: 'Serie de depósitos o pagos iguales realizados al comienzo de cada período de capitalización (por ejemplo, alquileres de locales comerciales o primas de seguros).' 
  }
};

export default function U4Module2() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const [history, setHistory] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | string>(1);
  const [showQuiz, setShowQuiz] = useState(false);

  const isTerminal = typeof current === 'string';

  const handleChoice = (next: number | string) => {
    if (!isTerminal) {
      setHistory(h => [...h, current as number]);
      setCurrent(next);
      const visited = new Set([...history, current as number, ...(typeof next === 'number' ? [next] : [])]).size;
      updateProgress({ u4m2NodesVisited: visited });
      if (typeof next === 'string') updateProgress({ u4m2Completed: true });
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
        <h1 className="text-2xl font-bold text-slate-900">Módulo 2: Identificación del Método</h1>
        <p className="text-slate-500">Clasificador de Modelos de Finanzas Aplicadas (Interés y Anualidades).</p>
      </header>

      <TeacherResources unitId="u4" moduleType="metodo" />

      {/* ── Situación a Analizar ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2 relative z-10 flex-1">
          <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Situación a analizar</span>
          <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Crédito Automotriz vs Cuenta de Ahorro</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Una persona evalúa pedir un préstamo con cuotas mensuales para comprar un vehículo, o bien, ahorrar ese mismo monto mensual en una cuenta para comprarlo al contado en el futuro. Se requiere saber qué modelo financiero usar para calcular el costo total. Responde el siguiente árbol de decisiones para elegir el método matemático adecuado.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200">
        <div className="p-8 sm:p-12 relative flex items-center justify-center min-h-[400px]">
          {!isTerminal ? (
            <div className="text-center max-w-lg w-full relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-10 leading-tight">{NODES[current as number].q}</h2>
              <div className="flex gap-4 justify-center">
                <button onClick={() => handleChoice(NODES[current as number].yes)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl cursor-pointer">Sí</button>
                <button onClick={() => handleChoice(NODES[current as number].no)} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl cursor-pointer">No</button>
              </div>
            </div>
          ) : (
            <div className="text-center max-w-xl w-full">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><Terminal className="w-10 h-10"/></div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">{TERMINALS[current as string].method}</h3>
              <p className="text-emerald-600 font-bold mb-6 text-xl">{TERMINALS[current as string].sub}</p>
              <p className="text-slate-600 bg-slate-50 p-6 rounded-2xl text-left leading-relaxed mb-8">{TERMINALS[current as string].detail}</p>
              
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
          <button onClick={goBack} disabled={history.length === 0} className={`flex items-center gap-2 font-bold cursor-pointer bg-transparent border-none ${history.length === 0 ? 'text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}>
            <ArrowLeft className="w-5 h-5"/> Volver
          </button>
          <div className="flex gap-2">
            {[1, 2, 3].map(step => (
              <div key={step} className={`w-2.5 h-2.5 rounded-full ${history.length + (isTerminal ? 1 : 0) >= step ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
      </div>

      {showQuiz && (
        <QuizRunner
          problem={U4_PROBLEMS.find(p => p.id === 'u4-s2-interes-simple')!}
          onClose={() => setShowQuiz(false)}
          onComplete={(scorePct, totalPts, earnedPts) => {
            setShowQuiz(false);
          }}
        />
      )}
    </div>
  );
}
