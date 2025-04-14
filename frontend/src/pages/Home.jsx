import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, Children } from "react";
const Home = () => {
    const navigate = useNavigate();
    const onClick = () => {
        navigate(`/about`);
    }

    const addYoursClick = () => {
        console.log("add yours") // to navigation
        navigate(`/addyours`);
    }

    return (
        <div className="min-h-screen bg-[#e6e0f8] text-[#1A1A40]">
        {/* Header */}
        <header>
      {/* Top Navigation Bar */}
      <div className="bg-[#E4F046] p-4 flex justify-between items-center">
        {/* Left section: Shield icon */}
        <div className="bg-[#1A1A40] w-12 h-12 rounded-lg flex items-center justify-center">
          <span className="text-yellow-300 text-lg">🛡️</span>
        </div>

        {/* Middle section: Nav links */}
        <nav className="flex gap-6 font-medium text-[#1A1A40] text-lg absolute left-1/2 transform -translate-x-1/2">
          <button onClick={onClick} className="hover:underline">About</button>
          <a href="/map" className="hover:underline">Map</a>
          <button onClick={addYoursClick} className="hover:underline">Add Yours</button>
        </nav>

        {/* Right section: language & accessibility */}
        <div className="flex gap-3">
          <button className="bg-[#1A1A40] text-green-400 w-10 h-10 rounded-md flex items-center justify-center hover:bg-[#333366] transition">
            🈯
          </button>
          <button className="bg-[#1A1A40] text-blue-400 w-10 h-10 rounded-md flex items-center justify-center hover:bg-[#333366] transition">
            ♿
          </button>
        </div>
      </div>

      {/* Hero Section - Still part of the header */}
      <div className="bg-[#1A1A40] text-center py-24 px-6 relative">
        <h1 className="text-5xl font-bold text-[#E4F046] mb-4">
          Safety connection map
        </h1>
        <p className="text-white text-xl mx-auto max-w-2xl">
          community support in crisis—all in one place.
        </p>
        
        {/* About button */}
        <button 
          onClick={onClick} 
          className="bg-white text-[#1A1A40] px-8 py-3 mt-8 rounded-full font-medium hover:bg-[#E4F046] transition duration-300"
        >
          About
        </button>
        
        {/* Light effect on right side */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-10"></div>
      </div>
    </header>

        {/* Main Content */}
        <main className="p-10 bg-purple-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-900">connect to safety networks</h2>
        <p className="text-gray-700 mt-3 max-w-xl mx-auto">
          Safety, protection, mental well-being, access to healthcare, and 
          connection to the right support networks. Our platform is 
          designed to help you navigate challenges by providing 
          resources across all aspects of holistic safety.
        </p>
      </div>

      {/* Map Section */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 my-6">
        <div className="h-64 bg-blue-50 flex items-center justify-center rounded-md relative overflow-hidden">
          {/* US Map placeholder */}
          <div className="absolute inset-0 bg-blue-50">
            <div className="w-full h-full relative">
              {/* Simplified US outline */}
              <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
          
          {/* Button positioned over the map */}
          <button 
            onClick={onClick} 
            className="bg-indigo-900 text-white px-6 py-2 rounded-full hover:bg-indigo-800 transition duration-300 z-10"
          >
            GO TO MAP
          </button>
        </div>
      </div>

            {/* Resources Section */}
            <div className="bg-white p-8 rounded-lg shadow-md relative overflow-hidden">
      {/* Centered content container */}
      <div className="flex flex-row justify-center gap-20 relative z-10">
        {/* Left side - Text content */}
        <div className="max-w-xs">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900" style={{ fontFamily: 'cursive' }}>OTHER RESOURCES</h2>
          <p className="text-sm text-gray-600">
            Our map is just the beginning. Explore these additional resources for more ways to find the support you need.
          </p>
        </div>

        {/* Right side - Buttons */}
        <div className="flex flex-col gap-4">
          <a href="#" className="bg-pink-300 text-indigo-900 py-3 px-6 rounded-full text-center font-medium hover:bg-pink-400 transition-colors">
            De-escalation<br />Resources
          </a>
          <a href="#" className="bg-pink-300 text-indigo-900 py-3 px-6 rounded-full text-center font-medium hover:bg-pink-400 transition-colors">
            Mutual Aid<br />Hub
          </a>
          <a href="#" className="bg-pink-300 text-indigo-900 py-3 px-6 rounded-full text-center font-medium hover:bg-pink-400 transition-colors">
            Reach 4 Help<br />Map of Aid
          </a>
        </div>
      </div>
            </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#1A1A40] text-white text-center p-6 relative">
            <p className="text-yellow-400 text-lg font-bold">LOREM IPSUM SAFETY PAGE!</p>
            <p className="text-sm mt-2">Contact: email@email.org</p>

            <div className="flex justify-center gap-4 mt-4">
                <span className="bg-orange-500 px-4 py-2 rounded-md font-bold">NP</span>
                <span className="bg-gray-600 px-4 py-2 rounded-md font-bold">DSSD</span>
            </div>

            {/* Wavy Design Effect */}
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#1A1A40] rounded-full blur-3xl opacity-30"></div>
        </footer>
    </div>
    );
};

export default Home;
