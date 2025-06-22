import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import NavBar from './navBar';

// Fix leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function NewProfile() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [placeName, setPlaceName] = useState("unknown");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({ name: "", dob: "", tob: "" });
  const [errors, setErrors] = useState({});

  const handleNavigation = (path: string) => {
    console.log(`Navigate to: ${path}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.tob) newErrors.tob = "Time of Birth is required";
    if (!position) newErrors.location = "Please select a location on the map or search";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await res.json();
      return data?.display_name || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (e) {
      return `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    console.log("Profile data:", { ...formData, position, placeName });
    alert("Profile created successfully!");
    handleNavigation("/dashboard");
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
    } catch (e) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) searchPlaces(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handlePlaceSelect = async (place: any) => {
    setPosition([place.lat, place.lon]);
    setSearchQuery(place.display_name);
    setSearchResults([]);
    const name = await reverseGeocode(place.lat, place.lon);
    setPlaceName(name);
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
            {/* Name */}
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
                  placeholder="Search for your birth city or click on the map"
                  className="w-full bg-black border border-gray-700 p-3 pl-10 rounded-lg text-white placeholder-gray-400"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </div>
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Search Results */}
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
                  setSearchQuery(await reverseGeocode(coords[0], coords[1]));
                  setPlaceName(await reverseGeocode(coords[0], coords[1]));
                }}
              />
            </MapContainer>
            {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}

            {/* Location Preview */}
            {position && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm">
                <p className="text-green-400 font-semibold">Selected Location:</p>
                <p className="text-white">{placeName}</p>
                <p className="text-gray-400 mt-1">
                  Coordinates: {position[0].toFixed(4)}°, {position[1].toFixed(4)}°
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-black hover:text-white border border-white hover:border-gray-300 transition duration-300"
            >
              Create Your Cosmic Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
