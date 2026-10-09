import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../../components/AppNavbar';
import { KnowledgeGraphTree } from '../../adaptive-learning/components/KnowledgeGraphTree';
import type { SupportedLanguage } from '../../adaptive-learning/components/KnowledgeGraphTree';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

interface UserMasteryData {
    success: boolean;
    language?: string;
    student_meta: {
        username: string;
        email: string;
        profile: 'NEW' | 'STRUGGLING' | 'AVERAGE' | 'EXCELLENT';
    };
    mastery: {
        'Evidence-Based': Record<string, number>;
    };
    evidence: Record<string, {
        mastery: number;
        confidence: number;
        attempts: number;
        passed: number;
        failed: number;
        source: 'COURSE_SANDBOX' | 'ADAPTIVE_SANDBOX' | 'MIXED_VERIFIED';
        last_assessed_at: string | null;
    }>;
    stats: {
        lessons_completed: number;
        practice_completed: number;
        streak_days: number;
        total_actions: number;
        total_evidence_weight: number;
        observed_skills: number;
        total_skills: number;
        overall_mastery: number | null;
    };
}

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('PYTHON');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [data, setData] = useState<UserMasteryData | null>(null);
    const [activeModel, setActiveModel] = useState<'Evidence-Based'>('Evidence-Based');

    useEffect(() => {
        const fetchMastery = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                setError('');
                setData(null);
                const response = await axios.get(`${API_BASE_URL}/api/auth/user-mastery`, {
                    params: { language: selectedLanguage },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (err: unknown) {
                console.error(err);
                setData(null);
                setError('Không thể tải thông tin tri thức người học.');
            } finally {
                setLoading(false);
            }
        };

        fetchMastery();
    }, [navigate, selectedLanguage]);

    const currentModelMasteries = useMemo(() => {
        return data?.mastery?.[activeModel] || {};
    }, [data, activeModel]);

    const overallScore = useMemo(() => {
        return typeof data?.stats?.overall_mastery === 'number'
            ? data.stats.overall_mastery
            : null;
    }, [data]);

    if (error && !data) {
        return (
            <div className="bg-[#F4F7FC] text-slate-800 min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
                <AlertTriangle className="w-12 h-12 text-amber-500 mb-3 animate-pulse" />
                <h2 className="text-xl font-bold mb-2 text-slate-900">Đã xảy ra lỗi</h2>
                <p className="text-sm text-slate-500 mb-6">{error || 'Không tìm thấy thông tin cấu hình học viên.'}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                    Quay về Trang chủ
                </button>
            </div>
        );
    }

    const student_meta = data?.student_meta || {
        username: 'Học viên',
        email: '',
        profile: 'NEW' as const
    };
    const stats = data?.stats || {
        lessons_completed: 0,
        practice_completed: 0,
        streak_days: 0,
        total_actions: 0,
        total_evidence_weight: 0,
        observed_skills: 0,
        total_skills: 0,
        overall_mastery: null
    };

    return (
        <div className="bg-[#F4F7FC] text-slate-800 min-h-screen flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
            
            {/* Header navbar đồng bộ */}
            <AppNavbar />

            {/* ========================================================================= */}
            {/* MAIN INTERACTIVE DAG KNOWLEDGE GRAPH EXPERIENCE                           */}
            {/* ========================================================================= */}
            <main className="flex-1 flex flex-col w-full max-w-[1850px] mx-auto p-4 md:p-6 overflow-hidden">
                <KnowledgeGraphTree
                    userMastery={currentModelMasteries}
                    userEvidence={data?.evidence || {}}
                    activeLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                    isLoading={loading}
                    activeModel={activeModel}
                    onModelChange={setActiveModel}
                    overallScore={overallScore}
                    streakDays={stats.streak_days}
                    studentMeta={student_meta}
                    stats={stats}
                    isFullPage={true}
                />
            </main>
        </div>
    );
};

export default Profile;
