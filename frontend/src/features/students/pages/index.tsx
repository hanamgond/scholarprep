import { NavLink, Outlet, useLocation } from 'react-router-dom';

const tabs = [
  { name: 'Overview', href: '/students/overview' },
  { name: 'Add Student', href: '/students/add' },
  { name: 'Bulk Create', href: '/students/bulk-create' },
  { name: 'Bulk Edit', href: '/students/bulk-edit' },
];

export default function StudentsModulePage() {
  const location = useLocation();
  const isRootPath = location.pathname === '/students' || location.pathname === '/students/';

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Management</h1>
      </div>

      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => {
          const isActive = isRootPath ? tab.href.includes('overview') : location.pathname.startsWith(tab.href);
          return (
            <NavLink
              key={tab.name}
              to={tab.href}
              className={`px-4 py-2 font-medium text-sm ${
                isActive
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.name}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </main>
  );
}
