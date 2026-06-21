import axios from 'axios'
const API_URL = "/api/auth"

const register = async (formData) =>{
    const response = await axios.post(API_URL + "/register" , formData)
    localStorage.setItem('user' , JSON.stringify(response.data))
    return response.data
}
const login = async (formData) =>{
    const response = await axios.post(API_URL + "/login" , formData)
    localStorage.setItem('user' , JSON.stringify(response.data))
    return response.data
}

const syncUser = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + "/me", config);
    
    // We need to keep the token from the old localStorage since /me doesn't return it
    const oldUser = JSON.parse(localStorage.getItem('user'));
    const newUser = { ...response.data, token: oldUser.token };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
}

const authService = {register , login, syncUser}

export default authService
