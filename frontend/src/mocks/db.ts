import type { Student, StudentCreatePayload } from '../features/students/types/student';
import type { Class, Section } from '../services/api/class';
import type { Question, CreateQuestionRequest, ClassLevel } from '../features/questions/types/question';
import type { Exam, CreateExamRequest } from '../features/exams/types/exam';

// Settings types
import type { Role, Permission } from '../features/settings/types/rbac';
import type { SystemConfig, AcademicYear } from '../features/settings/types/settings';
import { type AuditLog, AuditAction } from '../features/settings/types/audit';

// --- 1. Storage Keys & Helpers ---
const STORAGE_KEY = 'scholarprep_mock_db';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// --- 2. Initial Seed Data ---

const seedClasses: Class[] = [
  {
    id: 'c-1',
    name: 'Class 11',
    studentCount: 1,
    avgAccuracy: 75,
    sections: [
      { id: 's-1', name: 'A', studentCount: 1, avgAccuracy: 75 },
      { id: 's-2', name: 'B', studentCount: 0, avgAccuracy: 0 }
    ]
  },
  {
    id: 'c-2',
    name: 'Class 12',
    studentCount: 0,
    avgAccuracy: 0,
    sections: []
  }
];

const seedStudents: Student[] = [
  {
    id: 'st-1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    admissionNo: 'ADM-2024-001',
    email: 'rahul.sharma@student.com',
    phone: '9876543210',
    dateOfBirth: '2007-05-15',
    campusId: 'main',
    campusName: 'Main Campus',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    className: 'Class 11',
    sectionName: 'A',
  }
];

const seedQuestions: Question[] = [
  {
    id: 'q-101',
    tenantId: 'mock-tenant',
    text: 'What is the unit of Force?',
    type: 'SCQ',
    difficulty: 'Easy',
    status: 'Published',
    subject: 'Physics',
    classLevel: '11',
    chapterId: 'Kinematics',
    tags: ['Basic', 'Units'],
    data: { 
      type: 'options', 
      options: [
        { id: 'A', text: 'Newton', isCorrect: true, explanation: 'SI Unit of Force' },
        { id: 'B', text: 'Joule', isCorrect: false, explanation: 'Energy' },
        { id: 'C', text: 'Watt', isCorrect: false, explanation: 'Power' },
        { id: 'D', text: 'Pascal', isCorrect: false, explanation: 'Pressure' }
      ] 
    },
    solution: 'Force = Mass x Acceleration. Unit is kg*m/s^2 or Newton.',
    bloomsLevel: 'Remember',
    nature: 'Memory-Based',
    idealTime: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin'
  }
];

const seedExams: Exam[] = [
  {
    id: 'exam-1',
    title: 'JEE Mains Mock Test 01',
    code: 'JM-01',
    pattern: 'JEE_MAINS',
    mode: 'Online',
    category: 'Mock',
    durationMinutes: 180,
    totalMarks: 300,
    status: 'Published',
    sections: [],
    classIds: ['11', '12'],
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin'
  }
];

// Seed Roles
const seedRoles: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: ['all' as Permission],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-teacher',
    name: 'Teacher',
    description: 'Standard teacher access',
    permissions: ['students.view', 'exams.view', 'classes.view'] as Permission[],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Seed Academic Years
const seedAcademicYears: AcademicYear[] = [
  {
    id: 'ay-2025-2026',
    name: '2025-2026',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    isCurrent: true,
    status: 'Active',
  },
];

// Seed System Config
const seedSystemConfig: SystemConfig = {
  school: {
    name: 'ScholarPrep Demo School',
    address: '123 Education Street',
    phone: '+91 1234567890',
    email: 'admin@scholarprep.edu',
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
    currentAcademicYearId: 'ay-2025-2026',
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

// --- 3. Database Initialization ---
const loadData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        classes: new Map<string, Class>(parsed.classes),
        students: new Map<string, Student>(parsed.students),
        questions: new Map<string, Question>(parsed.questions),
        exams: new Map<string, Exam>(parsed.exams || []),
        roles: parsed.roles ? new Map<string, Role>(parsed.roles) : new Map(seedRoles.map(r => [r.id, r])),
        academicYears: parsed.academicYears ? new Map<string, AcademicYear>(parsed.academicYears) : new Map(seedAcademicYears.map(y => [y.id, y])),
        systemConfig: parsed.systemConfig || seedSystemConfig,
        auditLogs: parsed.auditLogs || [],
      };
    }
  } catch (e) {
    console.warn('Failed to load mock db', e);
  }
  
  return {
    classes: new Map(seedClasses.map(c => [c.id, c])),
    students: new Map(seedStudents.map(s => [s.id, s])),
    questions: new Map(seedQuestions.map(q => [q.id, q])),
    exams: new Map(seedExams.map(e => [e.id, e])),
    roles: new Map(seedRoles.map(r => [r.id, r])),
    academicYears: new Map(seedAcademicYears.map(y => [y.id, y])),
    systemConfig: seedSystemConfig,
    auditLogs: [] as AuditLog[],
  };
};

const db = loadData();

const persist = () => {
  try {
    const data = {
      classes: Array.from(db.classes.entries()),
      students: Array.from(db.students.entries()),
      questions: Array.from(db.questions.entries()),
      exams: Array.from(db.exams.entries()),
      roles: Array.from(db.roles.entries()),
      academicYears: Array.from(db.academicYears.entries()),
      systemConfig: db.systemConfig,
      auditLogs: db.auditLogs,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save mock db', e);
  }
};

const createAuditLog = (
  action: AuditAction,
  userId: string,
  userName: string,
  userRole: string,
  entity: string,
  details: string,
  entityId?: string,
  severity: AuditLog['severity'] = 'info',
  changeSet?: { before: Record<string, unknown>; after: Record<string, unknown> }
): void => {
  const log: AuditLog = {
    id: generateId(),
    userId,
    userName,
    userRole,
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString(),
    severity,
    changeSet,
  };
  
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 1000) db.auditLogs = db.auditLogs.slice(0, 1000);
  persist();
};

// --- 4. Database Operations ---
export const mockDb = {
  // --- CLASSES ---
  getClasses: () => Array.from(db.classes.values()),

  createClass: (name: string) => {
    const newClass: Class = {
      id: generateId(),
      name,
      studentCount: 0,
      avgAccuracy: 0,
      sections: [],
    };
    db.classes.set(newClass.id, newClass);
    persist();
    return newClass;
  },

  updateClass: (id: string, name: string) => {
    const cls = db.classes.get(id);
    if (cls) {
      cls.name = name;
      db.classes.set(id, cls);
      persist();
      return cls;
    }
    return null;
  },

  deleteClass: (id: string) => {
    const deleted = db.classes.delete(id);
    persist();
    return deleted;
  },

  // --- SECTIONS ---
  getSectionById: (sectionId: string) => {
    for (const cls of db.classes.values()) {
      const section = cls.sections.find(s => s.id === sectionId);
      if (section) {
        return { section, class: cls };
      }
    }
    return null;
  },

  createSection: (classId: string, name: string) => {
    const cls = db.classes.get(classId);
    if (!cls) return null;

    const newSection: Section = {
      id: generateId(),
      name,
      studentCount: 0,
      avgAccuracy: 0,
    };
    cls.sections.push(newSection);
    persist();
    return newSection;
  },

  updateSection: (sectionId: string, name: string) => {
    for (const cls of db.classes.values()) {
      const section = cls.sections.find(s => s.id === sectionId);
      if (section) {
        section.name = name;
        persist();
        return section;
      }
    }
    return null;
  },

  deleteSection: (sectionId: string) => {
    for (const cls of db.classes.values()) {
      const index = cls.sections.findIndex(s => s.id === sectionId);
      if (index !== -1) {
        cls.sections.splice(index, 1);
        persist();
        return true;
      }
    }
    return false;
  },

  // --- STUDENTS ---
  getStudents: () => Array.from(db.students.values()),
  
  getStudentById: (id: string) => db.students.get(id),

  getStudentsBySection: (sectionId: string) => {
    let targetSectionName = "";
    let targetClassName = "";
    
    for (const cls of db.classes.values()) {
      const sec = cls.sections.find(s => s.id === sectionId);
      if (sec) {
        targetSectionName = sec.name;
        targetClassName = cls.name;
        break;
      }
    }

    if (!targetSectionName) return [];

    return Array.from(db.students.values()).filter(s => 
      s.sectionName === targetSectionName && s.className === targetClassName
    );
  },

  createStudent: (payload: StudentCreatePayload) => {
    let className = 'N/A';
    let sectionName = 'N/A';
    let classObj: Class | undefined;

    for (const cls of db.classes.values()) {
      const foundSection = cls.sections.find(s => s.id === payload.sectionId);
      if (foundSection) {
        className = cls.name;
        sectionName = foundSection.name;
        classObj = cls;
        break;
      }
    }

    const newStudent: Student = {
      ...payload,
      id: generateId(),
      campusName: 'Main Campus',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      className,
      sectionName,
    };
    
    db.students.set(newStudent.id, newStudent);
    
    if (classObj) {
      classObj.studentCount += 1;
      const section = classObj.sections.find(s => s.id === payload.sectionId);
      if (section && section.studentCount !== undefined) {
        section.studentCount += 1;
      }
    }
    
    persist();
    return newStudent;
  },

  updateStudent: (id: string, payload: Partial<StudentCreatePayload>) => {
    const existing = db.students.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...payload, updatedAt: new Date().toISOString() };
    db.students.set(id, updated);
    persist();
    return updated;
  },

  deleteStudent: (id: string) => {
    const deleted = db.students.delete(id);
    persist();
    return deleted;
  },
  
  // --- QUESTIONS ---
  getQuestions: () => Array.from(db.questions.values()),
  
  getQuestionById: (id: string) => db.questions.get(id),
  
  createQuestion: (payload: CreateQuestionRequest) => {
    const newQuestion: Question = {
      ...payload,
      classLevel: (payload.classLevel as ClassLevel) || '11', 
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'mock-admin-user',
      tags: payload.tags || [],
    };
    db.questions.set(newQuestion.id, newQuestion);
    persist();
    return newQuestion;
  },

  updateQuestion: (id: string, payload: Partial<CreateQuestionRequest>) => {
    const existing = db.questions.get(id);
    if (!existing) return null;

    const updated: Question = {
      ...existing,
      ...payload,
      classLevel: payload.classLevel ? (payload.classLevel as ClassLevel) : existing.classLevel,
      updatedAt: new Date().toISOString(),
    };
    db.questions.set(id, updated);
    persist();
    return updated;
  },

  deleteQuestion: (id: string) => {
    const deleted = db.questions.delete(id);
    persist();
    return deleted;
  },

  // --- EXAMS ---
  getExams: () => Array.from(db.exams.values()),
  
  getExamById: (id: string) => db.exams.get(id),
  
  createExam: (payload: CreateExamRequest) => {
    const newExam: Exam = {
      id: generateId(),
      code: `EX-${Math.floor(Math.random() * 10000)}`,
      sections: [],
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
      ...payload, 
    };
    db.exams.set(newExam.id, newExam);
    persist();
    return newExam;
  },

  updateExam: (id: string, payload: Partial<Exam>) => {
    const existing = db.exams.get(id);
    if (!existing) return null;
    
    const updated: Exam = { 
      ...existing, 
      ...payload, 
      updatedAt: new Date().toISOString() 
    };
    db.exams.set(id, updated);
    persist();
    return updated;
  },

  deleteExam: (id: string) => {
    const deleted = db.exams.delete(id);
    persist();
    return deleted;
  },

  // ========== ROLES (This was missing!) ==========
  getRoles: (): Role[] => Array.from(db.roles.values()),
  
  getRoleById: (roleId: string): Role | undefined => {
    return db.roles.get(roleId);
  },
  
  createRole: (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>, currentUser: { id: string; name: string; role: string }): Role => {
    const role: Role = {
      ...roleData,
      id: generateId(),
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    db.roles.set(role.id, role);
    persist();
    
    createAuditLog(
      AuditAction.ROLE_CREATED,
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'Role',
      `Created role: ${role.name}`,
      role.id,
      'info'
    );
    
    return role;
  },
  
  updateRole: (roleId: string, updates: Partial<Role>, currentUser: { id: string; name: string; role: string }): Role | null => {
    const role = db.roles.get(roleId);
    if (!role) return null;
    
    if (role.isSystem && (updates.name || updates.isSystem !== undefined)) {
      throw new Error('Cannot modify system roles');
    }
    
    const before = { ...role };
    const updatedRole = {
      ...role,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    db.roles.set(roleId, updatedRole);
    persist();
    
    createAuditLog(
      AuditAction.ROLE_UPDATED,
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'Role',
      `Updated role: ${updatedRole.name}`,
      roleId,
      'info',
      { before, after: updatedRole }
    );
    
    return updatedRole;
  },
  
  deleteRole: (roleId: string, currentUser: { id: string; name: string; role: string }): boolean => {
    const role = db.roles.get(roleId);
    if (!role) return false;
    
    if (role.isSystem) {
      throw new Error('Cannot delete system roles');
    }
    
    db.roles.delete(roleId);
    persist();
    
    createAuditLog(
      AuditAction.ROLE_DELETED,
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'Role',
      `Deleted role: ${role.name}`,
      roleId,
      'warning'
    );
    
    return true;
  },
  
  updateRolePermissions: (roleId: string, permissions: Permission[], currentUser: { id: string; name: string; role: string }): boolean => {
    const role = db.roles.get(roleId);
    if (!role) return false;
    
    const before = { permissions: [...role.permissions] };
    
    role.permissions = permissions;
    role.updatedAt = new Date().toISOString();
    db.roles.set(roleId, role);
    persist();
    
    createAuditLog(
      AuditAction.PERMISSION_CHANGED,
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'Role',
      `Updated permissions for role: ${role.name}`,
      roleId,
      'info',
      { before, after: { permissions } }
    );
    
    return true;
  },

  // ========== ACADEMIC YEARS ==========
  getAcademicYears: (): AcademicYear[] => Array.from(db.academicYears.values()),
  
  getCurrentAcademicYear: (): AcademicYear | undefined => {
    return Array.from(db.academicYears.values()).find(y => y.isCurrent);
  },

  createAcademicYear: (year: AcademicYear, currentUser: { id: string; name: string; role: string }) => {
    db.academicYears.set(year.id, year);
    persist();
    createAuditLog(
      AuditAction.SETTINGS_CHANGED,
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'AcademicYear',
      `Created academic year: ${year.name}`,
      year.id,
      'info'
    );
    return year;
  },

  setActiveAcademicYear: (id: string, currentUser: { id: string; name: string; role: string }) => {
    for (const year of db.academicYears.values()) {
        const isTarget = year.id === id;
        year.isCurrent = isTarget;
        if (isTarget) year.status = 'Active';
        else if (year.status === 'Active') year.status = 'Archived';
    }
    db.systemConfig.academic.currentAcademicYearId = id;
    persist();
    createAuditLog(
      AuditAction.SETTINGS_CHANGED,
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'AcademicYear',
      `Set active academic year to: ${id}`,
      id,
      'info'
    );
  },

  deleteAcademicYear: (id: string, currentUser: { id: string; name: string; role: string }) => {
    const year = db.academicYears.get(id);
    if (!year) return false;
    if (year.isCurrent) throw new Error('Cannot delete current academic year');
    db.academicYears.delete(id);
    persist();
    createAuditLog(
      AuditAction.SETTINGS_CHANGED,
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'AcademicYear',
      `Deleted academic year: ${year.name}`,
      id,
      'warning'
    );
    return true;
  },

  // ========== SYSTEM CONFIG ==========
  getSystemConfig: (): SystemConfig => db.systemConfig,
  
  updateSystemConfig: (updates: Partial<SystemConfig>, currentUser: { id: string; name: string; role: string }): SystemConfig => {
    const before = { ...db.systemConfig };
    db.systemConfig = {
      ...db.systemConfig,
      ...updates,
      metadata: {
        ...db.systemConfig.metadata,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.id,
      },
    };
    persist();
    createAuditLog(
      AuditAction.SETTINGS_CHANGED,
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'SystemConfig',
      'Updated system configuration',
      undefined,
      'info',
      { before, after: db.systemConfig }
    );
    return db.systemConfig;
  },

  // ========== AUDIT LOGS ==========
  getAuditLogs: (filters?: { limit?: number }): AuditLog[] => {
    const logs = db.auditLogs || [];
    if (filters?.limit) return logs.slice(0, filters.limit);
    return logs;
  },
};