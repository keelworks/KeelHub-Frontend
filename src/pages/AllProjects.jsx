import React, { useState, useEffect } from "react";
import axios from "axios";
import NewProjectModal from "../components/NewProjectModal"; // Import modal component
import { Select, Table, Button, Spin, Tooltip, Avatar } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalProjects, setTotalProjects] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/projects`, {
          params: { status: statusFilter, availability: availabilityFilter },
        });
        setProjects(response.data.projects);
        setTotalProjects(response.data.totalProjects);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Error fetching projects. Please try again.");
      }
      setLoading(false);
    };

    fetchProjects();
  }, [statusFilter, availabilityFilter]);

  // Clear Filters
  const clearFilters = () => {
    setStatusFilter("");
    setAvailabilityFilter("");
  };

  // Status Color Mapping
  const getStatusLabel = (status) => {
    const statusColors = {
      "Not Started": "bg-gray-200 text-gray-700",
      "In Progress": "bg-blue-200 text-blue-700",
      Completed: "bg-green-200 text-green-700",
      "On Hold": "bg-yellow-200 text-yellow-700",
      "Past Due": "bg-red-200 text-red-700",
      Canceled: "bg-gray-400 text-white",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded ${statusColors[status]}`}
      >
        {status}
      </span>
    );
  };

  // Function to render overlapping avatars for Project Managers
  const renderProjectManagers = (managers) => {
    if (!managers || managers.length === 0) return "Unassigned";

    const maxVisible = 4;
    const extraCount = managers.length - maxVisible;
    return (
      <div className="flex items-center">
        {managers.slice(0, maxVisible).map((manager, index) => (
          <Tooltip key={index} title={`${manager.name}`}>
            <Avatar
              src={manager.profile_pic}
              size={32}
              className="border border-white -ml-2 first:ml-0"
            />
          </Tooltip>
        ))}
        {extraCount > 0 && (
          <span className="ml-2 text-sm font-medium bg-gray-200 px-2 py-1 rounded-full">
            +{extraCount}
          </span>
        )}
      </div>
    );
  };

  // Function to render overlapping avatars for Members
  const renderProjectMembers = (members) => {
    if (!members || members.length === 0) return "No Members";

    const maxVisible = 4;
    const extraCount = members.length - maxVisible;
    return (
      <div className="flex items-center">
        {members.slice(0, maxVisible).map((member, index) => (
          <Tooltip key={index} title={`${member.name}`}>
            <Avatar
              src={member.profile_pic}
              size={32}
              className="border border-white -ml-2 first:ml-0"
            />
          </Tooltip>
        ))}
        {extraCount > 0 && (
          <span className="ml-2 text-sm font-medium bg-gray-200 px-2 py-1 rounded-full">
            +{extraCount}
          </span>
        )}
      </div>
    );
  };

  // Define Table Columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { title: "Program", dataIndex: "program" },
    {
      title: "Project Manager(s)",
      dataIndex: "projectManager",
      render: (managers) => renderProjectManagers(managers),
      sorter: (a, b) =>
        (a.projectManager?.[0]?.name || "").localeCompare(
          b.projectManager?.[0]?.name || ""
        ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      sorter: (a, b) => new Date(a.due_date) - new Date(b.due_date),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => getStatusLabel(status),
    },
    {
      title: "Members",
      dataIndex: "members",
      render: (members) => renderProjectMembers(members),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold">All Projects</h3>
        <p className="text-gray-600 mt-1">
          Manage all your projects with this organized catalogue of project data
          for seamless management.
        </p>
      </div>

      {/* Filters & New Project Button in the same row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4 items-center">
          <span className="font-semibold">Filter by:</span>

          <Select
            className="w-40 text-gray-500"
            placeholder="All Projects"
            value={availabilityFilter}
            onChange={(value) => setAvailabilityFilter(value)}
          >
            <Option value="">All Projects</Option>
            <Option value="Live">Live</Option>
            <Option value="Archived">Archived</Option>
          </Select>

          <Select
            className="w-40 text-gray-500"
            placeholder="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="">Status</Option>
            <Option value="Not Started">Not Started</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
            <Option value="On Hold">On Hold</Option>
            <Option value="Past Due">Past Due</Option>
            <Option value="Canceled">Canceled</Option>
          </Select>

          <Button type="link" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        {/* New Project Button is now inline */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          New Project
        </Button>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        refreshProjects={() => setTotalProjects(projects.length)}
      />

      {/* Table & Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-y-auto" style={{ maxHeight: "550px" }}>
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="id"
            pagination={false}
            scroll={{ y: 440 }}
            sticky
          />
        </div>
      )}

      {/* Footer Showing Total Projects */}
      <div className="mt-4 text-gray-500 text-sm">
        Showing {totalProjects} results
      </div>
    </div>
  );
};

export default AllProjects;
