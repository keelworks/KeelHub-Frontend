import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronDown, HiOutlineBell } from "react-icons/hi";
import { TbGridDots } from "react-icons/tb";
import { UserContext } from "../context/UserContext";
import defaultUser from "../assets/defaultUser.jpg";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout } = useContext(UserContext);
  const [notificationCount, setNotificationCount] = useState(4);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleNotifications = () => {
    navigate("/notifications");
  };

  return (
    <header className="flex justify-between items-center min-w-full bg-white border-b">
      <div className="p-4">Volunteers</div>
      <div className="flex gap-4 p-4 items-center">
        <div className="flex gap-4">
          <button
            className="text-gray-500 hover:text-gray-700 relative"
            onClick={handleNotifications}
          >
            <HiOutlineBell className="h-6 w-6" />
            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-600 rounded-full h-3 w-3 flex items-center justify-center text-white text-xs">
                {notificationCount}
              </div>
            )}
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <TbGridDots className="h-6 w-6" />
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-sm focus:outline-none"
          >
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={currentUser.profile_pic || defaultUser}
              alt={currentUser.first_name}
            />
            <span>
              {currentUser.first_name} {currentUser.last_name}
            </span>
            <HiChevronDown className="h-4 w-4" />
          </button>
          {isLoggedIn && isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button
                onClick={handleProfile}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;