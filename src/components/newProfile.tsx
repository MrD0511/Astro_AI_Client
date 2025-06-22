import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../db'; // adjust import if needed
import NavBar from './navBar';

// Fix leaflet icon path issues
// ts-expect-error: _getIconUrl is a private property not typed in leaflet

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ onSelect }: { onSelect: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function NewProfile() {
  const [formData, setFormData] = useState({ name: '', dob: '', tob: '' });
  const [errors, setErrors] = useState<any>({});
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [placeName, setPlaceName] = useState("unknown");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ display_name: string; lat: number; lon: number }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.state ||
        data.display_name;
      return city;
    } catch {
      return `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const searchPlaces = async (query: string) => {
    if (!query.trim()) return setSearchResults([]);
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await res.json();
      const results = data.map((item: any) => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchPlaces(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.tob) newErrors.tob = "Time of Birth is required";
    if (!position) newErrors.location = "Please select a location";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const [lat, lon] = position!;
    const dateTimeStr = `${formData.dob}T${formData.tob}`;
    const birthDateTime = new Date(dateTimeStr);

    const birthDetailForApi = {
      name: formData.name,
      birthDateTime,
      birthPlace: placeName,
      latitude: lat,
      longitude: lon,
    };

    try {
      const res = await fetch("http://localhost:8000/start_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthDetailForApi),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const sessionData = await res.json();
      if (!sessionData.session_id) throw new Error("Session ID not found");

      const birthDetail = {
        ...birthDetailForApi,
        session_id: sessionData.session_id,
      };

      await db.BirthDetails.add(birthDetail);
      navigate("/profiles");
    } catch (err) {
      alert("Failed to submit profile: " + err);
      console.error(err);
    }
  };

  const handlePlaceSelect = async (place: any) => {
    const coords: [number, number] = [place.lat, place.lon];
    const name = await reverseGeocode(place.lat, place.lon);
    setPosition(coords);
    setPlaceName(name);
    setSearchQuery(place.display_name);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-black text-white">
      <NavBar />
      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-bold text-4xl mb-2">Create Your Cosmic Profile</h1>
            <p className="text-gray-400">
              Enter your precise birth details to unlock personalized astrological insights.
            </p>
          </div>

          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded-xl p-8 shadow-2xl space-y-8">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex gap-2 font-semibold text-lg items-center">
                <User size={18} /> Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white placeholder-gray-400"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            </div>

            {/* DOB & TOB */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex gap-2 font-semibold text-lg items-center">
                  <Calendar size={18} /> Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white"
                />
                {errors.dob && <p className="text-red-400 text-sm">{errors.dob}</p>}
              </div>
              <div className="space-y-2">
                <label className="flex gap-2 font-semibold text-lg items-center">
                  <Clock size={18} /> Time of Birth
                </label>
                <input
                  type="time"
                  value={formData.tob}
                  onChange={(e) => handleInputChange("tob", e.target.value)}
                  className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white"
                />
                {errors.tob && <p className="text-red-400 text-sm">{errors.tob}</p>}
              </div>
            </div>

            {/* Location Search */}
            <div className="space-y-4">
              <label className="flex gap-2 font-semibold text-lg items-center">
                <MapPin size={18} /> Place of Birth
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search or click on map"
                  className="w-full bg-black border border-gray-700 p-3 pl-10 rounded-lg text-white placeholder-gray-400"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="bg-gray-800 rounded-md overflow-hidden border border-gray-700">
                  {searchResults.map((place, i) => (
                    <div
                      key={i}
                      className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                      onClick={() => handlePlaceSelect(place)}
                    >
                      {place.display_name}
                    </div>
                  ))}
                </div>
              )}
              {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}
            </div>

            {/* Map */}
            <MapContainer
              center={position || [20.5937, 78.9629]}
              zoom={5}
              scrollWheelZoom={true}
              className="h-96 w-full rounded-lg border border-gray-700"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {position && <Marker position={position} />}
              <LocationMarker
                onSelect={async (coords) => {
                  setPosition(coords);
                  const name = await reverseGeocode(coords[0], coords[1]);
                  setSearchQuery(name);
                  setPlaceName(name);
                }}
              />
            </MapContainer>

            {/* Location Info */}
            {position && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm">
                <p className="text-green-400 font-semibold">Selected Location:</p>
                <p className="text-white">{placeName}</p>
                <p className="text-gray-400 mt-1">
                  Coordinates: {position[0].toFixed(4)}°, {position[1].toFixed(4)}°
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-black hover:text-white border border-white hover:border-gray-300 transition duration-300"
            >
              Create Your Cosmic Profile
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-black border border-gray-700 rounded-lg p-6 text-center hover:border-white transition-colors duration-300">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-white font-semibold mb-2">Precision Matters</h3>
              <p className="text-gray-400 text-sm">Exact birth time and location ensure accurate cosmic calculations</p>
            </div>
            
            <div className="bg-black border border-gray-700 rounded-lg p-6 text-center hover:border-white transition-colors duration-300">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-white font-semibold mb-2">Annonymous & Private</h3>
              <p className="text-gray-400 text-sm">Your personal information is not stored in the database</p>
            </div>
            
            <div className="bg-black border border-gray-700 rounded-lg p-6 text-center hover:border-white transition-colors duration-300">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="text-white font-semibold mb-2">Instant Insights</h3>
              <p className="text-gray-400 text-sm">Receive your personalized reading immediately after creation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
