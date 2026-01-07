import { Outlet } from 'react-router-dom';

export default function AttendanceLayout() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Attendance</h1>
          <p className="text-gray-500 text-sm">Manage daily class registers and reports</p>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}