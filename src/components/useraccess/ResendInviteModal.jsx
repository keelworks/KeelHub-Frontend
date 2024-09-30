import React from "react";
import img from "../../assets/defaultUser.jpg";

const AccessLevelIcon = ({ level }) => (
  <div
    className="w-5 h-5 bg-blue-500 text-white flex items-center justify-center relative"
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

const ResendInviteModal = ({ isOpen, onClose, user, onResend }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Resend Invitation</h2>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center">
            <img
              src={user.profile_pic || img}
              alt={user.first_name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-grow">
              <p className="font-semibold">{`${user.first_name} ${user.last_name} - ${user.role}`}</p>
              <p className="text-sm text-gray-600">{user.username}</p>
            </div>
            <div className="flex items-center">
              <AccessLevelIcon level={user.access_level} />
              <span className="ml-2 text-sm font-medium">
                Level {user.access_level}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onResend}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendInviteModal;
