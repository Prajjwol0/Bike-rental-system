import NavbarHome from "@/components/navbarHome";
import { Bike, Shield, Users } from "lucide-react";
import Contacts from "./contacts";
import Logo from "@/components/logo";

function About() {
  const ImageUrl = "/images/Rent.jpg";
  return (
    <>
      <NavbarHome />
      {/* About */}
      <div className="relative h-96 max-w-full bg-linear-to-r ">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-balck px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              About RideLoop
            </h1>
            <p className="text-xl md:text-2xl">
              Your trusted bike rental partner since 2020
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                Our Story
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                RideLoop was founded with a simple mission: make bike rentals
                accessible, affordable, and hassle-free for everyone. We believe
                that exploring a city on two wheels is the best way to
                experience its culture and beauty.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Starting with just 10 bikes in 2020, we've grown to serve
                thousands of happy customers with a fleet of over 500 premium
                bikes across multiple locations.
              </p>
              <p className="text-gray-600 text-lg">
                Our commitment to quality, safety, and customer satisfaction has
                made us the #1 choice for bike rentals in the city.
              </p>
            </div>
            <div className="relative">
              <img
                src={ImageUrl}
                alt="Bikes"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Information About Ride Loop */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our top priority. We go the extra mile to
                ensure you have the best experience.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Safety & Quality</h3>
              <p className="text-gray-600">
                Every bike undergoes rigorous safety checks and maintenance
                before each rental.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bike size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We promote eco-friendly transportation and reduce carbon
                footprint one ride at a time.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Contacts />
      <Logo/>
    </>
  );
}

export default About;
