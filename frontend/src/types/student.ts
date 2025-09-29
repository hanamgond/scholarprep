// src/types/student.ts

// The main, complete Student object from the database
export interface Student {
  id: string;
  name: string;
  admission_no: string; // Added this property
  rollNumber: string;
  className: string;
  section: string;
  dob: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  email: string;
  address: string;
  gender: string;
  // --- Simulated properties from the backend service ---
  track: string;
  rank: number;
  metrics: {
    accuracyPct: number;
    accuracyDelta: number;
    qpm: number;
    qpmDelta: number;
    consistencyPct: number;
    consistencyDelta: number;
  };
}

// A smaller version of the Student for UI lists
export type StudentListItem = Pick<Student, 'id' | 'name' | 'admission_no' | 'rollNumber' | 'className' | 'section' | 'track' | 'rank' | 'metrics'> & {
  avatarUrl: string;
  sectionName: string; // Added this property
};

// Type for creating a new student (all fields from the form)
export type CreateStudentInput = Omit<Student, 'id' | 'track' | 'rank' | 'metrics'>;

// Type for updating an existing student (can have a subset of fields)
export type UpdateStudentInput = Partial<CreateStudentInput>;


// Helper function to map the full Student object to the list item version
export function mapStudentToListItem(student: Student): StudentListItem {
  return {
    id: student.id,
    name: student.name,
    admission_no: student.admission_no,
    rollNumber: student.rollNumber,
    className: student.className,
    section: student.section,
    sectionName: student.section, // Added mapping for sectionName
    track: student.track,
    rank: student.rank,           // Added mapping for rank
    metrics: student.metrics,
    avatarUrl: `https://i.pravatar.cc/48?u=${student.id}`,
  };
}
