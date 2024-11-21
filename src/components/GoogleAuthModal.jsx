import React,{ useEffect,useState } from "react"
import axios from "axios";

const GoogleAuthModal = ({closeModal}) =>{

    const [qrimg, setQrimg] = useState("");
    const[secret, setSecret] = useState("");

    const loadQR = async() =>{
        let secret = JSON.parse(localStorage.getItem("currentUser"))
        let secretBase32 = secret.secret_2fa
        
        let response = await axios.post("http://localhost:3001/api/auth/generate2fa",{
          secretBase32
        });
        
        setQrimg(response.data.qrCode)
        setSecret(response.data.secret)
        // console.log(response.data.qrCode);
    }

    useEffect(()=>{
        loadQR();
    },[])

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="w-[500px] h-[550px] bg-white flex flex-col items-start justify-start rounded-lg shadow-lg">
    <div className="w-full h-[550px] pr-15 mt-[30px] pl-10">
    <div className="flex space-x-[180px]">
      <h2 className="pl-2 pt-3 mb-3 text-black font-bold">Get the Google Authenticator</h2>
    </div>
      <p className='pl-2 pt-4 ml-1 mt-1 font-bold'>1. Download Google Authenticator:</p>
      <p className="pl-2 pt-2 mb-2 ml-1 text-gray-500">Download the app onto your mobile device</p>
      <div className="flex space-x-[60px] text-xs pl-5 mt-5">
        <a href="#" className="text-blue-500 hover:underline">Download for Android</a>
        <a href="#" className="text-blue-500 hover:underline">Download for iOS</a>
      </div>

      <p className='pl-2 pt-4 ml-1 mt-5 font-bold'>2. Scan the QR Code:</p>
      <p className="pl-2 pt-2 mb-2 ml-1 text-gray-500">Open the Google Authenticator and scan the QR code</p>
      <div className="flex space-x-[30px]">
        <img className="pt-2" src={qrimg} alt="QR"></img>
        <div className="overflow-hidden">
        <p className="text-gray-400 pt-5">Or enter this code if you can't scan the QR code</p>
        <p className="text-[10px] text-gray-400 mt-5 mr-2 break-words">{secret}</p>
        </div>
      </div>
    </div>
    <div className="flex justify-end pb-5 w-[100px] ml-[350px]">
      <button className="flex w-[300px] ml-5 justify-center rounded-md bg-blue-700 px-5 py-1.5 text-sm font-semibold leading-6 text-white border border-blue-700 shadow-sm hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => {closeModal(false)}}>
        Done
      </button>
    </div>
  </div>
</div>

    )

}

export default GoogleAuthModal;