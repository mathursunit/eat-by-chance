import React, { useState, useMemo, useEffect } from 'react';
import { restaurants } from './data/restaurants';
import { getRestaurantStatus } from './utils/time';
import { RouletteWheel } from './components/RouletteWheel';
import { RestaurantCard } from './components/RestaurantCard';
import { Filter, RotateCw, MapPin, X, ExternalLink, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const version = "v1.3.4";
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showOnlyOpen, setShowOnlyOpen] = useState(true);
  const [selectedCuisines, setSelectedCuisines] = useState(["All"]);
  const [userLocation, setUserLocation] = useState(null);
  const [maxDistance, setMaxDistance] = useState(10); // Default 10 miles
  const [useIpLocation, setUseIpLocation] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleCuisine = (cuisine) => {
    if (cuisine === "All") {
      setSelectedCuisines(["All"]);
    } else {
      let newSelection = selectedCuisines.filter(c => c !== "All");
      if (newSelection.includes(cuisine)) {
        newSelection = newSelection.filter(c => c !== cuisine);
      } else {
        newSelection = [...newSelection, cuisine];
      }

      if (newSelection.length === 0) newSelection = ["All"];
      setSelectedCuisines(newSelection);
    }
  };

  const selectOnlyCuisine = (e, cuisine) => {
    e.stopPropagation();
    setSelectedCuisines([cuisine]);
    setIsDropdownOpen(false);
  };

  // Attempt IP location on mount
  useEffect(() => {
    // Only fetch if we don't have location yet
    if (!userLocation) {
      // Use ipwho.is for better CORS support
      fetch('https://ipwho.is/')
        .then(res => res.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            // Log the detected IP to helps us debug if it's a proxy
            console.log("Detected IP Info:", data.ip, data.city, data.region);

            // Check if user is in the Syracuse area (approx 43.0, -76.1)
            // If they are far away (e.g. NYC), default to Cicero (13039) for this app
            const lat1 = data.latitude;
            const lon1 = data.longitude;
            const lat2 = 43.0481; // Syracuse
            const lon2 = -76.1474;

            // Haversine formula
            const R = 3959;
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distToSyracuse = R * c;

            if (distToSyracuse > 50) {
              console.log(`User is ${distToSyracuse.toFixed(0)} miles away. Defaulting to Cicero.`);
              setUserLocation({ lat: 43.1678, lng: -76.1158 });
            } else {
              setUserLocation({
                lat: data.latitude,
                lng: data.longitude
              });
            }
            setUseIpLocation(true);
          } else {
            throw new Error("Invalid location data");
          }
        })
        .catch(err => {
          console.error("IP Location failed:", err);
          // Fallback to Cicero (13039) if IP fails (user preference)
          setUserLocation({ lat: 43.1678, lng: -76.1158 });
          setUseIpLocation(true);
        });
    }
  }, []);

  // Get unique cuisines with at least 2 restaurants
  const cuisines = useMemo(() => {
    const cuisineCounts = {};
    restaurants.forEach(r => {
      cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
    });

    const validCuisines = Object.keys(cuisineCounts).filter(c => cuisineCounts[c] >= 2);
    return ["All", ...validCuisines.sort()];
  }, [restaurants]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;

    const R = 3959; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setUseIpLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please check permissions.");
        }
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
  };

  const activeRestaurants = useMemo(() => {
    // console.log("Filtering with:", { showOnlyOpen, selectedCuisines, location: userLocation, maxDistance });
    return restaurants.filter(r => {
      // Filter by Open Status
      if (showOnlyOpen && !getRestaurantStatus(r).isOpen) return false;

      // Filter by Cuisine
      if (!selectedCuisines.includes("All") && !selectedCuisines.includes(r.cuisine)) return false;

      // Filter by Distance (if location known)
      if (userLocation && r.coords.lat) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, r.coords.lat, r.coords.lng);
        if (dist > maxDistance) return false;
        r.distance = dist; // Store for display
      }

      return true;
    });
  }, [showOnlyOpen, selectedCuisines, userLocation, maxDistance]);

  const canSpin = activeRestaurants.length > 0;

  const handleSpinClick = () => {
    if (!canSpin) return;
    setWinner(null);
    setIsSpinning(true);
  };

  const handleSpinComplete = (result) => {
    setIsSpinning(false);
    setTimeout(() => {
      setWinner(result);
    }, 500);
  };

  return (
    <div className="container" style={{ paddingTop: '0' }}>
      <div className="version-badge">{version}</div>
      <header className="mb-4 text-center" style={{ marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #f43f5e, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
          BnB Presents:<br />Eat By Chance
        </h1>
        <p style={{ color: '#94a3b8' }}>Can't decide? Let fate choose your dinner.</p>
      </header>

      {/* FILTERS */}
      <div className="flex flex-col items-center gap-4 mb-4 w-full max-w-2xl bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex flex-wrap justify-center gap-4 w-full">
          {/* Open Now Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnlyOpen}
              onChange={(e) => setShowOnlyOpen(e.target.checked)}
              style={{ accentColor: '#f43f5e', width: '1.2rem', height: '1.2rem' }}
            />
            <span style={{ fontWeight: 600 }}>Open Now</span>
          </label>

          {/* Cuisine Multi-Select Dropdown - Fixed Styles */}
          <div className="dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="dropdown-btn"
            >
              <span>{selectedCuisines.includes("All") ? "All Cuisines" : `${selectedCuisines.length} Selected`}</span>
              <span style={{ fontSize: '0.8rem', marginLeft: '8px' }}>▼</span>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {cuisines.map(c => {
                  const isSelected = selectedCuisines.includes(c);
                  return (
                    <div key={c}
                      className="dropdown-item"
                      onClick={() => toggleCuisine(c)}
                    >
                      <div className="item-left">
                        <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                          {isSelected && "✓"}
                        </div>
                        <span className={`item-text ${isSelected ? 'selected' : ''}`}>{c}</span>
                      </div>
                      {c !== "All" && (
                        <button
                          onClick={(e) => selectOnlyCuisine(e, c)}
                          className="only-btn"
                        >
                          Only
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Overlay to close dropdown */}
          {isDropdownOpen && <div className="overlay" onClick={() => setIsDropdownOpen(false)}></div>}
        </div>

        {/* Location Filters */}
        <div className="flex flex-wrap justify-center items-center gap-4 w-full pt-2 border-t border-slate-700">
          {!userLocation ? (
            <button
              onClick={getUserLocation}
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors text-sm font-bold"
            >
              <Navigation size={16} /> Use My Location for Distance
            </button>
          ) : (
            <div className="flex items-center gap-4 w-full justify-center">
              <div className={`flex items-center gap-2 ${useIpLocation ? 'text-blue-400' : 'text-emerald-400'} text-sm font-bold`}>
                <Navigation size={16} /> {useIpLocation ? 'Approx. Location' : 'Precise Location'}
              </div>
              {useIpLocation && (
                <button onClick={getUserLocation} className="text-xs underline text-slate-500 hover:text-white">
                  Get Precise
                </button>
              )}
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">Max Distance:</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="accent-rose-500"
                />
                <span className="text-sm font-mono w-12">{maxDistance}mi</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <RouletteWheel
          items={activeRestaurants.length > 0 ? activeRestaurants : [{ id: 0, name: "No Options" }]}
          isSpinning={isSpinning}
          onSpinComplete={handleSpinComplete}
        />

        <div className="mb-8">
          <button
            className="btn-primary"
            onClick={handleSpinClick}
            disabled={isSpinning || !canSpin}
            style={{ minWidth: '200px' }}
          >
            {isSpinning ? (
              'Spinning...'
            ) : (
              <>
                <RotateCw size={24} /> SPIN THE WHEEL
              </>
            )}
          </button>
          {!canSpin && (
            <p style={{ color: '#fb7185', marginTop: '1rem', textAlign: 'center' }}>
              No restaurants match your filters.<br />Try loosening them up!
            </p>
          )}
        </div>

        <div className="w-full" style={{ maxWidth: '800px' }}>
          <h2 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
            Candidates ({activeRestaurants.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {activeRestaurants.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* WINNER MODAL */}
      <AnimatePresence>
        {winner && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWinner(null)}
          >
            <div
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Fate has chosen:</h2>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f43f5e', lineHeight: 1.1 }}>
                  {winner.name}
                </h1>
              </div>

              <p style={{ marginBottom: '2rem', color: '#cbd5e1' }}>
                {winner.description}
              </p>

              {winner.distance && (
                <p style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {winner.distance.toFixed(1)} miles away
                </p>
              )}

              <div className="flex flex-col gap-2">
                <a
                  href={winner.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  Get Directions
                </a>
                <button
                  className="btn-primary"
                  style={{ background: '#334155', boxShadow: 'none' }}
                  onClick={() => setWinner(null)}
                >
                  Spin Again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="w-full text-center py-8 text-slate-600 text-sm">
        <p>&copy; 2024 BnB Eat By Chance. All rights reserved.</p>
        <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p>Debug Info:</p>
          <p>Location: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Unknown'} ({useIpLocation ? "IP" : "GPS"})</p>
          <p>Distance Filter: {maxDistance} mi</p>
          <p>Active Candidates: {activeRestaurants.length} / {restaurants.length}</p>
          <p className="text-xs text-slate-500 mt-1">If location is wrong, use the "Precise Location" toggle above.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
