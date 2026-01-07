/**
 * SCHOLAR PREP - EXAM MODULE CONTRACT
 */
import type { QuestionType, Subject } from '../../questions/types/question';

export type ExamStatus = 'Draft' | 'Published' | 'Scheduled' | 'Completed' | 'Archived';
export type ExamMode = 'Online' | 'Offline' | 'Hybrid';
export type ExamPattern = 'JEE_MAINS' | 'JEE_ADVANCED' | 'NEET' | 'BOARD' | 'CUSTOM';
export type ExamCategory = 'Practice' | 'Mock' | 'Term' | 'Final';

// 1. Marking Scheme
export interface MarkingScheme {
  correct: number;
  incorrect: number;
  unattempted: number;
}

// 2. Exam Section
export interface ExamSection {
  id: string;
  name: string;
  subject: Subject;
  questionType: QuestionType;
  totalQuestions: number;
  toBeAttempted: number;
  markingScheme: MarkingScheme;
  questionIds: string[]; 
}

// 3. Main Entity
export interface Exam {
  id: string;
  title: string;
  code: string;
  description?: string;
  
  pattern: ExamPattern;
  mode: ExamMode;
  category: ExamCategory;
  
  durationMinutes: number;
  totalMarks: number;
  
  startDate?: string;
  endDate?: string;
  
  classIds: string[];
  subjects: Subject[];
  
  sections: ExamSection[];
  status: ExamStatus;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 4. API Payloads
export interface CreateExamRequest {
  title: string;
  description?: string;
  pattern: ExamPattern;
  mode: ExamMode;
  category: ExamCategory;
  durationMinutes: number;
  totalMarks: number;
  startDate?: string;
  endDate?: string;
  classIds: string[];
  subjects: Subject[];
  // 👇 Added status field
  status?: ExamStatus;
}

export interface UpdateExamStructureRequest {
  sections: ExamSection[];
}