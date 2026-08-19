import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import CourseDetails from './pages/CourseDetails';
import Contact from './pages/Contact';
import Conditions from './pages/Conditions';
import Profile from './pages/Profile';
import PublicCertificates from './pages/PublicCertificates';
import PlacementTest from './pages/PlacementTest';
import AdminOverview from './pages/admin/AdminOverview';
import AdminCourses from './pages/admin/AdminCourses';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SettingsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/player/:id" element={<CoursePlayer />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/conditions" element={<Conditions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/certificates" element={<PublicCertificates />} />
              <Route path="/placement-test" element={<PlacementTest />} />
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/submissions" element={<AdminSubmissions />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Routes>
          </BrowserRouter>
        </SettingsProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};
export default App;