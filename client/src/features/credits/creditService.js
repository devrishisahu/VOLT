import axios from 'axios';

const API_URL = '/api/credits/';

const requestCredits = async (amount, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'request', { amount }, config);
    return response.data;
}

const getAdminRequests = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'admin/requests', config);
    return response.data;
}

const updateRequestStatus = async (id, status, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + 'admin/request/' + id, { status }, config);
    return response.data;
}

const getMyRequests = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'myrequests', config);
    return response.data;
}

const creditService = {
    requestCredits,
    getAdminRequests,
    updateRequestStatus,
    getMyRequests
}

export default creditService;
