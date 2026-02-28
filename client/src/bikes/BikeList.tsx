import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import axios from '../api/axios';
import { Bike, BikeStatus, RentalRequest, RequestStatus } from '../types';
import { Search, MapPin, Bike as BikeIcon, ShieldCheck, Zap, Info, ArrowRight, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAlert } from '../utils/useAlert';

// ─── Confirm Booking Modal ────────────────────────────────────────────────────
const BookConfirmModal: React.FC<{
  bike: Bike;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}> = ({ bike, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-[#D8C3A5]/50">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-[#f0f5f0] rounded-xl">
          <BikeIcon size={22} className="text-[#2E7D32]" />
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 text-[#8D6E63]/60 hover:text-[#3d2e28] hover:bg-[#f5efe8] rounded-lg transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <h3 className="font-bold text-[#3d2e28] text-lg mb-1">Confirm Booking</h3>
      <p className="text-[#8D6E63] text-sm mb-5 leading-relaxed">
        Send a rental request for{' '}
        <span className="font-semibold text-[#3d2e28]">{bike.brand}</span>?
        The owner will review and respond to your request.
      </p>

      {/* Bike summary */}
      <div className="bg-[#f5efe8] rounded-xl p-4 mb-5 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-[#8D6E63]">Brand</span>
          <span className="font-semibold text-[#3d2e28]">{bike.brand}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8D6E63]">Plate</span>
          <span className="font-mono text-[#3d2e28] text-xs bg-white px-2 py-0.5 rounded">{bike.bikeNum}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8D6E63]">Lot</span>
          <span className="font-semibold text-[#3d2e28]">{bike.lot}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8D6E63]">Owner</span>
          <span className="text-[#3d2e28] truncate max-w-[160px] text-right">{bike.ownerMail}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl font-medium text-sm text-[#8D6E63] hover:bg-[#f5efe8] transition-colors disabled:opacity-50"
        >
          Never mind
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-[#2E7D32] hover:bg-[#256328] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Sending...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const BikeList: React.FC = () => {
  const { user } = useAuth();
  const { showAlert, showConfirm } = useAlert();

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [myRequests, setMyRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [confirmingBike, setConfirmingBike] = useState<Bike | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const bikesPromise = axios.get('/bikes/all');
      const requestsPromise = user
        ? axios.get('/requests/my-requests').catch(() => ({ data: [] }))
        : Promise.resolve({ data: [] });

      const [bikesRes, requestsRes] = await Promise.all([bikesPromise, requestsPromise]);
      setBikes(bikesRes.data);
      setMyRequests(requestsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Find if the logged-in user has any request for this bike
  const getMyRequest = (bikeNum: string): RentalRequest | undefined =>
    myRequests.find((r) => r.bike.bikeNum === bikeNum);

  const filteredBikes = bikes.filter(
    (bike) =>
      bike.status !== BikeStatus.RENTED &&
      (bike.brand.toLowerCase().includes(search.toLowerCase()) ||
        bike.bikeNum.toLowerCase().includes(search.toLowerCase())),
  );

  // Opens the confirm modal
  const handleBookClick = (bike: Bike) => {
    setConfirmingBike(bike);
  };

  // Fires after user hits "Confirm Booking" in the modal
  const handleConfirmBook = async () => {
    if (!confirmingBike || !user) return;
    setActionLoading(confirmingBike.bikeNum);
    try {
      await axios.post(`/requests/${confirmingBike.bikeNum}`, { offeredPrice: 1000 });
      setConfirmingBike(null);
      showAlert({
        message: 'Rental request sent! The owner will review it shortly.',
        type: 'success',
        title: 'Request Sent',
      });
      await fetchAll();
    } catch (error: any) {
      setConfirmingBike(null);
      showAlert({
        message: error.response?.data?.message || 'Failed to send request',
        type: 'error',
        title: 'Request Failed',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Fires when user clicks "Cancel Booking"
  const handleCancelBooking = async (bikeNum: string) => {
    const request = getMyRequest(bikeNum);
    if (!request) return;

    const confirmed = await showConfirm({
      title: 'Cancel Booking',
      message: 'Are you sure you want to cancel your rental request for this bike?',
      confirmText: 'Yes, Cancel It',
      cancelText: 'Keep Booking',
      variant: 'primary',
    });
    if (!confirmed) return;

    setActionLoading(bikeNum);
    try {
      await axios.delete(`/requests/${request.id}/cancel`);
      showAlert({ message: 'Your booking request has been cancelled.', type: 'info', title: 'Booking Cancelled' });
      await fetchAll();
    } catch (error: any) {
      showAlert({
        message: error.response?.data?.message || 'Failed to cancel booking',
        type: 'error',
        title: 'Cancel Failed',
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Confirm Booking Modal */}
      {confirmingBike && (
        <BookConfirmModal
          bike={confirmingBike}
          onConfirm={handleConfirmBook}
          onCancel={() => setConfirmingBike(null)}
          loading={actionLoading === confirmingBike.bikeNum}
        />
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-[#3d2e28] mb-4 tracking-tight uppercase italic">
          Premium <span className="text-[#2E7D32]">Showroom</span>
        </h1>
        <p className="text-[#8D6E63] max-w-2xl mx-auto text-lg">
          Browse our collection of high-performance machines. Ready for your next adventure.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-16">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#8D6E63]/60" />
        </div>
        <input
          type="text"
          placeholder="Search by brand or bike number..."
          className="block w-full pl-12 pr-4 py-4 border-2 border-[#D8C3A5] rounded-2xl bg-white shadow-lg focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition-all outline-none text-lg text-[#3d2e28] placeholder-[#b8a99a]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Bike Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBikes.map((bike) => {
          const myRequest = getMyRequest(bike.bikeNum);
          const isPending = myRequest?.status === RequestStatus.PENDING;
          const isAccepted = myRequest?.status === RequestStatus.ACCEPTED;
          const isButtonLoading = actionLoading === bike.bikeNum;

          return (
            <div
              key={bike.bikeNum}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-[#D8C3A5]/40"
            >
              {/* Card image */}
              <div className="h-56 bg-gradient-to-br from-[#3d2e28] to-[#5a4038] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1558981403-c5f91cbba527?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />

                {/* Status badge — top right */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
                    bike.status === BikeStatus.AVAILABLE ? 'bg-[#2E7D32] text-white' : 'bg-[#8D6E63] text-white'
                  }`}>
                    {bike.status}
                  </span>
                </div>

                {/* "Your Request" badge — top left, only shown when user has a request */}
                {myRequest && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
                      isPending
                        ? 'bg-[#D8C3A5] text-[#3d2e28]'
                        : 'bg-white text-[#2E7D32]'
                    }`}>
                      {isPending ? '⏳ Pending' : '✓ Accepted'}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2 text-[#D8C3A5] mb-1">
                    <Zap size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Top Speed Ready</span>
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight">{bike.brand}</h3>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#f5efe8] rounded-lg">
                      <BikeIcon size={18} className="text-[#8D6E63]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-[#8D6E63]/70 font-bold">Plate</p>
                      <p className="text-sm font-semibold text-[#3d2e28]">{bike.bikeNum}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#f5efe8] rounded-lg">
                      <MapPin size={18} className="text-[#8D6E63]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-[#8D6E63]/70 font-bold">Lot</p>
                      <p className="text-sm font-semibold text-[#3d2e28]">{bike.lot}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-[#8D6E63] mb-6 bg-[#f5efe8] p-2 rounded-lg">
                  <ShieldCheck size={14} className="text-[#2E7D32] flex-shrink-0" />
                  <span className="truncate">Verified by {bike.ownerMail}</span>
                </div>

                {/* ── Action area ── */}
                {user ? (
                  bike.ownerMail !== user.email ? (
                    <div>
                      {/* PENDING → Cancel Booking */}
                      {isPending && (
                        <button
                          onClick={() => handleCancelBooking(bike.bikeNum)}
                          disabled={isButtonLoading}
                          className="w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-[#f5efe8] text-[#8D6E63] hover:bg-rose-50 hover:text-rose-600 border-2 border-[#D8C3A5] hover:border-rose-200 active:scale-95 disabled:opacity-60"
                        >
                          {isButtonLoading
                            ? <Loader2 size={18} className="animate-spin" />
                            : <X size={18} />
                          }
                          <span>{isButtonLoading ? 'Cancelling...' : 'Cancel Booking'}</span>
                        </button>
                      )}

                      {/* ACCEPTED → locked, can't cancel */}
                      {isAccepted && (
                        <div className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-center bg-[#f0f5f0] text-[#2E7D32] border-2 border-[#2E7D32]/20 text-sm">
                          ✓ Booking Accepted
                        </div>
                      )}

                      {/* No request yet → Book Ride */}
                      {!myRequest && (
                        <button
                          onClick={() => handleBookClick(bike)}
                          disabled={bike.status !== BikeStatus.AVAILABLE}
                          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            bike.status === BikeStatus.AVAILABLE
                              ? 'bg-[#2E7D32] text-white hover:bg-[#256328] shadow-md active:scale-95'
                              : 'bg-[#f5efe8] text-[#b8a99a] cursor-not-allowed'
                          }`}
                        >
                          <span>{bike.status === BikeStatus.AVAILABLE ? 'Book Ride' : 'Not Available'}</span>
                          {bike.status === BikeStatus.AVAILABLE && <ArrowRight size={18} />}
                        </button>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="w-full py-4 bg-[#3d2e28] text-white rounded-xl font-bold uppercase tracking-widest text-center block hover:bg-[#2d2220] transition-colors"
                    >
                      Manage My Bike
                    </Link>
                  )
                ) : (
                  <Link
                    to="/login"
                    className="w-full py-4 bg-[#f5efe8] text-[#8D6E63] rounded-xl font-bold uppercase tracking-widest text-center block hover:bg-[#ede5db] transition-colors flex items-center justify-center gap-2"
                  >
                    <Info size={18} />
                    <span>Login to Rent</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBikes.length === 0 && (
        <div className="text-center py-20 bg-[#f5efe8] rounded-3xl border-2 border-dashed border-[#D8C3A5]">
          <p className="text-[#8D6E63] text-xl font-medium">No bikes found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default BikeList;