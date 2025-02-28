import React, { useState } from "react";
import { Modal, Input, Select, DatePicker, Button, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const NewProjectModal = ({ visible, onClose, refreshProjects }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    program: "",
    description: "",
    start_date: null,
    due_date: null,
    status: "Not Started",
    required_skills: [],
  });

  // Handle Input Change
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!formData.name || !formData.program) {
      message.error("Project Name and Program are required!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3001/api/projects", {
        ...formData,
        start_date: formData.start_date
          ? dayjs(formData.start_date).format("YYYY-MM-DD")
          : null,
        due_date: formData.due_date
          ? dayjs(formData.due_date).format("YYYY-MM-DD")
          : null,
      });

      message.success("Project created successfully!");
      setFormData({
        name: "",
        program: "",
        description: "",
        start_date: null,
        due_date: null,
        status: "Not Started",
        required_skills: [],
      });
      onClose(); // Close modal
      refreshProjects(); // Refresh project list in AllProjects.js
    } catch (error) {
      console.error("Error creating project:", error);
      message.error("Error creating project. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Modal
      title="New Project"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Create Project
        </Button>,
      ]}
    >
      <div className="space-y-4">
        <Input
          placeholder="Project Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <Input
          placeholder="Program"
          value={formData.program}
          onChange={(e) => handleChange("program", e.target.value)}
        />

        <Input.TextArea
          placeholder="Project Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
        />

        <DatePicker
          className="w-full"
          placeholder="Start Date"
          value={formData.start_date ? dayjs(formData.start_date) : null}
          onChange={(date) => handleChange("start_date", date)}
        />

        <DatePicker
          className="w-full"
          placeholder="Due Date"
          value={formData.due_date ? dayjs(formData.due_date) : null}
          onChange={(date) => handleChange("due_date", date)}
        />

        <Select
          className="w-full"
          placeholder="Select Status"
          value={formData.status}
          onChange={(value) => handleChange("status", value)}
        >
          <Option value="Not Started">Not Started</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
          <Option value="On Hold">On Hold</Option>
          <Option value="Past Due">Past Due</Option>
          <Option value="Canceled">Canceled</Option>
        </Select>

        <Select
          className="w-full"
          mode="tags"
          placeholder="Required Skills"
          value={formData.required_skills}
          onChange={(value) => handleChange("required_skills", value)}
        />
      </div>
    </Modal>
  );
};

export default NewProjectModal;
