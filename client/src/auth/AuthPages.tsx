import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Loader2, Bike } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5efe8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-[#D8C3A5]/40">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-[#2E7D32]/10 rounded-full mb-4">
            <Bike className="h-7 w-7 text-[#2E7D32]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#3d2e28] tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-[#8D6E63]">Please sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium border border-rose-100">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]/60 w-5 h-5" />
              <input
                type="email"
                required
                className="block w-full pl-10 pr-4 py-3 border border-[#D8C3A5] rounded-xl focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] bg-[#faf7f3] outline-none transition-all text-[#3d2e28] placeholder-[#b8a99a]"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]/60 w-5 h-5" />
              <input
                type="password"
                required
                className="block w-full pl-10 pr-4 py-3 border border-[#D8C3A5] rounded-xl focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] bg-[#faf7f3] outline-none transition-all text-[#3d2e28] placeholder-[#b8a99a]"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#2E7D32] hover:bg-[#256328] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32] disabled:opacity-50 transition-colors active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign in'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/register" className="text-sm font-medium text-[#8D6E63] hover:text-[#2E7D32] transition-colors">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ email, password, name });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5efe8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-[#D8C3A5]/40">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-[#8D6E63]/10 rounded-full mb-4">
            <UserIcon className="h-7 w-7 text-[#8D6E63]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#3d2e28] tracking-tight">Create account</h2>
          <p className="mt-2 text-sm text-[#8D6E63]">Join our bike sharing community</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium border border-rose-100">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]/60 w-5 h-5" />
              <input
                type="text"
                required
                className="block w-full pl-10 pr-4 py-3 border border-[#D8C3A5] rounded-xl focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] bg-[#faf7f3] outline-none transition-all text-[#3d2e28] placeholder-[#b8a99a]"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]/60 w-5 h-5" />
              <input
                type="email"
                required
                className="block w-full pl-10 pr-4 py-3 border border-[#D8C3A5] rounded-xl focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] bg-[#faf7f3] outline-none transition-all text-[#3d2e28] placeholder-[#b8a99a]"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]/60 w-5 h-5" />
              <input
                type="password"
                required
                className="block w-full pl-10 pr-4 py-3 border border-[#D8C3A5] rounded-xl focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] bg-[#faf7f3] outline-none transition-all text-[#3d2e28] placeholder-[#b8a99a]"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#2E7D32] hover:bg-[#256328] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32] disabled:opacity-50 transition-colors active:scale-95 mt-6"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm font-medium text-[#8D6E63] hover:text-[#2E7D32] transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};