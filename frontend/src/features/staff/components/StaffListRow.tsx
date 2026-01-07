// src/features/staff/components/StaffListRow.tsx
import { useNavigate } from 'react-router-dom';
import { StaffRole, StaffStatus } from '../types/staff';
import type { Staff } from '../types/staff';

interface StaffListRowProps {
  staff: Staff;
}

// Fixed typo in props destructuring
export default function StaffListRow({ staff }: StaffListRowProps) {
  const navigate = useNavigate();

  const getRoleBadgeStyle = (role: StaffRole) => {
    switch (role) {
      case StaffRole.ADMIN: return 'bg-purple-100 text-purple-800 border-purple-200';
      case StaffRole.TEACHER: return 'bg-blue-100 text-blue-800 border-blue-200';
      case StaffRole.CONTENT_CREATOR: return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: StaffStatus) => {
    switch (status) {
      case StaffStatus.ACTIVE: return 'bg-green-400';
      case StaffStatus.ON_LEAVE: return 'bg-yellow-400';
      case StaffStatus.TERMINATED: return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <tr 
      onClick={() => navigate(`/staff/${staff.id}`)}
      className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {staff.avatarUrl ? (
              <img className="h-10 w-10 rounded-full object-cover" src={staff.avatarUrl} alt="" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                {staff.fullName.charAt(0)}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{staff.fullName}</div>
            <div className="text-xs text-gray-500">{staff.email}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeStyle(staff.role)}`}>
          {staff.role.replace('_', ' ')}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {staff.department}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`h-2.5 w-2.5 rounded-full mr-2 ${getStatusColor(staff.status)}`}></div>
          <span className="text-sm text-gray-700">{staff.status}</span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/staff/${staff.id}?tab=settings`); }}
          className="text-indigo-600 hover:text-indigo-900 mr-4"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}