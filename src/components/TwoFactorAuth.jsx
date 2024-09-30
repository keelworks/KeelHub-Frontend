import React, { useContext, useState, useEffect }from 'react'
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import GoogleAuthModal from './GoogleAuthModal';
import axios from 'axios';
import { MaterialSymbol } from 'react-material-symbols';

const TwoFactorAuth = () => {

    const { currentUser } = useContext(UserContext);
    const [openModal, setOpenModal] = useState(false);
    const [token2FA, setToken2FA] = useState('');
    const [error, setError] = useState(false);

    const secret = currentUser && currentUser.secret_2fa;
    const navigate = useNavigate();

    useEffect(()=>{
      if(!currentUser){
        navigate('/')}
    },[])


    const handleSubmit = async () => {
      try {
        let response = await axios.post('http://localhost:3001/api/auth/verify2FA', {
          token2FA,
          secret,
          currentUser,
        });
    
        if (response.status === 200) {
          if (currentUser.hasLoggedIn) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/admin-details', { replace: true });
          }
        }
      } catch (e) {
        setError(true);
      }
    };

    return(
        <div className="flex mx-auto">
        <div className="relative w-2/5 h-screen z-50">
          <img className="absolute w-full h-full" src="src\assets\image.png" />
          <div className="absolute inset-0 flex justify-center bg-opacity-75 p-8 h-1/2">
            <div className=" p-20 text-white mt-40">
              {/* <p className="">Never doubt that a small group of thoughtful, committed citizens can change the world; 
                indeed, it's the only thing that ever has.
              </p>
              <p className="pt-5">- Margaret Mead</p> */}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 w-3/5 h-screen flex flex-col items-start justify-start">
          <div className="w-[530px] h-[300px] pr-15 mt-auto pl-10 mb-[180px]">
            <h3 className="text-black pl-4 pt-4 text-5xl">Two factor</h3>
            <h3 className="text-black pl-4 pt-4 text-5xl">authentication</h3>
            <h2 className="pl-5 pt-3 mb-3 text-gray-600">Using the Google Authenticator app get your 
              one time code 
            </h2>
            <a onClick={()=> setOpenModal(!openModal) } className="text-blue-500 pl-4 pt-4 ml-1 hover:underline">Don't have the app?</a>
            { openModal && <GoogleAuthModal closeModal={setOpenModal}/> }
            <p className='pl-4 pt-4 ml-1 mt-5'>Enter your code here</p>
            <input type="number" onChange={(e)=>{setToken2FA(e.target.value)}} placeholder='Numerical Code' className="block w-[350px] rounded-md border-0 py-2 pl-2 ml-4 text-gray-900 shadow-sm ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            {error && error ? <p className='pl-5 pt-1x text-sm text-red-500'><MaterialSymbol icon="" size={15}/>Invalid Token</p> : null}
            <div className='items-end ml-[400px] mt-4'>
              <button type="submit" onClick={handleSubmit} className="flex w-[200px] justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Continue</button>
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

}

export default TwoFactorAuth