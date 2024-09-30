import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import VolunteerList from '../components/AdminVolunteerList';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const VolunteerListPage = () => {
    const { currentUser } = useContext(UserContext);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/volunteers/all');
                setVolunteers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching volunteers:', error);
                setLoading(false);
            }
        };

        fetchVolunteers();
    }, []);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (!['admin', 'hr'].includes(currentUser.role)) {
        return <p className="text-center mt-8 text-lg text-gray-600">You do not have permission to view this page.</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Volunteer Management</h1>
            {loading ? (
                <p className="text-center text-lg text-gray-600">Loading...</p>
            ) : (
                <VolunteerList volunteers={volunteers} />
            )}
        </div>
    );
};

export default VolunteerListPage;