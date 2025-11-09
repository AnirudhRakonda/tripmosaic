import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db, auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Plane, Plus, Users, LogOut, Map, Calendar } from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const q = query(collection(db, "groups"), where("members", "array-contains", user.uid));
        const snap = await getDocs(q);
        setGroups(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user.uid]);

  const createGroup = async () => {
    try {
      const groupId = uuidv4().slice(0, 8);
      await setDoc(doc(db, "groups", groupId), {
        createdBy: user.uid,
        members: [user.uid],
        createdAt: Date.now(),
      });
      navigate(`/group/${groupId}`);
    } catch (error) {
      console.log("Error creating group:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Plane className="w-8 h-8 text-white transform -rotate-45" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Your Trips</h1>
                <p className="text-gray-600">Plan, collaborate, and explore together</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 transition rounded-xl hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Create New Trip Button */}
        <button
          onClick={createGroup}
          className="w-full mb-8 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white font-semibold rounded-2xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
        >
          <Plus className="w-6 h-6" />
          Create New Trip Group
        </button>

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Loading your trips...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map(g => (
              <div
                key={g.id}
                onClick={() => navigate(`/group/${g.id}`)}
                className="bg-white border-2 border-orange-100 rounded-2xl p-6 hover:border-orange-300 hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                    <Map className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                    Trip #{g.id}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition">
                  Trip Group: {g.id}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-500" />
                    <span>{g.members.length} {g.members.length === 1 ? 'Member' : 'Members'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span>{new Date(g.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-teal-600 font-medium text-sm group-hover:text-teal-700 transition">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && groups.length === 0 && (
          <div className="bg-white border-2 border-dashed border-orange-200 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-10 h-10 text-orange-500 transform -rotate-45" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No trips yet!</h3>
            <p className="text-gray-600 mb-6">
              Create your first trip group and start planning an amazing adventure with friends
            </p>
            <button
              onClick={createGroup}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white font-semibold rounded-xl transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Your First Trip
            </button>
          </div>
        )}

      </div>
    </div>
  );
}