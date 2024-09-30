import { useContext, useState, useEffect } from "react";
import CreateAccount from "../components/CreateAccount";
import ReactPaginate from "react-paginate";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import UsersTable from "../components/useraccess/UsersTable";
import SendInvitationModal from "../components/useraccess/SendInvitationModal";

const InviteUser = () => {
  const { currentUser } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [targetUsers, setTargetUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);

  const openInvitationModal = () => setIsInvitationModalOpen(true);
  const closeInvitationModal = () => setIsInvitationModalOpen(false);

  const defaultFilter = {
    accessLevel: "",
    status: "",
    role: "",
  };
  const [filter, setFilter] = useState(defaultFilter);
  const [nameSort, setNameSort] = useState(false);
  const [inviteDateSort, setInviteDateSort] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/not-logged-in`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setTargetUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Filter
  useEffect(() => {
    const filterUsers = () => {
      let result = [...targetUsers];
      if (filter.accessLevel) {
        result = result.filter((u) => u.access_level === filter.accessLevel);
      }

      if (filter.status) {
        result = result.filter((u) => u.status === filter.status);
      }

      if (filter.role) {
        result = result.filter((u) => u.role === filter.role);
      }
      setFilteredUsers(result);
    };
    filterUsers();
  }, [filter]);

  const sortByName = () => {
    let newOrder;
    if (nameSort) {
      newOrder = [...filteredUsers].sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toUpperCase();
        const nameB = `${b.first_name} ${b.last_name}`.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });
    } else {
      newOrder = [...filteredUsers].sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toUpperCase();
        const nameB = `${b.first_name} ${b.last_name}`.toUpperCase();

        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }

        return 0;
      });
    }
    setFilteredUsers(newOrder);
    setNameSort(!nameSort);
  };

  const sortByInviteDate = () => {
    let newOrder;
    if (inviteDateSort) {
      newOrder = [...filteredUsers].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA - dateB;
      });
    } else {
      newOrder = [...filteredUsers].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
    }
    setInviteDateSort(!inviteDateSort);
    setFilteredUsers(newOrder);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 8;

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-6">
      <h1>Invite Users</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Filter by:</span>
          <select
            name="accessLevel"
            value={filter.accessLevel}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Access Level</option>
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>
          <select
            name="role"
            value={filter.role}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Role</option>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
          </select>
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Status</option>
            <option value="Invitation Sent">Invitation Sent</option>
            <option value="Invite Expired">Invite Expired</option>
          </select>

          <button
            onClick={() => {
              setFilteredUsers(targetUsers);
              setFilter(defaultFilter);
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear Filter
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={openInvitationModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Create Invite
          </button>
        </div>
      </div>

      <UsersTable
        users={currentUsers}
        sortByName={sortByName}
        sortByInviteDate={sortByInviteDate}
      />

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
        Showing {filteredUsers.length} results
      </div>

      <SendInvitationModal
        isOpen={isInvitationModalOpen}
        onClose={() => {
          setIsInvitationModalOpen(false);
        }}
      />
    </div>
  );
};

export default InviteUser;
