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

        <div className="flex flex-col md:flex-row items-center justify-center md:gap-12 px-4 md:px-0 mb-12">
          <h3 className="text-3xl font-bold text-indigo-900 text-center md:text-left md:w-1/3"
          style={{ fontFamily: "Garet Bold" }}>
            connect
            <br />
            to safety
            <br />
            networks
          </h3>
          <p className="text-indigo-900 text-center md:text-left md:w-2/3 max-w-2xl" style={{ fontFamily: "Garet Regular" }}>
            Safety, protection, mental well-being, access to healthcare, and
            connection to the right support networks. Our platform is designed
            to help you navigate challenges by providing resources across all
            aspects of holistic safety.
          </p>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden relative">
          <div className="h-[400px] relative">
            <div className="absolute inset-0">
              <MapComponent height="100%" />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <button
                onClick={goToMap}
                className="bg-indigo-900 text-white px-8 py-3 rounded-full hover:bg-indigo-800 transition duration-300 shadow-lg transform hover:scale-105"
              >
                EXPLORE FULL MAP
              </button>
            </div>
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
              style={{ fontFamily: "TC Milo" }}
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
              href="https://bridgingdivides.princeton.edu/policy/elevating-de-escalation-and-community-safety-approaches"
              className="bg-pink-300 text-indigo-900 py-3 px-6 rounded-full text-center font-medium hover:bg-pink-400 transition-colors"
              style={{fontFamily: "Garet Bold"}}
            >
              De-escalation
              <br />
              Resources
            </a>
            <a
              href="https://www.mutualaidhub.org/"
              className="bg-pink-300 text-indigo-900 py-3 px-6 rounded-full text-center font-medium hover:bg-pink-400 transition-colors"
              style={{fontFamily: "Garet Bold"}}
            >
              Mutual Aid
              <br />
              Hub
            </a>
            <a
              href="https://map.reach4help.org/?lang=en&map=42.40397148650272%2C-75.99004231516555%2C6"
              className="bg-pink-300 text-indigo-900 py-3 px-6 rounded-full text-center font-medium hover:bg-pink-400 transition-colors"
              style={{fontFamily: "Garet Bold"}}
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
