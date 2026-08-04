import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, Home, BookOpenCheck,
  GitMerge, FileQuestion, MessageSquare, BarChart2,
  ChevronDown, ChevronRight, GraduationCap, LogOut,
  PlayCircle, Clock, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import logo from '../../assets/logo.jpeg';

const MainLayout: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const store     = useProgressStore();
  const logout    = store.logout;
  const p         = store;

  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);

  // ── Progress calculations ──────────────────────────────────────────────────
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

  // ── Compute continuity target for student ─────────────────────────────────
  const getStudentContinuity = () => {
    if (!p.preCompleted) {
      return {
        title: 'Módulo Comprensión Lectora',
        subtitle: 'Nivelación Inicial de Lectura',
        path: '/pre',
        pct: p.preScore ? Math.round((p.preScore / 10) * 100) : 15,
        unitName: 'Lectura Crítica',
        unitPct: p.preScore ? Math.round((p.preScore / 10) * 100) : 15,
      };
    }
    if (!p.m1Completed) {
      return {
        title: 'U1 M1: Comprensión',
        subtitle: 'Funciones Polinómicas',
        path: '/unit/1/module/1',
        pct: Math.round((p.m1SlotsPlaced / 3) * 100) || 20,
        unitName: 'Unidad 1',
        unitPct: overallU1,
      };
    }
    if (!p.m2Completed) {
      return {
        title: 'U1 M2: Método',
        subtitle: 'Árbol de Decisión Polinómico',
        path: '/unit/1/module/2',
        pct: Math.min(85, p.m2NodesVisited * 30) || 35,
        unitName: 'Unidad 1',
        unitPct: overallU1,
      };
    }
    if (!p.m3Completed) {
      return {
        title: 'U1 M3: Banco de Problemas',
        subtitle: 'Ejercicios Polinómicos',
        path: '/unit/1/module/3',
        pct: Math.round((p.m3CompletedLevels / 3) * 100) || 15,
        unitName: 'Unidad 1',
        unitPct: overallU1,
      };
    }
    if (!p.u2m1Completed || !p.u2m2Completed || !p.u2m3Completed) {
      return {
        title: 'U2: Func. Exponenciales',
        subtitle: !p.u2m1Completed ? 'M1: Comprensión' : !p.u2m2Completed ? 'M2: Método' : 'M3: Banco',
        path: !p.u2m1Completed ? '/unit/2/module/1' : !p.u2m2Completed ? '/unit/2/module/2' : '/unit/2/module/3',
        pct: overallU2 || 20,
        unitName: 'Unidad 2',
        unitPct: overallU2,
      };
    }
    if (!p.u3m1Completed || !p.u3m2Completed || !p.u3m3Completed) {
      return {
        title: p.preSpecialty === 'administracion' ? 'U3: Progresiones' : 'U3: Trigonometría',
        subtitle: !p.u3m1Completed ? 'M1: Comprensión' : !p.u3m2Completed ? 'M2: Método' : 'M3: Banco',
        path: !p.u3m1Completed ? '/unit/3/module/1' : !p.u3m2Completed ? '/unit/3/module/2' : '/unit/3/module/3',
        pct: overallU3 || 15,
        unitName: 'Unidad 3',
        unitPct: overallU3,
      };
    }
    if (p.preSpecialty === 'administracion' && (!p.u4m1Completed || !p.u4m2Completed || !p.u4m3Completed)) {
      return {
        title: 'U4: Finanzas',
        subtitle: !p.u4m1Completed ? 'M1: Comprensión' : !p.u4m2Completed ? 'M2: Método' : 'M3: Banco',
        path: !p.u4m1Completed ? '/unit/4/module/1' : !p.u4m2Completed ? '/unit/4/module/2' : '/unit/4/module/3',
        pct: overallU4 || 15,
        unitName: 'Unidad 4',
        unitPct: overallU4,
      };
    }
    return {
      title: '¡Nivelación Completada!',
      subtitle: 'Has dominado todos los módulos',
      path: '/dashboard',
      pct: 100,
      unitName: 'Finalizado',
      unitPct: 100,
    };
  };

  const activeMaterial = getStudentContinuity();

  const globalCls = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 cursor-pointer w-full text-left border-none ${
      active
        ? 'bg-[#00B4C8] text-white shadow-md shadow-[#00B4C8]/20'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent'
    }`;

  const subCls = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 cursor-pointer w-full text-left border-none ${
      active
        ? 'bg-[#E0F7FA] text-[#0098AA] shadow-sm shadow-[#E0F7FA]/50'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 bg-transparent'
    }`;

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-slate-900" style={{ background: '#EEF1F6' }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-72 shrink-0 bg-white border-r border-slate-200/60 flex flex-col p-6 h-full shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] relative z-20 overflow-y-auto">
        <div className="flex flex-col h-full min-h-max">

          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-6 pl-2">
            <img
              src={logo}
              alt="LectorMat"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fb = e.currentTarget.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#00B4C8] to-[#0098AA] items-center justify-center shadow-md shadow-[#00B4C8]/30 hidden">
              <div className="w-4 h-4 bg-white rounded-sm rotate-12" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-2xl tracking-tight text-slate-900">LectorMat</div>
            </div>
          </div>

          {/* Career badge */}
          {(p.isAuthenticated || p.isTeacherUnlocked) && p.career && (
            <div className="mb-6 mx-1 px-3.5 py-2 rounded-2xl bg-[#E0F7FA] border border-[#00B4C8]/20 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00B4C8] text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#0098AA] block leading-none mb-0.5">Carrera</span>
                <span className="text-[11px] font-extrabold text-slate-800 leading-tight block truncate" title={p.career}>{p.career}</span>
              </div>
            </div>
          )}

          <nav className="space-y-5 flex-1 text-sm">
            {/* Global navigation */}
            <div className="space-y-1.5">
              <button onClick={() => navigate('/')} className={globalCls(cur === '/')}>
                <Home className="w-5 h-5 shrink-0" /><span>Inicio</span>
              </button>

              {(p.isAuthenticated || p.isTeacherUnlocked) && (
                <>
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
                </>
              )}

              <button onClick={() => navigate('/feedback')} className={globalCls(cur === '/feedback')}>
                <MessageSquare className="w-5 h-5 shrink-0" /><span>Tu opinión</span>
              </button>
            </div>

            {/* Units list */}
            <div>
              <button onClick={() => setExpandedUnit(expandedUnit === 1 ? null : 1)} className="w-full flex items-center justify-between px-2 mb-1.5 cursor-pointer bg-transparent border-none">
                <h2 className="text-xs font-black text-slate-400 p-1.5 uppercase tracking-widest hover:text-[#00B4C8] transition-colors">U1: Funciones Polinómicas</h2>
                {expandedUnit === 1 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 1 ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200" />
                <button onClick={() => navigate('/unit/1/module/1')} className={subCls(cur === '/unit/1/module/1')}><BookOpenCheck className="w-5 h-5 shrink-0" /><span>M1: Comprensión</span></button>
                <button onClick={() => navigate('/unit/1/module/2')} className={subCls(cur === '/unit/1/module/2')}><GitMerge className="w-5 h-5 shrink-0" /><span>M2: Método</span></button>
                <button onClick={() => navigate('/unit/1/module/3')} className={subCls(cur === '/unit/1/module/3')}><FileQuestion className="w-5 h-5 shrink-0" /><span>M3: Banco</span></button>
              </div>
            </div>

            {/* U2 */}
            <div>
              <button onClick={() => setExpandedUnit(expandedUnit === 2 ? null : 2)} className="w-full flex items-center justify-between px-2 mb-1.5 cursor-pointer bg-transparent border-none">
                <h2 className="text-xs font-black text-slate-400 p-1.5 uppercase tracking-widest hover:text-violet-500 transition-colors">U2: Func. Exponenciales</h2>
                {expandedUnit === 2 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 2 ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200" />
                <button onClick={() => navigate('/unit/2/module/1')} className={subCls(cur === '/unit/2/module/1')}><BookOpenCheck className="w-5 h-5 shrink-0 text-violet-500" /><span>M1: Comprensión</span></button>
                <button onClick={() => navigate('/unit/2/module/2')} className={subCls(cur === '/unit/2/module/2')}><GitMerge className="w-5 h-5 shrink-0 text-violet-500" /><span>M2: Método</span></button>
                <button onClick={() => navigate('/unit/2/module/3')} className={subCls(cur === '/unit/2/module/3')}><FileQuestion className="w-5 h-5 shrink-0 text-violet-500" /><span>M3: Banco</span></button>
              </div>
            </div>

            {/* U3 */}
            <div>
              <button onClick={() => setExpandedUnit(expandedUnit === 3 ? null : 3)} className="w-full flex items-center justify-between px-2 mb-1.5 cursor-pointer bg-transparent border-none">
                <h2 className="text-xs font-black text-slate-400 p-1.5 uppercase tracking-widest hover:text-sky-500 transition-colors">
                  {p.preSpecialty === 'administracion' ? 'U3: Progresiones' : 'U3: Trigonometría'}
                </h2>
                {expandedUnit === 3 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 3 ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'}`}>
                <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200" />
                <button onClick={() => navigate('/unit/3/module/1')} className={subCls(cur === '/unit/3/module/1')}><BookOpenCheck className="w-5 h-5 shrink-0 text-sky-500" /><span>M1: Comprensión</span></button>
                <button onClick={() => navigate('/unit/3/module/2')} className={subCls(cur === '/unit/3/module/2')}><GitMerge className="w-5 h-5 shrink-0 text-sky-500" /><span>M2: Método</span></button>
                <button onClick={() => navigate('/unit/3/module/3')} className={subCls(cur === '/unit/3/module/3')}><FileQuestion className="w-5 h-5 shrink-0 text-sky-500" /><span>M3: Banco</span></button>
              </div>
            </div>

            {/* U4 */}
            {p.preSpecialty === 'administracion' && (
              <div>
                <button onClick={() => setExpandedUnit(expandedUnit === 4 ? null : 4)} className="w-full flex items-center justify-between px-2 mb-1.5 cursor-pointer bg-transparent border-none">
                  <h2 className="text-xs font-black text-slate-400 p-1.5 uppercase tracking-widest hover:text-emerald-500 transition-colors">U4: Finanzas</h2>
                  {expandedUnit === 4 ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>
                <div className={`space-y-1.5 relative overflow-hidden transition-all duration-300 ${expandedUnit === 4 ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'}`}>
                  <div className="absolute left-[24px] top-2 bottom-2 w-px bg-slate-200" />
                  <button onClick={() => navigate('/unit/4/module/1')} className={subCls(cur === '/unit/4/module/1')}><BookOpenCheck className="w-5 h-5 shrink-0 text-emerald-500" /><span>M1: Comprensión</span></button>
                  <button onClick={() => navigate('/unit/4/module/2')} className={subCls(cur === '/unit/4/module/2')}><GitMerge className="w-5 h-5 shrink-0 text-emerald-500" /><span>M2: Método</span></button>
                  <button onClick={() => navigate('/unit/4/module/3')} className={subCls(cur === '/unit/4/module/3')}><FileQuestion className="w-5 h-5 shrink-0 text-emerald-500" /><span>M3: Banco</span></button>
                </div>
              </div>
            )}

            {/* Teacher panel (only for teacher role) */}
            {p.role === 'teacher' && (
              <>
                <div className="border-t border-slate-100 my-3" />
                <button
                  onClick={() => navigate('/unit/1/module/4')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 group w-full cursor-pointer bg-transparent border-none text-left ${
                    cur === '/unit/1/module/4'
                      ? 'bg-[#1B2A5A] text-white shadow-lg shadow-[#1B2A5A]/20'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span>Panel docente</span>
                </button>
              </>
            )}
          </nav>

          {/* ── STUDENT PROGRESS CARD ─────────────── */}
          {(p.isAuthenticated || p.isTeacherUnlocked) && (
            <div className="mt-8 flex flex-col gap-3">

              <div className="pl-3 text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Actividad Reciente
              </div>
              {/* Single ProgressCard: CONTINUIDAD AL MATERIAL EN DESARROLLO */}
              <div
                className="rounded-3xl p-5 text-white shadow-xl relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(to bottom, #004D5A, #002B33)' }}
                onClick={() => navigate(activeMaterial.path)}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-25 transform translate-x-1/2 -translate-y-1/2"
                  style={{ background: '#00B4C8' }}
                />
                <h4 className="text-sm font-extrabold text-white leading-tight mb-0.5 relative z-10">
                  {activeMaterial.title}
                </h4>
                <p className="text-xs text-slate-300 font-medium mb-3 relative z-10 truncate">
                  {activeMaterial.subtitle}
                </p>

                {/* Active module progress bar */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-200 mb-1.5 relative z-10">
                  <span>Avance del módulo</span>
                  <span className="text-[#67E8F9]">{activeMaterial.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden relative z-10 border border-slate-700/50 mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${activeMaterial.pct}%`, background: 'linear-gradient(to right, #00B4C8, #00D4EA)' }}
                  />
                </div>

                {/* Interactive CTA button */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold text-white transition-all bg-[#00B4C8] hover:bg-[#0098AA] shadow-sm cursor-pointer border-none"
                >
                  Continuar
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Logout button */}
          {(p.isAuthenticated || p.isTeacherUnlocked) && (
            <button onClick={logout} className="sidebar-logout mt-4">
              <LogOut size={14} />
              Salir
            </button>
          )}

        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E0F7FA]/40 via-slate-50/40 to-slate-100/40">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
