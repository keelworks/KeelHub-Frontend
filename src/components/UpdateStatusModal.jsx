import React, { useState } from "react";

const UpdateStatusModal = ({ isOpen, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState("Needs Revision");
  const [comments, setComments] = useState("");
  const reset = () => {
    setStatus("Needs Revision");
    setComments("");
  };

  const handleUpdate = () => {
    onUpdateStatus(status, comments);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/12 ">
        <h2 className="text-xl font-semibold mb-4">Update Status</h2>

        <label className="block mb-2 font-medium">Change Status *</label>
        <select
          className="border p-2 w-full rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Needs Revision">Needs Revision</option>
          <option value="Done">Done</option>
        </select>

        <label className="block mt-4 mb-2 font-medium">Add Comments *</label>
        <textarea
          className="border p-2 w-full rounded"
          rows="4"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />

        <div className="flex justify-end mt-4">
          <button
            className="mr-4 px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleUpdate}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
