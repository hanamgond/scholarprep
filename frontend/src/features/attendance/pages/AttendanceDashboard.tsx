import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';
import type { Class } from '../types';

export default function AttendanceDashboard() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await attendanceService.getClasses();
        setClasses(data);
      } catch (error) {
        console.error("Failed to load classes", error);
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your classes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
        <label className="font-medium text-gray-700">Select Date:</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <h3 className="text-lg font-medium text-gray-900">Select a Class Section</h3>

      {classes.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No classes found. Go to "Classes" module to add some!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h4 className="text-lg font-bold text-gray-800">{cls.name}</h4>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cls.sections.length > 0 ? (
                  cls.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => navigate(`/attendance/${section.id}?date=${selectedDate}`)}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                    >
                      <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {section.name}
                      </div>
                      <span className="font-semibold text-gray-900">Section {section.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{section.studentCount || 0} Students</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">No sections created for this class.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}