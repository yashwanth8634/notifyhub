import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy loaded pages could go here, but we'll import them directly for now
// to simplify setup. We can code-split later if needed.
import './index.css';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { EventsPage } from './pages/EventsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { QueryStatusPage } from './pages/QueryStatusPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="contact" element={<ContactPage />} />
            
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="queries" element={<QueryStatusPage />} />
            </Route>
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
