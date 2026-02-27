import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import { Bike, RentalRequest, User, Toast, RequestStatus } from "../types";
import { 
  Pencil, 
  X, 
  Check, 
  Trash2, 
  Bike as BikeIcon, 
  User as UserIcon, 
  Mail, 
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Loader2
} from "lucide-react";

// Toast Notification Component
const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ 
  toasts, 
  removeToast 
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`transform transition-all duration-300 ease-out animate-in slide-in-from-right ${
            toast.type === 'success' ? 'bg-emerald-500' : 
            toast.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
          } text-white px-4 py-3 rounded-xl shadow-lg shadow-black/10 flex items-center gap-3 min-w-[300px]`}
        >
          {toast.type === 'success' && <CheckCircle2 size={20} />}
          {toast.type === 'error' && <XCircle size={20} />}
          {toast.type === 'info' && <AlertTriangle size={20} />}
          <span className="font-medium flex-1">{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

// Confirmation Modal Component
const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl ${confirmVariant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl font-medium text-white transition-all transform active:scale-95 ${
              confirmVariant === 'danger' 
                ? 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200' 
                : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Component
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
    <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
    <div className="h-4 bg-gray-100 rounded-lg w-2/3 mb-2"></div>
    <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
  </div>
);

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Edit states
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingBike, setEditingBike] = useState<string | null>(null);
  const [editBikeData, setEditBikeData] = useState({ brand: "", lot: "" });
  
  // Loading states for actions
  const [savingName, setSavingName] = useState(false);
  const [savingBike, setSavingBike] = useState(false);
  const [cancellingRequest, setCancellingRequest] = useState<string | null>(null);
  const [deletingProfile, setDeletingProfile] = useState(false);
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Toast helper
  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchProfile = async () => {
    try {
      const userRes = await axios.get("/users/profile");
      setUser(userRes.data);

      try {
        const bikeRes = await axios.get("/bikes/myBike");
        setBikes(bikeRes.data || []);
      } catch {
        setBikes([]);
      }

      try {
        const requestRes = await axios.get("/requests/my-requests");
        setRequests(requestRes.data || []);
      } catch {
        setRequests([]);
      }
    } catch {
      setUser(null);
      addToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateName = async () => {
    if (!newName.trim() || !user) return;
    setSavingName(true);
    try {
      await axios.patch("/users/update", { name: newName });
      setUser({ ...user, name: newName });
      setEditingName(false);
      addToast("Name updated successfully", "success");
    } catch {
      addToast("Failed to update name", "error");
    } finally {
      setSavingName(false);
    }
  };

  const handleUpdateBike = async (bikeNum: string) => {
    setSavingBike(true);
    try {
      await axios.patch(`/bikes/${bikeNum}`, {
        brand: editBikeData.brand,
        lot: Number(editBikeData.lot),
      });
      await fetchProfile();
      setEditingBike(null);
      addToast("Bike details updated", "success");
    } catch {
      addToast("Failed to update bike", "error");
    } finally {
      setSavingBike(false);
    }
  };

  const initiateCancelRequest = (reqId: string) => {
    setSelectedRequestId(reqId);
    setShowCancelModal(true);
  };

  const handleCancelRequest = async () => {
    if (!selectedRequestId) return;
    setCancellingRequest(selectedRequestId);
    try {
      await axios.delete(`/requests/${selectedRequestId}/cancel`);
      setRequests((prev) => prev.filter((r) => r.id !== selectedRequestId));
      addToast("Request cancelled successfully", "success");
      setShowCancelModal(false);
    } catch {
      addToast("Failed to cancel request", "error");
    } finally {
      setCancellingRequest(null);
      setSelectedRequestId(null);
    }
  };

  const handleDeleteProfile = async () => {
    setDeletingProfile(true);
    try {
      await axios.delete("/users/delete");
      localStorage.clear();
      sessionStorage.clear();
      axios.defaults.headers.common = {};
      addToast("Profile deleted successfully", "success");
      setTimeout(() => {
        window.location.replace("http://localhost:3000/");
      }, 1000);
    } catch {
      addToast("Failed to delete profile", "error");
      setDeletingProfile(false);
      setShowDeleteModal(false);
    }
  };

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.PENDING:
      return { icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending' };
    case RequestStatus.ACCEPTED:
      return { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Accepted' };
    default:
      return { icon: XCircle, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Rejected' };
  }
}

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
        <div className="h-10 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <UserIcon size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Not Found</h2>
          <p className="text-gray-500">We couldn't load your profile information.</p>
          <button 
            onClick={fetchProfile}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProfile}
        title="Delete Profile"
        message="This will permanently delete your account, all your bikes, and all rental requests. This action cannot be undone."
        confirmText={deletingProfile ? 'Deleting...' : 'Delete Profile'}
        confirmVariant="danger"
      />
      
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRequest}
        title="Cancel Request"
        message="Are you sure you want to cancel this rental request?"
        confirmText={cancellingRequest ? 'Cancelling...' : 'Cancel Request'}
        confirmVariant="primary"
      />

      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account and rentals</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <UserIcon className="text-white" size={24} />
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                {editingName ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border-2 border-blue-200 rounded-xl font-semibold text-gray-900 focus:border-blue-500 focus:bg-white transition-all outline-none"
                        placeholder="Enter your name"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                      />
                      <button 
                        onClick={handleUpdateName}
                        disabled={savingName || !newName.trim()}
                        className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {savingName ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                      </button>
                      <button 
                        onClick={() => setEditingName(false)}
                        disabled={savingName}
                        className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                      <button
                        onClick={() => { setEditingName(true); setNewName(user.name); }}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit name"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* My Bikes Section */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <BikeIcon size={20} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">My Bikes</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              {bikes.length}
            </span>
          </div>

          {bikes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BikeIcon size={28} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No bikes registered</h3>
              <p className="text-gray-500">Add your first bike to start renting</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bikes.map((bike) => (
                <div 
                  key={bike.bikeNum} 
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {editingBike === bike.bikeNum ? (
                    <div className="p-6 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                          <input
                            type="text"
                            value={editBikeData.brand}
                            onChange={(e) => setEditBikeData((prev) => ({ ...prev, brand: e.target.value }))}
                            placeholder="e.g., Trek, Giant"
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-indigo-200 rounded-xl font-medium focus:border-indigo-500 focus:bg-white transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Lot Number</label>
                          <input
                            type="number"
                            value={editBikeData.lot}
                            onChange={(e) => setEditBikeData((prev) => ({ ...prev, lot: e.target.value }))}
                            placeholder="e.g., 42"
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-indigo-200 rounded-xl font-medium focus:border-indigo-500 focus:bg-white transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateBike(bike.bikeNum)}
                          disabled={savingBike || !editBikeData.brand.trim()}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {savingBike ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingBike(null)}
                          disabled={savingBike}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center">
                          <BikeIcon size={24} className="text-indigo-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{bike.brand}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{bike.bikeNum}</span>
                            <span>·</span>
                            <span>Lot {bike.lot}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingBike(bike.bikeNum);
                          setEditBikeData({ brand: bike.brand, lot: String(bike.lot) });
                        }}
                        className="p-3 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        title="Edit bike"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Request Status Section */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Clock size={20} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Rental Requests</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              {requests.length}
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No active requests</h3>
              <p className="text-gray-500">Your rental requests will appear here</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((req) => {
                const status = getStatusConfig(req.status);
                const StatusIcon = status.icon;
                
                return (
                  <div 
                    key={req.id} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between group hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status.bg}`}>
                        <StatusIcon size={20} className={status.text} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{req.bike.brand}</h3>
                        <p className="text-sm text-gray-500 font-mono">{req.bike.bikeNum}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                        {status.label}
                      </span>
                      
                      {req.status === 'pending' && (
                        <button
                          onClick={() => initiateCancelRequest(req.id)}
                          disabled={cancellingRequest === req.id}
                          className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          title="Cancel request"
                        >
                          {cancellingRequest === req.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section className="pt-8 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-rose-100 rounded-xl">
              <ShieldAlert size={20} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border border-rose-200 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-rose-900">Delete Profile</h3>
                <p className="text-rose-700/80 max-w-xl">
                  Once you delete your profile, there is no going back. This will permanently delete your account, all bikes, and rental history.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={deletingProfile}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold rounded-xl shadow-lg shadow-rose-200 transition-all transform active:scale-95 whitespace-nowrap"
              >
                {deletingProfile ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                Delete Profile
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
