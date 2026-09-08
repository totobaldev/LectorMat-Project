import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { useStudentProgress } from '../hooks/useStudentProgress';

import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { LectorMatIcon } from '../components/brand/LectorMatIcon';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  const progress = useProgressStore();
  const { overallPct, units, activeMaterial, u3Title } = useStudentProgress();

  // Find the active unit (the one the student is currently working on)
  const activeUnitNum = activeMaterial.path.includes('/unit/') ? parseInt(activeMaterial.path.split('/')[2]) : 1;
  const currentUnit = units.find(u => u.unitNum === activeUnitNum) || units[0];

  const { m1Pct, m2Pct, m3Pct, overall, isCompleted } = currentUnit;

  // Simple logic to detect weaknesses in current unit
  const needsM1 = m1Pct < 100 && overall > 10;
  const needsM2 = m1Pct === 100 && m2Pct < 100;
  const needsM3 = m2Pct === 100 && m3Pct < 100;

  // Let's create dynamic tips
  const tips = [];
  if (!progress.preCompleted) {
    tips.push({
      title: "Completa la Nivelación de Lectura",
      desc: "Te sugerimos iniciar el Módulo de Comprensión Lectora Aplicada para entrenar la extracción de datos y variables en tu especialidad antes de las matemáticas.",
      icon: <LectorMatIcon name="reading" size={22} className="text-blue-600" />,
      action: () => navigate('/pre')
    });
  }
  if (needsM1) {
    tips.push({
      title: "Mejora en Comprensión",
      desc: "Vuelve al módulo de Comprensión y revisa cómo identificar las variables clave. Es la base de todo.",
      icon: <LectorMatIcon name="reading" size={22} className="text-blue-600" />,
      action: () => navigate(`/unit/${currentUnit.unitNum}/module/1`)
    });
  }
  if (needsM2 || (!needsM1 && !needsM3 && overall > 20 && m2Pct < 100)) {
    tips.push({
      title: "Practica el Método de Resolución",
      desc: "La clave está en los datos que te dan en el Método paso a paso. Úsalos para seleccionar la fórmula correcta.",
      icon: <LectorMatIcon name="method" size={22} className="text-orange-600" />,
      action: () => navigate(`/unit/${currentUnit.unitNum}/module/2`)
    });
  }
  if (needsM3 || (m3Pct < 100 && overall > 40)) {
    tips.push({
      title: "Enfrenta problemas sin pistas",
      desc: "Dirígete al Banco interactivo e intenta resolver un par de problemas sin mirar la fórmula. Te dará seguridad.",
      icon: <LectorMatIcon name="challenge" size={22} className="text-orange-600" />,
      action: () => navigate(`/unit/${currentUnit.unitNum}/module/3`)
    });
  }

  // Fallback tip if doing great
  if (isCompleted) {
    tips.push({
      title: "¡Excelente desempeño!",
      desc: `Has dominado la Unidad ${currentUnit.unitNum}. Estás listo para avanzar a la siguiente unidad o ayudar a tus compañeros.`,
      icon: <LectorMatIcon name="progress" size={22} className="text-emerald-600" />,
      action: null
    });
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 sm:p-8 rounded-[2rem] border border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge tone="blue" icon={<LectorMatIcon name="statistics" size={13} />}>Progreso General</StatusBadge>
            <StatusBadge tone="orange" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Nivel {progress.level || 1} • {progress.xp || 0} XP
            </StatusBadge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mi Avance</h1>
          <p className="text-blue-600 font-medium">Desempeño actual en Unidad {currentUnit.unitNum}</p>
        </div>
        <div className="absolute -top-12 right-12 w-36 h-36 bg-blue-50 rounded-[2.5rem] rotate-12" aria-hidden="true"></div>
        <LectorMatIcon name="progress" size={88} className="absolute right-12 top-1/2 -translate-y-1/2 text-blue-100" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Progress Overview Section */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-7 relative overflow-hidden flex flex-col items-center text-center">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6 w-full text-left">Progreso (Unidad {currentUnit.unitNum})</h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600 transition-all duration-1000 ease-out"
                  strokeWidth="3"
                  strokeDasharray={`${overall}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900">{overall}%</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Módulo Comprensión Lectora Aplicada</span>
                  <span className="text-amber-600">{progress.preCompleted ? 100 : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress.preCompleted ? 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>M1: Comprensión</span>
                  <span className="text-indigo-600">{m1Pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${m1Pct}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>M2: Método</span>
                  <span className="text-emerald-600">{m2Pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${m2Pct}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>M3: Banco</span>
                  <span className="text-orange-600">{m3Pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${m3Pct}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Tips Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Low Performance / Alerts */}
          {overall < 100 && (
            <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-amber-950 mb-1">Próximo foco de mejora</h3>
                  <p className="text-amber-800 text-sm leading-relaxed mb-4">
                    Hemos detectado {needsM1 ? 'dificultades iniciales en la identificación de datos (M1).' : needsM2 ? 'errores al elegir la fórmula trigonométrica correcta (M2).' : 'baja consistencia al resolver problemas sin guías (M3).'} Abajo encontrarás tips para superarlo.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            {/* Tips Section */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-7 flex flex-col h-full">
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Tips de Estudio
              </h3>
              
              <div className="space-y-4 flex-1">
                {tips.map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-amber-100 shadow-sm flex items-center justify-center shrink-0 text-amber-500">
                        {tip.icon}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900">{tip.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
                    {tip.action && (
                      <button 
                        onClick={tip.action}
                        className="py-2 px-3 mt-1 bg-white border border-slate-200 shadow-sm text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 transition-colors w-full cursor-pointer"
                      >
                        Ir a la lección &rarr;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Moodle-like Timeline / Pending Tasks */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-7 flex flex-col h-full">
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" /> Tareas Pendientes
              </h3>
              
              <div className="space-y-4 flex-1 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {!progress.preCompleted && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <LectorMatIcon name="reading" size={14} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-xs">Nivelación</span>
                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Obligatorio</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Comprensión Lectora</p>
                    </div>
                  </div>
                )}
                
                {m1Pct < 100 && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <span className="text-xs font-bold">M1</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-xs">Módulo 1</span>
                        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Pendiente</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Unidad {currentUnit.unitNum}</p>
                    </div>
                  </div>
                )}

                {m2Pct < 100 && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <span className="text-xs font-bold">M2</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm opacity-60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-xs">Módulo 2</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Bloqueado</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Unidad {currentUnit.unitNum}</p>
                    </div>
                  </div>
                )}
                
                {isCompleted && (
                  <div className="relative flex items-center justify-center py-4">
                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full z-10">
                      Todo al día 🎉
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-7 w-full mt-2">
        <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center ring-1 ring-inset ring-orange-100">
                <LectorMatIcon name="achievements" size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Insignias y Reconocimientos</h2>
            <p className="text-slate-500 text-sm">Tus logros desbloqueados en la plataforma.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-3 transition-colors ${progress.preCompleted ? 'bg-amber-50 border-amber-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${progress.preCompleted ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-slate-200 text-slate-400'}`}>
              <LectorMatIcon name="achievements" size={30} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">Lector de<br/>Especialidad</p>
              <p className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase mt-1">
                {progress.preSpecialty === 'mecanica' 
                  ? 'Área Mecánica' 
                  : progress.preSpecialty === 'administracion' 
                    ? 'Administración' 
                    : 'Pendiente'}
              </p>
              <div className="mt-2 flex justify-center">
                {progress.preCompleted ? <CheckCircle2 className="w-5 h-5 text-amber-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-3 transition-colors ${m1Pct === 100 ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${m1Pct === 100 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}>
              <LectorMatIcon name="reading" size={30} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">Lector<br/>Experto</p>
              <div className="mt-2 flex justify-center">
                {m1Pct === 100 ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
              </div>
            </div>
          </div>
          
          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-3 transition-colors ${m2Pct === 100 ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${m2Pct === 100 ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-slate-200 text-slate-400'}`}>
              <LectorMatIcon name="method" size={30} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">Estratega<br/>Avanzado</p>
              <div className="mt-2 flex justify-center">
                {m2Pct === 100 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-3 transition-colors ${m3Pct === 100 ? 'bg-orange-50 border-orange-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${m3Pct === 100 ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-slate-200 text-slate-400'}`}>
              <LectorMatIcon name="challenge" size={30} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">Resolutor<br/>Rápido</p>
              <div className="mt-2 flex justify-center">
                {m3Pct === 100 ? <CheckCircle2 className="w-5 h-5 text-orange-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-3 transition-colors ${overall === 100 ? 'bg-amber-50 border-amber-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${overall === 100 ? 'bg-amber-400 text-amber-900 shadow-md shadow-amber-200' : 'bg-slate-200 text-slate-400'}`}>
              <LectorMatIcon name="reward" size={30} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">Maestro<br/>de Unidad</p>
              <div className="mt-2 flex justify-center">
                {overall === 100 ? <CheckCircle2 className="w-5 h-5 text-amber-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
