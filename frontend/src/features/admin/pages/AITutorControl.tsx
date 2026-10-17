import { useEffect, useState } from 'react';
import { AlertTriangle, Bot, LockKeyhole, RefreshCw, ShieldCheck, ToggleLeft, UnlockKeyhole } from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface TutorAvailability {
    enabled: boolean;
    updatedAt: string;
    updatedBy: string | null;
}

function formatUpdatedAt(value?: string): string {
    if (!value) return 'Chưa có dữ liệu cập nhật';
    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default function AITutorControl() {
    const [availability, setAvailability] = useState<TutorAvailability | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadAvailability = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await adminApi.getTutorAvailability();
            setAvailability(response.availability);
        } catch (requestError: any) {
            setError(requestError.response?.data?.message || 'Không tải được trạng thái AI Tutor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadAvailability();
    }, []);

    const updateAvailability = async () => {
        if (!availability || saving) return;
        const nextEnabled = !availability.enabled;
        if (!nextEnabled && !window.confirm('Khóa AI Tutor? Học viên sẽ chỉ thấy giao diện làm mờ và không thể gửi câu hỏi mới.')) {
            return;
        }

        setSaving(true);
        setError('');
        try {
            const response = await adminApi.updateTutorAvailability(nextEnabled);
            setAvailability(response.availability);
        } catch (requestError: any) {
            setError(requestError.response?.data?.message || 'Không cập nhật được trạng thái AI Tutor.');
        } finally {
            setSaving(false);
        }
    };

    const enabled = availability?.enabled === true;
    const statusLabel = enabled ? 'Đang mở cho học viên' : 'Đang khóa';

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-16 text-left">
            <section className="rounded-3xl border border-indigo-100 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.16),_transparent_36%),linear-gradient(135deg,_#ffffff_0%,_#f6f7ff_100%)] p-6 shadow-sm dark:border-white/10 dark:from-slate-950 dark:to-indigo-950/40 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-indigo-700 dark:border-indigo-400/30 dark:bg-slate-950/50 dark:text-indigo-200">
                            <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                            Trạng thái dịch vụ
                        </span>
                        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Điều khiển AI Tutor</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Mở hoặc tạm khóa trang Luyện tập AI cho toàn bộ học viên. Khi khóa, nội dung chat được làm mờ và backend từ chối yêu cầu mới.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void loadAvailability()}
                        disabled={loading || saving}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-55 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                        Làm mới
                    </button>
                </div>
            </section>

            {error && (
                <p role="alert" className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-400/30 dark:bg-rose-950/30 dark:text-rose-100">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {error}
                </p>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-7" aria-busy={loading}>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${enabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300'}`}>
                            {enabled ? <UnlockKeyhole className="h-6 w-6" aria-hidden="true" /> : <LockKeyhole className="h-6 w-6" aria-hidden="true" />}
                        </span>
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Quyền truy cập học viên</p>
                            <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{loading ? 'Đang kiểm tra trạng thái…' : statusLabel}</h3>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {enabled
                                    ? 'Học viên có thể bắt đầu và tiếp tục trò chuyện với AI Tutor.'
                                    : 'Học viên nhìn thấy lớp phủ thông báo; ô nhập và các thao tác chat đều bị vô hiệu hóa.'}
                            </p>
                            {availability && (
                                <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Cập nhật lần cuối: {formatUpdatedAt(availability.updatedAt)}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        aria-label={enabled ? 'Khóa AI Tutor' : 'Mở AI Tutor'}
                        onClick={() => void updateAvailability()}
                        disabled={loading || saving || !availability}
                        className={`inline-flex min-h-12 min-w-40 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 ${enabled ? 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500' : 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500'}`}
                    >
                        {saving ? <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" /> : enabled ? <LockKeyhole className="h-4 w-4" aria-hidden="true" /> : <UnlockKeyhole className="h-4 w-4" aria-hidden="true" />}
                        {saving ? 'Đang lưu…' : enabled ? 'Khóa AI Tutor' : 'Mở AI Tutor'}
                    </button>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
                    <ToggleLeft className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                    <h3 className="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">Một công tắc chung</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Áp dụng ngay cho tất cả học viên và lưu lại sau khi tải lại trang.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
                    <LockKeyhole className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                    <h3 className="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">Khóa hai lớp</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Lớp phủ làm mờ hướng dẫn học viên và API cũng chặn gửi hội thoại mới.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                    <h3 className="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">Chỉ quản trị viên</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Giảng viên và học viên không thể thay đổi thiết lập hoạt động hệ thống này.</p>
                </div>
            </section>
        </div>
    );
}
