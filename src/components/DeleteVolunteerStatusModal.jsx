import React from "react";

const DeleteVolunteerStatusModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete?</h2>
                <p className="text-gray-700 mb-6">
                    You'll lose templates attached to this task, and it will be removed from all current onboarding flows. You cannot undo this action.
                </p>

                <div className="flex justify-end">
                    <button
                        className="mr-4 px-4 py-2 bg-gray-200 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteVolunteerStatusModal;
