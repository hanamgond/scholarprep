import { useState } from 'react';
import type { LeaveRequest } from '../types/leaves';

const MOCK_REQUESTS: LeaveRequest[] = [
  {
    id: '101',
    staffId: '1',
    staffName: 'Alice Johnson',
    type: 'Sick',
    startDate: '2023-10-10',
    endDate: '2023-10-11',
    daysCount: 2,
    reason: 'Viral Fever',
    status: 'Pending',
    appliedOn: '2023-10-09'
  }
];

export default function LeaveManagement() {
  const [requests] = useState<LeaveRequest[]>(MOCK_REQUESTS);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Leave Requests</h2>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {requests.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {requests.map((req) => (
              <li key={req.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-indigo-600">{req.staffName}</h3>
                      <span className="text-sm text-gray-500">Applied: {req.appliedOn}</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {req.type} Leave • {req.daysCount} Days
                      <span className="text-gray-500 font-normal text-sm ml-2">
                         ({req.startDate} to {req.endDate})
                      </span>
                    </p>
                    <p className="text-gray-600 mt-1 italic">"{req.reason}"</p>
                  </div>
                  
                  <div className="ml-6 flex items-center space-x-3">
                    <button className="bg-green-600 text-white px-4 py-2 rounded shadow-sm hover:bg-green-700 text-sm font-medium">
                      Approve
                    </button>
                    <button className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded shadow-sm hover:bg-red-100 text-sm font-medium">
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center text-gray-500">No pending leave requests.</div>
        )}
      </div>
    </div>
  );
}