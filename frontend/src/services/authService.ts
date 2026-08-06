import axios from "axios";

const API_URL = 'http://localhost:3000/api/auth';

export const authService = {
    register: async (userData: any) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    },

    login: async (userData: any) => {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    },

    getCourses: async () => {
        const response = await axios.get(`${API_URL}/dashboard`);
        return response.data;
    },

    getCourseDetail: async (id: string) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/course/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    },

    getLessonDetail: async (id: string) => {
        const response = await axios.get(`${API_URL}/lesson/${id}`);
        return response.data;
    }
};