import React, { useState } from 'react';
import { useFrontProps } from '../../../hooks/useFrontProps';
import { Lock, ArrowRight, Mail, Eye, EyeOff } from 'lucide-react';

export default function Module4() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validates a real email format and correct password
    if (email.includes('@') && password === 'Inacap825') {
      setIsTeacher(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (!isTeacher) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 max-w-md w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 mx-auto bg-[#E0F7FA] text-[#00B4C8] rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Acceso Restringido</h2>
          <p className="text-sm text-slate-500 mb-8">Por favor, ingrese sus credenciales de docente para acceder a las estadísticas del curso.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Correo Docente
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@inacap.cl"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#00B4C8] focus:ring-2 focus:ring-[#00B4C8]/10 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input 
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#00B4C8] focus:ring-2 focus:ring-[#00B4C8]/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-500 text-center mt-1">
                Credenciales incorrectas. Intente nuevamente.
              </p>
            )}

            <button 
              type="submit"
              className="w-full text-white font-extrabold py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              style={{
                background: 'linear-gradient(to right, #00B4C8, #0098AA)',
                boxShadow: '0 4px 15px rgba(0,180,200,0.3)',
              }}
            >
              Ingresar <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <button 
            onClick={() => setScreen('home')}
            className="mt-6 text-sm text-slate-400 font-bold hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
          >
            &larr; Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">M4: Panel docente</h1>
          <p className="text-slate-500">Curso piloto · Unidad 3 · 65 estudiantes (xAPI / LMS).</p>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Completitud</div>
          <div className="text-4xl font-black text-slate-900">74%</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Accesos extra</div>
          <div className="text-4xl font-black text-slate-900">312</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Método (1ª rev)</div>
          <div className="text-4xl font-black text-emerald-600">61%</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">En Riesgo</div>
          <div className="text-4xl font-black text-red-500">8</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Completitud */}
        <div className="col-span-12 lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Módulos Completados</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-slate-700">M1 · Comprensión</span>
                <span className="font-bold text-indigo-600">88%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div className="h-full w-[88%] bg-indigo-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-slate-700">M2 · Método</span>
                <span className="font-bold text-emerald-600">72%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div className="h-full w-[72%] bg-emerald-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-slate-700">M3 · Banco</span>
                <span className="font-bold text-orange-500">63%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div className="h-full w-[63%] bg-orange-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Errores */}
        <div className="col-span-12 lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Distribución de errores</h3>
          <p className="text-sm text-slate-500 mb-6">Dónde se traban los estudiantes al fallar</p>
          
          <div className="flex items-end gap-4 h-32">
            <div className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-sm font-bold text-slate-600 mb-2">22%</span>
              <div className="w-full bg-indigo-500 rounded-t-xl" style={{ height: '46%' }}></div>
              <span className="text-xs font-bold text-slate-500 mt-3">Comp.</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-sm font-bold text-slate-600 mb-2">41%</span>
              <div className="w-full bg-emerald-500 rounded-t-xl" style={{ height: '86%' }}></div>
              <span className="text-xs font-bold text-slate-500 mt-3">Método</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-sm font-bold text-slate-600 mb-2">24%</span>
              <div className="w-full bg-orange-400 rounded-t-xl" style={{ height: '50%' }}></div>
              <span className="text-xs font-bold text-slate-500 mt-3">Ejec.</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-sm font-bold text-slate-600 mb-2">13%</span>
              <div className="w-full bg-slate-400 rounded-t-xl" style={{ height: '27%' }}></div>
              <span className="text-xs font-bold text-slate-500 mt-3">Verif.</span>
            </div>
          </div>
        </div>

        {/* Detección Temprana */}
        <div className="col-span-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Sujetos de Alerta</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">JV</div>
                 <div>
                   <p className="font-bold text-slate-900">J. Vega</p>
                   <p className="text-xs text-slate-500">Mecánica Vesp.</p>
                 </div>
               </div>
               <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">Atascado en M2. 3 intentos fallidos en nodo Coseno.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">MR</div>
                 <div>
                   <p className="font-bold text-slate-900">M. Rojas</p>
                   <p className="text-xs text-slate-500">Administración</p>
                 </div>
               </div>
               <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">No accede a plataforma. M1 incompleto.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">CT</div>
                 <div>
                   <p className="font-bold text-slate-900">C. Torres</p>
                   <p className="text-xs text-slate-500">Mecánica Diurno</p>
                 </div>
               </div>
               <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">Resuelve M3 siempre con pista. Revisar autonomía.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
