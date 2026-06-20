import axios from 'axios';

const API_URL = '/api/admin/';

const getAllUsers = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'users', config);
    return response.data;
}

const updateUser = async (userId, userData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + 'users/' + userId, userData, config);
    return response.data;
}

const getAllEvents = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'events', config);
    return response.data;
}

const updateEvent = async (eventId, eventData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + 'events/' + eventId, eventData, config);
    return response.data;
}

const getAllOrders = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'orders', config);
    return response.data;
}

const getAllCoupons = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'coupons', config);
    return response.data;
}

const createCoupon = async (couponData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'coupon', couponData, config);
    return response.data;
}

const updateCoupon = async (couponId, couponData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + 'coupon/' + couponId, couponData, config);
    return response.data;
}

const deleteCoupon = async (couponId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + 'coupon/' + couponId, config);
    return response.data;
}

const deleteEvent = async (eventId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + 'events/' + eventId, config);
    return response.data;
}

const adminService = {
    getAllUsers,
    updateUser,
    getAllEvents,
    updateEvent,
    getAllOrders,
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    deleteEvent
}

export default adminService;
