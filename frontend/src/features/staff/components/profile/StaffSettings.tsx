import { useNavigate } from 'react-router-dom';
import { StaffStatus } from '../../types/staff';
import type { Staff } from '../../types/staff';
import { updateStaffStatus } from '../../services/staffService';

export default function StaffSettings({ staff }: { staff: Staff }) {
  const navigate = useNavigate();

  const handleDeactivate = async () => {
    if (confirm('Are you sure? This will revoke access immediately.')) {
      await updateStaffStatus(staff.id, StaffStatus.TERMINATED);
      alert('Staff deactivated.');
      navigate('/staff');
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
      <p className="text-sm text-red-700 mb-4">
        Deactivating a staff member prevents login but preserves historical data.
      </p>
      <button 
        onClick={handleDeactivate}
        disabled={staff.status === StaffStatus.TERMINATED}
        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
      >
        {staff.status === StaffStatus.TERMINATED ? 'Already Deactivated' : 'Deactivate Staff Member'}
      </button>
    </div>
  );
}