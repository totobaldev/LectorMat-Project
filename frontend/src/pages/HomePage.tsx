import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFrontProps } from '../hooks/useFrontProps';
import { useProgressStore } from '../store/useProgressStore';

import {
  BookOpen, Compass, Zap,
  ArrowRight, ArrowLeft,
  Briefcase, Wrench, Check 
} from 'lucide-react';
import { LectorMatIcon } from '../components/brand/LectorMatIcon';
import { ActionButton } from '../components/ui/ActionButton';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useProgressStore((s) => s.isAuthenticated);
  const isTeacherUnlocked = useProgressStore((s) => s.isTeacherUnlocked);
  const { setScreen, progress, updateProgress } = useFrontProps();

  const [isChoosingCareer, setIsChoosingCareer] = useState(() => isAuthenticated && !progress.career);
  const [selectedSubject, setSelectedSubject] = useState<'Funciones y Progresiones' | 'Funciones y Geometría'>(
    progress.preSpecialty === 'mecanica' ? 'Funciones y Geometría' : 'Funciones y Progresiones'
  );

  const role = useProgressStore((s) => s.role);

  // ── Features + Access landing: shown for unauthenticated OR teacher role ────
  // Only authenticated STUDENTS bypass this to see their progress dashboard.
  if (!(isAuthenticated && role === 'student')) {
    return (
      <div className="min-h-full bg-slate-50 flex flex-col overflow-hidden">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-6 py-16 sm:py-20 gap-8 relative">
          <div className="absolute -top-20 left-[12%] h-44 w-44 rounded-[3rem] rotate-12 bg-blue-100/50" aria-hidden="true" />
          <div className="absolute top-16 right-[10%] h-20 w-20 rounded-[1.75rem] -rotate-12 bg-orange-100/70" aria-hidden="true" />

          <div className="space-y-4 max-w-2xl relative z-10">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-none">
              Bienvenido a{' '}
              <span className="text-blue-600">Lector</span><span className="text-orange-500">Mat</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Aprende matemática aplicada a tu carrera técnico-profesional con actividades interactivas, lectura comprensiva y ejercicios adaptativos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            {role === 'teacher' ? (
              /* Teacher already logged in */
              <ActionButton
                onClick={() => navigate('/teacher/courses')}
                variant="teacher"
                size="lg"
                leading={<LectorMatIcon name="teacher" size={20} />}
              >
                Ir a mi Panel
              </ActionButton>
            ) : (
              /* Unauthenticated: show both access buttons */
              <>
                <ActionButton
                  onClick={() => navigate('/login')}
                  variant="student"
                  size="lg"
                  leading={<LectorMatIcon name="reading" size={20} />}
                >
                  Ingresar como Estudiante
                </ActionButton>
                <ActionButton
                  onClick={() => navigate('/teacher/login')}
                  variant="teacher"
                  size="lg"
                  leading={<LectorMatIcon name="teacher" size={20} />}
                >
                  Acceso Docente
                </ActionButton>
              </>
            )}
          </div>
        </section>

        {/* Features grid */}
        <section className="px-6 pb-16 max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: 'reading' as const,
              surface: 'bg-blue-50 text-blue-600 ring-blue-100',
              title: 'Comprensión Lectora',
              desc: 'Módulos de lectura matemática contextualizada a tu especialidad vocacional.',
            },
            {
              icon: 'method' as const,
              surface: 'bg-orange-50 text-orange-600 ring-orange-100',
              title: 'Método Interactivo',
              desc: 'Árboles de decisión y actividades H5P que guían tu razonamiento paso a paso.',
            },
            {
              icon: 'challenge' as const,
              surface: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
              title: 'Banco de Ejercicios',
              desc: 'Problemas escalonados por nivel con retroalimentación inmediata y progreso visible.',
            },
          ].map(({ icon, surface, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ring-1 ring-inset ${surface}`}>
                <LectorMatIcon name={icon} size={30} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Platform News / Versions ──────────────────────────────── */}
        <section className="px-6 pb-16 max-w-5xl mx-auto w-full flex flex-col gap-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Comunidad Inacap</h2>
          
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden group">
            <div className="w-full md:w-2/5 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 border border-slate-200/60 shadow-sm relative">
              <img src="/inacap_news.jpg" alt="Inacap Lenguaje y Matemática" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-3 left-3">
                 <StatusBadge tone="blue" icon={<LectorMatIcon name="reading" size={12} />}>Noticia Oficial</StatusBadge>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-extrabold text-[10px] shadow-sm">IN</div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Sede Los Ángeles</p>
                  <p className="text-[10px] text-slate-500 font-medium">Hace 2 horas</p>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                ¡Nueva Plataforma de Nivelación: Lenguaje + Matemática!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                INACAP Sede Los Ángeles lanza oficialmente la primera iniciativa integrada que une la comprensión lectora con la resolución matemática. Se ha comprobado que el mayor obstáculo no está en los números, sino en la lectura del enunciado. ¡Prepárate para transformar tu rendimiento académico este 2026!
              </p>
              

            </div>
          </div>
        </section>
      </div>
    );
  }

  const handleConfirmSubject = () => {
    const specialty = selectedSubject === 'Funciones y Geometría' ? 'mecanica' : 'administracion';
    updateProgress({ 
      subject: selectedSubject,
      preSpecialty: specialty
    });
  };

  const m1Pct = progress.m1Completed ? 100 : Math.round((progress.m1SlotsPlaced / 3) * 55);
  const m2Pct = progress.m2Completed ? 100 : Math.min(85, progress.m2NodesVisited * 30);
  const m3Pct = Math.round((progress.m3CompletedLevels / 3) * 100);

  const u2m1Pct = progress.u2m1Completed ? 100 : Math.round(((progress.u2m1SlotsPlaced || 0) / 4) * 55);
  const u2m2Pct = progress.u2m2Completed ? 100 : Math.min(85, (progress.u2m2NodesVisited || 0) * 30);
  const u2m3Pct = Math.round(((progress.u2m3CompletedLevels || 0) / 3) * 100);

  const u3m1Pct = progress.u3m1Completed ? 100 : Math.round(((progress.u3m1SlotsPlaced || 0) / 4) * 55);
  const u3m2Pct = progress.u3m2Completed ? 100 : Math.min(85, (progress.u3m2NodesVisited || 0) * 30);
  const u3m3Pct = Math.round(((progress.u3m3CompletedLevels || 0) / 3) * 100);

  const u4m1Pct = progress.u4m1Completed ? 100 : Math.round(((progress.u4m1SlotsPlaced || 0) / 3) * 100);
  const u4m2Pct = progress.u4m2Completed ? 100 : Math.min(85, (progress.u4m2NodesVisited || 0) * 30);
  const u4m3Pct = Math.round(((progress.u4m3CompletedLevels || 0) / 3) * 100);

  const handleCareerSelect = (
    careerName: 'Ingeniería en Administración' | 'Administración' | 'Técnico en Mecánica y Electromovilidad Automotriz' | 'Ingeniería en Mecánica y Electromovilidad Automotriz', 
    specialtyName: 'mecanica' | 'administracion'
  ) => {
    setSelectedSubject(specialtyName === 'mecanica' ? 'Funciones y Geometría' : 'Funciones y Progresiones');
    updateProgress({ 
      career: careerName,
      preSpecialty: specialtyName,
      subject: null 
    });
    setIsChoosingCareer(false);
  };

  if (isChoosingCareer) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto flex flex-col gap-8 w-full pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsChoosingCareer(false)}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer text-slate-600 bg-white border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Configuración Inicial
            </span>
            <h1 className="text-3xl font-black text-slate-955 mt-1">Elegir Carrera</h1>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">¿Cuál es tu carrera?</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Al seleccionar tu carrera, el sistema adaptará de manera inteligente las lecturas, ejercicios, datos y problemas aplicados de las unidades a tu campo vocacional específico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* GRUPO ADMINISTRACIÓN */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-indigo-100/60">
                <Briefcase className="w-4 h-4" />
                Área de Administración y Finanzas
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* INGENIERÍA EN ADMINISTRACIÓN */}
                <button
                  onClick={() => handleCareerSelect('Ingeniería en Administración', 'administracion')}
                  className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-2 cursor-pointer ${
                    progress.career === 'Ingeniería en Administración'
                      ? 'bg-indigo-50/70 border-indigo-500 ring-4 ring-indigo-500/10'
                      : 'bg-slate-50/50 border-slate-200/80 hover:border-indigo-300 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start w-full gap-2">
                    <span className="font-extrabold text-slate-900 text-base leading-tight">Ingeniería en Administración</span>
                    {progress.career === 'Ingeniería en Administración' ? (
                      <span className="bg-indigo-600 text-white p-1 rounded-full shrink-0"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0 bg-white"></div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Planificación estratégica, optimización de recursos, control financiero avanzado y dirección estratégica de negocios.
                  </p>
                </button>

                {/* ADMINISTRACIÓN */}
                <button
                  onClick={() => handleCareerSelect('Administración', 'administracion')}
                  className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-2 cursor-pointer ${
                    progress.career === 'Administración'
                      ? 'bg-indigo-50/70 border-indigo-500 ring-4 ring-indigo-500/10'
                      : 'bg-slate-50/50 border-slate-200/80 hover:border-indigo-300 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start w-full gap-2">
                    <span className="font-extrabold text-slate-900 text-base leading-tight">Administración</span>
                    {progress.career === 'Administración' ? (
                      <span className="bg-indigo-600 text-white p-1 rounded-full shrink-0"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0 bg-white"></div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Gestión operativa de pymes, control administrativo, contabilidad básica, recursos humanos y marketing estratégico.
                  </p>
                </button>
              </div>
            </div>

            {/* GRUPO MECÁNICA */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-emerald-100/60">
                <Wrench className="w-4 h-4" />
                Área Mecánica y Electromovilidad
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* TÉCNICO EN MECÁNICA */}
                <button
                  onClick={() => handleCareerSelect('Técnico en Mecánica y Electromovilidad Automotriz', 'mecanica')}
                  className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-2 cursor-pointer ${
                    progress.career === 'Técnico en Mecánica y Electromovilidad Automotriz'
                      ? 'bg-emerald-50/70 border-emerald-500 ring-4 ring-emerald-500/10'
                      : 'bg-slate-50/50 border-slate-200/80 hover:border-emerald-300 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start w-full gap-2">
                    <span className="font-extrabold text-slate-900 text-base leading-tight">Técnico en Mecánica y Electromovilidad Automotriz</span>
                    {progress.career === 'Técnico en Mecánica y Electromovilidad Automotriz' ? (
                      <span className="bg-emerald-600 text-white p-1 rounded-full shrink-0"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0 bg-white"></div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Diagnóstico computarizado, mantenimiento programado, sistemas de transmisión, frenos convencionales, híbridos y eléctricos.
                  </p>
                </button>

                {/* INGENIERÍA EN MECÁNICA */}
                <button
                  onClick={() => handleCareerSelect('Ingeniería en Mecánica y Electromovilidad Automotriz', 'mecanica')}
                  className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-2 cursor-pointer ${
                    progress.career === 'Ingeniería en Mecánica y Electromovilidad Automotriz'
                      ? 'bg-emerald-50/70 border-emerald-500 ring-4 ring-emerald-500/10'
                      : 'bg-slate-50/50 border-slate-200/80 hover:border-emerald-300 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start w-full gap-2">
                    <span className="font-extrabold text-slate-900 text-base leading-tight">Ingeniería en Mecánica y Electromovilidad Automotriz</span>
                    {progress.career === 'Ingeniería en Mecánica y Electromovilidad Automotriz' ? (
                      <span className="bg-emerald-600 text-white p-1 rounded-full shrink-0"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0 bg-white"></div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Diseño técnico avanzado, conversión de motores, análisis de eficiencia termodinámica y gestión de proyectos de electromovilidad.
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-100 gap-4">
            <span className="text-xs text-slate-400 font-medium">
              * Puedes cambiar esta selección en cualquier momento desde el inicio.
            </span>
            <button
              onClick={() => setIsChoosingCareer(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-none text-sm w-full sm:w-auto"
            >
              Listo, Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (progress.career && !progress.subject) {
    const isMecanica = progress.preSpecialty === 'mecanica';
    
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto flex flex-col gap-8 w-full pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              updateProgress({ career: null, preSpecialty: null, subject: null });
              setIsChoosingCareer(true);
            }}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer text-slate-600 bg-white border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Paso 2 de 2
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-1">Seleccionar Asignatura</h1>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">Selecciona tu Asignatura</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Basado en tu carrera (<strong className="text-slate-800 font-extrabold">{progress.career}</strong>), hemos pre-seleccionado la asignatura recomendada. Puedes confirmar la recomendación o seleccionar otra asignatura de la lista para inscribirte:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* CARD 1: FUNCIONES Y PROGRESIONES */}
            <button
              onClick={() => setSelectedSubject('Funciones y Progresiones')}
              className={`text-left p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative flex flex-col gap-5 h-full cursor-pointer bg-transparent ${
                selectedSubject === 'Funciones y Progresiones'
                  ? 'border-indigo-500 bg-indigo-50/10 ring-4 ring-indigo-500/10 shadow-md'
                  : 'border-slate-200/80 bg-slate-50/20 hover:border-indigo-300 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start w-full gap-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedSubject === 'Funciones y Progresiones' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  <BookOpen className="w-7 h-7" />
                </div>
                
                <div className="flex flex-col items-end gap-1.5">
                  {!isMecanica && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-sm">
                      Sugerida para tu área
                    </span>
                  )}
                  {selectedSubject === 'Funciones y Progresiones' && (
                    <span className="bg-indigo-600 text-white p-1 rounded-full shrink-0"><Check className="w-4 h-4" /></span>
                  )}
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Funciones y Progresiones</h3>
                  <p className="text-xs text-indigo-600 font-bold uppercase mt-1">
                    Área de Administración y Finanzas
                  </p>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Desarrolla modelos de funciones reales y progresiones aritméticas y geométricas para resolver problemas aplicados de cálculo financiero, depreciación, crecimiento de ventas e interés compuesto.
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100/80">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Unidades del Programa:</h4>
                  <ul className="text-xs text-slate-600 font-semibold space-y-1 list-inside list-disc">
                    <li>Unidad 1: Funciones Polinómicas</li>
                    <li>Unidad 2: Función Exponencial y Logarítmica</li>
                    <li>Unidad 3: Progresión Aritmética y Geométrica</li>
                    <li>Unidad 4: Aplicaciones para las Finanzas</li>
                  </ul>
                </div>
              </div>
            </button>

            {/* CARD 2: FUNCIONES Y GEOMETRÍA */}
            <button
              onClick={() => setSelectedSubject('Funciones y Geometría')}
              className={`text-left p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative flex flex-col gap-5 h-full cursor-pointer bg-transparent ${
                selectedSubject === 'Funciones y Geometría'
                  ? 'border-emerald-500 bg-emerald-50/10 ring-4 ring-emerald-500/10 shadow-md'
                  : 'border-slate-200/80 bg-slate-50/20 hover:border-emerald-300 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start w-full gap-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedSubject === 'Funciones y Geometría' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <BookOpen className="w-7 h-7" />
                </div>
                
                <div className="flex flex-col items-end gap-1.5">
                  {isMecanica && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                      Sugerida para tu área
                    </span>
                  )}
                  {selectedSubject === 'Funciones y Geometría' && (
                    <span className="bg-emerald-600 text-white p-1 rounded-full shrink-0"><Check className="w-4 h-4" /></span>
                  )}
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Funciones y Geometría</h3>
                  <p className="text-xs text-emerald-600 font-bold uppercase mt-1">
                    Área Mecánica y Electromovilidad
                  </p>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Estudia relaciones funcionales con nociones de geometría aplicada, vectores y trigonometría, modelando torque, frenado y conversión energética en vehículos híbridos y eléctricos.
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100/80">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Unidades del Programa:</h4>
                  <ul className="text-xs text-slate-600 font-semibold space-y-1 list-inside list-disc">
                    <li>Unidad 1: Funciones Polinómicas</li>
                    <li>Unidad 2: Funciones Exponenciales</li>
                    <li>Unidad 3: Trigonometría</li>
                  </ul>
                </div>
              </div>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-100 gap-4">
            <button
              onClick={() => {
                updateProgress({ career: null, preSpecialty: null, subject: null });
                setIsChoosingCareer(true);
              }}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 underline cursor-pointer bg-transparent border-none p-0"
            >
              Cambiar selección de carrera
            </button>
            
            <button
              onClick={handleConfirmSubject}
              className={`font-extrabold px-8 py-3.5 rounded-2xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-none text-sm w-full sm:w-auto text-white ${
                selectedSubject === 'Funciones y Geometría' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Confirmar e Inscribir {selectedSubject}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-10 w-full pb-16">
      
      {/* HEADER DE BIENVENIDA Y CARRERA */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] gap-6 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10 flex-1">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none mt-2">¡Bienvenido a LectorMat!</h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium mt-3 leading-relaxed">
            LectorMat es una plataforma interactiva diseñada para ayudarte a comprender mejor los enunciados de los problemas matemáticos. Muchas veces el error no está en el cálculo, sino en no entender bien qué te está pidiendo el problema. Por eso, LectorMat te guía paso a paso en la lectura comprensiva de cada enunciado, antes de que llegues a la parte del cálculo.
          </p>
        </div>

        {/* Bloque Elegir Carrera (Only visible if already configured and logged in) */}
        {(isAuthenticated || isTeacherUnlocked) && progress.career && (
          <div className="relative z-10 flex items-center gap-4 p-4 sm:p-5 min-w-[280px] md:min-w-[340px] shrink-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-blue-600 bg-transparent">
              <LectorMatIcon name="career" size={25} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tu Carrera Seleccionada</p>
              <p className="text-sm font-extrabold text-slate-800 truncate leading-snug">{progress.career}</p>
              <button
                onClick={() => {
                  if (!isAuthenticated && !isTeacherUnlocked) {
                    navigate('/login');
                  } else {
                    setIsChoosingCareer(true);
                  }
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 underline mt-1 block cursor-pointer bg-transparent border-none p-0"
              >
                Cambiar carrera
              </button>
            </div>
          </div>
        )}
        <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-60 transform translate-x-1/4 -translate-y-1/4"></div>
      </section>

      {/* SECCIÓN MÓDULO PREVIO: DIAGNÓSTICO Y COMPRENSIÓN LECTORA */}
      {(isAuthenticated || isTeacherUnlocked) && progress.subject ? (
        <>
          <section className="flex flex-col gap-6">
            <div className="bg-blue-600 p-6 sm:p-8 rounded-[2rem] border border-blue-500 shadow-[0_18px_40px_-24px_rgba(37,99,235,0.9)] relative overflow-hidden text-white">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <StatusBadge tone="amber" icon={<LectorMatIcon name="progress" size={13} />}>
                      Recomendado para comenzar
                    </StatusBadge>
                    <span className="text-[10px] font-black text-blue-50 bg-blue-950/40 px-3 py-1 rounded-full uppercase tracking-wider ring-1 ring-inset ring-white/15">
                      Lectura Avanzada
                    </span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Nivelación de Comprensión LectorMat</h1>
                  <p className="text-blue-100 text-sm leading-relaxed font-medium">
                    Desarrolla tus habilidades de prelectura, lectura activa y traducción a modelos conceptuales aplicados a tu especialidad (Administración o Área Mecánica). ¡Crucial para evitar errores en las unidades matemáticas!
                  </p>
                </div>
                
                <ActionButton
                  onClick={() => setScreen('pre_m1')}
                  variant="secondary"
                  size="lg"
                  className="shrink-0 self-start md:self-auto"
                  leading={<LectorMatIcon name="reading" size={21} className="text-blue-600" />}
                  trailing={<ArrowRight className="w-5 h-5 text-blue-600" />}
                >
                  {progress.preCompleted ? 'Repetir Diagnóstico' : 'Iniciar Módulo Comprensión Lectora Aplicada'}
                </ActionButton>
              </div>
              
              <div className="absolute -top-12 right-8 w-40 h-40 rounded-[2.5rem] rotate-12 bg-white/10" aria-hidden="true"></div>
              <div className="absolute -bottom-10 right-52 w-24 h-24 rounded-full bg-orange-400/35" aria-hidden="true"></div>
            </div>
          </section>

          {/* CONTENEDOR DE LA ASIGNATURA SELECCIONADA */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] space-y-10 relative overflow-hidden">
            
            {/* Banner de Asignatura y Carrera */}
            <div className="p-6 sm:p-8 rounded-3xl text-white relative overflow-hidden flex flex-col lg:flex-row lg:items-center gap-6 bg-slate-950 border border-slate-800">
              <div className="flex-1 relative z-10 flex flex-col sm:flex-row gap-4">
                {/* Caja de Carrera */}
                <div className="flex-1 space-y-1 p-5 rounded-2xl bg-transparent">
                  <span className="text-[10px] font-black text-white/70 uppercase tracking-wider">
                    Carrera Seleccionada
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight leading-tight">{progress.career}</h3>
                </div>
                
                {/* Caja de Asignatura */}
                <div className="flex-1 space-y-1 p-5 rounded-2xl bg-transparent">
                  <span className="text-[10px] font-black text-white/70 uppercase tracking-wider">
                    Asignatura Inscrita
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight leading-tight">{progress.subject}</h3>
                </div>
              </div>
              
              <div className="relative z-10 shrink-0 self-start lg:self-center">
                <button
                  onClick={() => {
                    setIsChoosingCareer(true);
                  }}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Modificar Selección
                </button>
              </div>
              <div className="absolute -top-10 right-8 w-36 h-36 bg-blue-500/20 rounded-[2.5rem] rotate-12" aria-hidden="true"></div>
              <div className="absolute bottom-5 right-48 w-12 h-12 bg-orange-500/40 rounded-2xl -rotate-12" aria-hidden="true"></div>
            </div>

          </div>
        </>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-12 text-center max-w-2xl mx-auto my-6 space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-inset ring-blue-100">
            <LectorMatIcon name="career" size={34} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Comienza tu Ruta de Aprendizaje</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Por favor, selecciona tu carrera profesional para acceder a tu asignatura.
            </p>
          </div>
          <ActionButton
            onClick={() => {
              if (!isAuthenticated && !isTeacherUnlocked) {
                navigate('/login');
              } else {
                setIsChoosingCareer(true);
              }
            }}
            variant="student"
            size="lg"
            leading={<LectorMatIcon name="career" size={20} />}
            className="mx-auto"
          >
            Ingresar a mi Carrera
          </ActionButton>
        </div>
      )}
    </div>
  );
}
