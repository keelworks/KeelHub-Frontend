import { useContext, useState, useEffect } from "react";
import CreateAccount from "../../components/CreateAccount";
import VolunteersTable from "../../components/volunteers/VolunteersTable";
import ReactPaginate from "react-paginate";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import img from '../../assets/defaultUser.jpg'
import { FaInfoCircle, FaChevronDown, FaEllipsisH } from "react-icons/fa";
import AssignVolunteerTask from "../AssignVolunteerTask";


const OnboardingTasksAdmin = () => {

  const { currentUser } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [volunteers, setVolunteers] = useState([]);
  // const [activeDropdown, setActiveDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [arr_id_roles, setArr_id_roles] = useState([])
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  //for tasks dropdown menu
  const [tasks, setTasks] = useState([])

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const defaultFilter = {
    status:"",
    task:""
  };
  const [filter, setFilter] = useState(defaultFilter);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!['admin', 'hr'].includes(currentUser.role)) {
      return <p className="text-center mt-8 text-lg text-gray-600">You do not have permission to view this page.</p>;
  }
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  // Fetching volunteers for getting their roles seperately because, the fetchAllVolunteers() isn't bring the respective role of the volunteer.
  const fetchAllVolunteersForRole = async() => {
    try {
      const volunteersWithRole = await axios.get(
        `http://localhost:3001/api/volunteers/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("volunteersWithRoles", volunteersWithRole.data.data) 
      // setVolunteersWithRoles(volunteersWithRole?.data?.data)
      let ids = []
      // console.log('here')
      for(let i = 0 ; i<volunteersWithRole.data.data.length;i++){
        ids.push({'id':volunteersWithRole.data.data[i].id, "role":volunteersWithRole.data.data[i].Volunteer.jobTitles[0].title})
      }
      // console.log('arr_id_roles',ids)
      setArr_id_roles(ids)
    } catch (error) {
      console.log(error.response);
    }
  }

  // For fetching volunteers without roles (prob needs to be fixed so that we 
  // do not have to make extra API call for getting the roles of the volunteers)
  const fetchVolunteers = async () => {
    try {
      fetchAllVolunteersForRole();
      const response = await axios.get(
        `http://localhost:3001/api/volunteer-tasks/admin/volunteers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("response.data.data",response.data.data)
      setVolunteers(response.data.data);
      setFilteredVolunteers(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchAllVolunteersForRole();
    fetchVolunteers();
  }, []);


  useEffect(() => {
    const filterVolunteers = () => {
      let result = [...volunteers];
      // console.log("use effect filter.active: ", filter.Active);
      if (filter.Active === "true" || filter.Active === "false") {
        result = result.filter((v) => v.is_active.toString() === filter.Active);
      }

      if (filter.status) {
        result = result.filter((v) => v.Volunteer.status === filter.status);
      }

      if (filter.role) {
        result = result.filter(
          (v) => v.Volunteer.jobTitles[0]?.title === filter.role
        );
      }
      setFilteredVolunteers(result);
    };
    filterVolunteers();
  }, [filter]);

  const [currentPage, setCurrentPage] = useState(0);
  const volunteersPerPage = 8;

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * volunteersPerPage;
  const currentVolunteers = filteredVolunteers.slice(
    offset,
    offset + volunteersPerPage
  );
  const pageCount = Math.ceil(filteredVolunteers.length / volunteersPerPage);

  return (
    <div className="p-6">
      {/* <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Filter by:</span>
          <select
            name="task"
            value={filter.task}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Task</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="unassigned">Unassigned</option>
            <option value="assigned">Assigned</option>
          </select>
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Status</option>
            <option value="Website Redesign">Website Redesign</option>
            <option value="Portfolio Builder">Portfolio Builder</option>
          </select>
        </div>
      </div> */}

<br></br>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Filter by:</span>
            <select
              name="Task"
              value={filter.Task}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Task 1</option>
              <option value={true}>Task 1</option>
              <option value={false}>Task 2</option>
            </select>
            <select
              name="status"
              value={filter.Status}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="unassigned">Unassigned</option>
              <option value="assigned">Assigned</option>
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
              + New Volunteer
            </button>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-gray-200">
          <th className="p-3 text-left font-semibold text-gray-600">
            <button
              // onClick={sortByName}
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
              // onClick={sortByHrs}
              className="flex items-center hover:text-gray-900"
            >
              Due Date <span className="ml-1">⏶⏷</span>
            </button>
          </th>
          <th className="p-3 text-left font-semibold text-gray-600">Task</th>
          <th className="p-3 text-left font-semibold text-gray-600">
          <button
              // onClick={sortByHrs}
              className="flex items-center hover:text-gray-900"
            >
              Date Created <span className="ml-1">⏶⏷</span>
            </button> 
          </th>
          <th className="p-3 text-left font-semibold text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
      {volunteers.map((volunteer,idx) => {
        return (
          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
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
            <div className="text-sm text-gray-600">{volunteer.email}</div>
          </div>
        </div>
      </td>
      <td className={`p-3`}>
        {/* {volunteer.Volunteer.jobTitles[0]?.title} */}
        <span className={`px-2 py-1 rounded text-xs font-medium ${"bg-green-100 text-green-800"}`}>
          {arr_id_roles.find((id) => id.id === volunteer.id)?.role || null}
        </span>
        
      </td>
      {/* <td className="p-3 text-gray-800">{formattedDate}</td> */}
      {/* {console.log(volunteer.currentTask?.status.toLowerCase() )} */}
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            volunteer.currentTask?.status.toLowerCase() === "past due"
              ? "bg-green-100 text-green-800"
              : volunteer.currentTask?.status.toLowerCase() === "invitation sent"
              ? "bg-red-100 text-red-800"
              : volunteer.currentTask?.status.toLowerCase() === "invitation expired"
              ? "bg-yellow-100 text-yellow-800"
              : volunteer.currentTask?.status.toLowerCase() === "to-do"
              ? "bg-blue-100 text-blue-800"
              : volunteer.currentTask?.status.toLowerCase() === "in_progress"
              ? "bg-purple-100 text-purple-800"
              : volunteer.currentTask?.status.toLowerCase() === "done"
              ?  "bg-gray-100 text-yellow-600"// default color
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {volunteer.currentTask?.status}
        </span>
      </td>

      <td className="p-3 text-gray-800">
        {/* {volunteer.Volunteer.time_committed_per_week} */}
        {volunteer.currentTask?.dueDate}
      </td>
      <td className="p-3">
        {volunteer.currentTask?.task_name}
      </td>
      <td className="p-3">
        {volunteer.currentTask?.createdAt.slice(0,10)}
      </td>
      <td className="p-3">
      <div className="relative">
          <button
            // onClick={() => setActiveDropdown(!activeDropdown)}
            onClick={() =>
              setActiveDropdownId(activeDropdownId === volunteer.id ? null : volunteer.id) // Toggle dropdown based on volunteer id
            }
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaEllipsisH />
          </button>
          {activeDropdownId === volunteer.id   && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 border border-gray-200">
              <button
                // onClick={handleEditProfile}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Edit Profile
              </button>
              <button
                // onClick={handleViewProfile}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                View Profile
              </button>
              <button
                // onClick={handleViewProfile}
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
    </table>

      <div className="mt-6">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName={"flex justify-center space-x-2"}
          pageClassName={"px-3 py-2 rounded border hover:bg-gray-100"}
          activeClassName={"bg-blue-500 text-white"}
          previousClassName={"px-3 py-2 rounded border hover:bg-gray-100"}
          nextClassName={"px-3 py-2 rounded border hover:bg-gray-100"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
      <div className="mt-4 text-center text-gray-600">
        Showing {filteredVolunteers.length} results
      </div>

      {/* <CreateAccount isOpen={isModalOpen} onClose={closeModal} /> */}
      <AssignVolunteerTask isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default OnboardingTasksAdmin;
