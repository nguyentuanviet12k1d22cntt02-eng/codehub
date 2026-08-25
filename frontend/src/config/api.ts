/**
 * Cấu hình URL API Backend tập trung
 * Tự động đọc từ biến môi trường VITE_API_URL khi deploy lên Vercel
 * Fallback về http://localhost:3000 khi chạy local
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
