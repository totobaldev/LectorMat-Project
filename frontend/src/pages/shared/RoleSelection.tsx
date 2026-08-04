import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import logo from '../../assets/logo.jpeg';

// ─── Auth Gateway (Student only — teacher panel accessed from sidebar) ─────────

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const setRole = useProgressStore((s) => s.setRole);
  const login   = useProgressStore((s) => s.login);

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [remember, setRemember]   = useState(true);
  const [showPass, setShowPass]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('student');
    login();
    navigate('/');
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
        <img src={logo} alt="LectorMat" className="h-20 w-auto object-contain" />
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">LectorMat</h1>
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
            <span
              className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider border"
              style={{ background: '#E0F7FA', color: '#00B4C8', borderColor: '#B2EBF2' }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Acceso Estudiante
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Credenciales de Acceso
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Ingresa tu correo institucional o RUT de estudiante para iniciar tu sesión de aprendizaje.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Correo o RUT
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@inacap.cl"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#00B4C8] focus:ring-4 focus:ring-[#00B4C8]/10 focus:bg-white"
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
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#00B4C8] focus:ring-4 focus:ring-[#00B4C8]/10 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setRemember(v => !v)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  remember
                    ? 'border-[#00B4C8] bg-[#00B4C8]'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {remember && <CheckCircle2 className="w-3 h-3 text-white" />}
              </button>
              <span className="text-sm text-slate-600">Mantener sesión activa</span>
            </label>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl font-extrabold text-white text-sm tracking-wide transition-all"
              style={{
                background: 'linear-gradient(to right, #00B4C8, #0098AA)',
                boxShadow: '0 4px 20px rgba(0,180,200,0.35)',
              }}
            >
              Ingresar a LectorMat
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
