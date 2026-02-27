import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import axios from '../api/axios';
import {
  Bike,
  RentalRequest,
  RequestStatus,
  BikeStatus,
} from '../types';
import {
  Plus,
  Activity,
  Database,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Bike as BikeIcon,
  User as UserIcon,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const [myBikes, setMyBikes] = useState<Bike[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');

  const [newBike, setNewBike] = useState({ brand: '', lot: '', bikeNum: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bikesRes, requestsRes] = await Promise.all([
        axios.get('/bikes/myBike'),
        axios.get('/requests/my-bikes'),
      ]);
      setMyBikes(bikesRes.data || []);
      setIncomingRequests(requestsRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLoading) return;
    setSubmitLoading(true);
    try {
      await axios.post('/bikes/register', { ...newBike, lot: Number(newBike.lot) });
      setNewBike({ brand: '', lot: '', bikeNum: '' });
      await fetchDashboardData();
      alert('New machine added successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Bike registration failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRequest = async (requestId: string, status: RequestStatus) => {
    try {
      await axios.patch(`/requests/${requestId}/decide`, { status });
      await fetchDashboardData();
    } catch {
      alert('Request update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 shadow-sm hidden md:flex flex-col">

        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200 flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">ID: {user?.id?.slice(-6)}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold px-3 mb-3">Menu</p>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
              activeTab === 'inventory'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeTab === 'inventory' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
              <Database size={16} />
            </div>
            Inventory
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
              activeTab === 'requests'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeTab === 'requests' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
              <Activity size={16} />
            </div>
            Requests
            {incomingRequests.filter(r => r.status === RequestStatus.PENDING).length > 0 && (
              <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {incomingRequests.filter(r => r.status === RequestStatus.PENDING).length}
              </span>
            )}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-semibold"
          >
            <div className="p-1.5 rounded-lg bg-gray-100">
              <LogOut size={16} />
            </div>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {activeTab === 'inventory' ? 'My Fleet' : 'Incoming Requests'}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {activeTab === 'inventory' ? 'Manage your registered bikes' : 'Review and respond to rental requests'}
            </p>
          </div>
          <div className="hidden sm:block p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
            {activeTab === 'inventory'
              ? <BikeIcon size={22} className="text-indigo-500" />
              : <Activity size={22} className="text-indigo-500" />
            }
          </div>
        </div>

        <div className="p-8">

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Register Form */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <Plus size={16} className="text-indigo-600" />
                  </div>
                  <h2 className="font-bold text-gray-900">Register New Bike</h2>
                </div>
                <form onSubmit={handleCreateBike} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Yamaha, Honda"
                      value={newBike.brand}
                      onChange={e => setNewBike(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium text-gray-900 focus:border-indigo-300 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Plate Number</label>
                    <input
                      type="text"
                      placeholder="e.g., BA 1 CHA 1234"
                      value={newBike.bikeNum}
                      onChange={e => setNewBike(prev => ({ ...prev, bikeNum: e.target.value }))}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium text-gray-900 focus:border-indigo-300 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lot Number</label>
                    <input
                      type="number"
                      placeholder="e.g., 42"
                      value={newBike.lot}
                      onChange={e => setNewBike(prev => ({ ...prev, lot: e.target.value }))}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium text-gray-900 focus:border-indigo-300 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 active:scale-95"
                  >
                    {submitLoading ? 'Registering...' : 'Register Bike'}
                  </button>
                </form>
              </div>

              {/* Bike List */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Registered Fleet</h2>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">{myBikes.length}</span>
                </div>

                {myBikes.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BikeIcon size={28} className="text-gray-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">No bikes registered yet</h3>
                    <p className="text-gray-400 text-sm">Add your first bike using the form</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {myBikes.map(bike => (
                      <div key={bike.bikeNum} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center">
                            <BikeIcon size={22} className="text-indigo-500" />
                          </div>
                          <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${
                            bike.status === BikeStatus.AVAILABLE
                              ? 'bg-emerald-50 text-emerald-700'
                              : bike.status === BikeStatus.RENTED
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {bike.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{bike.brand}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{bike.bikeNum}</span>
                          <span>·</span>
                          <span>Lot {bike.lot}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && (
            <div>
              {incomingRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity size={28} className="text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">No incoming requests</h3>
                  <p className="text-gray-400 text-sm">Rental requests for your bikes will appear here</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {incomingRequests.map((req) => (
                    <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all space-y-4">

                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-xl ${
                          req.status === RequestStatus.PENDING ? 'bg-amber-50' :
                          req.status === RequestStatus.ACCEPTED ? 'bg-emerald-50' : 'bg-rose-50'
                        }`}>
                          {req.status === RequestStatus.PENDING && <Clock size={18} className="text-amber-500" />}
                          {req.status === RequestStatus.ACCEPTED && <CheckCircle2 size={18} className="text-emerald-500" />}
                          {req.status === RequestStatus.REJECTED && <XCircle size={18} className="text-rose-500" />}
                        </div>
                        <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg border ${
                          req.status === RequestStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          req.status === RequestStatus.ACCEPTED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Bike</p>
                        <p className="font-bold text-gray-900">{req.bike.brand}</p>
                        <p className="text-xs text-gray-400 font-mono">{req.bike.bikeNum}</p>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <UserIcon size={14} className="text-indigo-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{req.renter?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400 truncate">{req.renter?.email || ''}</p>
                        </div>
                      </div>

                      {req.status === RequestStatus.PENDING && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequest(req.id, RequestStatus.ACCEPTED)}
                            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleRequest(req.id, RequestStatus.REJECTED)}
                            className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;