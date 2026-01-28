import { Bike } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function NavbarHome() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <nav className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md shadow-lg border-b border-green-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-50">
          {/*  Welcome section  */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <p className="text-lg font-bold sm:text-2xl font-stretch-200% text-gray-700 hidden sm:block">
              Ride
              <span className="text-lg sm:text-2xl font-stretch-extra-expanded font-bold text-gray-500 truncate max-w-50">
                LOOP
              </span>
            </p>

            <Bike className="text-xl sm:text-2xl text-green-600 ml-1 shrink-0" />
          </div>

          {/*Navigation menu */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 h-full">
            {/* My Bike */}

            <div className="px-2 sm:px-3 group relative">
              <Link to="/about">
                <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 cursor-pointer py-2 transition-all duration-300">
                  About Us
                </p>
              </Link>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-zinc-500 rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </div>

            {/* services and suport */}
            <div className="px-2 sm:px-3 group relative">
              <Link to="/support">
                <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 cursor-pointer py-2 transition-all duration-300">
                  Services&Support
                </p>
              </Link>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-zinc-500 rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </div>

            {/* contact  */}
            <div className="px-2 sm:px-3 group relative">
              <Link to="/contact">
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 cursor-pointer py-2 transition-all duration-300">
                  Contact Us
                </p>
              </Link>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-zinc-500 rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </div>

            {/* Logout Button */}
            <div className="pl-2 sm:pl-4 flex items-center">
              <Link to="/login">
                <Button
                  type="submit"
                  className="w-full bg-zinc-700 text-white text-sm py-3 rounded-md hover:bg-neutral-400 transition-all disabled:bg-neutral-400 disabled:cursor-not-allowed shadow-md font-medium"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default NavbarHome;
