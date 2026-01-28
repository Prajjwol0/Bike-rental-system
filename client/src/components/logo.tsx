import { Bike } from "lucide-react";
import { Link } from "react-router-dom";



function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
      <p className="text-lg font-bold sm:text-2xl text-gray-700 hidden sm:block">
        Ride
        <span className="text-lg sm:text-2xl font-bold text-gray-500 ml-1">
          LOOP
        </span>
      </p>

      <Bike className="text-xl sm:text-2xl text-green-600 ml-1 shrink-0" />
    </Link>
  );
}

export default Logo;

