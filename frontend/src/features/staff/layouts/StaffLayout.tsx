import { Link, Outlet, useLocation } from 'react-router-dom';

const tabs = [
  { name: 'Directory', path: '/staff' },
  { name: 'Add Staff', path: '/staff/add' },
  { name: 'Attendance', path: '/staff/attendance' },
  { name: 'Leave Requests', path: '/staff/leaves' }, 
];

export default function StaffLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Staff & Department</h1>
      </div>

      <div className="border-bHf border-gray-200">
        <nav className="-mb-pxHP flex space-x-8">
          {tabs.map((tab) => {
            // Highlight logic: Exact match for root, startsWith for others
            const isActive = tab.path === '/staff' 
              ? location.pathname === '/staff'
              : location.pathname.startsWith(tab.path);
            
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}