import { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';

interface UseAdminDataOptions {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
}

export function useAdminUsers(options: UseAdminDataOptions = {}) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: options.page || 1,
        limit: options.limit || 10,
        total: 0,
        totalPages: 0
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await adminApi.getAllUsers({
                page: pagination.page,
                limit: pagination.limit,
                ...options.filters
            });
            setData(result.users);
            setPagination(prev => ({ ...prev, ...result.pagination }));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.page, JSON.stringify(options.filters)]);

    const refetch = () => fetchData();

    const setPage = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    return { data, loading, error, pagination, setPage, refetch };
}

export function useAdminStats() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await adminApi.getDashboardStats();
                setStats(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Lỗi khi tải thống kê');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
}

export function useAdminUser(userId: string | undefined) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await adminApi.getUserById(userId);
                setUser(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Lỗi khi tải user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const refetch = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const data = await adminApi.getUserById(userId);
            setUser(data);
        } catch (err) {
            setError('Lỗi khi tải lại user');
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, refetch };
}
