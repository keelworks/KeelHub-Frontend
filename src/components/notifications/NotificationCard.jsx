import React from "react";
import axios from "axios";
import { Menu } from '@headlessui/react';

const renderMessageWithLinks = (message, links) => {
  if (!links || Object.keys(links).length === 0) {
    return message;
  }

  const parts = message.split(/(\s+)/);
  return parts.map((part, index) => {
    const lowerPart = part.toLowerCase();
    if (links[lowerPart]) {
      return (
        <a
          key={index}
          href={links[lowerPart]}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const NotificationCard = ({ notification, onUpdate }) => {
  const handleMarkAsRead = async () => {
    try {
      await axios.put(`http://localhost:3001/api/notifications/${notification.id}/`, {
        status: "read"
      });
      onUpdate();
    } catch (error) {
      console.error('Error in marking as read:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await axios.delete(`http://localhost:3001/api/notifications/${notification.id}`);
        onUpdate();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const links = notification.metadata?.links || {};

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex items-center space-x-3">
        {notification.sender_id && (
          <img
            src={`/api/user-avatar/${notification.sender_id}`}
            alt="Sender Avatar"
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <p className="text-sm text-gray-800">
            {renderMessageWithLinks(notification.message, links)}
          </p>
          {notification.metadata && notification.metadata.action_url && (
            <a 
              href={notification.metadata.action_url} 
              className="text-sm text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {notification.metadata.action_text || 'View'}
            </a>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-500">
          {new Date(notification.created_at).toLocaleDateString()}
        </div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
              ⋮
            </Menu.Button>
          </div>
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              {notification.status === 'unread' && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleMarkAsRead}
                      className={`${
                        active ? 'bg-keelworks-blue text-keelworks-text' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Mark as read
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleDelete}
                    className={`${
                      active ? 'bg-keelworks-blue text-keelworks-text' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Delete Notification
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export default NotificationCard;