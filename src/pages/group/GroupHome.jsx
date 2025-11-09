import { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { 
  Users, 
  Share2, 
  Edit, 
  Sparkles, 
  Map, 
  DollarSign, 
  ArrowRight,
  Check,
  Copy
} from "lucide-react";

export default function Grouphome() {
  const { user } = useContext(AuthContext);
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [copied, setCopied] = useState(false);

  // Build invite link using current domain
  const inviteLink = `${window.location.origin}/group/${groupId}`;

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const loadGroup = async () => {
      const ref = doc(db, "groups", groupId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setGroup(data);

        // Auto join user if not already in group
        if (!data.members.includes(user.uid)) {
          await updateDoc(ref, { members: arrayUnion(user.uid) });
        }
      }
    };

    loadGroup();
  }, [groupId, user.uid]);

  if (!group) 
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Group...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Card */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Trip Group
                </h1>
                <p className="text-gray-500">ID: {groupId}</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              {group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>

          {/* Invite Link Button */}
          <button
            onClick={copyInviteLink}
            className={`w-full py-3 rounded-xl font-medium transition flex items-center justify-center gap-3 ${
              copied
                ? "bg-green-100 text-green-700 border-2 border-green-300"
                : "bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share Invite Link
              </>
            )}
          </button>
        </div>

        {/* Members Card */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">Group Members</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.members.map((m, index) => (
              <div 
                key={m}
                className="flex items-center gap-3 p-3 bg-amber-50 border border-orange-200 rounded-xl"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-700 font-medium truncate">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Trip Preferences */}
          <Link 
            to={`/group/${groupId}/form`} 
            className="bg-white border-2 border-orange-100 rounded-2xl p-6 hover:border-orange-300 hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition">
                <Edit className="w-6 h-6 text-orange-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Trip Preferences</h3>
            <p className="text-gray-600 text-sm">Fill out your travel preferences and vibe</p>
          </Link>

          {/* AI Suggestions */}
          <Link 
            to={`/group/${groupId}/plan`} 
            className="bg-white border-2 border-orange-100 rounded-2xl p-6 hover:border-orange-300 hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Trip Suggestions</h3>
            <p className="text-gray-600 text-sm">Get personalized recommendations powered by AI</p>
          </Link>

          {/* Trip Route */}
          <Link 
            to={`/group/${groupId}/map`} 
            className="bg-white border-2 border-orange-100 rounded-2xl p-6 hover:border-orange-300 hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition">
                <Map className="w-6 h-6 text-teal-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">View Trip Route</h3>
            <p className="text-gray-600 text-sm">Explore your journey on an interactive map</p>
          </Link>

          {/* Expense Tracker */}
          <Link 
            to={`/group/${groupId}/expenses`} 
            className="bg-white border-2 border-orange-100 rounded-2xl p-6 hover:border-orange-300 hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Expense Tracker</h3>
            <p className="text-gray-600 text-sm">Track and split costs with your group</p>
          </Link>

        </div>

      </div>
    </div>
  );
}