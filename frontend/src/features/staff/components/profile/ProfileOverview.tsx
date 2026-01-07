import { Link } from 'react-router-dom';
import type { Staff } from '../../types/staff';

export default function ProfileOverview({ staff }: { staff: Staff }) {
  
  // Helper to display data rows consistently
  const InfoRow = ({ label, value, isLink, linkTo }: { label: string, value: string | undefined, isLink?: boolean, linkTo?: string }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {isLink && linkTo ? (
          <Link to={linkTo} className="text-indigo-600 hover:text-indigo-900 hover:underline">
            {value || '-'}
          </Link>
        ) : (
          value || '-'
        )}
      </dd>
    </div>
  );

  // Mock logic to map string names to IDs (In real app, staff would have departmentId)
  const getDeptId = (deptName: string) => {
    if (deptName.includes('Exam')) return 'dept-2';
    if (deptName.includes('Admin')) return 'dept-3';
    return 'dept-1'; // Default to Academics
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and contact information.</p>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
          Edit Details
        </button>
      </div>
      
      <div className="border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <InfoRow label="Full Name" value={staff.fullName} />
          <InfoRow label="Email Address" value={staff.email} />
          <InfoRow label="Phone Number" value={staff.phoneNumber} />
          
          {/* UPDATED: Links to the Department Module */}
          <InfoRow 
            label="Department" 
            value={staff.department} 
            isLink={true} 
            linkTo={`/departments/${getDeptId(staff.department)}`} 
          />
          
          <InfoRow label="Date of Joining" value={staff.joinDate} />
          <InfoRow label="Employee ID" value={staff.id} />
          
          <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Current Address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              123 Scholar Lane, Knowledge City<br />
              Academic District, 400706
            </dd>
          </div>

          <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className="font-medium">Sarah Johnson (Spouse)</span> <br />
              +91 98765 43210
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}