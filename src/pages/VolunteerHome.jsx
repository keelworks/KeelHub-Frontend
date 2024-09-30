import React, { useContext, useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BarChartDashboard from "../components/BarChartDashboard";
import { UserContext } from "../context/UserContext";
import { fetchVolunteers } from "../utils/fetchVolunteers"
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import UpdateStatusModal from "../components/UpdateStatusModal";
import DeleteConfirmationModal from "../components/DeleteVolunteerStatusModal";
import generateUniqueUsername from "../utils/checkUniqueUsername";
import { rejectTask, approveTask, deleteTask } from "../utils/updateTaskStatus";



const VolunteerHome = () => {
  const { currentUser } = useContext(UserContext);
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

  const handleAccessLevel = (role) => {
    if (role === "HR") return "2";
    else if (role === "admin") return "3";
    else return "1";
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


  const [second, setSecond] = useState(false);
  const [first, setFirst] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.hasLoggedIn && showToast) {
      toast.info("You have 3 unread notifications!", {
        onClose: () => setShowToast(false)
      });
    }
    const loadVolunteers = async () => {
      try {
        const data = await fetchVolunteers(currentUser.id, currentUser.role);
        console.log(data)
        setVolunteers(data);
        setFilteredVolunteers(data);

      } catch (error) {
        console.error('Error loading volunteers:', error);
      }
    };

    if (currentUser) {
      loadVolunteers();
    }
  }, [currentUser, showToast]);

  if (!currentUser) {
    return <Navigate to="/" />;
  }
  const currentVolunteers = useMemo(() => {
    if (selectedColumn === 0) {
      return filteredVolunteers?.filter((data) => data.currentTask && data.currentTask.status === "Pending Approval");
    } else {
      return filteredVolunteers?.filter((data) => data.currentTask && data.currentTask.status === "Past Due");
    }
  }, [selectedColumn, filteredVolunteers]);


  const returnFilteredDate = (date) => {
    const day = (date.getUTCDate()).toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth is zero-based
    const formattedDate = `${month}/${day}`;
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
      const formattedUpdatedAt = `${(updatedAt.getMonth() + 1).toString().padStart(2, '0')}/${updatedAt.getDate().toString().padStart(2, '0')}`;
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

  return (
    <div className="flex flex-col  ">
      <div className="flex flex-col p-4 gap-4 ">
        <h1 className="text-3xl font-sans text-gray-900">Hello, {currentUser.first_name || 'User'}!</h1>
        <div className="flex text-gray-400">Your volunteer activities at a glance</div>
      </div>
      <div className="flex flex-col p-2 gap-4">
        <div className="flex">

        </div>

      </div>
      <div className="flex px-4 h-[250px] overflow-y-scroll text-sm">
        <table className="flex flex-col flex-1">
          <thead className="flex max-h-12">
            <tr className="flex flex-1 bg-gray-100 border-b border-gray-200 justify-between">
              <th className="flex p-3 min-w-56 font-semibold text-gray-600 flex-1 text-center  items-center hover:text-gray-900 gap-3 ">
                Task
                <div className="flex flex-col p-2 gap-2" >
                  <button>
                    <span className="flex  flex-col justify-start max-h-4 ">⏶</span>
                  </button>
                  <button>
                    <span className="flex  flex-col   justify-end max-h-3 ">⏷</span>
                  </button>
                </div>
              </th>
              <th className="flex p-3 font-semibold text-gray-600 flex-1 text-center min-w-56 items-center hover:text-gray-900 gap-3 ">
                {selectedColumn === 0 ? "Due Date" : "Status Change Date"}
                <div className="flex flex-col p-2 gap-2" >
                  <button>
                    <span className="flex  flex-col justify-start max-h-4 ">⏶</span>
                  </button>
                  <button>
                    <span className="flex  flex-col   justify-end max-h-3 ">⏷</span>
                  </button>
                </div>
              </th>
              <th className="flex p-3 font-semibold text-gray-600 flex-1 text-center min-w-56 items-center hover:text-gray-900 gap-3 ">
                Status
              </th>
              <th className="flex p-3 font-semibold text-gray-600 flex-1 text-center  items-center hover:text-gray-900 gap-0  min-w-44">
                Date Created
                <div className="flex flex-col p-2 gap-2" >
                  <button>
                    <span className="flex  flex-col justify-start max-h-4 ">⏶</span>
                  </button>
                  <button>
                    <span className="flex  flex-col   justify-end max-h-3 ">⏷</span>
                  </button>
                </div>
              </th>
              <th className="flex p-3 font-semibold items-center text-gray-600 flex-1 text-center justify-center max-w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="flex flex-1 flex-col overflow-scroll">
            {filteredVolunteers?.length === 0 && <div className="flex flex-1 justify-center items-center">
              {selectedColumn === 0 && filteredVolunteers?.length === 0 && "No past due tasks at the moment"}
            </div>
            }
            {currentVolunteers?.map((volunteer, index) => (
              <tr key={volunteer.id} className="flex flex-1 border-b  justify-around" style={{
                minHeight: "80px"
              }}>
                <td className="flex p-3 flex-1 items-center min-w-56 ">
                  <div className="flex gap-2">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={volunteer.profilePic}
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
                <td className="flex p-3 flex-1 items-center min-w-44 ">
                  {volunteer.currentTask.status === "Pending Approval" ?
                    <span className=" bg-[#FFDDB5] text-[#FF8A00] rounded-md  border-[#FF8A00] px-2 py-1 bg-opacity-55" style={{
                      borderWidth: "1px",
                    }}>{volunteer.currentTask.status}</span>
                    :
                    <span className=" bg-[#F6A6A4] text-[#EA3331] rounded-md  border-[#EA3331] px-2 py-1 bg-opacity-55" style={{
                      borderWidth: "1px",
                    }}>{volunteer.currentTask.status}</span>
                  }
                </td>
                <td className="flex p-3 flex-1 items-center min-w-56 ">{
                  selectedColumn === 1 ?
                    returnStatusChangeDate(volunteer) :
                    returnStatusChangeDate(volunteer)
                }</td>
                <td className="flex p-3 flex-1 items-center gap-4 min-w-64 ">
                  <span className="bg-gray-100 rounded-sm p-1 ">{taskProgressString(volunteer)}</span>
                  {volunteer.currentTask.taskName}
                </td>
                <td className="flex p-3 flex-1 items-center max-w-52 ">{returnFilteredDate(new Date(volunteer.createdAt))}</td>
                <td className="flex p-3 justify-center flex-1 items-center max-w-40" >
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
                    <span className=" flex flex-col min-w-40 items-center justify-center  bg-white shadow-md rounded-md z-100">
                      <span className="flex gap-2 p-2  hover:bg-gray-100 w-full items-center border-b border-gray-200">
                        <MdOutlineEdit />
                        <button
                          onClick={() => handleUpdate(volunteer)}
                        >
                          Update Status
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

export default VolunteerHome;
