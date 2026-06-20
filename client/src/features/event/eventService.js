import axios from "axios";

const API_URL = '/api/events'

const fetchEvents = async () => {
    const response = await axios.get(API_URL)
    return response.data
};

const createEvent = async (formData, token) => {
    return { _id: Date.now().toString(), ...formData, status: "upcoming", isActive: true };
}

const eventService = { fetchEvents, createEvent }

export default eventService