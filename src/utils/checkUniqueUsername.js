import axios from "axios";

const checkUniqueUsername = async (username) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(
            `http://localhost:3001/api/users/check-username/${username}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.isAvailable;
    } catch (error) {
        console.error("Error checking username:", error);
        throw new Error("Failed to check username availability");
    }
};

const generateUniqueUsername = async (first_name, last_name) => {
    let counter = 0;
    let username;
    let isUnique = false;

    while (!isUnique) {
        username = `${first_name.toLowerCase()}.${last_name.toLowerCase()}${counter ? counter : ''}@keelworks.org`;
        try {
            isUnique = await checkUniqueUsername(username);
            if (!isUnique) counter++;
        } catch (error) {
            throw new Error("Failed to generate username. Please try again.");
        }
    }

    return username;
};

export default generateUniqueUsername
