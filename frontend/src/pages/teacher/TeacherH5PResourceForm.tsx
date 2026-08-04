import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Package, Upload, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useTeacherStore } from '../../store/useTeacherStore';

// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherH5PResourceForm() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get('sectionId') ?? '';
  const navigate = useNavigate();

  const { teacherCourses, addH5PResource } = useTeacherStore();
  const course = teacherCourses.find((c) => c.id === courseId);
  const section = course?.sections.find((s) => s.id === sectionId);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; file?: string }>({});
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.h5p')) {
      setErrors((e) => ({ ...e, file: 'Solo se aceptan archivos con extensión .h5p' }));
      return;
    }
    setFile(f);
    setErrors((e) => ({ ...e, file: undefined }));
    if (!name.trim()) setName(f.name.replace('.h5p', ''));
  };

  const onDrop = useCallback((ev: React.DragEvent) => {
    ev.preventDefault();
    setDragOver(false);
    const f = ev.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (ev: React.DragEvent) => { ev.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const validate = () => {
    const e: { name?: string; file?: string } = {};
    if (!name.trim()) e.name = 'El nombre es obligatorio.';
    if (!file) e.file = 'Debes seleccionar un archivo .h5p';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate() || !courseId || !sectionId || !file) return;
    addH5PResource(courseId, sectionId, {
      name: name.trim(),
      description: description.trim(),
      fileName: file.name,
      fileSize: file.size,
    });
    setSaved(true);
    setTimeout(() => navigate(`/teacher/courses/${courseId}`), 1400);
  };

  if (!course || !section) {
    return (
      <div className="p-10 text-center text-slate-500 font-bold">
        Sección no encontrada.{' '}
        <button onClick={() => navigate('/teacher/courses')} className="text-[#1B2A5A] underline cursor-pointer bg-transparent border-none">
          Volver
        </button>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">¡Recurso guardado!</h2>
        <p className="text-slate-500 text-sm font-medium">Redirigiendo al curso…</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto flex flex-col gap-8 pb-16 w-full">

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-sm font-bold text-slate-400 flex-wrap">
        <button
          onClick={() => navigate('/teacher/courses')}
          className="flex items-center gap-1.5 hover:text-[#1B2A5A] transition-colors cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Mis Cursos
        </button>
        <ChevronRight className="w-4 h-4" />
        <button
          onClick={() => navigate(`/teacher/courses/${courseId}`)}
          className="hover:text-[#1B2A5A] transition-colors cursor-pointer bg-transparent border-none truncate max-w-[160px]"
        >
          {course.name}
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-600 truncate max-w-[140px]">{section.title}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-700">Añadir H5P</span>
      </nav>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4 mb-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Añadir actividad H5P</h1>
            <p className="text-sm text-slate-500 font-medium">
              en <span className="font-extrabold text-slate-700">{section.title}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Form ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-7">

        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider" htmlFor="h5p-name">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="h5p-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((er) => ({ ...er, name: undefined })); }}
            placeholder="ej. Funciones Polinómicas – Comprensión Lectora"
            className={`w-full px-4 py-3.5 rounded-2xl border bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-200 focus:ring-[#1B2A5A]/25 focus:border-[#1B2A5A]/40'
            }`}
          />
          {errors.name && (
            <span className="flex items-center gap-1 text-xs text-red-500 font-bold">
              <AlertCircle className="w-3.5 h-3.5" />{errors.name}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider" htmlFor="h5p-desc">
            Descripción
          </label>
          <textarea
            id="h5p-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el objetivo de esta actividad interactiva..."
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/25 focus:border-[#1B2A5A]/40 transition-all resize-none"
          />
        </div>

        {/* Paquete H5P */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Paquete de Archivo <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 font-medium -mt-1">
            Tipo de archivo aceptado: <span className="font-black text-slate-600">Archivo (H5P) .h5p</span>
          </p>

          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`relative flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
              dragOver
                ? 'border-emerald-400 bg-emerald-50 scale-[1.01]'
                : file
                ? 'border-emerald-300 bg-emerald-50/60'
                : errors.file
                ? 'border-red-300 bg-red-50/30'
                : 'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
          >
            {file ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="font-extrabold text-slate-800 text-sm">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {file.size < 1048576
                      ? `${Math.round(file.size / 1024)} KB`
                      : `${(file.size / 1048576).toFixed(1)} MB`}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center cursor-pointer border-none transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="font-extrabold text-slate-700 text-sm">
                    Arrastra tu archivo .h5p aquí
                  </p>
                  <p className="text-xs text-slate-400 mt-1">o haz clic para seleccionarlo</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 border border-slate-200 px-3 py-1 rounded-full bg-white">
                  .h5p
                </span>
              </>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="h5p-file-input"
            type="file"
            accept=".h5p"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          {errors.file && (
            <span className="flex items-center gap-1 text-xs text-red-500 font-bold">
              <AlertCircle className="w-3.5 h-3.5" />{errors.file}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => navigate(`/teacher/courses/${courseId}`)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
          >
            Cancelar
          </button>
          <button
            id="btn-save-h5p"
            onClick={handleSave}
            className="px-7 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 transition-colors cursor-pointer border-none shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Guardar recurso
          </button>
        </div>
      </div>
    </div>
  );
}
