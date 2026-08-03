import React, { useState } from 'react';
import { useFrontProps } from '../../../hooks/useFrontProps';

import { GripHorizontal, Check, RefreshCw, Layers } from 'lucide-react';

interface Chip { id: string; label: string; }
interface SlotDef { key: string; label: string; correct: string; pos: { left: string; top: string; } }

const CHIPS: Chip[] = [
  { id: '1000000', label: '$1.000.000' },
  { id: '0.02', label: '0.02 (2%)' },
  { id: '6', label: '6 meses' },
  { id: 'VF', label: 'VF' },
  { id: '12', label: '12 meses' },
];

const SLOTS: SlotDef[] = [
  { key: 'VP', label: 'Valor Presente (VP)', correct: '1000000', pos: { left: '100px', top: '100px' } },
  { key: 'i', label: 'Tasa Interés (i)', correct: '0.02', pos: { left: '220px', top: '100px' } },
  { key: 'n', label: 'Períodos (n)', correct: '6', pos: { left: '320px', top: '70px' } },
];

export default function U4Module1() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const [placements, setPlacements] = useState<Record<string, string | null>>({ VP: null, i: null, n: null });
  const [dragged, setDragged] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const placedCount = Object.values(placements).filter(Boolean).length;

  React.useEffect(() => {
    updateProgress({ u4m1SlotsPlaced: placedCount });
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
    if (ok) updateProgress({ u4m1Completed: true });
  };

  const reset = () => {
    setPlacements({ VP: null, i: null, n: null });
    setChecked(false);
    setDragged(null);
  };

  const allPlaced = placedCount === SLOTS.length;
  const isOk = allPlaced && SLOTS.every(s => placements[s.key] === s.correct);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <header className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold">Módulo 1: Comprensión de Enunciado</h1>
        <p className="text-slate-500">Finanzas aplicadas - Valor Futuro con Interés Compuesto.</p>
      </header>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <p className="text-lg font-medium bg-slate-50 p-6 rounded-3xl mb-8 leading-relaxed">
          «Un microempresario solicita un crédito de consumo de <strong className="text-emerald-600 bg-emerald-100 px-1 rounded">$1.000.000</strong> a una tasa de interés compuesto mensual del <strong className="text-emerald-600 bg-emerald-100 px-1 rounded">2%</strong> por un período de <strong className="text-emerald-600 bg-emerald-100 px-1 rounded">6 meses</strong>. Queremos plantear el cálculo del valor futuro acumulado (<i><strong className="text-emerald-600 bg-emerald-100 px-1 rounded">VF</strong></i>) para entender el costo total del financiamiento.»
        </p>

        <div className="relative w-full mx-auto my-12 bg-emerald-50/30 rounded-3xl p-8 border border-emerald-100 flex flex-col items-center justify-center gap-6 shadow-inner">
          <div className="text-2xl font-black text-emerald-700 bg-emerald-100/50 px-6 py-2 rounded-2xl border border-emerald-200">
            VF = VP · (1 + i)ⁿ
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-3xl font-black text-emerald-700">VF =</span>
            
            {['VP', 'i', 'n'].map((key) => {
              const sl = SLOTS.find(s => s.key === key)!;
              const placedVal = placements[sl.key];
              const chip = CHIPS.find(c => c.id === placedVal);
              const isError = checked && placedVal !== sl.correct;

              let borderColor = chip ? '#10B981' : '#CBD5E1';
              let bgColor = chip ? '#ffffff' : 'rgba(255,255,255,0.9)';
              let textColor = chip ? '#065F46' : '#94A3B8';
              let labelBg = chip ? '#ECFDF5' : '#F1F5F9';

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
                  className={`w-32 rounded-2xl border-[3px] border-dashed flex flex-col justify-center overflow-hidden transition-all duration-300`}
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

              if (key === 'VP') {
                return (
                  <React.Fragment key={key}>
                    {slotEl}
                    <span className="text-3xl font-black text-emerald-700">· (1 +</span>
                  </React.Fragment>
                );
              }
              if (key === 'i') {
                return (
                  <React.Fragment key={key}>
                    {slotEl}
                    <span className="text-3xl font-black text-emerald-700">)</span>
                  </React.Fragment>
                );
              }
              return slotEl;
            })}
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          {CHIPS.map(c => {
            const isUsed = Object.values(placements).includes(c.id);
            if (isUsed) return null;
            return (
              <div
                key={c.id}
                draggable
                onDragStart={() => setDragged(c.id)}
                className="bg-white border-2 border-slate-200 rounded-xl px-5 py-2.5 font-bold cursor-grab hover:border-emerald-400 hover:shadow-md transition-all active:cursor-grabbing text-sm flex items-center gap-2 text-slate-700 shadow-sm"
              >
                <GripHorizontal className="w-4 h-4 text-slate-400" />
                {c.label}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
          <button onClick={reset} className="flex gap-2 items-center text-slate-500 font-bold hover:text-slate-800 cursor-pointer bg-transparent border-none"><RefreshCw className="w-5 h-5"/> Reiniciar</button>
          {checked && isOk ? (
            <div className="flex bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-xl items-center gap-2"><Check className="w-5 h-5"/> ¡Correcto!</div>
          ) : (
            <button onClick={check} disabled={!allPlaced} className={`px-6 py-2 rounded-xl font-bold text-white transition-opacity cursor-pointer ${allPlaced ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm' : 'bg-slate-300'}`}>Verificar</button>
          )}
        </div>
      </div>
    </div>
  );
}
