import React from "react";
import UserContainer from "./UserContainer";

const UsersTable = ({ users, sortByName, sortByInviteDate }) => {
  return (
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

          <th className="p-3 text-left font-semibold text-gray-600">Status</th>

          <th className="p-3 text-left font-semibold text-gray-600">
            Access Level
          </th>

          <th className="p-3 text-left font-semibold text-gray-600">Role</th>

          <th className="p-3 text-left font-semibold text-gray-600">
            <button
              onClick={sortByInviteDate}
              className="flex items-center hover:text-gray-900"
            >
              Invite Date <span className="ml-1">⏶⏷</span>
            </button>
          </th>

          <th className="p-3 text-left font-semibold text-gray-600">Actions</th>
        </tr>
      </thead>
      <UserContainer users={users} />
    </table>
  );
};

export default UsersTable;
