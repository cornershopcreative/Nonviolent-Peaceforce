import React, { useState, useEffect, useMemo, useRef } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
	ZoomableGroup,
} from "react-simple-maps";
import { getResources } from "../services/resourceService";

// US map projection
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Define marker colors for each location
const LOCATION_COLORS = {
	"San Diego": "#4F46E5", // Indigo-600
	"New York": "#EC4899", // Pink-500
	"Minneapolis": "#8B5CF6", // Violet-500
	"default": "#6B7280" // Gray-500
};

// Helper function to determine marker color based on location
const getMarkerColor = (location) => {
	return LOCATION_COLORS[location] || LOCATION_COLORS.default;
};

// Extract all unique categories from the data
const getAllCategories = (data) => {
	const categories = new Set();
	Object.values(data).forEach(organizations => {
		organizations.forEach(org => {
			if (org["Category of Resources "]) {
				categories.add(org["Category of Resources "]);
			}
		});
	});
	return Array.from(categories).sort();
};

const DetailModal = ({ organization, onClose }) => {
	if (!organization) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
			<div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<h2 className="text-2xl font-bold text-indigo-900">
							{organization["Organization Name "] || "Unnamed Organization"}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
						>
							×
						</button>
					</div>

					<div className="space-y-4">
						{organization["Website URL"] && (
							<div>
								<h3 className="text-sm font-semibold text-gray-600 mb-1">Website</h3>
								<a
									href={organization["Website URL"]}
									target="_blank"
									rel="noopener noreferrer"
									className="text-pink-600 hover:text-pink-700 underline"
								>
									{organization["Website URL"]}
								</a>
							</div>
						)}

						{organization["Description of Resources"] && (
							<div>
								<h3 className="text-sm font-semibold text-gray-600 mb-1">Description</h3>
								<p className="text-gray-800">
									{organization["Description of Resources"]}
								</p>
							</div>
						)}

						{organization["Category of Resources "] && (
							<div>
								<h3 className="text-sm font-semibold text-gray-600 mb-1">Category</h3>
								<p className="text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded">
									{organization["Category of Resources "]}
								</p>
							</div>
						)}

						{organization["Contact Info"] && (
							<div>
								<h3 className="text-sm font-semibold text-gray-600 mb-1">Contact Information</h3>
								<p className="text-gray-800">{organization["Contact Info"]}</p>
							</div>
						)}

						{organization["Location (links for mult. locations)"] && (
							<div>
								<h3 className="text-sm font-semibold text-gray-600 mb-1">Location</h3>
								<p className="text-gray-800">{organization["Location (links for mult. locations)"]}</p>
							</div>
						)}

						{organization["Other Tags"] && (
							<div>
								<h3 className="text-sm font-semibold text-gray-600 mb-1">Tags</h3>
								<div className="flex flex-wrap gap-2">
									{organization["Other Tags"].split(',').map((tag, index) => (
										<span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
											{tag.trim()}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const MapComponent = ({ onLocationSelect, height = "600px" }) => {
	const [markers, setMarkers] = useState([]);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [locationData, setLocationData] = useState(null);
	const [selectedOrganization, setSelectedOrganization] = useState(null);

	// Filter input states
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedLocations, setSelectedLocations] = useState([]);

	// Applied filter states (these are the ones that actually filter the data)
	const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
	const [appliedCategories, setAppliedCategories] = useState([]);
	const [appliedLocations, setAppliedLocations] = useState([]);

	const [allCategories, setAllCategories] = useState([]);
	const [allLocations, setAllLocations] = useState([]);
	const [filteredMarkers, setFilteredMarkers] = useState([]);
	const [showResults, setShowResults] = useState(true);

	const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
	const [isLocationsOpen, setIsLocationsOpen] = useState(false);

	// Add refs for the dropdown containers
	const categoriesRef = useRef(null);
	const locationsRef = useRef(null);

	// Handle click outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
				setIsCategoriesOpen(false);
			}
			if (locationsRef.current && !locationsRef.current.contains(event.target)) {
				setIsLocationsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		// Process the JSON data to extract locations and create markers
		const processData = () => {
			const locationMarkers = [];
			const locations = new Set();

			// Extract locations from the JSON data
			Object.entries(geoData).forEach(([location, organizations]) => {
				if (location && organizations.length > 0) {
					const coordinates = getCoordinatesForLocation(location);

					if (coordinates) {
						locationMarkers.push({
							name: location,
							coordinates: coordinates,
							organizations: organizations,
							color: getMarkerColor(location),
						});
						locations.add(location);
					}
				}
			});

			setMarkers(locationMarkers);
			setFilteredMarkers(locationMarkers);
			setAllLocations(Array.from(locations).sort());

			// Extract all unique categories
			setAllCategories(getAllCategories(geoData));
		};

		processData();
	}, []);

	// Filter markers based on applied filters
	useEffect(() => {
		const filtered = markers.filter(marker => {
			// Filter by location
			if (appliedLocations.length > 0 && !appliedLocations.includes(marker.name)) {
				return false;
			}

			// Filter by search term
			const matchesSearch = appliedSearchTerm === "" ||
				marker.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
				marker.organizations.some(org =>
					org["Organization Name "]?.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
					org["Description of Resources"]?.toLowerCase().includes(appliedSearchTerm.toLowerCase())
				);

			// Filter by category
			const matchesCategory = appliedCategories.length === 0 ||
				marker.organizations.some(org => appliedCategories.includes(org["Category of Resources "]));

			return matchesSearch && matchesCategory;
		});

		setFilteredMarkers(filtered);
	}, [markers, appliedSearchTerm, appliedCategories, appliedLocations]);

	// Calculate total organizations that match the current filters
	const totalFilteredOrganizations = useMemo(() => {
		return filteredMarkers.reduce((total, marker) => {
			// If there's a search term, count only organizations that match it
			if (appliedSearchTerm) {
				return total + marker.organizations.filter(org =>
					org["Organization Name "]?.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
					org["Description of Resources"]?.toLowerCase().includes(appliedSearchTerm.toLowerCase())
				).length;
			}
			// If there's a category filter, count only organizations in that category
			if (appliedCategories.length > 0) {
				return total + marker.organizations.filter(org =>
					appliedCategories.includes(org["Category of Resources "])
				).length;
			}
			// If no filters, count all organizations
			return total + marker.organizations.length;
		}, 0);
	}, [filteredMarkers, appliedSearchTerm, appliedCategories]);

	// Get all organizations that match the current filters
	const filteredOrganizations = useMemo(() => {
		const organizations = [];

		filteredMarkers.forEach(marker => {
			marker.organizations.forEach(org => {
				// If there's a search term, only include organizations that match it
				if (appliedSearchTerm) {
					const matchesSearch =
						org["Organization Name "]?.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
						org["Description of Resources"]?.toLowerCase().includes(appliedSearchTerm.toLowerCase());

					if (!matchesSearch) return;
				}

				// If there's a category filter, only include organizations in that category
				if (appliedCategories.length > 0 && !appliedCategories.includes(org["Category of Resources "])) {
					return;
				}

				// Add the organization with its location
				organizations.push({
					...org,
					location: marker.name
				});
			});
		});

		return organizations;
	}, [filteredMarkers, appliedSearchTerm, appliedCategories]);

	// This is a placeholder function - in a real implementation, you would use a geocoding service
	const getCoordinatesForLocation = (location) => {
		// Hardcoded coordinates for major US cities
		const cityCoordinates = {
			"San Diego": [-117.1611, 32.7157],
			"Los Angeles": [-118.2437, 34.0522],
			"San Francisco": [-122.4194, 37.7749],
			"New York": [-74.006, 40.7128],
			Chicago: [-87.6298, 41.8781],
			Houston: [-95.3698, 29.7604],
			Phoenix: [-112.074, 33.4484],
			Philadelphia: [-75.1652, 39.9526],
			"San Antonio": [-98.4936, 29.4241],
			Dallas: [-96.797, 32.7767],
			Austin: [-97.7431, 30.2672],
			Seattle: [-122.3321, 47.6062],
			Denver: [-104.9903, 39.7392],
			Boston: [-71.0589, 42.3601],
			Washington: [-77.0369, 38.9072],
			Nashville: [-86.7816, 36.1627],
			Portland: [-122.6765, 45.5155],
			Miami: [-80.1918, 25.7617],
			Atlanta: [-84.388, 33.749],
			Minneapolis: [-93.265, 44.9778],
		};

		return cityCoordinates[location] || null;
	};

	const handleMapClick = (e) => {
		// Close the card when clicking anywhere on the map
		setSelectedLocation(null);
		setLocationData(null);
	};

	const handleMarkerClick = (marker, e) => {
		e.stopPropagation(); // Prevent the map click from firing
		setSelectedLocation(marker.name);
		setLocationData(marker.organizations);

		if (onLocationSelect) {
			onLocationSelect(marker.name, marker.organizations);
		}
	};

	const handleViewDetails = (organization, e) => {
		e.stopPropagation();
		setSelectedOrganization(organization);
	};

	// Update search term and apply filter immediately
	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		setAppliedSearchTerm(value);
	};

	// Toggle category selection
	const toggleCategory = (category) => {
		setSelectedCategories(prev => {
			if (prev.includes(category)) {
				return prev.filter(c => c !== category);
			} else {
				return [...prev, category];
			}
		});

		setAppliedCategories(prev => {
			if (prev.includes(category)) {
				return prev.filter(c => c !== category);
			} else {
				return [...prev, category];
			}
		});
	};

	// Toggle location selection
	const toggleLocation = (location) => {
		setSelectedLocations(prev => {
			if (prev.includes(location)) {
				return prev.filter(l => l !== location);
			} else {
				return [...prev, location];
			}
		});

		setAppliedLocations(prev => {
			if (prev.includes(location)) {
				return prev.filter(l => l !== location);
			} else {
				return [...prev, location];
			}
		});
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchTerm("");
		setSelectedCategories([]);
		setSelectedLocations([]);
		setAppliedSearchTerm("");
		setAppliedCategories([]);
		setAppliedLocations([]);
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col md:flex-row gap-4 h-full">
				{/* Search, Filter, and Results Panel */}
				<div className="w-full md:w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
					<div className="p-2 border-b border-gray-200 flex-shrink-0">
						<div className="flex justify-between items-center mb-1">
							<h3 className="text-xs font-semibold text-gray-700">Search & Filter</h3>
							<div className="text-xs text-gray-500">
								{totalFilteredOrganizations} organization{totalFilteredOrganizations !== 1 ? 's' : ''}
							</div>
						</div>

						<div className="mb-1">
							<input
								type="text"
								placeholder="Search organizations..."
								className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
								value={searchTerm}
								onChange={handleSearchChange}
							/>
						</div>

						<div className="mb-1">
							<div className="flex justify-between items-center mb-0.5">
								<label className="text-xs text-gray-600">Categories</label>
								<button
									className="text-xs text-indigo-600 hover:text-indigo-800"
									onClick={clearFilters}
								>
									Clear
								</button>
							</div>
							<div className="relative" ref={categoriesRef}>
								<button
									onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
									className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-left flex justify-between items-center"
								>
									<span className="text-gray-500">
										{selectedCategories.length === 0
											? "Select categories..."
											: `${selectedCategories.length} categor${selectedCategories.length !== 1 ? 'ies' : 'y'}`}
									</span>
									<span className="text-gray-400">▼</span>
								</button>
								{isCategoriesOpen && (
									<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
										<div className="p-1">
											{allCategories.map(category => (
												<label key={category} className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer">
													<input
														type="checkbox"
														checked={selectedCategories.includes(category)}
														onChange={() => {
															const newCategories = selectedCategories.includes(category)
																? selectedCategories.filter(c => c !== category)
																: [...selectedCategories, category];
															setSelectedCategories(newCategories);
															setAppliedCategories(newCategories);
														}}
														className="mr-2 text-indigo-600 rounded"
													/>
													<span className="text-xs text-gray-700">{category}</span>
												</label>
											))}
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="mb-1">
							<div className="flex justify-between items-center mb-0.5">
								<label className="text-xs text-gray-600">Locations</label>
							</div>
							<div className="relative" ref={locationsRef}>
								<button
									onClick={() => setIsLocationsOpen(!isLocationsOpen)}
									className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white text-left flex justify-between items-center"
								>
									<span className="text-gray-500">
										{selectedLocations.length === 0
											? "Select locations..."
											: `${selectedLocations.length} location${selectedLocations.length !== 1 ? 's' : ''}`}
									</span>
									<span className="text-gray-400">▼</span>
								</button>
								{isLocationsOpen && (
									<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
										<div className="p-1">
											{allLocations.map(location => (
												<label key={location} className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer">
													<input
														type="checkbox"
														checked={selectedLocations.includes(location)}
														onChange={() => {
															const newLocations = selectedLocations.includes(location)
																? selectedLocations.filter(l => l !== location)
																: [...selectedLocations, location];
															setSelectedLocations(newLocations);
															setAppliedLocations(newLocations);
														}}
														className="mr-2 text-pink-600 rounded"
													/>
													<span className="text-xs text-gray-700">{location}</span>
												</label>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Results Section */}
					<div className="border-t border-gray-200 flex flex-col flex-grow overflow-hidden">
						{/* Only show the active filters section if there are applied filters */}
						{(appliedCategories.length > 0 || appliedLocations.length > 0 || appliedSearchTerm) && (
							<div className="p-1 border-b border-gray-200 flex-shrink-0">
								<div className="flex space-x-1 mb-0.5 flex-wrap gap-1">
									{appliedCategories.length > 0 && (
										<span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
											{appliedCategories.length} categor{appliedCategories.length !== 1 ? 'ies' : 'y'}
											<button
												onClick={() => {
													setSelectedCategories([]);
													setAppliedCategories([]);
												}}
												className="ml-1 text-indigo-600 hover:text-indigo-800"
											>
												×
											</button>
										</span>
									)}
									{appliedLocations.length > 0 && (
										<span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
											{appliedLocations.length} location{appliedLocations.length !== 1 ? 's' : ''}
											<button
												onClick={() => {
													setSelectedLocations([]);
													setAppliedLocations([]);
												}}
												className="ml-1 text-pink-600 hover:text-pink-800"
											>
												×
											</button>
										</span>
									)}
									{appliedSearchTerm && (
										<span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											"{appliedSearchTerm}"
											<button
												onClick={() => {
													setSearchTerm("");
													setAppliedSearchTerm("");
												}}
												className="ml-1 text-gray-600 hover:text-gray-800"
											>
												×
											</button>
										</span>
									)}
								</div>
							</div>
						)}

						<div className="overflow-y-auto flex-grow">
							{filteredOrganizations.length > 0 ? (
								<div className="divide-y divide-gray-100">
									{filteredOrganizations.map((org, index) => (
										<div
											key={index}
											className="p-1 hover:bg-gray-50 cursor-pointer"
											onClick={() => handleViewDetails(org, { stopPropagation: () => { } })}
										>
											<div className="flex justify-between items-start">
												<h4 className="font-medium text-indigo-800 text-xs">
													{org["Organization Name "] || "Unnamed Organization"}
												</h4>
												<span className="text-xs text-gray-500">{org.location}</span>
											</div>
											{org["Category of Resources "] && (
												<span className="inline-block px-1 py-0.5 bg-pink-100 text-pink-800 rounded-full text-xs mt-0.5">
													{org["Category of Resources "]}
												</span>
											)}
										</div>
									))}
								</div>
							) : (
								<div className="text-center text-gray-500 py-2 text-xs">
									No organizations match your search criteria
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Map Container */}
				<div
					className="rounded-lg relative w-full overflow-hidden"
					style={{ height }}
					onClick={handleMapClick}
				>
					<ComposableMap
						projection="geoAlbersUsa"
						projectionConfig={{
							scale: 900,
						}}
						width={800}
						height={500}
						style={{
							width: "100%",
							height: "100%",
							margin: "0 auto",
						}}
						onClick={handleMapClick}
					>
						<Geographies geography={geoUrl}>
							{({ geographies }) =>
								geographies.map((geo) => (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill="#f8f0ff" // Light purple background
										stroke="#d4d4d8" // Light gray borders
										strokeWidth={0.5}
										style={{
											default: {
												outline: "none",
											},
											hover: {
												outline: "none",
											},
											pressed: {
												outline: "none",
											},
										}}
									/>
								))
							}
						</Geographies>

						{filteredMarkers.map(({ name, coordinates, organizations, color }) => (
							<Marker
								key={name}
								coordinates={coordinates}
								onClick={(e) => handleMarkerClick({ name, coordinates, organizations }, e)}
							>
								<g transform="translate(-8, -8)">
									{/* Marker shadow */}
									<circle
										r={8}
										fill="#00000022"
										transform="translate(8, 9)"
									/>
									{/* White background for the marker */}
									<circle
										r={7}
										fill="white"
										transform="translate(8, 8)"
									/>
									{/* Colored marker */}
									<circle
										r={6}
										fill={selectedLocation === name ? "#FF69B4" : color}
										transform="translate(8, 8)"
										style={{
											transition: "fill 0.2s ease",
											cursor: "pointer",
										}}
									/>
								</g>
								{selectedLocation === name && (
									<foreignObject
										x={name === "San Diego" ? -50 : name === "New York" ? -300 : -150}
										y={name === "San Diego" ? -200 : 15}
										width={300}
										height={200}
										style={{ zIndex: 1000 }}
									>
										<div
											className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg max-h-48 overflow-y-auto border border-gray-200"
											onClick={(e) => e.stopPropagation()} // Prevent clicks on the card from closing it
											style={{ zIndex: 1000 }}
										>
											<div className="flex justify-between items-center mb-2">
												<div>
													<h3 className="text-lg font-bold text-indigo-900">{name}</h3>
													<p className="text-sm text-gray-500">{organizations.length} organization{organizations.length !== 1 ? 's' : ''}</p>
												</div>
												<button
													onClick={(e) => {
														e.stopPropagation();
														setSelectedLocation(null);
														setLocationData(null);
													}}
													className="text-gray-500 hover:text-gray-700"
												>
													×
												</button>
											</div>
											<div className="space-y-2">
												{locationData && locationData.length > 0 ? (
													locationData.map((org, index) => (
														<div key={index} className="border-b border-gray-200 pb-2 text-sm">
															<h4 className="font-semibold text-indigo-800">
																{org["Organization Name "] || "Unnamed Organization"}
															</h4>
															<div className="mt-1 space-y-2">
																{org["Website URL"] && (
																	<a
																		href={org["Website URL"]}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-pink-600 hover:text-pink-700 text-xs"
																		onClick={(e) => e.stopPropagation()}
																	>
																		Visit Website →
																	</a>
																)}
																{org["Description of Resources"] && (
																	<p className="text-xs text-gray-600">
																		{org["Description of Resources"].substring(0, 100)}
																		{org["Description of Resources"].length > 100 ? "..." : ""}
																	</p>
																)}
																{org["Category of Resources "] && (
																	<p className="text-xs text-indigo-600">
																		{org["Category of Resources "]}
																	</p>
																)}
																<button
																	onClick={(e) => handleViewDetails(org, e)}
																	className="text-xs text-pink-600 hover:text-pink-700 font-medium"
																>
																	View all details →
																</button>
															</div>
														</div>
													))
												) : (
													<p>No organization data available</p>
												)}
											</div>
										</div>
									</foreignObject>
								)}
							</Marker>
						))}
					</ComposableMap>

					{selectedOrganization && (
						<DetailModal
							organization={selectedOrganization}
							onClose={() => setSelectedOrganization(null)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default MapComponent;
