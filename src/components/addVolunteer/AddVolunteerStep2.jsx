import React, { useState } from "react";

const AddVolunteerModalStep2 = ({ isOpen, onClose, volunteerInfo, onConfirm }) => {
    const [country, setCountry] = useState("Select..");
    const [state, setState] = useState("Select..");
    const [city, setCity] = useState("");
    const [timeZone, setTimeZone] = useState("Select..");
    const [visaType, setVisaType] = useState("Select..");
    const [startDate, setStartDate] = useState("");
    const [hoursPerWeek, setHoursPerWeek] = useState("");

    const reset = () => {
        setCountry("Select..");
        setState("Select..");
        setCity("");
        setTimeZone("Select..");
        setVisaType("Select..");
        setStartDate("");
        setHoursPerWeek("");
    };

    const handleConfirm = () => {
        const additionalInfo = {
            country,
            state,
            city,
            timeZone,
            visaType,
            startDate,
            hoursPerWeek,
        };
        onConfirm(volunteerInfo, additionalInfo);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    const usStates = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
        'Wisconsin', 'Wyoming'
    ];
    const stateTimezones = {
        'Alabama': 'CST -6:00',
        'Alaska': 'AKST -9:00',
        'Arizona': 'MST -7:00',
        'Arkansas': 'CST -6:00',
        'California': 'PST -8:00',
        'Colorado': 'MST -7:00',
        'Connecticut': 'EST -5:00',
        'Delaware': 'EST -5:00',
        'Florida': 'EST -5:00',
        'Georgia': 'EST -5:00',
        'Hawaii': 'HST -10:00',
        'Idaho': 'MST -7:00',
        'Illinois': 'CST -6:00',
        'Indiana': 'EST -5:00',
        'Iowa': 'CST -6:00',
        'Kansas': 'CST -6:00',
        'Kentucky': 'EST -5:00',
        'Louisiana': 'CST -6:00',
        'Maine': 'EST -5:00',
        'Maryland': 'EST -5:00',
        'Massachusetts': 'EST -5:00',
        'Michigan': 'EST -5:00',
        'Minnesota': 'CST -6:00',
        'Mississippi': 'CST -6:00',
        'Missouri': 'CST -6:00',
        'Montana': 'MST -7:00',
        'Nebraska': 'CST -6:00',
        'Nevada': 'PST -8:00',
        'New Hampshire': 'EST -5:00',
        'New Jersey': 'EST -5:00',
        'New Mexico': 'MST -7:00',
        'New York': 'EST -5:00',
        'North Carolina': 'EST -5:00',
        'North Dakota': 'CST -6:00',
        'Ohio': 'EST -5:00',
        'Oklahoma': 'CST -6:00',
        'Oregon': 'PST -8:00',
        'Pennsylvania': 'EST -5:00',
        'Rhode Island': 'EST -5:00',
        'South Carolina': 'EST -5:00',
        'South Dakota': 'CST -6:00',
        'Tennessee': 'CST -6:00',
        'Texas': 'CST -6:00',
        'Utah': 'MST -7:00',
        'Vermont': 'EST -5:00',
        'Virginia': 'EST -5:00',
        'Washington': 'PST -8:00',
        'West Virginia': 'EST -5:00',
        'Wisconsin': 'CST -6:00',
        'Wyoming': 'MST -7:00'
    };

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setState(selectedState);
        setTimeZone(stateTimezones[selectedState] || '');
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-6/12">
                <h2 className="text-xl font-semibold mb-4">
                    Add New Volunteer: {volunteerInfo.fullName}
                </h2>

                <label className="block mb-2 font-medium">Country of Residence</label>
                <select
                    className="border p-2 w-full rounded"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                >
                    <option value="Select..">Select..</option>
                    <option value="US">US</option>
                    <option value="Canada">Canada</option>
                </select>

                <label className="block mt-4 mb-2 font-medium">State/Province</label>
                <select
                    className="border p-2 w-full rounded"
                    value={state}
                    onChange={handleStateChange}
                >
                    <option value="Select..">Select..</option>
                    {usStates.map((stateName) => (
                        <option key={stateName} value={stateName}>
                            {stateName}
                        </option>
                    ))}
                </select>

                <label className="block mt-4 mb-2 font-medium">Time Zone</label>
                <select
                    disabled={state !== 'Select..'}
                    className="border p-2 w-full rounded"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                >
                    <option value="Select..">Select..</option>
                    {Object.values(stateTimezones).map((tz, index) => (
                        <option key={tz + index} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>

                <label className="block mt-4 mb-2 font-medium">City</label>
                <input
                    type="text"
                    className="border p-2 w-full rounded"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                />

                <label className="block mt-4 mb-2 font-medium">Visa Type</label>
                <select
                    className="border p-2 w-full rounded"
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                >
                    <option value="Select..">Select..</option>
                    <option value="F1">F1</option>
                    <option value="J1">J1</option>
                </select>

                <label className="block mt-4 mb-2 font-medium">Keelworks Start Date</label>
                <input
                    type="date"
                    className="border p-2 w-full rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label className="block mt-4 mb-2 font-medium">Agreed Hours Per Week</label>
                <input
                    type="number"
                    className="border p-2 w-full rounded"
                    placeholder="Enter a Number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
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
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddVolunteerModalStep2;
