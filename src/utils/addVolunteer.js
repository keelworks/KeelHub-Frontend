import axios from 'axios';
import { toast } from 'react-toastify';

export const addVolunteer = async (
  username,
  password,
  email,
  role,
  access_level,
  first_name,
  last_name,
  city,
  phone,
  profilePic,
  timezone
) => {
  const token = localStorage.getItem("token");
  
  try {
    const userData = {
      username,
      password,
      email,
      role,
      access_level,
      first_name,
      last_name,
      city,
      phone,
      profilePic,
      timezone,
    };

    // Create user
    const userResponse = await axios.post(
      "http://localhost:3001/api/users",
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Create volunteer record
    const newVolunteer = {
      volunteer_id: userResponse.data.data.id,
      skills: [],
    };

    const volunteerResponse = await axios.post(
      "http://localhost:3001/api/volunteers",
      newVolunteer,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Volunteer added successfully!");
    return { user: userResponse.data, volunteer: volunteerResponse.data };
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while adding the volunteer";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};
