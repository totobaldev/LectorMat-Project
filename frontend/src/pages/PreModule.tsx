import React, { useState } from 'react';
import { useFrontProps } from '../hooks/useFrontProps';

import { 
  BookOpen, Compass, Zap, CheckCircle2, ArrowRight, ArrowLeft, 
  Award, Star, Hammer, Briefcase, HelpCircle, BookOpenCheck, 
  ChevronRight, Check, X, ShieldAlert, Sparkles, AlertCircle
} from 'lucide-react';
import { EXERCISES_ADMIN, EXERCISES_MECANICA, type Exercise } from '../data/preModuleExercises';

type Specialty = 'mecanica' | 'administracion';

export default function PreModule() {
  const { setScreen, progress, updateProgress, isTeacher, setIsTeacher, currentScreen } = useFrontProps();

  const [specialty, setSpecialty] = useState<Specialty | null>(
    (progress.preSpecialty as Specialty) || null
  );

  // Current active sub-phase: 'grammar' | 'extraction' | 'specialty'
  const [activeCategory, setActiveCategory] = useState<'grammar' | 'extraction' | 'specialty'>('grammar');

  // Interactive selected answers index (key is exercise.id, value is chosen option index)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  // Confirmed answers (once they press "Verify", we lock the answer and show feedback)
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});

  // Active individual exercise index (0 to 9) within the active category
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const handleSelectSpecialty = (spec: Specialty) => {
    setSpecialty(spec);
    updateProgress({ preSpecialty: spec });
    setAnswers({});
    setConfirmed({});
    setActiveCategory('grammar');
    setCurrentQuestionIndex(0);
  };

  const getExercisesOfActiveCategory = (): Exercise[] => {
    const fullList = specialty === 'mecanica' ? EXERCISES_MECANICA : EXERCISES_ADMIN;
    return fullList.filter(ex => ex.category === activeCategory);
  };

  const exercises = getExercisesOfActiveCategory();
  const currentExercise = exercises[currentQuestionIndex];

  const handleOptionSelect = (optIdx: number) => {
    if (confirmed[currentExercise.id]) return; // Already locked
    setAnswers(prev => ({
      ...prev,
      [currentExercise.id]: optIdx
    }));
  };

  const handleVerify = () => {
    setConfirmed(prev => ({
      ...prev,
      [currentExercise.id]: true
    }));
  };

  const isCurrentCorrect = answers[currentExercise?.id] === currentExercise?.correctIdx;

  // Calculamos el progreso total sobre los 30 ejercicios
  const totalExercisesList = specialty === 'mecanica' ? EXERCISES_MECANICA : EXERCISES_ADMIN;
  
  const correctCount = totalExercisesList.filter(ex => {
    return confirmed[ex.id] && answers[ex.id] === ex.correctIdx;
  }).length;

  const answeredCount = totalExercisesList.filter(ex => {
    return confirmed[ex.id];
  }).length;

  const handleNext = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Avanzar de categoría si es posible
      if (activeCategory === 'grammar') {
        setActiveCategory('extraction');
        setCurrentQuestionIndex(0);
      } else if (activeCategory === 'extraction') {
        setActiveCategory('specialty');
        setCurrentQuestionIndex(0);
      } else {
        // Completó todo el módulo previo!
        updateProgress({ 
          preCompleted: true,
          preScore: Math.round((correctCount / 30) * 100)
        });
      }
    }
  };

  const handleResetModule = () => {
    setAnswers({});
    setConfirmed({});
    setActiveCategory('grammar');
    setCurrentQuestionIndex(0);
    updateProgress({ preCompleted: false, preScore: 0 });
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-800">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-700 p-6 sm:p-8 rounded-[2rem] border border-amber-200 shadow-md relative overflow-hidden text-white">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Módulo de Nivelación
            </span>
            <span className="text-[10px] font-black text-white bg-indigo-900/40 px-3 py-1 rounded-full uppercase tracking-wider">
              Gramática y Comprensión LectorMat
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Comprensión Lectora Aplicada</h1>
          <p className="text-orange-100 text-sm max-w-3xl leading-relaxed font-medium">
            Domina desde las estructuras de gramática lógica y conectores matemáticos, pasando por la extracción de variables numéricas, hasta las situaciones reales del área de especialidad seleccionada. ¡Completa los 30 ejercicios guiados!
          </p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-30 transform translate-x-1/4 -translate-y-1/4"></div>
      </header>

      {/* SELECTOR DE ESPECIALIDAD */}
      {!specialty ? (
        <div className="flex flex-col gap-8 mt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Selecciona tu Ruta de Especialidad</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Elige tu área técnica para personalizar las preguntas avanzadas y los textos de aplicación a tus problemáticas vocacionales reales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            {/* ADMINISTRACIÓN */}
            <button
              onClick={() => handleSelectSpecialty('administracion')}
              className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm text-left flex flex-col gap-5 hover:border-violet-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer bg-transparent"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 shadow-sm group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="space-y-2 text-left">
                <span className="text-[9px] font-black text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Contabilidad y Gestión
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-violet-600 transition-colors">
                  Administración y Finanzas
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Contiene 30 ejercicios organizados: conectores, tasas porcentuales de depreciación lineal y exponencial, amortizaciones, costos fijos/variables y márgenes comerciales.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-violet-600 group-hover:translate-x-1.5 transition-transform mt-2">
                <span>Comenzar Ruta Administración</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* MECÁNICA */}
            <button
              onClick={() => handleSelectSpecialty('mecanica')}
              className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm text-left flex flex-col gap-5 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer bg-transparent"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                <Hammer className="w-7 h-7" />
              </div>
              <div className="space-y-2 text-left">
                <span className="text-[9px] font-black text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Mantenimiento y Automatización
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Área Mecánica e Industrial
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Contiene 30 ejercicios organizados: lectura de planos, relaciones de transmisión de piñón/corona, descomposición de fuerzas trigonométricas y oscilaciones de pistón.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1.5 transition-transform mt-2">
                <span>Comenzar Ruta Mecánica</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* PANEL DE EJERCICIOS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
          
          {/* COLUMNA IZQUIERDA (8 COLS): CONTROL DE NIVELACIÓN */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
            
            {/* TABS DE LAS FASES DEL MÓDULO */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-1">
              {[
                { id: 'grammar', label: '1. Gramática Simple', count: '10 ej.' },
                { id: 'extraction', label: '2. Extracción de Datos', count: '10 ej.' },
                { id: 'specialty', label: '3. Especialidad', count: '10 ej.' }
              ].map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCategory(tab.id as any);
                      setCurrentQuestionIndex(0);
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer border-none ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${isActive ? 'bg-indigo-500 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* MARCADOR DE PREGUNTA Y BARRA DE PROGRESO INTERNA */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center">
                    {currentQuestionIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      {activeCategory === 'grammar' && 'Comprensión Gramatical y Conectores'}
                      {activeCategory === 'extraction' && 'Extracción de Variables de Texto'}
                      {activeCategory === 'specialty' && `Aplicación a ${specialty === 'mecanica' ? 'Mecánica' : 'Administración'}`}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">Ejercicio {currentQuestionIndex + 1} de 10 de esta fase</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-slate-100 text-slate-700 px-3 py-1 rounded-full border">
                    Rendimiento Total: {correctCount}/30 correctas
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / 30) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* TARJETA DEL EJERCICIO ACTUAL */}
            {currentExercise ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6 text-left">
                
                {/* Contexto si existe */}
                {currentExercise.context && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 text-sm leading-relaxed text-slate-600 font-medium relative">
                    <span className="absolute top-3 right-3 text-[9px] font-black uppercase text-slate-300 tracking-wider">Lectura de enunciado</span>
                    <p className="pr-16">{currentExercise.context}</p>
                  </div>
                )}

                {/* Pregunta */}
                <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {currentExercise.question}
                </h4>

                {/* Opciones */}
                <div className="grid grid-cols-1 gap-3">
                  {currentExercise.options.map((opt, oIdx) => {
                    const isSelected = answers[currentExercise.id] === oIdx;
                    const isLocked = confirmed[currentExercise.id];
                    const isCorrectOption = oIdx === currentExercise.correctIdx;

                    let btnStyle = 'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/10 text-slate-700';
                    if (isSelected) {
                      btnStyle = 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-600/10';
                    }
                    if (isLocked) {
                      if (isCorrectOption) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/10';
                      } else if (isSelected) {
                        btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/10';
                      } else {
                        btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isLocked}
                        onClick={() => handleOptionSelect(oIdx)}
                        className={`w-full text-left p-4 rounded-2xl border text-sm font-semibold transition-all flex items-start gap-3 cursor-pointer bg-white ${btnStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Banner de retroalimentación inmediata */}
                {confirmed[currentExercise.id] && (
                  <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                    isCurrentCorrect 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                      : 'bg-rose-50 border-rose-100 text-rose-950'
                  }`}>
                    {isCurrentCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-extrabold text-sm">{isCurrentCorrect ? '¡Excelente análisis lector!' : 'Respuesta errónea'}</p>
                      <p className="text-xs leading-relaxed opacity-90">{currentExercise.explanation}</p>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex justify-between items-center gap-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (currentQuestionIndex > 0) {
                        setCurrentQuestionIndex(prev => prev - 1);
                      }
                    }}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-1 text-slate-500 font-extrabold text-xs disabled:opacity-30 cursor-pointer bg-transparent border-none"
                  >
                    <ArrowLeft className="w-4 h-4" /> Pregunta anterior
                  </button>

                  <div className="flex items-center gap-3">
                    {!confirmed[currentExercise.id] ? (
                      <button
                        onClick={handleVerify}
                        disabled={answers[currentExercise.id] === undefined}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl text-xs transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
                      >
                        Comprobar Análisis
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-6 rounded-xl text-xs transition-all shadow-md flex items-center gap-1 hover:-translate-y-0.5 cursor-pointer border-none"
                      >
                        {currentQuestionIndex < exercises.length - 1 ? 'Siguiente Pregunta' : 'Siguiente Fase'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-black text-slate-900">¡Fase Completada!</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                  Has resuelto todas las preguntas de este nivel. Selecciona otra pestaña en la barra de arriba o haz clic para finalizar.
                </p>
              </div>
            )}

            {/* COMPLETO TODO */}
            {progress.preCompleted && (
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-8 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-300 animate-bounce shrink-0" />
                    <span className="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full tracking-widest">
                      Diagnóstico Completado
                    </span>
                  </div>
                  <h3 className="text-2xl font-black">¡Felicidades, Nivelación Superada con Éxito!</h3>
                  <p className="text-emerald-100 text-xs leading-relaxed max-w-2xl font-medium">
                    Has completado tus 30 ejercicios obligatorios de Comprensión LectorMat en la especialidad de <span className="font-extrabold underline">{specialty === 'mecanica' ? 'Área Mecánica' : 'Administración y Finanzas'}</span>. Ahora estás listo para evitar los clásicos errores de traducción verbal en los desafíos prácticos de las Unidades 1, 2 y 3.
                  </p>
                </div>
                <div className="flex gap-3 shrink-0 relative z-10">
                  <button
                    onClick={handleResetModule}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl border border-white/20 text-xs transition-all cursor-pointer"
                  >
                    Repetir Desafío
                  </button>
                  <button
                    onClick={() => setScreen('home')}
                    className="bg-white hover:bg-slate-100 text-indigo-950 font-black px-6 py-3 rounded-xl text-xs shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-none"
                  >
                    Ir al Inicio del Curso
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* COLUMNA DERECHA (4 COLS): MAPA DE PROGRESO DE LOS 30 EJERCICIOS */}
          <div className="col-span-1 lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6 text-left">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Mapa de los 30 Ejercicios</h3>
              <p className="text-xs text-slate-400 mt-0.5">Comprobación del estado del diagnóstico</p>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Grupo 1: Gramatical */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fase 1: Gramática (1-10)</span>
              <div className="grid grid-cols-5 gap-2">
                {totalExercisesList.slice(0, 10).map((ex, idx) => {
                  const isAns = answers[ex.id] !== undefined;
                  const isConf = confirmed[ex.id];
                  const isCorr = answers[ex.id] === ex.correctIdx;

                  let dotStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                  if (isAns) dotStyle = 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold';
                  if (isConf) {
                    dotStyle = isCorr 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'bg-rose-500 border-rose-500 text-white';
                  }

                  const isActive = activeCategory === 'grammar' && currentQuestionIndex === idx;

                  return (
                    <button
                      key={ex.id}
                      onClick={() => {
                        setActiveCategory('grammar');
                        setCurrentQuestionIndex(idx);
                      }}
                      className={`h-9 rounded-xl border flex items-center justify-center text-xs transition-all cursor-pointer font-bold ${dotStyle} ${
                        isActive ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grupo 2: Extracción */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fase 2: Datos (11-20)</span>
              <div className="grid grid-cols-5 gap-2">
                {totalExercisesList.slice(10, 20).map((ex, idx) => {
                  const isAns = answers[ex.id] !== undefined;
                  const isConf = confirmed[ex.id];
                  const isCorr = answers[ex.id] === ex.correctIdx;

                  let dotStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                  if (isAns) dotStyle = 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold';
                  if (isConf) {
                    dotStyle = isCorr 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'bg-rose-500 border-rose-500 text-white';
                  }

                  const isActive = activeCategory === 'extraction' && currentQuestionIndex === idx;

                  return (
                    <button
                      key={ex.id}
                      onClick={() => {
                        setActiveCategory('extraction');
                        setCurrentQuestionIndex(idx);
                      }}
                      className={`h-9 rounded-xl border flex items-center justify-center text-xs transition-all cursor-pointer font-bold ${dotStyle} ${
                        isActive ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105' : ''
                      }`}
                    >
                      {idx + 11}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grupo 3: Especialidad */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fase 3: Especialidad (21-30)</span>
              <div className="grid grid-cols-5 gap-2">
                {totalExercisesList.slice(20, 30).map((ex, idx) => {
                  const isAns = answers[ex.id] !== undefined;
                  const isConf = confirmed[ex.id];
                  const isCorr = answers[ex.id] === ex.correctIdx;

                  let dotStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                  if (isAns) dotStyle = 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold';
                  if (isConf) {
                    dotStyle = isCorr 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'bg-rose-500 border-rose-500 text-white';
                  }

                  const isActive = activeCategory === 'specialty' && currentQuestionIndex === idx;

                  return (
                    <button
                      key={ex.id}
                      onClick={() => {
                        setActiveCategory('specialty');
                        setCurrentQuestionIndex(idx);
                      }}
                      className={`h-9 rounded-xl border flex items-center justify-center text-xs transition-all cursor-pointer font-bold ${dotStyle} ${
                        isActive ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105' : ''
                      }`}
                    >
                      {idx + 21}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Leyenda */}
            <div className="space-y-2 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500"></div>
                <span>Análisis Correcto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-rose-500"></div>
                <span>Análisis Incorrecto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-indigo-50 border border-indigo-200"></div>
                <span>Seleccionado (Pendiente comprobación)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSpecialty(null);
                updateProgress({ preSpecialty: null, career: null });
                setAnswers({});
                setConfirmed({});
              }}
              className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-2xl text-xs transition-all cursor-pointer border-none"
            >
              Cambiar de Especialidad
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
