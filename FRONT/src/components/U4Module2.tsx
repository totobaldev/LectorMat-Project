import React, { useState } from 'react';
import { SharedProps } from '../types';
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

export default function U4Module2({ progress, updateProgress }: SharedProps) {
  const [history, setHistory] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | string>(1);

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
              <p className="text-slate-600 bg-slate-50 p-6 rounded-2xl text-left leading-relaxed">{TERMINALS[current as string].detail}</p>
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
    </div>
  );
}
