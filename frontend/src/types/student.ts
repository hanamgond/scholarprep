// src/types/student.ts

// The main, complete Student object
export interface Student {
  // --- Fields from your NEW .NET Backend ---
  id: string;
  firstName: string;   // NEW field
  lastName: string;    // NEW field
  admissionNo: string; // Was 'admission_no'
  email: string;
  phone: string;       // Was 'contactNumber'
  dateOfBirth: string; // Was 'dob'
  campusId: string;    // NEW field
  campusName: string;  // NEW field
  createdAt: string;   // NEW field
  updatedAt: string;   // NEW field

  // --- Fields from your OLD Frontend (now optional) ---
  name?: string;
  rollNumber?: string;
  className?: string;
  section?: string;
  fatherName?: string;
  motherName?: string;
  contactNumber?: string;
  address?: string;
  gender?: string;
  dob?: string;
  admission_no?: string; // Kept this old one just in case

  // --- Simulated properties (now optional) ---
  track?: string;
  rank?: number;
  metrics?: {
    accuracyPct: number;
    accuracyDelta: number;
    qpm: number;
    qpmDelta: number;
    consistencyPct: number;
    consistencyDelta: number;
  };
}

// A smaller version of the Student for UI lists
// We will update this to use the new fields
export type StudentListItem = Pick<Student, 'id' | 'firstName' | 'lastName' | 'admissionNo' | 'rollNumber' | 'className' | 'section' | 'track' | 'rank' | 'metrics'> & {
  avatarUrl: string;
  sectionName?: string; 
};

// We will leave these for now
export type CreateStudentInput = Omit<Student, 'id' | 'track' | 'rank' | 'metrics'>;
export type UpdateStudentInput = Partial<CreateStudentInput>;


// Helper function to map the full Student object
// This function will BREAK because 'name' doesn't exist on the new object.
// We will fix this in the component itself.
/*
export function mapStudentToListItem(student: Student): StudentListItem {
  return {
    id: student.id,
    name: student.name, // This will fail
    // ...
  };
}
*/