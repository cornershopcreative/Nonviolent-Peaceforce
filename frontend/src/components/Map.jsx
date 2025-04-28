import React, { useState, useEffect, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { getResources } from "../services/resourceService";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

// Map bounds for the US (restrict panning)
const MAP_BOUNDS = {
  minLng: -125,
  maxLng: -67,
  minLat: 24,
  maxLat: 50,
};

// Translate extent to further restrict movement
const TRANSLATE_EXTENT = [
  [-150, 20], // Southwest coordinates [lng, lat]
  [-50, 55], // Northeast coordinates [lng, lat]
];

const MapComponent = ({ onLocationSelect, height = "600px" }) => {
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [selectedLocations, setSelectedLocations] = useState(["All"]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [position, setPosition] = useState({
    coordinates: [-97, 38],
    zoom: 1,
  });
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

  const defaultPosition = {
    coordinates: [-97, 38],
    zoom: 1,
  };

  // Revised pin sizing function that makes pins smaller as zoom increases
  const getPinSize = (zoom) => {
    // Start with larger pins at low zoom and scale down as zoom increases
    return Math.max(2, Math.min(10, 12 / (zoom * 0.5)));
  };

  // Define a consistent color scheme for resource types with exact matches
  const resourceColors = {
    "Medical Resources": "#E74C3C", // Vibrant red
    "Mental Health": "#E94FBF", // Pink
    "Food Resources": "#F1C40F", // Vibrant yellow
    "Housing Resources": "#F39C12", // Orange
    "Legal Resources": "#3498DB", // Bright blue
    default: "#9B59B6", // Purple as default
  };

  const getPinColor = (category) => {
    // Ensure exact match with category strings
    if (!category) return resourceColors.default;
    return resourceColors[category.trim()] || resourceColors.default;
  };

  // Reset map to default position
  const resetZoom = () => {
    setSelectedLocation(null);
    setLocationData(null);
    setPopupPosition(null);
    setPosition({ ...defaultPosition });
  };

  const handleZoomIn = () => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.5, 20),
    }));
  };

  const handleZoomOut = () => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.5, 1),
    }));
  };

  const handleWheel = (event) => {
    event.preventDefault();
    if (Math.abs(event.deltaY) < 20) return;

    if (event.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Toggle dropdown visibility
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown((prev) => !prev);
    setShowLocationDropdown(false);
  };

  const toggleLocationDropdown = () => {
    setShowLocationDropdown((prev) => !prev);
    setShowCategoryDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle category selection for multi-select
  const handleCategoryChange = (category) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
      return;
    }

    setSelectedCategories((prev) => {
      // If "All" is currently selected, remove it
      const newSelection = prev.includes("All") ? [] : [...prev];

      // Toggle selection
      if (newSelection.includes(category)) {
        const filtered = newSelection.filter((item) => item !== category);
        // If nothing is selected, default to "All"
        return filtered.length === 0 ? ["All"] : filtered;
      } else {
        // Add the new value and remove "All" if present
        return [...newSelection.filter((item) => item !== "All"), category];
      }
    });
  };

  // Handle location selection for multi-select
  const handleLocationChange = (location) => {
    if (location === "All") {
      setSelectedLocations(["All"]);
      return;
    }

    setSelectedLocations((prev) => {
      // If "All" is currently selected, remove it
      const newSelection = prev.includes("All") ? [] : [...prev];

      // Toggle selection
      if (newSelection.includes(location)) {
        const filtered = newSelection.filter((item) => item !== location);
        // If nothing is selected, default to "All"
        return filtered.length === 0 ? ["All"] : filtered;
      } else {
        // Add the new value and remove "All" if present
        return [...newSelection.filter((item) => item !== "All"), location];
      }
    });
  };

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        const resources = await getResources();
        const uniqueOrganizations = new Map();

        resources.forEach((resource) => {
          if (
            !resource.coordinates ||
            !resource.coordinates.lat ||
            !resource.coordinates.lon
          )
            return;

          const coordKey = `${resource.coordinates.lat.toFixed(
            4
          )},${resource.coordinates.lon.toFixed(4)}`;

          if (!uniqueOrganizations.has(coordKey)) {
            uniqueOrganizations.set(coordKey, {
              coordinates: [resource.coordinates.lon, resource.coordinates.lat],
              organizations: [],
              location: resource.location,
              categories: new Set(), // Track all resource categories at this location
            });
          }

          const markerData = uniqueOrganizations.get(coordKey);
          const existingOrgs = markerData.organizations;

          // Add resource category to the set if it exists
          if (resource["Category of Resources "]) {
            const category = resource["Category of Resources "].trim();
            markerData.categories.add(category);

            // Also store the category directly on the resource for easier access
            resource.category = category;
          }

          const isDuplicate = existingOrgs.some(
            (org) =>
              org["Organization Name "] === resource["Organization Name "]
          );

          if (!isDuplicate) {
            existingOrgs.push(resource);
          }
        });

        // Convert the Map to an array
        const markersArray = Array.from(uniqueOrganizations.values()).map(
          (marker) => {
            // Convert Set to Array for easier handling
            const categoryArray = Array.from(marker.categories);

            return {
              ...marker,
              categories: categoryArray,
            };
          }
        );

        setMarkers(markersArray);
        setFilteredMarkers(markersArray);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  // Update filtered organizations when filters change
  useEffect(() => {
    const allOrgs = markers
      .flatMap((marker) =>
        marker.organizations.map((org) => ({
          name: org["Organization Name "],
          location: marker.location,
          category:
            org.category ||
            (org["Category of Resources "]
              ? org["Category of Resources "].trim()
              : null),
          markerData: marker,
        }))
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    const filtered = allOrgs.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.includes("All") ||
        (org.category && selectedCategories.includes(org.category));

      const matchesLocation =
        selectedLocations.includes("All") ||
        selectedLocations.includes(org.location);

      return matchesSearch && matchesCategory && matchesLocation;
    });

    setFilteredOrganizations(filtered);

    // Filter markers based on location only, not on resource type
    const filteredLocs = markers.filter(
      (marker) =>
        selectedLocations.includes("All") ||
        selectedLocations.includes(marker.location)
    );

    setFilteredMarkers(filteredLocs);
  }, [searchTerm, selectedCategories, selectedLocations, markers]);

  // Function to ensure popup stays in view
  const calculatePopupPosition = (marker, event) => {
    if (!mapRef.current) return { x: 0, y: 0 };

    // If the event is from a map click
    if (event) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Calculate if the popup would go out of frame to the right
      const mapWidth = rect.width;
      const popupX = Math.min(x, mapWidth - 170); // Keep popup within right edge

      return { x: popupX, y };
    }
    // If the event is from sidebar click, position popup in the center of the map
    else {
      const rect = mapRef.current.getBoundingClientRect();
      return {
        x: rect.width / 2,
        y: rect.height / 2,
      };
    }
  };

  const handleMarkerClick = (marker, event) => {
    setSelectedLocation(marker.coordinates);

    // Only set the first organization for the popup when clicking a map pin
    setLocationData([marker.organizations[0]]);

    const newPopupPosition = calculatePopupPosition(marker, event);
    setPopupPosition(newPopupPosition);

    setPosition({
      coordinates: marker.coordinates,
      zoom: 5,
    });

    if (onLocationSelect) {
      onLocationSelect(marker.organizations[0].location, [
        marker.organizations[0],
      ]);
    }
  };

  // Add a new function to handle sidebar resource clicks
  const handleResourceClick = (org) => {
    setSelectedLocation(org.markerData.coordinates);

    // Find the complete organization data from the marker
    const completeOrgData = org.markerData.organizations.find(
      (organization) => organization["Organization Name "] === org.name
    );

    // Set the full organization data for the popup
    setLocationData(completeOrgData ? [completeOrgData] : [org]);

    const newPopupPosition = calculatePopupPosition(org.markerData);
    setPopupPosition(newPopupPosition);

    setPosition({
      coordinates: org.markerData.coordinates,
      zoom: 5,
    });

    if (onLocationSelect) {
      onLocationSelect(
        org.location,
        completeOrgData ? [completeOrgData] : [org]
      );
    }
  };

  const closePopup = () => {
    setSelectedLocation(null);
    setLocationData(null);
    setPopupPosition(null);
  };

  const handleMoveEnd = (newPosition) => {
    const [longitude, latitude] = newPosition.coordinates;

    // Constrain the coordinates within bounds
    const constrainedLongitude = Math.min(
      Math.max(longitude, MAP_BOUNDS.minLng),
      MAP_BOUNDS.maxLng
    );
    const constrainedLatitude = Math.min(
      Math.max(latitude, MAP_BOUNDS.minLat),
      MAP_BOUNDS.maxLat
    );

    // Only update if we need to constrain
    if (
      longitude !== constrainedLongitude ||
      latitude !== constrainedLatitude
    ) {
      setPosition({
        ...newPosition,
        coordinates: [constrainedLongitude, constrainedLatitude],
      });
    } else {
      setPosition(newPosition);
    }
  };

  const categories = [
    "All",
    ...new Set(
      markers.flatMap((marker) =>
        marker.organizations.map((org) =>
          org["Category of Resources "]
            ? org["Category of Resources "].trim()
            : null
        )
      )
    ),
  ].filter(Boolean);

  const locations = [
    "All",
    ...new Set(markers.map((marker) => marker.location)),
  ].filter(Boolean);

  // Function to adjust popup position after it's been rendered
  useEffect(() => {
    if (popupRef.current && mapRef.current) {
      const popupRect = popupRef.current.getBoundingClientRect();
      const mapRect = mapRef.current.getBoundingClientRect();

      // Check if popup is outside map boundaries
      if (popupRect.right > mapRect.right) {
        // Adjust popup position
        setPopupPosition((prev) => ({
          ...prev,
          x: prev.x - (popupRect.right - mapRect.right) - 20, // 20px buffer
        }));
      }

      if (popupRect.bottom > mapRect.bottom) {
        setPopupPosition((prev) => ({
          ...prev,
          y: prev.y - (popupRect.bottom - mapRect.bottom) - 20, // 20px buffer
        }));
      }
    }
  }, [selectedLocation, popupPosition]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  const safeCoordinates =
    Array.isArray(position.coordinates) && position.coordinates.length === 2
      ? position.coordinates
      : defaultPosition.coordinates;

  return (
    // Replace the main container div with this responsive version
    // From line ~485
    <div className="flex flex-col md:flex-row gap-4 h-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl">
      {/* Resources Panel - Full width on mobile, 1/4 on desktop */}
      <div className="w-full md:w-1/4 bg-white rounded-xl shadow-lg overflow-hidden mb-4 md:mb-0 max-h-[350px] md:max-h-none overflow-y-auto">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h3 className="text-lg font-bold">Resources</h3>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search organizations..."
              className="input input-bordered w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Multi-select dropdowns - Switch to vertical on smallest screens */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div
              className="flex-1 min-w-[120px] relative"
              ref={categoryDropdownRef}
            >
              <button
                onClick={toggleCategoryDropdown}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white flex justify-between items-center text-sm"
              >
                <span className="truncate">
                  {selectedCategories.includes("All")
                    ? "All Categories"
                    : `${selectedCategories.length} Selected`}
                </span>
                <svg
                  className="h-4 w-4 text-gray-500 ml-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="px-3 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={() => handleCategoryChange(category)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => {}}
                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">
                        {category === "All" ? "All Categories" : category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="flex-1 min-w-[120px] relative"
              ref={locationDropdownRef}
            >
              <button
                onClick={toggleLocationDropdown}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white flex justify-between items-center text-sm"
              >
                <span className="truncate">
                  {selectedLocations.includes("All")
                    ? "All Locations"
                    : `${selectedLocations.length} Selected`}
                </span>
                <svg
                  className="h-4 w-4 text-gray-500 ml-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showLocationDropdown && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
                  {locations.map((location) => (
                    <div
                      key={location}
                      className="px-3 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={() => handleLocationChange(location)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => {}}
                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">
                        {location === "All" ? "All Locations" : location}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 max-h-32 md:max-h-96 overflow-y-auto pr-1 border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-500 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Showing {filteredOrganizations.length} organizations
            </p>
            <div className="space-y-1">
              {filteredOrganizations.map((org, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                  onClick={() => handleResourceClick(org)}
                >
                  <div className="flex items-start">
                    <div
                      className="w-4 h-4 rounded-full mt-1 mr-2 flex-shrink-0"
                      style={{ backgroundColor: getPinColor(org.category) }}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {org.name}
                      </h4>
                      <p className="text-xs text-gray-500">{org.category}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {org.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map container - Full width on all screens, taller on mobile */}
      <div
        className="bg-white rounded-xl shadow-lg p-0 relative flex-1 overflow-hidden min-h-[400px]"
        style={{ height }}
        ref={mapRef}
        onWheel={handleWheel}
      >
        {/* Rest of the map code remains unchanged */}
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 900 }}
          width={800}
          height={500}
          style={{
            width: "100%",
            height: "100%",
            margin: "0 auto",
            backgroundColor: "#EEF2F7", // Light blue-gray background
          }}
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="10" height="10" fill="#EEF2F7" />
              <path
                d="M 10 0 L 0 0 0 10"
                stroke="#E2E8F0"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          <ZoomableGroup
            zoom={position.zoom}
            center={safeCoordinates}
            onMoveEnd={handleMoveEnd}
            minZoom={1}
            maxZoom={20}
            wheelDelta={(event) => {
              return -event.deltaY * 0.0001;
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#FFFFFF"
                    stroke="#D1D5DB"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#FFFFFF" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Render one pin per location, without filtering by resource type */}
            {filteredMarkers.map((marker, index) => (
              <Marker
                key={index}
                coordinates={marker.coordinates}
                onClick={(event) => handleMarkerClick(marker, event)}
              >
                <g>
                  {/* Shadow effect */}
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={getPinSize(position.zoom) * 1.2}
                    ry={getPinSize(position.zoom) * 0.4}
                    fill="rgba(0, 0, 0, 0.2)"
                    transform={`translate(0, ${
                      getPinSize(position.zoom) * 0.8
                    })`}
                    style={{ filter: "blur(2px)" }}
                  />

                  {/* Main pin - always purple */}
                  <g transform="translate(0, -2)">
                    {/* Bottom circle */}
                    <circle
                      r={getPinSize(position.zoom) * 0.9}
                      fill={resourceColors.default}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      transform="translate(0, 2)"
                      style={{
                        cursor: "pointer",
                      }}
                    />

                    {/* Top circle for 3D effect */}
                    <circle
                      r={getPinSize(position.zoom) * 0.8}
                      fill={resourceColors.default}
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                      style={{
                        cursor: "pointer",
                        filter: "brightness(1.1)",
                      }}
                    />
                  </g>

                  {/* Selected marker highlight */}
                  {selectedLocation &&
                    selectedLocation[0] === marker.coordinates[0] &&
                    selectedLocation[1] === marker.coordinates[1] && (
                      <circle
                        r={getPinSize(position.zoom) + 5}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        style={{
                          cursor: "pointer",
                          opacity: 0.8,
                          animation: "pulse 1.5s infinite",
                        }}
                      />
                    )}
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.4;
            }
            100% {
              transform: scale(1);
              opacity: 0.8;
            }
          }
        `}</style>

        {selectedLocation &&
          popupPosition &&
          locationData &&
          locationData.length > 0 && (
            <div
              ref={popupRef}
              className="absolute bg-white p-4 rounded-xl shadow-xl max-h-64 overflow-y-auto border border-gray-200"
              style={{
                left: `${popupPosition.x}px`,
                top: `${popupPosition.y}px`,
                width: "320px",
                zIndex: 1000,
              }}
            >
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">
                  {locationData[0].location}
                </h3>
                <button
                  onClick={closePopup}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {locationData.map((org, index) => {
                  // Check if the organization is a complete organization object or just the sidebar info
                  const isCompleteOrg =
                    org["Category of Resources "] !== undefined;
                  const category = isCompleteOrg
                    ? org.category ||
                      (org["Category of Resources "]
                        ? org["Category of Resources "].trim()
                        : null)
                    : org.category;
                  const name = isCompleteOrg
                    ? org["Organization Name "]
                    : org.name;
                  const description = isCompleteOrg
                    ? org["Description of Resources"]
                    : null;
                  const website = isCompleteOrg ? org["Website URL"] : null;

                  return (
                    <div key={index} className="border-b border-gray-100 pb-3">
                      <div className="flex items-start">
                        <div
                          className="w-4 h-4 rounded-full mt-1 mr-2 flex-shrink-0"
                          style={{ backgroundColor: getPinColor(category) }}
                        ></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {name || "Unnamed Organization"}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {category}
                          </p>

                          {website && (
                            <a
                              href={website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-500 hover:text-indigo-600 text-xs inline-flex items-center mt-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              Website
                            </a>
                          )}

                          {description && (
                            <p className="text-xs text-gray-600 mt-2">
                              {description.substring(0, 120)}
                              {description.length > 120 ? "..." : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={resetZoom}
            className="btn btn-circle btn-sm bg-white shadow-lg rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Reset Map"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={handleZoomIn}
            className="btn btn-circle btn-sm bg-white shadow-lg rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Zoom In"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="btn btn-circle btn-sm bg-white shadow-lg rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Zoom Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
