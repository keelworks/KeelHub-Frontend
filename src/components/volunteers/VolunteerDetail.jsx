import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaPencilAlt, FaUserEdit } from "react-icons/fa";
import VolunteerNotes from "./VolunteerNotes";
import UserInfoModal from "../UserInfoModal";
import VolunteerInfoModal from "../VolunteerInfoModal";
// import "../../styles/VolunteerDetail.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "../../assets/defaultUser.jpg";

const VolunteerDetail = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { volunteer, formattedDate } = location.state || {};
  const [currentVolunteer, setCurrentVolunteer] = useState(volunteer);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  const updateCurrentVolunteerStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/volunteers/detail/${currentVolunteer.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("volunteer detail: ", response.data);
      setCurrentVolunteer(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateCurrentVolunteerStatus();
  }, []);

  const handleEditProfile = () => {
    setIsUserModalOpen(true);
    updateCurrentVolunteerStatus();
  };
  const handleEditVolunteerInfo = () => {
    setIsVolunteerModalOpen(true);
    updateCurrentVolunteerStatus();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-sm text-gray-600">
        Volunteers / {currentVolunteer?.first_name}{" "}
        {currentVolunteer?.last_name}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <img
            src={volunteer.profile_pic || img}
            alt={currentVolunteer?.first_name}
            className="w-24 h-24 rounded-full mr-6"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">
                {currentVolunteer?.first_name} {currentVolunteer?.last_name}
                <span className="ml-2 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {currentVolunteer?.Volunteer.status}
                </span>
              </h2>
              <div className="space-x-2">
                <button
                  onClick={handleEditProfile}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <FaPencilAlt className="inline mr-1" /> Edit Profile
                </button>
                <button
                  onClick={handleEditVolunteerInfo}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <FaUserEdit className="inline mr-1" /> Edit Volunteer Info
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">
              {currentVolunteer?.Volunteer.jobTitles[0]?.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {currentVolunteer?.Volunteer.skills &&
                currentVolunteer.Volunteer.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm bg-gray-100 rounded"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Timezone</p>
            <p>{currentVolunteer?.timezone}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Location</p>
            <p>{currentVolunteer?.location}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">KeelWorks Start Date</p>
            <p>{formattedDate}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Agreed Hours</p>
            <p>{currentVolunteer?.Volunteer.time_committed_per_week} / Week</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Email</p>
            <p>{currentVolunteer?.personal_email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Project Information</h3>
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Assign New Project
        </button>
        {/* Add project information table here */}
      </div>

      <VolunteerNotes
        volunteerId={currentVolunteer?.id}
        currentVolunteer={currentVolunteer}
      />

      <ToastContainer />
      <UserInfoModal
        userId={currentVolunteer.id}
        isOpen={isUserModalOpen}
        setIsUserModalOpen={setIsUserModalOpen}
        onRequestClose={() => {
          setIsUserModalOpen(false);
          window.location.reload();
        }}
        isManual={true}
      />
      <VolunteerInfoModal
        userId={currentVolunteer.id}
        isOpen={isVolunteerModalOpen}
        setIsVolunteerModalOpen={setIsVolunteerModalOpen}
        onRequestClose={() => {
          setIsVolunteerModalOpen(false);
          window.location.reload();
        }}
        isManual={true}
      />
    </div>
  );
};

export default VolunteerDetail;
