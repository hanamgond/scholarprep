// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppLayout from "./layouts/AppLayout";
import { ConnectionTest } from "./components/ConnectionTest";

// Import all the new components for the Students module
import StudentsModulePage from './features/students/pages';
import Overview from './features/students/pages/Overview';
import AddStudentPage from './features/students/pages/AddStudent';
import BulkCreatePage from './features/students/pages/BulkCreate';
import BulkEditPage from './features/students/pages/BulkEdit';

// Other page imports
import DashboardPage from "./pages/Dashboard";
import ClassesPage from "./pages/Classes";
import SectionsPage from './pages/Sections';
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

// Public Route Component (redirect to dashboard if already authenticated)
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

          {/* New nested structure for the Students module */}
          <Route path="students" element={<StudentsModulePage />}>
            <Route index element={<Overview />} /> 
            <Route path="overview" element={<Overview />} />
            <Route path="add" element={<AddStudentPage />} />
            <Route path="bulk-create" element={<BulkCreatePage />} />
            <Route path="bulk-edit" element={<BulkEditPage />} />
          </Route>
          
          <Route path="classes" element={<ClassesPage />} />
          <Route path="sections/:id" element={<SectionsPage />} />
        </Route>

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      {/* Temporary: Show connection test at the top right corner */}
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <ConnectionTest />
      </div>
      <AppRoutes />
    </AuthProvider>
  );
}