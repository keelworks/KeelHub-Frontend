import React from "react";
import VolunteerContainer from "./VolunteerContainer";

const VolunteersTable = ({
  volunteers,
  sortByName,
  sortByHrs,
  sortByRole,
  sortByStartDate,
}) => {
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
          <th className="p-3 text-left font-semibold text-gray-600">
            <button
              onClick={sortByRole}
              className="flex items-center hover:text-gray-900"
            >
              Role <span className="ml-1">⏶⏷</span>
            </button>
          </th>
          <th className="p-3 text-left font-semibold text-gray-600">
            <button
              onClick={sortByStartDate}
              className="flex items-center hover:text-gray-900"
            >
              Start Date <span className="ml-1">⏶⏷</span>
            </button>
          </th>
          <th className="p-3 text-left font-semibold text-gray-600">
            <button
              onClick={sortByHrs}
              className="flex items-center hover:text-gray-900"
            >
              Agreed Hrs / wk <span className="ml-1">⏶⏷</span>
            </button>
          </th>
          <th className="p-3 text-left font-semibold text-gray-600">Status</th>
          <th className="p-3 text-left font-semibold text-gray-600">
            Projects Assigned
          </th>
          <th className="p-3 text-left font-semibold text-gray-600">Actions</th>
        </tr>
      </thead>
      <VolunteerContainer volunteers={volunteers} />
    </table>
  );
};

export default VolunteersTable;
