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

const MapComponent = ({ onLocationSelect, height = "600px" }) => {
  const [markers, setMarkers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({
    coordinates: [-97, 38], // Center of the continental US
    zoom: 1,
  });
  const mapRef = useRef(null);

  const defaultPosition = {
    coordinates: [-97, 38], // Re-centers map to continental US
    zoom: 1,
  };

  const getPinSize = (zoom) => {
    return Math.max(2, Math.min(8, 8 - (zoom - 1) * 0.75));
  };

  const resetZoom = () => {
    setSelectedLocation(null);
    setLocationData(null);
    setPopupPosition(null);
    setPosition({ ...defaultPosition });
  };

  const handleZoomIn = () => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, 20),
    }));
  };

  const handleZoomOut = () => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, 1),
    }));
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
            });
          }

          const existingOrgs = uniqueOrganizations.get(coordKey).organizations;
          const isDuplicate = existingOrgs.some(
            (org) =>
              org["Organization Name "] === resource["Organization Name "]
          );

          if (!isDuplicate) {
            existingOrgs.push(resource);
          }
        });

        setMarkers(Array.from(uniqueOrganizations.values()));
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  const handleMarkerClick = (marker, event) => {
    setSelectedLocation(marker.coordinates);
    setLocationData(marker.organizations);

    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPopupPosition({ x, y });

    setPosition({
      coordinates: marker.coordinates,
      zoom: 8,
    });

    if (onLocationSelect) {
      onLocationSelect(marker.organizations[0].location, marker.organizations);
    }
  };

  const closePopup = () => {
    setSelectedLocation(null);
    setLocationData(null);
    setPopupPosition(null);
  };

  const handleMoveEnd = (newPosition) => {
    setPosition(newPosition);
  };

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
    <div
      className="bg-white rounded-lg shadow-lg p-4 relative w-full"
      style={{ height }}
      ref={mapRef}
    >
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 900 }}
        width={800}
        height={500}
        style={{
          width: "100%",
          height: "100%",
          margin: "0 auto",
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={safeCoordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={20}
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
                    default: { outline: "none" },
                    hover: { fill: "#F53", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinates={marker.coordinates}
              onClick={(event) => handleMarkerClick(marker, event)}
            >
              <circle
                r={getPinSize(position.zoom)}
                fill={
                  selectedLocation === marker.coordinates ? "#3B82F6" : "#F53"
                }
                stroke="#fff"
                strokeWidth={2}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {selectedLocation &&
        popupPosition &&
        locationData &&
        locationData.length > 0 && (
          <div
            className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-300 max-h-48 overflow-y-auto transition-all duration-300 ease-in-out"
            style={{
              left: `${Math.min(
                Math.max(popupPosition.x, 160),
                mapRef.current.offsetWidth - 160
              )}px`,
              top: `${popupPosition.y + 15}px`,
              width: window.innerWidth < 640 ? "90%" : "300px",
              maxWidth: "300px",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{locationData[0].location}</h3>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {locationData.map((org, index) => (
                <div key={index} className="border-b pb-2 text-sm">
                  <h4 className="font-semibold">
                    {org["Organization Name "] || "Unnamed Organization"}
                  </h4>
                  {org["Website URL"] && (
                    <a
                      href={org["Website URL"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Website
                    </a>
                  )}
                  {org["Description of Resources"] && (
                    <p className="text-xs mt-1">
                      {org["Description of Resources"].substring(0, 100)}
                      {org["Description of Resources"].length > 100
                        ? "..."
                        : ""}
                    </p>
                  )}
                  {org["Category of Resources "] && (
                    <p className="text-xs text-gray-600">
                      Category: {org["Category of Resources "]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={resetZoom}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
          title="Reset Zoom"
        >
          🔄
        </button>
        <button
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
        >
          ➕
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
        >
          ➖
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
