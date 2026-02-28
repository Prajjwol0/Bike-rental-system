import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import axios from '../api/axios';
import { Bike, RentalRequest, RequestStatus, BikeStatus } from '../types';
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
  Menu,
  X,
} from 'lucide-react';
import { useAlert } from '../utils/useAlert';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();

  const [myBikes, setMyBikes] = useState<Bike[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      showAlert({ message: 'New machine added successfully!', type: 'success', title: 'Bike Registered' });
    } catch (error: any) {
      showAlert({
        message: error.response?.data?.message || 'Bike registration failed',
        type: 'error',
        title: 'Registration Failed',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRequest = async (requestId: string, status: RequestStatus) => {
    try {
      await axios.patch(`/requests/${requestId}/decide`, { status });
      await fetchDashboardData();
    } catch {
      showAlert({ message: 'Request update failed', type: 'error', title: 'Error' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f5efe8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
      </div>
    );
  }

  const pendingCount = incomingRequests.filter((r) => r.status === RequestStatus.PENDING).length;

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[#D8C3A5]/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#8D6E63] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#3d2e28] truncate">{user?.name}</p>
            <p className="text-xs text-[#8D6E63] truncate">ID: {user?.id?.slice(-6)}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] text-[#8D6E63]/60 uppercase tracking-widest font-bold px-3 mb-3">Menu</p>

        <button
          onClick={() => { setActiveTab('inventory'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
            activeTab === 'inventory'
              ? 'bg-[#f0f5f0] text-[#2E7D32]'
              : 'text-[#8D6E63] hover:bg-[#f5efe8] hover:text-[#3d2e28]'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${activeTab === 'inventory' ? 'bg-[#2E7D32]/15' : 'bg-[#f5efe8]'}`}>
            <Database size={16} />
          </div>
          Inventory
        </button>

        <button
          onClick={() => { setActiveTab('requests'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
            activeTab === 'requests'
              ? 'bg-[#f0f5f0] text-[#2E7D32]'
              : 'text-[#8D6E63] hover:bg-[#f5efe8] hover:text-[#3d2e28]'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${activeTab === 'requests' ? 'bg-[#2E7D32]/15' : 'bg-[#f5efe8]'}`}>
            <Activity size={16} />
          </div>
          Requests
          {pendingCount > 0 && (
            <span className="ml-auto bg-[#D8C3A5] text-[#3d2e28] text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </nav>

      <div className="p-4 border-t border-[#D8C3A5]/40">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#8D6E63] hover:bg-rose-50 hover:text-rose-500 transition-all text-sm font-semibold"
        >
          <div className="p-1.5 rounded-lg bg-[#f5efe8]">
            <LogOut size={16} />
          </div>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5efe8] flex">

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-[#D8C3A5]/40 shadow-sm hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-xl z-50">
            <div className="flex justify-end p-3">
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-[#f5efe8]">
                <X size={20} className="text-[#8D6E63]" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">

        {/* Header */}
        <div className="bg-white border-b border-[#D8C3A5]/40 px-4 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-[#f5efe8] text-[#8D6E63]"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#3d2e28] tracking-tight">
                {activeTab === 'inventory' ? 'My Fleet' : 'Incoming Requests'}
              </h1>
              <p className="text-xs sm:text-sm text-[#8D6E63] mt-0.5">
                {activeTab === 'inventory' ? 'Manage your registered bikes' : 'Review and respond to rental requests'}
              </p>
            </div>
          </div>
          <div className="hidden sm:block p-2.5 bg-[#f0f5f0] rounded-xl border border-[#2E7D32]/20">
            {activeTab === 'inventory'
              ? <BikeIcon size={22} className="text-[#2E7D32]" />
              : <Activity size={22} className="text-[#2E7D32]" />
            }
          </div>
        </div>

        <div className="p-4 sm:p-8">

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">

              {/* Register Form */}
              <div className="bg-white rounded-2xl border border-[#D8C3A5]/40 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#D8C3A5]/40 bg-[#faf7f3] flex items-center gap-3">
                  <div className="p-2 bg-[#2E7D32]/10 rounded-xl">
                    <Plus size={16} className="text-[#2E7D32]" />
                  </div>
                  <h2 className="font-bold text-[#3d2e28]">Register New Bike</h2>
                </div>
                <form onSubmit={handleCreateBike} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8D6E63] uppercase tracking-wider mb-2">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Yamaha, Honda"
                      value={newBike.brand}
                      onChange={(e) => setNewBike((prev) => ({ ...prev, brand: e.target.value }))}
                      className="w-full bg-[#f5efe8] border-2 border-[#D8C3A5] rounded-xl px-4 py-3 font-medium text-[#3d2e28] focus:border-[#2E7D32] focus:bg-white outline-none transition-all placeholder-[#b8a99a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8D6E63] uppercase tracking-wider mb-2">Plate Number</label>
                    <input
                      type="text"
                      placeholder="e.g., BA 1 CHA 1234"
                      value={newBike.bikeNum}
                      onChange={(e) => setNewBike((prev) => ({ ...prev, bikeNum: e.target.value }))}
                      className="w-full bg-[#f5efe8] border-2 border-[#D8C3A5] rounded-xl px-4 py-3 font-medium text-[#3d2e28] focus:border-[#2E7D32] focus:bg-white outline-none transition-all placeholder-[#b8a99a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8D6E63] uppercase tracking-wider mb-2">Lot Number</label>
                    <input
                      type="number"
                      placeholder="e.g., 42"
                      value={newBike.lot}
                      onChange={(e) => setNewBike((prev) => ({ ...prev, lot: e.target.value }))}
                      className="w-full bg-[#f5efe8] border-2 border-[#D8C3A5] rounded-xl px-4 py-3 font-medium text-[#3d2e28] focus:border-[#2E7D32] focus:bg-white outline-none transition-all placeholder-[#b8a99a]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-3 bg-[#2E7D32] hover:bg-[#256328] disabled:bg-[#2E7D32]/40 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
                  >
                    {submitLoading ? 'Registering...' : 'Register Bike'}
                  </button>
                </form>
              </div>

              {/* Bike List */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-bold text-[#3d2e28]">Registered Fleet</h2>
                  <span className="px-3 py-1 bg-[#D8C3A5]/40 text-[#8D6E63] rounded-full text-sm font-medium">{myBikes.length}</span>
                </div>

                {myBikes.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-[#D8C3A5] p-16 text-center">
                    <div className="w-16 h-16 bg-[#f5efe8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BikeIcon size={28} className="text-[#D8C3A5]" />
                    </div>
                    <h3 className="font-semibold text-[#3d2e28] mb-1">No bikes registered yet</h3>
                    <p className="text-[#8D6E63] text-sm">Add your first bike using the form</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {myBikes.map((bike) => (
                      <div key={bike.bikeNum} className="bg-white rounded-2xl border border-[#D8C3A5]/40 shadow-sm p-6 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-[#f5efe8] rounded-xl flex items-center justify-center">
                            <BikeIcon size={22} className="text-[#8D6E63]" />
                          </div>
                          <span
                            className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${
                              bike.status === BikeStatus.AVAILABLE
                                ? 'bg-[#f0f5f0] text-[#2E7D32]'
                                : bike.status === BikeStatus.RENTED
                                ? 'bg-[#fdf5ee] text-[#8D6E63]'
                                : 'bg-[#f5efe8] text-[#b8a99a]'
                            }`}
                          >
                            {bike.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-[#3d2e28] text-lg">{bike.brand}</h3>
                        <div className="flex items-center gap-3 text-sm text-[#8D6E63] mt-1">
                          <span className="font-mono bg-[#f5efe8] px-2 py-0.5 rounded text-xs">{bike.bikeNum}</span>
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
                <div className="bg-white rounded-2xl border-2 border-dashed border-[#D8C3A5] p-20 text-center">
                  <div className="w-16 h-16 bg-[#f5efe8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity size={28} className="text-[#D8C3A5]" />
                  </div>
                  <h3 className="font-semibold text-[#3d2e28] mb-1">No incoming requests</h3>
                  <p className="text-[#8D6E63] text-sm">Rental requests for your bikes will appear here</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {incomingRequests.map((req) => (
                    <div key={req.id} className="bg-white rounded-2xl border border-[#D8C3A5]/40 shadow-sm p-6 hover:shadow-md transition-all space-y-4">

                      <div className="flex items-center justify-between">
                        <div
                          className={`p-2 rounded-xl ${
                            req.status === RequestStatus.PENDING
                              ? 'bg-[#fdf9f0]'
                              : req.status === RequestStatus.ACCEPTED
                              ? 'bg-[#f0f5f0]'
                              : 'bg-rose-50'
                          }`}
                        >
                          {req.status === RequestStatus.PENDING && <Clock size={18} className="text-[#8D6E63]" />}
                          {req.status === RequestStatus.ACCEPTED && <CheckCircle2 size={18} className="text-[#2E7D32]" />}
                          {req.status === RequestStatus.REJECTED && <XCircle size={18} className="text-rose-500" />}
                        </div>
                        <span
                          className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg border ${
                            req.status === RequestStatus.PENDING
                              ? 'bg-[#fdf9f0] text-[#8D6E63] border-[#D8C3A5]'
                              : req.status === RequestStatus.ACCEPTED
                              ? 'bg-[#f0f5f0] text-[#2E7D32] border-[#2E7D32]/20'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-[10px] text-[#8D6E63]/60 uppercase tracking-widest mb-1">Bike</p>
                        <p className="font-bold text-[#3d2e28]">{req.bike.brand}</p>
                        <p className="text-xs text-[#8D6E63] font-mono">{req.bike.bikeNum}</p>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-[#f5efe8] rounded-xl">
                        <div className="w-8 h-8 bg-[#D8C3A5]/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <UserIcon size={14} className="text-[#8D6E63]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#3d2e28] text-sm truncate">{req.renter?.name || 'Unknown'}</p>
                          <p className="text-xs text-[#8D6E63] truncate">{req.renter?.email || ''}</p>
                        </div>
                      </div>

                      {req.status === RequestStatus.PENDING && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequest(req.id, RequestStatus.ACCEPTED)}
                            className="flex-1 py-2.5 bg-[#2E7D32] hover:bg-[#256328] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
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