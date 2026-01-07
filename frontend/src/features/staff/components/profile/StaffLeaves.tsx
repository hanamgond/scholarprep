import { useState } from 'react';
import type { LeaveBalance, LeaveRequest } from '../../types/leaves';

const MOCK_BALANCES: LeaveBalance[] = [
  { type: 'Casual', allocated: 12, used: 8, available: 4 },
  { type: 'Sick', allocated: 10, used: 2, available: 8 },
  { type: 'Earned', allocated: 15, used: 0, available: 15 },
  { type: 'Unpaid', allocated: 0, used: 1, available: 0 },
];

const MOCK_HISTORY: LeaveRequest[] = [
  {
    id: '101',
    staffId: '1',
    staffName: 'Alice Johnson',
    type: 'Sick',
    startDate: '2023-10-10',
    endDate: '2023-10-12',
    daysCount: 3,
    reason: 'Viral Fever',
    status: 'Approved',
    appliedOn: '2023-10-09',
  },
  {
    id: '102',
    staffId: '1',
    staffName: 'Alice Johnson',
    type: 'Casual',
    startDate: '2023-11-05',
    endDate: '2023-11-06',
    daysCount: 2,
    reason: 'Personal function',
    status: 'Pending',
    appliedOn: '2023-10-25',
  },
];

export default function StaffLeaves() {
  const [balances] = useState<LeaveBalance[]>(MOCK_BALANCES);
  const [history] = useState<LeaveRequest[]>(MOCK_HISTORY);

  return (
    <div className="space-y-8">
      {/* 1. Balances Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((bal) => (
          <div key={bal.type} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{bal.type}</span>
                <span className="text-xs font-semibold text-gray-400">
                  {bal.used}/{bal.allocated} Used
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{bal.available}</div>
              <div className="text-xs text-gray-500 mt-1">Days Available</div>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
              <div 
                className={`h-1.5 rounded-full ${
                  (bal.available / (bal.allocated || 1)) < 0.2 ? 'bg-red-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${(bal.available / (bal.allocated || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Action Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Leave History</h3>
        <button 
          onClick={() => alert("Open Modal: Apply Leave")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          + Apply New Leave
        </button>
      </div>

      {/* 3. History List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {history.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {req.startDate} <span className="text-gray-400 mx-1">to</span> {req.endDate}
                    <span className="ml-2 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                      {req.daysCount} days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.appliedOn}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${req.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">No leave history found.</div>
        )}
      </div>
    </div>
  );
}