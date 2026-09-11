import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Compass, Zap, CheckCircle2, ArrowRight, GraduationCap,
  FileText, Play, Download, AlertCircle, ShieldAlert, Sparkles, X, Eye, Lock
} from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { useTeacherStore, type SectionResource, type TeacherCourse, type ModuleCategory } from '../store/useTeacherStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionButton } from '../components/ui/ActionButton';
import { parseResourceToQuestions, type ParsedQuestion } from '../utils/fileQuestionParser';
import { InteractiveQuestionRunner } from '../components/ui/InteractiveQuestionRunner';
import { api } from '../services/api';

export default function CoursesPage() {
  const navigate = useNavigate();
  const store = useProgressStore();
  const { studentEmail, studentName, logout } = store;
  const teacherCourses = useTeacherStore((s) => s.teacherCourses);

  // Active Resource Viewer Modal State
  const [activeModalResource, setActiveModalResource] = useState<SectionResource | null>(null);
  // Active Interactive Question Runner State (Question-by-Question runner)
  const [activeRunnerResource, setActiveRunnerResource] = useState<{
    name: string;
    moduleType: ModuleCategory;
    questions: ParsedQuestion[];
  } | null>(null);

  // H5P Simulation State inside modal
  const [h5pAnswerSelected, setH5pAnswerSelected] = useState<number | null>(null);
  const [h5pSubmitted, setH5pSubmitted] = useState(false);

  // ── API-sourced courses (from DB via JWT) ──────────────────────────────────
  const [apiCourses, setApiCourses] = useState<any[] | null>(null); // null = loading
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchEnrolled() {
      const token = localStorage.getItem('lectormat-token');
      if (!token) {
        setApiCourses([]);
        setApiLoaded(true);
        return;
      }
      try {
        const res = await api.listEnrolledCourses();
        if (cancelled) return;
        if (res.ok && Array.isArray((res as any).data?.data ?? (res as any).data)) {
          const data = (res as any).data?.data ?? (res as any).data;
          setApiCourses(data);
        } else {
          setApiCourses([]);
        }
      } catch {
        setApiCourses([]);
      }
      setApiLoaded(true);
    }
    fetchEnrolled();
    return () => { cancelled = true; };
  }, []);

  const handleOpenResource = (res: SectionResource) => {
    const modType = res.moduleType || 'comprension';
    const questions = (res.parsedQuestions && res.parsedQuestions.length > 0)
      ? res.parsedQuestions
      : parseResourceToQuestions(
          res.extractedText || res.description || res.fileName || res.name,
          res.name,
          modType
        );

    setActiveRunnerResource({
      name: res.name,
      moduleType: modType,
      questions,
    });
  };

  const handleRunnerComplete = (scorePercentage: number) => {
    store.updateProgress({
      m1Completed: scorePercentage >= 60 || store.m1Completed,
      m1SlotsPlaced: Math.max(store.m1SlotsPlaced, 3),
    });
    setActiveRunnerResource(null);
  };

  // ── Resolve assigned courses: API first, then Zustand fallback ────────────
  const cleanEmail = studentEmail?.trim().toLowerCase() || '';
  
  // Courses from Zustand store (teacher-created locally)
  const zustandAssigned = teacherCourses.filter((course) =>
    course.enrolledStudents?.some(
      (s) => s.email.toLowerCase() === cleanEmail || (s.username && s.username.toLowerCase() === cleanEmail)
    )
  );

  // Final list: prefer API courses if loaded, merge with Zustand courses
  let assignedCourses: any[] = apiLoaded
    ? [
        ...(apiCourses ?? []),
        // Add Zustand courses that aren't already in the API list
        ...zustandAssigned.filter(
          (zc) => !(apiCourses ?? []).some((ac: any) => ac.id === zc.id)
        ),
      ]
    : zustandAssigned;

  // Unrestricted access for admin account: see all courses or default curriculum preview
  if (store.role === 'admin' && assignedCourses.length === 0) {
    assignedCourses = teacherCourses.length > 0 ? teacherCourses : [
      {
        id: 'tc-admin-preview',
        name: 'Trigonometría y Geometría (Vista Administrador)',
        description: 'Acceso irrestricto de previsualización para el perfil Administrador.',
        sections: [],
        enrolledStudents: [],
      },
    ];
  }



  // Default system units calculation (for standard curriculum)
  const m1Pct = store.m1Completed ? 100 : Math.round((store.m1SlotsPlaced / 3) * 55);
  const m2Pct = store.m2Completed ? 100 : Math.min(85, store.m2NodesVisited * 30);
  const m3Pct = Math.round((store.m3CompletedLevels / 3) * 100);
  const overallU1 = Math.round((m1Pct + m2Pct + m3Pct) / 3);

  const u2m1Pct = store.u2m1Completed ? 100 : Math.round(((store.u2m1SlotsPlaced || 0) / 4) * 55);
  const u2m2Pct = store.u2m2Completed ? 100 : Math.min(85, (store.u2m2NodesVisited || 0) * 30);
  const u2m3Pct = Math.round(((store.u2m3CompletedLevels || 0) / 3) * 100);
  const overallU2 = Math.round((u2m1Pct + u2m2Pct + u2m3Pct) / 3);

  const u3m1Pct = store.u3m1Completed ? 100 : Math.round(((store.u3m1SlotsPlaced || 0) / 4) * 55);
  const u3m2Pct = store.u3m2Completed ? 100 : Math.min(85, (store.u3m2NodesVisited || 0) * 30);
  const u3m3Pct = Math.round(((store.u3m3CompletedLevels || 0) / 3) * 100);
  const overallU3 = Math.round((u3m1Pct + u3m2Pct + u3m3Pct) / 3);

  const u4m1Pct = store.u4m1Completed ? 100 : Math.round(((store.u4m1SlotsPlaced || 0) / 3) * 100);
  const u4m2Pct = store.u4m2Completed ? 100 : Math.min(85, (store.u4m2NodesVisited || 0) * 30);
  const u4m3Pct = Math.round(((store.u4m3CompletedLevels || 0) / 3) * 100);
  const overallU4 = Math.round((u4m1Pct + u4m2Pct + u4m3Pct) / 3);

  const isAdmin = store.preSpecialty === 'administracion';
  const u3Title = store.preSpecialty === 'mecanica' ? 'Unidad 3: Trigonometría y Geometría' : 'Unidad 3: Progresiones y Sucesiones';

  const defaultCurriculumUnits = [
    {
      id: 'u1',
      unitNum: 1,
      title: 'Unidad 1: Funciones Polinómicas',
      desc: 'Estudio de las funciones polinómicas, análisis de gráficos y aplicación de modelos en situaciones reales.',
      pct: overallU1,
      themeColor: '#00B4C8',
      bgGradient: 'from-[#00B4C8] to-[#0098AA]',
      modules: {
        comprension: [
          { name: 'M1: Comprensión', desc: 'Identificación de variables y arrastre de datos en funciones.', pct: m1Pct, path: '/unit/1/module/1' }
        ],
        metodo: [
          { name: 'M2: Método', desc: 'Construcción paso a paso utilizando árboles de decisión.', pct: m2Pct, path: '/unit/1/module/2' }
        ],
        interactivo: [
          { name: 'M3: Banco', desc: 'Ejercicios interactivos avanzados y problemas escalonados.', pct: m3Pct, path: '/unit/1/module/3' }
        ]
      }
    },
    {
      id: 'u2',
      unitNum: 2,
      title: 'Unidad 2: Funciones Exponenciales',
      desc: 'Modelamiento de crecimiento y decrecimiento exponencial, interés compuesto y análisis logarítmico.',
      pct: overallU2,
      themeColor: '#E87A1E',
      bgGradient: 'from-[#E87A1E] to-[#D96B12]',
      modules: {
        comprension: [
          { name: 'M1: Comprensión', desc: 'Deducción de variables y estructuración de modelos exponenciales.', pct: u2m1Pct, path: '/unit/2/module/1' }
        ],
        metodo: [
          { name: 'M2: Método', desc: 'Clasificador interactivo logarítmico/exponencial.', pct: u2m2Pct, path: '/unit/2/module/2' }
        ],
        interactivo: [
          { name: 'M3: Banco', desc: 'Resolución de problemas aplicados de especialidad.', pct: u2m3Pct, path: '/unit/2/module/3' }
        ]
      }
    },
    {
      id: 'u3',
      unitNum: 3,
      title: u3Title,
      desc: store.preSpecialty === 'mecanica'
        ? 'Aplicación práctica de teoremas trigonométricos, cálculo de ángulos, distancias y vectores en sistemas mecánicos.'
        : 'Cálculo de sucesiones, progresiones aritméticas y geométricas aplicadas al análisis financiero y de producción.',
      pct: overallU3,
      themeColor: '#1B2A5A',
      bgGradient: 'from-[#1B2A5A] to-[#0F1A3A]',
      modules: {
        comprension: [
          { name: 'M1: Comprensión', desc: store.preSpecialty === 'mecanica' ? 'Deduce las medidas y distancias.' : 'Deduce patrones numéricos y razones.', pct: u3m1Pct, path: '/unit/3/module/1' }
        ],
        metodo: [
          { name: 'M2: Método', desc: store.preSpecialty === 'mecanica' ? 'Clasificador de Teoremas y Funciones.' : 'Clasificador de Progresiones Aritméticas/Geométricas.', pct: u3m2Pct, path: '/unit/3/module/2' }
        ],
        interactivo: [
          { name: 'M3: Banco', desc: store.preSpecialty === 'mecanica' ? 'Resolución de problemas de Trigonometría aplicados.' : 'Resolución de problemas de Progresiones aplicados.', pct: u3m3Pct, path: '/unit/3/module/3' }
        ]
      }
    },
    ...(isAdmin ? [
      {
        id: 'u4',
        unitNum: 4,
        title: 'Unidad 4: Aplicaciones para las Finanzas',
        desc: 'Modelado financiero avanzado, cálculo de tasas de interés compuesto, anualidades y amortización.',
        pct: overallU4,
        themeColor: '#8DC63F',
        bgGradient: 'from-[#8DC63F] to-[#78AF2F]',
        modules: {
          comprension: [
            { name: 'M1: Comprensión', desc: 'Identifica variables de valor futuro.', pct: u4m1Pct, path: '/unit/4/module/1' }
          ],
          metodo: [
            { name: 'M2: Método', desc: 'Clasificador de Modelos Financieros.', pct: u4m2Pct, path: '/unit/4/module/2' }
          ],
          interactivo: [
            { name: 'M3: Banco', desc: 'Problemas de interés y anualidad aplicados.', pct: u4m3Pct, path: '/unit/4/module/3' }
          ]
        }
      }
    ] : [])
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-8 w-full pb-16">
      
      {/* ── Page Header ────────────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)] gap-6">
        <div className="space-y-2 flex-1">

          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            Mis Cursos y Unidades
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-3xl">
            Acceso exclusivo a tus asignaturas inscritas. Completa los módulos de comprensión lectora, métodos guiados y ejercicios interactivos.
          </p>
        </div>

      </section>

      {/* ── LOADING STATE ─────────────────────────────────────────────────────── */}
      {!apiLoaded ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-24 text-slate-400"
        >
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
          <p className="text-sm font-semibold">Cargando tus cursos...</p>
        </motion.div>
      ) : assignedCourses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-amber-200/80 p-8 sm:p-12 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.05)] text-center flex flex-col items-center gap-6"
        >

          <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-lg">
            <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase tracking-wider">
              Estado: Pendiente de Inscripción
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Aún no tienes cursos asignados por tu docente
            </h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Para visualizar y acceder a tus asignaturas, tu profesor debe registrarte en la lista oficial del curso.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-md w-full text-left space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              ¿Cómo habilitar tu acceso?
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                Informa a tu profesor tu correo o RUT institucional.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                El docente cargará el PDF de lista INACAP en el sistema.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                Tus asignaturas y unidades aparecerán automáticamente en esta pantalla.
              </li>
            </ul>
          </div>


        </motion.div>
      ) : (

        /* ── ASSIGNED COURSES LIST ────────────────────────────────────────────── */
        <div className="flex flex-col gap-12">
          {assignedCourses.map((course: any) => {
            // Find student's assigned section in this course if specified
            const studentInfo = course.enrolledStudents?.find(
              (s: any) => s.email.toLowerCase() === cleanEmail || (s.username && s.username.toLowerCase() === cleanEmail)
            );
            const assignedSectionId = studentInfo?.sectionId;

            // Sections to render: filtered to assigned section if present, else all sections in course
            const sectionsToRender = (course.sections ?? []).filter((sec: any) =>
              assignedSectionId ? sec.id === assignedSectionId : true
            );

            return (
              <div key={course.id} className="flex flex-col gap-6">
                
                {/* Course Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                  
                  <div className="space-y-3 relative z-10 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-400/20">
                        Asignatura Asignada
                      </span>
                      {studentInfo?.sectionTitle && (
                        <span className="text-[10px] font-black bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full uppercase tracking-wider border border-orange-400/20">
                          Sección: {studentInfo.sectionTitle}
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">{course.name}</h2>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed">
                      {course.description || 'Nivelación Matemática aplicada con módulos adaptativos por unidad.'}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-center relative z-10 shrink-0">
                    <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
                      <p className="text-[9px] font-black uppercase text-slate-300 tracking-wider">Inscripción Confirmada</p>
                      <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Acceso Autorizado
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sections & Units inside Course */}
                {sectionsToRender.length === 0 ? (
                  /* If course has no sections defined yet, fall back to default curriculum units */
                  <div className="grid grid-cols-1 gap-8">
                    {defaultCurriculumUnits.map((unit) => (
                      <UnitCardRender key={unit.id} unit={unit} navigate={navigate} onOpenResource={handleOpenResource} />
                    ))}
                  </div>
                ) : (
                  sectionsToRender.map((section: any) => (
                    <div key={section.id} className="flex flex-col gap-6">
                      
                      {/* Section Banner */}
                      <div className="flex items-center gap-3 px-2 border-b border-slate-200/80 pb-3">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                          Sección: {section.title}
                        </h3>
                        <span className="text-xs font-bold text-slate-400">
                          ({(section.units ?? []).length > 0 ? `${section.units.length} unidades creadas` : 'Programa estándar LectorMat'})
                        </span>
                      </div>

                      {/* Units rendering */}
                      {(section.units ?? []).length === 0 ? (
                        /* Default curriculum units if section has no custom units */
                        <div className="grid grid-cols-1 gap-8">
                          {defaultCurriculumUnits.map((unit) => (
                            <UnitCardRender key={unit.id} unit={unit} navigate={navigate} onOpenResource={handleOpenResource} />
                          ))}
                        </div>
                      ) : (
                        section.units.map((unit: any, uIdx: number) => {
                          const themeColors = ['#00B4C8', '#E87A1E', '#1B2A5A', '#8DC63F'];
                          const color = themeColors[uIdx % themeColors.length];

                          
                          return (
                            <div
                              key={unit.id}
                              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col xl:flex-row"
                            >
                              {/* Left Banner */}
                              <div
                                className="xl:w-[320px] shrink-0 p-8 text-white flex flex-col justify-between relative"
                                style={{ background: `linear-gradient(135deg, ${color}, ${color}DD)` }}
                              >
                                <div className="space-y-4 relative z-10">
                                  <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider border border-white/15">
                                    Unidad {unit.order}
                                  </span>
                                  <h3 className="text-2xl font-black tracking-tight leading-tight mt-2">{unit.title}</h3>
                                  {unit.subtitle && (
                                    <p className="text-xs text-white/80 leading-relaxed font-medium">{unit.subtitle}</p>
                                  )}
                                </div>

                                <div className="mt-8 space-y-2 relative z-10">
                                  <div className="flex justify-between text-xs font-black uppercase text-white/90">
                                    <span>Avance Módulos</span>
                                    <span>Activo</span>
                                  </div>
                                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full w-1/3" />
                                  </div>
                                </div>
                              </div>

                              {/* Right: 3 Modality Cards */}
                              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-6 bg-slate-50/40">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                  Módulos y Materiales de Aprendizaje
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* M1: Comprensión */}
                                  <ModalityCard
                                    title="M1: Comprensión"
                                    desc="Lectura contextualizada y deducción de variables."
                                    icon={BookOpen}
                                    accentBg="#E0F7FA"
                                    accentColor="#00B4C8"
                                    resources={unit.modules?.comprension || []}
                                    defaultPath={`/unit/${Math.min(unit.order, 4)}/module/1`}
                                    navigate={navigate}
                                    onOpenResource={handleOpenResource}
                                  />

                                  {/* M2: Método */}
                                  <ModalityCard
                                    title="M2: Método"
                                    desc="Árboles de decisión y modelos clasificados."
                                    icon={Compass}
                                    accentBg="#E8F5E9"
                                    accentColor="#8DC63F"
                                    resources={unit.modules?.metodo || []}
                                    defaultPath={`/unit/${Math.min(unit.order, 4)}/module/2`}
                                    navigate={navigate}
                                    onOpenResource={handleOpenResource}
                                  />

                                  {/* M3: Interactivo */}
                                  <ModalityCard
                                    title="M3: Banco Interactivo"
                                    desc="Ejercicios escalonados con retroalimentación."
                                    icon={Zap}
                                    accentBg="#FFF3E0"
                                    accentColor="#E87A1E"
                                    resources={unit.modules?.interactivo || []}
                                    defaultPath={`/unit/${Math.min(unit.order, 4)}/module/3`}
                                    navigate={navigate}
                                    onOpenResource={handleOpenResource}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── RESOURCE PREVIEW / PLAY MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {activeModalResource && (
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
                    {activeModalResource.resourceType === 'h5p' ? (
                      <Sparkles className="w-6 h-6" />
                    ) : activeModalResource.resourceType === 'pdf' ? (
                      <FileText className="w-6 h-6 text-red-500" />
                    ) : (
                      <FileText className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {activeModalResource.resourceType.toUpperCase()} Material
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900">{activeModalResource.name}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalResource(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Resource Content Player / Viewer */}
              {activeModalResource.resourceType === 'h5p' ? (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <StatusBadge tone="blue" icon={<Sparkles className="w-3.5 h-3.5" />}>
                      Actividad Interactiva H5P
                    </StatusBadge>
                    <span className="text-xs font-bold text-slate-400">Puntaje: 100 pts</span>
                  </div>

                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {activeModalResource.description || 'Responde la siguiente pregunta de práctica interactiva para validar tu conocimiento:'}
                  </p>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-900">
                      ¿Cuál de las siguientes afirmaciones caracteriza a un modelo exponencial?
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Crece o decrece con una tasa porcentual constante por unidad de tiempo',
                        'Mantiene un incremento lineal fijo en cada intervalo',
                        'Es siempre simétrico respecto al eje de ordenadas',
                        'Tiene una pendiente constante en todo su dominio'
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
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-sm transition-colors cursor-pointer shadow-md shadow-blue-600/20"
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
                            ? 'Los modelos exponenciales varían proporcionalmente según una razón constante.'
                            : 'Intenta nuevamente revisando las propiedades de la función exponencial.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeModalResource.resourceType === 'pdf' ? (
                <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col items-center justify-center gap-4 min-h-[220px]">
                  <FileText className="w-16 h-16 text-red-400 animate-pulse" />
                  <div className="text-center space-y-1">
                    <h4 className="text-base font-black">{activeModalResource.fileName}</h4>
                    <p className="text-xs text-slate-400 font-medium">Documento de Lectura PDF listo para revisar</p>
                  </div>
                  <a
                    href={`#download-${activeModalResource.id}`}
                    onClick={(e) => { e.preventDefault(); alert(`Descargando documento PDF: ${activeModalResource.fileName}`); }}
                    className="mt-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-600/20"
                  >
                    <Download className="w-4 h-4" />
                    Abrir PDF en pantalla completa
                  </a>
                </div>
              ) : (
                <div className="bg-blue-900/90 rounded-3xl p-8 text-white flex flex-col items-center justify-center gap-4 min-h-[220px]">
                  <FileText className="w-16 h-16 text-blue-300" />
                  <div className="text-center space-y-1">
                    <h4 className="text-base font-black">{activeModalResource.fileName}</h4>
                    <p className="text-xs text-blue-200 font-medium">Documento Word de estudio</p>
                  </div>
                  <button
                    onClick={() => alert(`Descargando archivo Word: ${activeModalResource.fileName}`)}
                    className="mt-2 px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Guía Word
                  </button>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveModalResource(null)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Step-by-Step Interactive Question Runner */}
        {activeRunnerResource && (
          <InteractiveQuestionRunner
            resourceName={activeRunnerResource.name}
            moduleType={activeRunnerResource.moduleType}
            questions={activeRunnerResource.questions}
            onClose={() => setActiveRunnerResource(null)}
            onComplete={handleRunnerComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Modality Card Component ───────────────────────────────────────────────────
interface ModalityCardProps {
  title: string;
  desc: string;
  icon: React.ElementType;
  accentBg: string;
  accentColor: string;
  resources: SectionResource[];
  defaultPath: string;
  navigate: (path: string) => void;
  onOpenResource: (res: SectionResource) => void;
}

function ModalityCard({
  title,
  desc,
  icon: Icon,
  accentBg,
  accentColor,
  resources,
  defaultPath,
  navigate,
  onOpenResource
}: ModalityCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between gap-5 transition-all duration-300 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: accentBg, color: accentColor }}
          >
            <Icon className="w-6 h-6" />
          </div>
          {resources.length > 0 && (
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {resources.length} {resources.length === 1 ? 'recurso' : 'recursos'}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
        </div>

        {/* Uploaded Teacher Resources for this Modality */}
        {resources.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Materiales Adjuntos</p>
            <div className="space-y-1.5">
              {resources.map((res) => (
                <button
                  key={res.id}
                  onClick={() => onOpenResource(res)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-colors flex items-center justify-between gap-2 group/res cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {res.resourceType === 'h5p' ? (
                      <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    ) : res.resourceType === 'pdf' ? (
                      <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-slate-700 group-hover/res:text-blue-600 truncate">
                      {res.name}
                    </span>
                  </div>
                  <Eye className="w-3.5 h-3.5 text-slate-400 group-hover/res:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(defaultPath)}
        className="w-full pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none"
      >
        <span>Iniciar Módulo</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}

// ── Default Curriculum Unit Card Renderer ─────────────────────────────────────
function UnitCardRender({
  unit,
  navigate,
  onOpenResource
}: {
  unit: any;
  navigate: (path: string) => void;
  onOpenResource: (res: SectionResource) => void;
}) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col xl:flex-row">
      <div className={`xl:w-[320px] shrink-0 bg-gradient-to-br ${unit.bgGradient} p-8 text-white flex flex-col justify-between relative`}>
        <div className="space-y-4 relative z-10">
          <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider border border-white/15">
            Unidad {unit.unitNum}
          </span>
          <h3 className="text-2xl font-black tracking-tight leading-tight mt-2">{unit.title}</h3>
          <p className="text-xs text-white/80 leading-relaxed font-medium">{unit.desc}</p>
        </div>

        <div className="mt-8 space-y-2 relative z-10">
          <div className="flex justify-between text-xs font-black uppercase text-white/90">
            <span>Progreso Unidad</span>
            <span>{unit.pct}%</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${unit.pct}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-6 bg-slate-50/40">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Módulos de Aprendizaje</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModalityCard
            title="M1: Comprensión"
            desc="Identificación de variables y deducción de relaciones."
            icon={BookOpen}
            accentBg="#E0F7FA"
            accentColor="#00B4C8"
            resources={[]}
            defaultPath={`/unit/${unit.unitNum}/module/1`}
            navigate={navigate}
            onOpenResource={onOpenResource}
          />
          <ModalityCard
            title="M2: Método"
            desc="Árboles de decisión y modelamiento paso a paso."
            icon={Compass}
            accentBg="#E8F5E9"
            accentColor="#8DC63F"
            resources={[]}
            defaultPath={`/unit/${unit.unitNum}/module/2`}
            navigate={navigate}
            onOpenResource={onOpenResource}
          />
          <ModalityCard
            title="M3: Banco"
            desc="Problemas interactivos aplicados con retroalimentación."
            icon={Zap}
            accentBg="#FFF3E0"
            accentColor="#E87A1E"
            resources={[]}
            defaultPath={`/unit/${unit.unitNum}/module/3`}
            navigate={navigate}
            onOpenResource={onOpenResource}
          />
        </div>
      </div>
    </div>
  );
}
