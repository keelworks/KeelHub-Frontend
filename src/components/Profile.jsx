import React, { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import { FaPencilAlt } from "react-icons/fa";
import img from "../assets/defaultUser.jpg";
import Modal from "react-modal";
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import { formatPhoneNumber } from "../utils/phoneFormatter";
import Cropper from 'react-easy-crop';
import UserInfoModal from "./UserInfoModal";

const Profile = () => {
  const { currentUser, updateUserProfilePic } = useContext(UserContext);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fetchVolunteerInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/volunteers/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVolunteerInfo(response.data);
    } catch (error) {
      console.error("Error fetching volunteer info:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setUserInfo({
        ...currentUser,
        profile_pic_type: currentUser.profile_pic_type || 'google'
      });
      setIsLoading(false);
      
      if (currentUser.role === 'volunteer') {
        fetchVolunteerInfo();
      }
    }
  }, [currentUser]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
    },
    multiple: false
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const uploadImage = async () => {
    if (!imageSrc) return;
    setIsUploading(true);
    
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("profile_pic", croppedImage, 'cropped_profile_pic.jpg');

      const response = await axios.post(
        `http://localhost:3001/api/users/${currentUser.id}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message === "Profile picture updated successfully") {
        updateUserProfilePic(response.data.profile_pic, 'custom');
        setMessage("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading image", error);
      setMessage("Error uploading image");
    } finally {
      setIsUploading(false);
      setImageModalOpen(false);
      setImageSrc(null);
    }
  };

  const getProfilePicSrc = () => {
    if (!userInfo.profile_pic) return img;
    if (userInfo.profile_pic_type === 'google') return userInfo.profile_pic;
    return `http://localhost:3001${userInfo.profile_pic}`; 
  };

  const handleOpenUserModal = () => {
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
  };

  function formatDate(timestamp) {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", options);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <UserInfoModal
        userId={currentUser.id}
        isOpen={isUserModalOpen}
        setIsUserModalOpen={setIsUserModalOpen}
        onRequestClose={handleCloseUserModal}
        isManual={true}
        currentUser={currentUser}
      />
      <Modal
        isOpen={isImageModalOpen}
        contentLabel="User Info"
        className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
        overlayClassName="fixed inset-0"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-5/12 min-h-3/5">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold mb-4">Upload Profile Image</h2>
            <button
              onClick={() => {
                setImageModalOpen(false);
                setImageSrc(null);
              }}
              className="text-2xl -mt-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <div className="flex items-center mb-6 border-2 border-dashed rounded justify-center" style={{ height: '400px' }}>
            {!imageSrc ? 
              <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p className="text-center font-bold pb-2">Select a file or drag and drop here</p>
                <p className="text-center pb-3">JPG, PNG or GIF, file size no more than 10MB</p>
                <p className="text-center">
                  <button className="bg-white hover:bg-blue-700 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Select Image
                  </button>
                </p>
              </div> 
              : 
              <div className="relative w-full h-full">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            }
          </div>
          {imageSrc && 
            <div className="flex justify-between items-center mt-4">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-1/3"
              />
              <div>
                <button 
                  className="bg-white text-red-700 font-semibold px-4 mr-2 border border-red-500 rounded" 
                  onClick={() => setImageSrc(null)}
                >
                  Upload another image
                </button>
                <button 
                  className="bg-blue-700 py-2 px-4 text-white rounded" 
                  onClick={uploadImage}
                >
                  Confirm
                </button>
              </div>
            </div>
          }
          {isUploading && <p>Uploading...</p>}
          {message && <p>{message}</p>}
        </div>
      </Modal>

      <div>
        <div className="bg-white border-b-2 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="relative inline-block">
              <img
                src={getProfilePicSrc()}
                alt={userInfo?.first_name}
                className="w-24 h-24 rounded-full mr-6"
              />
              <div
                className="absolute bottom-0 right-6 text-xs bg-blue-700 border-white border-4 text-white p-1 rounded-full cursor-pointer" 
                onClick={() => setImageModalOpen(true)}
              >
                <FaPencilAlt className="inline m-1" />
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-2xl font-semibold">
                  {userInfo.first_name} {userInfo.last_name}
                </h2>
                <h3>{userInfo.username}</h3>
              </div>
            </div>
          </div>
          <div>
            <p>Start Date: {formatDate(userInfo.created_at)}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2">
            <div className="text-xl font-semibold"> Personal Information</div>
            <div className="text-right">
              <button
                className="bg-blue-700 py-2 px-4 text-white rounded"
                onClick={handleOpenUserModal}
              >
                <FaPencilAlt className="inline mr-1" /> Edit
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm py-6">
            <div>
              <p className="mb-1 text-slate-500">Full Name</p>
              <p className="font-semibold">
                {userInfo.first_name} {userInfo.last_name}
              </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">Role</p>
              <p className="font-semibold"> {userInfo.role} </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">Agreed Hours</p>
              <p className="font-semibold">
                {userInfo.role === 'admin' ? 'N/A' : 
                  volunteerInfo ? `${volunteerInfo.time_committed_per_week} /Week` : 'Loading...'}
              </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">Phone Number</p>
              <p className="font-semibold">{formatPhoneNumber(userInfo.phone)}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm py-6">
            <div>
              <p className="mb-1 text-slate-500">Country of Residence</p>
              <p className="font-semibold"> {userInfo.country} </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">State/Province</p>
              <p className="font-semibold"> {userInfo.state} </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">Timezone</p>
              <p className="font-semibold"> {userInfo.timezone} </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">Visa Extension</p>
              <p className="font-semibold"> {userInfo.visa_type} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;