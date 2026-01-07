import { Navigate, type RouteObject } from 'react-router-dom'; // FIXED: Added 'type' keyword
import SettingsLayout from './layouts/SettingsLayout';

import { GeneralSettings } from './pages/GeneralSettings';
import AccessControlSettings from './pages/AccessControlSettings';
import { AcademicSettings } from './pages/AcademicSettings';
import { DataManagement } from './pages/DataManagement';

export const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: <SettingsLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="general" replace />,
      },
      {
        path: 'general',
        element: <GeneralSettings />,
      },
      {
        path: 'access-control',
        element: <AccessControlSettings />,
      },
      {
        path: 'academic',
        element: <AcademicSettings />,
      },
      {
        path: 'data',
        element: <DataManagement />,
      },
    ],
  },
];