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
  const p = store;

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

  // ── INACAP palette nav classes (same structure as FRONT Sidebar.tsx) ──────
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
    // ── Root: exact same structure as FRONT App.tsx ────────────────────────
    <div className="flex h-screen w-full overflow-hidden font-sans text-slate-900" style={{ background: '#EEF1F6' }}>

      {/* ── Sidebar: exact same as FRONT Sidebar.tsx with INACAP colors ─── */}
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
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#00B4C8] to-[#0098AA] items-center justify-center shadow-md shadow-[#00B4C8]/30 hidden">
              <div className="w-4 h-4 bg-white rounded-sm rotate-12" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-2xl tracking-tight text-slate-900">LectorMat</div>
            </div>
          </div>

          {/* Career badge (only when logged in) */}
          {(p.isAuthenticated || p.isTeacherUnlocked) && p.career && (
            <div className="mb-6 mx-2 px-3.5 py-2 rounded-2xl bg-[#E0F7FA] border border-[#00B4C8]/20 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00B4C8] text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#0098AA] block leading-none mb-0.5">Carrera</span>
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

              {(p.isAuthenticated || p.isTeacherUnlocked) && (
                <>
                  <button onClick={() => navigate('/pre')} className={globalCls(cur === '/pre')}>
                    <BookOpenCheck className="w-5 h-5 shrink-0 text-amber-500" />
                    <div className="flex-1 flex items-center justify-between">
                      <span>Módulo Comprensión Lectora Aplicada</span>
                      {p.preCompleted
                        ? <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase">Listo</span>
                        : <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-black uppercase animate-pulse">Inicio</span>
                      }
                    </div>
                  </button>
                  <button onClick={() => navigate('/courses')} className={globalCls(cur === '/courses')}>
                    <BookOpen className="w-5 h-5 shrink-0 text-[#00B4C8]" /><span>Mis Cursos</span>
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

            {(p.isAuthenticated || p.isTeacherUnlocked) && (
              <>
                <div className="border-t border-slate-100/80 my-4" />

                {/* Teacher panel */}
                <button
                  onClick={() => navigate('/unit/1/module/4')}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group w-full cursor-pointer bg-transparent border-none text-left ${
                    cur === '/unit/1/module/4'
                      ? 'bg-[#1B2A5A] text-white shadow-xl'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span>Panel docente</span>
                </button>
              </>
            )}
          </nav>

          {/* Progress cards — INACAP colors (only when logged in) */}
          {(p.isAuthenticated || p.isTeacherUnlocked) && (
            <div className="mt-8 flex flex-col gap-3">
              <ProgressCard
                label="Progreso U1" pct={overallU1}
                bgFrom="#004D5A" bgTo="#002B33"
                glowColor="#00B4C8" barFrom="#00B4C8" barTo="#00D4EA" textColor="#67E8F9"
              />
              <ProgressCard
                label="Progreso U2" pct={overallU2}
                bgFrom="#7A3200" bgTo="#4A1E00"
                glowColor="#E87A1E" barFrom="#E87A1E" barTo="#F59E0B" textColor="#FED7AA"
              />
              <ProgressCard
                label={p.preSpecialty === 'administracion' ? 'Progreso U3 (Prog.)' : 'Progreso U3 (Trig.)'}
                pct={overallU3}
                bgFrom="#1B2A5A" bgTo="#0F1A3A"
                glowColor="#6B7FCC" barFrom="#6B7FCC" barTo="#A5B4FC" textColor="#C7D2FE"
              />
              {p.preSpecialty === 'administracion' && (
                <ProgressCard
                  label="Progreso U4 (Fin.)" pct={overallU4}
                  bgFrom="#2D5016" bgTo="#1A300D"
                  glowColor="#8DC63F" barFrom="#8DC63F" barTo="#A8D85A" textColor="#BBF7D0"
                />
              )}
            </div>
          )}

          {/* Logout button (only when authenticated or teacher unlocked) */}
          {(p.isAuthenticated || p.isTeacherUnlocked) && (
            <button onClick={logout} className="sidebar-logout mt-4">
              <LogOut size={14} />
              Salir
            </button>
          )}

        </div>
      </aside>

      {/* ── Main: EXACT same structure as FRONT App.tsx ──────────────────── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E0F7FA]/40 via-slate-50/40 to-slate-100/40">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// ── Mini progress card ────────────────────────────────────────────────────────
const ProgressCard: React.FC<{
  label: string; pct: number;
  bgFrom: string; bgTo: string;
  glowColor: string; barFrom: string; barTo: string; textColor: string;
}> = ({ label, pct, bgFrom, bgTo, glowColor, barFrom, barTo, textColor }) => (
  <div
    className="rounded-3xl p-5 text-white shadow-xl relative overflow-hidden"
    style={{ background: `linear-gradient(to bottom, ${bgFrom}, ${bgTo})` }}
  >
    <div
      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"
      style={{ background: glowColor }}
    />
    <p className="text-[10px] font-bold mb-1 relative z-10 tracking-wider uppercase" style={{ color: textColor }}>{label}</p>
    <p className="text-sm font-extrabold mb-3 relative z-10 text-slate-100">{pct}% Completado</p>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10 border border-slate-700/50">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${pct}%`, background: `linear-gradient(to right, ${barFrom}, ${barTo})` }}
      />
    </div>
  </div>
);

export default MainLayout;
