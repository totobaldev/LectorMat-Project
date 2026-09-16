import React, { useState, useEffect, useRef } from 'react';
import {
  X, CheckCircle2, ArrowRight, BookOpen, Compass, Zap,
  Award, Sparkles, AlertCircle, RotateCcw, HelpCircle,
  Lightbulb, Hash, Type, ListChecks, ChevronDown, Trophy,
  Target, Star
} from 'lucide-react';
import type { QuizQuestion, QuizProblem } from '../../data/u1Questions';
import { useProgressStore } from '../../store/useProgressStore';

// ─── Types ──────────────────────────────────────────────────────────────────

interface QuizRunnerProps {
  problem: QuizProblem;
  onClose: () => void;
  onComplete: (scorePercentage: number, totalPoints: number, earnedPoints: number) => void;
}

// ─── Module colors / meta ───────────────────────────────────────────────────

const MODULE_META = {
  comprension: { bg: '#EEF2FF', text: '#4F46E5', label: 'Comprensión Lectora', icon: BookOpen, gradient: 'from-indigo-50 to-blue-50' },
  metodo: { bg: '#ECFDF5', text: '#059669', label: 'Método Guiado', icon: Compass, gradient: 'from-emerald-50 to-teal-50' },
  interactivo: { bg: '#FFF7ED', text: '#EA580C', label: 'Banco Interactivo', icon: Zap, gradient: 'from-orange-50 to-amber-50' },
};

const TYPE_ICONS = {
  numeric: Hash,
  multichoice: ListChecks,
  short_answer: Type,
};

// ─── Component ──────────────────────────────────────────────────────────────

export const QuizRunner: React.FC<QuizRunnerProps> = ({ problem, onClose, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [usedHints, setUsedHints] = useState<Set<number>>(new Set());

  // Answer state per question type
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [numericInput, setNumericInput] = useState('');
  const [textInput, setTextInput] = useState('');

  // Results tracking
  const [results, setResults] = useState<Record<number, { correct: boolean; earned: number; used_hint: boolean }>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const addXp = useProgressStore(s => s.addXp);
  const addNotification = useProgressStore(s => s.addNotification);

  const questions = problem.questions;
  const totalQuestions = questions.length;
  const currentQ = questions[currentIndex];
  const meta = MODULE_META[problem.moduleType];
  const ModIcon = meta.icon;
  const TypeIcon = TYPE_ICONS[currentQ.type];
  const progressPct = Math.round(((currentIndex + (isSubmitted ? 1 : 0)) / totalQuestions) * 100);

  useEffect(() => {
    if (!isSubmitted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isSubmitted]);

  // ── Check answer logic ──────────────────────────────────────────────────

  const checkAnswer = (): boolean => {
    switch (currentQ.type) {
      case 'multichoice': {
        if (selectedOption === null) return false;
        return currentQ.options![selectedOption].isCorrect;
      }
      case 'numeric': {
        const val = parseFloat(numericInput.replace(',', '.'));
        if (isNaN(val)) return false;
        const tol = currentQ.tolerance ?? 0;
        return Math.abs(val - currentQ.correctAnswer!) <= tol;
      }
      case 'short_answer': {
        const clean = textInput.trim().toLowerCase().replace(/\s+/g, '');
        return (currentQ.acceptedAnswers ?? []).some(
          a => a.toLowerCase().replace(/\s+/g, '') === clean
        );
      }
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    const correct = checkAnswer();
    const hintUsed = usedHints.has(currentIndex);
    // 50% penalty for hints
    const earned = correct ? (hintUsed ? Math.round(currentQ.points * 0.5) : currentQ.points) : 0;

    setResults(prev => ({ ...prev, [currentIndex]: { correct, earned, used_hint: hintUsed } }));
    setIsSubmitted(true);
    setShowHint(false);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsSubmitted(false);
      setSelectedOption(null);
      setNumericInput('');
      setTextInput('');
      setShowHint(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleShowHint = () => {
    setUsedHints(prev => new Set(prev).add(currentIndex));
    setShowHint(true);
  };

  // ── Final score calculation ─────────────────────────────────────────────

  const totalEarned = Object.values(results).reduce((sum, r) => sum + r.earned, 0);
  const correctCount = Object.values(results).filter(r => r.correct).length;
  const scorePct = Math.round((totalEarned / problem.totalPoints) * 100);
  const hintsUsed = Object.values(results).filter(r => r.used_hint).length;

  const handleFinish = () => {
    // Award XP
    const xpEarned = Math.round(scorePct * 0.5);
    addXp(xpEarned);
    addNotification(`¡Completaste "${problem.title}"! +${xpEarned} XP`);
    onComplete(scorePct, problem.totalPoints, totalEarned);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setIsSubmitted(false);
    setSelectedOption(null);
    setNumericInput('');
    setTextInput('');
    setShowHint(false);
    setUsedHints(new Set());
    setResults({});
  };

  // ── Determine if answer is provided ─────────────────────────────────────

  const hasAnswer = () => {
    switch (currentQ.type) {
      case 'multichoice': return selectedOption !== null;
      case 'numeric': return numericInput.trim().length > 0;
      case 'short_answer': return textInput.trim().length > 0;
      default: return false;
    }
  };

  const currentResult = results[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden relative">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: meta.bg, color: meta.text }}
            >
              <ModIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  style={{ color: meta.text, backgroundColor: `${meta.text}10`, borderColor: `${meta.text}30` }}
                >
                  {meta.label}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  U{problem.unit} · Semana {problem.week}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 truncate mt-0.5">{problem.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Progress Bar ────────────────────────────────────────────────── */}
        {!isFinished && (
          <div className="px-8 py-3 bg-slate-100/60 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Pregunta {currentIndex + 1} de {totalQuestions}
              </span>
              <span className="text-[11px] font-bold text-slate-400">({progressPct}%)</span>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ color: meta.text, backgroundColor: `${meta.text}15` }}
              >
                <TypeIcon className="w-3 h-3" />
                {currentQ.type === 'numeric' ? 'Numérica' : currentQ.type === 'multichoice' ? 'Selección' : 'Respuesta Corta'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400">{currentQ.points} pts</span>
              <div className="w-36 h-2 bg-slate-200 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, backgroundColor: meta.text }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {isFinished ? (
            /* ── COMPLETION SCREEN ────────────────────────────────────────── */
            <div className="flex flex-col items-center text-center gap-6 py-4">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${meta.text}15`, color: meta.text }}
              >
                {scorePct >= 70 ? <Trophy className="w-12 h-12" /> : <Target className="w-12 h-12" />}
              </div>

              <div className="space-y-2 max-w-md">
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full"
                  style={{
                    color: scorePct >= 70 ? '#059669' : '#EA580C',
                    backgroundColor: scorePct >= 70 ? '#ECFDF5' : '#FFF7ED',
                    border: `1px solid ${scorePct >= 70 ? '#A7F3D0' : '#FDBA74'}`
                  }}
                >
                  {scorePct >= 70 ? <Sparkles className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {scorePct >= 90 ? '¡Excelente!' : scorePct >= 70 ? '¡Buen trabajo!' : scorePct >= 50 ? 'Puedes mejorar' : 'Inténtalo de nuevo'}
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {problem.title}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Has completado todas las preguntas de este módulo.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Aciertos</p>
                  <p className="text-xl font-black text-emerald-600">{correctCount}/{totalQuestions}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Puntaje</p>
                  <p className="text-xl font-black" style={{ color: meta.text }}>{totalEarned}/{problem.totalPoints}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Porcentaje</p>
                  <p className="text-xl font-black text-blue-600">{scorePct}%</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Pistas</p>
                  <p className="text-xl font-black text-amber-600">{hintsUsed}</p>
                </div>
              </div>

              {/* Per-question breakdown */}
              <div className="w-full max-w-lg space-y-2 text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-1">Detalle por pregunta</p>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100">
                  {questions.map((q, i) => {
                    const r = results[i];
                    return (
                      <div key={q.id} className="flex items-center justify-between px-4 py-2.5 gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                            r?.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {r?.correct ? '✓' : '✗'}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 truncate">
                            P{q.number}: {q.questionText.substring(0, 50)}...
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {r?.used_hint && (
                            <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                              Pista
                            </span>
                          )}
                          <span className="text-xs font-black text-slate-600">{r?.earned ?? 0}/{q.points}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={handleRetry}
                  className="px-5 py-3 rounded-xl border border-slate-200 font-extrabold text-xs text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reintentar
                </button>
                <button
                  onClick={handleFinish}
                  className="px-6 py-3 rounded-xl font-extrabold text-xs text-white transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  style={{ backgroundColor: meta.text, boxShadow: `0 4px 12px ${meta.text}40` }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Guardar y Finalizar
                </button>
              </div>
            </div>
          ) : (
            /* ── QUESTION DISPLAY ─────────────────────────────────────────── */
            <div className="flex flex-col gap-5">

              {/* Context */}
              {currentQ.context && (
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${meta.gradient} border border-slate-100 space-y-1.5`}>
                  <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: meta.text }}>
                    <BookOpen className="w-3.5 h-3.5" />
                    Contexto del Problema
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {currentQ.context}
                  </p>
                </div>
              )}

              {/* Question stem */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Pregunta {currentQ.number}
                </span>
                <h4 className="text-lg font-extrabold text-slate-950 leading-snug">
                  {currentQ.questionText}
                </h4>
              </div>

              {/* Hint button + content */}
              {currentQ.hint && !isSubmitted && (
                <div>
                  {!showHint ? (
                    <button
                      onClick={handleShowHint}
                      className="flex items-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl border border-amber-200 transition-colors cursor-pointer"
                    >
                      <Lightbulb className="w-4 h-4" />
                      ¿Necesitas ayuda? Ver pista
                      {!usedHints.has(currentIndex) && (
                        <span className="text-[9px] text-amber-500 font-semibold">(−50% puntos)</span>
                      )}
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                      <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5" /> Pista
                      </span>
                      <p className="text-sm text-amber-900 font-medium leading-relaxed">{currentQ.hint}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Answer input area ─────────────────────────────────────── */}

              {/* Multichoice */}
              {currentQ.type === 'multichoice' && currentQ.options && (
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = opt.isCorrect;

                    let borderCls = 'border-slate-200 bg-white hover:border-slate-300';
                    let badgeCls = 'bg-slate-100 text-slate-600';

                    if (isSubmitted) {
                      if (isCorrect) {
                        borderCls = 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20';
                        badgeCls = 'bg-emerald-500 text-white';
                      } else if (isSelected && !isCorrect) {
                        borderCls = 'border-red-400 bg-red-50/80 ring-2 ring-red-400/20';
                        badgeCls = 'bg-red-500 text-white';
                      }
                    } else if (isSelected) {
                      borderCls = 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20';
                      badgeCls = 'bg-blue-600 text-white';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !isSubmitted && setSelectedOption(idx)}
                        disabled={isSubmitted}
                        className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${borderCls}`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 transition-colors ${badgeCls}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-sm font-semibold text-slate-800 leading-normal">
                            {opt.text}
                          </span>
                        </div>
                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Numeric input */}
              {currentQ.type === 'numeric' && (
                <div className="space-y-2">
                  <div className={`relative rounded-2xl border-2 transition-all ${
                    isSubmitted
                      ? currentResult?.correct
                        ? 'border-emerald-400 bg-emerald-50/50'
                        : 'border-red-400 bg-red-50/50'
                      : 'border-slate-200 focus-within:border-blue-500 bg-white'
                  }`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Hash className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="decimal"
                      value={numericInput}
                      onChange={e => !isSubmitted && setNumericInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && hasAnswer()) handleSubmit(); }}
                      disabled={isSubmitted}
                      placeholder="Ingresa tu respuesta numérica..."
                      className="w-full pl-12 pr-4 py-4 text-lg font-bold text-slate-900 rounded-2xl bg-transparent outline-none placeholder-slate-400"
                    />
                  </div>
                  {isSubmitted && !currentResult?.correct && (
                    <p className="text-xs font-bold text-slate-500 pl-2">
                      Respuesta correcta: <strong className="text-emerald-700">{currentQ.correctAnswer}</strong>
                      {currentQ.tolerance ? ` (±${currentQ.tolerance})` : ''}
                    </p>
                  )}
                </div>
              )}

              {/* Short answer input */}
              {currentQ.type === 'short_answer' && (
                <div className="space-y-2">
                  <div className={`relative rounded-2xl border-2 transition-all ${
                    isSubmitted
                      ? currentResult?.correct
                        ? 'border-emerald-400 bg-emerald-50/50'
                        : 'border-red-400 bg-red-50/50'
                      : 'border-slate-200 focus-within:border-blue-500 bg-white'
                  }`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Type className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={textInput}
                      onChange={e => !isSubmitted && setTextInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && hasAnswer()) handleSubmit(); }}
                      disabled={isSubmitted}
                      placeholder="Escribe tu respuesta..."
                      className="w-full pl-12 pr-4 py-4 text-lg font-bold text-slate-900 rounded-2xl bg-transparent outline-none placeholder-slate-400"
                    />
                  </div>
                  {isSubmitted && !currentResult?.correct && (
                    <p className="text-xs font-bold text-slate-500 pl-2">
                      Respuestas aceptadas: <strong className="text-emerald-700">{currentQ.acceptedAnswers?.join(' ó ')}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Feedback after submission */}
              {isSubmitted && (
                <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed flex items-start gap-3 border ${
                  currentResult?.correct
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {currentResult?.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-black block mb-0.5 text-sm">
                      {currentResult?.correct ? '¡Correcto!' : 'Incorrecto'}
                      {currentResult?.correct && currentResult?.used_hint && (
                        <span className="font-semibold text-amber-600 ml-2">(con pista: {currentResult.earned}/{currentQ.points} pts)</span>
                      )}
                      {currentResult?.correct && !currentResult?.used_hint && (
                        <span className="font-semibold text-emerald-600 ml-2">(+{currentResult.earned} pts)</span>
                      )}
                    </span>
                    <span className="text-xs leading-relaxed">{currentQ.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer Controls ─────────────────────────────────────────────── */}
        {!isFinished && (
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Salir
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswer()}
                className={`px-6 py-3 rounded-xl font-extrabold text-xs text-white transition-all cursor-pointer shadow-md ${
                  hasAnswer()
                    ? 'hover:opacity-90'
                    : 'opacity-40 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: hasAnswer() ? meta.text : '#94A3B8',
                  boxShadow: hasAnswer() ? `0 4px 12px ${meta.text}30` : 'none',
                }}
              >
                Comprobar Respuesta
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl font-extrabold text-xs text-white transition-all flex items-center gap-2 cursor-pointer shadow-md"
                style={{ backgroundColor: meta.text, boxShadow: `0 4px 12px ${meta.text}30` }}
              >
                <span>{currentIndex < totalQuestions - 1 ? 'Siguiente Pregunta' : 'Ver Resultado Final'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
