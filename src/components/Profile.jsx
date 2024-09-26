import React, { useState, useContext, useEffect } from "react";
import UserInfoModal from "./UserInfoModal";
import VolunteerInfoModal from "./VolunteerInfoModal";
import { UserContext} from "../context/UserContext";
import { FaPencilAlt, FaUserEdit } from "react-icons/fa";
import img from "../assets/defaultUser.jpg";
import Modal from "react-modal";
import { FileUploader } from "react-drag-drop-files";
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import { formatPhoneNumber } from "../utils/phoneFormatter";

const Profile = () => {
  const { currentUser, updateUserProfilePic } = useContext(UserContext);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [userInfo, setUserInfo] = useState({
    ...currentUser,
    profile_pic_type: currentUser.profile_pic_type || 'google'
  });
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileTypes = ["JPG", "PNG", "GIF"];

  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
    },
    onDrop: acceptedFiles => {
      setFile(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const handleUserSave = () => {
    setMessage("User info saved successfully");
  };

  const handleVolunteerSave = () => {
    setMessage("Volunteer info saved successfully");
  };

  const handleOpenUserModal = () => {
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
  };

  const handleOpenVolunteerModal = () => {
    setIsVolunteerModalOpen(true);
  };

  const handleCloseVolunteerModal = () => {
    setIsVolunteerModalOpen(false);
  };

  const getProfilePicSrc = () => {
    if (!userInfo.profile_pic) return img;
    if (userInfo.profile_pic_type === 'google') return userInfo.profile_pic;
    return `http://localhost:3001${userInfo.profile_pic}`; 
  };

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
      setUserInfo(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'volunteer') {
      fetchVolunteerInfo();
    }
  }, [currentUser]);

  const uploadImage = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("profile_pic", file[0]);
  
    try {
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
      setFile(null);
    }
  };

  function formatDate(timestamp) {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", options);
  }

  // Copyconst handleSyncWithGoogle = async () => {
  //   try {
  //     setIsUploading(true);
  //     const response = await axios.post(
  //       `http://localhost:3001/api/users/${currentUser.id}/sync-google-picture`,
  //       {},
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  
  //     if (response.data.success) {
  //       setUserInfo(prevState => ({
  //         ...prevState,
  //         profile_pic: response.data.profile_pic,
  //         profile_pic_type: 'google'
  //       }));
  //       setMessage("Profile picture synced with Google successfully");
  //     } else {
  //       setMessage("Error syncing with Google profile picture");
  //     }
  //   } catch (error) {
  //     console.error("Error syncing with Google profile picture", error);
  //     setMessage("Error syncing with Google profile picture");
  //   } finally {
  //     setIsUploading(false);
  //     setImageModalOpen(false);
  //   }
  // };

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
                setFile(null)
              }}
              className="text-2xl -mt-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <div className="flex items-center mb-6 border-2 border-dashed rounded justify-center min-h-80">
            {file == null ? 
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
              : <img style={{maxHeight:"38vh"}} src={file[0].preview} alt="Preview" />
            }
          </div>
          {isUploading && <p>Uploading...</p>}
          {message && <p>{message}</p>}
          {file != null && 
            <div className="flex justify-end">
              <button 
                className="bg-white text-red-700 font-semibold px-4 mr-2 border border-red-500 rounded" 
                onClick={() => setFile(null)}
              >
                Upload another image
              </button>
              <button 
                className="bg-blue-700 py-2 px-4 text-white rounded" 
                onClick={(e) => {
                  e.preventDefault();
                  uploadImage();
                }}
              >
                Confirm
              </button>
            </div>
          }
        </div>
      </Modal>

      <div>
        <div className="bg-white border-b-2 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="relative inline-block">
              <img
                src={getProfilePicSrc()}
                alt={currentUser?.first_name}
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
                  {currentUser.first_name} {currentUser.last_name}
                </h2>
                <h3>{currentUser.username}</h3>
              </div>
            </div>
          </div>
          <div>
            <p>Start Date: {formatDate(currentUser.created_at)}</p>
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
                {currentUser.first_name} {currentUser.last_name}
              </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">Role</p>
              <p className="font-semibold"> {currentUser.role} </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">Agreed Hours</p>
              <p className="font-semibold">
                {currentUser.role === 'admin' ? 'N/A' : 
                  volunteerInfo ? `${volunteerInfo.time_committed_per_week} /Week` : 'Loading...'}
              </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">Phone Number</p>
              <p className="font-semibold">{formatPhoneNumber(currentUser.phone)}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm py-6">
            <div>
              <p className="mb-1 text-slate-500">Country of Residence</p>
              <p className="font-semibold"> {currentUser.country} </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">State/Province</p>
              <p className="font-semibold"> {currentUser.state} </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">Timezone</p>
              <p className="font-semibold"> {currentUser.timezone} </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">USA Visa Type</p>
              <p className="font-semibold"> {currentUser.visa_type} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;