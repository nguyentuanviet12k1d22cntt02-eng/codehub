import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/admin`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const adminApi = {
    // Dashboard
    getDashboardStats: async () => {
        const response = await axios.get(`${API_URL}/dashboard/stats`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getSystemActivity: async () => {
        const response = await axios.get(`${API_URL}/dashboard/activity`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Users
    getAllUsers: async (params?: { page?: number; limit?: number; role?: string; search?: string }) => {
        const response = await axios.get(`${API_URL}/users`, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    },

    getUserById: async (id: string) => {
        const response = await axios.get(`${API_URL}/users/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    createUser: async (data: any) => {
        const response = await axios.post(`${API_URL}/users`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateUser: async (id: string, data: any) => {
        const response = await axios.put(`${API_URL}/users/${id}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await axios.delete(`${API_URL}/users/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    resetUserPassword: async (id: string, newPassword: string) => {
        const response = await axios.post(`${API_URL}/users/${id}/reset-password`,
            { newPassword },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Courses
    getAllCourses: async (params?: { page?: number; limit?: number; level?: string; status?: string }) => {
        const response = await axios.get(`${API_URL}/courses`, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    },

    deleteCourse: async (id: string) => {
        const response = await axios.delete(`${API_URL}/courses/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Submissions
    getAllSubmissions: async (params?: { page?: number; limit?: number; status?: string; userId?: string }) => {
        const response = await axios.get(`${API_URL}/submissions`, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    },

    // Practice Problems
    getAllPracticeProblems: async (params?: { page?: number; limit?: number; difficulty?: string }) => {
        const response = await axios.get(`${API_URL}/practice-problems`, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    },

    deletePracticeProblem: async (id: string) => {
        const response = await axios.delete(`${API_URL}/practice-problems/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
