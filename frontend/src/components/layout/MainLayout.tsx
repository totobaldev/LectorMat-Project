import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, ArrowRight, Plus } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { BrandMark } from '../brand/BrandMark';
import { LectorMatIcon } from '../brand/LectorMatIcon';
import { StatusBadge } from '../ui/StatusBadge';

const MainLayout: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const store     = useProgressStore();
  const logout    = store.logout;
  const p         = store;

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth >= 768
  ));

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

  const globalCls = (active: boolean) => {
    const activeColor = p.role === 'teacher'
      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
      : 'bg-blue-600 text-white shadow-md shadow-blue-600/20';
    
    return `flex items-center rounded-2xl font-bold transition-all duration-200 cursor-pointer w-full text-left border-none ${
      isSidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center w-12 h-12 p-0 mx-auto'
    } ${
      active
        ? activeColor
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent'
    }`;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-slate-900" style={{ background: '#EEF1F6' }}>

      {/* ── Sidebar: Collapsible but stays visible as mini icon navbar (w-20) ─── */}
      <aside className={`shrink-0 bg-white border-r border-slate-200/60 flex flex-col h-full shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] relative z-20 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'w-72 p-6' : 'w-20 px-3 py-6'}`}>
        <div className="flex flex-col h-full min-h-max">

          {/* Brand Logo */}
          <div className={`flex items-center mb-6 pl-2 ${isSidebarOpen ? 'gap-3' : 'justify-center pl-0'}`}>
            <BrandMark compact={!isSidebarOpen} markClassName="h-11 w-11" />
          </div>

          {/* Career badge */}
          {(p.isAuthenticated || p.isTeacherUnlocked) && p.career && (
            <div className={`mb-6 mx-1 px-3.5 py-2 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center ${isSidebarOpen ? 'gap-2.5' : 'justify-center'}`} title={p.career}>
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
                <LectorMatIcon name="career" size={17} />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 block leading-none mb-0.5">Carrera</span>
                  <span className="text-[11px] font-extrabold text-slate-800 leading-tight block truncate">{p.career}</span>
                </div>
              )}
            </div>
          )}

          <nav className="space-y-1.5 flex-1 text-sm">
            {/* ── Shared: Inicio ─────────────────────── */}
            <button onClick={() => navigate('/')} className={globalCls(cur === '/')} aria-label="Inicio" title={!isSidebarOpen ? 'Inicio' : undefined}>
              <LectorMatIcon name="home" size={20} className="shrink-0" />
              {isSidebarOpen && <span>Inicio</span>}
            </button>

            {/* ── TEACHER: Panel docente right below Inicio ─────────────── */}
            {p.role === 'teacher' && (
              <button
                onClick={() => navigate('/teacher/courses')}
                className={globalCls(cur.startsWith('/teacher/courses'))}
                aria-label="Panel Docente"
                title={!isSidebarOpen ? 'Panel Docente' : undefined}
              >
                <LectorMatIcon name="teacher" size={20} className="shrink-0" />
                {isSidebarOpen && <span>Panel Docente</span>}
              </button>
            )}

            {/* ── STUDENT nav (role === 'student') ─────────────────────────── */}
            {p.role === 'student' && p.isAuthenticated && (
              <>
                <button onClick={() => navigate('/pre')} className={globalCls(cur === '/pre')} aria-label="Comprensión Lectora" title={!isSidebarOpen ? 'Comprensión Lectora' : undefined}>
                  <LectorMatIcon name="reading" size={20} className="shrink-0" />
                  {isSidebarOpen ? (
                    <div className="flex-1 flex items-center justify-between">
                      <span>Comprensión Lectora</span>
                      {p.preCompleted
                        ? <StatusBadge tone="emerald" className="px-2 py-0.5 text-[8px]">Listo</StatusBadge>
                        : <StatusBadge tone="orange" className="px-2 py-0.5 text-[8px]">Inicio</StatusBadge>
                      }
                    </div>
                  ) : null}
                </button>
                <button onClick={() => navigate('/courses')} className={globalCls(cur === '/courses')} aria-label="Mis Cursos" title={!isSidebarOpen ? 'Mis Cursos' : undefined}>
                  <LectorMatIcon name="courses" size={20} className="shrink-0" />
                  {isSidebarOpen && <span>Mis Cursos</span>}
                </button>
                <button onClick={() => navigate('/dashboard')} className={globalCls(cur === '/dashboard')} aria-label="Mi Avance" title={!isSidebarOpen ? 'Mi Avance' : undefined}>
                  <LectorMatIcon name="progress" size={20} className="shrink-0" />
                  {isSidebarOpen && <span>Mi Avance</span>}
                </button>
                <button onClick={() => navigate('/feedback')} className={globalCls(cur === '/feedback')} aria-label="Tu opinión" title={!isSidebarOpen ? 'Tu opinión' : undefined}>
                  <LectorMatIcon name="feedback" size={20} className="shrink-0" />
                  {isSidebarOpen && <span>Tu opinión</span>}
                </button>
              </>
            )}

            {/* ── TEACHER extended nav ─────────────────────────────────────── */}
            {p.role === 'teacher' && (
              <>
                <div className="border-t border-slate-100/80 my-3" />
                {isSidebarOpen ? (
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 pb-1">Docente</p>
                ) : (
                  <div className="h-0.5" />
                )}

                {/* Quick + Nuevo Curso action */}
                <button
                  id="sidebar-btn-nuevo-curso"
                  onClick={() => navigate('/teacher/courses', { state: { openModal: true } })}
                  className={`flex items-center rounded-2xl font-extrabold text-sm w-full cursor-pointer border-2 border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-300 transition-all duration-200 ${isSidebarOpen ? 'gap-3 px-4 py-3 text-left' : 'justify-center w-12 h-12 p-0 mx-auto'}`}
                  title="Nuevo Curso"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span>Nuevo Curso</span>}
                </button>

                <button
                  onClick={() => navigate('/teacher/content-bank')}
                  className={globalCls(cur === '/teacher/content-bank')}
                  aria-label="Banco de Contenido"
                  title={!isSidebarOpen ? 'Banco de Contenido' : undefined}
                >
                  <LectorMatIcon name="library" size={20} className="shrink-0" />
                  {isSidebarOpen && <span>Banco de Contenido</span>}
                </button>
              </>
            )}
          </nav>

          {/* ── STUDENT PROGRESS CARD ─────────────── */}
          {p.role === 'student' && p.isAuthenticated && isSidebarOpen && (
            <div className="mt-8 flex flex-col gap-3">
              <div className="pl-3 text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <LectorMatIcon name="progress" size={16} className="text-blue-500" />
                Actividad Reciente
              </div>
              <div
                className="rounded-3xl p-5 text-white shadow-[0_16px_34px_-18px_rgba(30,64,175,0.9)] relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 bg-blue-950"
                onClick={() => navigate(activeMaterial.path)}
              >
                <div
                  className="absolute -top-7 -right-6 w-24 h-24 rounded-[2rem] rotate-12 bg-blue-500/25"
                />
                <h4 className="text-sm font-extrabold text-white leading-tight mb-0.5 relative z-10">
                  {activeMaterial.title}
                </h4>
                <p className="text-xs text-slate-300 font-medium mb-3 relative z-10 truncate">
                  {activeMaterial.subtitle}
                </p>

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-200 mb-1.5 relative z-10">
                  <span>Avance del módulo</span>
                  <span className="text-blue-300">{activeMaterial.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden relative z-10 border border-slate-700/50 mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${activeMaterial.pct}%`, background: '#60A5FA' }}
                  />
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold text-blue-950 transition-all bg-white hover:bg-blue-50 shadow-sm cursor-pointer border-none"
                >
                  Continuar
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Logout button */}
          {(p.isAuthenticated || p.isTeacherUnlocked) && (
            <button onClick={logout} aria-label="Salir" title={!isSidebarOpen ? 'Salir' : undefined} className={`sidebar-logout mt-4 flex items-center ${isSidebarOpen ? 'gap-3 px-4 py-3 text-left w-full' : 'justify-center w-12 h-12 p-0 mx-auto rounded-2xl hover:bg-red-50 hover:text-red-600 text-slate-500 bg-transparent border-none'}`}>
              <LogOut size={16} className="shrink-0" />
              {isSidebarOpen && <span>Salir</span>}
            </button>
          )}

        </div>
      </aside>

      {/* ── Main Panel Container ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6 gap-4 z-10 shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer border border-slate-200/60 shadow-sm bg-transparent"
            title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-extrabold text-slate-800 tracking-wide">Lector<span className="text-orange-500">Mat</span></span>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50">
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
