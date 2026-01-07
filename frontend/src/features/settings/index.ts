// src/features/settings/index.ts
// Public API for the Settings module

// Layouts
export { SettingsLayout } from './layouts/SettingsLayout';

// Pages
export { AccessControlSettings } from './pages/AccessControlSettings';

// Components
export { PermissionMatrix } from './components/PermissionMatrix';

// Types
export type { 
  Role, 
  Permission, 
  PermissionModule 
} from './types/rbac';

export type {
  SystemConfig,
  AcademicYear,
  GradingScheme
} from './types/settings';

export type {
  AuditLog,
  AuditAction,
  AuditLogFilters
} from './types/audit';

// Constants
export { 
  AVAILABLE_PERMISSIONS,
  hasPermission,
  getAllPermissions 
} from './types/rbac';

export { DEFAULT_SYSTEM_CONFIG } from './types/settings';

// Routes
export { SettingsRoutes } from './routes';