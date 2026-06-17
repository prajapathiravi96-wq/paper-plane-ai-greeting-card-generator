import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Context Imports
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Page Imports
import Home from './pages/Home';
import Generator from './pages/Generator';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

const LayoutWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AdminRoute>
        <div className="flex flex-col min-h-screen bg-[#F8F4FF] dark:bg-[#0B051D] text-[#0F172A] dark:text-[#F8F4FF] transition-colors duration-300">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 bg-[#F8F4FF] dark:bg-[#0B051D] p-6 md:p-8 overflow-y-auto">
              <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Routes>
            </main>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B051D] text-[#0F172A] dark:text-[#F8F4FF] transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <LayoutWrapper />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
