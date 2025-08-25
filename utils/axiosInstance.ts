import axios from 'axios';

export const BASE_URL = 'http://10.209.152.71:5000'; // Replace with your actual IP

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export default axiosInstance;