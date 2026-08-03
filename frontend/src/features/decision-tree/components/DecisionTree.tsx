import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, RotateCcw, CheckCircle, Lightbulb,
  Sparkles, GitMerge,
} from 'lucide-react';
import { type DecisionNode, u3NodesMap } from '../data/u3Nodes';
import { useProgressStore, type M2PathEntry } from '../../../store/useProgressStore';


// ─── Design tokens (extraídos del logo) ──────────────────────────────────────
// Azul Lector  → #2563EB  (blue-600)
// Naranja Mat  → #F97316  (orange-500)
// Verde Éxito  → #10B981  (emerald-500)
// Fondo base   → #F8FAFC  (slate-50)
// Superficie   → #FFFFFF
// Shadow       → 0 8px 30px rgb(0,0,0,0.04)

// ─── Props ────────────────────────────────────────────────────────────────────

interface DecisionTreeProps {
  nodes: DecisionNode[];
  onComplete?: (finalNodeId: string) => void;
}

// ─── Path History Panel (30%) ─────────────────────────────────────────────────

const PathHistoryPanel = ({
  history,
  onReset,
}: {
  history: M2PathEntry[];
  onReset: () => void;
}) => (
  <aside className="w-80 shrink-0 bg-white rounded-[2rem] border border-slate-100 p-7 flex flex-col gap-5 self-start sticky top-6"
    style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.04)' }}>

    {/* Header */}
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Tu Recorrido
      </span>
      {history.length > 0 && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-orange-500 transition-colors font-bold cursor-pointer bg-transparent border-none"
        >
          <RotateCcw className="w-3 h-3" />
          Reiniciar
        </button>
      )}
    </div>

    {history.length === 0 ? (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <GitMerge className="w-8 h-8 text-slate-200" />
        <p className="text-xs text-slate-400 leading-relaxed max-w-[180px]">
          Tus respuestas aparecerán aquí mientras avanzas por el árbol.
        </p>
      </div>
    ) : (
      <ol className="flex flex-col gap-3 relative">
        {/* Timeline vertical line */}
        <div className="absolute left-[9px] top-5 bottom-1 w-px bg-slate-100" />
        <AnimatePresence initial={false}>
          {history.map((entry, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3 items-start"
            >
              <span className="w-[18px] h-[18px] rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-400 shrink-0 mt-0.5 relative z-10">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                  {entry.question}
                </p>
                <span
                  className={`inline-block mt-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    entry.answer === 'Sí'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-orange-50 text-orange-500'
                  }`}
                >
                  {entry.answer}
                </span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    )}

    {/* Progress bar */}
    <div className="mt-auto pt-2 flex flex-col gap-1.5">
      <div className="flex justify-between text-[10px] font-bold text-slate-400">
        <span>Avance</span>
        <span>{history.length}/4</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${(history.length / 4) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  </aside>
);

// ─── Question Card (70%) ──────────────────────────────────────────────────────

const QuestionCard = ({
  node,
  stepIndex,
  canGoBack,
  onYes,
  onNo,
  onBack,
}: {
  node: DecisionNode;
  stepIndex: number;
  canGoBack: boolean;
  onYes: () => void;
  onNo: () => void;
  onBack: () => void;
}) => (
  <div
    className="font-[Nunito] bg-white rounded-[2rem] border border-slate-100 p-10 flex flex-col gap-8 min-h-[calc(100vh-220px)]"
    style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.04)' }}
  >
    {/* Step counter */}
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400">
          Paso {stepIndex + 1} / 4
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-all duration-400 ${
                i <= stepIndex ? 'bg-blue-600' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Question body */}
    <div className="flex-1 flex flex-col justify-center gap-5">
      <div className="inline-flex items-center gap-2 self-start">
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
          Trigonom. · U3 M2
        </span>
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {node.question}
      </h2>

      {node.hint && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 leading-relaxed">{node.hint}</p>
        </div>
      )}
    </div>

    {/* Answer buttons */}
    <div className="flex gap-4">
      {/* SÍ — Azul Lector */}
      <motion.button
        id={`btn-yes-${node.id}`}
        onClick={onYes}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 px-8 font-bold text-lg transition-colors duration-200 cursor-pointer shadow-sm"
        style={{ boxShadow: '0 4px 14px rgb(37,99,235,0.25)' }}
      >
        ✓ &nbsp;Sí
      </motion.button>

      {/* NO — Naranja Mat (contorno) */}
      <motion.button
        id={`btn-no-${node.id}`}
        onClick={onNo}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 border-2 border-slate-200 hover:border-orange-400 text-slate-600 hover:text-orange-500 rounded-2xl py-4 px-8 font-bold text-lg bg-white transition-all duration-200 cursor-pointer"
      >
        ✗ &nbsp;No
      </motion.button>
    </div>

    {/* Volver */}
    <button
      onClick={onBack}
      disabled={!canGoBack}
      className={`flex items-center gap-2 text-sm font-semibold w-fit bg-transparent border-none transition-colors ${
        canGoBack
          ? 'text-slate-400 hover:text-slate-700 cursor-pointer'
          : 'text-slate-200 cursor-not-allowed'
      }`}
    >
      <ArrowLeft className="w-4 h-4" />
      Volver atrás
    </button>
  </div>
);

// ─── Final / Success Card ─────────────────────────────────────────────────────

const FinalCard = ({
  node,
  onComplete,
  onReset,
}: {
  node: DecisionNode;
  onComplete: () => void;
  onReset: () => void;
}) => (
  <motion.div
    className="font-[Nunito] bg-white rounded-[2rem] border border-emerald-100 p-10 flex flex-col gap-7 min-h-[calc(100vh-220px)]"
    style={{ boxShadow: '0 8px 30px rgb(16,185,129,0.08)' }}
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    {/* Éxito header */}
    <div className="flex items-center justify-end">
      <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
        <Sparkles className="w-3.5 h-3.5" />
        Método Identificado
      </span>
    </div>

    {/* Método */}
    <div>
      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {node.finalMethod}
      </h2>
    </div>

    {/* Result box — emerald */}
    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col gap-4">
      {node.finalSub && (
        <p className="font-mono text-lg font-bold text-emerald-700">
          {node.finalSub}
        </p>
      )}
      {node.finalDetail && (
        <p className="text-sm text-emerald-800 leading-relaxed">
          {node.finalDetail}
        </p>
      )}
      {node.finalExample && (
        <div className="bg-white rounded-xl p-4 border border-emerald-100">
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1.5">
            Ejemplo técnico
          </span>
          <p className="text-sm text-slate-700 leading-relaxed">{node.finalExample}</p>
        </div>
      )}
    </div>

    {/* Actions */}
    <div className="flex gap-3 flex-wrap">
      <motion.button
        id="btn-complete-module"
        onClick={onComplete}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3.5 px-8 font-bold transition-colors duration-200 cursor-pointer"
        style={{ boxShadow: '0 4px 14px rgb(37,99,235,0.25)' }}
      >
        <CheckCircle className="w-4 h-4" />
        Completar Módulo
      </motion.button>

      <button
        onClick={onReset}
        className="flex items-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 rounded-2xl py-3.5 px-6 font-semibold text-sm bg-white transition-all duration-200 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reiniciar árbol
      </button>
    </div>
  </motion.div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const DecisionTree: React.FC<DecisionTreeProps> = ({ onComplete }) => {
  const currentM2NodeId  = useProgressStore((s) => s.currentM2NodeId);
  const m2PathHistory    = useProgressStore((s) => s.m2PathHistory);
  const answerM2Question = useProgressStore((s) => s.answerM2Question);
  const resetM2          = useProgressStore((s) => s.resetM2);
  const updateUnit       = useProgressStore((s) => s.updateUnit);

  const currentNode = u3NodesMap.get(currentM2NodeId);
  if (!currentNode) return null;

  const handleAnswer = (answer: 'Sí' | 'No') => {
    const nextId = answer === 'Sí' ? currentNode.yesNodeId : currentNode.noNodeId;
    if (!nextId) return;
    answerM2Question(nextId, currentNode.question, answer);
  };

  const handleBack = () => {
    if (m2PathHistory.length === 0) return;
    const last = m2PathHistory[m2PathHistory.length - 1];
    const prevNode = [...u3NodesMap.values()].find((n) => n.question === last.question);
    if (!prevNode) return;
    useProgressStore.setState((s) => ({
      currentM2NodeId: prevNode.id,
      m2PathHistory: s.m2PathHistory.slice(0, -1),
    }));
  };

  const handleComplete = () => {
    updateUnit(3, 100, true);
    onComplete?.(currentM2NodeId);
  };

  return (
    <div className="flex gap-6 items-start">
      {/* ── Izquierda 70%: tarjeta interactiva ──────────────────── */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentM2NodeId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {currentNode.isFinal ? (
              <FinalCard
                node={currentNode}
                onComplete={handleComplete}
                onReset={resetM2}
              />
            ) : (
              <QuestionCard
                node={currentNode}
                stepIndex={m2PathHistory.length}
                canGoBack={m2PathHistory.length > 0}
                onYes={() => handleAnswer('Sí')}
                onNo={() => handleAnswer('No')}
                onBack={handleBack}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Derecha 30%: timeline ─────────────────────────────── */}
      <PathHistoryPanel history={m2PathHistory} onReset={resetM2} />
    </div>
  );
};

export default DecisionTree;
