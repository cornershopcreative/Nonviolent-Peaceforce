import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, Children } from "react";
import MapComponent from "../components/Map.jsx";

const Home = () => {
  const navigate = useNavigate();

  const goToAbout = () => {
    navigate(`/about`);
  };

  const goToMap = () => {
    navigate(`/map`);
  };

  return (
    <div className="min-h-screen bg-[#e6e0f8] text-[#1A1A40]">
      {/* Main Content */}
      <main className="p-10 bg-purple-100">
        {/* <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-indigo-900">connect to safety networks</h2>
                <p className="text-gray-700 mt-3 max-w-xl mx-auto">
                    Safety, protection, mental well-being, access to healthcare, and 
                    connection to the right support networks. Our platform is 
                    designed to help you navigate challenges by providing 
                    resources across all aspects of holistic safety.
                </p>
            </div> */}

        <div className="flex flex-col md:flex-row items-center justify-center md:gap-12 px-4 md:px-0">
          <h3 className="text-3xl font-bold text-indigo-900 text-center md:text-left md:w-1/3">
            connect
            <br />
            to safety
            <br />
            networks
          </h3>
          <p className="text-indigo-900 text-center md:text-left md:w-2/3 max-w-2xl">
            Safety, protection, mental well-being, access to healthcare, and
            connection to the right support networks. Our platform is designed
            to help you navigate challenges by providing resources across all
            aspects of holistic safety.
          </p>
        </div>

        {/* Map Section */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 my-6">
          <div className="h-64 bg-blue-50 flex items-center justify-center rounded-md relative overflow-hidden">
            {/* Map preview */}
            <div className="absolute inset-0">
              <MapComponent height="100%" />
            </div>

            {/* Button positioned over the map */}
            <button
              onClick={goToMap}
              className="bg-indigo-900 text-white px-6 py-2 rounded-full hover:bg-indigo-800 transition duration-300 z-10"
            >
              EXPLORE FULL MAP
            </button>
          </div>
        </div>
      </main>
      {/* Resources Section */}
      <div className="bg-white p-8 relative overflow-hidden">
        {/* Centered content container */}
        <div className="flex flex-row justify-center gap-20 relative z-10">
          {/* Left side - Text content */}
          <div className="max-w-xs">
            <h2
              className="text-2xl font-bold mb-4 text-indigo-900"
              style={{ fontFamily: "cursive" }}
            >
              OTHER RESOURCES
            </h2>
            <p className="text-sm text-gray-600">
              Our map is just the beginning. Explore these additional resources
              for more ways to find the support you need.
            </p>
          </div>

          {/* Right side - Buttons */}
          <div className="flex flex-col gap-4">
            <a
              href="#"
              className="bg-pink-300 text-indigo-900 py-3 px-6 rounded-full text-center font-medium hover:bg-pink-400 transition-colors"
            >
              De-escalation
              <br />
              Resources
            </a>
            <a
              href="#"
              className="bg-pink-300 text-indigo-900 py-3 px-6 rounded-full text-center font-medium hover:bg-pink-400 transition-colors"
            >
              Mutual Aid
              <br />
              Hub
            </a>
            <a
              href="#"
              className="bg-pink-300 text-indigo-900 py-3 px-6 rounded-full text-center font-medium hover:bg-pink-400 transition-colors"
            >
              Reach 4 Help
              <br />
              Map of Aid
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
