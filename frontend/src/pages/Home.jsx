import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, Children } from "react";
const Home = () => {
    const navigate = useNavigate();
    const onClick = () => {
        console.log("hello") // to navigation
        navigate(`/about`);
    }

    const addYoursClick = () => {
        console.log("add yours") // to navigation
        navigate(`/addyours`);
    }

    return (
        <div className="min-h-screen bg-[#e6e0f8] text-[#1A1A40]">
        {/* Header */}
        <header className="bg-[#1A1A40] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center">
                    👐
                </div>
                <nav className="flex gap-6 font-medium text-lg">
                    <a href="#" className="hover:text-yellow-400">About</a>
                    <a href="#" className="hover:text-yellow-400">Map</a>
                    <a href="#" className="hover:text-yellow-400">Add Yours</a>
                </nav>
            </div>
            <div className="flex gap-2 items-center">
                🌍
                <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500">A</button>
            </div>
        </header>

        {/* Hero Section */}
        <section className="bg-[#1A1A40] text-yellow-400 text-center py-20 relative">
            <h1 className="text-4xl font-extrabold tracking-wider">HOLISTIC SAFETY</h1>
            <p className="text-white text-xl mt-2">The SafetyNet of Community Care</p>
            <button 
                onClick={onClick} 
                className="bg-white text-[#1A1A40] px-6 py-3 mt-6 rounded-full hover:bg-yellow-400 hover:text-[#1A1A40] transition duration-300"
            >
                About
            </button>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-300 rounded-full blur-xl opacity-40"></div>
        </section>

        {/* Main Content */}
        <main className="p-10 bg-[#E6E0F8]">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">PLACEHOLDER TEXT</h2>
                <p className="text-gray-700 mt-3 max-w-xl mx-auto">
                    Placeholder text for description content goes here. This section will have additional text as needed.
                </p>
            </div>

            {/* Map Section */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 my-6">
                <div className="h-64 bg-gray-300 flex items-center justify-center rounded-md">
                    <p className="text-lg text-gray-500">Map Placeholder</p>
                </div>
                <button 
                    onClick={onClick} 
                    className="bg-[#1A1A40] text-yellow-400 px-6 py-3 mt-4 rounded-full w-full hover:bg-yellow-400 hover:text-[#1A1A40] transition duration-300"
                >
                    GO TO MAP
                </button>
            </div>

            {/* Resources Section */}
            <section className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">OTHER RESOURCES</h2>
                <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                <div className="flex flex-col gap-3 mt-4">
                    <button className="bg-pink-400 text-white py-3 rounded-lg shadow-md hover:bg-pink-500">
                        De-escalation Resources
                    </button>
                    <button className="bg-pink-400 text-white py-3 rounded-lg shadow-md hover:bg-pink-500">
                        Mutual Aid Hub
                    </button>
                    <button className="bg-pink-400 text-white py-3 rounded-lg shadow-md hover:bg-pink-500">
                        Reach 4 Help Map of Aid
                    </button>
                </div>
            </section>
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
