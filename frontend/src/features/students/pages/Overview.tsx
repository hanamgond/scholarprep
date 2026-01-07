import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StudentListItem } from '@/features/students/types/student';
import { studentsService, mapStudentToListItem } from '@/features/students/services/students';

// --- Helper Components for this page ---
function StatCard({ title, value, icon }: { title: string, value: string | number, icon: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="text-3xl bg-indigo-100 text-indigo-600 rounded-full h-12 w-12 grid place-items-center">{icon}</div>
            <div>
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm text-slate-500">{title}</div>
            </div>
        </div>
    );
}

// --- Main Overview Component ---
export default function Overview() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch paginated data
        const response = await studentsService.getAll(currentPage);
        
        // Map response to UI items
        setStudents(response.items.map(mapStudentToListItem));
        setTotalPages(response.totalPages);
        setTotalStudents(response.totalCount);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load students. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage]);

  if (loading) {
    return <div className="p-6 text-center text-slate-500">Loading students...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={totalStudents} icon="🎓" />
          <StatCard title="New Admissions (Month)" value={0} icon="✨" />
      </div>

      {/* Student List */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-base font-semibold">Students</h3>
            <p className="text-sm text-slate-500">
              Showing page {currentPage} of {totalPages || 1} ({totalStudents} students total)
            </p>
          </div>
          <button 
            className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700" 
            onClick={() => navigate('/students/add')}
          >
            + Add Student
          </button>
        </div>
        
        <ul className="divide-y divide-slate-200">
          {students.map((s) => (
            <li 
              key={s.id} 
              // 👇 FIX: Added cursor-pointer and hover effect
              className="px-6 py-4 hover:bg-indigo-50/40 transition cursor-pointer"
              // 👇 FIX: Navigate to details page on click
              onClick={() => navigate(`/students/${s.id}`)}
            >
              <div className="flex flex-wrap items-center gap-4">
                <img src={s.avatarUrl} alt={s.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1 min-w-[300px]">
                  <div className="font-semibold flex items-center gap-2">
                    <span>{s.name}</span> 
                    <span className="text-xs text-slate-500 bg-slate-100 rounded px-2 py-0.5">{s.admission_no}</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1 flex gap-4">
                    {/* Displays real class/section names from DB */}
                    <span>🎓 {s.className} - {s.sectionName}</span>
                    <span>🎯 {s.track}</span>
                  </div>
                </div>
                
                {/* Metrics section placeholder */}
                <div className="flex gap-8 min-w-[320px]">
                   {/* Add metric components here later */}
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-6 py-3 bg-slate-50 border-t">
          <button 
            className="rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm disabled:opacity-50 hover:bg-slate-50"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button 
            className="rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm disabled:opacity-50 hover:bg-slate-50"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}