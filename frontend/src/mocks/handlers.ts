import { http, HttpResponse } from 'msw';
import { mockDb } from './db';
import type { StudentCreatePayload } from '../features/students/types/student';
import type { CreateQuestionRequest } from '../features/questions/types/question';
import type { CreateExamRequest, Exam } from '../features/exams/types/exam';

// Using wildcard '*' allows MSW to match /api/... regardless of the host (localhost:3000, 5173, etc.)
const BASE_PATH = '*/api';

export const handlers = [
  // --- Auth & Health ---
  http.get(`${BASE_PATH}/health`, () => {
    return HttpResponse.json({ Status: 'Healthy (Mocked)' });
  }),

  http.post(`${BASE_PATH}/auth/login`, () => {
    const validMockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwidXNlcklkIjoiZGVmYXVsdC11c2VyIiwidGVuYW50SWQiOiJkZWZhdWx0LXRlbmFudCIsImV4cCI6OTk5OTk5OTk5OX0.mocksignature";
    return HttpResponse.json({ accessToken: validMockToken });
  }),

  // --- CLASSES ---
  http.get(`${BASE_PATH}/classes`, () => {
    return HttpResponse.json(mockDb.getClasses());
  }),

  http.post(`${BASE_PATH}/classes`, async ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { name } = (await request.json()) as { name: string };
    return HttpResponse.json(mockDb.createClass(name), { status: 201 });
  }),

  http.patch(`${BASE_PATH}/classes/:id`, async ({ params, request }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { name } = (await request.json()) as { name: string };
    const updated = mockDb.updateClass(params.id as string, name);
    return updated ? HttpResponse.json(updated) : new HttpResponse(null, { status: 404 });
  }),

  http.delete(`${BASE_PATH}/classes/:id`, ({ params }) => {
    mockDb.deleteClass(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- SECTIONS ---
  http.get(`${BASE_PATH}/sections/:id`, ({ params }) => {
    const sectionId = params.id as string;
    const result = mockDb.getSectionById(sectionId);
    if (!result) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({
        id: result.section.id,
        name: result.section.name,
        class: { id: result.class.id, name: result.class.name }
    });
  }),

  http.post(`${BASE_PATH}/sections`, async ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { name, class_id } = (await request.json()) as { name: string; class_id: string };
    const newSection = mockDb.createSection(class_id, name);
    if (!newSection) return HttpResponse.json({ message: 'Class not found' }, { status: 404 });
    return HttpResponse.json(newSection, { status: 201 });
  }),

  http.patch(`${BASE_PATH}/sections/:id`, async ({ params, request }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { name } = (await request.json()) as { name: string };
    const updated = mockDb.updateSection(params.id as string, name);
    return updated ? HttpResponse.json(updated) : new HttpResponse(null, { status: 404 });
  }),

  http.delete(`${BASE_PATH}/sections/:id`, ({ params }) => {
    const deleted = mockDb.deleteSection(params.id as string);
    return deleted ? new HttpResponse(null, { status: 204 }) : new HttpResponse(null, { status: 404 });
  }),

  http.get(`${BASE_PATH}/sections/:id/students`, ({ params }) => {
    const students = mockDb.getStudentsBySection(params.id as string);
    return HttpResponse.json(students);
  }),

  // --- STUDENTS ---
  http.get(`${BASE_PATH}/students`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('pageNumber') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const all = mockDb.getStudents();
    const items = all.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({
      items,
      pageNumber: page,
      totalPages: Math.ceil(all.length / pageSize),
      totalCount: all.length,
    });
  }),

  http.get(`${BASE_PATH}/students/:id`, ({ params }) => {
    const student = mockDb.getStudentById(params.id as string);
    if (!student) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(student);
  }),

  http.post(`${BASE_PATH}/students`, async ({ request }) => {
    const payload = (await request.json()) as StudentCreatePayload;
    const newStudent = mockDb.createStudent(payload);
    return HttpResponse.json(newStudent, { status: 201 });
  }),

  http.delete(`${BASE_PATH}/students/:id`, ({ params }) => {
    mockDb.deleteStudent(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- QUESTIONS ---
  http.get(`${BASE_PATH}/questions`, () => {
    return HttpResponse.json(mockDb.getQuestions()); 
  }),

  http.get(`${BASE_PATH}/questions/:id`, ({ params }) => {
    const question = mockDb.getQuestionById(params.id as string);
    if (!question) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(question);
  }),

  http.post(`${BASE_PATH}/questions`, async ({ request }) => {
    try {
      const payload = (await request.json()) as CreateQuestionRequest;
      console.log("Creating Question via Mock DB:", payload);
      const newQuestion = mockDb.createQuestion(payload);
      return HttpResponse.json(newQuestion, { status: 201 });
    } catch (error) {
      console.error("MSW Create Question Error:", error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.put(`${BASE_PATH}/questions/:id`, async ({ params, request }) => {
    try {
      const payload = (await request.json()) as Partial<CreateQuestionRequest>;
      console.log("Updating Question:", params.id, payload);
      const updated = mockDb.updateQuestion(params.id as string, payload);
      if (!updated) return new HttpResponse(null, { status: 404 });
      return HttpResponse.json(updated);
    } catch (error) {
      console.error("MSW Update Question Error:", error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.delete(`${BASE_PATH}/questions/:id`, ({ params }) => {
    mockDb.deleteQuestion(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- EXAMS (NEW) ---
  http.get(`${BASE_PATH}/exams`, () => {
    return HttpResponse.json(mockDb.getExams());
  }),

  http.get(`${BASE_PATH}/exams/:id`, ({ params }) => {
    const exam = mockDb.getExamById(params.id as string);
    if (!exam) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(exam);
  }),

  http.post(`${BASE_PATH}/exams`, async ({ request }) => {
    try {
      const payload = (await request.json()) as CreateExamRequest;
      const newExam = mockDb.createExam(payload);
      return HttpResponse.json(newExam, { status: 201 });
    } catch (e) {
      console.error(e);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.put(`${BASE_PATH}/exams/:id`, async ({ params, request }) => {
    try {
      const payload = (await request.json()) as Partial<Exam>;
      const updated = mockDb.updateExam(params.id as string, payload);
      if (!updated) return new HttpResponse(null, { status: 404 });
      return HttpResponse.json(updated);
    } catch (e) {
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.delete(`${BASE_PATH}/exams/:id`, ({ params }) => {
    mockDb.deleteExam(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),
];