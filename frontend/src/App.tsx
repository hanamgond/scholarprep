import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

// Import all the new components for the Students module
import StudentsModulePage from './pages/Students';
import Overview from './pages/Students/Overview';
import AddStudentPage from './pages/Students/AddStudent';
import BulkCreatePage from './pages/Students/BulkCreate';
import BulkEditPage from './pages/Students/BulkEdit';

// Other page imports
import DashboardPage from "./pages/Dashboard";
import ClassesPage from "./pages/Classes";
import SectionsPage from './pages/Sections';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
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
      </Routes>
    </BrowserRouter>
  );
}
