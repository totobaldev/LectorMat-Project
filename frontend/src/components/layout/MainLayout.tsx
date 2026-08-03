import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, Home, BookOpenCheck,
  GitMerge, FileQuestion, MessageSquare, BarChart2,
  ChevronDown, ChevronRight, GraduationCap, LogOut,
} from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useProgressStore();
  const logout = store.logout;
  const p = store;                 // shorthand for progress fields

  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);

  // ── Progress calculations (same as FRONT Sidebar) ──────────────────────────
  const m1Pct = p.m1Completed ? 100 : Math.round((p.m1SlotsPlaced / 3) * 55);
  const m2Pct = p.m2Completed ? 100 : Math.min(85, p.m2NodesVisited * 30);
  const m3Pct = Math.round((p.m3CompletedLevels / 3) * 100);
  const overallU1 = Math.round((m1Pct + m2Pct + m3Pct) / 3);

  const u2m1Pct = p.u2m1Completed ? 100 : Math.round((p.u2m1SlotsPlaced / 4) * 55);
  const u2m2Pct = p.u2m2Completed ? 100 : Math.min(85, p.u2m2NodesVisited * 30);
  const u2m3Pct = Math.round((p.u2m3CompletedLevels / 3) * 100);
  const overallU2 = Math.round((u2m1Pct + u2m2Pct + u2m3Pct) / 3);

  const u3m1Pct = p.u3m1Completed ? 100 : Math.round((p.u3m1SlotsPlaced / 4) * 55);
  const u3m2Pct = p.u3m2Completed ? 100 : Math.min(85, p.u3m2NodesVisited * 30);
  const u3m3Pct = Math.round((p.u3m3CompletedLevels / 3) * 100);
  const overallU3 = Math.round((u3m1Pct + u3m2Pct + u3m3Pct) / 3);

  const u4m1Pct = p.u4m1Completed ? 100 : Math.round((p.u4m1SlotsPlaced / 3) * 100);
  const u4m2Pct = p.u4m2Completed ? 100 : Math.min(85, p.u4m2NodesVisited * 30);
  const u4m3Pct = Math.round((p.u4m3CompletedLevels / 3) * 100);
  const overallU4 = Math.round((u4m1Pct + u4m2Pct + u4m3Pct) / 3);

  const cur = location.pathname;

  const globalCls = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 cursor-pointer w-full text-left border-none ${active
      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent'
    }`;

  const subCls = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 cursor-pointer w-full text-left border-none ${active
      ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50'
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 bg-transparent'
    }`;

  return (
    <div className="layout-root">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-72 shrink-0 bg-white border-r border-slate-200/60 flex flex-col p-6 h-full shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] relative z-20 overflow-y-auto">
        <div className="flex flex-col h-full min-h-max">

          {/* Brand */}
          <div className="flex items-center gap-3 mb-8 pl-2">
            <img
              src="/logo.png"
              alt="LectorMat"
              className="w-16 h-auto max-h-16 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fb = e.currentTarget.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 items-center justify-center shadow-md shadow-indigo-200 hidden">
              <div className="w-4 h-4 bg-white rounded-sm rotate-12" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-2xl tracking-tight text-slate-900">LectorMat</div>
            </div>
          </div>

          {/* Career badge */}
          {p.career && (
            <div className="mb-6 mx-2 px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-100/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 block leading-none mb-0.5">Carrera</span>
                <span className="text-[11px] font-extrabold text-slate-800 leading-tight block truncate" title={p.career}>{p.career}</span>
              </div>
            </div>
          )}

          <nav className="space-y-6 flex-1 text-sm">
            {/* Global */}
            <div className="space-y-2">
              <button onClick={() => navigate('/')} className={globalCls(cur === '/')}>
                <Home className="w-5 h-5 shrink-0" /><span>Inicio</span>
              </button>
              <button onClick={() => navigate('/pre')} className={globalCls(cur === '/pre')}>
                <BookOpenCheck className="w-5 h-5 shrink-0 text-amber-500" />
                <div className="flex-1 flex items-center justify-between">
                  <span>Comprensión Lectora</span>
                  {p.preCompleted
                    ? <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase">Listo</span>
                    : <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-black uppercase animate-pulse">Inicio</span>
                  }
                </div>
              </button>
              <button onClick={() => navigate('/dashboard')} className={globalCls(cur === '/dashboard')}>
                <BarChart2 className="w-5 h-5 shrink-0" /><span>Mi Avance</span>
              </button>
              <button onClick={() => navigate('/feedback')} className={globalCls(cur === '/feedback')}>
                <MessageSquare className="w-5 h-5 shrink-0" /><span>Tu opinión</span>
              </button>
            </div>

            {/* U1 */}
            <div>
              <button onClick={() => setExpandedUnit(expandedUnit === 1 ? null : 1)} className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer bg-transparent border-none">
                <h2 className="text-xs font-black text-slate-400 p-2 uppercase tracking-widest hover:text-indigo-500 transition-colors">U1: Funciones Polinómicas</h2>
                {expandedUnit === 1 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 1 ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200" />
                <button onClick={() => navigate('/unit/1/module/1')} className={subCls(cur === '/unit/1/module/1')}><BookOpenCheck className="w-5 h-5 shrink-0" /><span>M1: Comprensión</span></button>
                <button onClick={() => navigate('/unit/1/module/2')} className={subCls(cur === '/unit/1/module/2')}><GitMerge className="w-5 h-5 shrink-0" /><span>M2: Método</span></button>
                <button onClick={() => navigate('/unit/1/module/3')} className={subCls(cur === '/unit/1/module/3')}><FileQuestion className="w-5 h-5 shrink-0" /><span>M3: Banco</span></button>
              </div>
            </div>

            {/* U2 */}
            <div>
              <button onClick={() => setExpandedUnit(expandedUnit === 2 ? null : 2)} className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer bg-transparent border-none">
                <h2 className="text-xs font-black text-slate-400 p-2 uppercase tracking-widest hover:text-violet-500 transition-colors">U2: Func. Exponenciales</h2>
                {expandedUnit === 2 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 2 ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200" />
                <button onClick={() => navigate('/unit/2/module/1')} className={subCls(cur === '/unit/2/module/1')}><BookOpenCheck className="w-5 h-5 shrink-0 text-violet-500" /><span>M1: Comprensión</span></button>
                <button onClick={() => navigate('/unit/2/module/2')} className={subCls(cur === '/unit/2/module/2')}><GitMerge className="w-5 h-5 shrink-0 text-violet-500" /><span>M2: Método</span></button>
                <button onClick={() => navigate('/unit/2/module/3')} className={subCls(cur === '/unit/2/module/3')}><FileQuestion className="w-5 h-5 shrink-0 text-violet-500" /><span>M3: Banco</span></button>
              </div>
            </div>

            {/* U3 */}
            <div>
              <button onClick={() => setExpandedUnit(expandedUnit === 3 ? null : 3)} className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer bg-transparent border-none">
                <h2 className="text-xs font-black text-slate-400 p-2 uppercase tracking-widest hover:text-sky-500 transition-colors">
                  {p.preSpecialty === 'administracion' ? 'U3: Progresiones' : 'U3: Trigonometría'}
                </h2>
                {expandedUnit === 3 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 3 ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200" />
                <button onClick={() => navigate('/unit/3/module/1')} className={subCls(cur === '/unit/3/module/1')}><BookOpenCheck className="w-5 h-5 shrink-0 text-sky-500" /><span>M1: Comprensión</span></button>
                <button onClick={() => navigate('/unit/3/module/2')} className={subCls(cur === '/unit/3/module/2')}><GitMerge className="w-5 h-5 shrink-0 text-sky-500" /><span>M2: Método</span></button>
                <button onClick={() => navigate('/unit/3/module/3')} className={subCls(cur === '/unit/3/module/3')}><FileQuestion className="w-5 h-5 shrink-0 text-sky-500" /><span>M3: Banco</span></button>
              </div>
            </div>

            {/* U4 — only for administracion */}
            {p.preSpecialty === 'administracion' && (
              <div>
                <button onClick={() => setExpandedUnit(expandedUnit === 4 ? null : 4)} className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer bg-transparent border-none">
                  <h2 className="text-xs font-black text-slate-400 p-2 uppercase tracking-widest hover:text-emerald-500 transition-colors">U4: Finanzas</h2>
                  {expandedUnit === 4 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>
                <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 4 ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                  <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200" />
                  <button onClick={() => navigate('/unit/4/module/1')} className={subCls(cur === '/unit/4/module/1')}><BookOpenCheck className="w-5 h-5 shrink-0 text-emerald-500" /><span>M1: Comprensión</span></button>
                  <button onClick={() => navigate('/unit/4/module/2')} className={subCls(cur === '/unit/4/module/2')}><GitMerge className="w-5 h-5 shrink-0 text-emerald-500" /><span>M2: Método</span></button>
                  <button onClick={() => navigate('/unit/4/module/3')} className={subCls(cur === '/unit/4/module/3')}><FileQuestion className="w-5 h-5 shrink-0 text-emerald-500" /><span>M3: Banco</span></button>
                </div>
              </div>
            )}

            {/* Only show for teacher role */}
            {p.role === 'teacher' && (
              <>
                <div className="border-t border-slate-100/80 my-4" />
                <button onClick={() => navigate('/unit/1/module/4')} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group w-full cursor-pointer bg-transparent border-none text-left ${cur === '/unit/1/module/4' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span>Panel docente</span>
                </button>
              </>
            )}
          </nav>

          {/* Progress cards */}
          <div className="mt-8 flex flex-col gap-3">
            <ProgressCard label="Progreso U1" pct={overallU1} from="from-indigo-900" to="to-indigo-950" glow="bg-indigo-500" bar="from-indigo-500 to-indigo-400" text="text-indigo-300" shadow="shadow-indigo-900/20" />
            <ProgressCard label="Progreso U2" pct={overallU2} from="from-violet-900" to="to-violet-950" glow="bg-violet-500" bar="from-violet-500 to-violet-400" text="text-violet-300" shadow="shadow-violet-900/20" />
            <ProgressCard label={p.preSpecialty === 'administracion' ? 'Progreso U3 (Prog.)' : 'Progreso U3 (Trig.)'} pct={overallU3} from="from-sky-800" to="to-sky-950" glow="bg-sky-500" bar="from-sky-500 to-sky-400" text="text-sky-300" shadow="shadow-sky-900/20" />
            {p.preSpecialty === 'administracion' && (
              <ProgressCard label="Progreso U4 (Fin.)" pct={overallU4} from="from-emerald-800" to="to-emerald-950" glow="bg-emerald-500" bar="from-emerald-500 to-emerald-400" text="text-emerald-300" shadow="shadow-emerald-900/20" />
            )}
          </div>

          {/* Logout */}
          <button onClick={logout} className="sidebar-logout mt-4">
            <LogOut size={14} />
            Salir
          </button>

        </div>
      </aside>

      {/* ── Main content area with generous whitespace ───────────────── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50 p-8 sm:p-12 md:p-14">
        <div className="max-w-7xl mx-auto w-full pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// ── Mini progress card ───────────────────────────────────────────────────────

const ProgressCard: React.FC<{
  label: string; pct: number; from: string; to: string;
  glow: string; bar: string; text: string; shadow: string;
}> = ({ label, pct, from, to, glow, bar, text, shadow }) => (
  <div className={`bg-gradient-to-b ${from} ${to} rounded-3xl p-5 text-white shadow-xl ${shadow} relative overflow-hidden`}>
    <div className={`absolute top-0 right-0 w-32 h-32 ${glow} rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2`} />
    <p className={`text-[10px] ${text} font-bold mb-1 relative z-10 tracking-wider uppercase`}>{label}</p>
    <p className="text-sm font-extrabold mb-3 relative z-10 text-slate-100">{pct}% Completado</p>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10 border border-slate-700/50">
      <div className={`h-full bg-gradient-to-r ${bar} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

export default MainLayout;
