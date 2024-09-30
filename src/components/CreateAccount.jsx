import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


Modal.setAppElement("#root");

const CreateAccount = ({ isOpen, onClose }) => {
  const blank_user = {
    username: "",
    password: "",
    email: "",
    role: "volunteer",
    status: "Invitation Sent",
    access_level: "1",
    first_name: "",
    last_name: "",
    city: "",
    phone: "",
    profilePic: "",
    timezone: "",
  };
  const [formData, setFormData] = useState(blank_user);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(true);

  const generateRandomPassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prevState) => ({ ...prevState, password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard
      .writeText(formData.password)
      .then(() => {
        // alert(`Password copied to clipboard!`);
        toast.success("Password copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
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
        const token = localStorage.getItem("token");
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

    setFormData((prevState) => ({ ...prevState, username }));
    setSuccess("Username generated successfully!");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formdata: ", formData);

    try {
      const token = localStorage.getItem("token");

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

      toast.success("User created successfully!");
      setSuccess("User created successfully!");
      setFormData(blank_user);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add New Volunteer"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
    >
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h1 className="text-xl font-semibold mb-4">Add New Volunteer</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700"
            >
              First Name:
            </label>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username:
            </label>
            <div className="flex mt-1">
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={generateUsername}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 sm:text-sm"
              >
                Generate Username
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <div className="flex mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 sm:text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 sm:text-sm"
              >
                Generate
              </button>
              <button
                type="button"
                onClick={copyPasswordToClipboard}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 sm:text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role:
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="volunteer">Volunteer</option>
              <option value="project_manager">Project Manager</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
      </div>
    </Modal>
  );
};

export default CreateAccount;
