import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { MapPin, Navigation, Calendar, DollarSign, Loader, Route } from "lucide-react";

const mapContainerStyle = { width: "100%", height: "100%" };

const customMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#FFF8E7" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#2B2D42" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", stylers: [{ color: "#00B4D8" }] },
  { featureType: "road", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", stylers: [{ color: "#FF9F1C" }] },
  { featureType: "poi.park", stylers: [{ color: "#06D6A0" }] }
];

export default function MapsView() {
  const { groupId } = useParams();
  const [plan, setPlan] = useState(null);
  const [coordsList, setCoordsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlan = async () => {
      try {
        const snap = await getDoc(doc(db, "itinerary", groupId));
        if (snap.exists()) setPlan(snap.data().plan);
      } catch (error) {
        console.error("Error fetching plan:", error);
      }
    };
    getPlan();
  }, [groupId]);

  useEffect(() => {
    if (!plan) return;

    const fetchCoordinates = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const newCoords = [];

      for (const day of plan.days) {
        const firstLocation = day.split("→")[0].trim();
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(firstLocation)}&key=${apiKey}`;

        try {
          const res = await fetch(url);
          const data = await res.json();

          if (data.results?.[0]) {
            newCoords.push(data.results[0].geometry.location);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      }

      setCoordsList(newCoords);
      setLoading(false);
    };

    fetchCoordinates();
  }, [plan]);

  if (loading || !plan || coordsList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mb-6 animate-pulse shadow-lg">
            <Navigation className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Mapping your trip</h2>
          <p className="text-gray-600">Plotting your adventure on the map...</p>
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
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Card */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Route className="w-7 h-7 text-white" />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-800">{plan.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{plan.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-teal-500" />
                  <span>{plan.budget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-red-400" />
                  <span>{plan.days?.length || 0} days</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-teal-100 text-teal-700 rounded-xl font-medium text-sm">
              {coordsList.length} Stops
            </div>
          </div>
        </div>

        {/* Map Card */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl overflow-hidden shadow-2xl" style={{ height: "70vh" }}>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={7}
              center={coordsList[0]}
              options={{ 
                styles: customMapStyle,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
              }}
            >
              {coordsList.map((pos, index) => (
                <Marker 
                  key={index} 
                  position={pos}
                  label={{
                    text: `${index + 1}`,
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}
                  icon={{
                    path: window.google?.maps?.SymbolPath?.CIRCLE,
                    fillColor: index === 0 ? "#06D6A0" : index === coordsList.length - 1 ? "#FF6B6B" : "#FF9F1C",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 3,
                    scale: 15,
                  }}
                />
              ))}

              <Polyline
                path={coordsList}
                options={{ 
                  strokeColor: "#FF6B6B", 
                  strokeWeight: 4,
                  strokeOpacity: 0.8,
                }}
              />
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Day-by-Day Route Card */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-500" />
            Route Details
          </h2>
          <div className="space-y-3">
            {plan.days?.map((day, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-orange-700 mb-1">Day {index + 1}</p>
                  <p className="text-gray-700">{day}</p>
                  {coordsList[index] && (
                    <p className="text-xs text-gray-500 mt-2">
                      📍 {coordsList[index].lat.toFixed(4)}, {coordsList[index].lng.toFixed(4)}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 flex items-center">
                  {index === 0 && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Start</span>
                  )}
                  {index === plan.days.length - 1 && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">End</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 shadow-lg">
          <p className="text-sm font-semibold text-gray-700 mb-3">Map Legend</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-white"></div>
              <span className="text-gray-600">Starting Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-400 border-2 border-white"></div>
              <span className="text-gray-600">Stops Along Route</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400 border-2 border-white"></div>
              <span className="text-gray-600">Final Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-red-400"></div>
              <span className="text-gray-600">Travel Route</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}