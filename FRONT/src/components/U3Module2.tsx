import React, { useState } from 'react';
import { SharedProps } from '../types';
import { BrainCircuit, ArrowLeft, Terminal } from 'lucide-react';

interface NodeDef { id: string; q: string; yes: number | string; no: number | string; }
interface TerminalDef { method: string; sub: string; detail: string; }

// MECANICA (Trigonometria)
const MEC_NODES: Record<number, NodeDef> = {
  1: { id: '01', q: '¿Se trata de un problema en un triángulo rectángulo?', yes: 2, no: 3 },
  2: { id: '02', q: '¿Conozco un ángulo agudo y un lado, y busco otro lado u ángulo?', yes: 'T:Razones', no: 'T:Pit' },
  3: { id: '03', q: '¿Es un triángulo donde conozco dos lados y el ángulo entre ellos, o los tres lados?', yes: 'T:Cos', no: 4 },
  4: { id: '04', q: '¿Es un triángulo donde conozco dos ángulos y un lado, o dos lados y el ángulo opuesto de uno de ellos?', yes: 'T:Sen', no: 'T:Func' },
};

const MEC_TERMINALS: Record<string, TerminalDef> = {
  'T:Razones': { method: 'Razones Trigonométricas (sen, cos, tan)', sub: 'SOH-CAH-TOA', detail: 'Si buscas el cateto opuesto teniendo hipotenusa, usas Seno. Si buscas cateto adyacente teniendo opuesto, usas Tangente, etc.' },
  'T:Pit': { method: 'Teorema de Pitágoras', sub: 'a² + b² = c²', detail: 'Útil si conoces dos lados de un triángulo rectángulo y buscas el tercero sin importar los ángulos.' },
  'T:Cos': { method: 'Teorema del Coseno', sub: 'c² = a² + b² - 2ab·cos(C)', detail: 'Permite encontrar el tercer lado si conoces dos y el ángulo que forman, o encontrar cualquier ángulo si conoces los tres lados.' },
  'T:Sen': { method: 'Teorema del Seno', sub: 'a/sen(A) = b/sen(B) = c/sen(C)', detail: 'Útil para resolver triángulos oblicuángulos cuando conoces proporciones opuestas.' },
  'T:Func': { method: 'Funciones Trigonométricas y Ondas', sub: 'f(t) = A·sen(wt + φ)', detail: 'Modelos de oscilación armónica (resortes, péndulos, ondas acústicas).' }
};

// ADMINISTRACION (Progresiones)
const ADM_NODES: Record<number, NodeDef> = {
  1: { id: '01', q: '¿La diferencia o variación entre cada término consecutivo se obtiene sumando o restando una cantidad fija (diferencia común)?', yes: 'T:Aritmetica', no: 2 },
  2: { id: '02', q: '¿Cada término se obtiene multiplicando o dividiendo el anterior por una razón constante (factor de escala)?', yes: 'T:Geometrica', no: 3 },
  3: { id: '03', q: '¿El problema te pide calcular el valor acumulado o sumatoria de todos los términos hasta cierto período (por ejemplo, sumas de ahorro)?', yes: 4, no: 'T:Recurrencia' },
  4: { id: '04', q: '¿La sumatoria acumulada corresponde a términos que crecen de manera aritmética (aditiva)?', yes: 'T:SumaAritmetica', no: 'T:SumaGeometrica' },
};

const ADM_TERMINALS: Record<string, TerminalDef> = {
  'T:Aritmetica': { 
    method: 'Progresión Aritmética (Término General)', 
    sub: 'a_n = a_1 + (n - 1) · d', 
    detail: 'Útil para calcular el valor de cualquier término en una secuencia donde el incremento mensual, diario o anual es constante (por ejemplo: cuotas de ahorro aditivas, depreciación lineal).' 
  },
  'T:Geometrica': { 
    method: 'Progresión Geométrica (Término General)', 
    sub: 'a_n = a_1 · r^(n - 1)', 
    detail: 'Ideal para secuencias que crecen de forma proporcional o porcentual multiplicativa (por ejemplo: población de bacterias, depreciación de maquinaria por porcentaje fijo, tasas de crecimiento compuesto).' 
  },
  'T:Recurrencia': { 
    method: 'Sucesiones por Recurrencia', 
    sub: 'a_n = f(a_n-1)', 
    detail: 'Sucesiones donde no hay una razón lineal ni multiplicativa constante, sino reglas personalizadas de cálculo entre términos adyacentes.' 
  },
  'T:SumaAritmetica': { 
    method: 'Suma de una Progresión Aritmética', 
    sub: 'S_n = n · (a_1 + a_n) / 2', 
    detail: 'Se aplica cuando quieres calcular la acumulación total de una progresión aditiva (por ejemplo, el total de dinero ahorrado tras 12 meses depositando un monto que incrementa aditivamente en $5.000 mensuales).' 
  },
  'T:SumaGeometrica': { 
    method: 'Suma de una Progresión Geométrica', 
    sub: 'S_n = a_1 · (r^n - 1) / (r - 1)', 
    detail: 'Se aplica para calcular la acumulación total en progresiones multiplicativas o cuando cada término crece porcentualmente de manera acumulativa.' 
  }
};

export default function U3Module2({ progress, updateProgress }: SharedProps) {
  const isAdm = progress.preSpecialty === 'administracion';
  
  const NODES = isAdm ? ADM_NODES : MEC_NODES;
  const TERMINALS = isAdm ? ADM_TERMINALS : MEC_TERMINALS;

  const [history, setHistory] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | string>(1);

  const isTerminal = typeof current === 'string';

  const handleChoice = (next: number | string) => {
    if (!isTerminal) {
      setHistory(h => [...h, current as number]);
      setCurrent(next);
      const visited = new Set([...history, current as number, ...(typeof next === 'number' ? [next] : [])]).size;
      updateProgress({ u3m2NodesVisited: visited });
      if (typeof next === 'string') updateProgress({ u3m2Completed: true });
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

  const restart = () => {
    setHistory([]);
    setCurrent(1);
  };

  const totalSteps = isAdm ? 4 : 4;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <header className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Módulo 2: Identificación del Método</h1>
        <p className="text-slate-500">
          {isAdm ? 'Progresiones y Sucesiones (Modelos Aritméticos / Geométricos).' : 'Trigonometría (Teoremas y Funciones).'}
        </p>
      </header>

      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200">
        <div className="p-8 sm:p-12 relative flex items-center justify-center min-h-[400px]">
          {!isTerminal ? (
            <div className="text-center max-w-lg w-full relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-10 leading-tight">{NODES[current as number].q}</h2>
              <div className="flex gap-4 justify-center">
                <button onClick={() => handleChoice(NODES[current as number].yes)} className={`flex-1 ${isAdm ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-sky-600 hover:bg-sky-700'} text-white font-bold py-4 rounded-xl cursor-pointer`}>Sí</button>
                <button onClick={() => handleChoice(NODES[current as number].no)} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl cursor-pointer">No</button>
              </div>
            </div>
          ) : (
            <div className="text-center max-w-xl w-full">
              <div className={`w-20 h-20 ${isAdm ? 'bg-indigo-100 text-indigo-600' : 'bg-sky-100 text-sky-600'} rounded-full flex items-center justify-center mx-auto mb-6`}><Terminal className="w-10 h-10"/></div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">{TERMINALS[current as string].method}</h3>
              <p className={`${isAdm ? 'text-indigo-600' : 'text-sky-600'} font-bold mb-6 text-xl`}>{TERMINALS[current as string].sub}</p>
              <p className="text-slate-600 bg-slate-50 p-6 rounded-2xl text-left leading-relaxed">{TERMINALS[current as string].detail}</p>
              
              <button onClick={restart} className="mt-8 text-sm font-bold text-slate-500 hover:text-slate-800 cursor-pointer bg-transparent border-none">Reiniciar Clasificador</button>
            </div>
          )}
        </div>
        <div className="bg-slate-50 p-5 px-8 flex justify-between items-center border-t border-slate-100">
          <button onClick={goBack} disabled={history.length === 0} className={`flex items-center gap-2 font-bold cursor-pointer bg-transparent border-none ${history.length === 0 ? 'text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}>
            <ArrowLeft className="w-5 h-5"/> Volver
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, step) => (
              <div key={step} className={`w-2.5 h-2.5 rounded-full ${history.length + (isTerminal ? 1 : 0) >= step + 1 ? (isAdm ? 'bg-indigo-600' : 'bg-sky-600') : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
