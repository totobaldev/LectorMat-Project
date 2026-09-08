import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, ArrowRight, BookOpen, Compass, Zap,
  Award, Sparkles, AlertCircle, RotateCcw, HelpCircle, FileText
} from 'lucide-react';
import type { ParsedQuestion } from '../../utils/fileQuestionParser';
import type { ModuleCategory } from '../../store/useTeacherStore';
import { StatusBadge } from './StatusBadge';
import { ActionButton } from './ActionButton';

interface InteractiveQuestionRunnerProps {
  resourceName: string;
  moduleType: ModuleCategory;
  questions: ParsedQuestion[];
  onClose: () => void;
  onComplete: (scorePercentage: number) => void;
}

export const InteractiveQuestionRunner: React.FC<InteractiveQuestionRunnerProps> = ({
  resourceName,
  moduleType,
  questions,
  onClose,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const moduleColors: Record<ModuleCategory, { bg: string; text: string; label: string; icon: React.ElementType }> = {
    comprension: { bg: '#E0F7FA', text: '#00B4C8', label: 'Comprensión Lectora', icon: BookOpen },
    metodo: { bg: '#E8F5E9', text: '#8DC63F', label: 'Método Guiado', icon: Compass },
    interactivo: { bg: '#FFF3E0', text: '#E87A1E', label: 'Banco Interactivo', icon: Zap },
  };

  const modMeta = moduleColors[moduleType] || moduleColors.comprension;
  const ModIcon = modMeta.icon;

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOptionIndex(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null) return;
    setIsSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: selectedOptionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  // Calculate final score
  const correctCount = Object.entries(userAnswers).reduce((acc, [qIdxStr, chosenIdx]) => {
    const qIdx = parseInt(qIdxStr, 10);
    const q = questions[qIdx];
    return acc + (chosenIdx === q.correctIndex ? 1 : 0);
  }, 0);

  const scorePct = Math.round((correctCount / totalQuestions) * 100);

  const handleFinish = () => {
    onComplete(scorePct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden relative"
      >
        {/* ── Modal Header ────────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: modMeta.bg, color: modMeta.text }}
            >
              <ModIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  style={{ color: modMeta.text, backgroundColor: `${modMeta.text}10`, borderColor: `${modMeta.text}30` }}
                >
                  {modMeta.label}
                </span>
                <span className="text-[10px] font-bold text-slate-400">Modo Interactivo</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 truncate mt-0.5">{resourceName}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Progress Bar ────────────────────────────────────────────────────────── */}
        {!isFinished && (
          <div className="px-8 py-3 bg-slate-100/60 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Pregunta {currentIndex + 1} de {totalQuestions}
              </span>
              <span className="text-[11px] font-bold text-slate-400">({progressPct}% avance)</span>
            </div>
            <div className="w-36 h-2 bg-slate-200 rounded-full overflow-hidden shrink-0">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, backgroundColor: modMeta.text }}
              />
            </div>
          </div>
        )}

        {/* ── Modal Content Body ────────────────────────────────────────────────── */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {isFinished ? (
            /* ── COMPLETION SUMMARY SCREEN ────────────────────────────────────────── */
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center gap-6 py-6"
            >
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${modMeta.text}15`, color: modMeta.text }}
              >
                <Award className="w-12 h-12" />
              </div>

              <div className="space-y-2 max-w-md">
                <StatusBadge tone="emerald" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  ¡Módulo Completado!
                </StatusBadge>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Excelente Trabajo
                </h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Has completado todas las preguntas extraídas de <strong className="text-slate-800">{resourceName}</strong>.
                </p>
              </div>

              {/* Stats Card */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Aciertos</p>
                  <p className="text-2xl font-black text-emerald-600">{correctCount} / {totalQuestions}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Puntaje Final</p>
                  <p className="text-2xl font-black text-blue-600">{scorePct}%</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentIndex(0);
                    setSelectedOptionIndex(null);
                    setIsSubmitted(false);
                    setUserAnswers({});
                  }}
                  className="px-5 py-3 rounded-xl border border-slate-200 font-extrabold text-xs text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Repetir Preguntas
                </button>

                <ActionButton
                  onClick={handleFinish}
                  variant="student"
                  size="md"
                  leading={<CheckCircle2 className="w-4 h-4" />}
                >
                  Guardar y Finalizar
                </ActionButton>
              </div>
            </motion.div>
          ) : (
            /* ── QUESTION DISPLAY ────────────────────────────────────────────────── */
            <div className="flex flex-col gap-6">
              
              {/* Context / Reading Passage if present */}
              {currentQuestion.context && (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                  <span className="text-[9px] font-black text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Contexto de Lectura
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {currentQuestion.context}
                  </p>
                </div>
              )}

              {/* Question Stem */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Pregunta {currentQuestion.number}
                </span>
                <h4 className="text-lg font-extrabold text-slate-950 leading-snug">
                  {currentQuestion.questionText}
                </h4>
              </div>

              {/* Options list */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let borderCls = 'border-slate-200 bg-white hover:border-slate-300';
                  let badgeCls = 'bg-slate-100 text-slate-600';

                  if (isSubmitted) {
                    if (isCorrect) {
                      borderCls = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20';
                      badgeCls = 'bg-emerald-500 text-white';
                    } else if (isSelected && !isCorrect) {
                      borderCls = 'border-red-400 bg-red-50/80 text-red-950 ring-2 ring-red-400/20';
                      badgeCls = 'bg-red-500 text-white';
                    }
                  } else if (isSelected) {
                    borderCls = 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/20';
                    badgeCls = 'bg-blue-600 text-white';
                  }

                  return (
                    <button
                      key={opt.label || idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${borderCls}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 transition-colors ${badgeCls}`}>
                          {opt.label || String.fromCharCode(65 + idx)}
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

              {/* Explanation / Feedback */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl text-xs font-medium leading-relaxed flex items-start gap-3 border ${
                    selectedOptionIndex === currentQuestion.correctIndex
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  {selectedOptionIndex === currentQuestion.correctIndex ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-black block mb-0.5">
                      {selectedOptionIndex === currentQuestion.correctIndex
                        ? '¡Respuesta Correcta!'
                        : 'Revisa la justificación:'}
                    </span>
                    <span>{currentQuestion.explanation || 'Opción validada según los criterios del módulo de estudio.'}</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* ── Modal Footer Controls ─────────────────────────────────────────────── */}
        {!isFinished && (
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Salir de la actividad
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOptionIndex === null}
                className={`px-6 py-3 rounded-xl font-extrabold text-xs text-white transition-all cursor-pointer shadow-md ${
                  selectedOptionIndex !== null
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                    : 'bg-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                Comprobar Respuesta
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>{currentIndex < totalQuestions - 1 ? 'Siguiente Pregunta' : 'Ver Resultado Final'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
