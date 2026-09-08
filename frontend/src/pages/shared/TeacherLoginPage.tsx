import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { BrandMark } from '../../components/brand/BrandMark';
import { LectorMatIcon } from '../../components/brand/LectorMatIcon';
import { ActionButton } from '../../components/ui/ActionButton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { api } from '../../services/api';



const TeacherLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setRole           = useProgressStore((s) => s.setRole);
  const loginAction       = useProgressStore((s) => s.login);
  const unlockTeacherPanel = useProgressStore((s) => s.unlockTeacherPanel);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Debes ingresar tu correo institucional y contraseña.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.login(cleanEmail, cleanPass, 'teacher');

      if (res.status === 'ok' && res.user) {
        localStorage.setItem('lectormat-token', res.token);
        setRole('teacher');
        loginAction();
        unlockTeacherPanel();
        navigate('/teacher/courses');
        return;
      }

      if (res.status === 'error') {
        setError(res.message || 'Credenciales incorrectas.');
        setLoading(false);
        return;
      }
    } catch {
      setError('Error de conexión con el servidor. Por favor, intenta de nuevo más tarde.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-10"
      style={{ background: '#EEF1F6' }}
    >
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center gap-3 mb-8"
      >
        <BrandMark compact markClassName="h-20 w-20" />
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Lector<span className="text-orange-500">Mat</span></h1>
        </div>
      </motion.div>

      {/* Card */}
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Acceso Docente
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Ingresa con tu correo institucional y contraseña de docente para acceder al panel de gestión de cursos.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="teacher-email" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="teacher-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@inacap.cl"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="teacher-password" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="teacher-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <ActionButton
              type="submit"
              disabled={loading}
              variant="teacher"
              size="lg"
              fullWidth
              leading={<LectorMatIcon name="teacher" size={20} />}
            >
              {loading ? 'Verificando…' : 'Ingresar al Panel Docente'}
            </ActionButton>
          </form>
        </div>
      </motion.div>

      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 text-sm text-slate-500 font-bold hover:text-slate-700 transition-colors cursor-pointer border-none bg-transparent"
      >
        ← Volver al inicio
      </button>
    </div>
  );
};

export default TeacherLoginPage;
