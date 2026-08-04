import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import logo from '../../assets/logo.jpeg';

// ── Mock teacher credentials (frontend-only) ────────────────────────────────
const MOCK_TEACHERS = [
  { email: 'docente@inacap.cl',   password: '1234', name: 'Prof. Bastián' },
  { email: 'bastian@inacap.cl',   password: '1234', name: 'Prof. Bastián' },
  { email: 'cristobal@inacap.cl',   password: '1234', name: 'Prof. Cristóbal' },
  { email: 'profesor@lectormat.cl', password: 'admin', name: 'Prof. Admin' },
];

// ─────────────────────────────────────────────────────────────────────────────

const TeacherLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setRole           = useProgressStore((s) => s.setRole);
  const login             = useProgressStore((s) => s.login);
  const unlockTeacherPanel = useProgressStore((s) => s.unlockTeacherPanel);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate async auth (300 ms)
    setTimeout(() => {
      const match = MOCK_TEACHERS.find(
        (t) => t.email.toLowerCase() === email.toLowerCase().trim() && t.password === password
      );
      if (match) {
        setRole('teacher');
        login();
        unlockTeacherPanel();
        navigate('/teacher/courses');
      } else {
        setError('Credenciales incorrectas. Intenta con docente@inacap.cl / 1234');
        setLoading(false);
      }
    }, 300);
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
        <img src={logo} alt="LectorMat" className="h-20 w-auto object-contain" />
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">LectorMat</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Portal Docente
          </p>
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
            <span
              className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider border"
              style={{ background: '#FFF7ED', color: '#EA580C', borderColor: '#FED7AA' }}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Acceso Docente
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Credenciales Docente
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
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="teacher-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="docente@inacap.cl"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="teacher-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="--> 1234"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 rounded-2xl font-extrabold text-white text-sm tracking-wide transition-all disabled:opacity-60 cursor-pointer border-none"
              style={{
                background: loading
                  ? '#fb923c'
                  : 'linear-gradient(to right, #f97316, #ea580c)',
                boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
              }}
            >
              {loading ? 'Verificando…' : 'Ingresar al Panel Docente'}
            </motion.button>
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
