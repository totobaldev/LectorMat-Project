import React, { useState, useEffect } from 'react';
import { useFrontProps } from '../../../hooks/useFrontProps';

import { Check } from 'lucide-react';

interface NodeDef {
  id: string;
  q: string;
  yes: number | string;
  no: number | string;
}

interface TerminalDef {
  method: string;
  sub: string;
  detail: string;
}

const NODES: Record<number, NodeDef> = {
  1: { id: '01', q: '¿La situación presenta una tasa de cambio constante (sube o baja siempre lo mismo en cada paso)?', yes: 2, no: 3 },
  2: { id: '02', q: '¿El valor inicial (cuando no hay consumo o tiempo cero) es cero?', yes: 'T:Lineal', no: 'T:Afin' },
  3: { id: '03', q: '¿La gráfica describe un comportamiento con un solo punto máximo o mínimo (ej. una parábola o lanzamiento)?', yes: 'T:Quad', no: 'T:Cubic' },
};

const TERMINALS: Record<string, TerminalDef> = {
  'T:Lineal': { method: 'Función Lineal Pura', sub: 'Grado 1: f(x) = m·x', detail: 'Modela proporcionalidad directa. Aplica para situaciones sin costo fijo o valor inicial.' },
  'T:Afin': { method: 'Función Afín', sub: 'Grado 1: f(x) = m·x + n', detail: 'Crecimiento o decrecimiento constante con un valor base. Ej: Cuentas de servicios con cargo fijo, precio del combustible.' },
  'T:Quad': { method: 'Función Cuadrática', sub: 'Grado 2: f(x) = ax² + bx + c', detail: 'Modela trayectorias parabólicas, lanzamientos de proyectiles y optimización con un único extremo (máximo o mínimo).' },
  'T:Cubic': { method: 'Ajuste de Grado Superior', sub: 'Grados 3 o más', detail: 'Modela fenómenos con múltiples cambios de tendencia. Ej: Variación impredecible de stock (desabastecimiento).' },
};

export default function Module2() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const [currentNode, setCurrentNode] = useState<number | string>(1);
  const [path, setPath] = useState<{ q: string; ans: string }[]>([]);

  const isTerminal = typeof currentNode === 'string' && currentNode.startsWith('T:');

  useEffect(() => {
    updateProgress({ m2NodesVisited: path.length });
    if (isTerminal) updateProgress({ m2Completed: true });
  }, [path.length, isTerminal]);

  const handleChoice = (ans: 'yes' | 'no') => {
    if (isTerminal) return;
    const n = NODES[currentNode as number];
    const nextNode = ans === 'yes' ? n.yes : n.no;
    setPath(prev => [...prev, { q: n.q, ans: ans === 'yes' ? 'Sí' : 'No' }]);
    setCurrentNode(nextNode);
  };

  const reset = () => {
    setCurrentNode(1);
    setPath([]);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-emerald-50 to-teal-50 p-6 sm:p-8 rounded-[2rem] border border-emerald-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">M2: Identificación del <span className="text-emerald-600">método</span></h1>
          <p className="text-emerald-600 font-medium">Recorre el árbol de decisión B3 nodo a nodo.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-40 transform translate-x-1/3 -translate-y-1/3"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full">
        {/* Node Card */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] min-h-[440px] flex flex-col justify-center relative overflow-hidden">
          {!isTerminal && <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>}
          
          {!isTerminal ? (
            <div className="max-w-xl mx-auto w-full relative z-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="text-sm font-extrabold text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-200">Nodo {NODES[currentNode as number].id}</span>
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Pregunta de decisión</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-12 leading-tight">
                {NODES[currentNode as number].q}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleChoice('yes')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 text-xl cursor-pointer hover:-translate-y-1 border border-emerald-500"
                >
                  Sí
                </button>
                <button 
                   onClick={() => handleChoice('no')}
                   className="bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 text-rose-700 font-extrabold py-5 rounded-2xl transition-all text-xl cursor-pointer hover:-translate-y-1"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto w-full text-center relative z-10 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-emerald-200">
                <Check className="w-12 h-12" strokeWidth={3} />
              </div>
              <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-3 bg-emerald-50 inline-block px-4 py-1.5 rounded-full border border-emerald-100">Método Sugerido</div>
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                {TERMINALS[currentNode as string].method}
              </h2>
              <div className="text-lg text-emerald-600 font-extrabold mb-8">
                {TERMINALS[currentNode as string].sub}
              </div>
              <p className="text-lg text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {TERMINALS[currentNode as string].detail}
              </p>
              
              <button 
                onClick={reset}
                className="mt-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-4 px-10 rounded-2xl transition-colors cursor-pointer"
              >
                Volver al inicio del árbol
              </button>
            </div>
          )}
        </div>

        {/* Path + Context */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6">Tu recorrido</h3>
            {path.length === 0 ? (
              <div className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100">El recorrido comenzará aquí.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {path.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                    <span className={`text-sm font-black px-3 py-1 bg-white rounded-lg border-2 shadow-sm shrink-0 ${step.ans === 'Sí' ? 'border-emerald-200 text-emerald-600' : 'border-rose-200 text-rose-600'}`}>
                      {step.ans}
                    </span>
                    <span className="text-sm text-slate-700 font-bold leading-snug pt-1">
                      {step.q}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-[2rem] p-7 shadow-sm">
            <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-widest mb-4">Contexto de Uso</h3>
            <div className="space-y-4 text-sm text-indigo-900/80 leading-relaxed">
              <p className="bg-white/60 p-3 rounded-xl border border-indigo-100"><strong className="font-extrabold text-indigo-900 block mb-1">Cálculo de cobros:</strong> Servicios eléctricos, planes de telefonía, combustibles, usando modelos afines.</p>
              <p className="bg-white/60 p-3 rounded-xl border border-indigo-100"><strong className="font-extrabold text-indigo-900 block mb-1">Balística y Optimización:</strong> Lanzamiento de proyectiles o piedras, control de máximos y mínimos con modelos cuadráticos.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
