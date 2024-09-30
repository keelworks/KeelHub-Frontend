import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import keelworksLogo from "../assets/keelworks_cover.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { MaterialSymbol } from "react-material-symbols";
import checkmarkImage from "../assets/checkmark-png.png";

const AccountSuccess = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex mx-auto">
      <div className="relative w-2/5 h-screen">
        <img className="absolute w-full h-full object-cover" src="src/assets/image.png" alt="Background" />
      </div>
      <div className="bg-gray-100 w-3/5 h-screen flex flex-col items-center justify-center">
        <div className="w-[530px] flex flex-col items-center text-center">
          <div className="mb-6">
            <img src={checkmarkImage} alt="Checkmark" className="w-24 h-24" /> {/* Adjust size as needed */}
          </div>
          <h1 className="text-black text-4xl font-bold mb-2">Your account was set up!</h1>
          <p className="text-gray-600 mb-8">Let's get started by exploring the dashboard</p>
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center space-x-2 bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            <span>Continue</span>
            <div className="mr-[2px] mt-2 ">
                    <MaterialSymbol icon="arrow_forward" size={24}/> 
                </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSuccess;
