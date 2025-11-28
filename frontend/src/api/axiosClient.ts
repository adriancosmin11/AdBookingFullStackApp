import axios from 'axios';

const axiosClient = axios.create({

    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});
export default axiosClient;