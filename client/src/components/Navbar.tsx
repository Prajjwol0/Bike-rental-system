import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LogOut, LayoutDashboard, User, Bike as BikeIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      console.error("Logout failed");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo + Menu */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-200">
                <BikeIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-black text-gray-900 tracking-tight">
                Bike<span className="text-indigo-600">Central</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                Showroom
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <LayoutDashboard size={17} />
                  <span className="hidden sm:block">Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <User size={17} />
                  <span className="hidden sm:block">Profile</span>
                </Link>

                <div className="flex items-center gap-3 pl-3 ml-1 border-l border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-100">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut size={17} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;