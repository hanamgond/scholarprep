import { http, HttpResponse } from 'msw'

// This is your fake database.
// I'm using the data from your target screenshot.
const mockStudents = [
  {
    id: 'STU2025001',
    name: 'Ramesh Kumar',
    photoUrl: 'https://i.pravatar.cc/150?img=12',
    className: 'Class 11 (PUC I)',
    sectionName: 'Section A',
    examPreparation: 'NEET Preparation',
    rank: 5,
    accuracyPercent: 82,
    accuracyTrend: 'up',
    questionsPerMinute: 1.2,
    questionsPerMinuteTrend: 'down',
    consistencyPercent: 74,
    consistencyTrend: 'up',
    overallProgress: 82,
  },
  {
    id: 'STU2025002',
    name: 'Priya Sharma',
    photoUrl: 'https://i.pravatar.cc/150?img=5',
    className: 'Class 12 (PUC II)',
    sectionName: 'Section B',
    examPreparation: 'JEE Preparation',
    rank: 12,
    accuracyPercent: 76,
    accuracyTrend: 'down',
    questionsPerMinute: 0.9,
    questionsPerMinuteTrend: 'neutral',
    consistencyPercent: 82,
    consistencyTrend: 'up',
    overallProgress: 76,
  },
  {
    id: 'STU2025003',
    name: 'Arjun Patel',
    photoUrl: 'https://i.pravatar.cc/150?img=8',
    className: 'Class 10',
    sectionName: 'Section C',
    examPreparation: 'Board Preparation',
    rank: 8,
    accuracyPercent: 91,
    accuracyTrend: 'up',
    questionsPerMinute: 1.1,
    questionsPerMinuteTrend: 'up',
    consistencyPercent: 88,
    consistencyTrend: 'up',
    overallProgress: 91,
  },
  // ... add more mock students as needed
]

// Define your API endpoints
export const handlers = [
  // --- Mocks for Student List ---
  http.get('/api/students', ({ request }) => {
    // This shows how to read query params, like for search and pagination
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const page = Number(url.searchParams.get('page') || '1')

    console.log('[MSW] Fetching students:', { search, page })

    // You can add logic here to filter 'mockStudents' by the search param

    // This mocks the paginated response your .NET backend will make
    return HttpResponse.json({
      items: mockStudents,
      pageNumber: page,
      totalPages: 19,
      totalCount: 187,
    })
  }),

  // --- Mocks for your Filter Dropdowns ---
  http.get('/api/classes', () => {
    return HttpResponse.json([
      { id: '1', name: 'Class 10' },
      { id: '2', name: 'Class 11 (PUC I)' },
      { id: '3', name: 'Class 12 (PUC II)' },
    ])
  }),

  http.get('/api/sections', () => {
    return HttpResponse.json([
      { id: '1', classId: '1', name: 'Section A (10)' },
      { id: '2', classId: '2', name: 'Section A (11)' },
      { id: '3', classId: '2', name: 'Section B (11)' },
    ])
  }),
  
  // Mock your health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'Healthy (from Mock)' })
  })

  // Add your other API handlers here (e.g., POST /api/students)
]