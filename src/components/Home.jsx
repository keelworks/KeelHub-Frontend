import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);

    try{
      const credentialResponseDecoded = jwtDecode(credentialResponse.credential);

      const response = await axios.post("http://localhost:3001/api/auth/google-login", credentialResponseDecoded);

      const {token, user } = response.data;
      console.log(response.data)
      await login(user, token);

      navigate(user && user.secret_2fa ? "/2fa" : '2fa-setup', {replace:true})

    } catch (error) {
      setError("Failed to login with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="relative w-2/5 bg-slate-700">
        <img className="absolute inset-0 w-full h-full object-cover" src="src\assets\image.png" alt="Background" />
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black">
          <div className="text-white max-w-md p-8">
            <blockquote className="text-2xl mb-4">
              <span className="text-4xl text-blue-400">"</span>
              Never doubt that a small group of thoughtful, committed citizens can change the world; 
              indeed, it's the only thing that ever has.
              <span className="text-4xl text-blue-400">"</span>
            </blockquote>
            <p className="text-xl text-right">- Margaret Mead</p>
          </div>
        </div>
      </div>
      <div className="w-3/5 bg-white flex flex-col justify-between">
        <div className="flex-grow flex flex-col justify-center px-16">
          <h1 className="text-8xl font-bold mb-6">Hello!</h1>
          <p className="text-2xl text-gray-600 mb-10">Use the Google button to login</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex flex-col items-start">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError("Google Login Failed")}
            />
            <button 
              onClick={() => navigate("/login")} 
              className="mt-4 w-[200px] justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Login
            </button>
          </div>
        </div>
        <footer className="w-full text-center text-sm text-gray-500 p-4">
          <div className="mb-2">
            <a href="#" className="text-blue-500 hover:underline mr-2">Terms of Use</a>
            <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
          </div>
          <p>
            This site is protected by reCAPTCHA Enterprise.
            <a href="#" className="text-blue-500 hover:underline"> Privacy Policy </a> and 
            <a href="#" className="text-blue-500 hover:underline"> Terms of Use </a> 
            apply
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;