import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Shield, Calendar, Database } from 'lucide-react';

export const SettingsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: 'General', path: '/settings/general', icon: Building2 },
    { name: 'Access Control', path: '/settings/access-control', icon: Shield },
    { name: 'Academic', path: '/settings/academic', icon: Calendar },
    { name: 'Data & Audit', path: '/settings/data', icon: Database },
  ];

  const currentTab = tabs.find(tab => location.pathname.includes(tab.path)) || tabs[0];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 pb-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-500 mb-6">Manage system configuration, roles, and preferences.</p>
        
        {/* Horizontal Tabs */}
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = location.pathname.includes(tab.path);
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Icon className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area - This is where the pages render */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;