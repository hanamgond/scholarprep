// Define the shape of data we expect from your DB
export interface Section {
  id: string;
  name: string;
  studentCount?: number;
}

export interface Class {
  id: string;
  name: string;
  sections: Section[];
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  className: string;
  sectionName: string;
}

// The specific shape for the Attendance Register
export interface AttendanceStudent extends Student {
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  remarks?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
}