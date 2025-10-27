
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message;
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
