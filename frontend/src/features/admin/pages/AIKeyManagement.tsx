import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { 
    Key, 
    Plus, 
    RefreshCw, 
    CheckCircle2, 
    Trash2, 
    Zap, 
    ShieldCheck, 
    AlertTriangle,
    Copy,
    Check,
    Activity,
    Terminal,
    Eye
} from 'lucide-react';

interface AIKeyItem {
    id: string;
    provider: string;
    apiKeyMasked: string;
    label: string;
    isActive: boolean;
    usageCount: number;
    lastUsedAt: string | null;
    errorCount: number;
    lastError: string | null;
    createdAt: string;
}

interface AICallLogItem {
    id: string;
    provider: string;
    model: string;
    apiKeyMasked: string;
    status: string;
    statusCode: number;
    latencyMs: number;
    promptSample: string | null;
    responseSample: string | null;
    errorMessage: string | null;
    createdAt: string;
}

export default function AIKeyManagement() {
    const [keys, setKeys] = useState<AIKeyItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [stats, setStats] = useState({ total: 0, activeCount: 0 });

    // Call logs states
    const [logs, setLogs] = useState<AICallLogItem[]>([]);
    const [logsLoading, setLogsLoading] = useState<boolean>(false);
    const [logStats, setLogStats] = useState({ total: 0, successRate: 100 });
    const [autoRefreshLogs, setAutoRefreshLogs] = useState<boolean>(true);
    const [selectedLog, setSelectedLog] = useState<AICallLogItem | null>(null);

    // Form states
    const [provider, setProvider] = useState<string>('AUTO');
    const [rawKeys, setRawKeys] = useState<string>('');
    const [label, setLabel] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [testingId, setTestingId] = useState<string | null>(null);
    const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    const loadKeys = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/admin/ai-keys`, getAuthHeaders());
            if (res.data.success) {
                setKeys(res.data.keys);
                setStats({
                    total: res.data.total,
                    activeCount: res.data.activeCount
                });
            }
        } catch (error: any) {
            console.error('Failed to load AI keys:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadLogs = async () => {
        try {
            setLogsLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/admin/ai-keys/logs?limit=30`, getAuthHeaders());
            if (res.data.success) {
                setLogs(res.data.logs);
                setLogStats({
                    total: res.data.total,
                    successRate: res.data.successRate
                });
            }
        } catch (error: any) {
            console.error('Failed to load AI call logs:', error);
        } finally {
            setLogsLoading(false);
        }
    };

    useEffect(() => {
        loadKeys();
        loadLogs();
    }, []);

    // Auto-refresh logs every 6 seconds if enabled
    useEffect(() => {
        if (!autoRefreshLogs) return;
        const timer = setInterval(() => {
            loadLogs();
        }, 6000);
        return () => clearInterval(timer);
    }, [autoRefreshLogs]);

    const handleCreateBulk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rawKeys.trim()) return;

        try {
            setSubmitting(true);
            const res = await axios.post(
                `${API_BASE_URL}/api/admin/ai-keys/bulk`,
                { provider, rawKeys, label: label.trim() || undefined },
                getAuthHeaders()
            );

            if (res.data.success) {
                alert(res.data.message);
                setRawKeys('');
                setLabel('');
                loadKeys();
            }
        } catch (error: any) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (id: string) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/api/admin/ai-keys/${id}/toggle`, {}, getAuthHeaders());
            if (res.data.success) {
                setKeys(prev => prev.map(k => k.id === id ? { ...k, isActive: res.data.isActive } : k));
                setStats(prev => ({
                    ...prev,
                    activeCount: prev.activeCount + (res.data.isActive ? 1 : -1)
                }));
            }
        } catch (error: any) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id: string, label: string) => {
        if (!confirm(`Bạn có chắc muốn xóa key "${label}" khỏi hồ chứa?`)) return;

        try {
            const res = await axios.delete(`${API_BASE_URL}/api/admin/ai-keys/${id}`, getAuthHeaders());
            if (res.data.success) {
                setKeys(prev => prev.filter(k => k.id !== id));
                setStats(prev => ({ ...prev, total: prev.total - 1 }));
            }
        } catch (error: any) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleTestKey = async (id: string, provider: string) => {
        try {
            setTestingId(id);
            setTestResult(null);
            const res = await axios.post(
                `${API_BASE_URL}/api/admin/ai-keys/test`,
                { id, provider },
                getAuthHeaders()
            );

            setTestResult({
                id,
                success: res.data.success,
                message: res.data.message
            });
            // Tải lại để cập nhật lastUsedAt
            loadKeys();
        } catch (error: any) {
            setTestResult({
                id,
                success: false,
                message: error.response?.data?.message || error.message
            });
        } finally {
            setTestingId(null);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1480px] mx-auto text-left animate-fadeIn font-sans pb-16">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-custom pb-6">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                            <Key className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Hồ Chứa API Keys (AI Key Pool)
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Quản lý & tự động xoay vòng API Keys trực tiếp với Google Gemini, loại bỏ hoàn toàn proxy trung gian.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={loadKeys}
                    className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer shadow-sm"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Làm mới danh sách</span>
                </button>
            </div>

            {/* 2. Top Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-bg-secondary border border-border-custom shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                        <Key className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng số Keys</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                            {stats.total}
                        </h3>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-bg-secondary border border-border-custom shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Đang sẵn sàng</span>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {stats.activeCount}
                        </h3>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-bg-secondary border border-border-custom shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng Lượt Gọi AI</span>
                        <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                            {logStats.total}
                        </h3>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-bg-secondary border border-border-custom shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tỷ Lệ Thành Công</span>
                        <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                            {logStats.successRate}%
                        </h3>
                    </div>
                </div>
            </div>

            {/* 3. Bulk Key Insertion Form */}
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border-custom shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-sky-500" />
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Thêm API Key Vào Hồ Chứa (Hỗ trợ dán nhiều Key cùng lúc)
                    </h2>
                </div>

                <form onSubmit={handleCreateBulk} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Nhà cung cấp AI (Provider)
                            </label>
                            <select
                                value={provider}
                                onChange={e => setProvider(e.target.value)}
                                className="w-full bg-bg-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-sky-500 transition-colors font-medium"
                            >
                                <option value="AUTO">⚡ Tự Động Nhận Diện (AIza, gsk_, sk-or-, sk-...)</option>
                                <option value="GEMINI">Google Gemini (Khuyên dùng - gemini-2.5-flash)</option>
                                <option value="GROQ">Groq Cloud (Siêu tốc - Llama 3.3 70B)</option>
                                <option value="OPENROUTER">OpenRouter (Đa model - Gemini, Llama, DeepSeek)</option>
                                <option value="OPENAI">OpenAI (GPT-4o Mini)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Nhãn gợi nhớ (Tùy chọn)
                            </label>
                            <input
                                type="text"
                                value={label}
                                onChange={e => setLabel(e.target.value)}
                                placeholder="Ví dụ: Key tài khoản cá nhân, Key dự phòng..."
                                className="w-full bg-bg-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-sky-500 transition-colors placeholder-slate-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Danh sách API Keys (Mỗi dòng một key, hoặc ngăn cách bằng dấu phẩy)
                        </label>
                        <textarea
                            rows={3}
                            value={rawKeys}
                            onChange={e => setRawKeys(e.target.value)}
                            placeholder="Dán các API Key vào đây:&#10;AIzaSyDFiGZYf...&#10;AIzaSyB8x7kLm..."
                            className="w-full bg-bg-primary border border-border-custom rounded-xl p-3.5 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-sky-500 transition-colors placeholder-slate-400"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <p className="text-[11px] text-slate-400">
                            💡 Khi một key chạm ngưỡng Quota limit (429), AI Service sẽ tự động chuyển sang key tiếp theo trong hồ chứa này.
                        </p>
                        <button
                            type="submit"
                            disabled={submitting || !rawKeys.trim()}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{submitting ? 'Đang nạp...' : 'Nạp vào hồ chứa'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Test result banner */}
            {testResult && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed animate-fadeIn ${
                    testResult.success 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
                    <div className="flex-1">
                        <span className="font-bold">{testResult.success ? 'Kiểm tra thành công:' : 'Kiểm tra thất bại:'} </span>
                        <span>{testResult.message}</span>
                    </div>
                    <button 
                        onClick={() => setTestResult(null)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* 4. Keys Table */}
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border-custom shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Danh Sách API Keys Trong Hồ Chứa ({keys.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-xs text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-sky-500" />
                        <span>Đang tải danh sách hồ chứa API Keys...</span>
                    </div>
                ) : keys.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-border-custom rounded-xl">
                        <span>Chưa có API Key nào trong hồ chứa. Hãy dán key vào khung ở trên để bắt đầu.</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="border-b border-border-custom text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="py-3 px-3">Nhà Cung Cấp</th>
                                    <th className="py-3 px-3">Mã Key</th>
                                    <th className="py-3 px-3">Nhãn / Ghi Chú</th>
                                    <th className="py-3 px-3 text-center">Trạng Thái</th>
                                    <th className="py-3 px-3 text-center">Lượt Dùng</th>
                                    <th className="py-3 px-3 text-center">Lần Dùng Cuối</th>
                                    <th className="py-3 px-3 text-right">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-custom/50">
                                {keys.map(k => (
                                    <tr key={k.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-3.5 px-3">
                                            <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                k.provider === 'GEMINI'
                                                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                                                    : k.provider === 'GROQ'
                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                    : k.provider === 'OPENROUTER'
                                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {k.provider}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                                            <div className="flex items-center gap-2">
                                                <span>{k.apiKeyMasked}</span>
                                                <button
                                                    onClick={() => copyToClipboard(k.apiKeyMasked, k.id)}
                                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                                                    title="Sao chép mã"
                                                >
                                                    {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                                            {k.label}
                                            {k.lastError && (
                                                <div className="text-[10px] text-rose-500 mt-0.5 truncate max-w-xs" title={k.lastError}>
                                                    ⚠️ {k.lastError}
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-3 text-center">
                                            <button
                                                onClick={() => handleToggle(k.id)}
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                                                    k.isActive
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                                                }`}
                                            >
                                                {k.isActive ? '● Đang bật' : '○ Tạm ngưng'}
                                            </button>
                                        </td>

                                        <td className="py-3.5 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                                            {k.usageCount}
                                        </td>

                                        <td className="py-3.5 px-3 text-center text-slate-400 text-[11px]">
                                            {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : 'Chưa dùng'}
                                        </td>

                                        <td className="py-3.5 px-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleTestKey(k.id, k.provider)}
                                                    disabled={testingId === k.id}
                                                    className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/60 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                                                    title="Kiểm tra xem key có sống không"
                                                >
                                                    <Zap className={`w-3 h-3 ${testingId === k.id ? 'animate-spin' : ''}`} />
                                                    <span>{testingId === k.id ? 'Đang test...' : 'Test'}</span>
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(k.id, k.label)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                                                    title="Xóa key này"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 5. Live AI Call Monitoring & Logs */}
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border-custom shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-purple-500" />
                                <span>Nhật Ký Gọi AI Thời Gian Thực (Live AI Call Monitoring)</span>
                            </h2>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Theo dõi nhà cung cấp, model, độ trễ và nội dung phản hồi của từng cuộc gọi từ các Agent.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={autoRefreshLogs}
                                onChange={e => setAutoRefreshLogs(e.target.checked)}
                                className="rounded text-sky-600 focus:ring-0"
                            />
                            <span>Tự động cập nhật (6s)</span>
                        </label>

                        <button
                            onClick={loadLogs}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer shadow-xs"
                        >
                            <RefreshCw className={`w-3 h-3 ${logsLoading ? 'animate-spin' : ''}`} />
                            <span>Làm mới</span>
                        </button>
                    </div>
                </div>

                {logsLoading && logs.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-500" />
                        <span>Đang tải nhật ký cuộc gọi...</span>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400 border border-dashed border-border-custom rounded-xl">
                        <span>Chưa có lượt gọi AI nào được ghi nhận. Hãy kích hoạt tính năng ôn luyện hoặc tạo bài tập để xem logs.</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="border-b border-border-custom text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="py-3 px-3">Thời Gian</th>
                                    <th className="py-3 px-3">Provider</th>
                                    <th className="py-3 px-3">Model AI</th>
                                    <th className="py-3 px-3">Key Dùng</th>
                                    <th className="py-3 px-3 text-center">Trạng Thái</th>
                                    <th className="py-3 px-3 text-center">Độ Trễ</th>
                                    <th className="py-3 px-3">Yêu Cầu / Phản Hồi</th>
                                    <th className="py-3 px-3 text-right">Chi Tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-custom/50">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </td>

                                        <td className="py-3 px-3">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                                log.provider === 'GEMINI'
                                                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                                                    : log.provider === 'GROQ'
                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                    : log.provider === 'OPENROUTER'
                                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {log.provider}
                                            </span>
                                        </td>

                                        <td className="py-3 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                                            {log.model}
                                        </td>

                                        <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                                            {log.apiKeyMasked}
                                        </td>

                                        <td className="py-3 px-3 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                log.status === 'SUCCESS'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                            }`}>
                                                {log.status === 'SUCCESS' ? '✓ ' + log.statusCode : '✗ ' + log.statusCode}
                                            </span>
                                        </td>

                                        <td className="py-3 px-3 text-center font-mono font-medium">
                                            <span className={`${
                                                log.latencyMs < 2000 
                                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                                    : log.latencyMs < 5000 
                                                    ? 'text-amber-600 dark:text-amber-400' 
                                                    : 'text-rose-600 dark:text-rose-400'
                                            }`}>
                                                {log.latencyMs}ms
                                            </span>
                                        </td>

                                        <td className="py-3 px-3 max-w-xs">
                                            <div className="truncate text-[11px] text-slate-700 dark:text-slate-300 font-sans" title={log.promptSample || ''}>
                                                <span className="text-slate-400">Y/cầu: </span>{log.promptSample || '—'}
                                            </div>
                                            {log.responseSample && (
                                                <div className="truncate text-[10px] text-slate-400 font-mono mt-0.5" title={log.responseSample}>
                                                    <span className="text-slate-500">Phản hồi: </span>{log.responseSample}
                                                </div>
                                            )}
                                            {log.errorMessage && (
                                                <div className="truncate text-[10px] text-rose-500 mt-0.5" title={log.errorMessage}>
                                                    ⚠️ {log.errorMessage}
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-3 px-3 text-right">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                                            >
                                                <Eye className="w-3 h-3" />
                                                <span>Xem</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal xem chi tiết log */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-border-custom pb-3">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-purple-500" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Chi Tiết Cuộc Gọi AI ({selectedLog.provider} - {selectedLog.model})
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-bg-primary border border-border-custom">
                                <span className="text-[10px] text-slate-400 font-semibold block">Nhà Cung Cấp</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedLog.provider}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-bg-primary border border-border-custom">
                                <span className="text-[10px] text-slate-400 font-semibold block">Model AI</span>
                                <span className="font-bold text-slate-900 dark:text-white font-mono text-[11px]">{selectedLog.model}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-bg-primary border border-border-custom">
                                <span className="text-[10px] text-slate-400 font-semibold block">Độ Trễ</span>
                                <span className="font-bold text-emerald-500 font-mono">{selectedLog.latencyMs}ms</span>
                            </div>
                            <div className="p-3 rounded-xl bg-bg-primary border border-border-custom">
                                <span className="text-[10px] text-slate-400 font-semibold block">Trạng Thái HTTP</span>
                                <span className={`font-bold ${selectedLog.status === 'SUCCESS' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {selectedLog.statusCode} ({selectedLog.status})
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Nội Dung Yêu Cầu (Prompt Sample)
                            </label>
                            <pre className="p-3 rounded-xl bg-bg-primary border border-border-custom text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                {selectedLog.promptSample || 'Không có dữ liệu'}
                            </pre>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Nội Dung Phản Hồi Từ Model (Response Sample)
                            </label>
                            <pre className="p-3 rounded-xl bg-bg-primary border border-border-custom text-xs font-mono text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                                {selectedLog.responseSample || (selectedLog.errorMessage ? `⚠️ Lỗi: ${selectedLog.errorMessage}` : 'Không có dữ liệu')}
                            </pre>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
