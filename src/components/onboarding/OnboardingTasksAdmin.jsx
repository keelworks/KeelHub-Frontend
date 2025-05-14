import { useContext, useState, useEffect } from "react";
import CreateAccount from "../../components/CreateAccount";
import VolunteersTable from "../../components/volunteers/VolunteersTable";
import ReactPaginate from "react-paginate";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import img from "../../assets/defaultUser.jpg";
import { FaInfoCircle, FaChevronDown, FaEllipsisH } from "react-icons/fa";
import AssignVolunteerTask from "../AssignVolunteerTask";
import TaskModal from "../TaskModal";
import ConfirmDeleteModal from "../useraccess/ConfirmDeleteModal";
import PaginationButtons from "../PaginationButtons";
import { FiCopy } from "react-icons/fi";

const OnboardingTasksAdmin = () => {
  const { currentUser } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [volunteers, setVolunteers] = useState([]);
  const [reload, setReload] = useState(false);
  // const [activeDropdown, setActiveDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [arr_id_roles, setArr_id_roles] = useState([]);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isConfirmDeletModalOpen, setIsConfirmDeletModalOpen] = useState(false);
  const [currTask, setCurrTask] = useState({ taskName: "", description: "" });
  const [currVolunteerId, setCurrVolunteerId] = useState("");
  const [totalNoOfVolunteersWithActiveTasks, setTotalNoOfVolunteersWithActiveTasks] = useState(0)

  //for tasks dropdown menu
  const [tasks, setTasks] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const defaultFilter = {
    status: "status",
    taskId: 0,
  };
  const [filter, setFilter] = useState(defaultFilter);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!["admin", "hr"].includes(currentUser.role)) {
    return (
      <p className="text-center mt-8 text-lg text-gray-600">
        You do not have permission to view this page.
      </p>
    );
  }

  const refreshTable = () => {
    setReload((prev) => !prev); // Toggle reload state to trigger useEffect
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(name,value)
    setFilter({ ...filter, [name]: value });
  };


  const handleViewProfile = (task_name, description) => {
    setActiveDropdownId(null);
    setIsTemplateModalOpen(true);
    // Update the currTask state
    setCurrTask({
      taskName: task_name || "", // Fallback to an empty string if task_name is undefined
      description: description || "", // Fallback to an empty string if description is undefined
    });
  };

  const handleOnboaringComplete = (volunteerId) => {
    setActiveDropdownId(null);
    setIsConfirmDeletModalOpen(true);
    setCurrVolunteerId(volunteerId);
  };

  const handleConfirmDelete = async () => {
    console.log("inside handleconfirm");
    try {
      const id = currVolunteerId; // Use the current volunteer ID as specified

      console.log("V ID is", id);
      // Update volunteer task status
      const volunteerTaskObj = {
        status: "complete",
      };

      const volunteerTaskResponse = await axios.put(
        `http://localhost:3001/api/volunteer-tasks/${id}`,
        volunteerTaskObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Volunteer task updated:", volunteerTaskResponse.data);

      // Update volunteer status
      const volunteerBody = {
        status: "complete",
      };

      const volunteerResponse = await axios.put(
        `http://localhost:3001/api/volunteers/${id}`,
        volunteerBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Volunteer updated:", volunteerResponse.data);

      // Close the confirmation modal
      setIsConfirmDeletModalOpen(false);

      // Refresh the table
      refreshTable();

      // Optional: Notify the user of success
      alert("Task and volunteer updated successfully.");
    } catch (error) {
      console.error("Error during update:", error);

      // Handle errors and notify the user
      alert("Failed to update the task and volunteer. Please try again.");
    }
  };

  // This function is responsible for fetching all the tasks from the db
  const fetchAllTasks = async () => {
    const response = await axios.get("http://localhost:3001/api/tasks/onboarding");
    setTasks(response.data);
    console.log("Tasks", response.data)
  }
 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10)
  const volunteersPerPage = 8;

  const fetchVolunteers = async () => {
    try {
      // fetchAllVolunteersForRole();
      const response = await axios.get(
        `http://localhost:3001/api/volunteer-tasks/admin/volunteers/paginationAndFilters?page=${currentPage}&pageSize=${pageSize}&taskId=${filter.taskId}&taskStatus=${filter.status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Volunteers Data", response.data.data);
      setVolunteers(response.data.data);
      setFilteredVolunteers(response.data.data);
      setTotalNoOfVolunteersWithActiveTasks(response.data.totalActiveTasks)
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchAllTasks();
    fetchVolunteers();
  }, [reload,filter,currentPage,pageSize]);



  // Pagination logic.
  // Here we are selecting filteredVolunteers array or volunteers array based on if the filter is 
  // applied or not. The filter here are the tasks/status which you will be able to see on this page.


  const handlePageChange = ({ selected }) => {
    console.log("OnPageChange",selected,currentPage)
    currentPage?setCurrentPage((prev)=>prev+1):setCurrentPage((prev)=>prev-1);
    fetchVolunteers();
  };

  const offset = currentPage * volunteersPerPage;
  const currentVolunteers = ((filter.status || filter.task)? filteredVolunteers : volunteers).slice(
    offset,
    offset + volunteersPerPage
  );
  const pageCount = Math.ceil(((filter.status || filter.task)? filteredVolunteers : volunteers).length / volunteersPerPage);


  // Displaying the x/y tasks in the tasks column using the following piece of code
  const taskProgressString = (data) => {
    if (data.currentTask && data.currentTask.progress) {
      const cleanedString = data.currentTask.progress.replace(/\s+/g, '');
      const match = cleanedString.match(/(\d+)\/\d+/); // Get number before the slash
      if (match) {
        const current = match[1];          // Number before slash
        const total = tasks.length || 0;   // Total from tasks array
        return `${current}/${total}`;
      }
    }
  
    return "N/A";
  };
  //Applying sort on columns name, dueDate and dateCreated.

  // SORT BY NAME
  const[nameSort,setNameSort] = useState(false);
  const sortByName = () => {
    console.log("here")
    let newOrder;
    let arr = (filter.status || filter.task)? filteredVolunteers : volunteers
    console.log(arr)
    if (nameSort) {
      newOrder = [...arr].sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toUpperCase();
        const nameB = `${b.firstName} ${b.lastName}`.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });
    } else {
      newOrder = [...arr].sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toUpperCase();
        const nameB = `${b.firstName} ${b.lastName}`.toUpperCase();

        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }

        return 0;
      });
    }
    (filter.status || filter.task)? setFilteredVolunteers(newOrder) : setVolunteers(newOrder)
    // setFilteredVolunteers(newOrder);
    setNameSort(!nameSort);
  };

  // SORT BY DUE DATE

  const [dueDateSort,setDueDateSort] = useState(false)

  const sortByDueDate = () => {
    let newOrder;
    let arr = (filter.status || filter.task)? filteredVolunteers : volunteers
    if (dueDateSort) {
      newOrder = [...arr].sort((a, b) => {
        const dateA = new Date(a.currentTask.dueDate);
        const dateB = new Date(b.currentTask.dueDate);
        return dateA - dateB;
      });
    } else {
      newOrder = [...arr].sort((a, b) => {
        const dateA = new Date(a.currentTask.dueDate);
        const dateB = new Date(b.currentTask.dueDate);
        return dateB - dateA;
      });
    }
    (filter.status || filter.task)? setFilteredVolunteers(newOrder) : setVolunteers(newOrder)
    setDueDateSort(!dueDateSort);
    // setFilteredVolunteers(newOrder);
  };

  // SORT BY DATE CREATED

  const [createDateSort,setCreateDateSort] = useState(false)

  const sortByCreateDate = () => {
    let newOrder;
    let arr = (filter.status || filter.task)? filteredVolunteers : volunteers
    console.log(arr)
    if (createDateSort) {
      newOrder = [...arr].sort((a, b) => {
        const dateA = new Date(a.currentTask.createdAt);
        const dateB = new Date(b.currentTask.createdAt);
        return dateA - dateB;
      });
    } else {
      newOrder = [...arr].sort((a, b) => {
        const dateA = new Date(a.currentTask.createdAt);
        const dateB = new Date(b.currentTask.createdAt);
        return dateB - dateA;
      });
    }
    (filter.status || filter.task)? setFilteredVolunteers(newOrder) : setVolunteers(newOrder)
    setCreateDateSort(!createDateSort);
    console.log("complete")
    // setFilteredVolunteers(newOrder);
  };

  const onCopyTemplate = (task) => {
    if (task) {
      navigator.clipboard.writeText(task)
        .then(() => alert('Template copied to clipboard!'))
        .catch(err => console.error('Failed to copy template: ', err));
    }
  };



  return (
    <div className="p-3 mb-20">
       <h1 className="text-5xl font-medium mb-2">Tasks</h1>
       <span className="text-gray-500 text-sm ml-1">Volunteer's OnBoarding Tracker</span>
      <br></br>
      <div>
        <div className="flex justify-between items-center mb-6 mt-10">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Filter by:</span>
            <select
                name="taskId"
                value={filter.task}
                onChange={handleFilterChange}
                className="w-28 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Task</option>
                {tasks &&
                  tasks.map((task, idx) => (
                    <option key={idx} value={task.id}>
                      {`${idx+1}/${tasks.length} - ${task.task_name}`}
                    </option>
                  ))}
            </select>

            {/* <td className="flex flex-1 items-center pt-4 gap-2 min-w-64 ">
                  <span className="bg-gray-100 rounded-sm p-1">{taskProgressString(volunteer)}</span>
                  <span className="text-sm">{volunteer.currentTask.task_name}</span>
                </td> */}
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div></div><option value="status">Status</option>
              <option value="To-Do">To-Do</option>
              <option value="Past Due">Past Due</option>
              <option value="Done">Done</option>
              <option value="Invitation Expired">Invitation Expired</option>
              <option value="Invitation Sent">Invitation Sent</option>
              <option value="In Progress">In Progress</option>
              {/* <span className="bg-gray-100 rounded-sm p-1">{taskProgressString(volunteer)}</span>
                  <span className="text-sm">{volunteer.currentTask.task_name}</span> */}
            </select>
            <button
              onClick={() => {
                setFilter(defaultFilter);
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filter
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={openModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + Onboard Volunteer
            </button>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="p-3 text-left font-semibold text-gray-600">
              <button
                onClick={sortByName}
                className="flex items-center hover:text-gray-900"
              >
                Name <span className="ml-1">⏶⏷</span>
              </button>
            </th>
            <th className="p-3 text-left font-semibold text-gray-600">
              <button
                // onClick={sortByRole}
                className="flex items-center hover:text-gray-900"
              >
                Role
              </button>
            </th>
            <th className="p-3 text-left font-semibold text-gray-600">
              <button
                // onClick={sortByStartDate}
                className="flex items-center hover:text-gray-900"
              >
                Status
              </button>
            </th>
            <th className="p-3 text-left font-semibold text-gray-600">
              <button
                onClick={sortByDueDate}
                className="flex items-center hover:text-gray-900"
              >
                Due Date <span className="ml-1">⏶⏷</span>
              </button>
            </th>
            <th className="p-3 text-left font-semibold text-gray-600">Task</th>
            <th className="p-3 text-left font-semibold text-gray-600">
              <button
                onClick={sortByCreateDate}
                className="flex items-center hover:text-gray-900"
              >
                Date Created <span className="ml-1">⏶⏷</span>
              </button>
            </th>
            <th className="p-3 text-left font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {((filter.status || filter.task)? filteredVolunteers : volunteers).map((volunteer, idx) => {
            return (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3">
                  <div className="flex items-center">
                    <img
                      // src={volunteer.avatar_url}
                      src={volunteer.profile_pic || img}
                      alt={`${volunteer.first_name} ${volunteer.last_name}`}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      {volunteer.firstName} {volunteer.lastName}
                      <div className="text-sm text-gray-600">
                        {volunteer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`p-3`}>
                  {/* {volunteer.Volunteer.jobTitles[0]?.title} */}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${"bg-green-100 text-green-800"}`}
                  >
                      {volunteer.jobTitles[0]}
                  </span>
                </td>
                {/* <td className="p-3 text-gray-800">{formattedDate}</td> */}
                {/* {console.log(volunteer.currentTask?.status.toLowerCase() )} */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      volunteer.currentTask?.status.toLowerCase() === "past due"
                        ? "bg-red-100 text-red-600 outline outline-[1px]"
                        : volunteer.currentTask?.status.toLowerCase() ===
                          "invitation sent"
                        ? "bg-blue-100 text-blue-800 outline outline-[1px]"
                        : volunteer.currentTask?.status.toLowerCase() ===
                          "invitation expired"
                        ? "bg-grey-100 text-grey-800 outline outline-[1px]"
                        : volunteer.currentTask?.status.toLowerCase() ===
                          "to-do"
                        ? "bg-yellow-100 text-yellow-800 outline outline-[1px]"
                        : volunteer.currentTask?.status.toLowerCase() ===
                          "in progress"
                        ? "bg-orange-100 text-orange-800 outline outline-[1px]"
                        : volunteer.currentTask?.status.toLowerCase() === "done"
                        ? "bg-gray-100 text-yellow-600 outline outline-[1px]" // default color
                        : "bg-gray-100 text-gray-800 outline outline-[1px]"
                    }`}
                  >
                    {volunteer.currentTask?.status}
                  </span>
                </td>

                <td className="p-3 text-gray-800">
                  {/* {volunteer.Volunteer.time_committed_per_week} */}
                  {/* // Added ternary operator to check if the due date being fetched is string or object. If there is no due date 
                  // in the db it is coming as an object which is causing problem as we cannot slice an obj. Hence the check is added.
                  // Ideally the due date should always be present in the task. This check is added as there is absence of due date currently. */}
                  {volunteer.currentTask?.dueDate && typeof volunteer.currentTask.dueDate=="string"?
                      volunteer.currentTask?.dueDate.slice(5,7)+"/"+volunteer.currentTask?.dueDate.slice(8,10)+"/"+volunteer.currentTask?.dueDate.slice(2,4)
                  :
                      null
                  }
                </td>
                {/* <td className="p-3">{volunteer.currentTask?.task_name}</td> */}
                <td className="pt-4 min-w-64">
                  <div className="flex items-center gap-2 w-full">
                    <span className="bg-gray-100 rounded-sm p-1 whitespace-nowrap">{taskProgressString(volunteer)}</span>

                    <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                      {volunteer.currentTask.task_name}
                    </span>

                    <button
                      type="button"
                      className="inline-flex justify-center items-center"
                      onClick={() => onCopyTemplate(volunteer.currentTask.task_name)}
                    >
                      <FiCopy className="text-base" />
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  {volunteer.currentTask?.createdAt.slice(5,7)+"/"+volunteer.currentTask?.createdAt.slice(8,10)+"/"+volunteer.currentTask?.createdAt.slice(2,4)}
                </td>
                <td className="p-3">
                  <div className="relative">
                    <button
                      // onClick={() => setActiveDropdown(!activeDropdown)}
                      onClick={
                        () =>
                          setActiveDropdownId(
                            activeDropdownId === volunteer.id
                              ? null
                              : volunteer.id
                          ) // Toggle dropdown based on volunteer id
                      }
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FaEllipsisH />
                    </button>
                    {activeDropdownId === volunteer.id && (
                      <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 border border-gray-200">
                        <button
                          // onClick={handleEditProfile}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Edit Task
                        </button>
                        <button
                          onClick={() =>
                            handleViewProfile(
                              volunteer.currentTask?.task_name,
                              volunteer.currentTask?.description
                            )
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          View Task
                        </button>
                        <button
                          onClick={() => handleOnboaringComplete(volunteer.id)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Onboarding Complete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="mt-10">
        <tr>
          <td colSpan="100%" className="pt-6">
            <div className="flex justify-between items-center px-4 py-2 w-full">
              {/* Left Section */}
              <div className="flex items-center gap-2">
                <span className="mt-1">Rows per page</span>
                <select
                  name="number"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-16 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Center Section */}
              <div className="ml-auto">
                {`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalNoOfVolunteersWithActiveTasks)} of ${totalNoOfVolunteersWithActiveTasks}`}
              </div>

              {/* Right Section */}
              <div className="ml-auto">
              <PaginationButtons 
                page={currentPage} 
                setPage={setCurrentPage} 
                totalPages={Math.ceil(totalNoOfVolunteersWithActiveTasks / pageSize)} 
              />
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
      </table>


      {/* <CreateAccount isOpen={isModalOpen} onClose={closeModal} /> */}
      <AssignVolunteerTask
        onSuccess={refreshTable}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      <TaskModal
        isOpen={isTemplateModalOpen}
        closeModal={() => setIsTemplateModalOpen(false)}
        initialTask={currTask}
        editView={true}
        isTemplateView={false}
        // onCopyTemplate={handleCopyTemplate}
      />
      <ConfirmDeleteModal
        isOpen={isConfirmDeletModalOpen}
        OnboardingCompleteConfirmation={true}
        onClose={() => setIsConfirmDeletModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default OnboardingTasksAdmin;
