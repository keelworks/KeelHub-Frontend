import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import keelworksLogo from "../assets/keelworks_cover.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

const VerificationFail = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, login } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit =  () => {
    navigate("/");
  };
    

  return (
      <div className="flex mx-auto">
        <div className="relative w-2/5 h-screen z-50">
          <img className="absolute w-full h-full" src="src\assets\image.png" />
          <div className="absolute inset-0 flex justify-center bg-opacity-75 p-8 h-1/2">
            <div className=" p-20 text-white mt-40">
              <p className="">Never doubt that a small group of thoughtful, committed citizens can change the world; 
                indeed, it's the only thing that ever has.
              </p>
              <p className="pt-5">- Margaret Mead</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 w-3/5 h-screen flex flex-col items-start justify-start">
          <div className="w-[530px] h-[300px] pr-15 mt-auto pl-10 mb-auto">
            <h1 className="text-black pl-4 pt-4 mb-3 text-6xl">Failed to verify!</h1>
            <h3 className="pl-5 pt-3 text-gray-600 text-2xl">Looks like your link is invalid, it could be that
                it timed out or there has been a technical problem
            </h3>
            <div className=" flex space-x-10 pl-5 pt-10 border-black">
            <button type="submit" onClick={handleSubmit} className="flex space-x-2 w-[180px] h-[40px] bg-blue-700 justify-center rounded-md 
                px-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                focus-visible:outline-indigo-600"> 
                <div className="mr-[2px] mt-2 ">
                    <MaterialSymbol icon="arrow_back" size={25}/> 
                    {/* Go back to home */}
                </div> 
                <p className="mt-2">Go back to home</p>
            </button>
            <a href="#" className="text-blue-500 hover:underline font-bold pt-2.5 text-sm">Request help</a>
           </div>
          </div>
            <footer className="bg-gray-100 w-full flex flex-col items-center pb-4">
              <div className="flex space-x-2 text-xs">
                <a href="#" className="text-blue-500 hover:underline">Terms of Use</a>
                <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
              </div>
              <p className="text-gray-600 text-xs">This site is protected by reCAPTCHA Enterprise. 
              <a href="#" className="text-blue-500 hover:underline"> Privacy Policy </a> and 
              <a href="#" className="text-blue-500 hover:underline"> Terms of Use </a> 
                apply
              </p>
            </footer>
        </div>
      </div>

  )
};

export default VerificationFail;
