import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const API_URL = `${API_BASE_URL}/api/admin`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [userGrowth, setUserGrowth] = useState<any>(null);
    const [submissionStats, setSubmissionStats] = useState<any>(null);
    const [courseEngagement, setCourseEngagement] = useState<any>(null);
    const [topPerformers, setTopPerformers] = useState<any>(null);
    const [systemHealth, setSystemHealth] = useState<any>(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const [growth, submissions, courses, performers, health] = await Promise.all([
                axios.get(`${API_URL}/analytics/user-growth?days=30`, { headers: getAuthHeader() }),
                axios.get(`${API_URL}/analytics/submissions?days=7`, { headers: getAuthHeader() }),
                axios.get(`${API_URL}/analytics/course-engagement`, { headers: getAuthHeader() }),
                axios.get(`${API_URL}/analytics/top-performers?limit=5`, { headers: getAuthHeader() }),
                axios.get(`${API_URL}/analytics/system-health`, { headers: getAuthHeader() })
            ]);

            setUserGrowth(growth.data);
            setSubmissionStats(submissions.data);
            setCourseEngagement(courses.data);
            setTopPerformers(performers.data);
            setSystemHealth(health.data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-10 h-10 border-4 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                <div className="text-sm font-bold text-text-tertiary tracking-wider animate-pulse">ĐANG PHÂN TÍCH HỆ THỐNG...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1240px] mx-auto text-left select-none animate-fadeIn">
            {/* Header Block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-1 text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Báo cáo & Thống kê</h1>
                    <p className="text-text-tertiary text-sm">Phân tích chi tiết mức độ tương tác, hiệu suất giải bài và trạng thái sức khỏe hệ thống.</p>
                </div>
                <button
                    onClick={loadAnalytics}
                    className="px-5 py-2.5 bg-bg-secondary hover:bg-bg-tertiary text-text-primary text-xs font-bold rounded-xl border border-border-custom transition-all active:scale-[0.98] cursor-pointer"
                >
                    <i className="fa-solid fa-arrows-rotate mr-1.5"></i> Cập nhật dữ liệu
                </button>
            </div>

            {/* System Health */}
            {systemHealth && (
                <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <i className="fa-solid fa-shield-halved text-accent-custom"></i> Tình trạng Hệ thống
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${getHealthStyle(systemHealth.health)}`}>
                            Hệ thống: {systemHealth.health}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <HealthCard
                            title="Active Users (24h)"
                            value={systemHealth.activeUsers.last24h}
                            icon={<i className="fa-solid fa-circle text-emerald-500"></i>}
                            color="blue"
                        />
                        <HealthCard
                            title="Active Users (7 ngày)"
                            value={systemHealth.activeUsers.last7d}
                            icon={<i className="fa-solid fa-calendar text-blue-500"></i>}
                            color="green"
                        />
                        <HealthCard
                            title="Submissions (24h)"
                            value={systemHealth.submissions.last24h}
                            icon={<i className="fa-solid fa-inbox text-purple-500"></i>}
                            color="purple"
                        />
                        <HealthCard
                            title="Error Rate (Tỷ lệ lỗi)"
                            value={systemHealth.submissions.errorRate}
                            icon={<i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>}
                            color={parseInt(systemHealth.submissions.errorRate) < 30 ? 'green' : 'red'}
                        />
                    </div>
                </div>
            )}

            {/* Submission Statistics */}
            {submissionStats && (
                <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <i className="fa-solid fa-chart-line text-accent-custom"></i> Thống kê Bài nộp (7 ngày gần đây)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Tổng số bài nộp"
                            value={submissionStats.overview.total}
                            color="text-indigo-400 bg-indigo-400/5 hover:border-indigo-400/20"
                        />
                        <StatCard
                            title="Nộp từ Khóa học (Lessons)"
                            value={submissionStats.overview.totalSubmissions}
                            color="text-emerald-400 bg-emerald-400/5 hover:border-emerald-400/20"
                        />
                        <StatCard
                            title="Nộp từ Đấu trường (Practice)"
                            value={submissionStats.overview.totalPracticeSubmissions}
                            color="text-amber-400 bg-amber-400/5 hover:border-amber-400/20"
                        />
                    </div>
                </div>
            )}

            {/* Course Engagement */}
            {courseEngagement && (
                <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <i className="fa-solid fa-graduation-cap text-accent-custom"></i> Mức độ tương tác Khóa học
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-border-custom/50">
                        <table className="min-w-full divide-y divide-border-custom bg-transparent text-left">
                            <thead className="bg-bg-tertiary/30">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Thứ hạng</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Tên Khóa Học</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Cấp độ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Số học viên</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Số bài học</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Tỷ lệ Hoàn thành</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-custom/50 divide-dashed">
                                {courseEngagement.topCourses.map((course: any, index: number) => (
                                    <tr key={course.id} className="hover:bg-bg-tertiary/20 transition-colors">
                                        <td className="px-6 py-4 text-[13px] font-bold text-text-tertiary">#{index + 1}</td>
                                        <td className="px-6 py-4 text-[13px] font-bold text-text-primary">{course.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border tracking-wider ${getLevelBadgeStyle(course.level)}`}>
                                                {course.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-text-secondary font-mono font-semibold">{course.enrollments}</td>
                                        <td className="px-6 py-4 text-[13px] text-text-secondary font-mono font-semibold">{course.modules}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-bg-tertiary rounded-full h-2 overflow-hidden border border-border-custom/30 min-w-[100px]">
                                                    <div
                                                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full"
                                                        style={{ width: `${course.completionRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-[13px] font-bold font-mono text-text-primary">{course.completionRate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top Performers Grid */}
            {topPerformers && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top by Submissions */}
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-text-primary tracking-wide flex items-center gap-2">
                            <i className="fa-solid fa-trophy text-yellow-500"></i> Hoạt động năng nổ nhất (Theo số bài nộp)
                        </h2>
                        <div className="flex flex-col gap-3">
                            {topPerformers.topBySubmissions.map((user: any, index: number) => (
                                <div key={user.id} className="flex items-center justify-between p-3.5 bg-bg-tertiary/20 hover:bg-bg-tertiary/40 border border-border-custom/30 hover:border-border-custom/60 rounded-xl transition-all flex-row animate-fadeIn">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs select-none ${getMedalStyle(index)}`}>
                                            {index === 0 && <i className="fa-solid fa-trophy text-yellow-500"></i>}
                                            {index === 1 && <i className="fa-solid fa-medal text-slate-400"></i>}
                                            {index === 2 && <i className="fa-solid fa-award text-amber-600"></i>}
                                            {index >= 3 && `#${index + 1}`}
                                        </span>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[13px] font-bold text-text-primary">{user.username}</span>
                                            <span className="text-[10px] text-text-tertiary max-w-[160px] truncate">{user.email}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-accent-custom font-mono bg-accent-bg border border-accent-border/30 px-3 py-1 rounded-lg">
                                        {user.totalSubmissions} bài giải
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top by Passed */}
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-text-primary tracking-wide flex items-center gap-2">
                            <i className="fa-solid fa-circle-check text-emerald-500"></i> Lời giải đúng nhiều nhất (Passed)
                        </h2>
                        <div className="flex flex-col gap-3">
                            {topPerformers.topByPassed.map((user: any, index: number) => (
                                <div key={user.id} className="flex items-center justify-between p-3.5 bg-bg-tertiary/20 hover:bg-bg-tertiary/40 border border-border-custom/30 hover:border-border-custom/60 rounded-xl transition-all flex-row animate-fadeIn">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs select-none ${getMedalStyle(index)}`}>
                                            {index === 0 && <i className="fa-solid fa-trophy text-yellow-500"></i>}
                                            {index === 1 && <i className="fa-solid fa-medal text-slate-400"></i>}
                                            {index === 2 && <i className="fa-solid fa-award text-amber-600"></i>}
                                            {index >= 3 && `#${index + 1}`}
                                        </span>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[13px] font-bold text-text-primary">{user.username}</span>
                                            <span className="text-[10px] text-text-tertiary max-w-[160px] truncate">{user.email}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-lg">
                                        {user.passedCount} Passed
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* User Growth Chart */}
            {userGrowth && userGrowth.dailyStats.length > 0 && (
                <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                    <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <i className="fa-solid fa-chart-simple text-accent-custom font-bold"></i> Tốc độ Tăng trưởng Người dùng (30 ngày qua)
                    </h2>
                    <div className="flex flex-col gap-4">
                        {userGrowth.dailyStats.slice(-8).map((stat: any) => {
                            const studentPct = stat.total > 0 ? (stat.students / stat.total) * 100 : 0;
                            const teacherPct = stat.total > 0 ? (stat.teachers / stat.total) * 100 : 0;
                            const adminPct = stat.total > 0 ? (stat.admins / stat.total) * 100 : 0;

                            return (
                                <div key={stat.date} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                                    <span className="text-xs text-text-tertiary font-bold min-w-[90px]">
                                        {new Date(stat.date).toLocaleDateString('vi-VN')}
                                    </span>
                                    <div className="flex-1 w-full flex bg-bg-tertiary rounded-xl overflow-hidden h-6 border border-border-custom/30">
                                        {stat.students > 0 && (
                                            <div
                                                className="bg-emerald-500/80 hover:bg-emerald-500 h-full transition-all flex items-center justify-center text-[9px] font-extrabold text-white"
                                                style={{ width: `${studentPct}%` }}
                                                title={`Students: ${stat.students}`}
                                            >
                                                {stat.students > 1 && `${stat.students} Stu`}
                                            </div>
                                        )}
                                        {stat.teachers > 0 && (
                                            <div
                                                className="bg-blue-500/80 hover:bg-blue-500 h-full transition-all flex items-center justify-center text-[9px] font-extrabold text-white"
                                                style={{ width: `${teacherPct}%` }}
                                                title={`Teachers: ${stat.teachers}`}
                                            >
                                                {stat.teachers > 1 && `${stat.teachers} T`}
                                            </div>
                                        )}
                                        {stat.admins > 0 && (
                                            <div
                                                className="bg-rose-500/80 hover:bg-rose-500 h-full transition-all flex items-center justify-center text-[9px] font-extrabold text-white"
                                                style={{ width: `${adminPct}%` }}
                                                title={`Admins: ${stat.admins}`}
                                            >
                                                {stat.admins > 0 && `${stat.admins} A`}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-text-primary font-mono min-w-[70px] text-right">
                                        {stat.total} user(s)
                                    </span>
                                </div>
                            );
                        })}

                        <div className="flex flex-wrap gap-4 mt-2 text-xs font-bold justify-center border-t border-border-custom/50 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-md"></div>
                                <span className="text-text-secondary">Students (Học viên)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-blue-500 rounded-md"></div>
                                <span className="text-text-secondary">Teachers (Giáo viên)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-rose-500 rounded-md"></div>
                                <span className="text-text-secondary">Admins (Quản trị viên)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function HealthCard({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
    const colors: any = {
        blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
        green: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
        purple: 'border-[#c084fc]/20 bg-[#c084fc]/5 text-[#c084fc]',
        red: 'border-rose-500/20 bg-rose-500/5 text-rose-400'
    };

    return (
        <div className={`rounded-2xl p-4 border flex items-center justify-between transition-all duration-300 hover:scale-[1.02] ${colors[color]}`}>
            <div className="flex flex-col gap-1 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{title}</p>
                <p className="text-2xl font-black font-mono tracking-tight mt-1">{value}</p>
            </div>
            <div className="text-xl">{icon}</div>
        </div>
    );
}

function StatCard({ title, value, color }: { title: string; value: number; colorClassName?: string; color: string }) {
    return (
        <div className={`border border-border-custom/80 hover:border-accent-border/60 rounded-2xl p-5 flex flex-col gap-1 transition-all duration-300 ${color}`}>
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider text-left">{title}</p>
            <p className="text-3xl font-black text-text-primary tracking-tight font-mono text-left mt-1">{value.toLocaleString()}</p>
        </div>
    );
}

function getHealthStyle(health: string) {
    switch (health) {
        case 'good':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'warning':
            return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        case 'critical':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        default:
            return 'bg-bg-tertiary text-text-secondary border-border-custom/50';
    }
}

function getLevelBadgeStyle(level: string) {
    switch (level) {
        case 'BASIC':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'INTERMEDIATE':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'ADVANCED':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        default:
            return 'bg-bg-tertiary text-text-secondary border-border-custom/50';
    }
}

function getMedalStyle(index: number) {
    switch (index) {
        case 0: return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
        case 1: return 'bg-gray-400/10 text-gray-300 border border-gray-400/20';
        case 2: return 'bg-amber-700/10 text-amber-600 border border-amber-700/20';
        default: return 'bg-bg-tertiary text-text-tertiary';
    }
}
