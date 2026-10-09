import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

export type ModulePracticeRecommendation =
    | {
        mode: 'PALNET_SYNTHETIC_LOCAL_PILOT';
        exerciseId: string;
        title: string;
        difficulty: 'EASY' | 'MEDIUM' | 'HARD';
        skillId: string;
        estimatedReadiness: number;
        availableCount: number;
    }
    | { mode: 'MANUAL' | 'COMPLETE'; reason: string };

export async function getModulePracticeRecommendation(lessonId: string): Promise<ModulePracticeRecommendation> {
    const token = localStorage.getItem('token');
    if (!token) return { mode: 'MANUAL', reason: 'LOGIN_REQUIRED' };
    const response = await axios.get<ModulePracticeRecommendation>(
        `${API_BASE_URL}/api/courses/module-practice/${encodeURIComponent(lessonId)}/recommendation`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 8000 },
    );
    return response.data;
}
