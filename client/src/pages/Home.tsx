import React from 'react';
import { Shield, Zap, TrendingUp, ArrowRight, Gauge } from 'lucide-react';
import BikeList from '../bikes/BikeList';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">

      {/* Hero Section */}
      <section className="relative h-[90vh] bg-gray-900 overflow-hidden flex items-center">

        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600/20 to-transparent skew-x-12 transform translate-x-32" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <div className="max-w-3xl">

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-600/20 border border-orange-600/30 mb-8">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Now Open: City Showroom
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-8">
              Ride the <br />
              <span className="text-orange-600">Evolution</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mb-12 border-l-4 border-orange-600 pl-6 leading-relaxed">
              Experience the pinnacle of two-wheeled engineering. From urban commuters to track-ready monsters, our community-driven showroom has it all.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">

              <a
                href="#showroom"
                className="px-10 py-5 bg-orange-600 text-white font-black italic uppercase tracking-widest text-sm hover:bg-orange-700 transition-all flex items-center justify-center space-x-3 group"
              >
                <span>Enter Showroom</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>

              {user ? (
                <Link
                  to="/dashboard"
                  className="px-10 py-5 bg-white text-gray-900 font-black italic uppercase tracking-widest text-sm hover:bg-gray-100 transition-all flex items-center justify-center space-x-3"
                >
                  <span>List Your Machine</span>
                  <Gauge size={20} />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-10 py-5 bg-white text-gray-900 font-black italic uppercase tracking-widest text-sm hover:bg-gray-100 transition-all flex items-center justify-center space-x-3"
                >
                  <span>List Your Machine</span>
                  <Gauge size={20} />
                </Link>
              )}

            </div>
          </div>
        </div>

        {/* Speed Lines */}
        <div className="absolute bottom-20 right-20 hidden lg:block opacity-20">
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1 h-32 bg-white transform -skew-x-[30deg]"
                style={{ opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="space-y-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tight">
              Verified Fleet
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              Every machine in our showroom undergoes verification for safety and reliability.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tight">
              Instant Booking
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              Request, approve, and ride quickly using our digital system.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tight">
              Community Driven
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              Join the rider community and manage your machines easily.
            </p>
          </div>

        </div>
      </section>

      {/* Showroom Section */}
      <section id="showroom" className="py-24">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-xs mb-2">
                Live Inventory
              </p>

              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight text-gray-900">
                Explore the <span className="text-orange-600">Collection</span>
              </h2>
            </div>

            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              Total Units: Verified & Ready
            </p>
          </div>

          <BikeList />

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-orange-600 text-white text-center">
        <div className="max-w-5xl mx-auto px-4">

          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight mb-8">
            Own the Road Today
          </h2>

          <p className="text-orange-100 text-xl font-medium mb-12 max-w-2xl mx-auto">
            Ready to share your ride or start your next adventure? Join the ecosystem.
          </p>

          <Link
            to="/register"
            className="px-12 py-5 bg-white text-orange-600 font-black italic uppercase tracking-widest text-sm hover:bg-orange-50 transition-all rounded-full shadow-2xl"
          >
            Get Started Now
          </Link>

        </div>
      </section>

    </div>
  );
};

export default Home;