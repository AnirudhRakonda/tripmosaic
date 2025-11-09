import { Link } from "react-router-dom";
import { Plane, Users, MapPin, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 opacity-10">
        <Plane className="w-32 h-32 text-orange-500 transform rotate-45" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-10">
        <MapPin className="w-40 h-40 text-teal-500" />
      </div>
      <div className="absolute top-1/3 right-10 opacity-10">
        <Users className="w-24 h-24 text-red-400" />
      </div>
      <div className="absolute bottom-1/3 left-10 opacity-10">
        <Sparkles className="w-28 h-28 text-orange-400" />
      </div>

      {/* Main Content */}
      <div className="bg-white border-2 border-orange-100 p-12 rounded-3xl text-center max-w-lg shadow-2xl relative z-10">
        
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl mb-6 shadow-lg">
          <Plane className="w-10 h-10 text-white transform -rotate-45" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
          TripMosaic
        </h1>

        {/* Tagline */}
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Plan trips that match everyone's vibe. 
          <span className="block mt-2 text-orange-500 font-medium">
            Collaborate • Explore • Adventure Together
          </span>
        </p>

        {/* Features */}
        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-500" />
            <span>Group Plans</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span>Smart Routes</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-400" />
            <span>Split Costs</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 rounded-xl text-white font-semibold text-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Secondary Link */}
        <p className="text-gray-500 text-sm mt-6">
          Already have an account? 
          <Link to="/login" className="text-teal-600 font-medium hover:text-teal-700 ml-1">
            Sign In
          </Link>
        </p>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-teal-400"></div>
    </div>
  );
}