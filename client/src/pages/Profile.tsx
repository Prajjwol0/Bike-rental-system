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
  Loader2,
} from "lucide-react";
import { useAlert } from "../utils/useAlert";

// Toast Notification Component
const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({
  toasts,
  removeToast,
}) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-[calc(100vw-2rem)]">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`transform transition-all duration-300 ease-out ${
          toast.type === "success"
            ? "bg-[#2E7D32]"
            : toast.type === "error"
            ? "bg-rose-500"
            : "bg-[#8D6E63]"
        } text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[260px] max-w-xs`}
      >
        {toast.type === "success" && <CheckCircle2 size={20} />}
        {toast.type === "error" && <XCircle size={20} />}
        {toast.type === "info" && <AlertTriangle size={20} />}
        <span className="font-medium flex-1 text-sm">{toast.message}</span>
        <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0">
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

// Skeleton Loading Component
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-[#D8C3A5]/40 shadow-sm animate-pulse">
    <div className="h-6 bg-[#D8C3A5]/50 rounded-lg w-1/3 mb-4"></div>
    <div className="h-4 bg-[#D8C3A5]/30 rounded-lg w-2/3 mb-2"></div>
    <div className="h-4 bg-[#D8C3A5]/30 rounded-lg w-1/2"></div>
  </div>
);

const Profile: React.FC = () => {
  const { showConfirm } = useAlert();
  const [user, setUser] = useState<User | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingBike, setEditingBike] = useState<string | null>(null);
  const [editBikeData, setEditBikeData] = useState({ brand: "", lot: "" });

  const [savingName, setSavingName] = useState(false);
  const [savingBike, setSavingBike] = useState(false);
  const [cancellingRequest, setCancellingRequest] = useState<string | null>(null);
  const [deletingProfile, setDeletingProfile] = useState(false);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchProfile = async () => {
    try {
      const userRes = await axios.get("/users/profile");
      setUser(userRes.data);
      try {
        const bikeRes = await axios.get("/bikes/myBike");
        setBikes(bikeRes.data || []);
      } catch { setBikes([]); }
      try {
        const requestRes = await axios.get("/requests/my-requests");
        setRequests(requestRes.data || []);
      } catch { setRequests([]); }
    } catch {
      setUser(null);
      addToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

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

  const initiateCancelRequest = async (reqId: string) => {
    const confirmed = await showConfirm({
      title: "Cancel Request",
      message: "Are you sure you want to cancel this rental request?",
      confirmText: "Cancel Request",
      cancelText: "Keep It",
      variant: "primary",
    });
    if (!confirmed) return;
    setCancellingRequest(reqId);
    try {
      await axios.delete(`/requests/${reqId}/cancel`);
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
      addToast("Request cancelled successfully", "success");
    } catch {
      addToast("Failed to cancel request", "error");
    } finally {
      setCancellingRequest(null);
    }
  };

  const handleDeleteProfile = async () => {
    const confirmed = await showConfirm({
      title: "Delete Profile",
      message:
        "This will permanently delete your account, all your bikes, and all rental requests. This action cannot be undone.",
      confirmText: "Delete Profile",
      variant: "danger",
    });
    if (!confirmed) return;
    setDeletingProfile(true);
    try {
      await axios.delete("/users/delete");
      localStorage.clear();
      sessionStorage.clear();
      axios.defaults.headers.common = {};
      addToast("Profile deleted successfully", "success");
      setTimeout(() => { window.location.replace("/"); }, 1000);
    } catch {
      addToast("Failed to delete profile", "error");
      setDeletingProfile(false);
    }
  };

  const getStatusConfig = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return { icon: Clock, bg: "bg-[#fdf9f0]", text: "text-[#8D6E63]", border: "border-[#D8C3A5]", label: "Pending" };
      case RequestStatus.ACCEPTED:
        return { icon: CheckCircle2, bg: "bg-[#f0f5f0]", text: "text-[#2E7D32]", border: "border-[#2E7D32]/20", label: "Accepted" };
      default:
        return { icon: XCircle, bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", label: "Rejected" };
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="h-10 bg-[#D8C3A5]/50 rounded-xl w-48 animate-pulse"></div>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#f5efe8] rounded-full flex items-center justify-center mx-auto">
            <UserIcon size={32} className="text-[#D8C3A5]" />
          </div>
          <h2 className="text-2xl font-bold text-[#3d2e28]">Profile Not Found</h2>
          <p className="text-[#8D6E63]">We couldn't load your profile information.</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2.5 bg-[#2E7D32] text-white rounded-xl font-medium hover:bg-[#256328] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5efe8]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3d2e28] tracking-tight">My Profile</h1>
            <p className="text-[#8D6E63] mt-1 text-sm">Manage your account and rentals</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-12 h-12 bg-[#8D6E63] rounded-2xl flex items-center justify-center shadow-md">
              <UserIcon className="text-white" size={24} />
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8C3A5]/40 overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#D8C3A5]/40 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-[#8D6E63]">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0 w-full">
                {editingName ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-[#8D6E63]">Display Name</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 px-4 py-3 bg-[#f5efe8] border-2 border-[#D8C3A5] rounded-xl font-semibold text-[#3d2e28] focus:border-[#2E7D32] focus:bg-white transition-all outline-none min-w-0"
                        placeholder="Enter your name"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
                      />
                      <button
                        onClick={handleUpdateName}
                        disabled={savingName || !newName.trim()}
                        className="p-3 bg-[#2E7D32] text-white rounded-xl hover:bg-[#256328] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                      >
                        {savingName ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                      </button>
                      <button
                        onClick={() => setEditingName(false)}
                        disabled={savingName}
                        className="p-3 bg-[#f5efe8] text-[#8D6E63] rounded-xl hover:bg-[#ede5db] transition-all flex-shrink-0"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#3d2e28]">{user.name}</h2>
                      <button
                        onClick={() => { setEditingName(true); setNewName(user.name); }}
                        className="p-2 text-[#8D6E63]/60 hover:text-[#2E7D32] hover:bg-[#f0f5f0] rounded-lg transition-all"
                        title="Edit name"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[#8D6E63]">
                      <Mail size={16} />
                      <span className="text-sm truncate">{user.email}</span>
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
            <div className="p-2 bg-[#2E7D32]/10 rounded-xl">
              <BikeIcon size={20} className="text-[#2E7D32]" />
            </div>
            <h2 className="text-xl font-bold text-[#3d2e28]">My Bikes</h2>
            <span className="px-3 py-1 bg-[#D8C3A5]/40 text-[#8D6E63] rounded-full text-sm font-medium">{bikes.length}</span>
          </div>

          {bikes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#D8C3A5] p-12 text-center">
              <div className="w-16 h-16 bg-[#f5efe8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BikeIcon size={28} className="text-[#D8C3A5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#3d2e28] mb-1">No bikes registered</h3>
              <p className="text-[#8D6E63]">Add your first bike to start renting</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bikes.map((bike) => (
                <div key={bike.bikeNum} className="bg-white rounded-2xl border border-[#D8C3A5]/40 shadow-sm overflow-hidden transition-all hover:shadow-md">
                  {editingBike === bike.bikeNum ? (
                    <div className="p-6 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#8D6E63] mb-2">Brand</label>
                          <input
                            type="text"
                            value={editBikeData.brand}
                            onChange={(e) => setEditBikeData((prev) => ({ ...prev, brand: e.target.value }))}
                            placeholder="e.g., Yamaha"
                            className="w-full px-4 py-3 bg-[#f5efe8] border-2 border-[#D8C3A5] rounded-xl font-medium text-[#3d2e28] focus:border-[#2E7D32] focus:bg-white transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#8D6E63] mb-2">Lot Number</label>
                          <input
                            type="number"
                            value={editBikeData.lot}
                            onChange={(e) => setEditBikeData((prev) => ({ ...prev, lot: e.target.value }))}
                            placeholder="e.g., 42"
                            className="w-full px-4 py-3 bg-[#f5efe8] border-2 border-[#D8C3A5] rounded-xl font-medium text-[#3d2e28] focus:border-[#2E7D32] focus:bg-white transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleUpdateBike(bike.bikeNum)}
                          disabled={savingBike || !editBikeData.brand.trim()}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] text-white rounded-xl font-medium hover:bg-[#256328] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {savingBike ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingBike(null)}
                          disabled={savingBike}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[#f5efe8] text-[#8D6E63] rounded-xl font-medium hover:bg-[#ede5db] transition-all"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#f5efe8] rounded-xl flex items-center justify-center flex-shrink-0">
                          <BikeIcon size={24} className="text-[#8D6E63]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#3d2e28] text-lg">{bike.brand}</h3>
                          <div className="flex items-center gap-3 text-sm text-[#8D6E63] mt-0.5">
                            <span className="font-mono bg-[#f5efe8] px-2 py-0.5 rounded text-xs">{bike.bikeNum}</span>
                            <span>·</span>
                            <span>Lot {bike.lot}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => { setEditingBike(bike.bikeNum); setEditBikeData({ brand: bike.brand, lot: String(bike.lot) }); }}
                        className="p-3 text-[#8D6E63]/60 hover:text-[#2E7D32] hover:bg-[#f0f5f0] rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100 self-start sm:self-auto"
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
            <div className="p-2 bg-[#D8C3A5]/50 rounded-xl">
              <Clock size={20} className="text-[#8D6E63]" />
            </div>
            <h2 className="text-xl font-bold text-[#3d2e28]">Rental Requests</h2>
            <span className="px-3 py-1 bg-[#D8C3A5]/40 text-[#8D6E63] rounded-full text-sm font-medium">{requests.length}</span>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#D8C3A5] p-12 text-center">
              <div className="w-16 h-16 bg-[#f5efe8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-[#D8C3A5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#3d2e28] mb-1">No active requests</h3>
              <p className="text-[#8D6E63]">Your rental requests will appear here</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((req) => {
                const status = getStatusConfig(req.status);
                const StatusIcon = status.icon;
                return (
                  <div key={req.id} className="bg-white rounded-2xl border border-[#D8C3A5]/40 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status.bg} flex-shrink-0`}>
                        <StatusIcon size={20} className={status.text} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#3d2e28]">{req.bike.brand}</h3>
                        <p className="text-sm text-[#8D6E63] font-mono">{req.bike.bikeNum}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                        {status.label}
                      </span>
                      {req.status === "pending" && (
                        <button
                          onClick={() => initiateCancelRequest(req.id)}
                          disabled={cancellingRequest === req.id}
                          className="p-2.5 text-[#8D6E63]/60 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
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
        <section className="pt-8 border-t border-[#D8C3A5]/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-rose-100 rounded-xl">
              <ShieldAlert size={20} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-[#3d2e28]">Danger Zone</h2>
          </div>
          <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-rose-900">Delete Profile</h3>
                <p className="text-rose-700/80 max-w-xl text-sm leading-relaxed">
                  Once you delete your profile, there is no going back. This will permanently delete your account, all bikes, and rental history.
                </p>
              </div>
              <button
                onClick={handleDeleteProfile}
                disabled={deletingProfile}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 whitespace-nowrap"
              >
                {deletingProfile ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
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