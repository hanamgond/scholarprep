// src/features/settings/types/rbac.ts

export type Permission = 
  | 'all'
  // Student Permissions
  | 'students.view'
  | 'students.create'
  | 'students.update'
  | 'students.delete'
  | 'students.export'
  // Exam Permissions
  | 'exams.view'
  | 'exams.create'
  | 'exams.update'
  | 'exams.delete'
  | 'exams.publish'
  // Class Permissions
  | 'classes.view'
  | 'classes.create'
  | 'classes.update'
  | 'classes.delete'
  // Attendance Permissions
  | 'attendance.view'
  | 'attendance.mark'
  | 'attendance.report'
  // Staff Permissions
  | 'staff.view'
  | 'staff.create'
  | 'staff.update'
  | 'staff.delete'
  // Settings Permissions
  | 'settings.view'
  | 'settings.manage';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionAction {
  label: string;
  value: Permission;
  description?: string;
}

export interface PermissionModule {
  module: string;
  description?: string;
  actions: PermissionAction[];
}

export const AVAILABLE_PERMISSIONS: PermissionModule[] = [
  {
    module: 'Students',
    description: 'Manage student records and data',
    actions: [
      { label: 'View Students', value: 'students.view', description: 'View student profiles and lists' },
      { label: 'Create Students', value: 'students.create', description: 'Add new students to the system' },
      { label: 'Edit Students', value: 'students.update', description: 'Update student details' },
      { label: 'Delete Students', value: 'students.delete', description: 'Remove students from the system' },
    ]
  },
  {
    module: 'Exams',
    description: 'Manage examinations and results',
    actions: [
      { label: 'View Exams', value: 'exams.view' },
      { label: 'Create Exams', value: 'exams.create' },
      { label: 'Edit Exams', value: 'exams.update' },
      { label: 'Publish Results', value: 'exams.publish', description: 'Make exam results visible to students' },
    ]
  },
  {
    module: 'Classes',
    description: 'Manage academic classes and sections',
    actions: [
      { label: 'View Classes', value: 'classes.view' },
      { label: 'Manage Classes', value: 'classes.create', description: 'Create and edit class structures' },
    ]
  },
  {
    module: 'Attendance',
    description: 'Track student attendance',
    actions: [
      { label: 'View Attendance', value: 'attendance.view' },
      { label: 'Mark Attendance', value: 'attendance.mark' },
    ]
  },
  {
    module: 'Settings',
    description: 'System configuration',
    actions: [
      { label: 'View Settings', value: 'settings.view' },
      { label: 'Manage Settings', value: 'settings.manage', description: 'Modify system-wide configurations' },
    ]
  }
];

// --- MISSING HELPERS ADDED BELOW ---

// Helper: Check if a role has a specific permission
export const hasPermission = (role: Role, permission: Permission): boolean => {
  if (!role || !role.permissions) return false;
  return role.permissions.includes('all') || role.permissions.includes(permission);
};

// Helper: Get all permissions as a flat array (useful for "Select All" logic)
export const getAllPermissions = (): Permission[] => {
  return AVAILABLE_PERMISSIONS.flatMap(module => module.actions.map(action => action.value));
};