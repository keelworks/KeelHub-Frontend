import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = "http://localhost:3001/api/volunteer-tasks";

const rejectTask = async (volunteerId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/volunteers/${volunteerId}/reject-task`);
        toast.success("Task rejected successfully");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.error || "An error occurred while rejecting the task");
        throw error;
    }
};

const approveTask = async (volunteerId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/volunteers/${volunteerId}/complete-current-task`);
        toast.success("Task approved and moved to next task successfully");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.error || "An error occurred while approving the task");
        throw error;
    }
};

const deleteTask = async (taskId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${taskId}`);
        toast.success("Task deleted successfully");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.error || "An error occurred while deleting the task");
        throw error;
    }
};

export {
    rejectTask,
    approveTask,
    deleteTask
};
