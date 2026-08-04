import React from 'react';
import { motion } from 'framer-motion';
import { useTeacherStore } from '../../store/useTeacherStore';
import CourseSearch from '../../features/teacher/components/CourseSearch';
import CourseCard from '../../features/teacher/components/CourseCard';

export const TeacherDashboard: React.FC = () => {
  const courses = useTeacherStore((s) => s.courses);
  const searchQuery = useTeacherStore((s) => s.searchQuery);

  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col gap-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Panel de Gestión Docente
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Busca y administra tus asignaturas asignadas por código o nombre de curso.
          </p>
        </div>

        {/* Search bar */}
        <CourseSearch />

        {/* Courses grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center gap-3">
            <p className="text-base font-bold text-slate-700">
              No se encontraron asignaturas
            </p>
            <p className="text-sm text-slate-400 max-w-sm">
              No hay cursos que coincidan con &quot;<span className="font-semibold">{searchQuery}</span>&quot;. Intenta buscar con otro código (ej. MAT201, FIN302).
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
