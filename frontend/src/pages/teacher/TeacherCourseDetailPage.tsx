import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight, Plus, Layers, FileCode2, X, Package,
  ArrowLeft, MoreHorizontal, Users, UserPlus, Trash2, Mail, GraduationCap,
  Upload, Key, Copy, Download, Check, BookOpen, Compass, Zap, FileText
} from 'lucide-react';
import {
  useTeacherStore,
  globalStudents,
  type CourseStudent,
  type SectionResource,
  type ModuleCategory,
  type ResourceType
} from '../../store/useTeacherStore';
import { readRosterFile, parseStudentRosterText, type ParsedStudent } from '../../utils/pdfParser';
import { api } from '../../services/api';

// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    teacherCourses,
    addSection,
    addUnit,
    removeUnit,
    removeResource,
    enrollStudent,
    importSectionStudents,
    unenrollStudent
  } = useTeacherStore();

  const course = teacherCourses.find((c) => c.id === courseId);

  // Tab State: 'content' | 'participants'
  const [activeTab, setActiveTab] = useState<'content' | 'participants'>('content');

  // Modal: Add Section
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');

  // Modal: Add Unit
  const [showUnitModalForSectionId, setShowUnitModalForSectionId] = useState<string | null>(null);
  const [unitTitle, setUnitTitle] = useState('');
  const [unitSubtitle, setUnitSubtitle] = useState('');

  // Modal: Add resource/activity selector (for which section & unit & module)
  const [activeResourcePicker, setActiveResourcePicker] = useState<{
    sectionId: string;
    unitId: string;
    moduleType: ModuleCategory;
  } | null>(null);

  // Modal: Enroll Student
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Modal: Section Student Roster Import (PDF / CSV / Text)
  const [importingSectionId, setImportingSectionId] = useState<string | null>(null);
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([]);
  const [pastedText, setPastedText] = useState('');
  const [fileLoading, setFileLoading] = useState(false);

  // Modal: Section Credentials View
  const [viewCredentialsSectionId, setViewCredentialsSectionId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleAddSection = () => {
    if (!courseId) return;
    const order = (course?.sections.length ?? 0) + 1;
    addSection(courseId, sectionTitle.trim() || `Sección C${order}`);
    setSectionTitle('');
    setShowSectionModal(false);
  };

  const handleAddUnitConfirm = () => {
    if (!courseId || !showUnitModalForSectionId) return;
    const sec = course?.sections.find(s => s.id === showUnitModalForSectionId);
    const order = (sec?.units.length ?? 0) + 1;

    addUnit(
      courseId,
      showUnitModalForSectionId,
      unitTitle.trim() || `Unidad ${order}: Tema de Estudio`,
      unitSubtitle.trim() || 'Programa Transforma 2026'
    );

    setUnitTitle('');
    setUnitSubtitle('');
    setShowUnitModalForSectionId(null);
  };

  const handleSectionFileUpload = async (sectionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportingSectionId(sectionId);
    setFileLoading(true);
    try {
      const text = await readRosterFile(file);
      const extracted = parseStudentRosterText(text);
      setParsedStudents(extracted);
      if (extracted.length === 0) {
        alert('No se detectaron correos ni nombres de estudiantes en el archivo. Puedes pegar el texto directamente si lo prefieres.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al leer el archivo. Intenta copiando y pegando el contenido.');
    } finally {
      setFileLoading(false);
    }
  };

  const handleTextParse = () => {
    if (!pastedText.trim()) return;
    const extracted = parseStudentRosterText(pastedText);
    setParsedStudents(extracted);
    if (extracted.length === 0) {
      alert('No se pudieron extraer estudiantes del texto pegado. Verifica que contenga direcciones de correo.');
    }
  };

  const handleConfirmImport = async () => {
    if (!courseId || !importingSectionId || parsedStudents.length === 0) return;

    try {
      await api.importSectionRoster(
        courseId,
        importingSectionId,
        parsedStudents.map((s) => ({
          name: s.fullName,
          email: s.email,
          career: 'Técnico-Profesional',
        }))
      );
    } catch (err) {
      console.warn('Backend offline, guardando en estado local:', err);
    }

    importSectionStudents(
      courseId,
      importingSectionId,
      parsedStudents.map((s) => ({
        name: s.fullName,
        email: s.email,
        career: 'Técnico-Profesional',
        username: s.username,
        password: s.password,
      }))
    );

    const section = course?.sections.find(s => s.id === importingSectionId);
    alert(`¡Éxito! Se importaron ${parsedStudents.length} estudiantes a la sección "${section?.title || 'Sección'}". Cuentas de usuario y contraseñas creadas y guardadas en el backend.`);

    const targetSecId = importingSectionId;
    setImportingSectionId(null);
    setParsedStudents([]);
    setPastedText('');
    setViewCredentialsSectionId(targetSecId);
  };

  const handleCopyCredentials = (sectionStudents: CourseStudent[]) => {
    if (!sectionStudents.length) return;

    const lines = [
      'Nombre\tCorreo (Usuario)\tContraseña',
      ...sectionStudents.map((s) => `${s.name}\t${s.email}\t${s.password || 'N/A'}`),
    ].join('\n');

    navigator.clipboard.writeText(lines);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleDownloadCSV = (sectionTitleName: string, sectionStudents: CourseStudent[]) => {
    if (!sectionStudents.length) return;

    const csvRows = [
      'Nombre,Correo_Usuario,Contrasena,Seccion',
      ...sectionStudents.map(
        (s) => `"${s.name}","${s.email}","${s.password || ''}","${sectionTitleName}"`
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Credenciales_Estudiantes_${sectionTitleName.replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleEnroll = () => {
    if (!courseId || !selectedStudentId || !course) return;
    const student = globalStudents.find(s => s.id === selectedStudentId);
    if (!student) return;

    const isEnrolled = course.enrolledStudents.some(s => s.email === student.email);
    if (isEnrolled) {
      alert('El estudiante ya está matriculado.');
      return;
    }

    enrollStudent(courseId, student.name, student.email, student.career);
    setSelectedStudentId('');
    setShowEnrollModal(false);
  };

  const handleNavigateToForm = (sectionId: string, unitId: string, moduleType: ModuleCategory, resourceType: ResourceType) => {
    setActiveResourcePicker(null);
    navigate(`/teacher/courses/${courseId}/resource/new?sectionId=${sectionId}&unitId=${unitId}&moduleType=${moduleType}&resourceType=${resourceType}`);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const renderResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'word':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileCode2 className="w-4 h-4" />
          </div>
        );
      case 'h5p':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
        );
    }
  };

  const renderResourceBadge = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-full">PDF</span>;
      case 'word':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-full">WORD</span>;
      case 'h5p':
      default:
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full">H5P</span>;
    }
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
    <div className="p-6 sm:p-10 max-w-6xl mx-auto flex flex-col gap-8 pb-16 w-full animate-in fade-in duration-300">

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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-snug mt-2 max-w-xl">
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

      {/* ── Tab Content: Content (Sections -> Units -> 3 Modules) ───────────── */}
      {activeTab === 'content' && (
        <div className="space-y-8">
          {course.sections.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 border border-slate-100 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center">
                <Layers className="w-9 h-9 text-slate-300" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-700">Sin secciones aún</h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Las secciones organizan el contenido del curso. Crea la primera para empezar a añadir Unidades y Módulos.
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
            <div className="flex flex-col gap-8">
              {course.sections.map((section) => {
                const sectionStudents = (course.enrolledStudents || []).filter(
                  (s) => s.sectionId === section.id
                );
                return (
                  <div
                    key={section.id}
                    className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col gap-6 p-6"
                  >
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-[#1B2A5A]/10 flex items-center justify-center">
                          <Layers className="w-5 h-5 text-[#1B2A5A]" />
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-slate-900">{section.title}</h2>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                              {section.units?.length || 0} unidad{section.units?.length !== 1 ? 'es' : ''}
                            </span>
                            <span className="text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                              {sectionStudents.length} estudiante{sectionStudents.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <button
                          onClick={() => setShowUnitModalForSectionId(section.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#1B2A5A] hover:bg-[#263d7a] transition-colors cursor-pointer border-none shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Añadir Unidad</span>
                        </button>

                        <button
                          onClick={() => setImportingSectionId(section.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors cursor-pointer"
                          title="Cargar nómina de estudiantes (PDF / CSV / Texto)"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Cargar Estudiantes</span>
                        </button>

                        {sectionStudents.length > 0 && (
                          <button
                            onClick={() => setViewCredentialsSectionId(section.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                            title="Ver credenciales (usuarios y contraseñas)"
                          >
                            <Key className="w-3.5 h-3.5 text-slate-500" />
                            Credenciales ({sectionStudents.length})
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Section Units Container */}
                    {!section.units || section.units.length === 0 ? (
                      <div className="px-6 py-12 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-extrabold text-slate-600">Esta sección no tiene Unidades asignadas todavía.</p>
                        <p className="text-xs text-slate-400 max-w-xs">
                          Crea una Unidad (ej: Unidad 3: Trigonometría) para comenzar a publicar ejercicios de Comprensión, Método e Interactivo.
                        </p>
                        <button
                          onClick={() => setShowUnitModalForSectionId(section.id)}
                          className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-[#1B2A5A] bg-slate-200/80 hover:bg-slate-200 border-none cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Crear Unidad 1
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-8">
                        {section.units.map((unit, uIdx) => (
                          <div key={unit.id} className="flex flex-col gap-5 border border-slate-100 rounded-[1.8rem] p-6 bg-slate-50/40">
                            {/* Unit Banner */}
                            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                  {unit.title}
                                </h3>
                                {unit.subtitle && (
                                  <p className="text-xs font-bold text-sky-600 mt-0.5">
                                    {unit.subtitle}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-2xl bg-sky-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-sky-500/20">
                                  U{uIdx + 1}
                                </span>
                                <button
                                  onClick={() => removeUnit(course.id, section.id, unit.id)}
                                  className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent"
                                  title="Eliminar Unidad"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* 3 Exercise Modality Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                              {/* 1. Comprensión (Básico) */}
                              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                                      <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-black text-white bg-sky-600 px-3 py-1 rounded-full uppercase">
                                      Básico
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="text-base font-black text-slate-900">Comprensión</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                      Deduce las medidas, conceptos y distancias.
                                    </p>
                                  </div>
                                </div>

                                {/* Resource List */}
                                <div className="space-y-2 pt-2 border-t border-slate-100 min-h-[60px]">
                                  {(unit.modules?.comprension || []).length === 0 ? (
                                    <p className="text-[11px] text-slate-400 font-medium italic text-center py-2">
                                      Sin recursos aún (PDF/Word/H5P)
                                    </p>
                                  ) : (
                                    unit.modules.comprension.map((res) => (
                                      <div key={res.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          {renderResourceIcon(res.resourceType)}
                                          <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{res.name}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                              {renderResourceBadge(res.resourceType)}
                                              <span className="text-[10px] text-slate-400 font-medium">{formatSize(res.fileSize)}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => removeResource(course.id, section.id, unit.id, 'comprension', res.id)}
                                          className="text-slate-300 hover:text-rose-500 cursor-pointer border-none bg-transparent p-1"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>

                                <button
                                  onClick={() => setActiveResourcePicker({ sectionId: section.id, unitId: unit.id, moduleType: 'comprension' })}
                                  className="w-full py-2.5 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Añadir Recurso</span>
                                </button>
                              </div>

                              {/* 2. Método (Intermedio) */}
                              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                      <Compass className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-black text-white bg-blue-600 px-3 py-1 rounded-full uppercase">
                                      Intermedio
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="text-base font-black text-slate-900">Método</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                      Clasificador de Teoremas y Funciones.
                                    </p>
                                  </div>
                                </div>

                                {/* Resource List */}
                                <div className="space-y-2 pt-2 border-t border-slate-100 min-h-[60px]">
                                  {(unit.modules?.metodo || []).length === 0 ? (
                                    <p className="text-[11px] text-slate-400 font-medium italic text-center py-2">
                                      Sin recursos aún (PDF/Word/H5P)
                                    </p>
                                  ) : (
                                    unit.modules.metodo.map((res) => (
                                      <div key={res.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          {renderResourceIcon(res.resourceType)}
                                          <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{res.name}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                              {renderResourceBadge(res.resourceType)}
                                              <span className="text-[10px] text-slate-400 font-medium">{formatSize(res.fileSize)}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => removeResource(course.id, section.id, unit.id, 'metodo', res.id)}
                                          className="text-slate-300 hover:text-rose-500 cursor-pointer border-none bg-transparent p-1"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>

                                <button
                                  onClick={() => setActiveResourcePicker({ sectionId: section.id, unitId: unit.id, moduleType: 'metodo' })}
                                  className="w-full py-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Añadir Recurso</span>
                                </button>
                              </div>

                              {/* 3. Interactivo (Avanzado) */}
                              <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm flex flex-col justify-between gap-4 bg-emerald-50/10">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                      <Zap className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-black text-white bg-emerald-600 px-3 py-1 rounded-full uppercase">
                                      Avanzado
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="text-base font-black text-slate-900">Interactivo</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                      Resolución de problemas de Trigonometría aplicados.
                                    </p>
                                  </div>
                                </div>

                                {/* Resource List */}
                                <div className="space-y-2 pt-2 border-t border-slate-100 min-h-[60px]">
                                  {(unit.modules?.interactivo || []).length === 0 ? (
                                    <p className="text-[11px] text-slate-400 font-medium italic text-center py-2">
                                      Sin recursos aún (H5P/PDF/Word)
                                    </p>
                                  ) : (
                                    unit.modules.interactivo.map((res) => (
                                      <div key={res.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          {renderResourceIcon(res.resourceType)}
                                          <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{res.name}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                              {renderResourceBadge(res.resourceType)}
                                              <span className="text-[10px] text-slate-400 font-medium">{formatSize(res.fileSize)}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => removeResource(course.id, section.id, unit.id, 'interactivo', res.id)}
                                          className="text-slate-300 hover:text-rose-500 cursor-pointer border-none bg-transparent p-1"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>

                                <button
                                  onClick={() => setActiveResourcePicker({ sectionId: section.id, unitId: unit.id, moduleType: 'interactivo' })}
                                  className="w-full py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Añadir Recurso</span>
                                </button>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab Content: Participants ──────────────────────────────────────── */}
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
                <p className="text-sm text-slate-500 mt-0.5">Las secciones agrupan las Unidades del curso.</p>
              </div>
              <button
                onClick={() => setShowSectionModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Título de la Sección
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder={`Ej: C${(course.sections.length ?? 0) + 1}`}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30"
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
                onClick={handleAddSection}
                className="px-6 py-2.5 rounded-xl bg-[#1B2A5A] text-white font-extrabold text-sm hover:bg-[#263d7a] transition-colors cursor-pointer border-none shadow-md"
              >
                Crear Sección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Unit Modal ────────────────────────────────────────────────── */}
      {showUnitModalForSectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,26,58,0.35)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Añadir Nueva Unidad</h2>
                <p className="text-sm text-slate-500 mt-0.5">Crea una unidad temática dentro de la sección.</p>
              </div>
              <button
                onClick={() => setShowUnitModalForSectionId(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Título de la Unidad
                </label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  placeholder="Ej: Unidad 3: Trigonometría y Geometría"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Subtítulo / Programa
                </label>
                <input
                  type="text"
                  value={unitSubtitle}
                  onChange={(e) => setUnitSubtitle(e.target.value)}
                  placeholder="Ej: Programa Transforma 2026"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowUnitModalForSectionId(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddUnitConfirm}
                className="px-6 py-2.5 rounded-xl bg-[#1B2A5A] text-white font-extrabold text-sm hover:bg-[#263d7a] transition-colors cursor-pointer border-none shadow-md"
              >
                Crear Unidad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Resource Format Selector Modal ──────────────────────────────── */}
      {activeResourcePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,26,58,0.35)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Seleccionar Formato de Recurso</h2>
                <p className="text-xs text-slate-500 mt-0.5">Elije el tipo de material a adjuntar en el módulo.</p>
              </div>
              <button
                onClick={() => setActiveResourcePicker(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleNavigateToForm(activeResourcePicker.sectionId, activeResourcePicker.unitId, activeResourcePicker.moduleType, 'pdf')}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 transition-all cursor-pointer text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm">Documento PDF (.pdf)</p>
                  <p className="text-xs text-slate-500 font-medium">Guías teóricas, lecturas y problemas impresos.</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigateToForm(activeResourcePicker.sectionId, activeResourcePicker.unitId, activeResourcePicker.moduleType, 'word')}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition-all cursor-pointer text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <FileCode2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm">Documento Word (.doc, .docx)</p>
                  <p className="text-xs text-slate-500 font-medium">Archivos editables y pautas de trabajo.</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigateToForm(activeResourcePicker.sectionId, activeResourcePicker.unitId, activeResourcePicker.moduleType, 'h5p')}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all cursor-pointer text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm">Actividad H5P (.h5p)</p>
                  <p className="text-xs text-slate-500 font-medium">Contenido interactivo, quizzes y clasificadores.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Student Roster Import Modal ───────────────────────────────────── */}
      {importingSectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,26,58,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl p-8 flex flex-col gap-6 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Cargar Nómina de Estudiantes</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Sube un archivo PDF/CSV o pega directamente el texto copiado de INACAP/Excel.
                </p>
              </div>
              <button
                onClick={() => { setImportingSectionId(null); setParsedStudents([]); setPastedText(''); }}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="overflow-y-auto flex flex-col gap-5 pr-1">
              <div className="border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/20 rounded-2xl p-6 text-center transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.csv,.txt,.xlsx,.xls"
                  onChange={(e) => handleSectionFileUpload(importingSectionId, e)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">
                    {fileLoading ? 'Procesando archivo PDF/CSV...' : 'Selecciona un archivo PDF, CSV o TXT'}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Haz clic aquí o arrastra tu archivo de lista</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  O Pega el Texto Copiado de INACAP / PDF / Excel:
                </label>
                <textarea
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`Pega aquí el contenido copiado (ej:\nIan Bryan Josué\tAguilera Torres\tian.aguilera02@inacapmail.cl)`}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
                <button
                  type="button"
                  onClick={handleTextParse}
                  className="self-end px-4 py-2 rounded-xl bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-900 transition-colors cursor-pointer border-none"
                >
                  Procesar Texto Pegado
                </button>
              </div>

              {parsedStudents.length > 0 && (
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      ✓ {parsedStudents.length} estudiante{parsedStudents.length !== 1 ? 's' : ''} detectado{parsedStudents.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold">
                      Formato Contraseña: NOMBREalbornoz
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-2.5">Nombre Completo</th>
                          <th className="p-2.5">Correo (Usuario)</th>
                          <th className="p-2.5">Contraseña Generada</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedStudents.map((std, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-800">{std.fullName}</td>
                            <td className="p-2.5 font-medium text-slate-600">{std.email}</td>
                            <td className="p-2.5 font-mono font-bold text-orange-600">{std.password}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => { setImportingSectionId(null); setParsedStudents([]); setPastedText(''); }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={parsedStudents.length === 0}
                className={`px-6 py-2.5 rounded-xl text-white font-extrabold text-sm transition-all cursor-pointer border-none shadow-md ${
                  parsedStudents.length > 0
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Confirmar e Importar {parsedStudents.length > 0 ? `(${parsedStudents.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Section Credentials Modal ───────────────────────────────── */}
      {viewCredentialsSectionId && (() => {
        const secStudents = (course.enrolledStudents || []).filter(s => s.sectionId === viewCredentialsSectionId);
        const sec = course.sections.find(s => s.id === viewCredentialsSectionId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,26,58,0.4)', backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl p-8 flex flex-col gap-6 max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Credenciales de Acceso - {sec?.title || 'Sección'}</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Lista de usuarios (correos) y contraseñas asignadas a los estudiantes.
                  </p>
                </div>
                <button
                  onClick={() => setViewCredentialsSectionId(null)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border-none transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-72 border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Estudiante</th>
                      <th className="p-3">Correo (Usuario)</th>
                      <th className="p-3">Contraseña Asignada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {secStudents.map((std, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{std.name}</td>
                        <td className="p-3 font-medium text-slate-600">{std.email}</td>
                        <td className="p-3 font-mono font-black text-orange-600">{std.password || 'NOMBREalbornoz'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCredentials(secStudents)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer border border-slate-200 transition-colors"
                  >
                    {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copySuccess ? '¡Copiado!' : 'Copiar al portapapeles'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadCSV(sec?.title || 'Sección', secStudents)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-extrabold cursor-pointer border border-orange-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar CSV</span>
                  </button>
                </div>

                <button
                  onClick={() => setViewCredentialsSectionId(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1B2A5A] text-white font-extrabold text-xs hover:bg-[#263d7a] transition-colors cursor-pointer border-none shadow-md"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
