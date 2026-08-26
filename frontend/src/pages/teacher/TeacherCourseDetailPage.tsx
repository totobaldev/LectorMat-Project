import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight, Plus, Layers, FileCode2, X, Package,
  ArrowLeft, MoreHorizontal, Users, UserPlus, Trash2, Mail, GraduationCap
} from 'lucide-react';
import { useTeacherStore, globalStudents } from '../../store/useTeacherStore';

// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { teacherCourses, addSection, enrollStudent, unenrollStudent } = useTeacherStore();

  const course = teacherCourses.find((c) => c.id === courseId);

  // Tab State: 'content' | 'participants'
  const [activeTab, setActiveTab] = useState<'content' | 'participants'>('content');

  // Modal: add section
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');

  // Modal: add resource/activity selector (for which section)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Modal: Enroll Student
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const handleAddSection = () => {
    if (!courseId) return;
    const order = (course?.sections.length ?? 0) + 1;
    addSection(courseId, sectionTitle.trim() || `Sección ${order}`);
    setSectionTitle('');
    setShowSectionModal(false);
  };

  const handleEnroll = () => {
    if (!courseId || !selectedStudentId || !course) return;
    const student = globalStudents.find(s => s.id === selectedStudentId);
    if (!student) return;

    // Check if already enrolled
    const isEnrolled = course.enrolledStudents.some(s => s.email === student.email);
    if (isEnrolled) {
      alert('El estudiante ya está matriculado.');
      return;
    }

    enrollStudent(courseId, student.name, student.email, student.career);
    setSelectedStudentId('');
    setShowEnrollModal(false);
  };

  const handleAddH5P = (sectionId: string) => {
    navigate(`/teacher/courses/${courseId}/resource/new?sectionId=${sectionId}`);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (!course) {
    return (
      <div className="p-10 text-center text-slate-500 font-bold">
        Curso no encontrado.{' '}
        <button onClick={() => navigate('/teacher/courses')} className="text-[#1B2A5A] underline cursor-pointer border-none bg-transparent">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto flex flex-col gap-8 pb-16 w-full animate-in fade-in duration-300">

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-sm font-bold text-slate-400">
        <button
          onClick={() => navigate('/teacher/courses')}
          className="flex items-center gap-1.5 hover:text-[#1B2A5A] transition-colors cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Mis Cursos
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-700 truncate max-w-[300px]">{course.name}</span>
      </nav>

      {/* ── Course Header ─────────────────────────────────────────────────── */}
      <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <span className="inline-block text-[10px] font-black text-orange-700 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider border border-orange-200">
            {course.sections.length} sección{course.sections.length !== 1 ? 'es' : ''} · {course.enrolledStudents?.length ?? 0} estudiantes
          </span>
          <h1 className="text-3xl font-black text-slate-955 tracking-tight leading-snug mt-2 max-w-xl">
            {course.name}
          </h1>
          {course.description && (
            <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
              {course.description}
            </p>
          )}
        </div>

        <div className="flex gap-3 shrink-0">
          {activeTab === 'content' ? (
            <button
              id="btn-add-section"
              onClick={() => setShowSectionModal(true)}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#1B2A5A] text-white font-extrabold text-sm shadow-md shadow-[#1B2A5A]/15 hover:bg-[#263d7a] transition-all duration-200 cursor-pointer border-none"
            >
              <Plus className="w-5 h-5" />
              Añadir sección
            </button>
          ) : (
            <button
              id="btn-enroll-student"
              onClick={() => setShowEnrollModal(true)}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-orange-500 text-white font-extrabold text-sm shadow-md shadow-orange-500/15 hover:bg-orange-600 transition-all duration-200 cursor-pointer border-none"
            >
              <UserPlus className="w-5 h-5" />
              Matricular estudiante
            </button>
          )}
        </div>
      </section>

      {/* ── Tabs Navigation ────────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-4 text-sm font-extrabold transition-all border-b-2 cursor-pointer bg-transparent border-none ${
            activeTab === 'content'
              ? 'border-[#1B2A5A] text-[#1B2A5A]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Contenido
          </span>
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`pb-4 text-sm font-extrabold transition-all border-b-2 cursor-pointer bg-transparent border-none ${
            activeTab === 'participants'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Participantes ({course.enrolledStudents?.length ?? 0})
          </span>
        </button>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────────────── */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {course.sections.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 border border-slate-100 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center">
                <Layers className="w-9 h-9 text-slate-300" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-700">Sin secciones aún</h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Las secciones organizan el contenido del curso. Crea la primera para empezar a añadir actividades H5P.
              </p>
              <button
                onClick={() => setShowSectionModal(true)}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2A5A] text-white text-sm font-bold cursor-pointer border-none hover:bg-[#263d7a] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear primera sección
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {course.sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.03)] overflow-hidden"
                >
                  <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#1B2A5A]/10 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-[#1B2A5A]" />
                      </div>
                      <h2 className="text-base font-extrabold text-slate-900">{section.title}</h2>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {section.resources.length} recurso{section.resources.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      id={`btn-add-resource-${section.id}`}
                      onClick={() => setActiveSectionId(section.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-[#1B2A5A] bg-[#1B2A5A]/08 hover:bg-[#1B2A5A]/14 transition-colors cursor-pointer border border-[#1B2A5A]/12"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Añadir recurso / actividad
                    </button>
                  </div>

                  {section.resources.length === 0 ? (
                    <div className="px-8 py-10 text-center text-sm text-slate-400 font-medium">
                      Esta sección no tiene recursos todavía.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {section.resources.map((res) => (
                        <div key={res.id} className="flex items-center gap-4 px-8 py-4 hover:bg-slate-50/60 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <FileCode2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-extrabold text-slate-800 truncate">{res.name}</p>
                            <p className="text-xs text-slate-400 font-medium truncate">{res.description}</p>
                          </div>
                          <div className="text-right shrink-0 text-xs text-slate-400 font-bold space-y-0.5">
                            <p className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">H5P</p>
                            {res.fileSize && <p className="block">{formatSize(res.fileSize)}</p>}
                            <p className="block">{formatDate(res.createdAt)}</p>
                          </div>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer bg-transparent border-none transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="space-y-6">
          {!course.enrolledStudents || course.enrolledStudents.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 border border-slate-100 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center">
                <Users className="w-9 h-9 text-slate-300" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-700">Sin participantes matriculados</h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Matricula estudiantes para que puedan ver e interactuar con este curso.
              </p>
              <button
                onClick={() => setShowEnrollModal(true)}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold cursor-pointer border-none hover:bg-orange-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Matricular primer estudiante
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.03)] overflow-hidden animate-in fade-in duration-200">
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_60px] gap-4 px-7 py-4 border-b border-slate-100 bg-slate-50/70 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Estudiante</span>
                <span>Email</span>
                <span>Carrera</span>
                <span>Matriculado el</span>
                <span className="text-center">Acciones</span>
              </div>
              <div className="divide-y divide-slate-100">
                {course.enrolledStudents.map((std) => (
                  <div key={std.id} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_60px] gap-4 px-7 py-4 items-center hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm">
                        {std.name.charAt(0)}
                      </div>
                      <span className="text-sm font-extrabold text-slate-800">{std.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {std.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 truncate">
                      <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                      {std.career}
                    </div>
                    <span className="text-xs text-slate-400 font-bold">{formatDate(std.dateEnrolled)}</span>
                    <div className="text-center">
                      <button
                        onClick={() => unenrollStudent(course.id, std.id)}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center mx-auto"
                        title="Desmatricular"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Add Section Modal ─────────────────────────────────────────────── */}
      {showSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,26,58,0.35)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Añadir Sección</h2>
                <p className="text-sm text-slate-500 mt-0.5">Las secciones agrupan los recursos del curso.</p>
              </div>
              <button
                onClick={() => setShowSectionModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider" htmlFor="input-section-title">
                Título de la Sección
              </label>
              <input
                id="input-section-title"
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder={`Sección ${(course.sections.length ?? 0) + 1}: Introducción`}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30 focus:border-[#1B2A5A]/50 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSectionModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-add-section"
                onClick={handleAddSection}
                className="px-6 py-2.5 rounded-xl bg-[#1B2A5A] text-white font-extrabold text-sm hover:bg-[#263d7a] transition-colors cursor-pointer border-none shadow-md"
              >
                Crear Sección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Enroll Student Modal ──────────────────────────────────────────── */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,26,58,0.35)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Matricular Estudiante</h2>
                <p className="text-sm text-slate-500 mt-0.5">Asocia un nuevo alumno al curso.</p>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Seleccionar Estudiante
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                >
                  <option value="" disabled>-- Selecciona un estudiante --</option>
                  {globalStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email}) - {student.career}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnroll}
                className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-extrabold text-sm hover:bg-orange-600 transition-colors cursor-pointer border-none shadow-md"
              >
                Matricular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Activity Picker Modal (H5P only) ──────────────────────────────── */}
      {activeSectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,26,58,0.35)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Añadir recurso o actividad</h2>
                <p className="text-sm text-slate-500 mt-0.5">Selecciona el tipo de contenido a añadir.</p>
              </div>
              <button
                onClick={() => setActiveSectionId(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* H5P activity card */}
            <button
              id="btn-select-h5p"
              onClick={() => { setActiveSectionId(null); handleAddH5P(activeSectionId); }}
              className="flex items-center gap-4 p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400 transition-all duration-200 cursor-pointer text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-base">H5P</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                  Actividad interactiva empaquetada en formato .h5p
                </p>
              </div>
            </button>

            <p className="text-xs text-slate-400 font-medium text-center">
              Más tipos de actividades próximamente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
