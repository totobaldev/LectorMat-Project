import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, Users, BookOpen, LogOut, TrendingUp, Lock, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import logo from '../../assets/logo.jpeg';

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}> = ({ icon, label, value, sub, color }) => (
  <div
    className="bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col gap-3"
    style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.04)' }}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Locked Gate ──────────────────────────────────────────────────────────────

const LockedGate: React.FC<{ onUnlock: () => void; onBack: () => void }> = ({
  onUnlock,
  onBack,
}) => {
  const [pin, setPin] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-[2rem] w-full max-w-sm flex flex-col items-center gap-6 px-10 py-10"
        style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.06)' }}
      >
        {/* Lock icon */}
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Lock className="w-7 h-7 text-slate-500" />
        </div>

        {/* Text */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Acceso Restringido
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Por favor, ingrese la clave de docente para acceder a las estadísticas del curso.
          </p>
        </div>

        {/* Input */}
        <input
          id="teacher-pin"
          type="password"
          placeholder="••••••••"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition text-center tracking-widest"
        />

        {/* Unlock button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUnlock}
          className="w-full flex items-center justify-center gap-2 text-white rounded-xl py-3 text-sm transition-colors cursor-pointer font-bold"
          style={{ background: '#00B4C8', boxShadow: '0 4px 12px rgba(0,180,200,0.25)' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#0098AA')}
          onMouseLeave={e => (e.currentTarget.style.background = '#00B4C8')}
        >
          Ingresar
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        {/* Back link */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al inicio
        </button>
      </motion.div>
    </div>
  );
};

// ─── Teacher Panel ────────────────────────────────────────────────────────────

const TeacherPanel: React.FC = () => {
  const logout = useProgressStore((s) => s.logout);
  const isTeacherUnlocked = useProgressStore((s) => s.isTeacherUnlocked);
  const unlockTeacherPanel = useProgressStore((s) => s.unlockTeacherPanel);

  if (!isTeacherUnlocked) {
    return (
      <LockedGate
        onUnlock={unlockTeacherPanel}
        onBack={logout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header
        className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between"
        style={{ boxShadow: '0 2px 12px rgb(0,0,0,0.03)' }}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="LectorMat" className="h-9 w-auto object-contain" />
          <div>
            <span className="text-xs font-black uppercase tracking-widest block" style={{ color: '#00B4C8' }}>
              Panel Docente
            </span>
            <span className="text-sm font-bold text-slate-700">LectorMat</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer bg-transparent border-none"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </header>

      {/* ── Content ─────────────────────────────────────────────── */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col gap-8"
        >
          {/* Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">Panel Docente</h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitorea el progreso de tus estudiantes por unidad y módulo.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <StatCard
              icon={<Users className="w-5 h-5 text-blue-600" />}
              label="Estudiantes"
              value="—"
              sub="Sin datos aún"
              color="bg-blue-50"
            />
            <StatCard
              icon={<BookOpen className="w-5 h-5 text-orange-500" />}
              label="Módulos activos"
              value="4"
              sub="U1 → U4"
              color="bg-orange-50"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
              label="Tasa completitud"
              value="—"
              sub="Sin datos aún"
              color="bg-emerald-50"
            />
            <StatCard
              icon={<BarChart2 className="w-5 h-5 text-violet-500" />}
              label="Interacciones"
              value="—"
              sub="Sin datos aún"
              color="bg-violet-50"
            />
          </div>

          {/* Placeholder for future telemetry */}
          <div
            className="bg-white rounded-[2rem] border border-slate-100 p-10 text-center"
            style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.04)' }}
          >
            <BarChart2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h2 className="text-lg font-extrabold text-slate-700 mb-2">
              Telemetría de estudiantes
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Aquí se mostrarán las métricas de progreso, tiempo por módulo y tasas de
              éxito una vez que los estudiantes comiencen a utilizar la plataforma.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TeacherPanel;
