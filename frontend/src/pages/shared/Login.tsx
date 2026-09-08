import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import logo from '../../assets/logo.jpeg';

const Login: React.FC = () => {
  const login = useProgressStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">

      {/* ── Card ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="bg-white rounded-[2rem] w-full max-w-md"
        style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.06)' }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3 px-10 pt-10 pb-8 border-b border-slate-100">
          <img
            src={logo}
            alt="LectorMat"
            className="h-16 w-auto object-contain"
          />
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Bienvenido a LectorMat
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Ingresa tus credenciales para continuar
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-10 py-8">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-bold text-slate-500 uppercase tracking-widest"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="correo@institución.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-bold text-slate-500 uppercase tracking-widest"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 w-full flex items-center justify-center gap-2 text-white font-bold rounded-xl py-3 text-sm transition-colors cursor-pointer"
          style={{ background: '#00B4C8', boxShadow: '0 4px 12px rgba(0,180,200,0.25)' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#0098AA')}
          onMouseLeave={e => (e.currentTarget.style.background = '#00B4C8')}
          >
            Ingresar
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </motion.div>

      {/* ── Secondary link ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-6 text-center"
      >
        <button
          type="button"
          className="text-sm text-slate-500 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer"
        >
          Solicitar demo
        </button>
      </motion.div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <p className="mt-8 text-xs text-slate-300">
        LectorMat © {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Login;
