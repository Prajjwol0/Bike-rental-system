import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import axios from '../api/axios';
import { Bike, BikeStatus } from '../types';
import { Search, MapPin, Bike as BikeIcon, ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BikeList: React.FC = () => {
  const { user } = useAuth();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const response = await axios.get('/bikes/all');
      setBikes(response.data);
    } catch (error) {
      console.error('Error fetching bikes:', error);
    } finally {
      setLoading(false);
    }
  };

const filteredBikes = bikes.filter(bike => 
  bike.status !== BikeStatus.RENTED &&
  (bike.brand.toLowerCase().includes(search.toLowerCase()) ||
  bike.bikeNum.toLowerCase().includes(search.toLowerCase()))
);
const handleRent = async (bikeNum: string) => {
  if (!user) return;
  
  
  try {
    const response = await axios.post(`/requests/${bikeNum}`, {
      offeredPrice: 1000  // Add default price or make input field
    });
    
    console.log(' SUCCESS:', response.data);
    alert('Rental request sent successfully!');
    fetchBikes();
  } catch (error: any) {
    console.log(' ERROR:', error.response?.data);
    alert(error.response?.data?.message || 'Failed to send request');
  }
};




  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Showroom Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">
          Premium <span className="text-orange-600">Showroom</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Browse our collection of high-performance machines. Ready for your next adventure.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-16">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by brand or bike number..."
          className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-white shadow-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Bike Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBikes.map((bike) => (
          <div 
            key={bike.bikeNum} 
            className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
          >
            {/* Image Placeholder with Gradient */}
            <div className="h-56 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1558981403-c5f91cbba527?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
               <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
                    bike.status === BikeStatus.AVAILABLE ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {bike.status}
                  </span>
               </div>
               <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2 text-orange-400 mb-1">
                    <Zap size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Top Speed Ready</span>
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight">{bike.brand}</h3>
               </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <BikeIcon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Plate</p>
                    <p className="text-sm font-semibold">{bike.bikeNum}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Lot</p>
                    <p className="text-sm font-semibold">{bike.lot}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-400 mb-6 bg-gray-50 p-2 rounded-lg">
                <ShieldCheck size={14} className="text-green-500" />
                <span>Verified by {bike.ownerMail}</span>
              </div>

              {user ? (
                bike.ownerMail !== user.email ? (
                  <button
                    onClick={() => handleRent(bike.bikeNum)}
                    disabled={bike.status !== BikeStatus.AVAILABLE}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                      bike.status === BikeStatus.AVAILABLE 
                        ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200 active:scale-95' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{bike.status === BikeStatus.AVAILABLE ? 'Book Ride' : 'Not Available'}</span>
                    {bike.status === BikeStatus.AVAILABLE && <ArrowRight size={18} />}
                  </button>
                ) : (
                  <Link
                    to="/dashboard"
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-center block hover:bg-black transition-colors"
                  >
                    Manage My Bike
                  </Link>
                )
              ) : (
                <Link
                  to="/login"
                  className="w-full py-4 bg-gray-100 text-gray-900 rounded-xl font-bold uppercase tracking-widest text-center block hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Info size={18} />
                  <span>Login to Rent</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBikes.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-xl font-medium">No bikes found in the showroom matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default BikeList;
