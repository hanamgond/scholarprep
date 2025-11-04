// src/features/students/pages/Overview.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type Student,
  type StudentListItem,
} from '@/features/students/types/student';

import {
  studentsService,
  mapStudentToListItem,
} from '@/features/students/services/students';

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

// REMOVED: Unused Metric component since the metrics section is commented out

// --- Main Overview Component ---
export default function Overview() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentListItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const backendStudents: Student[] = await studentsService.getAll();
        setStudents(backendStudents.map(mapStudentToListItem));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={students.length} icon="🎓" />
          <StatCard title="New Admissions (Month)" value={0} icon="✨" />
      </div>

      {/* Student List */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-base font-semibold">Students</h3>
            <p className="text-sm text-slate-500">Showing {students.length} students</p>
          </div>
          <button className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm" onClick={() => navigate('/students/add')}>
            + Add Student
          </button>
        </div>
        <ul className="divide-y divide-slate-200">
          {students.map((s) => (
            <li key={s.id} className="px-6 py-4 hover:bg-indigo-50/40 transition">
              <div className="flex flex-wrap items-center gap-4">
                <img src={s.avatarUrl} alt={s.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1 min-w-[300px]">
                  <div className="font-semibold flex items-center gap-2">
                    <span>{s.name}</span>
                    <span className="text-xs text-slate-500 bg-slate-100 rounded px-2 py-0.5">{s.admission_no}</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1 flex gap-4">
                    <span>🎓 {s.className} - {s.sectionName}</span>
                    
                    {/* ⚠️ TODO: Add 'track' and 'rank' to StudentListItem type
                    <span>🎯 {s.track}</span>
                    <span>⭐ Rank: {s.rank}</span>
                    */}
                  </div>
                </div>
                <div className="flex gap-8 min-w-[320px]">
                  {/* ⚠️ TODO: Add 'metrics' to StudentListItem type
                  <Metric label="Accuracy" value={`${s.metrics.accuracyPct}%`} delta={s.metrics.accuracyDelta} />
                  <Metric label="Q/Min" value={`${s.metrics.qpm}`} delta={s.metrics.qpmDelta} />
                  <Metric label="Consistency" value={`${s.metrics.consistencyPct}%`} delta={s.metrics.consistencyDelta} />
                  */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}