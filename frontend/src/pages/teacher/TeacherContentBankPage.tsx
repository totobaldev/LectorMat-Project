import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, FileCode2, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { useTeacherStore } from '../../store/useTeacherStore';

// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherContentBankPage() {
  const navigate = useNavigate();
  const { teacherCourses, getAllH5PResources } = useTeacherStore();

  const [query, setQuery] = useState('');

  const allResources = getAllH5PResources();

  const filtered = allResources.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.fileName.toLowerCase().includes(query.toLowerCase())
  );

  const getCourseAndSection = (courseId: string, sectionId: string) => {
    const course = teacherCourses.find((c) => c.id === courseId);
    const section = course?.sections.find((s) => s.id === sectionId);
    return { course, section };
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto flex flex-col gap-8 pb-16 w-full">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="inline-block text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
            Banco de Contenido
          </span>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight leading-none mt-2">
            Recursos H5P
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
            Todos los paquetes interactivos H5P que has subido en tus cursos, centralizados en un solo lugar.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center">
            <Package className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-slate-900">{allResources.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">recurso{allResources.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </section>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id="content-bank-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o nombre de archivo..."
          className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 focus:border-emerald-300 shadow-sm transition-all"
        />
      </div>

      {/* ── Resources Table ───────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 border border-slate-100 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center">
            {allResources.length === 0
              ? <Package className="w-9 h-9 text-slate-300" />
              : <Search className="w-9 h-9 text-slate-300" />
            }
          </div>
          <h3 className="text-lg font-extrabold text-slate-700">
            {allResources.length === 0 ? 'No hay recursos aún' : 'Sin resultados'}
          </h3>
          <p className="text-sm text-slate-400 max-w-xs">
            {allResources.length === 0
              ? 'Añade actividades H5P desde la vista de un curso para verlas aquí.'
              : 'Ningún recurso coincide con tu búsqueda.'}
          </p>
          {allResources.length === 0 && (
            <button
              onClick={() => navigate('/teacher/courses')}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2A5A] text-white text-sm font-bold cursor-pointer border-none hover:bg-[#263d7a] transition-colors"
            >
              Ir a Mis Cursos
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_90px] gap-4 px-7 py-4 border-b border-slate-100 bg-slate-50/70 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Recurso</span>
            <span>Curso</span>
            <span>Sección</span>
            <span>Tamaño</span>
            <span>Fecha</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map((res) => {
              const { course, section } = getCourseAndSection(res.courseId, res.sectionId);
              return (
                <div
                  key={res.id}
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_90px] gap-4 px-7 py-4 items-center hover:bg-slate-50/60 transition-colors cursor-pointer group"
                  onClick={() => course && navigate(`/teacher/courses/${course.id}`)}
                >
                  {/* Name + file */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <FileCode2 className="w-4.5 h-4.5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-800 truncate group-hover:text-[#1B2A5A] transition-colors">
                        {res.name}
                      </p>
                      <p className="text-xs text-slate-400 font-medium truncate">{res.fileName}</p>
                    </div>
                  </div>

                  {/* Course */}
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {course?.name ?? '—'}
                    </span>
                  </div>

                  {/* Section */}
                  <span className="text-xs font-bold text-slate-500 truncate">
                    {section?.title ?? '—'}
                  </span>

                  {/* Size */}
                  <span className="text-xs font-bold text-slate-500">
                    {formatSize(res.fileSize)}
                  </span>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{formatDate(res.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
