import React, { useEffect, useState, useContext, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import ReactFlagsSelect from "react-flags-select";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { useNavigate } from "react-router-dom";
import { getTimezonesForCountry } from "countries-and-timezones"
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {phone} from 'phone';

const useAuthToken = () => {
  const [authToken, setAuthToken] = useState('');
  const [tokenExpiry, setTokenExpiry] = useState(null);

  const fetchAuthToken = useCallback(async (force = false) => {
    if (authToken && !force && tokenExpiry && new Date() < tokenExpiry) {
      return;  
    }
    
    try {
      const response = await axios.get('/api/api/getaccesstoken', {
        headers: {
          "Accept": "application/json",
          "api-token":  "9UE2oIs29kHP1Otm5FRiH3d1jtJ-UG_qNuoaj3UM0FFSDrZIDrnsyRQMNQkI640i0VY",
          "user-email": "kshitij.chaudhari@keelworks.org"
        }
      });
      
      const newToken = `Bearer ${response.data.auth_token}`;
      setAuthToken(newToken);
      
      const newExpiry = new Date(new Date().getTime() + 23 * 60 * 60 * 1000);
      setTokenExpiry(newExpiry);
      
    } catch (error) {
      console.error('Error fetching auth token:', error);
    }
  }, [authToken, tokenExpiry]);

  useEffect(() => {
    fetchAuthToken();
    
    const intervalId = setInterval(() => {
      fetchAuthToken(true);  
    }, 23 * 60 * 60 * 1000);  
    
    return () => clearInterval(intervalId);
  }, [fetchAuthToken]);

  return { authToken, fetchAuthToken };
};

const AdminDetails = () => {
    const { currentUser } = useContext(UserContext);
    const { authToken, fetchAuthToken } = useAuthToken();
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [formData, setFormData] = useState({
        country: '',
        state: '',
        timezone: '',
        visa_extension: '',
        phone: '',
        keelworks_start_date: '',
        agreed_hours_per_week: ''
    });
    const [timezoneList, setTimezoneList] = useState([]);
    const [compulsory, setCompulsory] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const USA_Visa_List = ["OPT", "CPT", "N/A"];

    const fetchCountries = useCallback(async () => {
        if (!authToken || countryList.length > 0) return;
        setIsLoading(true);
        try {
            const response = await axios.get('/api/api/countries/', {
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                }
            });
            setCountryList(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
            if (error.response && error.response.status === 401) {
                fetchAuthToken(true);  
            }
        } finally {
            setIsLoading(false);
        }
    }, [authToken, countryList.length, fetchAuthToken]);

    const updateTimezones = useCallback(() => {
        const selectedCountry = countryList.find(c => c.country_name === formData.country);
        const country_id = selectedCountry?.country_short_name;
        const zones = getTimezonesForCountry(country_id);
        const updated_zones = zones?.map(zone => moment.tz(zone.name).format('z'));
        const setOfZones = [...new Set(updated_zones)];
        setTimezoneList(setOfZones);
    }, [formData.country, countryList]);

    const fetchStates = useCallback(async (country) => {
        if (!authToken || !country) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/api/states/${country}`, {
                headers: {
                    'Authorization': authToken,
                    'Accept': 'application/json'
                }
            });
            setStateList(response.data);
        } catch (error) {
            console.error('Error fetching states:', error);
            if (error.response && error.response.status === 401) {
                fetchAuthToken(true);  
            }
        } finally {
            setIsLoading(false);
        }
    }, [authToken, fetchAuthToken]);

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            console.log("New form data:", newData);
            return newData;
        });
        if (field === 'country') {
            fetchStates(value);
        }
        setErrors(prev => ({ ...prev, [field]: '' }));
        setCompulsory(false);
    };

    // handler for date change
    const handleDateChange = (date) => {
        if (date){
            let date_string = JSON.stringify(date).slice(1,11)
            handleInputChange('keelworks_start_date', date_string);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (!value || value.trim() === '') {
                newErrors[key] = 'This field is required';
            }
        });

        let {isValid} = phone(`+${formData.phone}`,{country:null})
        
        if(!isValid){
            newErrors['phone'] = "Enter a valid phone number"
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setCompulsory(true);
            return;
        }
        setIsLoading(true);
        try {
            const userData = {
                ...formData,
                visa_type: formData.visa_extension,
                hasLoggedIn: true,
            };
            console.log("userData",userData)
            await axios.put(`http://localhost:3001/api/users/${currentUser.id}`, userData, {
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                }
            });
            navigate('/acc-success');
        } catch (error) {
            console.error("Error updating user data:", error);
            if (error.response && error.response.status === 401) {
                fetchAuthToken(true);  
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchCountries();
        }
    }, [authToken, fetchCountries]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
        if (formData.country) {
            updateTimezones();
            fetchStates(formData.country);
        }
    }, [formData.country, currentUser, navigate, updateTimezones, fetchStates]);

    return (
        <div className="flex flex-col md:flex-row mx-auto">
            {/* First Division */}
            <div className="relative w-full md:w-2/5 h-screen z-50 hidden md:block">
                <img className="absolute w-full h-full object-cover" src="src/assets/image.png" alt="Background" />
                <div className="absolute inset-0 flex justify-center bg-opacity-75 p-8 h-1/2">
                    <div className="p-20 text-white mt-40">
                        {/* Add any content you want here */}
                    </div>
                </div>
            </div>
      
            {/* Second Division */}
            <div className="bg-gray-100 w-full md:w-3/5 h-screen flex flex-col items-start justify-start">
                <div className="w-full max-w-screen-sm pr-4 md:pr-15 mt-4 md:mt-[10px] pl-4 md:pl-10 ml-4 md:ml-[60px] mb-auto">
                    <h3 className="text-black pl-2 pt-2 md:pl-4 md:pt-4 text-3xl md:text-5xl">Hey there {currentUser?.first_name}!</h3>
                    <h2 className="pl-2 md:pl-5 pt-2 md:pt-3 text-gray-600 text-lg md:text-xl">Complete your information to get started</h2>
      
                    <div className="flex items-center gap-x-4 md:gap-x-6 rounded mt-4 md:mt-[15px] ml-2 md:ml-5 bg-slate-200">
                        <img className="h-12 w-12 md:h-16 md:w-16 ml-2 rounded-full p-1" src={currentUser && currentUser.profile_pic} alt="Profile" />
                        <div>
                            <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">{currentUser && currentUser.first_name} {currentUser && currentUser.last_name} - {currentUser && currentUser.role}</h3>
                            <p className="text-sm font-thin leading-6 text-gray-500">{currentUser && currentUser.username}</p>
                        </div>
                    </div>
      
                    {/* Form Start */}
                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:gap-x-8 md:gap-y-6 ml-2 md:ml-5 sm:grid-cols-2 mt-4 md:mt-3">
                        <div>
                            <label className="block text-sm font-semibold leading-1 text-gray-900">Country of Residence *</label>
                            <div className="mt-1">
                                <select
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    value={formData.country}
                                    className="block w-full rounded-md border-0 px-3.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select..</option>
                                    {countryList.map((country) => (
                                        <option key={country.country_name} value={country.country_name}>
                                            {country.country_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold leading-1 text-gray-900">State/Province *</label>
                            <div className="mt-1">
                                <select
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    value={formData.state}
                                    className="block w-full rounded-md border-0 px-3.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select..</option>
                                    {stateList.map((state) => (
                                        <option key={state.state_name} value={state.state_name}>
                                            {state.state_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold leading-1 text-gray-900">Timezone *</label>
                            <div className="mt-1">
                                <select
                                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                                    value={formData.timezone}
                                    className="block w-full rounded-md border-0 px-3.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select..</option>
                                    {timezoneList.map((timezone) => (
                                        <option key={timezone} value={timezone}>
                                            {timezone}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.timezone && <p className="text-red-500 text-xs mt-1">{errors.timezone}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="visa_extension" className="block text-sm font-semibold leading-1 text-gray-900">Visa Extension *</label>
                            <div className="mt-1">
                                <select
                                    id="visa_extension"
                                    name="visa_extension"
                                    onChange={(e) => handleInputChange('visa_extension', e.target.value)}
                                    value={formData.visa_extension || ''}
                                    className="block w-full rounded-md border-0 px-3.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select..</option>
                                    {USA_Visa_List.map((visa_type) => (
                                        <option key={visa_type} value={visa_type}>
                                            {visa_type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        {errors.visa_extension && <p className="text-red-500 text-xs mt-1">{errors.visa_extension}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold leading-1 text-gray-900">Phone number *</label>
                            <div className="relative mt-1">
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={(value) => handleInputChange('phone', value)}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        {/* Keelworks Start Date Field */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold leading-1 text-gray-900">Keelworks Start Date *</label>
                    <div className="relative mt-1">
                        <DatePicker
                            selected={formData.keelworks_start_date}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select a date"
                            className="block w-full rounded-md border-0 px-3.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    {errors.keelworks_start_date && <p className="text-red-500 text-xs mt-1">{errors.keelworks_start_date}</p>}
                </div>

                        {/* Agreed Hours per Week Field */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold leading-1 text-gray-900">Agreed Hours per Week *</label>
                    <div className="mt-1">
                        <input
                            type="number"
                            min="1" max="100" step="1"
                            placeholder="Enter hours"
                            value={formData.agreed_hours_per_week}
                            onChange={(e) => handleInputChange('agreed_hours_per_week', e.target.value)}
                            className="block w-full rounded-md border-0 px-3.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    {errors.agreed_hours_per_week && <p className="text-red-500 text-xs mt-1">{errors.agreed_hours_per_week}</p>}
                </div>  
                    </div>
                    {/* Form End */}
      
                    <div className='flex justify-center md:justify-end ml-0 md:ml-[400px] mt-4'>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="flex w-[200px] justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Complete'}
                        </button>
                    </div>
                    {/* {compulsory && <p className="text-red-600">All fields are required!</p>} */}
                </div>
            </div>
        </div>
    );
}

export default AdminDetails;