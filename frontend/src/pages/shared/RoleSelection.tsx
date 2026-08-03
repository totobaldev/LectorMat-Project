import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  GraduationCap, BarChart2, ArrowRight, ArrowLeft, Mail, Lock,
  ShieldCheck, CheckCircle2, LogOut
} from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import logo from '../../assets/logo.jpeg';

// ─── Role Card Component ───────────────────────────────────────────────────────

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  accentClass: 'orange' | 'blue';
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  icon, title, subtitle, description, accentClass, onClick,
}) => {
  const isOrange = accentClass === 'orange';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`
        group w-full text-left bg-white rounded-[2rem] border-2 p-10
        flex flex-col gap-6 cursor-pointer transition-all duration-200 relative overflow-hidden
        ${isOrange
          ? 'border-slate-100 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/5'
          : 'border-slate-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5'
        }
      `}
      style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.04)' }}
    >
      {/* Icon */}
      <div
        className={`
          w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200
          ${isOrange
            ? 'bg-orange-50 text-orange-500 group-hover:bg-orange-100'
            : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
          }
        `}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <span
          className={`text-[11px] font-black uppercase tracking-widest ${
            isOrange ? 'text-orange-500' : 'text-blue-600'
          }`}
        >
          {subtitle}
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      {/* CTA arrow */}
      <div
        className={`
          mt-auto flex items-center gap-2 text-sm font-bold transition-colors duration-200 pt-2
          ${isOrange ? 'text-orange-500' : 'text-blue-600'}
        `}
      >
        Continuar a Credenciales
        <ArrowRight
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </motion.button>
  );
};

// ─── Main Role Selection & Credentials Auth Gateway ───────────────────────────

const RoleSelection: React.FC = () => {
  const setRole = useProgressStore((s) => s.setRole);
  const login   = useProgressStore((s) => s.login);
  const logout  = useProgressStore((s) => s.logout);

  // Multi-step local state: null = Step 1 (Role Selection), 'student' | 'teacher' = Step 2 (Credentials)
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  // Form credentials state
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setRole(selectedRole);
    login();
  };

  const isStudent = selectedRole === 'student';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-10">

      {/* ── Brand Header ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 mb-8"
      >
        <img
          src={logo}
          alt="LectorMat"
          className="h-20 w-auto object-contain"
        />
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            LectorMat
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Nivelación Matemática Técnico-Profesional
          </p>
        </div>
      </motion.div>

      {/* ── Animated Step Container ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedRole === null ? (
          /* ═════════════════════════════════════════════════════════════
             STEP 1: SELECCIÓN DE ROL
             ═════════════════════════════════════════════════════════════ */
          <motion.div
            key="step-role-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-3xl flex flex-col items-center gap-8"
          >
            <div className="text-center max-w-md">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Paso 1 de 2
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
                ¿Cómo deseas ingresar a LectorMat?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Selecciona tu perfil institucional para continuar al portal de acceso.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <RoleCard
                icon={<GraduationCap className="w-8 h-8" />}
                subtitle="Acceso Estudiante"
                title="Soy Estudiante"
                description="Accede a los módulos interactivos de trigonometría, funciones y ejercicios paso a paso."
                accentClass="orange"
                onClick={() => handleRoleSelect('student')}
              />

              <RoleCard
                icon={<BarChart2 className="w-8 h-8" />}
                subtitle="Acceso Docente"
                title="Soy Docente"
                description="Monitorea el progreso de tus estudiantes, revisa estadísticas por módulo y administra el curso."
                accentClass="blue"
                onClick={() => handleRoleSelect('teacher')}
              />
            </div>
          </motion.div>
        ) : (
          /* ═════════════════════════════════════════════════════════════
             STEP 2: SCREEN DE CREDENCIALES DE ACCESO
             ═════════════════════════════════════════════════════════════ */
          <motion.div
            key="step-credentials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            <div
              className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-10 flex flex-col gap-7"
              style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.04)' }}
            >
              {/* Header inside card */}
              <div className="flex flex-col items-center gap-3 text-center border-b border-slate-100 pb-6">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${
                    isStudent
                      ? 'bg-orange-50 text-orange-500 border border-orange-100'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}
                >
                  {isStudent ? <GraduationCap className="w-3.5 h-3.5" /> : <BarChart2 className="w-3.5 h-3.5" />}
                  {isStudent ? 'Perfil Estudiante' : 'Perfil Docente'}
                </span>

                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Credenciales de Acceso
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  {isStudent
                    ? 'Ingresa tu correo institucional o RUT de estudiante para iniciar tu sesión de aprendizaje.'
                    : 'Ingresa tu clave de docente para acceder al panel de supervisión del curso.'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-5">
                {/* Email input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="cred-email"
                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    Correo Institucional
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="cred-email"
                      type="email"
                      required
                      placeholder={isStudent ? 'estudiante@instituto.cl' : 'docente@instituto.cl'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="cred-password"
                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    Contraseña / Clave
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="cred-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Remember & Links */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    Recordar sesión
                  </label>
                  <span className="text-slate-400 font-medium hover:text-slate-600 cursor-pointer transition-colors">
                    ¿Ayuda?
                  </span>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center justify-center gap-2 text-white rounded-2xl py-3.5 px-6 font-bold text-base transition-colors duration-200 cursor-pointer shadow-sm mt-2
                    ${isStudent
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                    }
                  `}
                  style={{
                    boxShadow: isStudent
                      ? '0 4px 14px rgb(37,99,235,0.25)'
                      : '0 4px 14px rgb(37,99,235,0.25)'
                  }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Ingresar a LectorMat
                </motion.button>
              </form>

              {/* Back to role selection */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Cambiar selección de perfil
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="mt-10 flex flex-col items-center gap-2 text-center">
        <p className="text-xs text-slate-400 font-medium">
          LectorMat © {new Date().getFullYear()} · Plataforma de nivelación matemática técnico-profesional
        </p>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer pt-1"
        >
          <LogOut className="w-3 h-3" />
          Reiniciar sesión
        </button>
      </footer>
    </div>
  );
};

export default RoleSelection;
