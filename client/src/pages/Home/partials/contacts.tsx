import NavbarHome from "@/components/navbarHome";
import { Mail, MapPin, Phone } from "lucide-react";

function Contacts() {
  return (
    
<>
      {/* Contact*/}
      <section className="py-20">
      <NavbarHome />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">
            Get In Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Phone size={32} className="text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+977 9878668901 </p>
            </div>
            <div>
              <Mail size={32} className="text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">RideLoop@gmail.com</p>
            </div>
            <div>
              <MapPin size={32} className="text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-600">Bhaktapur Nepal</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contacts;
