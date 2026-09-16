import React, { useState } from 'react';
import { useTeacherStore, type SectionResource } from '../../store/useTeacherStore';
import { useProgressStore } from '../../store/useProgressStore';
import { FileText, File, MonitorPlay, Download, Eye, BookOpen } from 'lucide-react';
import { ResourcePreviewModal } from './ResourcePreviewModal';

interface TeacherResourcesProps {
  unitId: string; // e.g. 'u1', 'u2', 'u3', 'u4'
  moduleType: 'comprension' | 'metodo' | 'interactivo';
}

export const TeacherResources: React.FC<TeacherResourcesProps> = ({ unitId, moduleType }) => {
  const teacherCourses = useTeacherStore((s) => s.teacherCourses);
  const studentEmail = useProgressStore((s) => s.studentEmail);

  const [activeResource, setActiveResource] = useState<SectionResource | null>(null);

  // Find the student's enrolled section
  let enrolledSectionId: string | null = null;
  let enrolledCourseId: string | null = null;

  for (const course of teacherCourses) {
    const student = course.enrolledStudents?.find(s => s.email === studentEmail);
    if (student && student.sectionId) {
      enrolledSectionId = student.sectionId;
      enrolledCourseId = course.id;
      break;
    }
  }

  if (!enrolledSectionId || !enrolledCourseId) {
    return null; // Not enrolled, or no section assigned
  }

  // Find the course and section
  const course = teacherCourses.find(c => c.id === enrolledCourseId);
  const section = course?.sections.find(s => s.id === enrolledSectionId);

  if (!section) return null;

  // Find the unit in the section
  // Note: Since we auto-inject U1-U4, they will have IDs like 'u1-123456'. 
  // We match by checking if the unit title contains 'Unidad X' or by keeping 'u1' as the id prefix.
  const unitNumber = unitId.replace('u', ''); // '1', '2', '3', '4'
  const unit = section.units?.find(u => u.title.includes(`Unidad ${unitNumber}`));

  if (!unit || !unit.modules) return null;

  const resources = unit.modules[moduleType] || [];

  if (resources.length === 0) return null; // No resources to show

  return (
    <>
      <div className="bg-white rounded-[2rem] p-6 mb-8 border-2 border-dashed border-sky-200 bg-sky-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Recursos de tu Profesor</h3>
            <p className="text-sm text-slate-500 font-medium">Material complementario asignado a este módulo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => (
            <div key={res.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col gap-3 group hover:border-sky-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  res.resourceType === 'pdf' ? 'bg-red-50 text-red-500' :
                  res.resourceType === 'word' ? 'bg-blue-50 text-blue-500' :
                  'bg-orange-50 text-orange-500'
                }`}>
                  {res.resourceType === 'pdf' ? <FileText className="w-5 h-5" /> :
                   res.resourceType === 'word' ? <File className="w-5 h-5" /> :
                   <MonitorPlay className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{res.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 uppercase font-bold tracking-wide">
                    {res.resourceType === 'pdf' ? 'PDF Document' : res.resourceType === 'word' ? 'Word Document' : 'H5P Interactive'}
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-3 flex items-center gap-2">
                <button
                  onClick={() => setActiveResource(res)}
                  className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors border-none cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border-none cursor-pointer"
                  title="Descargar"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeResource && (
        <ResourcePreviewModal
          resource={activeResource}
          onClose={() => setActiveResource(null)}
        />
      )}
    </>
  );
};
