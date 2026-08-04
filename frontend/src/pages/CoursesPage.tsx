import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFrontProps } from '../hooks/useFrontProps';
import { BookOpen, Compass, Zap, CheckCircle2, ArrowRight, GraduationCap } from 'lucide-react';

export default function CoursesPage() {
  const navigate = useNavigate();
  const { progress } = useFrontProps();

  // ── Progress calculations ──────────────────────────────────────────────────
  const m1Pct = progress.m1Completed ? 100 : Math.round((progress.m1SlotsPlaced / 3) * 55);
  const m2Pct = progress.m2Completed ? 100 : Math.min(85, progress.m2NodesVisited * 30);
  const m3Pct = Math.round((progress.m3CompletedLevels / 3) * 100);
  const overallU1 = Math.round((m1Pct + m2Pct + m3Pct) / 3);

  const u2m1Pct = progress.u2m1Completed ? 100 : Math.round(((progress.u2m1SlotsPlaced || 0) / 4) * 55);
  const u2m2Pct = progress.u2m2Completed ? 100 : Math.min(85, (progress.u2m2NodesVisited || 0) * 30);
  const u2m3Pct = Math.round(((progress.u2m3CompletedLevels || 0) / 3) * 100);
  const overallU2 = Math.round((u2m1Pct + u2m2Pct + u2m3Pct) / 3);

  const u3m1Pct = progress.u3m1Completed ? 100 : Math.round(((progress.u3m1SlotsPlaced || 0) / 4) * 55);
  const u3m2Pct = progress.u3m2Completed ? 100 : Math.min(85, (progress.u3m2NodesVisited || 0) * 30);
  const u3m3Pct = Math.round(((progress.u3m3CompletedLevels || 0) / 3) * 100);
  const overallU3 = Math.round((u3m1Pct + u3m2Pct + u3m3Pct) / 3);

  const u4m1Pct = progress.u4m1Completed ? 100 : Math.round(((progress.u4m1SlotsPlaced || 0) / 3) * 100);
  const u4m2Pct = progress.u4m2Completed ? 100 : Math.min(85, (progress.u4m2NodesVisited || 0) * 30);
  const u4m3Pct = Math.round(((progress.u4m3CompletedLevels || 0) / 3) * 100);
  const overallU4 = Math.round((u4m1Pct + u4m2Pct + u4m3Pct) / 3);

  const isAdmin = progress.preSpecialty === 'administracion';
  const u3Title = progress.preSpecialty === 'mecanica' ? 'Unidad 3: Trigonometría y Geometría' : 'Unidad 3: Progresiones y Sucesiones';

  // ── Courses array ─────────────────────────────────────────────────────────
  const units = [
    {
      id: 1,
      title: 'Unidad 1: Funciones Polinómicas',
      desc: 'Estudio de las funciones polinómicas, análisis de gráficos y aplicación de modelos en situaciones reales.',
      pct: overallU1,
      themeColor: '#00B4C8', // Teal
      bgGradient: 'from-[#00B4C8] to-[#0098AA]',
      modules: [
        { name: 'M1: Comprensión', desc: 'Identificación de variables y arrastre de datos en funciones.', pct: m1Pct, path: '/unit/1/module/1' },
        { name: 'M2: Método', desc: 'Construcción paso a paso utilizando árboles de decisión.', pct: m2Pct, path: '/unit/1/module/2' },
        { name: 'M3: Banco', desc: 'Ejercicios interactivos avanzados y problemas escalonados.', pct: m3Pct, path: '/unit/1/module/3' }
      ]
    },
    {
      id: 2,
      title: 'Unidad 2: Funciones Exponenciales',
      desc: 'Modelamiento de crecimiento y decrecimiento exponencial, interés compuesto y análisis logarítmico.',
      pct: overallU2,
      themeColor: '#E87A1E', // Orange
      bgGradient: 'from-[#E87A1E] to-[#D96B12]',
      modules: [
        { name: 'M1: Comprensión', desc: 'Deducción de variables y estructuración de modelos exponenciales.', pct: u2m1Pct, path: '/unit/2/module/1' },
        { name: 'M2: Método', desc: 'Clasificador interactivo logarítmico/exponencial.', pct: u2m2Pct, path: '/unit/2/module/2' },
        { name: 'M3: Banco', desc: 'Resolución de problemas aplicados de especialidad.', pct: u2m3Pct, path: '/unit/2/module/3' }
      ]
    },
    {
      id: 3,
      title: u3Title,
      desc: progress.preSpecialty === 'mecanica' 
        ? 'Aplicación práctica de teoremas trigonométricos, cálculo de ángulos, distancias y vectores en sistemas mecánicos.'
        : 'Cálculo de sucesiones, progresiones aritméticas y geométricas aplicadas al análisis financiero y de producción.',
      pct: overallU3,
      themeColor: '#1B2A5A', // Navy
      bgGradient: 'from-[#1B2A5A] to-[#0F1A3A]',
      modules: [
        { name: 'M1: Comprensión', desc: progress.preSpecialty === 'mecanica' ? 'Deduce las medidas y distancias.' : 'Deduce patrones numéricos y razones.', pct: u3m1Pct, path: '/unit/3/module/1' },
        { name: 'M2: Método', desc: progress.preSpecialty === 'mecanica' ? 'Clasificador de Teoremas y Funciones.' : 'Clasificador de Progresiones Aritméticas/Geométricas.', pct: u3m2Pct, path: '/unit/3/module/2' },
        { name: 'M3: Banco', desc: progress.preSpecialty === 'mecanica' ? 'Resolución de problemas de Trigonometría aplicados.' : 'Resolución de problemas de Progresiones aplicados.', pct: u3m3Pct, path: '/unit/3/module/3' }
      ]
    },
    ...(isAdmin ? [
      {
        id: 4,
        title: 'Unidad 4: Aplicaciones para las Finanzas',
        desc: 'Modelado financiero avanzado, cálculo de tasas de interés compuesto, anualidades y amortización.',
        pct: overallU4,
        themeColor: '#8DC63F', // Lime
        bgGradient: 'from-[#8DC63F] to-[#78AF2F]',
        modules: [
          { name: 'M1: Comprensión', desc: 'Identifica variables de valor futuro.', pct: u4m1Pct, path: '/unit/4/module/1' },
          { name: 'M2: Método', desc: 'Clasificador de Modelos Financieros.', pct: u4m2Pct, path: '/unit/4/module/2' },
          { name: 'M3: Banco', desc: 'Problemas de interés y anualidad aplicados.', pct: u4m3Pct, path: '/unit/4/module/3' }
        ]
      }
    ] : [])
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-10 w-full pb-16">
      
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] gap-6">
        <div className="space-y-1.5 flex-1">
          <span className="text-[10px] font-black text-[#00B4C8] bg-[#E0F7FA] px-3 py-1 rounded-full uppercase tracking-wider">
            Plan de Estudio
          </span>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none mt-2">Mis Cursos y Unidades</h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium mt-3 leading-relaxed">
            Aquí encontrarás todas las unidades correspondientes a tu carrera. Completa los módulos de comprensión, método y banco de ejercicios para avanzar en tu ruta de aprendizaje.
          </p>
        </div>

        {progress.career && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 shrink-0 min-w-[280px]">
            <div className="w-12 h-12 rounded-xl bg-[#00B4C8] text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Carrera Inscrita</p>
              <p className="text-sm font-extrabold text-slate-800 truncate">{progress.career}</p>
            </div>
          </div>
        )}
      </section>

      {/* Grid of Unit Cards */}
      <div className="grid grid-cols-1 gap-8">
        {units.map((unit) => (
          <div 
            key={unit.id}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col xl:flex-row"
          >
            {/* Left/Top Banner: Unit Summary */}
            <div className={`xl:w-[320px] shrink-0 bg-gradient-to-br ${unit.bgGradient} p-8 text-white flex flex-col justify-between relative`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-6 -translate-y-6" />
              
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider border border-white/15">
                  Unidad {unit.id}
                </span>
                <h2 className="text-2xl font-black tracking-tight leading-tight mt-2">{unit.title}</h2>
                <p className="text-xs text-white/80 leading-relaxed font-medium">{unit.desc}</p>
              </div>

              <div className="mt-8 xl:mt-0 space-y-2 relative z-10">
                <div className="flex justify-between text-xs font-black uppercase text-white/90">
                  <span>Progreso Unidad</span>
                  <span>{unit.pct}%</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000" 
                    style={{ width: `${unit.pct}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Right/Bottom: Modules List */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-6 bg-slate-50/45">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Módulos de Aprendizaje</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {unit.modules.map((mod, index) => {
                  const Icon = index === 0 ? BookOpen : index === 1 ? Compass : Zap;
                  const accentBg = index === 0 ? '#E0F7FA' : index === 1 ? '#E8F5E9' : '#FFF3E0';
                  const accentColor = index === 0 ? '#00B4C8' : index === 1 ? '#8DC63F' : '#E87A1E';

                  return (
                    <button
                      key={mod.name}
                      onClick={() => navigate(mod.path)}
                      className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-slate-300 shadow-sm flex flex-col gap-4 text-left hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: accentBg, color: accentColor }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        {mod.pct === 100 ? (
                          <span className="bg-emerald-500 text-white p-1 rounded-full"><CheckCircle2 className="w-4 h-4" /></span>
                        ) : (
                          <span 
                            className="text-[10px] font-black px-2.5 py-0.5 rounded-full border"
                            style={{ color: unit.themeColor, borderColor: `${unit.themeColor}30`, backgroundColor: `${unit.themeColor}08` }}
                          >
                            {mod.pct}%
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#00B4C8] transition-colors">{mod.name}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{mod.desc}</p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-black uppercase text-slate-400 group-hover:text-[#00B4C8] transition-colors">
                        <span>Iniciar módulo</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
