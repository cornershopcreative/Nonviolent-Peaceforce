import React, { useState } from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        {/* Top Navigation Bar */}
        <div className="bg-[#ddf214] p-4 flex justify-between items-center relative">
          {/* Left: Shield icon */}
          <div className="bg-[#0d0b5c] w-12 h-12 rounded-lg flex items-center justify-center">
            <a href="/">
              <span className="text-yellow-300 text-lg">🛡️</span>
            </a>
          </div>

          {/* Middle: Nav links */}
          <nav className="flex flex-wrap justify-center gap-4 font-medium text-[#1A1A40] text-lg text-center mt-4 md:mt-0 md:gap-6 md:justify-center"
              style={{fontFamily: "Poppins", color : '#1A1A40'}}>
            
            <a href="/about" className="hover:underline">
              About
            </a>
            <a href="/map" className="hover:underline">
              Map
            </a>
            <a href="/addyours" className="hover:underline">
              Add Yours
            </a>
          </nav>

          {/* Right: language & accessibility */}
          <div className="hidden md:flex gap-3">
            <button className="bg-[#1A1A40] text-green-400 w-10 h-10 rounded-md flex items-center justify-center hover:bg-[#333366] transition">
              🈯
            </button>
            <button className="bg-[#1A1A40] text-blue-400 w-10 h-10 rounded-md flex items-center justify-center hover:bg-[#333366] transition">
              ♿
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-[#0d0b5c] text-center py-24 px-6 relative">
          <h1
            className="text-5xl font-bold text-[#E4F046] mb-4"
            style={{ fontFamily: "Chalkduster, fantasy" }}
          >
            Safety Connection Map
          </h1>
          <p 
            className="text-white text-xl mx-auto max-w-2xl"
            style={{ fontFamily: "Poppins", color: '#E895D7' }}>
            community support in crisis—all in one place.
          </p>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-10"></div>
        </div>
      </header>

      <main className="container mx-auto flex-grow py-4 md:py-6 px-4 md:px-6">
        {children}
      </main>

      <footer className="bg-indigo-900 py-8 px-6 text-white">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* Column 1 - Connecting Communities */}
          <div>
            <h2 className="font-bold text-xl text-yellow-300" style={{ fontFamily: "Chalkduster, fantasy" }}>
              CONNECTING
              <br />
              COMMUNITIES
              <br />
              ACROSS THE MAP!
            </h2>
          </div>

          {/* Column 2 - Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-1" style={{fontFamily: "Poppins"}}>Contact</h3>
            <a href="mailto:email@email.org" className="hover:text-yellow-300 transition-colors" style={{fontFamily: "Papyrus"}}>
              email@email.org
            </a>
          </div>

          {/* Column 3 - NP Logo */}
          <div>
            <p className="mb-2" style={{fontFamily: "Poppins"}}>A project of</p>
            <div className="w-16 h-16 bg-white rounded-full overflow-hidden">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-full h-full flex items-center justify-center">
                <span className="font-bold text-white text-2xl">NP</span>
              </div>
            </div>
          </div>

          {/* Column 4 - DSSD Logo */}
          <div>
            <p className="mb-2" style={{fontFamily: "Poppins"}}>Powered by</p>
            <div className="w-16 h-16 bg-white flex items-center justify-center">
              <span className="font-bold text-blue-500 text-lg">DSSD</span>
            </div>
          </div>
          
        </div>
      </footer>

    </div>
  );
};

export default Layout;
