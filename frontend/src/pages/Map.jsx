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
    <div className="flex flex-col min-h-screen bg-indigo-950">
      {/* Top Section / Hero */}
      <section className="bg-indigo-950 text-white p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Resource Map</h1>
        <h2 className="text-2xl">Find Support Near You</h2>
      </section>

      {/* Main Content Section */}
      <section className="flex-grow p-6">
        <div
          className="bg-white rounded-lg shadow-xl overflow-hidden"
          style={{ height: "calc(100vh - 250px)", minHeight: "600px" }}
        >
          <MapComponent onLocationSelect={handleLocationSelect} height="100%" />
        </div>
      </section>
    </div>
  );
};

export default Map;
