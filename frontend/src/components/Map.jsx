import React, { useState, useEffect } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker
} from "react-simple-maps";
import geoData from "../political_violence_partnerships.json";

// US map projection
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapComponent = ({ onLocationSelect, height = "600px" }) => {
	const [markers, setMarkers] = useState([]);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [locationData, setLocationData] = useState(null);

	useEffect(() => {
		// Process the JSON data to extract locations and create markers
		const processData = () => {
			const locationMarkers = [];

			// Extract locations from the JSON data
			Object.entries(geoData).forEach(([location, organizations]) => {
				if (location && organizations.length > 0) {
					// For now, we'll use a placeholder for coordinates
					// In a real implementation, you would use a geocoding service to get actual coordinates
					const coordinates = getCoordinatesForLocation(location);

					if (coordinates) {
						locationMarkers.push({
							name: location,
							coordinates: coordinates,
							organizations: organizations
						});
					}
				}
			});

			setMarkers(locationMarkers);
		};

		processData();
	}, []);

	// This is a placeholder function - in a real implementation, you would use a geocoding service
	const getCoordinatesForLocation = (location) => {
		// Hardcoded coordinates for major US cities
		const cityCoordinates = {
			"San Diego": [-117.1611, 32.7157],
			"Los Angeles": [-118.2437, 34.0522],
			"San Francisco": [-122.4194, 37.7749],
			"New York": [-74.0060, 40.7128],
			"Chicago": [-87.6298, 41.8781],
			"Houston": [-95.3698, 29.7604],
			"Phoenix": [-112.0740, 33.4484],
			"Philadelphia": [-75.1652, 39.9526],
			"San Antonio": [-98.4936, 29.4241],
			"Dallas": [-96.7970, 32.7767],
			"Austin": [-97.7431, 30.2672],
			"Seattle": [-122.3321, 47.6062],
			"Denver": [-104.9903, 39.7392],
			"Boston": [-71.0589, 42.3601],
			"Washington": [-77.0369, 38.9072],
			"Nashville": [-86.7816, 36.1627],
			"Portland": [-122.6765, 45.5155],
			"Miami": [-80.1918, 25.7617],
			"Atlanta": [-84.3880, 33.7490],
			"Minneapolis": [-93.2650, 44.9778]
		};

		return cityCoordinates[location] || null;
	};

	const handleMarkerClick = (marker) => {
		setSelectedLocation(marker.name);
		setLocationData(marker.organizations);

		if (onLocationSelect) {
			onLocationSelect(marker.name, marker.organizations);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-4 relative" style={{ height }}>
			<ComposableMap
				projection="geoAlbersUsa"
				projectionConfig={{
					scale: 1000
				}}
			>
				<Geographies geography={geoUrl}>
					{({ geographies }) =>
						geographies.map((geo) => (
							<Geography
								key={geo.rsmKey}
								geography={geo}
								fill="#EAEAEC"
								stroke="#D6D6DA"
								style={{
									default: {
										outline: "none"
									},
									hover: {
										fill: "#F53",
										outline: "none"
									},
									pressed: {
										outline: "none"
									}
								}}
							/>
						))
					}
				</Geographies>

				{markers.map(({ name, coordinates }) => (
					<Marker
						key={name}
						coordinates={coordinates}
						onClick={() => handleMarkerClick({ name, coordinates })}
					>
						<circle r={8} fill="#F53" stroke="#fff" strokeWidth={2} />
					</Marker>
				))}
			</ComposableMap>

			{selectedLocation && locationData && (
				<div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md max-h-[500px] overflow-y-auto">
					<h3 className="text-xl font-bold mb-2">{selectedLocation}</h3>
					<div className="space-y-4">
						{locationData.map((org, index) => (
							<div key={index} className="border-b pb-2">
								<h4 className="font-semibold">{org["Organization Name "] || "Unnamed Organization"}</h4>
								{org["Website URL"] && (
									<a
										href={org["Website URL"]}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline"
									>
										Website
									</a>
								)}
								{org["Description of Resources"] && (
									<p className="text-sm mt-1">{org["Description of Resources"]}</p>
								)}
								{org["Category of Resources "] && (
									<p className="text-sm text-gray-600">Category: {org["Category of Resources "]}</p>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default MapComponent;
