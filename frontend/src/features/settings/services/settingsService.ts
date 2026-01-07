import { mockDb } from '../../../mocks/db';
import type { SystemConfig, AcademicYear } from '../types/settings';
import type { Role, Permission } from '../types/rbac';
import type { AuditLog } from '../types/audit';

// Helper to get current user (In a real app, this comes from AuthContext)
const getCurrentUser = () => ({ 
  id: 'user-1', 
  name: 'Admin User', 
  role: 'Administrator' 
});

export const settingsService = {
  // --- General Settings ---
  getSystemConfig: async (): Promise<SystemConfig> => {
    return mockDb.getSystemConfig();
  },

  updateSystemConfig: async (config: Partial<SystemConfig>): Promise<SystemConfig> => {
    return mockDb.updateSystemConfig(config, getCurrentUser());
  },

  // --- Roles & Access Control ---
  getRoles: async (): Promise<Role[]> => {
    return mockDb.getRoles();
  },

  createRole: async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> => {
    return mockDb.createRole(roleData, getCurrentUser());
  },

  updateRole: async (id: string, updates: Partial<Role>): Promise<Role | null> => {
    return mockDb.updateRole(id, updates, getCurrentUser());
  },

  deleteRole: async (id: string): Promise<boolean> => {
    return mockDb.deleteRole(id, getCurrentUser());
  },

  updateRolePermissions: async (roleId: string, permissions: Permission[]): Promise<boolean> => {
    return mockDb.updateRolePermissions(roleId, permissions, getCurrentUser());
  },

  // --- Academic Years ---
  getAcademicYears: async (): Promise<AcademicYear[]> => {
    return mockDb.getAcademicYears();
  },

  createAcademicYear: async (year: AcademicYear): Promise<AcademicYear> => {
    return mockDb.createAcademicYear(year, getCurrentUser());
  },

  setActiveAcademicYear: async (id: string): Promise<void> => {
    return mockDb.setActiveAcademicYear(id, getCurrentUser());
  },

  deleteAcademicYear: async (id: string): Promise<boolean> => {
    return mockDb.deleteAcademicYear(id, getCurrentUser());
  },

  // --- Audit Logs ---
  getAuditLogs: async (): Promise<AuditLog[]> => {
    return mockDb.getAuditLogs();
  }
};