import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Compass, Zap, CheckCircle2, ArrowRight, ArrowLeft,
  Award, Sparkles, AlertCircle, RotateCcw, FileText, ArrowLeftSquare, Check, X
} from 'lucide-react';
import type { ParsedQuestion } from '../../utils/fileQuestionParser';
import type { ModuleCategory } from '../../store/useTeacherStore';

interface GuideActivityViewProps {
  resourceName: string;
  resourceDescription?: string;
  unitTitle?: string;
  moduleType: ModuleCategory;
  questions: ParsedQuestion[];
  onClose: () => void;
  onComplete: (scorePercentage: number) => void;
}

export interface PhaseGroup {
  id: number;
  label: string; // e.g. "1. Nivel Literal", "2. Nivel Inferencial", "3. Nivel Crítico"
  levelName: string; // e.g. "Nivel Literal" or "Literal"
  count: string;
  startIndex: number;
  endIndex: number;
}

export const GuideActivityView: React.FC<GuideActivityViewProps> = ({
  resourceName,
  resourceDescription,
  unitTitle,
  moduleType,
  questions,
  onClose,
  onComplete,
}) => {
  const totalQuestions = questions.length;

  // Selected option index per question: Record<questionNumber, selectedOptionIdx>
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Verified / Confirmed questions: Record<questionNumber, boolean>
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});

  // Global question index (0 to totalQuestions - 1)
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Divide questions into cognitive taxonomy levels ("Literal · Inferencial · Crítico" o según secciones)
  const phases: PhaseGroup[] = useMemo(() => {
    if (totalQuestions === 0) return [];
    if (totalQuestions <= 2) {
      return [
        {
          id: 0,
          label: '1. Ejercicios de la Guía',
          levelName: 'General',
          count: `${totalQuestions} ej.`,
          startIndex: 0,
          endIndex: totalQuestions - 1,
        },
      ];
    }

    // 1. Si las preguntas traen asignado un nivel explícito desde el parser:
    const hasExplicitLevels = questions.some((q) => Boolean(q.level));
    if (hasExplicitLevels) {
      const groups: PhaseGroup[] = [];
      let currentLvl = questions[0]?.level || 'Literal';
      let startIdx = 0;

      for (let i = 0; i < totalQuestions; i++) {
        const qLevel = questions[i]?.level || currentLvl;
        if (qLevel !== currentLvl) {
          const displayLevel = currentLvl.toLowerCase().startsWith('nivel')
            ? currentLvl
            : (currentLvl.toLowerCase().startsWith('parte') ? currentLvl : `Nivel ${currentLvl}`);
          groups.push({
            id: groups.length,
            label: `${groups.length + 1}. ${displayLevel}`,
            levelName: displayLevel,
            count: `${i - startIdx} ej.`,
            startIndex: startIdx,
            endIndex: i - 1,
          });
          currentLvl = qLevel;
          startIdx = i;
        }
      }

      const displayLevel = currentLvl.toLowerCase().startsWith('nivel')
        ? currentLvl
        : (currentLvl.toLowerCase().startsWith('parte') ? currentLvl : `Nivel ${currentLvl}`);
      groups.push({
        id: groups.length,
        label: `${groups.length + 1}. ${displayLevel}`,
        levelName: displayLevel,
        count: `${totalQuestions - startIdx} ej.`,
        startIndex: startIdx,
        endIndex: totalQuestions - 1,
      });

      if (groups.length > 1) {
        return groups;
      }
    }

    // 2. Si no vienen niveles explícitos (ej. recurso pre-cargado en sesión docente):
    // Particionar de acuerdo a la taxonomía pedagógica canónica: Literal · Inferencial · Crítico
    const third = Math.floor(totalQuestions / 3);
    const rem = totalQuestions % 3;
    // Si rem === 1: extra al intermedio (Inferencial). Si rem === 2: extra a Literal e Inferencial
    const p1End = third + (rem === 2 ? 1 : 0);
    const p2End = p1End + third + (rem >= 1 ? 1 : 0);

    const levels = [
      { name: 'Nivel Literal', start: 0, end: p1End - 1 },
      { name: 'Nivel Inferencial', start: p1End, end: p2End - 1 },
      { name: 'Nivel Crítico', start: p2End, end: totalQuestions - 1 },
    ];

    return levels.map((lvl, idx) => ({
      id: idx,
      label: `${idx + 1}. ${lvl.name}`,
      levelName: lvl.name,
      count: `${lvl.end - lvl.start + 1} ej.`,
      startIndex: lvl.start,
      endIndex: lvl.end,
    }));
  }, [questions, totalQuestions]);

  // Determine which phase contains the current question dynamically by range
  const activePhaseIndex = phases.findIndex(
    (ph) => currentIndex >= ph.startIndex && currentIndex <= ph.endIndex
  );
  const currentPhase = phases[activePhaseIndex >= 0 ? activePhaseIndex : 0] || phases[0];

  // Current question data
  const currentQuestion = questions[currentIndex] || questions[0];

  // Stats
  const correctCount = useMemo(() => {
    return questions.filter((q, idx) => {
      const qNum = q.number || idx + 1;
      return confirmed[qNum] && answers[qNum] === q.correctIndex;
    }).length;
  }, [questions, confirmed, answers]);

  const answeredCount = useMemo(() => {
    return questions.filter((q, idx) => {
      const qNum = q.number || idx + 1;
      return confirmed[qNum];
    }).length;
  }, [questions, confirmed]);

  const isCurrentConfirmed = Boolean(confirmed[currentQuestion?.number || currentIndex + 1]);
  const currentSelectedOpt = answers[currentQuestion?.number || currentIndex + 1];
  const isCurrentCorrect = currentSelectedOpt === currentQuestion?.correctIndex;
  const isAllCompleted = answeredCount === totalQuestions && totalQuestions > 0;

  // Module themes and color palettes
  const moduleThemes: Record<
    ModuleCategory,
    { gradient: string; badgeText: string; accentColor: string; icon: React.ElementType }
  > = {
    comprension: {
      gradient: 'from-cyan-600 via-teal-600 to-indigo-700',
      badgeText: 'M1: Comprensión Lectora',
      accentColor: '#00B4C8',
      icon: BookOpen,
    },
    metodo: {
      gradient: 'from-emerald-600 via-teal-600 to-indigo-700',
      badgeText: 'M2: Método y Modelamiento',
      accentColor: '#8DC63F',
      icon: Compass,
    },
    interactivo: {
      gradient: 'from-amber-500 via-orange-500 to-indigo-700',
      badgeText: 'M3: Banco Interactivo',
      accentColor: '#E87A1E',
      icon: Zap,
    },
  };

  const theme = moduleThemes[moduleType] || moduleThemes.comprension;
  const ThemeIcon = theme.icon;

  const handleOptionSelect = (optIdx: number) => {
    if (isCurrentConfirmed) return;
    const qNum = currentQuestion.number || currentIndex + 1;
    setAnswers((prev) => ({ ...prev, [qNum]: optIdx }));
  };

  const handleVerify = () => {
    const qNum = currentQuestion.number || currentIndex + 1;
    if (answers[qNum] === undefined) return;
    setConfirmed((prev) => ({ ...prev, [qNum]: true }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all questions!
      const finalScore = Math.round((correctCount / totalQuestions) * 100);
      onComplete(finalScore);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setConfirmed({});
    setCurrentIndex(0);
  };

  const jumpToQuestion = (idx: number) => {
    if (idx >= 0 && idx < totalQuestions) {
      setCurrentIndex(idx);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-3 duration-300 text-slate-800">
      
      {/* ── TOP HEADER BANNER (Idéntico a PreModule.tsx / Módulo de Lectura) ────────────────── */}
      <header
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r ${theme.gradient} p-6 sm:p-8 rounded-[2rem] border border-amber-200 shadow-md relative overflow-hidden text-white`}
      >
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {theme.badgeText}
            </span>
            <span className="text-[10px] font-black text-white bg-indigo-900/40 px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
              {unitTitle || 'Programa Transforma 2026'}
            </span>
            <span className="text-[10px] font-black text-white bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {totalQuestions} Ejercicios
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {resourceName}
          </h1>

          <p className="text-orange-100 text-xs sm:text-sm leading-relaxed font-medium">
            {resourceDescription ||
              `Actividad interactiva de aprendizaje basada en el material pedagógico docente. Resuelve las preguntas analizando el contexto y comprueba tu rendimiento en tiempo real.`}
          </p>
        </div>

        {/* Back / Exit button in banner */}
        <div className="relative z-10 mt-4 sm:mt-0 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-black px-4 py-2.5 rounded-xl border border-white/20 text-xs transition-all cursor-pointer backdrop-blur-sm shadow-sm hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mis Cursos</span>
          </button>
        </div>

        {/* Decorative background blur shape */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-30 transform translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      </header>

      {/* ── MAIN 12-COL GRID LAYOUT (8 cols ejercicio / 4 cols mapa derecho) ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── COLUMNA IZQUIERDA / CENTRAL (8 COLS) ────────────────────────────────────────── */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">

          {/* Selector de Fases / Pestañas Superiores */}
          {phases.length > 1 && (
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-2 text-left">
              {phases.map((ph) => {
                const isActive = activePhaseIndex === ph.id;
                return (
                  <button
                    key={ph.id}
                    onClick={() => setCurrentIndex(ph.startIndex)}
                    className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer border-none ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'text-slate-500 hover:bg-slate-50 bg-transparent'
                    }`}
                  >
                    <span>{ph.label}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                        isActive ? 'bg-indigo-500 text-indigo-100' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {ph.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Marcador de Pregunta y Barra de Progreso Interna */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0">
                  {currentIndex + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      {currentQuestion?.code
                        ? `Problema ${currentQuestion.code}`
                        : `Ejercicio ${currentIndex + 1}`}
                    </h3>
                    {currentPhase?.levelName && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {currentPhase.levelName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    Pregunta {currentIndex + 1} de {totalQuestions} de esta actividad
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-slate-100 text-slate-700 px-3.5 py-1 rounded-full border border-slate-200/70">
                  Rendimiento: {correctCount}/{totalQuestions} correctas
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Tarjeta del Ejercicio Actual */}
          {currentQuestion ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6 text-left">
              
              {/* Contexto de lectura si existe */}
              {currentQuestion.context && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 text-sm leading-relaxed text-slate-600 font-medium relative">
                  <span className="absolute top-3 right-3 text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Lectura de enunciado
                  </span>
                  <p className="pr-16 text-xs sm:text-sm">{currentQuestion.context}</p>
                </div>
              )}

              {/* Enunciado de la Pregunta */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  Enunciado
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {currentQuestion.questionText}
                </h4>
              </div>

              {/* Lista de Alternativas */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt, oIdx) => {
                  const qNum = currentQuestion.number || currentIndex + 1;
                  const isSelected = answers[qNum] === oIdx;
                  const isLocked = Boolean(confirmed[qNum]);
                  const isCorrectOption = oIdx === currentQuestion.correctIndex;

                  let btnStyle =
                    'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/10 text-slate-700 bg-white';
                  if (isSelected) {
                    btnStyle =
                      'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-600/10 font-bold';
                  }
                  if (isLocked) {
                    if (isCorrectOption) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/10 font-bold';
                    } else if (isSelected) {
                      btnStyle =
                        'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/10 font-bold';
                    } else {
                      btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.label || oIdx}
                      disabled={isLocked}
                      onClick={() => handleOptionSelect(oIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-start gap-3.5 cursor-pointer ${btnStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 text-slate-500 bg-white'
                        }`}
                      >
                        {opt.label || String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Banner de Retroalimentación Inmediata al comprobar */}
              {isCurrentConfirmed && (
                <div
                  className={`p-5 rounded-2xl border flex items-start gap-4 transition-all animate-in fade-in duration-200 ${
                    isCurrentCorrect
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
                      : 'bg-rose-50 border-rose-100 text-rose-950'
                  }`}
                >
                  {isCurrentCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-left">
                    <p className="font-extrabold text-sm">
                      {isCurrentCorrect ? '¡Excelente análisis lector!' : 'Respuesta a revisar'}
                    </p>
                    <p className="text-xs leading-relaxed opacity-90 whitespace-pre-line">
                      {currentQuestion.explanation ||
                        'Respuesta validada por el análisis de las variables del enunciado.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Barra Inferior de Acciones */}
              <div className="flex justify-between items-center gap-4 pt-4 border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 text-slate-500 font-extrabold text-xs disabled:opacity-30 hover:text-slate-700 cursor-pointer bg-transparent border-none transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Pregunta anterior</span>
                </button>

                <div className="flex items-center gap-3">
                  {!isCurrentConfirmed ? (
                    <button
                      onClick={handleVerify}
                      disabled={currentSelectedOpt === undefined}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl text-xs transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
                    >
                      Comprobar Análisis
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-6 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 hover:-translate-y-0.5 cursor-pointer border-none"
                    >
                      <span>
                        {currentIndex < totalQuestions - 1
                          ? 'Siguiente Pregunta'
                          : 'Finalizar y Guardar'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-black text-slate-900">¡Guía Completada!</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Has resuelto todas las preguntas de este material.
              </p>
            </div>
          )}

          {/* Banner de Felicitaciones si Completó Todo */}
          {isAllCompleted && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-8 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-300 animate-bounce shrink-0" />
                  <span className="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full tracking-widest">
                    Guía Superada
                  </span>
                </div>
                <h3 className="text-2xl font-black">¡Felicidades, Guía Completada con Éxito!</h3>
                <p className="text-emerald-100 text-xs leading-relaxed max-w-2xl font-medium">
                  Has respondido los {totalQuestions} ejercicios de {resourceName}. Tu rendimiento final fue de{' '}
                  <span className="font-extrabold underline">
                    {correctCount} de {totalQuestions} correctas (
                    {Math.round((correctCount / totalQuestions) * 100)}%)
                  </span>
                  . Tu avance ha sido guardado exitosamente en tu progreso del curso.
                </p>
              </div>

              <div className="flex gap-3 shrink-0 relative z-10">
                <button
                  onClick={handleReset}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl border border-white/20 text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir Guía</span>
                </button>
                <button
                  onClick={() => {
                    const finalScore = Math.round((correctCount / totalQuestions) * 100);
                    onComplete(finalScore);
                    onClose();
                  }}
                  className="bg-white hover:bg-slate-100 text-indigo-950 font-black px-6 py-3 rounded-xl text-xs shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-none"
                >
                  Volver a Mis Cursos
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── COLUMNA DERECHA (4 COLS): MAPA DE TODOS LOS EJERCICIOS ─────────────────────── */}
        <div className="col-span-1 lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6 text-left sticky top-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Mapa de los {totalQuestions} Ejercicios
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Haz clic en cualquier número para saltar directamente al ejercicio
            </p>
          </div>

          <div className="border-t border-slate-100" />

          {/* Grupos por Fases / Bloques */}
          <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1">
            {phases.map((ph) => {
              const phaseQuestions = questions.slice(ph.startIndex, ph.endIndex + 1);

              return (
                <div key={ph.id} className="space-y-2.5">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                      {ph.label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {ph.startIndex + 1}–{ph.endIndex + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {phaseQuestions.map((q, pIdx) => {
                      const absoluteIndex = ph.startIndex + pIdx;
                      const qNum = q.number || absoluteIndex + 1;
                      const isAns = answers[qNum] !== undefined;
                      const isConf = Boolean(confirmed[qNum]);
                      const isCorr = answers[qNum] === q.correctIndex;
                      const isActive = currentIndex === absoluteIndex;

                      let dotStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                      if (isAns) {
                        dotStyle = 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold';
                      }
                      if (isConf) {
                        dotStyle = isCorr
                          ? 'bg-emerald-500 border-emerald-500 text-white font-black'
                          : 'bg-rose-500 border-rose-500 text-white font-black';
                      }

                      return (
                        <button
                          key={q.id || absoluteIndex}
                          onClick={() => jumpToQuestion(absoluteIndex)}
                          className={`h-9 rounded-xl border flex items-center justify-center text-xs transition-all cursor-pointer font-bold ${dotStyle} ${
                            isActive
                              ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105 shadow-sm font-black'
                              : 'hover:border-slate-300'
                          }`}
                          title={`Pregunta ${absoluteIndex + 1}`}
                        >
                          {absoluteIndex + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leyenda de colores (Idéntica a PreModule.tsx) */}
          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span>Análisis Correcto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <span>Análisis Incorrecto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-300 shrink-0" />
              <span>Seleccionado (Pendiente comprobación)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200 shrink-0" />
              <span>Sin responder</span>
            </div>
          </div>

          {/* Botón inferior de retorno */}
          <div className="border-t border-slate-100 pt-3">
            <button
              onClick={onClose}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-extrabold py-3 px-4 rounded-2xl text-xs transition-colors cursor-pointer border border-slate-200/80 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Mis Cursos</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
