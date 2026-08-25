import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/api/auth`;

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
    },

    getLessonQuiz: async (id: string) => {
        const response = await axios.get(`${API_URL}/lesson/${id}/quiz`);
        return response.data;
    },

    submitLessonQuiz: async (id: string, answers: Record<string, string>) => {
        const response = await axios.post(`${API_URL}/lesson/${id}/quiz/submit`, { answers });
        return response.data;
    }
};