import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export type GraphLanguage = 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'SQL';

/** Skill graphs are read-only content served by the backend from the database. */
export interface SkillGraphData {
    version?: string;
    skills: Array<Record<string, unknown>>;
    edges?: Array<Record<string, unknown>>;
    modules: Array<Record<string, unknown>>;
    topics?: Array<Record<string, unknown>>;
    [key: string]: unknown;
}

export const EMPTY_SKILL_GRAPH: SkillGraphData = { skills: [], edges: [], modules: [], topics: [] };

export function useSkillGraph(language: GraphLanguage) {
    return useQuery({
        queryKey: ['skill-graph', language],
        queryFn: async (): Promise<SkillGraphData> => {
            const response = await axios.get(`${API_BASE_URL}/api/recommendations/skill-graph`, { params: { language } });
            return response.data.data as SkillGraphData;
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
