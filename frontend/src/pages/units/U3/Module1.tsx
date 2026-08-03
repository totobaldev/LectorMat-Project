import React, { useState } from 'react';
import { useFrontProps } from '../../../hooks/useFrontProps';

import { GripHorizontal, Check, RefreshCw, Layers } from 'lucide-react';

interface Chip { id: string; label: string; }
interface SlotDef { key: string; label: string; correct: string; pos: { left: string; top: string; } }

// MECANICA (Trigonometria)
const MEC_CHIPS: Chip[] = [
  { id: '138', label: '138 m' },
  { id: '29.97', label: '29.97°' },
  { id: 'sen', label: 'sen' },
  { id: 'h', label: 'h (hipot)' },
];

const MEC_SLOTS: SlotDef[] = [
  { key: 'fn', label: 'Razón', correct: 'sen', pos: { left: '16px', top: '100px' } },
  { key: 'ang', label: 'Ángulo', correct: '29.97', pos: { left: '80px', top: '100px' } },
  { key: 'op', label: 'Cateto Op', correct: '138', pos: { left: '200px', top: '60px' } },
  { key: 'hip', label: 'Hipotenusa', correct: 'h', pos: { left: '200px', top: '140px' } },
];

// ADMINISTRACION (Progresiones)
const ADM_CHIPS: Chip[] = [
  { id: '150', label: '150' },
  { id: '25', label: '25' },
  { id: '12', label: '12' },
  { id: 'a12', label: 'a₁₂' },
  { id: '175', label: '175' },
];

const ADM_SLOTS: SlotDef[] = [
  { key: 'a1', label: 'Primer Término (a₁)', correct: '150', pos: { left: '100px', top: '100px' } },
  { key: 'n', label: 'Término (n)', correct: '12', pos: { left: '200px', top: '100px' } },
  { key: 'd', label: 'Diferencia (d)', correct: '25', pos: { left: '300px', top: '100px' } },
];

export default function U3Module1() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const isAdm = progress.preSpecialty === 'administracion';
  
  const CHIPS = isAdm ? ADM_CHIPS : MEC_CHIPS;
  const SLOTS = isAdm ? ADM_SLOTS : MEC_SLOTS;

  // Initialize placements state dynamically based on active specialty
  const [placements, setPlacements] = useState<Record<string, string | null>>(() => {
    if (progress.preSpecialty === 'administracion') {
      return { a1: null, n: null, d: null };
    }
    return { fn: null, ang: null, op: null, hip: null };
  });

  const [dragged, setDragged] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const placedCount = Object.values(placements).filter(Boolean).length;

  React.useEffect(() => {
    updateProgress({ u3m1SlotsPlaced: placedCount });
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
    if (ok) updateProgress({ u3m1Completed: true });
  };

  const reset = () => {
    if (isAdm) {
      setPlacements({ a1: null, n: null, d: null });
    } else {
      setPlacements({ fn: null, ang: null, op: null, hip: null });
    }
    setChecked(false);
    setDragged(null);
  };

  const allPlaced = placedCount === SLOTS.length;
  const isOk = allPlaced && SLOTS.every(s => placements[s.key] === s.correct);

  if (isAdm) {
    // RENDER FOR ADMINISTRACION
    return (
      <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
        <header className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold">Módulo 1: Comprensión</h1>
          <p className="text-slate-500">Progresiones Aritméticas - Planificación de Entregas.</p>
        </header>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
          <p className="text-lg font-medium bg-slate-50 p-6 rounded-3xl mb-8 leading-relaxed">
            «Una empresa de servicios de reparto comenzó entregando <strong className="text-sky-600 bg-sky-100 px-1 rounded">150 paquetes</strong> el primer mes. Deciden aumentar las entregas en una cantidad constante de <strong className="text-sky-600 bg-sky-100 px-1 rounded">25 paquetes</strong> cada mes sucesivo. Queremos calcular la cantidad de entregas proyectada en el mes <strong className="text-sky-600 bg-sky-100 px-1 rounded">12</strong> (término general <i><strong className="text-sky-600 bg-sky-100 px-1 rounded">a₁₂</strong></i>).»
          </p>

          <div className="relative w-full mx-auto my-12 bg-sky-50/30 rounded-3xl p-8 border border-sky-100 flex flex-col items-center justify-center gap-8 shadow-inner">
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="text-3xl font-black text-sky-700">a₁₂ =</span>
              
              {['a1', 'n', 'd'].map((key) => {
                const sl = SLOTS.find(s => s.key === key)!;
                const placedVal = placements[sl.key];
                const chip = CHIPS.find(c => c.id === placedVal);
                const isError = checked && placedVal !== sl.correct;

                let borderColor = chip ? '#0EA5E9' : '#CBD5E1';
                let bgColor = chip ? '#ffffff' : 'rgba(255,255,255,0.9)';
                let textColor = chip ? '#0369A1' : '#94A3B8';
                let labelBg = chip ? '#F0F9FF' : '#F1F5F9';

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
                    className={`w-36 rounded-2xl border-[3px] border-dashed flex flex-col justify-center overflow-hidden transition-all duration-300`}
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

                if (key === 'a1') {
                  return (
                    <React.Fragment key={key}>
                      {slotEl}
                      <span className="text-3xl font-black text-sky-700">+ (</span>
                    </React.Fragment>
                  );
                }
                if (key === 'n') {
                  return (
                    <React.Fragment key={key}>
                      {slotEl}
                      <span className="text-3xl font-black text-sky-700">- 1 ) ·</span>
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
                  className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 font-bold cursor-grab hover:border-sky-400 hover:shadow-md transition-all active:cursor-grabbing text-sm flex items-center gap-2 text-slate-700"
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
              <button onClick={check} disabled={!allPlaced} className={`px-6 py-2 rounded-xl font-bold text-white transition-opacity cursor-pointer ${allPlaced ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-300'}`}>Verificar</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RENDER FOR MECANICA
  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <header className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold">Módulo 1: Comprensión</h1>
        <p className="text-slate-500">Trigonometría - Pirámide de Keops.</p>
      </header>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <p className="text-lg font-medium bg-slate-50 p-6 rounded-3xl mb-8 leading-relaxed">
          «La altura actual de la pirámide de Keops es de aproximadamente <strong className="text-sky-600 bg-sky-100 px-1 rounded">138 metros</strong>. Desde una estaca en el suelo, el ángulo de elevación a la cúspide es de <strong className="text-sky-600 bg-sky-100 px-1 rounded">29.97°</strong>. ¿Cuál es la distancia <i><strong className="text-sky-600 bg-sky-100 px-1 rounded">h</strong></i> (hipotenusa) entre la estaca y la cúspide?»
        </p>

        <div className="relative w-full mx-auto my-12 bg-sky-50/30 rounded-3xl p-8 border border-sky-100 flex flex-col items-center justify-center gap-8 shadow-inner">
          
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {/* Razón y Ángulo */}
            <div className="flex items-center gap-2">
              {['fn', 'ang'].map(key => {
                const sl = SLOTS.find(s => s.key === key)!;
                const placedVal = placements[sl.key];
                const chip = CHIPS.find(c => c.id === placedVal);
                const isError = checked && placedVal !== sl.correct;

                let borderColor = chip ? '#0EA5E9' : '#CBD5E1';
                let bgColor = chip ? '#ffffff' : 'rgba(255,255,255,0.9)';
                let textColor = chip ? '#0369A1' : '#94A3B8';
                let labelBg = chip ? '#F0F9FF' : '#F1F5F9';

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
                    className={`w-28 rounded-2xl border-[3px] border-dashed flex flex-col justify-center overflow-hidden transition-all duration-300`}
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

                if (key === 'ang') {
                  return (
                    <React.Fragment key={key}>
                      <span className="text-3xl font-black text-sky-700">(</span>
                      {slotEl}
                      <span className="text-3xl font-black text-sky-700">)</span>
                    </React.Fragment>
                  );
                }
                return slotEl;
              })}
            </div>
            
            <span className="text-3xl font-black text-sky-700">=</span>
            
            {/* Fracción (Opuesto / Hipotenusa) */}
            <div className="flex flex-col items-center gap-3">
              {['op', 'hip'].map((key, idx) => {
                const sl = SLOTS.find(s => s.key === key)!;
                const placedVal = placements[sl.key];
                const chip = CHIPS.find(c => c.id === placedVal);
                const isError = checked && placedVal !== sl.correct;

                let borderColor = chip ? '#0EA5E9' : '#CBD5E1';
                let bgColor = chip ? '#ffffff' : 'rgba(255,255,255,0.9)';
                let textColor = chip ? '#0369A1' : '#94A3B8';
                let labelBg = chip ? '#F0F9FF' : '#F1F5F9';

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

                return (
                  <React.Fragment key={key}>
                    {slotEl}
                    {idx === 0 && <div className="w-full h-1.5 bg-sky-700 rounded-full"></div>}
                  </React.Fragment>
                );
              })}
            </div>
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
                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 font-bold cursor-grab hover:border-sky-400 hover:shadow-md transition-all active:cursor-grabbing text-sm flex items-center gap-2 text-slate-700 shadow-sm"
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
            <button onClick={check} disabled={!allPlaced} className={`px-6 py-2 rounded-xl font-bold text-white transition-opacity cursor-pointer ${allPlaced ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-300'}`}>Verificar</button>
          )}
        </div>
      </div>
    </div>
  );
}
