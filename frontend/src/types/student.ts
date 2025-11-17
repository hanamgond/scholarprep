// The main, complete Student object
export interface Student {
  // --- Fields from your .NET Backend (for forms & detail pages) ---
  id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  campusId: string;
  campusName: string;
  createdAt: string;
  updatedAt: string;

  // --- Old Frontend Fields (optional) ---
  name?: string; // This can be built from firstName + lastName
  rollNumber?: string;
  className?: string; // Replaced by new 'className' below
  section?: string;   // Replaced by new 'sectionName' below
  fatherName?: string;
  motherName?: string;
  contactNumber?: string;
  address?: string;
  gender?: string;
  dob?: string;
  admission_no?: string;

  // --- NEW Fields for Performance Dashboard (optional) ---
  // We make these optional so your "Add Student" form doesn't need them
  photoUrl?: string;
  examPreparation?: string;
  rank?: number;
  overallProgress?: number;
  accuracyPercent?: number;
  accuracyTrend?: 'up' | 'down' | 'neutral';
  questionsPerMinute?: number;
  questionsPerMinuteTrend?: 'up' | 'down' | 'neutral';
  consistencyPercent?: number;
  consistencyTrend?: 'up' | 'down' | 'neutral';

  // --- Old 'metrics' and 'track' (optional) ---
  track?: string;
  metrics?: {
    accuracyPct: number;
    accuracyDelta: number;
    qpm: number;
    qpmDelta: number;
    consistencyPct: number;
    consistencyDelta: number;
  };
}

// --- NEW Paginated Response Type ---
// This uses our main Student interface
export interface PaginatedStudentsResponse {
  items: Student[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
}

// --- YOUR EXISTING TYPES ---
// We keep these for your forms and other pages
export type CreateStudentInput = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStudentInput = Partial<CreateStudentInput>;