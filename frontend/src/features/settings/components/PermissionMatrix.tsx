// src/features/settings/components/PermissionMatrix.tsx
import React, { useState } from 'react';
import { Check, X, Info } from 'lucide-react';
import type { Role, Permission, PermissionModule } from '../types/rbac';
import { AVAILABLE_PERMISSIONS } from '../types/rbac';

interface PermissionMatrixProps {
  roles: Role[];
  onPermissionToggle: (roleId: string, permission: Permission, enabled: boolean) => void;
  readOnly?: boolean;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  roles,
  onPermissionToggle,
  readOnly = false,
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(AVAILABLE_PERMISSIONS.map(m => m.module))
  );

  const toggleModule = (module: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(module)) {
        next.delete(module);
      } else {
        next.add(module);
      }
      return next;
    });
  };

  const hasPermission = (role: Role, permission: Permission): boolean => {
    return role.permissions.includes(permission) || 
           role.permissions.includes('all' as Permission);
  };

  const isRoleEditable = (role: Role): boolean => {
    return !role.isSystem && !readOnly;
  };

  const handleToggle = (role: Role, permission: Permission) => {
    if (!isRoleEditable(role)) return;
    
    const currentlyHas = hasPermission(role, permission);
    onPermissionToggle(role.id, permission, !currentlyHas);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Role Columns */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="grid" style={{
          gridTemplateColumns: `300px repeat(${roles.length}, minmax(120px, 1fr))`
        }}>
          {/* Permission Column Header */}
          <div className="p-4 font-semibold text-gray-900 border-r border-gray-200">
            Permissions
          </div>
          
          {/* Role Column Headers */}
          {roles.map(role => (
            <div 
              key={role.id}
              className="p-4 text-center border-r border-gray-200 last:border-r-0"
            >
              <div className="font-semibold text-gray-900">{role.name}</div>
              {role.isSystem && (
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  System
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Permission Rows by Module */}
      <div className="divide-y divide-gray-200">
        {AVAILABLE_PERMISSIONS.map((module: PermissionModule) => {
          const isExpanded = expandedModules.has(module.module);
          
          return (
            <div key={module.module}>
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.module)}
                className="w-full text-left hover:bg-gray-50 transition-colors"
              >
                <div className="grid items-center" style={{
                  gridTemplateColumns: `300px repeat(${roles.length}, minmax(120px, 1fr))`
                }}>
                  <div className="p-4 flex items-center space-x-2 border-r border-gray-200">
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isExpanded ? 'transform rotate-90' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">{module.module}</div>
                      {module.description && (
                        <div className="text-xs text-gray-500">{module.description}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Module-level summary for each role */}
                  {roles.map(role => {
                    const modulePermissions = module.actions.map(a => a.value);
                    const grantedCount = modulePermissions.filter(p => hasPermission(role, p)).length;
                    const totalCount = modulePermissions.length;
                    
                    return (
                      <div 
                        key={role.id}
                        className="p-4 text-center border-r border-gray-200 last:border-r-0"
                      >
                        <span className="text-sm text-gray-600">
                          {grantedCount}/{totalCount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </button>

              {/* Permission Actions (Collapsible) */}
              {isExpanded && (
                <div className="bg-gray-50">
                  {module.actions.map((action) => (
                    <div 
                      key={action.value}
                      className="grid items-center hover:bg-white transition-colors"
                      style={{
                        gridTemplateColumns: `300px repeat(${roles.length}, minmax(120px, 1fr))`
                      }}
                    >
                      {/* Permission Label */}
                      <div className="p-3 pl-12 border-r border-gray-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{action.label}</span>
                          {action.description && (
                            <div className="group relative">
                              <Info className="w-4 h-4 text-gray-400 cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10">
                                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                  {action.description}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 font-mono">
                          {action.value}
                        </div>
                      </div>

                      {/* Permission Toggle for Each Role */}
                      {roles.map(role => {
                        const granted = hasPermission(role, action.value);
                        const editable = isRoleEditable(role);
                        
                        return (
                          <div 
                            key={role.id}
                            className="p-3 flex justify-center border-r border-gray-200 last:border-r-0"
                          >
                            <button
                              onClick={() => handleToggle(role, action.value)}
                              disabled={!editable}
                              className={`
                                w-8 h-8 rounded-md flex items-center justify-center transition-all
                                ${editable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                ${granted 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }
                              `}
                              title={editable ? (granted ? 'Click to revoke' : 'Click to grant') : 'System role - cannot edit'}
                            >
                              {granted ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <X className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Legend */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-700" />
            </div>
            <span>Granted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
              <X className="w-4 h-4 text-gray-400" />
            </div>
            <span>Not Granted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              System
            </div>
            <span>Cannot be edited</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrix;