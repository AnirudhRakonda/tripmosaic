import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadScript, GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { geocodePlace } from "../utils/geocodePlace";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { MapPin, Navigation, Loader, AlertCircle } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

export default function TripMap() {
  const { groupId } = useParams();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [coords, setCoords] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // Fetch saved itinerary
        if (groupId) {
          const itineraryDoc = await getDoc(doc(db, "itinerary", groupId));
          if (itineraryDoc.exists()) {
            const data = itineraryDoc.data();
            setItinerary(data.plan);
            
            // Geocode the location
            if (data.plan?.location) {
              const location = await geocodePlace(data.plan.location, apiKey);
              setCoords(location);
            }
          }
        } else {
          // Fallback for testing
          const place = "Baga Beach Goa";
          const location = await geocodePlace(place, apiKey);
          setCoords(location);
        }
      } catch (err) {
        console.error("Error loading map:", err);
        setError("Failed to load map. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [groupId, apiKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center p-6">
        <div className="bg-white border-2 border-red-200 rounded-3xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Map</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Trip Route</h1>
                {itinerary && (
                  <p className="text-gray-600">{itinerary.location}</p>
                )}
              </div>
            </div>
            {coords && (
              <div className="flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-xl">
                <Navigation className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">
                  {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl overflow-hidden shadow-2xl" style={{ height: "70vh" }}>
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={coords ? 12 : 5}
              center={coords || { lat: 20.5937, lng: 78.9629 }}
              options={{
                styles: mapStyles,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
              }}
            >
              {coords && (
                <Marker 
                  position={coords}
                  icon={{
                    path: window.google?.maps?.SymbolPath?.CIRCLE,
                    fillColor: "#FF6B6B",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 3,
                    scale: 12,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Itinerary Info */}
        {itinerary && (
          <div className="mt-6 bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{itinerary.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50 border border-orange-200 rounded-xl">
                <p className="text-sm font-semibold text-orange-700 mb-1">Location</p>
                <p className="text-gray-800">{itinerary.location}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-orange-200 rounded-xl">
                <p className="text-sm font-semibold text-orange-700 mb-1">Budget</p>
                <p className="text-gray-800">{itinerary.budget}</p>
              </div>
            </div>
            
            {itinerary.days && itinerary.days.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Itinerary</h3>
                <div className="space-y-2">
                  {itinerary.days.map((day, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl">
                      <span className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 text-sm">{day}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}