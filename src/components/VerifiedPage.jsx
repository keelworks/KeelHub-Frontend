import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import keelworksLogo from "../assets/keelworks_cover.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const VerifiedPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, login } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);

    try{
      const credentialResponseDecoded = jwtDecode(credentialResponse.credential);

      const response = await axios.post("http://localhost:3001/api/auth/google-login", credentialResponseDecoded);

      const {token, user } = response.data;

      login(user, token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setError("Failed to login with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-black pl-4 pt-4 mb-3 text-6xl">You have been verified!</h1>
            <h3 className="pl-5 pt-3 text-gray-600">Use the Google button to login</h3>
            <div className="pl-5 pt-10 border-black">
             <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                 setError("Google Login Failed");
               }}
             />
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

export default VerifiedPage;
