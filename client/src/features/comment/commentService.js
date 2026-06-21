import axios from "axios";

const API_URL = '/api/comment/';

// Get Comments
const getComments = async (eventId) => {
    const response = await axios.get(API_URL + eventId);
    return response.data;
};

// Add Comment
const addComment = async (eventId, commentData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + eventId, commentData, config);
    return response.data;
};

// Delete Comment
const deleteComment = async (commentId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.delete(API_URL + commentId, config);
    return response.data;
};

const commentService = { getComments, addComment, deleteComment };

export default commentService;
