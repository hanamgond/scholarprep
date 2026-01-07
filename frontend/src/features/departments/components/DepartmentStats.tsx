import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Department } from '../types';
import { getDepartments } from '../services/departmentService';
import DepartmentCard from '../components/DepartmentCard';

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDepartments().then(setDepartments);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
          <p className="text-slate-500">Manage school faculties and operational units.</p>
        </div>
        <button 
          onClick={() => navigate('/departments/add')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium text-sm"
        >
          + New Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <DepartmentCard key={dept.id} dept={dept} />
        ))}
      </div>
    </div>
  );
}