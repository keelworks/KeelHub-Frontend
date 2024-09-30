import React, { useContext, useEffect,useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const TwoFactorSetUp = () =>  {
    const [qrimg, setQrimg] = useState("");
    const[token2FA, setToken2FA] = useState("");
    const[secret,setSecret] = useState('');
    const navigate = useNavigate();

    let {currentUser} = useContext(UserContext)

    // console.log("currentUser",currentUser.username);
    // console.log("secret",secret);

    // console.log("token",localStorage.getItem("token"))
    const loadQR = async() =>{
        let response = await axios.post("http://localhost:3001/api/auth/generate2fa");
        setSecret(response.data.secret);
        setQrimg(response.data.qrCode);
        // console.log(response.data.qrCode);
    }

    const handleVerify = async() => {
      // console.log("inside handleverify secret",secret)
      // console.log("inside handleverify token",token2FA)
      try{
        let response = await axios.post('http://localhost:3001/api/auth/verify2FA', {
          token2FA,
          secret,
          currentUser
        }); 

        // console.log("response",response)
        navigate('/admin-details',{replace:true})
      }catch(e){
        console.log(e);
      }
    }

    useEffect(()=>{
        if(!currentUser){
          navigate('/')
        }
        loadQR();
    },[])

    return(
        <div className="flex mx-auto mb-[10px]">
        <div className="relative w-2/5 h-screen z-50">
          <img className="absolute w-full h-full" src="src\assets\image.png" />
          <div className="absolute inset-0 flex justify-center bg-opacity-75 p-8 h-1/2">
            <div className=" p-20 text-white mt-40">
            </div>
          </div>
        </div>
        <div className="bg-white w-3/5 flex flex-col items-start justify-start">
          <div className="w-[530px] h-[850px] pr-15 mt-[50px] pl-10">
            <h3 className="text-black pl-4 pt-4 text-5xl">Two factor</h3>
            <h3 className="text-black pl-4 pt-4 text-5xl">authentication</h3>
            <h2 className="pl-5 pt-3 mb-3 text-gray-600">Two-factor authentication (2FA) using 
                Authenticator provides enhanced security for your account by generating a code each
                time you log in. Follow the steps below to get started: 
            </h2>
            <p className='pl-4 pt-4 ml-1 mt-5 font-bold'>1. Download Google Authenticator:</p>
            <p className="pl-4 pt-2 mb-2 ml-1 text-gray-500">Download the app onto your mobile device</p>
            <div className="flex space-x-[60px] text-xs pl-5 mt-5">
                <a href="#" className="text-blue-500 hover:underline">Download for Android</a>
                <a href="#" className="text-blue-500 hover:underline">Download for iOS</a>
            </div>

            <p className='pl-4 pt-4 ml-1 mt-5 font-bold'>2. Scan the QR Code:</p>
            <p className="pl-4 pt-2 mb-2 ml-1 text-gray-500">Open the Google Authenticator and scan the QR code</p>
            <div className="flex space-x-[60px]">
                <img className="pl-4 pt-2 ml-1" src={qrimg} alt="QR"></img>
                <div>
                  <p className="text-gray-400 pt-5">Or enter this code if you can't scan the QR code</p>
                  <p className="text-sm text-gray-400 mt-5">- TBD</p>
                </div>
            </div>

            {/* <a href="#" className="text-blue-500 hover:underline pl-8">Don't have the app?</a> */}

            {/* <a href="#" className="text-blue-500 pl-4 pt-4 ml-1 hover:underline">Don't have the app?</a> */}
            
            <p className='pl-4 pt-4 ml-1 mt-5 font-bold'>3. Enter Verification Code:</p>
            <p className="pl-4 pt-2 mb-2 ml-1 text-gray-500">Enter the 6-digit code from the Google Authenticator app</p>
            <input type="number" onChange={(e)=>{setToken2FA(e.target.value)}} name="code" id="code" placeholder='Verification Code' className="block w-[350px] rounded-md border-0 py-2 pl-2 ml-4 text-gray-900 shadow-sm ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            <button onClick={handleVerify} className="flex w-[200px] ml-[450px] justify-center py-auto rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Verify Code</button>
            
          </div>
        </div>
      </div>
    )

}

export default TwoFactorSetUp;