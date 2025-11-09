import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { Plane, Users, MapPin } from "lucide-react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup Successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google Sign-In Successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <Plane className="w-24 h-24 text-teal-600 transform rotate-45" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <MapPin className="w-32 h-32 text-orange-500" />
      </div>
      <div className="absolute top-1/2 right-20 opacity-10">
        <Users className="w-20 h-20 text-red-400" />
      </div>

      <div className="bg-white border-2 border-orange-100 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl mb-4 shadow-lg">
            <Plane className="w-8 h-8 text-white transform -rotate-45" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Start Your Journey</h2>
          <p className="text-gray-500 text-sm">Plan epic trips with your crew</p>
        </div>
        
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="wanderer@email.com"
              className="w-full p-3 rounded-xl bg-amber-50 border-2 border-orange-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-amber-50 border-2 border-orange-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <button 
            onClick={handleSignup}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Account
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="text-gray-400 px-4 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button 
          onClick={handleGoogleSignup}
          className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-teal-400 transition shadow-sm hover:shadow-md"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Sign Up with Google
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? 
          <span className="text-teal-600 font-medium hover:text-teal-700 ml-1 cursor-pointer">Sign In</span>
        </p>
      </div>
    </div>
  );
}