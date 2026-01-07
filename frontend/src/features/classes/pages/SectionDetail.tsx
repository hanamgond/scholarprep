import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient as api } from '@/services/http/client';
import { classService } from '@/services/api/class';
import type { Student } from '@/features/students/types/student';

// --- Type Definitions ---
interface SectionDetails {
  id: string;
  name: string;
  class: {
    id: string;
    name: string;
  };
}

export default function SectionDetail() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  
  const [section, setSection] = useState<SectionDetails | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Requirement: Default tab should be 'students'
  const [activeTab, setActiveTab] = useState('students'); 

  useEffect(() => {
    if (!sectionId) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch Section Details (for the header info)
        // This hits the mock handler: GET /api/sections/:id
        const sectionRes = await api.get<SectionDetails>(`/api/sections/${sectionId}`);
        setSection(sectionRes.data);

        // 2. Fetch Students in this Section (for the list and count)
        // This hits the mock handler: GET /api/sections/:id/students
        const studentsData = await classService.getStudentsBySection(sectionId);
        setStudents(studentsData);

      } catch (err) {
        console.error("Failed to load section data", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sectionId]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading section details...</div>;
  if (!section) return <div className="p-8 text-center text-red-600">Section not found.</div>;

  const tabs = ['students', 'exams', 'leaderboard', 'attendance', 'settings'];

  return (
    <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Back Button */}
      <button 
        onClick={() => navigate('/classes')}
        className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-2"
      >
        <span className="mr-2">←</span> Back to Classes
      </button>

      {/* 2. Section Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                {section.class?.name} — Section {section.name}
                </h1>
                <div className="mt-2 flex items-center gap-6 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                        <span>👨‍🏫</span> Class Teacher: <span className="font-medium text-slate-700">Priya Sharma (Placeholder)</span>
                    </span>
                    <span className="flex items-center gap-1">
                        {/* Requirement: Dynamic Student Count */}
                        <span>👨‍🎓</span> Students: <span className="font-medium text-slate-700">{students.length}</span>
                    </span>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
                    Export
                </button>
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
                    Edit Section
                </button>
            </div>
        </div>
      </div>

      {/* 3. Tabs Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto">
            {tabs.map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                {tab}
            </button>
            ))}
        </div>
      </div>
      
      {/* 4. Tab Content */}
      <div className="min-h-[300px]">
        
        {/* STUDENTS TAB (Default) */}
        {activeTab === 'students' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
             <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Student List</h3>
                <button 
                    onClick={() => navigate('/students/add')}
                    className="text-sm bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-indigo-600"
                >
                    + Add New Student
                </button>
             </div>
             
             {students.length === 0 ? (
                 <div className="p-12 text-center text-slate-500">
                    <p className="mb-2">No students found in this section.</p>
                    <button onClick={() => navigate('/students/add')} className="text-indigo-600 hover:underline">Add a student now</button>
                 </div>
             ) : (
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Admission No</th>
                            <th className="px-6 py-3 font-medium">Phone</th>
                            <th className="px-6 py-3 font-medium">Gender</th>
                            <th className="px-6 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map(student => (
                            <tr 
                                key={student.id} 
                                className="hover:bg-indigo-50/30 cursor-pointer transition-colors"
                                onClick={() => navigate(`/students/${student.id}`)}
                            >
                                <td className="px-6 py-3 font-medium text-slate-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                            {student.firstName[0]}{student.lastName[0]}
                                        </div>
                                        {student.firstName} {student.lastName}
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-slate-600">{student.admissionNo}</td>
                                <td className="px-6 py-3 text-slate-600">{student.phone}</td>
                                <td className="px-6 py-3 text-slate-600">{student.gender || '-'}</td>
                                <td className="px-6 py-3 text-slate-400 text-xs">View Profile &rarr;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             )}
          </div>
        )}

        {/* PLACEHOLDERS FOR OTHER TABS */}
        {activeTab !== 'students' && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400">
                <div className="text-4xl mb-2">📊</div>
                <p>{activeTab.toUpperCase()} module coming soon.</p>
            </div>
        )}

      </div>
    </main>
  );
}