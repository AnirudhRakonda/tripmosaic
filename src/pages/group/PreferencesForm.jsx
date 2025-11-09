import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Sparkles, MapPin, Calendar, DollarSign, Coffee, Home, Mountain } from "lucide-react";

export default function PreferencesForm() {
  const { user } = useContext(AuthContext);
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    budget: "",
    days: "",
    vibe: "",
    food: "",
    stay: "",
    region: "",
  });

  const handleSelect = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await setDoc(doc(db, "preferences", groupId, "members", user.uid), {
      ...form,
      submittedBy: user.uid,
      submittedAt: Date.now(),
    });

    navigate(`/group/${groupId}/plan`);
  };

  const OptionRow = ({ label, field, options, icon: Icon }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-orange-500" />}
        <p className="text-gray-800 font-semibold text-lg">{label}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(field, opt)}
            className={`px-5 py-2.5 rounded-xl border-2 transition font-medium ${
              form[field] === opt
                ? "bg-gradient-to-r from-orange-500 to-red-400 text-white border-orange-500 shadow-lg"
                : "bg-white border-orange-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const isFormComplete = !Object.values(form).includes("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 p-6">
      <div className="max-w-3xl mx-auto bg-white border-2 border-orange-100 p-8 rounded-3xl space-y-8 shadow-2xl">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl mb-2 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Trip Preferences</h1>
          <p className="text-gray-600 text-lg">
            Choose the options that match your vibe ✨
          </p>
        </div>

        {/* Form Options */}
        <div className="space-y-6">
          <OptionRow 
            label="Budget" 
            field="budget" 
            options={["low", "medium", "high"]} 
            icon={DollarSign}
          />
          
          <OptionRow 
            label="Days" 
            field="days" 
            options={["2", "3", "5+"]} 
            icon={Calendar}
          />
          
          <OptionRow 
            label="Vibe" 
            field="vibe" 
            options={["chill", "adventure", "party", "explore"]} 
            icon={Sparkles}
          />
          
          <OptionRow 
            label="Food" 
            field="food" 
            options={["veg", "nonveg", "any"]} 
            icon={Coffee}
          />
          
          <OptionRow 
            label="Stay Preference" 
            field="stay" 
            options={["hostel", "hotel", "airbnb"]} 
            icon={Home}
          />
          
          <OptionRow 
            label="Region" 
            field="region" 
            options={["mountains", "beach", "forest", "city"]} 
            icon={Mountain}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={!isFormComplete}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition shadow-lg ${
              isFormComplete
                ? "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white hover:shadow-xl transform hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isFormComplete ? "Continue → Generate Trip Plan" : "Please complete all preferences"}
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {Object.values(form).filter(v => v !== "").length} of 6 preferences selected
          </p>
        </div>
      </div>
    </div>
  );
}