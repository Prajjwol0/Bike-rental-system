import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AlertProvider } from './utils/useAlert';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { LoginPage, RegisterPage } from './auth/AuthPages';
import Profile from './pages/Profile';
import { Bike as BikeIcon } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#2a1f1a] text-[#D8C3A5] font-black italic tracking-widest uppercase">
      Initializing Systems...
    </div>
  );
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-[#2a1f1a] py-12 border-t border-[#3d2e28]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-[#2E7D32] rounded-lg flex items-center justify-center">
                <BikeIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-black italic uppercase tracking-tighter">
                BIKE<span className="text-[#D8C3A5]">CENTRAL</span>
              </span>
            </div>

            <p className="text-[#6b5a52] text-xs font-bold uppercase tracking-widest text-center">
              © 2024 High-Performance Showroom Network. All rights reserved.
            </p>

<div className="flex space-x-6">
  <a
    href="https://www.instagram.com/przl30/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#6b5a52] hover:text-[#D8C3A5] cursor-pointer transition-colors text-xs font-black uppercase tracking-widest"
  >
    Instagram
  </a>
  <a
    href="https://www.facebook.com/przl07"
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#6b5a52] hover:text-[#D8C3A5] cursor-pointer transition-colors text-xs font-black uppercase tracking-widest"
  >
    Facebook
  </a>
  <a
    href="https://www.linkedin.com/in/prajjwol-pyakurel/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#6b5a52] hover:text-[#D8C3A5] cursor-pointer transition-colors text-xs font-black uppercase tracking-widest"
  >
    LinkedIn
  </a>
</div>

          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <AppRoutes />
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
