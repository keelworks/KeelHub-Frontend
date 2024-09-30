import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import img from "../../assets/defaultUser.jpg";

const Volunteer = (props) => {
  const { volunteer } = props;
  //   console.log(volunteer.Volunteer.jobTitles[0].title);
  console.log(volunteer);
  const date = new Date(volunteer.created_at);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="p-3">
        <div className="flex items-center">
          <img
            // src={volunteer.avatar_url}
            src={volunteer.profile_pic || img}
            alt={`${volunteer.first_name} ${volunteer.last_name}`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <Link
              to={`/volunteer-detail`}
              state={{ volunteer, formattedDate }}
              className="text-blue-600 hover:underline font-medium"
            >
              {volunteer.first_name} {volunteer.last_name}
            </Link>
            <div className="text-sm text-gray-600">{volunteer.email}</div>
          </div>
        </div>
      </td>
      <td className="p-3 text-gray-800">
        {volunteer.Volunteer.jobTitles[0]?.title}
      </td>
      <td className="p-3 text-gray-800">{formattedDate}</td>
      <td className="p-3 text-gray-800">
        {volunteer.Volunteer.time_committed_per_week}
      </td>
      {/* <td className="p-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            volunteer.Volunteer.status.toLowerCase() === "assigned"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {volunteer.Volunteer.status}
        </span>
      </td> */}
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            volunteer.Volunteer.status.toLowerCase() === "assigned"
              ? "bg-green-100 text-green-800"
              : volunteer.Volunteer.status.toLowerCase() === "unassigned"
              ? "bg-red-100 text-red-800"
              : volunteer.Volunteer.status.toLowerCase() === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : volunteer.Volunteer.status.toLowerCase() === "completed"
              ? "bg-blue-100 text-blue-800"
              : volunteer.Volunteer.status.toLowerCase() === "in_progress"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800" // default color
          }`}
        >
          {volunteer.Volunteer.status}
        </span>
      </td>
      <td className="p-3">
        {/* {volunteer.Volunteer.projects.map((project, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1 inline-block"
          >
            {project}
          </span>
        ))}
        {volunteer.Volunteer.additional_projects > 0 && (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded inline-block">
            +{volunteer.Volunteer.additional_projects}
          </span>
        )} */}
      </td>
      <td className="p-3">
        <button className="text-gray-500 hover:text-gray-700 text-xl">⋯</button>
      </td>
    </tr>
  );
};

export default Volunteer;
