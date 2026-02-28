import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LogOut, LayoutDashboard, User, Bike as BikeIcon, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      console.error('Logout failed');
    }
  };

  return (
    <nav className="bg-white border-b border-[#D8C3A5]/50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo + Menu */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 bg-[#2E7D32] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <BikeIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-black text-[#3d2e28] tracking-tight">
                Bike<span className="text-[#2E7D32]">Central</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-semibold text-[#8D6E63] hover:text-[#3d2e28] hover:bg-[#f5efe8] rounded-lg transition-all"
              >
                Showroom
              </Link>
            </div>
          </div>

          {/* Right Side — Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#8D6E63] hover:text-[#2E7D32] hover:bg-[#f0f5f0] rounded-lg transition-all"
                >
                  <LayoutDashboard size={17} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#8D6E63] hover:text-[#2E7D32] hover:bg-[#f0f5f0] rounded-lg transition-all"
                >
                  <User size={17} />
                  <span>Profile</span>
                </Link>

                <div className="flex items-center gap-3 pl-3 ml-1 border-l border-[#D8C3A5]/60">
                  <div className="w-8 h-8 rounded-xl bg-[#8D6E63] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-[#8D6E63]/60 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
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
                  className="px-4 py-2 text-sm font-semibold text-[#8D6E63] hover:text-[#3d2e28] hover:bg-[#f5efe8] rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 bg-[#2E7D32] hover:bg-[#256328] text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#8D6E63] hover:bg-[#f5efe8] transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#D8C3A5]/40 px-4 py-3 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[#8D6E63] hover:text-[#3d2e28] hover:bg-[#f5efe8] rounded-lg transition-all"
          >
            Showroom
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[#8D6E63] hover:text-[#2E7D32] hover:bg-[#f0f5f0] rounded-lg transition-all"
              >
                <LayoutDashboard size={17} /> Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[#8D6E63] hover:text-[#2E7D32] hover:bg-[#f0f5f0] rounded-lg transition-all"
              >
                <User size={17} /> Profile
              </Link>
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[#8D6E63] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              >
                <LogOut size={17} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-2.5 text-sm font-semibold text-[#8D6E63] hover:bg-[#f5efe8] rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-3 py-2.5 bg-[#2E7D32] text-white text-sm font-bold rounded-xl"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;