import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import BackgroundLogo from './components/BackgroundLogo';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import Contact from './pages/Contact';
import Conditions from './pages/Conditions';
import About from './pages/About';
import Profile from './pages/Profile';
import PublicCertificates from './pages/PublicCertificates';
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
            <BackgroundLogo />
            <div className="relative z-10 flex flex-col min-h-screen">
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/course/:id" element={<CourseDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/player/:id" element={<CoursePlayer />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/conditions" element={<Conditions />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/certificates" element={<PublicCertificates />} />
                  <Route path="/admin" element={<AdminOverview />} />
                  <Route path="/admin/courses" element={<AdminCourses />} />
                  <Route path="/admin/submissions" element={<AdminSubmissions />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/payments" element={<AdminPayments />} />
                  <Route path="/admin/messages" element={<AdminMessages />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </SettingsProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};
export default App;