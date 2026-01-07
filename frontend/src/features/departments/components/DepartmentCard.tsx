import { useNavigate } from 'react-router-dom';
import type { Department } from '../types';
import { Users, BookOpen, MapPin } from 'lucide-react';

export default function DepartmentCard({ dept }: { dept: Department }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/departments/${dept.id}`)}
      className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {dept.name}
          </h3>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
            {dept.code}
          </span>
        </div>
        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
          {dept.name.charAt(0)}
        </div>
      </div>
      
      <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">
        {dept.description}
      </p>

      {/* Quick Stats */}
      <div className="flex items-center gap-4 text-sm text-slate-600 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-slate-400" />
          <span>{dept.stats.totalStaff} Staff</span>
        </div>
        {dept.stats.totalSubjects > 0 && (
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>{dept.stats.totalSubjects} Subjects</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
        <MapPin className="w-3 h-3" />
        {dept.location}
      </div>
    </div>
  );
}