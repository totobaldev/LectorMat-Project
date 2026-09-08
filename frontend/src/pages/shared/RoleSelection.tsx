import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { useTeacherStore } from '../../store/useTeacherStore';
import { BrandMark } from '../../components/brand/BrandMark';
import { LectorMatIcon } from '../../components/brand/LectorMatIcon';
import { ActionButton } from '../../components/ui/ActionButton';
import { StatusBadge } from '../../components/ui/StatusBadge';

// ─── Auth Gateway (Student login with generated credentials) ─────────────────

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const setRole = useProgressStore((s) => s.setRole);
  const login   = useProgressStore((s) => s.login);
  const setStudentSession = useProgressStore((s) => s.setStudentSession);
  const updateProgress = useProgressStore((s) => s.updateProgress);
  const teacherCourses = useTeacherStore((s) => s.teacherCourses);

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [remember, setRemember]   = useState(true);
  const [showPass, setShowPass]   = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setErrorMsg('Ingresa tu correo institucional o usuario.');
      return;
    }

    // Search across enrolled students in teacher store
    const allEnrolled = teacherCourses.flatMap((c) => c.enrolledStudents || []);
    const matchingStudent = allEnrolled.find(
      (s) => s.email.toLowerCase() === cleanEmail || s.username?.toLowerCase() === cleanEmail
    );

    if (matchingStudent && matchingStudent.password) {
      if (cleanPass !== matchingStudent.password) {
        setErrorMsg(
          `Contraseña incorrecta para ${matchingStudent.name}. Recuerda usar el formato NOMBREapellido (ej: JOAQUINalbornoz).`
        );
        return;
      }
    }

    const studentDisplayName = matchingStudent?.name || cleanEmail;
    setStudentSession(cleanEmail, studentDisplayName);

    if (matchingStudent?.career) {
      const isMech = matchingStudent.career.toLowerCase().includes('mecánica');
      updateProgress({
        career: matchingStudent.career,
        preSpecialty: isMech ? 'mecanica' : 'administracion',
        subject: isMech ? 'Funciones y Geometría' : 'Funciones y Progresiones'
      });
    }

    setRole('student');
    login();
    navigate('/courses');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-10"
      style={{ background: '#EEF1F6' }}
    >
      {/* ── Brand ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 mb-8"
      >
        <BrandMark compact markClassName="h-20 w-20" />
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Lector<span className="text-orange-500">Mat</span></h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Nivelación Matemática Técnico-Profesional
          </p>
        </div>
      </motion.div>

      {/* ── Credentials Card ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div
          className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-10 flex flex-col gap-7"
          style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.06)' }}
        >
          {/* Card header */}
          <div className="flex flex-col items-center gap-3 text-center border-b border-slate-100 pb-6">
            <StatusBadge tone="blue" icon={<LectorMatIcon name="reading" size={14} />}>
              Acceso Estudiante
            </StatusBadge>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Credenciales de Acceso
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Ingresa tu correo institucional o RUT de estudiante para iniciar tu sesión de aprendizaje.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errorMsg && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="student-identity" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Correo o RUT
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="student-identity"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@inacap.cl"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="student-password" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="student-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  remember
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {remember && <CheckCircle2 className="w-3 h-3 text-white" />}
              </span>
              <span className="text-sm text-slate-600">Mantener sesión activa</span>
            </label>

            {/* Submit */}
            <ActionButton
              type="submit"
              variant="student"
              size="lg"
              fullWidth
              leading={<LectorMatIcon name="reading" size={20} />}
            >
              Ingresar a LectorMat
            </ActionButton>
          </form>
        </div>
      </motion.div>

      {/* Back to Home */}
      <button 
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 text-sm text-slate-500 font-bold hover:text-slate-700 transition-colors cursor-pointer border-none bg-transparent"
      >
        &larr; Volver al inicio
      </button>
    </div>
  );
};

export default RoleSelection;
