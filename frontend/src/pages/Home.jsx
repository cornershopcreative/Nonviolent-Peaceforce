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
        <div><h1 className="">hello world</h1>
        <button onClick={onClick} className="w-11 h-10 bg-blue-500"></button>
        <button onClick={addYoursClick} className=" bg-blue-100">Add Your Own</button></div>
        
    );
};

export default Home;
