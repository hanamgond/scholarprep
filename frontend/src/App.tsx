import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // <--- NEW: Required for popups
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppLayout from "./layouts/AppLayout";
import { ConnectionTest } from "./components/ConnectionTest";

// --- STUDENTS MODULE ---
import StudentsModulePage from './features/students/pages';
import Overview from './features/students/pages/Overview';
import AddStudentPage from './features/students/pages/AddStudent';
import BulkCreatePage from './features/students/pages/BulkCreate';
import BulkEditPage from './features/students/pages/BulkEdit';
import StudentDetails from './features/students/pages/StudentDetails';

// --- CLASSES MODULE ---
import ClassesPage from "./features/classes/pages";
import SectionDetail from "./features/classes/pages/SectionDetail"; 

// --- QUESTIONS MODULE ---
import CreateQuestion from './features/questions/pages/CreateQuestion';
import QuestionBank from './features/questions/pages/QuestionBank';

// --- EXAMS MODULE ---
import ExamList from './features/exams/pages/ExamList';
import CreateExam from './features/exams/pages/CreateExam';
import ExamBuilder from './features/exams/pages/ExamBuilder';

// --- STAFF MODULE (HR) ---
import StaffLayout from './features/staff/layouts/StaffLayout';
import StaffDirectory from './features/staff/pages/StaffDirectory';
import AddStaff from './features/staff/pages/AddStaff';
import StaffProfile from './features/staff/pages/StaffProfile';
import StaffAttendance from './features/staff/pages/StaffAttendance'; 
import LeaveManagement from './features/staff/pages/LeaveManagement';

// --- DEPARTMENTS MODULE ---
import DepartmentList from './features/departments/pages/DepartmentList';
import DepartmentDetail from './features/departments/pages/DepartmentDetail';

// --- STUDENT ATTENDANCE MODULE (ACADEMICS) ---
import AttendanceLayout from './features/attendance/layouts/AttendanceLayout';
import AttendanceDashboard from './features/attendance/pages/AttendanceDashboard';
import MarkAttendance from './features/attendance/pages/MarkAttendance';

// --- SETTINGS MODULE (NEW) ---
import { SettingsLayout } from './features/settings/layouts/SettingsLayout';
import AccessControlSettings from './features/settings/pages/AccessControlSettings';

// --- GENERAL PAGES ---
import DashboardPage from "./pages/Dashboard";
import LoginPage from './pages/Login';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route - Login */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Students Module */}
          <Route path="students" element={<StudentsModulePage />}>
            <Route index element={<Overview />} /> 
            <Route path="overview" element={<Overview />} />
            <Route path="add" element={<AddStudentPage />} />
            <Route path="bulk-create" element={<BulkCreatePage />} />
            <Route path="bulk-edit" element={<BulkEditPage />} />
          </Route>
          
          {/* Student Details */}
          <Route path="students/:id" element={<StudentDetails />} />
          
          {/* Questions Module */}
          <Route path="questions" element={<QuestionBank />} />
          <Route path="questions/create" element={<CreateQuestion />} />

          {/* Classes routes */}
          <Route path="classes" element={<ClassesPage />} />
          <Route path="sections/:sectionId" element={<SectionDetail />} />

          {/* Exam Routes */}
          <Route path="exams" element={<ExamList />} />
          <Route path="exams/create" element={<CreateExam />} />
          <Route path="exams/:id/build" element={<ExamBuilder />} />

          {/* STUDENT ATTENDANCE MODULE */}
          <Route path="attendance" element={<AttendanceLayout />}>
            <Route index element={<AttendanceDashboard />} />
            <Route path=":classId" element={<MarkAttendance />} />
          </Route>

          {/* STAFF MODULE */}
          <Route path="staff" element={<StaffLayout />}>
            <Route index element={<StaffDirectory />} />
            <Route path="add" element={<AddStaff />} />
            <Route path="attendance" element={<StaffAttendance />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path=":id" element={<StaffProfile />} />
          </Route>

          {/* DEPARTMENTS MODULE */}
          <Route path="departments">
            <Route index element={<DepartmentList />} />
            <Route path="add" element={<div>Add Department Form (Placeholder)</div>} />
            <Route path=":id" element={<DepartmentDetail />} />
          </Route>

          {/* --- SETTINGS MODULE (NEW) --- */}
          <Route path="settings" element={<SettingsLayout />}>
            {/* Redirect /settings to /settings/general by default */}
            <Route index element={<Navigate to="general" replace />} />
            
            {/* 1. General Settings (Placeholder) */}
            <Route path="general" element={<div className="p-10 text-gray-500">General Settings Coming Soon...</div>} />
            
            {/* 2. Access Control (Connected) */}
            <Route path="access-control" element={<AccessControlSettings />} />
            
            {/* 3. Academic (Placeholder) */}
            <Route path="academic" element={<div className="p-10 text-gray-500">Academic Settings Coming Soon...</div>} />
            
            {/* 4. Data (Placeholder) */}
            <Route path="data" element={<div className="p-10 text-gray-500">Data Management Coming Soon...</div>} />
          </Route>
        
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      {/* REQUIRED: Toaster for Notifications */}
      <Toaster position="top-right" />
      
      {/* Temporary: Show connection test */}
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <ConnectionTest />
      </div>
      <AppRoutes />
    </AuthProvider>
  );
}