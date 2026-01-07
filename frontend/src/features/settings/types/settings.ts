// src/features/settings/types/settings.ts

export interface SystemConfig {
  // I. General & Tenant
  school: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logoUrl?: string;
    themeColor: string;
    timezone: string;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
    currency: string;
  };
  
  // II. Security Settings
  security: {
    sessionTimeout: number; // minutes
    allowConcurrentLogins: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
  
  // III. Academic Configuration
  academic: {
    currentAcademicYearId: string;
    attendanceRules: {
      minimumRequiredPercentage: number;
      lateMarkingDeadlineDays: number;
    };
  };
  
  // IV. Feature Flags
  features: {
    modules: {
      library: boolean;
      transport: boolean;
      examBuilder: boolean;
    };
    features: {
      bulkImport: boolean;
      parentPortal: boolean;
      smsNotifications: boolean;
    };
  };
  
  // Metadata
  metadata: {
    version: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
  };
}

export interface AcademicYear {
  id: string;
  name: string; // "2025-2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'Active' | 'Archived' | 'Upcoming';
  terms?: {
    id: string;
    name: string; // "Term 1", "Semester 1"
    startDate: string;
    endDate: string;
  }[];
}

export interface GradingScheme {
  id: string;
  name: string;
  type: 'percentage' | 'gpa';
  grades: {
    grade: string; // "A+", "B", etc.
    minScore: number;
    maxScore: number;
    gpaValue?: number;
    description?: string;
  }[];
}

// Default system configuration
export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  school: {
    name: 'School Name',
    address: '',
    phone: '',
    email: '',
    themeColor: '#6366F1',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
  },
  security: {
    sessionTimeout: 30,
    allowConcurrentLogins: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
  },
  academic: {
    currentAcademicYearId: '',
    attendanceRules: {
      minimumRequiredPercentage: 75,
      lateMarkingDeadlineDays: 7,
    },
  },
  features: {
    modules: {
      library: false,
      transport: false,
      examBuilder: true,
    },
    features: {
      bulkImport: true,
      parentPortal: false,
      smsNotifications: false,
    },
  },
  metadata: {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
  },
};