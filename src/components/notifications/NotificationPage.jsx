import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCard from './NotificationCard';
import { UserContext } from '../../context/UserContext';


const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('unread');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!currentUser) {
      setError('No user logged in');
      setLoading(false);
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (activeTab === 'unread') {
        response = await axios.get(`http://localhost:3001/api/notifications/unread/${currentUser.id}`);
      } else {
        response = await axios.get(`http://localhost:3001/api/notifications/read/${currentUser.id}`);
      }
      setNotifications(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeTab, currentUser]);

  const handleMarkAllAsRead = async () => {
    if (!currentUser) {
      navigate('/dashboard');
      return;
    }

    try {
      await axios.patch(`http://localhost:3001/api/notifications/mark-all-read/${currentUser.id}`);
      fetchNotifications();
    } catch (err) {
      setError('Failed to mark all notifications as read. Please try again.');
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (!currentUser) {
    return null; 
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-4">
          <button
            className={`px-4 py-2 ${activeTab === 'unread' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'read' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('read')}
          >
            Read
          </button>
        </div>
        {activeTab === 'unread' && (
          <button
            className="text-blue-600 hover:underline"
            onClick={handleMarkAllAsRead}
          >
            Mark All As Read
          </button>
        )}
      </div>
      {loading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onUpdate={fetchNotifications}
                />
              ))
            ) : (
              <p>No {activeTab} notifications.</p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default NotificationsPage;