import axios from "axios";
export const fetchJobTitleWithCount = async() => {
    try{
        const response = await axios.get('http://localhost:3001/api/volunteer-job-titles/job-titles/volunteer-count')
        console.log(response.data);
        return response.data;

    } catch(error){
        console.error('Error fetching job title with count:', error);
        throw error;
    }
}