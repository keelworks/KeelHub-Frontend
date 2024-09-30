import { useState } from "react";
import img from "../../assets/defaultUser.jpg";

const AccessLevelModal = ({ isOpen, onClose, user, onConfirm }) => {
  const token = localStorage.getItem("token");
  const [selectedLevel, setSelectedLevel] = useState(user.access_level);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const levels = [
    {
      level: "1",
      description:
        "View limited information, edit personal details, and perform assigned tasks",
    },
    { level: "2", description: "View, edit, add, and delete all information." },
    {
      level: "3",
      description:
        "Full control, including system settings and user management.",
    },
  ];

  if (!isOpen) return null;

  const handleUpdateClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmUpdate = () => {
    onConfirm(selectedLevel);
    setShowConfirmation(false);
    onClose();
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const LevelIcon = ({ level, isSelected }) => (
    <div className="w-12 h-12 flex items-center justify-center">
      <div
        className={`w-10 h-10 ${
          isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-blue-500"
        } flex items-center justify-center relative`}
        style={{
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          transform: "rotate(22.5deg)",
        }}
      >
        <span
          className="text-lg font-bold"
          style={{ transform: "rotate(-22.5deg)" }}
        >
          {level}
        </span>
      </div>
    </div>
  );

  const ConfirmationView = () => (
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Confirm Access Update
      </h3>
      <p className="mb-4">
        Are you sure you want to update the access level for {user.first_name}{" "}
        {user.last_name} to Level {selectedLevel}?
      </p>
      <div className="flex justify-center">
        <button
          onClick={handleCancelConfirmation}
          className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmUpdate}
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          Confirm Update
        </button>
      </div>
    </div>
  );

  const MainView = () => (
    <>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Update Access</h3>
      <div className="flex items-center mb-6">
        <img
          src={user.profile_pic || img}
          alt={user.first_name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="text-sm text-gray-700">
          {user.first_name} {user.last_name} - {user.role}
        </span>
      </div>
      {levels.map((level) => (
        <div
          key={level.level}
          className={`p-3 mb-2 rounded-lg cursor-pointer ${
            selectedLevel === level.level
              ? "border border-blue-500"
              : "border border-gray-200"
          }`}
          onClick={() => setSelectedLevel(level.level)}
        >
          <div className="flex items-center">
            <LevelIcon
              level={level.level}
              isSelected={selectedLevel === level.level}
            />
            <div className="ml-3">
              <p className="font-medium">Level {level.level}</p>
              <p className="text-sm text-gray-500">{level.description}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateClick}
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          Update Access
        </button>
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
      style={{ zIndex: 1000 }}
    >
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {showConfirmation ? <ConfirmationView /> : <MainView />}
      </div>
    </div>
  );
};

export default AccessLevelModal;
