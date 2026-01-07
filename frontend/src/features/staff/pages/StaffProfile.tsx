import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Staff } from '../types/staff';
import { getStaffById } from '../services/staffService';
import StaffWorkload from '../components/profile/StaffWorkload';
import StaffCapabilities from '../components/profile/StaffCapabilities';
import StaffSettings from '../components/profile/StaffSettings';
// import StaffLeaves from '../components/profile/StaffLeaves';

export default function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [activeTab, setActiveTab] = useState('workload');

  useEffect(() => {
    if (id) getStaffById(id).then((data) => setStaff(data || null));
  }, [id]);

  if (!staff) return <div className="p-6">Loading staff details...</div>;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white shadow rounded-lg p-6 flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
            {staff.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{staff.fullName}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{staff.role}</span>
              <span>•</span>
              <span>{staff.department}</span>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/staff')} className="text-gray-400 hover:text-gray-600">Back</button>
      </div>

      {/* 2. Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'workload', label: 'Academic Workload' },
            { id: 'capabilities', label: 'Permissions' },
            { id: 'settings', label: 'Admin Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 3. Content */}
      <div className="min-h-[400px]">
        {activeTab === 'workload' && <StaffWorkload staff={staff} />}
        {activeTab === 'capabilities' && <StaffCapabilities staff={staff} />}
        {activeTab === 'settings' && <StaffSettings staff={staff} />}
      </div>
    </div>
  );
}