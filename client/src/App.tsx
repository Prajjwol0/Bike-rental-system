import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { LoginPage, RegisterPage } from './auth/AuthPages';
import Profile from "./pages/Profile";
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-950 text-orange-500 font-black italic tracking-widest uppercase">Initializing Systems...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        {/* Public Route - Anyone can see bikes */}
        <Route path="/" element={<Home />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes - Only for logged in users */}
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

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {/* Footer Showroom Style */}
      <footer className="bg-gray-950 py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
                 <div className="h-4 w-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-white font-black italic uppercase tracking-tighter">
                BIKE<span className="text-orange-600">CENTRAL</span>
              </span>
            </div>
            
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
              © 2024 High-Performance Showroom Network. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              {['Instagram', 'Twitter', 'Facebook'].map(social => (
                <span key={social} className="text-gray-400 hover:text-white cursor-pointer transition-colors text-xs font-black uppercase tracking-widest">{social}</span>
              ))}
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
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
