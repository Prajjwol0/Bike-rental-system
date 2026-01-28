import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useGetMeApi } from "@/hooks/use-user";
import { useLogoutApi } from "@/hooks/useLogout";
import { Bike } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function NavbarDashboard() {
  const { data, isLoading, isError, error } = useGetMeApi();
  const { mutateAsync: logout } = useLogoutApi();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await logout();
      toast(res.data.message);
      navigate(ROUTES.login);
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your profile...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error?.message}</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <nav className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md shadow-lg border-b border-green-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-50">
          {/*  Welcome section  */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <p className="text-sm sm:text-lg font-light text-gray-700 hidden sm:block">
              Welcome,
            </p>
            <p className="text-lg sm:text-2xl font-black text-neutral-400 truncate max-w-50">
              {data?.data.username}
            </p>
            <Bike className="text-xl sm:text-2xl text-green-600 ml-1 shrink-0" />
          </div>

          {/*Navigation menu */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 h-full">
            
            {/* Rent Bike */}
            <div className="px-2 sm:px-3 group relative">
              <Link to="/rent">
                <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 cursor-pointer py-2 transition-all duration-300">
                  Reservation
                </p>
              </Link>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-zinc-500 rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </div>

            {/* My Bike */}
            <div className="px-2 sm:px-3 group relative">
              <Link to="/mybike">
                <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 cursor-pointer py-2 transition-all duration-300">
                  My Booking
                </p>
              </Link>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-zinc-500 rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </div>

            {/* Add Bike */}
            <div className="px-2 sm:px-3 group relative">
              <Link to="/add">
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 cursor-pointer py-2 transition-all duration-300">
                  Add Bike
                </p>
              </Link>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-zinc-500 rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </div>

            {/* Logout Button */}
            <div className="pl-2 sm:pl-4 flex items-center">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-red-500 hover:border-red-300 bg-linear-to-r hover:from-red-500 hover:to-rose-600"
              >
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default NavbarDashboard;
