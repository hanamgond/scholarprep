// 1. Replaced 'enum' with a const object
export const AuditAction = {
  // Student actions
  STUDENT_CREATED: 'student.created',
  STUDENT_UPDATED: 'student.updated',
  STUDENT_DELETED: 'student.deleted',
  STUDENT_BULK_IMPORTED: 'student.bulk_imported',
  
  // Exam actions
  EXAM_CREATED: 'exam.created',
  EXAM_UPDATED: 'exam.updated',
  EXAM_PUBLISHED: 'exam.published',
  EXAM_DELETED: 'exam.deleted',
  
  // Staff actions
  STAFF_CREATED: 'staff.created',
  STAFF_UPDATED: 'staff.updated',
  STAFF_DELETED: 'staff.deleted',
  STAFF_ROLE_CHANGED: 'staff.role_changed',
  
  // Attendance
  ATTENDANCE_MARKED: 'attendance.marked',
  ATTENDANCE_MODIFIED: 'attendance.modified',
  
  // RBAC
  ROLE_CREATED: 'role.created',
  ROLE_UPDATED: 'role.updated',
  ROLE_DELETED: 'role.deleted',
  PERMISSION_CHANGED: 'permission.changed',
  
  // Security
  LOGIN_SUCCESS: 'auth.login.success',
  LOGIN_FAILED: 'auth.login.failed',
  PASSWORD_CHANGED: 'auth.password.changed',
  LOGOUT: 'auth.logout',
  
  // System
  SETTINGS_CHANGED: 'system.settings.changed',
  BACKUP_CREATED: 'system.backup.created',
  DATA_IMPORTED: 'system.data.imported',
  ACADEMIC_YEAR_CHANGED: 'system.academic_year.changed',
} as const;

// 2. Export the Type derived from the values
// This allows you to use 'AuditAction' as a Type in your interfaces just like before
export type AuditAction = typeof AuditAction[keyof typeof AuditAction];

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  entity: string; // "Student", "Exam", "Staff", etc.
  entityId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  severity: 'info' | 'warning' | 'critical';
  
  // Change tracking
  changeSet?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
}

export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: AuditAction;
  entity?: string;
  severity?: AuditLog['severity'];
}