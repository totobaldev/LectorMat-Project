import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, ArrowRight, Plus, Bell } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { useStudentProgress } from '../../hooks/useStudentProgress';
import { BrandMark } from '../brand/BrandMark';
import { LectorMatIcon } from '../brand/LectorMatIcon';
import { StatusBadge } from '../ui/StatusBadge';

const MainLayout: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const store     = useProgressStore();
  const logout    = store.logout;
  const p         = store;
  
  const { activeMaterial, units, overallPct } = useStudentProgress();

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth >= 768
  ));
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const cur = location.pathname;

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
                <button onClick={() => navigate('/courses')} className={globalCls(cur === '/courses' || cur.startsWith('/unit/'))} aria-label="Mis Cursos" title={!isSidebarOpen ? 'Mis Cursos' : undefined}>
                  <LectorMatIcon name="courses" size={20} className="shrink-0" />
                  {isSidebarOpen && <span>Mis Cursos</span>}
                </button>
                
                {isSidebarOpen && (cur === '/courses' || cur.startsWith('/unit/')) && units.length > 0 && (
                  <div className="ml-8 pl-3 border-l-2 border-slate-100 flex flex-col gap-1 py-1">
                    {units.map(u => {
                      const isActive = cur.includes(`/unit/${u.unitNum}`);
                      return (
                        <button
                          key={u.id}
                          onClick={() => navigate(`/unit/${u.unitNum}/module/1`)}
                          className={`w-full text-left text-[11px] font-bold py-1.5 px-2 rounded-lg transition-colors border-none bg-transparent cursor-pointer flex justify-between items-center ${
                            isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          Unidad {u.unitNum}
                          {u.isCompleted && <span className="text-emerald-500">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                )}

                <button onClick={() => navigate('/dashboard')} className={globalCls(cur === '/dashboard')} aria-label="Mi Avance" title={!isSidebarOpen ? 'Mi Avance' : undefined}>
                  <LectorMatIcon name="progress" size={20} className="shrink-0" />
                  {isSidebarOpen && <span>Mi Avance</span>}
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
        {/* Top Gradient Bar */}
        <div className="hidden md:flex w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 py-1.5 px-6 items-center justify-center shrink-0 z-20">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Plataforma Transforma 2026</span>
        </div>

        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer border border-slate-200/60 shadow-sm bg-transparent"
              title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-800 tracking-wide">Lector<span className="text-orange-500">Mat</span></span>
              {cur.includes('/teacher') && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-sm font-semibold text-slate-600">Panel Docente</span>
                </>
              )}
              {cur.includes('/courses') && !cur.includes('/teacher') && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-sm font-semibold text-slate-600">Mis Cursos</span>
                </>
              )}
              {cur.includes('/dashboard') && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-sm font-semibold text-slate-600">Mi Avance</span>
                </>
              )}
            </div>
          </div>
          
          {(p.isAuthenticated || p.isTeacherUnlocked) && (
            <div className="flex items-center gap-3 relative">
              {/* Notif & XP for Students */}
              {p.role === 'student' && (
                <div className="flex items-center gap-3 mr-2">
                  <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm cursor-help" title={`Nivel ${p.level || 1}`}>
                    <svg className="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="text-xs font-black text-yellow-700">{p.xp || 0} XP</span>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setIsNotifDropdownOpen(!isNotifDropdownOpen);
                        if (isNotifDropdownOpen) p.markNotificationsRead();
                      }}
                      className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent relative"
                    >
                      <Bell className="w-5 h-5" />
                      {p.unreadNotifications > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                      )}
                    </button>
                    
                    {/* Notif Dropdown */}
                    {isNotifDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => { setIsNotifDropdownOpen(false); p.markNotificationsRead(); }}></div>
                        <div className="absolute top-12 right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Notificaciones</p>
                            <button onClick={() => p.markNotificationsRead()} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer">Marcar leídas</button>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {!p.notifications || p.notifications.length === 0 ? (
                              <div className="p-6 text-center text-xs font-medium text-slate-400">No tienes notificaciones.</div>
                            ) : (
                              p.notifications.map(n => (
                                <div key={n.id} className={`p-4 border-b border-slate-50 flex gap-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                  <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                  <p className="text-xs font-medium text-slate-600 leading-relaxed text-left">{n.message}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="text-right hidden md:block">
                <p className="text-xs font-extrabold text-slate-900">{p.role === 'teacher' ? 'Docente' : (p.studentName || 'Estudiante')}</p>
                <p className="text-[10px] text-slate-500 font-medium">{p.role === 'teacher' ? 'Admin' : (p.studentEmail || 'inacapmail.cl')}</p>
              </div>
              <button 
                onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all focus:outline-none"
              >
                {p.avatar ? (
                  <img src={p.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-slate-600">
                    {p.role === 'teacher' ? 'DO' : (p.studentName ? p.studentName.substring(0, 2).toUpperCase() : 'ES')}
                  </span>
                )}
              </button>

              {/* Avatar Dropdown */}
              {isAvatarDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsAvatarDropdownOpen(false)}></div>
                  <div className="absolute top-12 right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Elige tu Avatar</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'boy', src: '/avatars/boy.jpg', alt: 'Chico' },
                        { id: 'girl', src: '/avatars/girl.jpg', alt: 'Chica' },
                        { id: 'animal', src: '/avatars/animal.jpg', alt: 'Mascota' }
                      ].map((av) => (
                        <button
                          key={av.id}
                          onClick={() => { p.setAvatar(av.src); setIsAvatarDropdownOpen(false); }}
                          className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${p.avatar === av.src ? 'border-blue-500 shadow-md scale-105' : 'border-transparent hover:scale-105 hover:shadow-sm'}`}
                        >
                          <img src={av.src} alt={av.alt} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
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
