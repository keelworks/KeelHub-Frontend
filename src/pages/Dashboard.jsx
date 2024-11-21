import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BarChartDashboard from "../components/BarChartDashboard";
import { UserContext } from "../context/UserContext";
import { fetchVolunteers } from "../utils/fetchVolunteers"
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { TbDeviceTabletCheck } from "react-icons/tb";
import UpdateStatusModal from "../components/UpdateStatusModal";
import DeleteConfirmationModal from "../components/DeleteVolunteerStatusModal";
import AddVolunteerModalStep1 from "../components/addVolunteer/AddVolunteerStep1"
import AddVolunteerModalStep2 from "../components/addVolunteer/AddVolunteerStep2";
import generateUniqueUsername from "../utils/checkUniqueUsername";
import { addVolunteer } from "../utils/addVolunteer";
import { rejectTask, approveTask, deleteTask } from "../utils/updateTaskStatus";



const Dashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState("");
  const [showToast, setShowToast] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState(0);
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [activeRow, setActiveRow] = useState(-1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStep1Open, setIsStep1Open] = useState(false);
  const [isStep2Open, setIsStep2Open] = useState(false);
  const [volunteerInfo, setVolunteerInfo] = useState({});
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [second, setSecond] = useState(false);
  const [first, setFirst] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const menuRef = useRef(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortOrderDate, setSortOrderDate] = useState(null);

  const handleAccessLevel = (role) => {
    if (role === "HR") return "2";
    else if (role === "admin") return "3";
    else return "1";
  }

  const handleNext = (fullName, role) => {
    setVolunteerInfo({ fullName, role });
    setIsStep2Open(true);
  };

  const handleConfirm = async (info, additionalInfo) => {
    console.log("Volunteer Info:", info);
    console.log("Additional Info:", additionalInfo);
    try {
      const [first_name, last_name] = info.fullName.split(" ");
      const sanitized_first_name = first_name.toLowerCase().replace(/\s+/g, "");
      const sanitized_last_name = last_name.toLowerCase().replace(/\s+/g, "");
      const baseUsername = await generateUniqueUsername(first_name, last_name);
      console.log(baseUsername);

      /// after all things 
      await addVolunteer(
        baseUsername,
        "", // password
        baseUsername, // email
        info.role ?? "volunteer",
        handleAccessLevel(info.role ?? "volunteer"),
        sanitized_first_name,
        sanitized_last_name,
        additionalInfo.city ?? "",
        "", // phone
        "", // profilePic
        additionalInfo.timeZone ?? ""
      );
      toast.success("Volunteer added successfully");
    } catch (e) {

      toast.error(`error : ${e}`);
    }

    /// add volunteer here
  };

  const handleAccept = async (volunteer) => {
    setSelectedVolunteer(volunteer.id)
    await handleAcceptStatus();
  }

  const handleUpdate = (volunteer) => {
    setSelectedVolunteer(volunteer.id); // Store the selected volunteer in state
    setIsUpdateModalOpen(true);

  };

  const handleDelete = (volunteer) => {
    setSelectedVolunteer(volunteer.id); // Store the selected volunteer in state
    setIsDeleteModalOpen(true);
  };

  const handleUpdateStatus = async (status, comments) => {
    try {
      if (status === "Needs Revision") {
        console.log(selectedVolunteer)
        await rejectTask(selectedVolunteer);
      } else {
        await approveTask(selectedVolunteer);
      }
      toast.success("Volunteer Task Updated Successfully");
    } catch (e) {
      toast.error(`error : ${e}`);
    }
    setIsUpdateModalOpen(false)
    // Implement update status logic here
    setActiveRow(-1);
    filteredVolunteers.filter(volunteer => volunteer.id !== selectedVolunteer);
    setSelectedVolunteer(null);
  };

  const handleAcceptStatus = async () => {
    const task_to_accept = currentVolunteers.find(volunteer => volunteer.id === selectedVolunteer).currentTask.taskId
    try{
      await approveTask(task_to_accept);
    } catch (e) {
      console.log(`error: ${e}`)
    }
    setActiveRow(-1);
    filteredVolunteers.filter(volunteer => volunteer.id !== selectedVolunteer);
    setSelectedVolunteer(null);
  }

  const handleDeleteStatus = async () => {
    const task_to_delete = currentVolunteers.find(volunteer => volunteer.id === selectedVolunteer).currentTask.taskId
    try {
      await deleteTask(task_to_delete);
      toast.success("Volunteer Task Deleted Successfully");
    } catch (e) {
      toast.error(`error : ${e}`);
    }
    setIsDeleteModalOpen(false)
    // Implement delete status logic here
    setActiveRow(-1);
    filteredVolunteers.filter(volunteer => volunteer.id !== selectedVolunteer);
    setSelectedVolunteer(null);
  };

  useEffect(() => {
    if (currentUser && currentUser.hasLoggedIn && showToast) {
      toast.info("You have 3 unread notifications!", {
        // This is where I giving custom position to the toast
        position: "top-right",
        style: { top: '80px', right: '10px'},
        onClose: () => setShowToast(false)
      });
    }
    const loadVolunteers = async () => {
      try {
        const data = await fetchVolunteers(currentUser.id, currentUser.role, true);
        console.log('Getting data here')
        console.log(data)
        setVolunteers(data);
        setFilteredVolunteers(data);

      } catch (error) {
        console.error('Error loading volunteers:', error);
        setErrorMessage('Please try again later');
      }
    };

    if (currentUser) {
      loadVolunteers();
    }

    let imageUrl = currentUser.profile_pic;
    if (currentUser.fileobj) {
      imageUrl = `data:${currentUser.fileobj.fileType};base64,${currentUser.fileobj.fileData}`;
    }

    setProfilePicture(imageUrl);
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveRow(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  if (!currentUser) {
    return <Navigate to="/" />;
  }
  const currentVolunteers = useMemo(() => {
    if (selectedColumn === 0) {
      return filteredVolunteers?.filter((data) => data.currentTask && data.currentTask.status === "Pending Review");
    } else {
      return filteredVolunteers?.filter((data) => data.currentTask && data.currentTask.status === "Past Due");
    }
  }, [selectedColumn, filteredVolunteers]);


  const returnFilteredDate = (date) => {
    const day = (date.getUTCDate()).toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth is zero-based
    const year = date.getUTCFullYear().toString();
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  }
  const taskProgressString = (data) => {
    if (data.currentTask) {
      const cleanedString = data.currentTask.progress.replace(/\s+/g, '');
      const result = cleanedString.match(/\d\/\d+/)[0];
      return result;
    } else {
      return "N/A"
    }
  }

  const returnStatusChangeDate = (data) => {
    if (data.currentTask) {
      const dueDate = new Date(data.currentTask.dueDate);
      const updatedAt = new Date(data.currentTask.updatedAt);
      const timeDifference = dueDate.getTime() - updatedAt.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      const formattedUpdatedAt = `${(updatedAt.getMonth() + 1).toString().padStart(2, '0')}/${updatedAt.getDate().toString().padStart(2, '0')}/${updatedAt.getFullYear().toString().slice(-2)}`;
      let action;
      if (daysDifference < 0) {
        // If the task is overdue
        action = `${Math.abs(daysDifference)} days overdue`;
      } else {
        // If the task was completed on time or before the due date
        action = `On time`;
      }

      // Return the formatted string
      return `${formattedUpdatedAt} ${action}`
    }

    return 'N/A';

  }

  const sortByFirstName = () => {
    let sortedVolunteers;
    if (sortOrder === 'asc') {
      sortedVolunteers = [...filteredVolunteers].sort((a, b) => a.firstName.localeCompare(b.firstName));
      setSortOrder('desc');
    } else {
      sortedVolunteers = [...filteredVolunteers].sort((a, b) => b.firstName.localeCompare(a.firstName));
      setSortOrder('asc');
    }
    setFilteredVolunteers(sortedVolunteers);
  };
  const sortByStatusChangeDate = (order) => {
    let sortedVolunteers;
    if (order === 'latest') {
      sortedVolunteers = [...filteredVolunteers].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setSortOrderDate('latest');
    } else {
      sortedVolunteers = [...filteredVolunteers].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      setSortOrderDate('earliest');
    }
    setFilteredVolunteers(sortedVolunteers);
  };

  return (
    <div className="flex flex-col -mt-6">
      <div className="flex flex-col p-4 gap-4 ">
        <h1 className="text-3xl font-sans text-gray-900">Hello, {currentUser.first_name || 'User'}!</h1>
        <div className="flex text-gray-400">Your volunteer activities at a glance</div>
      </div>
      <div className="flex flex-col p-2 gap-4">
        <div className="flex">
          <div className="flex flex-1">
            <button className={`flex w-48 justify-start items-center border-b-2 ${selectedColumn === 0 && "border-blue-600 text-blue-600"} `} onClick={() => {
              setActiveRow(-1);
              setSelectedColumn(0)
            }}>
              Pending Review
            </button>
            <button className={`flex w-48 justify-start items-center border-b-2 ${selectedColumn === 1 && "border-blue-600 text-blue-600"}`} onClick={() => {
              setSelectedColumn(1)
              setActiveRow(-1);
            }}>
              Past Due
            </button>
            <div className="flex border-b-2 border-gray-200 flex-1 w-full" />
            <div className="flex py-2 border-b-2 border-gray-200">
              <button
                onClick={() => setIsStep1Open(true)}
                className="flex  rounded-md text-white border-blue-600 py-2 w-48 justify-center items-center gap-2" style={{
                  backgroundColor: "#0A3FC1",
                }}>
                <span className="text-md">+</span>
                <span className="text-md "> New Volunteer</span>
              </button>
              <AddVolunteerModalStep1
                isOpen={isStep1Open}
                onClose={() => setIsStep1Open(false)}
                onNext={handleNext}
              />

              <AddVolunteerModalStep2
                isOpen={isStep2Open}
                onClose={() => setIsStep2Open(false)}
                volunteerInfo={volunteerInfo}
                onConfirm={handleConfirm}
              />
            </div>
          </div>

        </div>

      </div>
      <div className="flex px-4 h-[230px] overflow-y-auto text-sm">
        <table className="flex flex-col flex-1">
          <thead className="flex max-h-12">
            <tr className="flex flex-1 bg-gray-100 border-b border-gray-200 justify-between">
              <th className="flex p-3 min-w-56 font-semibold text-gray-600 flex-1 text-center  items-center hover:text-gray-900 gap-3 ">
                Name
                <div className="flex flex-col p-2 gap-1" >
                  <button
                    onClick={() => sortByFirstName('asc')}
                  >
                    <span className="flex  flex-col justify-start max-h-4 ">⏶</span>
                  </button>
                  <button
                    onClick={() => sortByFirstName('desc')}
                  >
                    <span className="flex  flex-col   justify-end max-h-3 ">⏷</span>
                  </button>
                </div>

              </th>
              <th className="flex p-3 min-w-44 font-semibold text-gray-600 flex-1 text-center ">
                <button className="flex items-center hover:text-gray-900">
                  Status
                </button>
              </th>
              <th className="flex p-3 font-semibold text-gray-600 flex-1 text-center min-w-56 items-center hover:text-gray-900 gap-3 ">
                {selectedColumn === 1 ? "Due Date" : "Status Change Date"}
                <div className="flex flex-col p-2 gap-1" >
                  <button
                    onClick={() => sortByStatusChangeDate('earliest')}
                  >
                    <span className="flex  flex-col justify-start max-h-4 ">⏶</span>
                  </button>
                  <button
                    onClick={() => sortByStatusChangeDate('latest')}
                  >
                    <span className="flex  flex-col   justify-end max-h-3 ">⏷</span>
                  </button>
                </div>
              </th>
              <th className="flex p-3 font-semibold text-gray-600 flex-1 text-center  hover:text-gray-900 items-center gap-3 min-w-64">
                Task

              </th>
              <th className="flex p-3 font-semibold text-gray-600 flex-1 text-center items-center hover:text-gray-900 gap-3  min-w-28">
                Date Created
                <div className="flex flex-col p-2 gap-1" >
                  <button>
                    <span className="flex flex-col justify-start max-h-4 ">⏶</span>
                  </button>
                  <button>
                    <span className="flex flex-col justify-end max-h-3 ">⏷</span>
                  </button>
                </div>
              </th>
              <th className="flex p-3 font-semibold items-center text-gray-600 flex-1 text-center justify-center max-w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="flex flex-1 flex-col overflow-scroll">
            {filteredVolunteers?.length === 0 && 
              <div className="flex flex-1 justify-center items-center">
                {errorMessage ? (
                  <div className="error-message text-xl">{errorMessage}</div>
                ) : (
                  <>
                    {selectedColumn === 0 && filteredVolunteers?.length === 0 && "No pending review tasks at the moment"}
                    {selectedColumn === 1 && filteredVolunteers?.length === 0 && "No past due tasks to show at the moment"}
                  </>
                )}
              </div>
            }
            {currentVolunteers?.map((volunteer, index) => (
              <tr key={volunteer.id} className="flex flex-1 p-3 border-b  justify-around" style={{
                minHeight: "60px"
              }}>
                <td className="flex flex-1 items-center min-w-56 ">
                  <div className="flex gap-2">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={volunteer.profilePic || 'src/assets/defaultProfile.png'}
                      alt={volunteer.firstName}
                    />
                    <div className="flex flex-col  ">
                      {`${volunteer.firstName} ${volunteer.lastName}`}
                      <span className="text-xs text-gray-500">
                        {volunteer.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="flex flex-1 items-center min-w-44">
                  {volunteer.currentTask.status === "Pending Review" ?
                    <span className=" bg-[#FFDDB5] text-[#FF8A00] rounded-md  border-[#FF8A00] px-2 py-1 bg-opacity-55" style={{
                      borderWidth: "1px",
                    }}>{volunteer.currentTask.status}</span>
                    :
                    <span className=" bg-[#F6A6A4] text-[#EA3331] rounded-md  border-[#EA3331] px-2 py-1 bg-opacity-55" style={{
                      borderWidth: "1px",
                    }}>{volunteer.currentTask.status}</span>
                  }
                </td>
                <td className="flex flex-1 items-center min-w-56 ">{
                  selectedColumn === 1 ?
                    returnStatusChangeDate(volunteer) :
                    returnStatusChangeDate(volunteer)
                }</td>
                <td className="flex flex-1 items-center gap-2 min-w-64 ">
                  <span className="bg-gray-100 rounded-sm p-1">{taskProgressString(volunteer)}</span>
                  <span className="text-sm">{volunteer.currentTask.task_name}</span>
                </td>
                <td className="flex flex-1 pl-4 items-center max-w-52">{returnFilteredDate(new Date(volunteer.createdAt))}</td>
                <td className="flex justify-center flex-1 items-center max-w-40 relative" >
                  {activeRow !== index ? (<button
                    onClick={() => {
                      setActiveRow(index);
                      console.log(index);
                      console.log(activeRow)
                    }}
                  >
                    ...
                  </button>
                  ) : (
                    <span ref={menuRef} className="z-50 mt-16 flex flex-col min-w-40 items-center justify-center align-center bg-white shadow-md rounded-md">
                      <span className="flex gap-2 p-2  hover:bg-gray-100 w-full items-center border-b border-gray-200">
                        <TbDeviceTabletCheck />
                        <button
                          onClick={() => handleAccept(volunteer)}
                        >
                          Accept
                        </button>
                      </span>
                      <span className="flex gap-2 p-2  hover:bg-gray-100 w-full items-center border-b border-gray-200">
                        <MdOutlineEdit />
                        <button
                          onClick={() => handleUpdate(volunteer)}
                        >
                          Request Revision
                        </button>
                      </span>
                      <span className="flex gap-2 p-2  hover:bg-gray-100 w-full items-center text-red-500 ">
                        <FaTrashAlt />
                        <button
                          onClick={() => handleDelete(volunteer)}
                        >
                          Delete
                        </button>
                      </span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-1 pl-4 pt-4 pb-4 overflow-x-auto">
        <BarChartDashboard />
      </div>
      <UpdateStatusModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false)
          setActiveRow(-1)
        }}
        onUpdateStatus={handleUpdateStatus}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setActiveRow(-1)
        }}
        onDelete={handleDeleteStatus}
      />



    </div >
  );
};

export default Dashboard;
