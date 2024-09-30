import React, { useState, useEffect, useCallback } from "react";
import { Table, Dropdown, Menu, message } from "antd";
import { HiOutlineClipboardList } from "react-icons/hi";
import ExtendDueDateModal from "./ExtendDueDateModal";
import axios from "axios";

const AdminVolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  });
  const [tasks, setTasks] = useState([]);
  const [isExtendDueDateModalOpen, setIsExtendDueDateModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchVolunteers = useCallback(
    async (params = { current: 1, pageSize: 10 }) => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3001/api/volunteer-tasks/admin/volunteers",
          {
            params: {
              page: params.current,
              pageSize: params.pageSize,
            },
          }
        );
        setVolunteers(response.data.data || []);
        setPagination((prev) => ({
          ...prev,
          current: params.current,
          pageSize: params.pageSize,
          total: response.data.total || 0,
        }));
      } catch (error) {
        console.error("Error fetching volunteers:", error);
        message.error("Failed to fetch volunteers");
        setVolunteers([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchVolunteers(pagination);
  }, [fetchVolunteers]);

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchVolunteers({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleTemplateClick = (task) => {
    setSelectedTask(task);
    setIsTemplateModalOpen(true);
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setIsExtendDueDateModalOpen(true);
  };

  const handleEditTaskSubmit = async (updatedTask) => {
    try {
      if (updatedTask.extendDueDate > 0) {
      const taskDetailsResponse = await axios.get(`http://localhost:3001/api/volunteer-tasks/${selectedTask.taskId}`);      
      const { volunteer_id } = taskDetailsResponse.data;
      const response = await axios.put(`http://localhost:3001/api/volunteer-tasks/volunteers/${volunteer_id}/extend-due-date`, {
          extendDays: updatedTask.extendDueDate,
      });

      if (response.status === 200) {
          message.success('Task edited successfully');
          fetchVolunteers(pagination); 
          setIsExtendDueDateModalOpen(false);
          setIsEditMode(false);
      }
    }
    } catch (error) {
        console.error('Error extending due date:', error);
        message.error('Failed to extend due date');
    }
  };

  const handleCopyTemplate = () => {
    if (selectedTask && selectedTask.description) {
      navigator.clipboard
        .writeText(selectedTask.description)
        .then(() => alert("Template copied to clipboard!"))
        .catch((err) => console.error("Failed to copy template: ", err));
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div>{`${record.firstName} ${record.lastName}`}</div>
          <div style={{ fontSize: "0.8em", color: "gray" }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: ["currentTask", "status"],
      key: "status",
    },
    {
      title: "Due Date",
      dataIndex: ["currentTask", "dueDate"],
      key: "dueDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Current Task",
      dataIndex: "currentTask",
      key: "currentTask",
      render: (currentTask) => (
        <div>
          {selectedTask ? (
            <>
              <div>{selectedTask.taskName}</div>
              <div>{selectedTask.progress}</div>
            </>
          ) : (
            "No active task"
          )}
        </div>
      ),
    },
    {
      title: "Date Created",
      dataIndex: ["currentTask", "createdAt"],
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Template",
      dataIndex: ["currentTask", "description"],
      key: "description",
      render: (description) =>
        (
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => handleTemplateClick(selectedTask)}
            title="View Template"
          >
            <HiOutlineTemplate size={20} />
          </button>
        ) || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        const isEditable = record.currentTask && record.currentTask.task_name !== 'All onboarding tasks completed';
        
        const menuItems = [
          {
            key: "1",
            label: "Approve",
            onClick: () => handleApprove(record.id),
          },
          {
            key: "2",
            label: "Reject",
            onClick: () => handleReject(record.id),
          },
          // {
          //   key: "3",
          //   label: "Extend Due Date",
          //   onClick: () => handleExtendDueDate(record.id),
          // }
        ];
        
        if (isEditable) {
          menuItems.push({
            key: "3",
            label: "Edit Task",
            onClick: () => handleEditClick(record.currentTask),
          });
        }
  
        return (
          <Dropdown menu={{ items: menuItems }}>
            <a onClick={(e) => e.preventDefault()}>Actions</a>
          </Dropdown>
        );
      },
    },
  ];

  const handleApprove = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/volunteer-tasks/volunteers/${id}/complete-current-task`
      );

      if (
        response.data.data.status === "unassigned" ||
        response.data.data.status === "completed"
      ) {
        setVolunteers((prev) => prev.filter((v) => v.id !== id));
        message.success(
          "Volunteer onboarding completed and status updated to unassigned."
        );
      } else {
        await fetchVolunteers(pagination, true);
        message.success("Task approved successfully");
      }
    } catch (error) {
      console.error("Error approving task:", error);
      message.error("Failed to approve task");
    }
  };
  
  const handleReject = async (id) => {
      try {
          const response = await axios.put(`http://localhost:3001/api/volunteer-tasks/volunteers/${id}/reject-task`);
          if (response.status === 200) {
              message.success('Task Rejected');
          }
      }
      catch (error) {
          console.error('Error rejecting task:', error);
          message.error('Failed to reject task');
      }
  };
  
  // const handleExtendDueDate = async (id) => {
  //     try {
  //       console.log("id", id)
  //         const response = await axios.put(`http://localhost:3001/api/volunteer-tasks/volunteers/${id}/extend-due-date`);
  //         if (response.status === 200) {
  //             message.success('Due date extended successfully');
  //         }
  //     }
  //     catch (error) {
  //         console.error('Error extending task:', error);
  //         message.error('Failed to extend due date');
  //     }
  // };

  return (
    <div>
      <h2>Admin Volunteer Onboarding Tracker</h2>
      <Table
        columns={columns}
        dataSource={volunteers}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      
      <ExtendDueDateModal
        isOpen={isExtendDueDateModalOpen}
        closeModal={() => {
          setIsExtendDueDateModalOpen(false);
          setIsEditMode(false);
          setSelectedTask(null);
        }}
        onSubmit={isEditMode ? handleEditTaskSubmit : () => {}}
        initialTask={selectedTask}
        isTemplateView={false}
      />

      <ExtendDueDateModal
        isOpen={isTemplateModalOpen}
        closeModal={() => setIsTemplateModalOpen(false)}
        initialTask={selectedTask}
        isTemplateView={true}
        onCopyTemplate={handleCopyTemplate}
      />
    </div>
  );
};

export default AdminVolunteerList;
