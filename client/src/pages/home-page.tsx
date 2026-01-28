import NavbarHome from "@/components/navbarHome";


import About from "./Home/partials/about";

function HomePage() {
  const ImageUrl =
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000";
  return (
    <>
      <div className="min-h-screen">
        <NavbarHome />

        <div className=" h-screen">
          {/* Background Image  */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden">
            <img src={ImageUrl} alt="" />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Over Image */}
          <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
            <div className="max-w-4xl">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                Ride Your Dream Bike
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 mb-8">
                Explore the city on two wheels. Affordable, Easy, Fun!
              </p>
              <div className="flex gap-4 justify-center">
                <button className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transform hover:scale-105 transition">
                  Rent Now
                </button>
                <button className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <About />
     
    </>
  );
}
export default HomePage;
