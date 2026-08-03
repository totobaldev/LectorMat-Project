import React, { useState } from 'react';
import { useFrontProps } from '../../../hooks/useFrontProps';


interface Chip {
  id: string;
  label: string;
}

interface SlotDef {
  key: string;
  label: string;
  correct: string;
  pos: { left: string; top: string };
}

const CHIPS: Chip[] = [
  { id: '200', label: '$200' },
  { id: '900', label: '$900' },
  { id: '8300', label: '$8300' },
  { id: '1100', label: '$1100' },
];

const SLOTS: SlotDef[] = [
  { key: 'm', label: 'Costo Variable (m)', correct: '200', pos: { left: '16px', top: '100px' } },
  { key: 'n', label: 'Cargo Fijo (n)', correct: '900', pos: { left: '226px', top: '100px' } },
  { key: 'y', label: 'Total a Pagar (y)', correct: '8300', pos: { left: '120px', top: '210px' } },
];

export default function Module1() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const [placements, setPlacements] = useState<Record<string, string | null>>({ m: null, n: null, y: null });
  const [dragged, setDragged] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const placedIds = Object.values(placements).filter(Boolean) as string[];
  const correctCount = SLOTS.filter(sl => placements[sl.key] === sl.correct).length;
  
  React.useEffect(() => {
    updateProgress({ m1SlotsPlaced: placedIds.length });
    if (checked && correctCount === 3) {
      updateProgress({ m1Completed: true });
    }
  }, [placedIds.length, checked, correctCount]);

  const handleDropSlot = (slotKey: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!dragged) return;
    const newPlacements = { ...placements };
    Object.keys(newPlacements).forEach(k => {
      if (newPlacements[k] === dragged) newPlacements[k] = null;
    });
    newPlacements[slotKey] = dragged;
    setPlacements(newPlacements);
    setDragged(null);
    setChecked(false);
  };

  const handleReturnToTray = () => {
    if (!dragged) return;
    const newPlacements = { ...placements };
    Object.keys(newPlacements).forEach(k => {
      if (newPlacements[k] === dragged) newPlacements[k] = null;
    });
    setPlacements(newPlacements);
    setDragged(null);
    setChecked(false);
  };

  const reset = () => {
    setPlacements({ m: null, n: null, y: null });
    setChecked(false);
    setDragged(null);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-indigo-50 to-blue-50 p-6 sm:p-8 rounded-[2rem] border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">M1: <span className="text-indigo-600">Comprensión</span> del enunciado</h1>
          <p className="text-indigo-600 font-medium">Arrastra cada dato a su lugar en el triángulo.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-40 transform translate-x-1/3 -translate-y-1/3"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full">
        {/* LEFT: exercise */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full">
          <div className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-4 py-1.5 rounded-full inline-block mb-6 shadow-sm border border-indigo-200/50">Funciones · Afín</div>
          <p className="text-lg md:text-xl text-slate-700 mb-8 leading-relaxed font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100">
            «El cobro del servicio eléctrico considera costos fijos (por administración) y costos variables (energía consumida). Se observa que consumiendo <strong className="font-black text-indigo-600 bg-indigo-100/50 px-1 rounded">1 kWh</strong> se pagan <strong className="font-black text-indigo-600 bg-indigo-100/50 px-1 rounded">$1100</strong> y por <strong className="font-black text-indigo-600 bg-indigo-100/50 px-1 rounded">2 kWh</strong> se pagan $1300. Si un cliente debe pagar un total de <strong className="font-black text-indigo-600 bg-indigo-100/50 px-1 rounded">$8300</strong>, ¿cuánta energía consumió?»
          </p>

          <div className="relative w-full mx-auto my-12 bg-indigo-50/30 rounded-3xl p-8 border border-indigo-100 flex flex-col items-center justify-center gap-6 shadow-inner">
            <div className="text-2xl font-black text-indigo-700 bg-indigo-100/50 px-6 py-2 rounded-2xl border border-indigo-200">
              f(x) = m·x + n
            </div>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {['y', 'm', 'n'].map((key) => {
                const sl = SLOTS.find(s => s.key === key)!;
                const chipId = placements[sl.key];
                const chip = chipId ? CHIPS.find(c => c.id === chipId) : null;
                const isOk = checked && chipId === sl.correct;
                const isBad = checked && chipId && chipId !== sl.correct;
                
                let borderColor = chip ? '#4F46E5' : '#CBD5E1';
                let bgColor = chip ? '#ffffff' : 'rgba(255,255,255,0.9)';
                let textColor = chip ? '#1E1B4B' : '#94A3B8';
                let labelBg = chip ? '#EEF2FF' : '#F1F5F9';
                let shadow = chip ? '0 4px 6px -1px rgba(79,70,229,0.2)' : 'none';
                
                if (isOk) { borderColor = '#10B981'; bgColor = '#ECFDF5'; textColor = '#065F46'; labelBg = '#D1FAE5'; shadow = '0 4px 6px -1px rgba(16,185,129,0.2)'; }
                else if (isBad) { borderColor = '#EF4444'; bgColor = '#FEF2F2'; textColor = '#991B1B'; labelBg = '#FEE2E2'; shadow = '0 4px 6px -1px rgba(239,68,68,0.2)'; }

                const slotEl = (
                  <div 
                    key={sl.key}
                    onDrop={(e) => handleDropSlot(sl.key, e)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => { if (chipId) { setDragged(chipId); handleReturnToTray(); } }}
                    className="w-40 rounded-2xl border-[3px] border-dashed flex flex-col justify-center overflow-hidden transition-all duration-300"
                    style={{ 
                      borderColor, backgroundColor: bgColor,
                      cursor: chip ? 'pointer' : 'default',
                      boxShadow: shadow
                    }}
                  >
                    <div className="text-[11px] uppercase font-bold tracking-wider w-full text-center py-1.5 transition-colors" style={{ backgroundColor: labelBg, color: textColor }}>{sl.label}</div>
                    <div className="font-extrabold text-base text-center py-2 min-h-[40px] flex items-center justify-center transition-colors" style={{ color: textColor }}>
                      {chip ? chip.label : '...'}
                    </div>
                  </div>
                );

                if (key === 'y') {
                  return (
                    <React.Fragment key={key}>
                      {slotEl}
                      <span className="text-3xl font-black text-indigo-700">=</span>
                    </React.Fragment>
                  );
                }
                if (key === 'm') {
                  return (
                    <React.Fragment key={key}>
                      {slotEl}
                      <span className="text-3xl font-black text-indigo-700">· x +</span>
                    </React.Fragment>
                  );
                }
                return slotEl;
              })}
            </div>
          </div>

          <div 
            onDrop={(e) => { e.preventDefault(); handleReturnToTray(); }}
            onDragOver={(e) => e.preventDefault()}
            className="mt-12 bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8"
          >
            <div className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-4">Datos del enunciado disponibles</div>
            <div className="flex flex-wrap gap-4 min-h-[56px]">
              {CHIPS.filter(c => !placedIds.includes(c.id)).map(chip => (
                <div 
                  key={chip.id}
                  draggable 
                  onDragStart={() => setDragged(chip.id)}
                  className="cursor-grab select-none font-bold text-base py-3 px-6 rounded-2xl bg-white text-indigo-900 border-2 border-indigo-100 shadow-sm hover:border-indigo-400 hover:shadow-md hover:-translate-y-1 active:cursor-grabbing transition-all hover:text-indigo-600"
                >
                  {chip.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={() => setChecked(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 hover:-translate-y-1 cursor-pointer"
            >
              Verificar resultado
            </button>
            <button 
              onClick={reset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 px-8 rounded-2xl transition-colors cursor-pointer"
            >
              Reiniciar
            </button>
            
            {checked && (
              <span className={`text-base font-extrabold ml-2 ${correctCount === 3 ? 'text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200' : 'text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-200'}`}>
                {correctCount === 3 
                  ? '¡Excelente! Datos bien ubicados. Insignia lograda.' 
                  : `${correctCount} de 3 correctos. ¡Inténtalo de nuevo!`}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Guide */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-[2rem] p-8 flex flex-col gap-6 shadow-xl border border-indigo-900 relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          
          <div className="relative z-10">
            <span className="text-xs font-bold text-indigo-200 bg-indigo-800/50 px-4 py-1.5 rounded-full border border-indigo-700">Guía B1</span>
            <h3 className="text-2xl font-extrabold mt-5 mb-2 leading-tight">Momentos de <span className="text-indigo-400">lectura</span></h3>
          </div>
          
          <div className="flex flex-col gap-4 relative z-10 mt-2">
            <div className="bg-indigo-900/40 rounded-2xl p-6 border border-indigo-800/50 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-indigo-500/40">1</div>
                <div className="font-extrabold text-indigo-200 text-lg">Prelectura</div>
              </div>
              <p className="text-sm text-indigo-100/80 leading-relaxed">¿De qué contexto habla? ¿Qué palabras clave reconozco?</p>
            </div>
            
            <div className="bg-emerald-900/30 rounded-2xl p-6 border border-emerald-800/50 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-emerald-500/40">2</div>
                <div className="font-extrabold text-emerald-200 text-lg">Lectura activa</div>
              </div>
              <p className="text-sm text-emerald-100/80 leading-relaxed">¿Qué datos entrega? ¿Qué se pide? Subraya y traspasa al dibujo.</p>
            </div>
            
            <div className="bg-amber-900/30 rounded-2xl p-6 border border-amber-800/50 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-amber-500/40">3</div>
                <div className="font-extrabold text-amber-200 text-lg">Post-lectura</div>
              </div>
              <p className="text-sm text-amber-100/80 leading-relaxed">¿Puedo reformularlo con mis palabras? ¿Tiene sentido real?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
