import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, Children } from "react";
const Home = () => {
    const onClick = () => {
        console.log("hello") // to navigation
    }

    return (
        <div><h1 className="">hello world</h1>
        <button onClick={onClick} className="w-11 h-10"></button></div>
    );
};

export default Home;
