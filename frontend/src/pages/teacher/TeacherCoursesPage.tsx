import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, BookOpen, ChevronRight, Layers, X, FileText, Calendar } from 'lucide-react';
import { useTeacherStore } from '../../store/useTeacherStore';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherCoursesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { teacherCourses, addTeacherCourse } = useTeacherStore();

  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [error, setError] = useState('');

  // Success Confirmation Modal
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
  });

  // Auto-open modal when navigated from sidebar "Nuevo Curso" button
  useEffect(() => {
    const state = location.state as { openModal?: boolean } | null;
    if (state?.openModal) {
      setShowModal(true);
      // Clear state so back navigation doesn't re-trigger
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const handleCreate = () => {
    const trimmedName = courseName.trim();
    if (!trimmedName) {
      setError('El nombre del curso es obligatorio.');
      return;
    }
    addTeacherCourse(trimmedName, courseDesc.trim());
    setCourseName('');
    setCourseDesc('');
    setError('');
    setShowModal(false);

    // Show success confirmation popup
    setSuccessModalData({
      isOpen: true,
      title: '¡Curso creado con éxito!',
      description: `El curso "${trimmedName}" fue registrado sin secciones por defecto. Puedes ingresar a él para añadir tus secciones y materiales.`,
    });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });


  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto flex flex-col gap-8 pb-16 w-full">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="inline-block text-[10px] font-black text-[#1B2A5A] bg-[#1B2A5A]/08 px-3 py-1 rounded-full uppercase tracking-wider border border-[#1B2A5A]/12">
            Panel Docente
          </span>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none mt-2">
            Mis Cursos
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
            Crea y organiza tus cursos. Añade secciones y actividades H5P interactivas para tus estudiantes.
          </p>
        </div>

        <button
          id="btn-add-course"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1B2A5A] text-white font-extrabold text-sm shadow-lg shadow-[#1B2A5A]/20 hover:bg-[#263d7a] transition-all duration-200 cursor-pointer border-none shrink-0"
        >
          <Plus className="w-5 h-5" />
          Añadir Curso
        </button>
      </section>

      {/* ── Course Grid ───────────────────────────────────────────────────── */}
      {teacherCourses.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 border border-slate-100 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center">
            <BookOpen className="w-9 h-9 text-slate-300" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-700">Aún no tienes cursos</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            Crea tu primer curso haciendo clic en "Añadir Curso" y comenzarás a organizar tu contenido.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2A5A] text-white text-sm font-bold cursor-pointer border-none hover:bg-[#263d7a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear primer curso
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherCourses.map((course) => {
            const totalResources = course.sections.reduce((acc, s) => acc + s.resources.length, 0);
            return (
              <button
                key={course.id}
                id={`course-card-${course.id}`}
                onClick={() => navigate(`/teacher/courses/${course.id}`)}
                className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.04)] text-left flex flex-col gap-5 hover:border-[#1B2A5A]/20 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B2A5A]/08 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-[#1B2A5A]" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1B2A5A] transition-colors mt-1" />
                </div>

                {/* Course info */}
                <div className="space-y-1.5 flex-1">
                  <h2 className="text-lg font-extrabold text-slate-900 leading-snug group-hover:text-[#1B2A5A] transition-colors line-clamp-2">
                    {course.name}
                  </h2>
                  {course.description && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>

                {/* Footer stats */}
                <div className="border-t border-slate-100 pt-4 flex items-center gap-5 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {course.sections.length} sección{course.sections.length !== 1 ? 'es' : ''}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {totalResources} recurso{totalResources !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1.5 ml-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(course.createdAt)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Add Course Modal ──────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,26,58,0.35)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* Modal header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Añadir Curso</h2>
                <p className="text-sm text-slate-500 mt-0.5">Define el nombre y descripción del nuevo curso.</p>
              </div>
              <button
                id="btn-close-modal"
                onClick={() => { setShowModal(false); setError(''); }}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-5">
              {/* Nombre */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider" htmlFor="input-course-name">
                  Nombre del Curso <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-course-name"
                  type="text"
                  value={courseName}
                  onChange={(e) => { setCourseName(e.target.value); setError(''); }}
                  placeholder="ej. MAT101 · Matemática Básica Aplicada"
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30 focus:border-[#1B2A5A]/50 transition-all"
                />
                {error && (
                  <span className="text-xs text-red-500 font-bold">{error}</span>
                )}
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider" htmlFor="input-course-desc">
                  Descripción
                </label>
                <textarea
                  id="input-course-desc"
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Describe brevemente el objetivo y contenido del curso..."
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30 focus:border-[#1B2A5A]/50 transition-all resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => { setShowModal(false); setError(''); }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-add-course"
                onClick={handleCreate}
                className="px-6 py-2.5 rounded-xl bg-[#1B2A5A] text-white font-extrabold text-sm hover:bg-[#263d7a] transition-colors cursor-pointer border-none shadow-md shadow-[#1B2A5A]/15"
              >
                Crear Curso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Confirmation Popup ────────────────────────────────────── */}
      <ConfirmModal
        isOpen={successModalData.isOpen}
        onClose={() => setSuccessModalData((prev) => ({ ...prev, isOpen: false }))}
        title={successModalData.title}
        description={successModalData.description}
        variant="success"
        confirmText="Entendido"
      />
    </div>
  );
}

