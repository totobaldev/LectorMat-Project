import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { BrandMark } from '../../components/brand/BrandMark';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const setRole = useProgressStore((s) => s.setRole);
  const loginAction = useProgressStore((s) => s.login);
  const setStudentSession = useProgressStore((s) => s.setStudentSession);
  const unlockTeacherPanel = useProgressStore((s) => s.unlockTeacherPanel);
  const updateProgress = useProgressStore((s) => s.updateProgress);

  const handleRoleSelect = (role: 'student' | 'teacher' | 'admin') => {
    // Fake token to bypass Auth checks
    localStorage.setItem('lectormat-token', 'bypass-token-vercel');

    if (role === 'student') {
      setStudentSession('demo.estudiante@inacapmail.cl', 'Estudiante Demo');
      setRole('student');
      updateProgress({ 
        xp: 150, 
        level: 2, 
        career: 'Ingeniería en Informática',
        preSpecialty: 'mecanica',
        subject: 'Funciones y Geometría'
      });
      loginAction();
      navigate('/courses');
    } else if (role === 'teacher') {
      setStudentSession('demo.docente@inacap.cl', 'Profesor Demo');
      setRole('teacher');
      loginAction();
      unlockTeacherPanel();
      navigate('/teacher/courses');
    } else if (role === 'admin') {
      setStudentSession('admin@inacap.cl', 'Administrador');
      setRole('admin');
      loginAction();
      unlockTeacherPanel();
      navigate('/teacher/courses');
    }
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
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Modo Demostración</p>
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
          className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-10 flex flex-col gap-6"
          style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.06)' }}
        >
          <div className="flex flex-col items-center gap-2 text-center border-b border-slate-100 pb-5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Selecciona tu Rol
            </h2>
            <p className="text-sm text-slate-500">
              Ingreso directo sin credenciales para probar la plataforma.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleRoleSelect('student')}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Estudiante</h3>
                <p className="text-xs text-slate-500">Ver módulos, actividades y progreso</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('teacher')}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Docente</h3>
                <p className="text-xs text-slate-500">Panel de profesor para ver secciones</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('admin')}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Administrador</h3>
                <p className="text-xs text-slate-500">Acceso total para gestionar la plataforma</p>
              </div>
            </button>
          </div>
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
