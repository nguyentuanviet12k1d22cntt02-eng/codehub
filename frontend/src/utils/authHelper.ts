/**
 * Auth Helper Utility
 * Hỗ trợ kiểm tra, giải mã JWT và quản lý vòng đời phiên đăng nhập (1 tiếng)
 */
import axios from 'axios';

export interface DecodedToken {
    id: string;
    username: string;
    role: string;
    exp?: number;
    iat?: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    // decoded.exp tính bằng giây, Date.now() tính bằng mili-giây
    return Date.now() >= decoded.exp * 1000;
};

export const clearAuth = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getValidToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    if (isTokenExpired(token)) {
        clearAuth();
        return null;
    }
    return token;
};

export const getValidUser = (): any | null => {
    const token = getValidToken();
    if (!token) return null;

    const userRaw = localStorage.getItem('user');
    if (!userRaw) return null;
    try {
        return JSON.parse(userRaw);
    } catch {
        return null;
    }
};

let interceptorSetup = false;

export const setupAuthInterceptor = (): void => {
    if (interceptorSetup) return;
    interceptorSetup = true;

    // Tự động kiểm tra token trước khi gửi request
    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
            clearAuth();
        }
        return config;
    });

    // Bắt lỗi 401/403 khi Token hết hạn từ Backend
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                const msg = String(error.response.data?.message || '').toLowerCase();
                if (msg.includes('token') || msg.includes('hết hạn') || msg.includes('xác thực') || msg.includes('unauthorized')) {
                    clearAuth();
                    const currentPath = window.location.pathname;
                    if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
                        window.location.href = '/login';
                    }
                }
            }
            return Promise.reject(error);
        }
    );
};
