import React from 'react';
import { useFrontProps } from '../hooks/useFrontProps';

import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { LectorMatIcon } from '../components/brand/LectorMatIcon';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function Dashboard() {
  const { setScreen, progress } = useFrontProps();

  const m1Pct = progress.m1Completed ? 100 : Math.round((progress.m1SlotsPlaced / 3) * 55);
  const m2Pct = progress.m2Completed ? 100 : Math.min(85, progress.m2NodesVisited * 30);
  const m3Pct = Math.round((progress.m3CompletedLevels / 3) * 100);
  const overall = Math.round((m1Pct + m2Pct + m3Pct) / 3);

  // Simple logic to detect weaknesses
  const needsM1 = !progress.m1Completed && overall > 10;
  const needsM2 = progress.m1Completed && !progress.m2Completed;
  const needsM3 = progress.m2Completed && !progress.m3Completed;

  // Let's create dynamic tips
  const tips = [];
  if (!progress.preCompleted) {
    tips.push({
      title: "Completa la Nivelación de Lectura",
      desc: "Te sugerimos iniciar el Módulo de Comprensión Lectora Aplicada para entrenar la extracción de datos y variables en tu especialidad antes de las matemáticas.",
      icon: <LectorMatIcon name="reading" size={22} className="text-blue-600" />,
      action: () => setScreen('pre_m1')
    });
  }
  if (needsM1) {
    tips.push({
      title: "Mejora en Comprensión",
      desc: "Vuelve al módulo de Comprensión y revisa cómo identificar el cateto opuesto y adyacente según el ángulo. Es la base de todo.",
      icon: <LectorMatIcon name="reading" size={22} className="text-blue-600" />,
      action: () => setScreen('m1')
    });
  }
  if (needsM2 || (!needsM1 && !needsM3 && overall > 20 && m2Pct < 100)) {
    tips.push({
      title: "Practica el Árbol de Decisión",
      desc: "Un error común es usar Seno cuando necesitas Coseno. La clave está en los datos que te dan en el Método paso a paso.",
      icon: <LectorMatIcon name="method" size={22} className="text-orange-600" />,
      action: () => setScreen('m2')
    });
  }
  if (needsM3 || (m3Pct < 100 && overall > 40)) {
    tips.push({
      title: "Enfrenta problemas sin pistas",
      desc: "Dirígete al Banco interactivo e intenta resolver un par de problemas sin mirar la fórmula. Te dará seguridad.",
      icon: <LectorMatIcon name="challenge" size={22} className="text-orange-600" />,
      action: () => setScreen('m3')
    });
  }

  // Fallback tip if doing great
  if (overall === 100) {
    tips.push({
      title: "¡Excelente desempeño!",
      desc: "Has dominado esta unidad. Estás listo para avanzar o ayudar a tus compañeros.",
      icon: <LectorMatIcon name="progress" size={22} className="text-emerald-600" />,
      action: null
    });
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 sm:p-8 rounded-[2rem] border border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <StatusBadge tone="blue" icon={<LectorMatIcon name="statistics" size={13} />}>Progreso</StatusBadge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mi Avance</h1>
          <p className="text-blue-600 font-medium">Análisis de tu desempeño en la Unidad 3</p>
        </div>
        <div className="absolute -top-12 right-12 w-36 h-36 bg-blue-50 rounded-[2.5rem] rotate-12" aria-hidden="true"></div>
        <LectorMatIcon name="progress" size={88} className="absolute right-12 top-1/2 -translate-y-1/2 text-blue-100" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Progress Overview Section */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-7 relative overflow-hidden flex flex-col items-center text-center">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6 w-full text-left">Progreso Global</h3>
            
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

          {/* Tips Section */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-7 flex-1">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Tips para mejorar
            </h3>
            
            <div className="space-y-4">
              {tips.map((tip, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-amber-100 shadow-sm flex items-center justify-center shrink-0 text-amber-500">
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-extrabold text-slate-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{tip.desc}</p>
                  </div>
                  {tip.action && (
                    <button 
                      onClick={tip.action}
                      className="px-4 py-2 mt-2 sm:mt-0 bg-white border border-slate-200 shadow-sm text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors shrink-0 whitespace-nowrap"
                    >
                      Ir a la lección &rarr;
                    </button>
                  )}
                </div>
              ))}
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

          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-3 transition-colors ${progress.m1Completed ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${progress.m1Completed ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}>
              <LectorMatIcon name="reading" size={30} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">Lector<br/>Experto</p>
              <div className="mt-2 flex justify-center">
                {progress.m1Completed ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
              </div>
            </div>
          </div>
          
          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-3 transition-colors ${progress.m2Completed ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${progress.m2Completed ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-slate-200 text-slate-400'}`}>
              <LectorMatIcon name="method" size={30} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">Estratega<br/>Avanzado</p>
              <div className="mt-2 flex justify-center">
                {progress.m2Completed ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-3 transition-colors ${progress.m3Completed ? 'bg-orange-50 border-orange-100 shadow-sm' : 'bg-slate-50 border-slate-100 grayscale opacity-70'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${progress.m3Completed ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-slate-200 text-slate-400'}`}>
              <LectorMatIcon name="challenge" size={30} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">Resolutor<br/>Rápido</p>
              <div className="mt-2 flex justify-center">
                {progress.m3Completed ? <CheckCircle2 className="w-5 h-5 text-orange-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
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
