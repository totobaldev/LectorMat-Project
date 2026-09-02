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
          <StatusBadge tone="blue" icon={<LectorMatIcon name="math" size={13} />} className="relative z-10">
            Plataforma de Nivelación Matemática
          </StatusBadge>
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
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Novedades y Versiones</h2>
          {[
            {
              version: 'v1.3.0',
              date: 'Agosto 2026',
              badge: 'Nuevo',
              tone: 'blue' as const,
              title: 'Módulo H5P para Docentes',
              desc: 'Los docentes ahora pueden subir actividades interactivas H5P directamente desde el Panel Docente, organizarlas en secciones y gestionar un banco de contenido centralizado.',
            },
            {
              version: 'v1.2.0',
              date: 'Julio 2026',
              badge: 'Mejora',
              tone: 'emerald' as const,
              title: 'Continuidad de Aprendizaje',
              desc: 'El sidebar del estudiante ahora muestra una ProgressCard inteligente que detecta automáticamente en qué módulo se quedó el estudiante y permite reanudar con un clic.',
            },
            {
              version: 'v1.1.0',
              date: 'Junio 2026',
              badge: 'Funcionalidad',
              tone: 'orange' as const,
              title: 'Panel Docente con Búsqueda de Cursos',
              desc: 'Panel dedicado para docentes con búsqueda instantánea por código de asignatura (MAT101, MEC205…), agrupación por área y acceso protegido por credenciales.',
            },
          ].map((item) => (
            <div
              key={item.version}
              className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-start gap-5"
            >
              <div className="shrink-0 text-center">
                <StatusBadge tone={item.tone} className="mb-1">{item.badge}</StatusBadge>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.version}</p>
                <p className="text-[10px] text-slate-400 font-medium">{item.date}</p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
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
          <StatusBadge tone="blue" icon={<LectorMatIcon name="reading" size={13} />}>
            Plataforma Transforma 2026
          </StatusBadge>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none mt-2">¡Bienvenido a LectorMat!</h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium mt-3 leading-relaxed">
            LectorMat es una plataforma interactiva diseñada para ayudarte a comprender mejor los enunciados de los problemas matemáticos. Muchas veces el error no está en el cálculo, sino en no entender bien qué te está pidiendo el problema. Por eso, LectorMat te guía paso a paso en la lectura comprensiva de cada enunciado, antes de que llegues a la parte del cálculo.
          </p>
        </div>

        {/* Bloque Elegir Carrera (Only visible if already configured and logged in) */}
        {(isAuthenticated || isTeacherUnlocked) && progress.career && (
          <div className="relative z-10 flex items-center gap-4 p-4 sm:p-5 rounded-2xl border min-w-[280px] md:min-w-[340px] shrink-0 bg-blue-600 border-blue-700 text-white shadow-[0_14px_30px_-18px_rgba(37,99,235,0.9)]">
            <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
              <LectorMatIcon name="career" size={25} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white/80 uppercase tracking-wider">Tu Carrera Seleccionada</p>
              <p className="text-sm font-extrabold text-white truncate leading-snug">{progress.career}</p>
              <button
                onClick={() => {
                  if (!isAuthenticated && !isTeacherUnlocked) {
                    navigate('/login');
                  } else {
                    setIsChoosingCareer(true);
                  }
                }}
                className="text-xs font-bold text-white hover:text-white/80 underline mt-1 block cursor-pointer bg-transparent border-none p-0"
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
                      Lectura Crítica
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
                <div className="flex-1 space-y-1 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <span className="text-[10px] font-black text-white/70 uppercase tracking-wider">
                    Carrera Seleccionada
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight leading-tight">{progress.career}</h3>
                </div>
                
                {/* Caja de Asignatura */}
                <div className="flex-1 space-y-1 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-sm">
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

            <div className="space-y-10">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Unidades de Aprendizaje</h3>
              </div>

              {/* UNIT 1 */}
              <section className="flex flex-col gap-6">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-indigo-50 to-white p-6 sm:p-8 rounded-[2rem] border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 space-y-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Unidad 1: Funciones Polinómicas</h1>
                    <p className="text-indigo-600 font-medium">Programa Transforma 2026</p>
                  </div>
                  <div className="flex items-center gap-4 relative z-10 mt-4 sm:mt-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-sm border border-indigo-200 text-xl">U1</div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
                  {/* M1 */}
                  <button onClick={() => setScreen('m1')} className="col-span-1 md:col-span-4 bg-indigo-50/50 rounded-[2rem] p-7 border border-indigo-100 hover:border-indigo-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center"><BookOpen className="w-7 h-7" /></div>
                      <span className="text-xs font-bold text-white bg-indigo-600 px-4 py-1.5 rounded-full shadow-sm">Básico</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Comprensión</h3>
                      <p className="text-sm text-slate-500 mt-2">Arrastra los datos a la función.</p>
                    </div>
                    <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{m1Pct}%</span></div><div className="w-full bg-indigo-100 h-2 rounded-full"><div className="bg-indigo-600 h-full rounded-full" style={{width: `${m1Pct}%`}}></div></div></div>
                  </button>

                  {/* M2 */}
                  <button onClick={() => setScreen('m2')} className="col-span-1 md:col-span-4 bg-emerald-50/50 rounded-[2rem] p-7 border border-emerald-100 hover:border-emerald-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><Compass className="w-7 h-7" /></div>
                      <span className="text-xs font-bold text-white bg-emerald-600 px-4 py-1.5 rounded-full shadow-sm">Intermedio</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Método</h3>
                      <p className="text-sm text-slate-500 mt-2">Árbol de decisión.</p>
                    </div>
                    <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{m2Pct}%</span></div><div className="w-full bg-emerald-100 h-2 rounded-full"><div className="bg-emerald-600 h-full rounded-full" style={{width: `${m2Pct}%`}}></div></div></div>
                  </button>

                  {/* M3 */}
                  <button onClick={() => setScreen('m3')} className="col-span-1 md:col-span-4 bg-orange-50/50 rounded-[2rem] p-7 border border-orange-100 hover:border-orange-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center"><Zap className="w-7 h-7" /></div>
                      <span className="text-xs font-bold text-white bg-orange-600 px-4 py-1.5 rounded-full shadow-sm">Avanzado</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Interactivo</h3>
                      <p className="text-sm text-slate-500 mt-2">Problemas escalonados.</p>
                    </div>
                    <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{m3Pct}%</span></div><div className="w-full bg-orange-100 h-2 rounded-full"><div className="bg-orange-600 h-full rounded-full" style={{width: `${m3Pct}%`}}></div></div></div>
                  </button>
                </div>
              </section>

              {/* UNIT 2 */}
              <section className="flex flex-col gap-6">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-violet-50 to-white p-6 sm:p-8 rounded-[2rem] border border-violet-100 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 space-y-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Unidad 2: Funciones Exponenciales</h1>
                    <p className="text-violet-600 font-medium">Programa Transforma 2026</p>
                  </div>
                  <div className="flex items-center gap-4 relative z-10 mt-4 sm:mt-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center font-black text-white shadow-sm border border-violet-200 text-xl">U2</div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
                  {/* U2M1 */}
                  <button onClick={() => setScreen('u2m1')} className="col-span-1 md:col-span-4 bg-violet-50/50 rounded-[2rem] p-7 border border-violet-100 hover:border-violet-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center"><BookOpen className="w-7 h-7" /></div>
                      <span className="text-xs font-bold text-white bg-violet-600 px-4 py-1.5 rounded-full shadow-sm">Básico</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Comprensión</h3>
                      <p className="text-sm text-slate-500 mt-2">Construye el modelo exponencial.</p>
                    </div>
                    <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{u2m1Pct}%</span></div><div className="w-full bg-violet-100 h-2 rounded-full"><div className="bg-violet-600 h-full rounded-full" style={{width: `${u2m1Pct}%`}}></div></div></div>
                  </button>

                  {/* U2M2 */}
                  <button onClick={() => setScreen('u2m2')} className="col-span-1 md:col-span-4 bg-cyan-50/50 rounded-[2rem] p-7 border border-cyan-100 hover:border-cyan-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center"><Compass className="w-7 h-7" /></div>
                      <span className="text-xs font-bold text-white bg-cyan-600 px-4 py-1.5 rounded-full shadow-sm">Intermedio</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Método</h3>
                      <p className="text-sm text-slate-500 mt-2">Clasificador Logarítmico/Exponencial.</p>
                    </div>
                    <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{u2m2Pct}%</span></div><div className="w-full bg-cyan-100 h-2 rounded-full"><div className="bg-cyan-600 h-full rounded-full" style={{width: `${u2m2Pct}%`}}></div></div></div>
                  </button>

                  {/* U2M3 */}
                  <button onClick={() => setScreen('u2m3')} className="col-span-1 md:col-span-4 bg-fuchsia-50/50 rounded-[2rem] p-7 border border-fuchsia-100 hover:border-fuchsia-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-fuchsia-100 text-fuchsia-600 rounded-2xl flex items-center justify-center"><Zap className="w-7 h-7" /></div>
                      <span className="text-xs font-bold text-white bg-fuchsia-600 px-4 py-1.5 rounded-full shadow-sm">Avanzado</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Interactivo</h3>
                      <p className="text-sm text-slate-500 mt-2">Resolución de problemas aplicados.</p>
                    </div>
                    <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{u2m3Pct}%</span></div><div className="w-full bg-fuchsia-100 h-2 rounded-full"><div className="bg-fuchsia-600 h-full rounded-full" style={{width: `${u2m3Pct}%`}}></div></div></div>
                  </button>
                </div>
              </section>

              {/* UNIT 3 */}
              <section className="flex flex-col gap-6">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-sky-50 to-white p-6 sm:p-8 rounded-[2rem] border border-sky-100 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 space-y-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {progress.preSpecialty === 'mecanica' ? 'Unidad 3: Trigonometría y Geometría' : 'Unidad 3: Progresiones y Sucesiones'}
                    </h1>
                    <p className="text-sky-600 font-medium">Programa Transforma 2026</p>
                  </div>
                  <div className="flex items-center gap-4 relative z-10 mt-4 sm:mt-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center font-black text-white shadow-sm border border-sky-200 text-xl">U3</div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
                  {/* U3M1 */}
                  <button onClick={() => setScreen('u3m1')} className="col-span-1 md:col-span-4 bg-sky-50/50 rounded-[2rem] p-7 border border-sky-100 hover:border-sky-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center"><BookOpen className="w-7 h-7" /></div>
                      <span className="text-xs font-bold text-white bg-sky-600 px-4 py-1.5 rounded-full shadow-sm">Básico</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Comprensión</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        {progress.preSpecialty === 'mecanica' ? 'Deduce las medidas y distancias.' : 'Deduce patrones numéricos y razones.'}
                      </p>
                    </div>
                    <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{u3m1Pct}%</span></div><div className="w-full bg-sky-100 h-2 rounded-full"><div className="bg-sky-600 h-full rounded-full" style={{width: `${u3m1Pct}%`}}></div></div></div>
                  </button>

                  {/* U3M2 */}
                  <button onClick={() => setScreen('u3m2')} className="col-span-1 md:col-span-4 bg-blue-50/50 rounded-[2rem] p-7 border border-blue-100 hover:border-blue-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Compass className="w-7 h-7" /></div>
                      <span className="text-xs font-bold text-white bg-blue-600 px-4 py-1.5 rounded-full shadow-sm">Intermedio</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Método</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        {progress.preSpecialty === 'mecanica' ? 'Clasificador de Teoremas y Funciones.' : 'Clasificador de Progresiones Aritméticas/Geométricas.'}
                      </p>
                    </div>
                    <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{u3m2Pct}%</span></div><div className="w-full bg-blue-100 h-2 rounded-full"><div className="bg-blue-600 h-full rounded-full" style={{width: `${u3m2Pct}%`}}></div></div></div>
                  </button>

                  {/* U3M3 */}
                  <button onClick={() => setScreen('u3m3')} className="col-span-1 md:col-span-4 bg-teal-50/50 rounded-[2rem] p-7 border border-teal-100 hover:border-teal-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center"><Zap className="w-7 h-7" /></div>
                      <span className="text-xs font-bold text-white bg-teal-600 px-4 py-1.5 rounded-full shadow-sm">Avanzado</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Interactivo</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        {progress.preSpecialty === 'mecanica' 
                          ? 'Resolución de problemas de Trigonometría aplicados.' 
                          : 'Resolución de problemas de Progresiones aplicados.'
                        }
                      </p>
                    </div>
                    <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{u3m3Pct}%</span></div><div className="w-full bg-teal-100 h-2 rounded-full"><div className="bg-teal-600 h-full rounded-full" style={{width: `${u3m3Pct}%`}}></div></div></div>
                  </button>
                </div>
              </section>

              {/* UNIT 4 (Only for Administration) */}
              {progress.preSpecialty === 'administracion' && (
                <section className="flex flex-col gap-6">
                  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-emerald-50 to-white p-6 sm:p-8 rounded-[2rem] border border-emerald-100 shadow-sm relative overflow-hidden">
                    <div className="relative z-10 space-y-1">
                      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Unidad 4: Aplicaciones para las Finanzas</h1>
                      <p className="text-emerald-600 font-medium">Programa Transforma 2026</p>
                    </div>
                    <div className="flex items-center gap-4 relative z-10 mt-4 sm:mt-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center font-black text-white shadow-sm border border-emerald-200 text-xl">U4</div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3"></div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
                    {/* U4M1 */}
                    <button onClick={() => setScreen('u4m1')} className="col-span-1 md:col-span-4 bg-emerald-50/50 rounded-[2rem] p-7 border border-emerald-100 hover:border-emerald-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                      <div className="flex items-center justify-between relative z-10">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><BookOpen className="w-7 h-7" /></div>
                        <span className="text-xs font-bold text-white bg-emerald-600 px-4 py-1.5 rounded-full shadow-sm">Básico</span>
                      </div>
                      <div className="relative z-10 mt-2">
                        <h3 className="text-xl font-extrabold text-slate-900">Comprensión</h3>
                        <p className="text-sm text-slate-500 mt-2">Identifica variables de valor futuro.</p>
                      </div>
                      <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{u4m1Pct}%</span></div><div className="w-full bg-emerald-100 h-2 rounded-full"><div className="bg-emerald-600 h-full rounded-full" style={{width: `${u4m1Pct}%`}}></div></div></div>
                    </button>

                    {/* U4M2 */}
                    <button onClick={() => setScreen('u4m2')} className="col-span-1 md:col-span-4 bg-teal-50/50 rounded-[2rem] p-7 border border-teal-100 hover:border-teal-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                      <div className="flex items-center justify-between relative z-10">
                        <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center"><Compass className="w-7 h-7" /></div>
                        <span className="text-xs font-bold text-white bg-teal-600 px-4 py-1.5 rounded-full shadow-sm">Intermedio</span>
                      </div>
                      <div className="relative z-10 mt-2">
                        <h3 className="text-xl font-extrabold text-slate-900">Método</h3>
                        <p className="text-sm text-slate-500 mt-2">Clasificador de Modelos Financieros.</p>
                      </div>
                      <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{u4m2Pct}%</span></div><div className="w-full bg-teal-100 h-2 rounded-full"><div className="bg-teal-600 h-full rounded-full" style={{width: `${u4m2Pct}%`}}></div></div></div>
                    </button>

                    {/* U4M3 */}
                    <button onClick={() => setScreen('u4m3')} className="col-span-1 md:col-span-4 bg-amber-50/50 rounded-[2rem] p-7 border border-amber-100 hover:border-amber-500 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden text-slate-800">
                      <div className="flex items-center justify-between relative z-10">
                        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center"><Zap className="w-7 h-7" /></div>
                        <span className="text-xs font-bold text-white bg-amber-600 px-4 py-1.5 rounded-full shadow-sm">Avanzado</span>
                      </div>
                      <div className="relative z-10 mt-2">
                        <h3 className="text-xl font-extrabold text-slate-900">Interactivo</h3>
                        <p className="text-sm text-slate-500 mt-2">Problemas de interés y anualidad.</p>
                      </div>
                      <div className="mt-auto pt-6"><div className="flex justify-between text-xs font-extrabold mb-2 uppercase text-slate-500"><span>Progreso</span><span>{u4m3Pct}%</span></div><div className="w-full bg-amber-100 h-2 rounded-full"><div className="bg-amber-600 h-full rounded-full" style={{width: `${u4m3Pct}%`}}></div></div></div>
                    </button>
                  </div>
                </section>
              )}
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
