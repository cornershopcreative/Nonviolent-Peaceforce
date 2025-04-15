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
		<div className="flex flex-col min-h-screen">
			{/* Top Section / Hero */}
			<section className="bg-indigo-950 text-white p-8 flex flex-col items-center">
				<h1 className="text-4xl font-bold mb-2">Resource Map</h1>
				<h2 className="text-2xl">Find Nonviolent Resources Near You</h2>
			</section>

			{/* Main Content Section */}
			<section className="bg-indigo-950 py-12 px-4 flex-grow">
				<div className="max-w-6xl mx-auto">
					<MapComponent
						onLocationSelect={handleLocationSelect}
						height="600px"
					/>
				</div>
			</section>
		</div>
	);
};

export default Map;
