import axios from "axios";
export const fetchVolunteers = async (userId, userRole) => {
    const API_BASE_URL = "http://localhost:3001/api/volunteer-tasks"
    try {
        let url;
        if (userRole === 'admin') {
            url = `${API_BASE_URL}/admin/volunteers`;
        } else if (userRole === 'hr') {
            url = `${API_BASE_URL}/hr/${userId}/volunteers`;
        } else {
            throw new Error('Invalid user role');
        }

        const response = await axios.get(url);
        const filteredVolunteers = response.data.data.filter(volunteer => volunteer.currentTask);
        console.log(filteredVolunteers)
        return filteredVolunteers;
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        throw error;
    }
};
