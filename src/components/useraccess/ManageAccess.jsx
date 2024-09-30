import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ManageAccess = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { user } = location.state || {};
  const [targetUser, setTargetUser] = useState(user);

  const accessOptions = [
    {
      key: "placeholder1",
      label: "Create new employee account",
      category: "Employees",
    },
    {
      key: "placeholder2",
      label: "See full employee information",
      category: "Attachments",
    },
    {
      key: "placeholder3",
      label: "Edit employee information",
      category: "Attachments",
    },
    {
      key: "placeholder4",
      label: "Delete employee information",
      category: "Attachments",
    },
    {
      key: "placeholder5",
      label: "Upload attachments",
      category: "General",
    },
  ];

  const [accessState, setAccessState] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTargetUser(response.data);
        initializeAccessState(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const initializeAccessState = (userData) => {
    const initialState = {};
    accessOptions.forEach((option) => {
      initialState[option.key] = userData[option.key] || false;
    });
    setAccessState(initialState);
  };

  const handleCheckboxChange = async (key) => {
    const newState = { ...accessState, [key]: !accessState[key] };
    setAccessState(newState);

    try {
      await axios.put(
        `http://localhost:3001/api/users/${user.id}`,
        { [key]: newState[key] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Update Access Successfully!", { autoClose: 1000 });
    } catch (error) {
      console.log(error);
      // Revert the change if the API call fails
      setAccessState(accessState);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {targetUser.first_name} {targetUser.last_name} Access
      </h1>
      {/* <div className="mb-4">
        <span className="mr-4 text-blue-600 cursor-pointer">Users</span>
        <span className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer">
          Access Options
        </span>
      </div> */}
      {Object.entries(
        accessOptions.reduce((acc, option) => {
          if (!acc[option.category]) {
            acc[option.category] = [];
          }
          acc[option.category].push(option);
          return acc;
        }, {})
      ).map(([category, options]) => (
        <div key={category} className="mb-6">
          <h2 className="text-lg font-semibold bg-gray-100 p-2 mb-2">
            {category}
          </h2>
          {options.map((option) => (
            <div key={option.key} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={option.key}
                checked={accessState[option.key] || false}
                onChange={() => handleCheckboxChange(option.key)}
                className="mr-2"
              />
              <label htmlFor={option.key}>{option.label}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ManageAccess;
