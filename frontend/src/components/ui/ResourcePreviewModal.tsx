import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, X, Download, CheckCircle2 } from 'lucide-react';
import { type SectionResource } from '../../store/useTeacherStore';
import { StatusBadge } from './StatusBadge';

interface Props {
  resource: SectionResource;
  onClose: () => void;
}

export const ResourcePreviewModal: React.FC<Props> = ({ resource, onClose }) => {
  const [h5pAnswerSelected, setH5pAnswerSelected] = useState<number | null>(null);
  const [h5pSubmitted, setH5pSubmitted] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                {resource.resourceType === 'h5p' ? (
                  <Sparkles className="w-6 h-6" />
                ) : resource.resourceType === 'pdf' ? (
                  <FileText className="w-6 h-6 text-red-500" />
                ) : (
                  <FileText className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {resource.resourceType.toUpperCase()} Material
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{resource.name}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Resource Content Player / Viewer */}
          {resource.resourceType === 'h5p' ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <StatusBadge tone="blue" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  Actividad Interactiva H5P
                </StatusBadge>
                <span className="text-xs font-bold text-slate-400">Puntaje: 100 pts</span>
              </div>

              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {resource.description || 'Responde la siguiente pregunta de práctica interactiva para validar tu conocimiento:'}
              </p>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900">
                  ¿Cuál de las siguientes afirmaciones caracteriza a un modelo matemático?
                </h4>
                <div className="space-y-2">
                  {[
                    'Ayuda a simplificar y analizar situaciones reales',
                    'Es siempre una respuesta exacta sin margen de error',
                    'Solo aplica en laboratorio cerrado',
                    'Es independiente de las variables del entorno'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setH5pAnswerSelected(idx); setH5pSubmitted(false); }}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        h5pAnswerSelected === idx
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span>{opt}</span>
                      {h5pAnswerSelected === idx && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {h5pAnswerSelected !== null && !h5pSubmitted && (
                <button
                  onClick={() => setH5pSubmitted(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-sm transition-colors cursor-pointer shadow-md shadow-blue-600/20 border-none"
                >
                  Comprobar Respuesta
                </button>
              )}

              {h5pSubmitted && (
                <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-3 animate-in fade-in duration-200 ${
                  h5pAnswerSelected === 0 ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-black">{h5pAnswerSelected === 0 ? '¡Respuesta Correcta! +100 pts' : 'Respuesta Incorrecta'}</p>
                    <p className="font-medium mt-0.5">
                      {h5pAnswerSelected === 0
                        ? 'Excelente, un modelo es una abstracción útil para análisis.'
                        : 'Revisa la definición de modelación matemática.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : resource.resourceType === 'pdf' ? (
            <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col items-center justify-center gap-4 min-h-[220px]">
              <FileText className="w-16 h-16 text-red-400 animate-pulse" />
              <div className="text-center space-y-1">
                <h4 className="text-base font-black">{resource.fileName}</h4>
                <p className="text-xs text-slate-400 font-medium">Documento de Lectura PDF listo para revisar</p>
              </div>
              <a
                href={`#download-${resource.id}`}
                onClick={(e) => { e.preventDefault(); alert(`Descargando documento PDF: ${resource.fileName}`); }}
                className="mt-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-600/20 no-underline"
              >
                <Download className="w-4 h-4" />
                Abrir PDF
              </a>
            </div>
          ) : (
            <div className="bg-blue-900/90 rounded-3xl p-8 text-white flex flex-col items-center justify-center gap-4 min-h-[220px]">
              <FileText className="w-16 h-16 text-blue-300" />
              <div className="text-center space-y-1">
                <h4 className="text-base font-black">{resource.fileName}</h4>
                <p className="text-xs text-blue-200 font-medium">Documento Word de estudio</p>
              </div>
              <button
                onClick={() => alert(`Descargando archivo Word: ${resource.fileName}`)}
                className="mt-2 px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer shadow-lg border-none"
              >
                <Download className="w-4 h-4" />
                Descargar Guía Word
              </button>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer bg-transparent"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
