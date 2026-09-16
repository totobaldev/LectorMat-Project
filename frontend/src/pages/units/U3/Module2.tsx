import React from 'react';
import { TeacherResources } from '../../../components/ui/TeacherResources';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, GitMerge } from 'lucide-react';
import DecisionTree from '../../../features/decision-tree/components/DecisionTree';
import { u3Nodes } from '../../../features/decision-tree/data/u3Nodes';
import { useProgressStore } from '../../../store/useProgressStore';

const U3Module2: React.FC = () => {
  const isCompleted = useProgressStore((s) => s.progress.units[3].isCompleted);

  return (
    /* Fondo base slate-50 — tarjetas bg-white levitan sobre él */
    <div className="min-h-full bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-7">

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al Dashboard
        </Link>

        {/* ── Page header card ────────────────────────────────────── */}
        <header
          className="bg-white rounded-[2rem] border border-slate-100 px-10 py-8 flex flex-col gap-5"
          style={{ boxShadow: '0 8px 30px rgb(0,0,0,0.04)' }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {/* Module icon */}
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <GitMerge className="w-7 h-7" />
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Unidad 3 · Trigonometría
                </p>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Módulo 2: Identificación del Método
                </h1>
              </div>
            </div>

            {isCompleted && (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black px-4 py-2 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completado
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
            Responde las preguntas del árbol de decisión para identificar el método
            trigonométrico correcto según las condiciones de tu problema. Tu recorrido
            queda registrado en el panel de la derecha.
          </p>

          {/* Mini legend */}
          <div className="flex items-center gap-6 pt-1">
            <span className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              Respuesta Sí
            </span>
            <span className="flex items-center gap-2 text-xs font-bold text-orange-500">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              Respuesta No
            </span>
            <span className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Método identificado
            </span>
          </div>
        </header>

      <TeacherResources unitId="u3" moduleType="metodo" />

        {/* ── Situación a Analizar ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="space-y-2 relative z-10 flex-1">
            <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Situación a analizar</span>
            
            {useProgressStore().preSpecialty === 'mecanica' ? (
              <>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Mantenimiento de Brazo Hidráulico</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Se requiere calcular la extensión necesaria de un brazo hidráulico (hipotenusa) para levantar una carga pesada. Conoces la altura vertical que debe alcanzar y la distancia horizontal desde la base, formando un triángulo rectángulo. Utiliza el árbol de decisión para descubrir qué teorema trigonométrico usarías.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Proyección de Producción Anual</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Una fábrica ensambla 500 unidades en el primer mes y decide aumentar la producción agregando 50 unidades fijas adicionales cada mes consecutivo. Se busca determinar cuántas unidades producirá exactamente en el mes 12. Utiliza el árbol de decisión para identificar qué progresión corresponde a este problema.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Decision Tree ──────────────────────────────────────── */}
        <DecisionTree nodes={u3Nodes} />

      </div>
    </div>
  );
};

export default U3Module2;
