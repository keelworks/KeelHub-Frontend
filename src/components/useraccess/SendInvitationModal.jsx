import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { sendEmail } from "../../context/utils";

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

const SendInvitationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const blank_user = {
    first_name: "",
    last_name: "",
    username: "",
    personal_email: "",
    role: "volunteer",
    access_level: "1",
    password: "password",
    status: "Invitation Sent",
  };

  const token = localStorage.getItem("token");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [formData, setFormData] = useState(blank_user);
  const [error, setError] = useState("");

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

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const checkFormValidity = () => {
      const {
        first_name,
        last_name,
        username,
        personal_email,
        role,
        access_level,
      } = formData;
      setIsFormValid(
        first_name &&
          last_name &&
          username &&
          personal_email &&
          role &&
          access_level
      );
    };

    checkFormValidity();
  }, [formData]);

  useEffect(() => {
    if (isOpen) {
      setFormData(blank_user);
      setError("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLevelClick = (level) => {
    setFormData((prev) => ({ ...prev, access_level: level }));
  };

  const generateUsername = async () => {
    const { first_name, last_name } = formData;
    if (!first_name || !last_name) {
      setError("Please enter both first name and last name");
      return;
    }

    const sanitizedfirst_name = first_name.toLowerCase().replace(/\s+/g, "");
    const sanitizedlast_name = last_name.toLowerCase().replace(/\s+/g, "");
    const baseUsername = `${sanitizedfirst_name}.${sanitizedlast_name}@keelworks.org`;
    //const baseUsername = `${first_name.toLowerCase()}.${last_name.toLowerCase()}@keelworks.org`;
    let username = baseUsername;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/check-username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.isAvailable) {
          isUnique = true;
        } else {
          username = `${first_name.toLowerCase()}.${last_name.toLowerCase()}${counter}@keelworks.org`;
          counter++;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setError("Failed to generate username. Please try again.");
        return;
      }
    }

    toast.success("Generate Username Successfully", { autoClose: 1000 });
    setFormData((prevState) => ({ ...prevState, username }));
  };

  // Send Email
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.warning("Please fill in all required fields.", { autoClose: 2000 });
      return;
    }
    sendEmail(formData.personal_email);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("new user: ", response.data);
      if (formData.role === "volunteer") {
        const newVolunteer = {
          volunteer_id: response.data.data.id,
          skills: [],
        };
        const response2 = await axios.post(
          "http://localhost:3001/api/volunteers",
          newVolunteer,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("new volunteer: ", response2.data);
      }

      toast.success(
        "User created successfully! Invitation email has been sent!"
      );
      setFormData(blank_user);
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Invite User</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <div className="flex">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                readOnly
                required
                className="flex-grow p-2 border rounded-l bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed"
                placeholder="Please generate username automatically"
              />
            </div>
            <button
              type="button"
              onClick={generateUsername}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Generate Username
            </button>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Email *
              </label>
              <input
                type="email"
                name="personal_email"
                value={formData.personal_email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                placeholder="Invitation email will be sent to this address."
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="volunteer">Volunteer</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a level of access that this user will have
            </label>
            {levels.map((level) => (
              <div
                key={level.level}
                className={`p-3 mb-2 rounded-lg cursor-pointer ${
                  formData.access_level === level.level
                    ? "border border-blue-500"
                    : "border border-gray-200"
                }`}
                onClick={() => handleLevelClick(level.level)}
              >
                <div className="flex items-center">
                  <LevelIcon
                    level={level.level}
                    isSelected={formData.access_level === level.level}
                  />
                  <div className="ml-3">
                    <p className="font-medium">Level {level.level}</p>
                    <p className="text-sm text-gray-500">{level.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              //   disabled={!isFormValid}
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendInvitationModal;
