import React, { useState } from 'react';
import { SharedProps } from '../types';
import { GripHorizontal, Check, RefreshCw, Layers } from 'lucide-react';

interface Chip { id: string; label: string; }
interface SlotDef { key: string; label: string; correct: string; pos: { left: string; top: string; } }

const CHIPS: Chip[] = [
  { id: '100', label: '100' },
  { id: '1.20', label: '1.20' },
  { id: '3', label: '3 h' },
  { id: 'Nt', label: 'P(3) = ?' },
];

const SLOTS: SlotDef[] = [
  { key: 'N0', label: 'Valor Inicial', correct: '100', pos: { left: '100px', top: '100px' } },
  { key: 'b', label: 'Base', correct: '1.20', pos: { left: '200px', top: '100px' } },
  { key: 't', label: 'Tiempo (exponente)', correct: '3', pos: { left: '270px', top: '70px' } },
];

export default function U2Module1({ progress, updateProgress }: SharedProps) {
  const [placements, setPlacements] = useState<Record<string, string | null>>({ N0: null, b: null, t: null });
  const [dragged, setDragged] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const placedCount = Object.values(placements).filter(Boolean).length;

  React.useEffect(() => {
    updateProgress({ u2m1SlotsPlaced: placedCount });
  }, [placedCount]);

  const handleDrop = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    if (!dragged) return;
    setPlacements(prev => {
      const next = { ...prev };
      for (const k in next) if (next[k] === dragged) next[k] = null;
      next[slotKey] = dragged;
      return next;
    });
    setDragged(null);
  };

  const check = () => {
    setChecked(true);
    const ok = SLOTS.every(s => placements[s.key] === s.correct);
    if (ok) updateProgress({ u2m1Completed: true });
  };

  const reset = () => {
    setPlacements({ N0: null, b: null, t: null });
    setChecked(false);
    setDragged(null);
  };

  const allPlaced = placedCount === SLOTS.length;
  const isOk = allPlaced && SLOTS.every(s => placements[s.key] === s.correct);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <header className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold">Módulo 1: Comprensión</h1>
        <p className="text-slate-500">Funciones Exponenciales.</p>
      </header>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <p className="text-lg font-medium bg-slate-50 p-6 rounded-3xl mb-8">
          «En un laboratorio hay inicialmente <strong className="text-violet-600 bg-violet-100 px-1 rounded">100 bacterias</strong>. La población crece a una tasa del <strong className="text-violet-600 bg-violet-100 px-1 rounded">20% por hora</strong>. ¿Cuál será la población de bacterias después de <strong className="text-violet-600 bg-violet-100 px-1 rounded">3 horas</strong>?»
        </p>

        <div className="relative w-full mx-auto my-12 bg-violet-50/30 rounded-3xl p-8 border border-violet-100 flex flex-col items-center justify-center gap-6 shadow-inner">
          <div className="text-2xl font-black text-violet-700 bg-violet-100/50 px-6 py-2 rounded-2xl border border-violet-200">
            P(t) = N₀ · bᵗ
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-3xl font-black text-violet-700">P(3) =</span>
            
            {['N0', 'b', 't'].map((key) => {
              const sl = SLOTS.find(s => s.key === key)!;
              const placedVal = placements[sl.key];
              const chip = CHIPS.find(c => c.id === placedVal);
              const isError = checked && placedVal !== sl.correct;

              let borderColor = chip ? '#8B5CF6' : '#CBD5E1';
              let bgColor = chip ? '#ffffff' : 'rgba(255,255,255,0.9)';
              let textColor = chip ? '#4C1D95' : '#94A3B8';
              let labelBg = chip ? '#F5F3FF' : '#F1F5F9';

              if (checked && !isError) {
                borderColor = '#10B981'; bgColor = '#ECFDF5'; textColor = '#065F46'; labelBg = '#D1FAE5';
              } else if (isError) {
                borderColor = '#EF4444'; bgColor = '#FEF2F2'; textColor = '#991B1B'; labelBg = '#FEE2E2';
              }

              const slotEl = (
                <div 
                  key={sl.key}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(e, sl.key)}
                  className={`w-24 rounded-2xl border-[3px] border-dashed flex flex-col justify-center overflow-hidden transition-all duration-300`}
                  style={{ 
                    borderColor, backgroundColor: bgColor,
                    cursor: chip ? 'pointer' : 'default',
                  }}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider w-full text-center py-1 transition-colors" style={{ backgroundColor: labelBg, color: textColor }}>{sl.label}</div>
                  <div className="font-extrabold text-sm text-center py-2 min-h-[36px] flex items-center justify-center transition-colors" style={{ color: textColor }}>
                    {chip ? chip.label : '...'}
                  </div>
                </div>
              );

              if (key === 'b') {
                return (
                  <React.Fragment key={key}>
                    <span className="text-3xl font-black text-violet-700">· (</span>
                    {slotEl}
                    <span className="text-3xl font-black text-violet-700">)</span>
                  </React.Fragment>
                );
              }
              if (key === 't') {
                return (
                  <React.Fragment key={key}>
                    <span className="text-3xl font-black text-violet-700">^</span>
                    {slotEl}
                  </React.Fragment>
                );
              }
              return slotEl;
            })}
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-8">
          {CHIPS.map(c => {
            const isUsed = Object.values(placements).includes(c.id);
            if (isUsed) return null;
            return (
              <div
                key={c.id}
                draggable
                onDragStart={() => setDragged(c.id)}
                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 font-bold cursor-grab hover:border-violet-400 hover:shadow-md transition-all active:cursor-grabbing"
              >
                {c.label}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
          <button onClick={reset} className="flex gap-2 items-center text-slate-500 font-bold hover:text-slate-800"><RefreshCw className="w-5 h-5"/> Reiniciar</button>
          {checked && isOk ? (
            <div className="flex bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-xl items-center gap-2"><Check className="w-5 h-5"/> ¡Correcto!</div>
          ) : (
            <button onClick={check} disabled={!allPlaced} className={`px-6 py-2 rounded-xl font-bold text-white transition-opacity ${allPlaced ? 'bg-violet-600 hover:bg-violet-700' : 'bg-slate-300'}`}>Verificar</button>
          )}
        </div>
      </div>
    </div>
  );
}
