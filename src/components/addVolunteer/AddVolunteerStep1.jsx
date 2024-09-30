import React, { useState } from "react";

const AddVolunteerModalStep1 = ({ isOpen, onClose, onNext }) => {
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("");
    const email = fullName ? `${fullName.replace(" ", ".")}@Keelworks.org` : "";
    const reset = () => {
        setFullName("");
        setRole("");
    };

    const handleNext = () => {
        if (fullName && role) {
            onNext(fullName, role);
            reset();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-6/12">
                <h2 className="text-xl font-semibold mb-4">Add New Volunteer</h2>

                <label className="block mb-2 font-medium">Full Name</label>
                <input
                    type="text"
                    className="border p-2 w-full rounded"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                />

                <label className="block mt-4 mb-2 font-medium">Email (Autofill)</label>
                <input
                    type="email"
                    className="border p-2 w-full rounded bg-gray-100"
                    value={email}
                    readOnly
                />

                <label className="block mt-4 mb-2 font-medium">Role</label>
                <select
                    className="border p-2 w-full rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">Select...</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="Developer">Developer</option>
                    <option value="HR">HR</option>
                </select>

                <div className="flex justify-end mt-4">
                    <button
                        className="mr-4 px-4 py-2 bg-gray-200 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={handleNext}
                    >
                        Save & Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddVolunteerModalStep1;
