import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';
import type { AttendanceStudent } from '../types';

export default function MarkAttendance() {
  // Note: We use 'classId' here because that's what we defined in App.tsx route (:classId)
  // ideally we should rename the route param to :sectionId, but this works fine.
  const { classId: sectionId } = useParams(); 
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sectionId) {
      attendanceService.getStudentsForAttendance(sectionId)
        .then(setStudents)
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [sectionId]);

  const toggleStatus = (id: string) => {
    setStudents(current => 
      current.map(s => {
        if (s.id === id) {
          const newStatus = s.status === 'Present' ? 'Absent' : 'Present';
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const handleSave = async () => {
    if (!sectionId) return;
    setSaving(true);
    await attendanceService.saveAttendance(sectionId, date, students);
    setSaving(false);
    alert("Attendance Saved Successfully!");
    navigate('/attendance');
  };

  // Stats calculation
  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;

  if (loading) return <div className="p-8 text-center">Loading students...</div>;

  return (
    <div className="bg-white shadow rounded-lg flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Mark Attendance</h2>
          <div className="flex gap-4 text-sm mt-1">
             <span className="text-gray-500">Date: <span className="font-medium text-gray-900">{date}</span></span>
             <span className="text-green-600 font-medium">Present: {presentCount}</span>
             <span className="text-red-600 font-medium">Absent: {absentCount}</span>
          </div>
        </div>
        <div className="space-x-3">
          <button 
            onClick={() => navigate('/attendance')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Register'}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-6">
        {students.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No students found in this section. Add students via the "Students" module first.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div 
                key={student.id}
                onClick={() => toggleStatus(student.id)}
                className={`
                  cursor-pointer rounded-lg border-2 p-4 flex items-center justify-between transition-all select-none
                  ${student.status === 'Present' 
                    ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                    : 'border-red-200 bg-red-50 hover:bg-red-100'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                    {student.firstName.charAt(0)}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-gray-500">{student.admissionNo}</p>
                  </div>
                </div>
                
                <div className={`
                  px-3 py-1 rounded-full text-xs font-bold
                  ${student.status === 'Present' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}
                `}>
                  {student.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}