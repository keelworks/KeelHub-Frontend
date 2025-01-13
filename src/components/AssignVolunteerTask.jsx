import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const AssignVolunteerTask = ({ onSuccess, isOpen, onClose }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [taskList, setTaskList] = useState([]);

  const roles = [
    "Software Engineer",
    "UI/UX",
    "Program Manager",
    "Project Manager",
    "Quality Assurance",
    "Cybersecurity Analyst",
    "Product Manager",
    "Data Analyst",
    "DevOps",
    "Instructional Design Engineer",
    "Instructional Design Intern",
    "Instructional Design Program Manager",
    "Administrator",
    "Fundraising/Grant",
    "Human Resources",
    "Marketing",
    "Finance",
    "Board Member",
    "Editor/Writer",
    "Executive Secretary",
    "Others",
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: roles[0],
    task: "",
  });

  useEffect(() => {
    fetchAllTasks();
  }, []);

  useEffect(() => {
    if (taskList.length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        task: taskList[0],
      }));
    }
  }, [taskList]);

  const fetchAllTasks = async () => {
    try {
      const data = await axios.get("http://localhost:3001/api/tasks/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("task data", data);
      const arr = data.data.map((obj) => obj.task_name);
      console.log("Array is", arr);
      setTaskList(arr);
      console.log(taskList);
    } catch (error) {
      console.error("Error fetching task list", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      role: roles[0],
      task: taskList[0],
    });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formdata: ", formData);

    // Validate input fields
    if (!formData.name || !formData.email || !formData.role || !formData.task) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError("");
      const token = localStorage.getItem("token");

      // Fetch all users
      console.log("Fetching all users...");
      const userResponse = await axios.get(
        "http://localhost:3001/api/users/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const users = userResponse.data;
      console.log("Users fetched: ", users);

      // Filter user by email
      const filteredUsers = users.filter(
        (volunteer) => volunteer.username === formData.email
      );

      if (!filteredUsers.length) {
        setError("Volunteer not found. Please check the email address.");
        return;
      }

      const volunteer_id = filteredUsers[0].id;
      console.log("Volunteer ID: ", volunteer_id);

      // Fetch all tasks
      console.log("Fetching tasks...");
      const taskResponse = await axios.get("http://localhost:3001/api/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tasks = taskResponse.data;
      console.log("Tasks fetched: ", tasks);

      // Filter task by name
      const filteredTasks = tasks.filter(
        (task) => task.task_name === formData.task
      );

      if (!filteredTasks.length) {
        setError("Task not found. Please check the task name.");
        return;
      }

      const task_id = filteredTasks[0].id;
      console.log("Task ID: ", task_id);

      console.log("Creating volunteer-task association...");
      const volunteerTaskObj = {
        volunteer_id,
        task_id,
        status: "In Progress",
        is_active: 1,
      };

      //   //Check if value already present
      //   const temp = await axios.get(
      //     "http://localhost:3001/api/volunteer-tasks/admin/volunteers",
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   );
      //   const arrData = temp.data.data;
      //   const result = arrData.filter(
      //     (obj) => obj.id == volunteer_id && obj.currentTask.taskId == task_id
      //   );
      //   if (result.length > 0) {
      //     console.log("Duplicate found");
      //   } else {
      //     console.log("No duplicates");
      //   }

      const volunteerTaskResponse = await axios.post(
        "http://localhost:3001/api/volunteer-tasks/",
        volunteerTaskObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const VolunteerBody = {
        status: "in_progress",
      };
      const volunteerResponse = await axios.put(
        `http://localhost:3001/api/volunteers/${volunteer_id}`,
        VolunteerBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (volunteerTaskResponse.status === 201) {
        console.log("Volunteer-task created successfully.");
        toast.success(
          `New Onboardee: ${formData.name}. A new volunteer has arrived.`
        );
        setSuccess(
          `New Onboardee: ${formData.name}. A new volunteer has arrived.`
        );
      } else {
        throw new Error(
          `Unable to add new volunteer: ${formData.name}. Please try again.`
        );
      }

      //Reload the data in the table on Success
      onSuccess();

      // Reset form data
      setFormData({
        name: "",
        email: "",
        role: roles[0],
        task: taskList[0],
      });

      // Close form after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error occurred: ", error);
      const message =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(message);
      setError(message);
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
        <h1 className="text-xl font-semibold mb-4">
          Add New Volunteer with Task
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="text"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="task"
              className="block text-sm font-medium text-gray-700"
            >
              Task:
            </label>
            <select
              id="task"
              value={formData.task}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {taskList?.map((task, index) => (
                <option key={index} value={task}>
                  {task}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
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

export default AssignVolunteerTask;
