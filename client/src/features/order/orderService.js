import axios from 'axios';

const API_URL = '/api/order/';

const bookTicket = async (eventId, bookingData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + eventId, bookingData, config);
    return response.data;
};

const getMyTickets = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const cancelTicket = async (ticketId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.put(API_URL + ticketId, {}, config);
    return response.data;
};

const checkCoupon = async (couponCode, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + 'check/coupon', { couponCode }, config);
    return response.data;
};

const orderService = { bookTicket, getMyTickets, cancelTicket, checkCoupon };

export default orderService;
