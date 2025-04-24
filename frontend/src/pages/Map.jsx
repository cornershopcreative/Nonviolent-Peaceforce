import React, { useState } from "react";
import MapComponent from "../components/Map.jsx";

const Map = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationData, setLocationData] = useState(null);

  const handleLocationSelect = (location, data) => {
    setSelectedLocation(location);
    setLocationData(data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f0ff]">
      {/* Top Section / Hero */}
      <section className="bg-indigo-950 text-white p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Resource Map</h1>
        <h2 className="text-2xl">Find Nonviolent Resources Near You</h2>
      </section>

      {/* Main Content Section */}
      <section className="flex-grow p-6 bg-gradient-to-b from-[#f8f0ff] to-[#f0e6ff]">
        <div className="max-w-7xl mx-auto bg-white/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20"
          style={{ height: "calc(100vh - 250px)", minHeight: "600px" }}>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            height="100%"
          />
        </div>
      </section>
    </div>
  );
};

export default Map;
