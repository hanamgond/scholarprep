/**
 * SCHOLAR PREP - DATA CONTRACT
 * Matches .NET Backend & PostgreSQL JSONB
 */

export type Subject = 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type QuestionStatus = 'Draft' | 'Review' | 'Published' | 'Archived';
export type ClassLevel = '11' | '12' | 'Dropper';

// Analytics Attributes
export type BloomsLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
export type QuestionNature = 'Conceptual' | 'Calculative' | 'Memory-Based' | 'Tricky';

export type QuestionType = 'SCQ' | 'MCQ' | 'INT' | 'AR' | 'MM';

// --- 1. Option Data ---
export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
  imageUrl?: string;
}

export interface OptionsData {
  type: 'options';
  options: Option[];
}

// --- 2. Numerical Data ---
export interface ExactNumericalData {
  type: 'exact';
  value: number;
}

export interface RangeNumericalData {
  type: 'range';
  min: number;
  max: number;
}

// --- 3. Assertion Reason Data ---
export interface AROption {
  code: string;
  text: string;
}

export interface AssertionReasonData {
  type: 'assertion-reason';
  assertion: string;
  reason: string;
  options: AROption[];
  correctCode: string; 
}

// --- 4. Matrix Match Data ---
export interface MatrixItem {
  id: string;
  text: string;
}

export interface MatrixMatchData {
  type: 'matrix';
  columnA: MatrixItem[];
  columnB: MatrixItem[];
  correctMatches: Record<string, string[]>; 
}

export type QuestionContent = 
  | OptionsData 
  | ExactNumericalData 
  | RangeNumericalData 
  | AssertionReasonData 
  | MatrixMatchData;

// --- Main Entity ---

export interface Question {
  id: string;
  tenantId: string;
  
  text: string;
  solution?: string;
  imageUrl?: string; 
  
  type: QuestionType;
  difficulty: Difficulty;
  status: QuestionStatus;

  subject: Subject;
  classLevel: ClassLevel;
  chapterId: string; // UUID
  topicId?: string;  // UUID
  subtopic?: string; // Optional text/ID
  
  // Analytics
  bloomsLevel?: BloomsLevel;
  nature?: QuestionNature;
  idealTime?: number;
  source?: string;

  tags: string[];
  data: QuestionContent;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateQuestionRequest {
  text: string;
  solution?: string;
  imageUrl?: string;
  type: QuestionType;
  subject: Subject;
  chapterId: string;
  // Optional Hierarchy
  topicId?: string;
  subtopic?: string;

  difficulty: Difficulty;
  data: QuestionContent;
  tags?: string[];
  status: QuestionStatus;
  classLevel: string;
  tenantId: string;
  
  bloomsLevel?: BloomsLevel;
  nature?: QuestionNature;
  idealTime?: number;
  source?: string;
}