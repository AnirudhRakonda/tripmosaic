import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import Groq from "groq-sdk";
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Check, 
  Lightbulb,
  Loader,
  Wand2
} from "lucide-react";

export default function AIPlan() {
  const { groupId } = useParams();
  const [preferences, setPreferences] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const client = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      const prefsRef = collection(db, "preferences", groupId, "members");
      const snap = await getDocs(prefsRef);
      const data = snap.docs.map((d) => d.data());
      setPreferences(data);
      setLoading(false);
    };
    fetchPrefs();
  }, [groupId]);

  const generatePlans = async () => {
    if (preferences.length === 0) {
      alert("No preferences submitted yet! Ask group members to fill the form.");
      return;
    }

    setGenerating(true);

    const prompt = `
Generate **3** trip itineraries for a group based on these combined preferences:

${JSON.stringify(preferences, null, 2)}

Return **ONLY valid JSON** in this format:

[
  {
    "title": "",
    "location": "",
    "budget": "",
    "days": [
      "Day 1 plan",
      "Day 2 plan",
      "Day 3 plan"
    ],
    "why_fit": ""
  }
]
`;

    try {
      const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are TripMosaic, a travel planning AI expert." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
      });

      const raw = response.choices[0].message.content.trim();
      console.log("RAW AI OUTPUT:", raw);

      let parsed = [];
      try {
        parsed = JSON.parse(raw);
      } catch {
        const match = raw.match(/\[[\s\S]*\]/);
        parsed = match ? JSON.parse(match[0]) : [];
      }

      setPlans(parsed);
    } catch (err) {
      console.error("AI Error:", err);
      alert("AI request failed. Check console.");
    }

    setGenerating(false);
  };

  const selectPlan = async (plan) => {
    await setDoc(doc(db, "itinerary", groupId), {
      plan,
      savedAt: Date.now(),
    });
    alert("✅ Trip plan saved! Next step: Map View.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mb-6 animate-pulse shadow-lg">
            <Wand2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI is planning your trip</h2>
          <p className="text-gray-600">Creating personalized itineraries just for you...</p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-8 mb-8 shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Trip Suggestions</h1>
          <p className="text-gray-600 mb-6">
            Get personalized itineraries based on your group's preferences
          </p>

          <button
            onClick={generatePlans}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Wand2 className="w-5 h-5" />
            Generate Trip Plans
          </button>

          {preferences.length > 0 && (
            <p className="text-sm text-gray-500 mt-4">
              {preferences.length} member{preferences.length !== 1 ? 's' : ''} submitted preferences
            </p>
          )}
        </div>

        {/* Plans Grid */}
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-lg hover:shadow-xl transition flex flex-col"
              >
                {/* Plan Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                      Option {index + 1}
                    </span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                      {plan.budget}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.title}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">{plan.location}</span>
                  </div>
                </div>

                {/* Days Itinerary */}
                <div className="space-y-3 mb-4 flex-grow">
                  {plan.days?.map((day, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Day {i + 1}</p>
                        <p className="text-sm text-gray-600">{day}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Why This Fits */}
                <div className="p-4 bg-amber-50 border border-orange-200 rounded-xl mb-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-orange-700 mb-1">Why this fits</p>
                      <p className="text-sm text-gray-700">{plan.why_fit}</p>
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => selectPlan(plan)}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Choose This Plan
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-orange-200 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No plans generated yet</h3>
            <p className="text-gray-600">
              Click the button above to generate AI-powered trip suggestions
            </p>
          </div>
        )}

      </div>
    </div>
  );
}