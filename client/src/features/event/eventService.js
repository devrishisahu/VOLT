import axios from "axios";

const API_URL = '/api/events'

const fetchEvents = async () => {
    const response = await axios.get(API_URL)
    return response.data
};

const createEvent = async (formData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, formData, config);
    return response.data;
}

const getMyEvents = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(`${API_URL}/mine`, config);
    return response.data;
}

const eventService = { fetchEvents, createEvent, getMyEvents }

export default eventService