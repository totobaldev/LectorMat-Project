import React, { useState } from 'react';
import { Screen, ProgressState } from '../types';
import { BookOpen, Compass, Zap, LayoutDashboard, Home, BookOpenCheck, GitMerge, FileQuestion, MessageSquare, BarChart2, ChevronDown, ChevronRight, Activity, GraduationCap } from 'lucide-react';

interface SidebarProps {
  currentScreen: Screen;
  setScreen: (s: Screen) => void;
  progress: ProgressState;
}

export default function Sidebar({ currentScreen, setScreen, progress }: SidebarProps) {
  const m1Pct = progress.m1Completed ? 100 : Math.round((progress.m1SlotsPlaced / 3) * 55);
  const m2Pct = progress.m2Completed ? 100 : Math.min(85, progress.m2NodesVisited * 30);
  const m3Pct = Math.round((progress.m3CompletedLevels / 3) * 100);
  const overall = Math.round((m1Pct + m2Pct + m3Pct) / 3);

  const u2m1Pct = progress.u2m1Completed ? 100 : Math.round(((progress.u2m1SlotsPlaced || 0) / 4) * 55);
  const u2m2Pct = progress.u2m2Completed ? 100 : Math.min(85, (progress.u2m2NodesVisited || 0) * 30);
  const u2m3Pct = Math.round(((progress.u2m3CompletedLevels || 0) / 3) * 100);
  const overallU2 = Math.round((u2m1Pct + u2m2Pct + u2m3Pct) / 3);

  const u3m1Pct = progress.u3m1Completed ? 100 : Math.round(((progress.u3m1SlotsPlaced || 0) / 4) * 55);
  const u3m2Pct = progress.u3m2Completed ? 100 : Math.min(85, (progress.u3m2NodesVisited || 0) * 30);
  const u3m3Pct = Math.round(((progress.u3m3CompletedLevels || 0) / 3) * 100);
  const overallU3 = Math.round((u3m1Pct + u3m2Pct + u3m3Pct) / 3);

  const u4m1Pct = progress.u4m1Completed ? 100 : Math.round(((progress.u4m1SlotsPlaced || 0) / 3) * 100);
  const u4m2Pct = progress.u4m2Completed ? 100 : Math.min(85, (progress.u4m2NodesVisited || 0) * 30);
  const u4m3Pct = Math.round(((progress.u4m3CompletedLevels || 0) / 3) * 100);
  const overallU4 = Math.round((u4m1Pct + u4m2Pct + u4m3Pct) / 3);

  const badges = [
    { earned: progress.m1Completed, title: 'Lector experto (U1)' },
    { earned: progress.m2Completed, title: 'Detective del método (U1)' },
    { earned: progress.m3Completed, title: 'Resuelve sin pistas (U1)' },
  ];
  const badgeCount = badges.filter(b => b.earned).length;

  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);

  const globalPillClasses = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 cursor-pointer w-full text-left ${
      active
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent border-none'
    }`;

  const subPillClasses = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 cursor-pointer w-full text-left ${
      active
        ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 bg-transparent border-none'
    }`;

  return (
    <aside className="w-72 shrink-0 bg-white border-r border-slate-200/60 flex flex-col p-6 h-full shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] relative z-20 overflow-y-auto">
      <div className="flex flex-col h-full min-h-max">
        <div className="flex items-center gap-3 mb-8 pl-2">
          <img 
            src="/logo.png" 
            alt="Logo LectorMat" 
            className="w-16 h-auto max-h-16 object-contain"
            onError={(e) => {
              // Fallback to the purple square if the image isn't found
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-200 hidden">
            <div className="w-4 h-4 bg-white rounded-sm rotate-12 transform"></div>
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-2xl tracking-tight text-slate-900">LectorMat</div>
          </div>
        </div>

        {progress.career && (
          <div className="mb-6 mx-2 px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-100/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 block leading-none mb-0.5">Carrera</span>
              <span className="text-[11px] font-extrabold text-slate-800 leading-tight block truncate" title={progress.career}>
                {progress.career}
              </span>
            </div>
          </div>
        )}

        <nav className="space-y-6 flex-1 text-sm">
          {/* Main Global Menu */}
          <div className="space-y-2">
            <button onClick={() => setScreen('home')} className={globalPillClasses(currentScreen === 'home')}>
              <Home className="w-5 h-5 shrink-0" />
              <span>Inicio</span>
            </button>
            <button onClick={() => setScreen('pre_m1')} className={globalPillClasses(currentScreen === 'pre_m1')}>
              <BookOpenCheck className="w-5 h-5 shrink-0 text-amber-500" />
              <div className="flex-1 flex items-center justify-between">
                <span>Módulo Comprensión Lectora Aplicada</span>
                {progress.preCompleted ? (
                  <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase">Listo</span>
                ) : (
                  <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-black uppercase animate-pulse">Inicio</span>
                )}
              </div>
            </button>
            <button onClick={() => setScreen('dashboard')} className={globalPillClasses(currentScreen === 'dashboard')}>
              <BarChart2 className="w-5 h-5 shrink-0" />
              <span>Mi Avance</span>
            </button>
            <button onClick={() => setScreen('feedback')} className={globalPillClasses(currentScreen === 'feedback')}>
              <MessageSquare className="w-5 h-5 shrink-0" />
              <span>Tu opinión</span>
            </button>
          </div>

          {/* Unit 1 */}
          <div>
            <button onClick={() => setExpandedUnit(expandedUnit === 1 ? null : 1)} className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer bg-transparent border-none">
              <h2 className="text-xs font-black text-slate-400 p-2 uppercase tracking-widest hover:text-indigo-500 transition-colors">U1: Funciones Polinómicas</h2>
              {expandedUnit === 1 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
            </button>
            <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 1 ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200"></div>
              <button onClick={() => setScreen('m1')} className={subPillClasses(currentScreen === 'm1')}>
                <BookOpenCheck className="w-5 h-5 shrink-0" />
                <span>M1: Comprensión</span>
              </button>
              <button onClick={() => setScreen('m2')} className={subPillClasses(currentScreen === 'm2')}>
                <GitMerge className="w-5 h-5 shrink-0" />
                <span>M2: Método</span>
              </button>
              <button onClick={() => setScreen('m3')} className={subPillClasses(currentScreen === 'm3')}>
                <FileQuestion className="w-5 h-5 shrink-0" />
                <span>M3: Banco</span>
              </button>
            </div>
          </div>

          {/* Unit 2 */}
          <div>
            <button onClick={() => setExpandedUnit(expandedUnit === 2 ? null : 2)} className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer bg-transparent border-none">
              <h2 className="text-xs font-black text-slate-400 p-2 uppercase tracking-widest hover:text-violet-500 transition-colors">U2: Func. Exponenciales</h2>
              {expandedUnit === 2 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
            </button>
            <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 2 ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200"></div>
              <button onClick={() => setScreen('u2m1')} className={subPillClasses(currentScreen === 'u2m1')}>
                <BookOpenCheck className="w-5 h-5 shrink-0 text-violet-500" />
                <span>M1: Comprensión</span>
              </button>
              <button onClick={() => setScreen('u2m2')} className={subPillClasses(currentScreen === 'u2m2')}>
                <GitMerge className="w-5 h-5 shrink-0 text-violet-500" />
                <span>M2: Método</span>
              </button>
              <button onClick={() => setScreen('u2m3')} className={subPillClasses(currentScreen === 'u2m3')}>
                <FileQuestion className="w-5 h-5 shrink-0 text-violet-500" />
                <span>M3: Banco</span>
              </button>
            </div>
          </div>

          {/* Unit 3 */}
          <div>
            <button onClick={() => setExpandedUnit(expandedUnit === 3 ? null : 3)} className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer bg-transparent border-none">
              <h2 className="text-xs font-black text-slate-400 p-2 uppercase tracking-widest hover:text-sky-500 transition-colors">
                {progress.preSpecialty === 'administracion' ? 'U3: Progresiones' : 'U3: Trigonometría'}
              </h2>
              {expandedUnit === 3 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
            </button>
            <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 3 ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200"></div>
              <button onClick={() => setScreen('u3m1')} className={subPillClasses(currentScreen === 'u3m1')}>
                <BookOpenCheck className="w-5 h-5 shrink-0 text-sky-500" />
                <span>M1: Comprensión</span>
              </button>
              <button onClick={() => setScreen('u3m2')} className={subPillClasses(currentScreen === 'u3m2')}>
                <GitMerge className="w-5 h-5 shrink-0 text-sky-500" />
                <span>M2: Método</span>
              </button>
              <button onClick={() => setScreen('u3m3')} className={subPillClasses(currentScreen === 'u3m3')}>
                <FileQuestion className="w-5 h-5 shrink-0 text-sky-500" />
                <span>M3: Banco</span>
              </button>
            </div>
          </div>

          {/* Unit 4 (Only for Administration) */}
          {progress.preSpecialty === 'administracion' && (
            <div>
              <button onClick={() => setExpandedUnit(expandedUnit === 4 ? null : 4)} className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer bg-transparent border-none">
                <h2 className="text-xs font-black text-slate-400 p-2 uppercase tracking-widest hover:text-emerald-500 transition-colors">U4: Finanzas</h2>
                {expandedUnit === 4 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 4 ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200"></div>
                <button onClick={() => setScreen('u4m1')} className={subPillClasses(currentScreen === 'u4m1')}>
                  <BookOpenCheck className="w-5 h-5 shrink-0 text-emerald-500" />
                  <span>M1: Comprensión</span>
                </button>
                <button onClick={() => setScreen('u4m2')} className={subPillClasses(currentScreen === 'u4m2')}>
                  <GitMerge className="w-5 h-5 shrink-0 text-emerald-500" />
                  <span>M2: Método</span>
                </button>
                <button onClick={() => setScreen('u4m3')} className={subPillClasses(currentScreen === 'u4m3')}>
                  <FileQuestion className="w-5 h-5 shrink-0 text-emerald-500" />
                  <span>M3: Banco</span>
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100/80 my-4"></div>

          <button onClick={() => setScreen('m4')} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group w-full cursor-pointer bg-transparent border-none text-left ${currentScreen === 'm4' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
            <span className={`shrink-0 flex items-center justify-center transition-transform duration-300 ${currentScreen === 'm4' ? 'scale-110 text-indigo-400' : 'group-hover:scale-110'}`}><LayoutDashboard className="w-5 h-5" /></span>
            <span className="flex-1 text-left">Panel docente</span>
          </button>
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          {/* U1 Progress Card */}
          <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 rounded-3xl p-5 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <p className="text-[10px] text-indigo-300 font-bold mb-1 relative z-10 tracking-wider uppercase">Progreso U1</p>
            <p className="text-sm font-extrabold mb-3 relative z-10 text-slate-100">{overall}% Completado</p>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10 border border-slate-700/50">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${overall}%` }}></div>
            </div>
          </div>
          
          {/* U2 Progress Card */}
          <div className="bg-gradient-to-b from-violet-900 to-violet-950 rounded-3xl p-5 text-white shadow-xl shadow-violet-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <p className="text-[10px] text-violet-300 font-bold mb-1 relative z-10 tracking-wider uppercase">Progreso U2</p>
            <p className="text-sm font-extrabold mb-3 relative z-10 text-slate-100">{overallU2}% Completado</p>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10 border border-slate-700/50">
              <div className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-1000" style={{ width: `${overallU2}%` }}></div>
            </div>
          </div>
          {/* U3 Progress Card */}
          <div className="bg-gradient-to-b from-sky-800 to-sky-950 rounded-3xl p-5 text-white shadow-xl shadow-sky-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <p className="text-[10px] text-sky-300 font-bold mb-1 relative z-10 tracking-wider uppercase">
              {progress.preSpecialty === 'administracion' ? 'Progreso U3 (Progresiones)' : 'Progreso U3 (Trigonom.)'}
            </p>
            <p className="text-sm font-extrabold mb-3 relative z-10 text-slate-100">{overallU3}% Completado</p>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10 border border-slate-700/50">
              <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-1000" style={{ width: `${overallU3}%` }}></div>
            </div>
          </div>

          {/* U4 Progress Card */}
          {progress.preSpecialty === 'administracion' && (
            <div className="bg-gradient-to-b from-emerald-800 to-emerald-950 rounded-3xl p-5 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
              <p className="text-[10px] text-emerald-300 font-bold mb-1 relative z-10 tracking-wider uppercase">Progreso U4 (Finanzas)</p>
              <p className="text-sm font-extrabold mb-3 relative z-10 text-slate-100">{overallU4}% Completado</p>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10 border border-slate-700/50">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${overallU4}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

