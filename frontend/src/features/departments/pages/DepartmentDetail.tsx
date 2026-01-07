import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Department } from '../types';
import { getDepartmentById } from '../services/departmentService';
import { getStaffList } from '@/features/staff/services/staffService';
import type { Staff } from '@/features/staff/types/staff';
import StaffListRow from '@/features/staff/components/StaffListRow';

export default function DepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState<Department | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    if (id) {
      // FIX: Explicitly handle the 'undefined' case
      getDepartmentById(id).then((data) => {
        setDept(data || null);
      });

      // Load Staff Mock Data
      getStaffList().then(allStaff => {
        // Mock filter logic: Matches ID based on our mock conventions
        const deptName = id === 'dept-1' ? 'Academics' : id === 'dept-2' ? 'Examinations' : 'Administration'; 
        setStaff(allStaff.filter(s => s.department === deptName));
      });
    }
  }, [id]);

  if (!dept) return <div className="p-6">Loading department...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6 -mx-6 -mt-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{dept.name}</h1>
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold border border-indigo-200">
                {dept.code}
              </span>
            </div>
            <p className="text-slate-500 mt-1">{dept.description}</p>
          </div>
          <button onClick={() => navigate('/departments')} className="text-slate-400 hover:text-slate-600">
            Back to List
          </button>
        </div>
        
        {/* HOD Banner */}
        <div className="mt-6 flex items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-3">
            HOD
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Head of Department</p>
            <p className="font-medium text-slate-900">{dept.hodName || 'Not Assigned'}</p>
          </div>
          <button className="ml-auto text-sm text-indigo-600 hover:underline">Change</button>
        </div>
      </div>

      {/* Staff List Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Department Staff</h2>
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium">
            {staff.length} Members
          </span>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Dept</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.length > 0 ? (
              staff.map(member => <StaffListRow key={member.id} staff={member} />)
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No staff members assigned to this department yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}