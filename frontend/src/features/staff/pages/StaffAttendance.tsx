import { useState } from 'react';
import type { AttendanceRecord } from '../types/leaves';

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '1', staffId: '1', name: 'Alice Johnson', department: 'Academics', date: '2023-10-10', status: 'Present', checkIn: '08:00 AM' },
  { id: '2', staffId: '2', name: 'Bob Smith', department: 'Examinations', date: '2023-10-10', status: 'Absent' },
];

export default function StaffAttendance() {
  const [records] = useState(MOCK_ATTENDANCE);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-lg font-bold">Daily Attendance Log</h2>
        <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">Mark All Present</button>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time In</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} className="border-t">
              <td className="px-6 py-4">{r.name}</td>
              <td className="px-6 py-4">
                <span className={`px-2 rounded text-xs ${r.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{r.checkIn || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}