import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.BASEURL || 'http://localhost:8000/api', // Default to localhost if no baseURL is set
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include credentials for cross-origin requests
});

export default api;