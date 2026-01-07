// src/features/settings/pages/AccessControlSettings.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, Save, X as XIcon, AlertTriangle } from 'lucide-react';
import { mockDb } from '../../../mocks/db';
import type { Role, Permission } from '../types/rbac';
import { PermissionMatrix } from '../components/PermissionMatrix';
import toast from 'react-hot-toast';

export const AccessControlSettings: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Mock current user - in real app, get from auth context
  const currentUser = {
    id: 'user-1',
    name: 'Admin User',
    role: 'Administrator',
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = () => {
    const fetchedRoles = mockDb.getRoles();
    setRoles(fetchedRoles);
  };

  const handlePermissionToggle = (roleId: string, permission: Permission, enabled: boolean) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    let updatedPermissions: Permission[];
    
    if (enabled) {
      // Add permission
      updatedPermissions = [...role.permissions, permission];
    } else {
      // Remove permission
      updatedPermissions = role.permissions.filter(p => p !== permission);
    }

    // Update in mockDb
    mockDb.updateRolePermissions(roleId, updatedPermissions, currentUser);
    
    // Update local state
    setRoles(roles.map(r => 
      r.id === roleId 
        ? { ...r, permissions: updatedPermissions }
        : r
    ));
    
    setHasChanges(true);
    toast.success('Permission updated');
  };

  const handleCreateRole = (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newRole = mockDb.createRole(roleData, currentUser);
      setRoles([...roles, newRole]);
      setIsCreateModalOpen(false);
      toast.success(`Role "${newRole.name}" created successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create role');
    }
  };

  const handleUpdateRole = (roleId: string, updates: Partial<Role>) => {
    try {
      const updatedRole = mockDb.updateRole(roleId, updates, currentUser);
      if (updatedRole) {
        setRoles(roles.map(r => r.id === roleId ? updatedRole : r));
        setEditingRole(null);
        toast.success('Role updated successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    }
  };

  const handleDeleteRole = (roleId: string) => {
    try {
      mockDb.deleteRole(roleId, currentUser);
      setRoles(roles.filter(r => r.id !== roleId));
      setDeletingRole(null);
      toast.success('Role deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete role');
    }
  };

  const handleSaveChanges = () => {
    setHasChanges(false);
    toast.success('All changes saved successfully');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Access Control</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage roles and permissions for your organization
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <button
                  onClick={handleSaveChanges}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              )}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Roles Overview Cards */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map(role => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => setEditingRole(role)}
                  onDelete={() => setDeletingRole(role)}
                />
              ))}
            </div>
          </div>

          {/* Permission Matrix */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Permission Matrix</h3>
              <p className="text-sm text-gray-600 mt-1">
                Grant or revoke permissions for each role. System roles cannot be edited.
              </p>
            </div>
            <PermissionMatrix
              roles={roles}
              onPermissionToggle={handlePermissionToggle}
            />
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                  <p className="text-sm text-gray-500">Automatically log out users after inactivity</p>
                </div>
                <select className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option>15 min</option>
                  <option selected>30 min</option>
                  <option>60 min</option>
                  <option>Never</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Concurrent Logins</p>
                  <p className="text-sm text-gray-500">Allow users to log in from multiple devices</p>
                </div>
                <button
                  type="button"
                  className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  role="switch"
                  aria-checked="false"
                >
                  <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      {isCreateModalOpen && (
        <CreateRoleModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateRole}
        />
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <EditRoleModal
          role={editingRole}
          onClose={() => setEditingRole(null)}
          onUpdate={handleUpdateRole}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingRole && (
        <DeleteRoleModal
          role={deletingRole}
          onClose={() => setDeletingRole(null)}
          onConfirm={() => handleDeleteRole(deletingRole.id)}
        />
      )}
    </div>
  );
};

// Role Card Component
const RoleCard: React.FC<{
  role: Role;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ role, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{role.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
          </div>
        </div>
        {!role.isSystem && (
          <div className="flex items-center space-x-1">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Edit role"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete role"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {role.permissions.length} permissions
        </span>
        {role.isSystem && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            System
          </span>
        )}
      </div>
    </div>
  );
};

// Create Role Modal Component
const CreateRoleModal: React.FC<{
  onClose: () => void;
  onCreate: (data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => void;
}> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name,
      description,
      permissions: [],
      isSystem: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Role</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Librarian"
            />
          </div>
          
          <div>
            <label htmlFor="role-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Brief description of this role's responsibilities"
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Role Modal (similar to Create)
const EditRoleModal: React.FC<{
  role: Role;
  onClose: () => void;
  onUpdate: (roleId: string, updates: Partial<Role>) => void;
}> = ({ role, onClose, onUpdate }) => {
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(role.id, { name, description });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Role</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={role.isSystem}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteRoleModal: React.FC<{
  role: Role;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ role, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Role</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete the role <strong>"{role.name}"</strong>? 
          This action cannot be undone.
        </p>
        
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessControlSettings;