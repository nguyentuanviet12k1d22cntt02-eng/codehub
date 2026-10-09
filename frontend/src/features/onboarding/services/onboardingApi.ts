import { API_BASE_URL } from '../../../config/api';
import type { 
  CreateSurveyDto, 
  LearnerSurveyDto,
  LearningGoalsResponseDto, 
  ModuleDefinitionDto,
  SupportedLanguage, 
  SurveyResponseDto 
} from '../../../types/roadmapContracts';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const onboardingApi = {
  /**
   * Lấy danh sách mục tiêu và modules theo ngôn ngữ
   */
  async getGoals(language: SupportedLanguage): Promise<LearningGoalsResponseDto & { domainName: string; domainDescription: string; modules: ModuleDefinitionDto[] }> {
    const res = await fetch(`${API_BASE_URL}/api/onboarding/goals?language=${language}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Không thể tải mục tiêu học' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    return res.json();
  },

  /**
   * Lưu hoặc nộp khảo sát đầu vào
   */
  async submitSurvey(dto: CreateSurveyDto): Promise<SurveyResponseDto> {
    const res = await fetch(`${API_BASE_URL}/api/onboarding/survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Không thể lưu bản khảo sát' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    return res.json();
  },

  /**
   * Lấy bản khảo sát gần nhất của người dùng theo ngôn ngữ
   */
  async getLatestSurvey(language: SupportedLanguage): Promise<LearnerSurveyDto | null> {
    const res = await fetch(`${API_BASE_URL}/api/onboarding/survey?language=${language}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Lỗi khi tải khảo sát' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    return res.json();
  },

  /**
   * Lấy chi tiết khảo sát theo ID
   */
  async getSurveyById(surveyId: string): Promise<LearnerSurveyDto> {
    const res = await fetch(`${API_BASE_URL}/api/onboarding/survey/${surveyId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Lỗi khi tải khảo sát' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    return res.json();
  },
};
