// Import your http client from its correct location
import { apiClient } from '../http/client'; 
// Import the flexible Student type
import { Student } from '../../types/student'; 

// This function will call: GET http://localhost:5168/api/Students
export const getStudents = async (): Promise<Student[]> => {
  try {
    const { data } = await apiClient.get<Student[]>('/api/Students');
    return data;
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
};

// Add other functions as you build them
// export const getStudentById = async (id: string) => { ... }
// export const createStudent = async (studentData: CreateStudentInput) => { ... }