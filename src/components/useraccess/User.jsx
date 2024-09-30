import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import img from "../../assets/defaultUser.jpg";
import { FaInfoCircle, FaChevronDown, FaEllipsisH } from "react-icons/fa";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ResendInviteModal from "./ResendInviteModal";
import axios from "axios";
import { toast } from "react-toastify";
import { sendEmail } from "../../context/utils";

const User = ({ user }) => {
  const token = localStorage.getItem("token");
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "invitation sent":
        return "bg-blue-100 text-blue-800";
      case "account created":
        return "bg-green-100 text-green-800";
      case "invite expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccessLevelIcon = (level) => {
    return (
      <div
        className={`w-5 h-5 ${"bg-blue-500 text-white"} flex items-center justify-center relative`}
        style={{
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          transform: "rotate(22.5deg)",
        }}
      >
        <span className="text-sm" style={{ transform: "rotate(-22.5deg)" }}>
          {level}
        </span>
      </div>
    );
  };

  const handleDeleteInvite = () => {
    setIsDeleteModalOpen(true);
    setActiveDropdown(false);
  };
  const confirmDelete = async () => {
    try {
      if (user.role === "volunteer") {
        const resp = await axios.delete(
          `http://localhost:3001/api/volunteers/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        const response = await axios.delete(
          `http://localhost:3001/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }

    // toast.success("Delete Successfully!");
    setIsDeleteModalOpen(false);
    window.location.reload();
  };

  const handleResendInvite = () => {
    setIsResendModalOpen(true);
    setActiveDropdown(false);
  };

  const confirmResend = () => {
    sendEmail(user.personal_email);
    toast.success("Invitation Resent Successfully!");
    setIsResendModalOpen(false);
  };

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td className="p-3">
          <div className="flex items-center">
            <img
              src={user.profile_pic || img}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="font-medium">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-sm text-gray-600">{user.username}</div>
            </div>
          </div>
        </td>
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(
              user.status
            )}`}
          >
            {user.status}
          </span>
        </td>
        <td className="p-3">
          <div className="flex items-center">
            <div className="mr-2">{getAccessLevelIcon(user.access_level)}</div>
            <span className="mr-2">Level {user.access_level}</span>
            <FaInfoCircle className="text-gray-400" />
          </div>
        </td>
        <td className="p-3">{user.role}</td>
        <td className="p-3">
          {new Date(user.created_at).toLocaleDateString()}
        </td>
        <td className="p-3">
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(!activeDropdown)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaEllipsisH />
            </button>
            {activeDropdown && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 border border-gray-200">
                <button
                  onClick={handleResendInvite}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Resend Invite
                </button>
                <button
                  onClick={handleDeleteInvite}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Delete Invite
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        userName={`${user.first_name} ${user.last_name}`}
      />
      <ResendInviteModal
        isOpen={isResendModalOpen}
        onClose={() => setIsResendModalOpen(false)}
        user={user}
        onResend={confirmResend}
      />
    </>
  );
};

export default User;
