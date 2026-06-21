import axios from 'axios';

const getResponse = async (question, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post('/api/chat', { message: question }, config);
    return response.data;
}

const chatService = { getResponse }

export default chatService
