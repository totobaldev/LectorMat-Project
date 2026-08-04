import React from 'react';
import { Search } from 'lucide-react';
import { useTeacherStore } from '../../../store/useTeacherStore';

export const CourseSearch: React.FC = () => {
  const searchQuery = useTeacherStore((s) => s.searchQuery);
  const setSearchQuery = useTeacherStore((s) => s.setSearchQuery);

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar por código de asignatura (ej. MAT201)..."
        className="w-full bg-white border border-slate-200 rounded-2xl p-4 pl-12 text-lg text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm"
      />
    </div>
  );
};

export default CourseSearch;
