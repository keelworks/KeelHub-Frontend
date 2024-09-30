import React from "react";
import { MdChevronRight } from "react-icons/md";
import img from "../../assets/defaultUser.jpg";
import { Link } from "react-router-dom";

const UserAvatar = ({ user, index, totalAvatars }) => (
  <img
    src={user.profile_pic || img}
    alt={`${user.first_name} ${user.last_name}`}
    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
    style={{
      marginLeft: index > 0 ? "-20px" : "0",
      zIndex: totalAvatars - index,
      position: "relative",
    }}
  />
);

const RoleCard = ({ role, count, isAdmin, users }) => {
  const displayedAvatars = users.slice(0, 5);
  const totalAvatars = count > 5 ? 6 : count; // 4 if we have the +X icon, otherwise just the number of avatars

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold capitalize">{role}</h3>
        <Link
          to={`/user-access/list`}
          state={{ role }}
          className="text-blue-500 hover:text-blue-600 flex items-center"
        >
          View Details
          <MdChevronRight className="ml-1" />
        </Link>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {isAdmin ? "Administrator Role" : "Non - Administrator Role"}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700">{count} Accounts</span>
        <div className="flex items-center">
          <div className="flex flex-row-reverse">
            {count > 5 && (
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-xs font-medium"
                style={{
                  marginLeft: "-10px",
                  zIndex: totalAvatars,
                  position: "relative",
                }}
              >
                +{count - 5}
              </span>
            )}
            {displayedAvatars.map((user, index) => (
              <UserAvatar
                key={user.id}
                user={user}
                index={displayedAvatars.length - 1 - index}
                totalAvatars={totalAvatars}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
