// The complete data shape from your backend
export interface Student {
  id: string;
  first_name: string;
  last_name?: string;
  admission_no: string;
  enrollments: {
    section: {
      name: string;
      class: {
        name: string;
      };
    };
  }[];
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

// This is the shape your UI components will use
export type StudentListItem = Student & {
  name: string; // A combination of first_name and last_name
  avatarUrl: string;
  className: string;
  sectionName: string;
};

// This function now maps all the rich data correctly
export function mapStudentToListItem(student: Student): StudentListItem {
  const currentEnrollment = student.enrollments?.[0];
  return {
    ...student,
    name: `${student.first_name} ${student.last_name || ''}`.trim(),
    className: currentEnrollment?.section?.class?.name ?? 'N/A',
    sectionName: currentEnrollment?.section?.name ?? 'N/A',
    avatarUrl: `https://i.pravatar.cc/48?u=${student.id}`,
  };
}
