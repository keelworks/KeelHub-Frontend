import React from "react";
import { useLocation, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useState, useEffect, useRef } from "react";
import img from "../../assets/defaultUser.jpg";
import { FaInfoCircle, FaChevronDown, FaEllipsisH } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import AccessLevelModal from "./AccessLevelModal";
import UpdateRoleModal from "./UpdateRoleModal";
import ManageAccess from "./ManageAccess";

const AccessLevelBadge = ({ user, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const levels = {
    1: { bg: "bg-green-100", text: "text-green-800" },
    2: { bg: "bg-yellow-100", text: "text-yellow-800" },
    3: { bg: "bg-blue-100", text: "text-blue-800" },
  };

  const { bg, text } = levels[user.access_level] || levels["1"];

  const handleConfirm = (newLevel) => {
    onChange(user.id, newLevel);
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full ${bg} ${text} cursor-pointer`}
        onClick={() => setIsModalOpen(true)}
      >
        <span className="text-sm font-medium">Level {user.access_level}</span>
        <FaChevronDown className="ml-1" />
      </div>
      <AccessLevelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

const UserAccessList = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { role } = location.state || {};
  const [users, setUsers] = useState([]);
  const [nameSort, setNameSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/by-role/${role}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    if (role) {
      fetchUsers();
    }
  }, []);

  const offset = currentPage * usersPerPage;
  const currentUsers = users.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(users.length / usersPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleAccessLevelChange = async (userId, newLevel) => {
    console.log("userId: ", userId);
    console.log("newLevel: ", newLevel);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/users/${userId}`,
        { access_level: newLevel },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, access_level: newLevel } : user
      );
      setUsers(updatedUsers);
      toast.success("Updated Successfully!");
      console.log(`Updated user ${userId} access level to ${newLevel}`);
    } catch (error) {
      console.error("Error updating access level:", error);
      // Here you might want to show an error message to the user
    }
  };

  const sortByName = () => {
    let newOrder;
    if (nameSort) {
      newOrder = [...users].sort((a, b) => {
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
      newOrder = [...users].sort((a, b) => {
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
    setUsers(newOrder);
    setNameSort(!nameSort);
  };

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditAccess = (userId) => {
    // Implement the logic to edit access
    console.log(`Edit access for user ${userId}`);
    setActiveDropdown(null);
  };

  const handleClickUpdateRole = (user) => {
    console.log(`Update role for user ${user.id}`);
    setSelectedUser(user);
    setIsUpdateRoleModalOpen(true);
    setActiveDropdown(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{role} Access</h1>
      {/* <div className="mb-4">
        <button className="text-blue-600 font-semibold">Users</button>
        <button className="text-gray-500 ml-4">Access Options</button>
      </div> */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">
              <button onClick={sortByName}>
                Name <span className="ml-1">⏶⏷</span>
              </button>
            </th>
            <th className="py-2 px-4 border-b text-left">Access Level</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">
                <div className="flex items-center">
                  <img
                    src={user.profile_pic || img}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div>{`${user.first_name} ${user.last_name}`}</div>
                    <div className="text-sm text-gray-500">
                      {user.personal_email || user.username}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                <AccessLevelBadge
                  user={user}
                  onChange={(userId, newLevel) =>
                    handleAccessLevelChange(userId, newLevel)
                  }
                />
              </td>

              <td className="py-2 px-4 border-b">
                <div className="relative">
                  {/* <div className="relative" ref={dropdownRef}> */}
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === user.id ? null : user.id
                      )
                    }
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <FaEllipsisH />
                  </button>
                  {activeDropdown === user.id && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 border border-gray-200">
                      <Link
                        to={"/user-access/manage-access"}
                        state={{ user }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Edit Access
                      </Link>
                      <button
                        onClick={() => handleClickUpdateRole(user)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Update Role
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"flex justify-center mt-4"}
          pageClassName={"mx-1"}
          pageLinkClassName={"px-3 py-2 border rounded hover:bg-gray-100"}
          activeClassName={"bg-blue-500 text-white"}
          previousClassName={"mx-1"}
          nextClassName={"mx-1"}
          previousLinkClassName={"px-3 py-2 border rounded hover:bg-gray-100"}
          nextLinkClassName={"px-3 py-2 border rounded hover:bg-gray-100"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
      <div className="mt-2 text-center text-gray-500">
        Showing {currentUsers.length} of {users.length} results
      </div>
      <UpdateRoleModal
        isOpen={isUpdateRoleModalOpen}
        onClose={() => setIsUpdateRoleModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserAccessList;
