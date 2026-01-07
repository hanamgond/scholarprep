import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { StaffRole } from '../types/staff';
import type { CreateStaffDTO } from '../types/staff';
import { createStaff } from '../services/staffService';

// NEW: Import Department Service
import { getDepartments } from '../../departments/services/departmentService';
import type { Department } from '../../departments/types';

export default function AddStaff() {
  const { register, handleSubmit } = useForm<CreateStaffDTO>();
  const navigate = useNavigate();
  
  // State for dynamic departments
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]);

  // Fetch departments on load
  useEffect(() => {
    getDepartments().then(setDepartmentOptions);
  }, []);

  const onSubmit: SubmitHandler<CreateStaffDTO> = async (data) => {
    await createStaff(data);
    navigate('/staff');
  };

  return (
    <div className="max-w-2xl bg-white shadow rounded-lg p-8">
      <h2 className="text-xl font-bold mb-6">Onboard New Staff</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            {...register('fullName', { required: true })} 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email"
              {...register('email', { required: true })} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              type="tel"
              {...register('phoneNumber', { required: true })} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            />
        </div>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              {...register('role', { required: true })} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {Object.values(StaffRole).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          {/* DYNAMIC DEPARTMENT DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select 
              {...register('department', { required: true })} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Department</option>
              {departmentOptions.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Join Date</label>
            <input 
              type="date"
              {...register('joinDate', { required: true })} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            />
          </div>
        </div>

        <div className="flex justify-end pt-5">
            <button 
                type="button"
                onClick={() => navigate('/staff')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Save Staff
            </button>
        </div>
      </form>
    </div>
  );
}