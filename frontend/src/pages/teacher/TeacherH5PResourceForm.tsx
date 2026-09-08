import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, FileCode2, Package, Upload } from 'lucide-react';
import { useTeacherStore, type ModuleCategory, type ResourceType } from '../../store/useTeacherStore';

export default function TeacherH5PResourceForm() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();

  const sectionId = searchParams.get('sectionId') ?? '';
  const initialUnitId = searchParams.get('unitId') ?? '';
  const initialModuleType = (searchParams.get('moduleType') as ModuleCategory) || 'comprension';
  const initialResourceType = (searchParams.get('resourceType') as ResourceType) || 'pdf';

  const navigate = useNavigate();

  const { teacherCourses, addResource } = useTeacherStore();
  const course = teacherCourses.find((c) => c.id === courseId);
  const section = course?.sections.find((s) => s.id === sectionId);

  // Form State
  const [selectedUnitId, setSelectedUnitId] = useState(initialUnitId || section?.units[0]?.id || '');
  const [moduleType, setModuleType] = useState<ModuleCategory>(initialModuleType);
  const [resourceType, setResourceType] = useState<ResourceType>(initialResourceType);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; file?: string; unit?: string }>({});
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedExtensions = (type: ResourceType) => {
    switch (type) {
      case 'pdf': return '.pdf';
      case 'word': return '.doc,.docx';
      case 'h5p': return '.h5p';
    }
  };

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() || '';

    if (resourceType === 'pdf' && ext !== 'pdf') {
      setErrors((e) => ({ ...e, file: 'Solo se aceptan archivos con extensión .pdf' }));
      return;
    }
    if (resourceType === 'word' && ext !== 'doc' && ext !== 'docx') {
      setErrors((e) => ({ ...e, file: 'Solo se aceptan archivos con extensión .doc o .docx' }));
      return;
    }
    if (resourceType === 'h5p' && ext !== 'h5p') {
      setErrors((e) => ({ ...e, file: 'Solo se aceptan archivos con extensión .h5p' }));
      return;
    }

    setFile(f);
    setErrors((e) => ({ ...e, file: undefined }));
    if (!name.trim()) setName(f.name.replace(/\.[^/.]+$/, ''));
  };

  const onDrop = useCallback((ev: React.DragEvent) => {
    ev.preventDefault();
    setDragOver(false);
    const f = ev.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [resourceType]);

  const onDragOver = (ev: React.DragEvent) => { ev.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const validate = () => {
    const e: { name?: string; file?: string; unit?: string } = {};
    if (!name.trim()) e.name = 'El nombre del recurso es obligatorio.';
    if (!file) e.file = `Debes seleccionar un archivo ${getAcceptedExtensions(resourceType)}`;
    if (section?.units && section.units.length > 0 && !selectedUnitId) {
      e.unit = 'Debes seleccionar una Unidad.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate() || !courseId || !sectionId || !file) return;

    const targetUnitId = selectedUnitId || section?.units[0]?.id || 'u_default';

    addResource(courseId, sectionId, targetUnitId, moduleType, {
      name: name.trim(),
      description: description.trim(),
      resourceType,
      fileName: file.name,
      fileSize: file.size,
    });

    setSaved(true);
    setTimeout(() => navigate(`/teacher/courses/${courseId}`), 1200);
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
      <div className="flex-1 flex flex-col items-center justify-center gap-5 p-10 text-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">¡Recurso añadido con éxito!</h2>
        <p className="text-slate-500 text-sm font-medium">Redirigiendo a las unidades del curso…</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto flex flex-col gap-8 pb-16 w-full animate-in fade-in duration-300">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-sm font-bold text-slate-400">
        <button
          onClick={() => navigate(`/teacher/courses/${courseId}`)}
          className="flex items-center gap-1.5 hover:text-[#1B2A5A] transition-colors cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Curso
        </button>
      </nav>

      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Añadir Recurso / Material</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sección <span className="font-extrabold text-slate-800">{section.title}</span> — Agrega material en PDF, Word o H5P a los módulos de ejercicios.
          </p>
        </div>

        {/* ── Form Body ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Type Selector Tabs */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              1. Tipo de Recurso
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => { setResourceType('pdf'); setFile(null); }}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-extrabold text-xs transition-all cursor-pointer ${
                  resourceType === 'pdf'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-rose-600" />
                <span>Documento PDF</span>
              </button>

              <button
                type="button"
                onClick={() => { setResourceType('word'); setFile(null); }}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-extrabold text-xs transition-all cursor-pointer ${
                  resourceType === 'word'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <FileCode2 className="w-4 h-4 text-blue-600" />
                <span>Documento Word</span>
              </button>

              <button
                type="button"
                onClick={() => { setResourceType('h5p'); setFile(null); }}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-extrabold text-xs transition-all cursor-pointer ${
                  resourceType === 'h5p'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Actividad H5P</span>
              </button>
            </div>
          </div>

          {/* Unit & Module Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.units && section.units.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  2. Unidad Destino
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30"
                >
                  {section.units.map((u) => (
                    <option key={u.id} value={u.id}>{u.title}</option>
                  ))}
                </select>
                {errors.unit && <p className="text-xs text-rose-500 font-bold">{errors.unit}</p>}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                3. Módulo de Ejercicios
              </label>
              <select
                value={moduleType}
                onChange={(e) => setModuleType(e.target.value as ModuleCategory)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30"
              >
                <option value="comprension">📖 Comprensión (Básico)</option>
                <option value="metodo">🧭 Método (Intermedio)</option>
                <option value="interactivo">⚡ Interactivo (Avanzado)</option>
              </select>
            </div>
          </div>

          {/* Title & Description Inputs */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Título del Recurso
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Guía Teórica de Razones Trigonométricas"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30"
            />
            {errors.name && <p className="text-xs text-rose-500 font-bold">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Descripción u Objetivos
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escribe una breve descripción del material para los estudiantes..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A5A]/30"
            />
          </div>

          {/* File Upload Area */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Archivo ({getAcceptedExtensions(resourceType)})
            </label>
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                dragOver ? 'border-orange-500 bg-orange-50/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptedExtensions(resourceType)}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="font-extrabold text-xs text-slate-800">{file.name}</span>
                  <span className="text-[11px] font-bold text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <p className="text-xs font-extrabold text-slate-700">
                    Haz clic aquí o arrastra tu archivo {getAcceptedExtensions(resourceType)}
                  </p>
                </div>
              )}
            </div>
            {errors.file && <p className="text-xs text-rose-500 font-bold">{errors.file}</p>}
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(`/teacher/courses/${courseId}`)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#1B2A5A] text-white font-extrabold text-xs hover:bg-[#263d7a] transition-colors cursor-pointer border-none shadow-md"
            >
              Guardar Recurso
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
