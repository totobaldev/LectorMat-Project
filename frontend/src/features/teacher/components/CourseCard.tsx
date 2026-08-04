import React from 'react';
import { Users } from 'lucide-react';
import { type Course } from '../../../store/useTeacherStore';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-100 p-6 flex flex-col justify-between gap-5 group">
      {/* Top: Area badge */}
      <div className="flex items-center justify-between">
        <span className="bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-xs font-semibold">
          {course.area}
        </span>
      </div>

      {/* Center: Code & Name */}
      <div className="flex flex-col gap-1.5">
        <span className="text-blue-600 font-bold text-xl tracking-tight group-hover:text-blue-700 transition-colors">
          {course.code}
        </span>
        <h3 className="text-slate-800 font-semibold text-base leading-snug">
          {course.name}
        </h3>
      </div>

      {/* Bottom: Career & Enrolled students count */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
        <span className="font-medium truncate max-w-[170px]" title={course.career}>
          {course.career}
        </span>
        <div className="flex items-center gap-1.5 text-slate-600 font-semibold shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{course.enrolledStudents} est.</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
