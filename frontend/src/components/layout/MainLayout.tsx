import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BookOpen, LayoutDashboard, GraduationCap, BrainCircuit } from 'lucide-react';
import { useProgressStore, selectOverallProgress } from '../../store/useProgressStore';

const MainLayout: React.FC = () => {
  const overallProgress = useProgressStore(selectOverallProgress);
  const career = useProgressStore((s) => s.selectedCareer);

  return (
    <div className="layout-root">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <GraduationCap size={28} />
          <span>LectorMat</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <BookOpen size={18} />
            <span>Inicio</span>
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/unit/3" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <BookOpen size={18} />
            <span>Unidad 3</span>
          </NavLink>
          <NavLink to="/unit/3/module/2" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <BrainCircuit size={18} />
            <span>U3 · M2 Árbol</span>
          </NavLink>
        </nav>

        {/* Progress summary */}
        <div className="sidebar-footer">
          {career && (
            <p className="sidebar-career">{career}</p>
          )}
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="progress-label">{overallProgress}% completado</span>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
