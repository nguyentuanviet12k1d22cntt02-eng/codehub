import { API_BASE_URL } from '../../../config/api';
import type {
  AssessmentResponseDto,
  LearnerProfileResponseDto,
  PretestAttemptDto,
  SavePretestAnswerResponseDto,
  SubmitAnswerDto,
  SubmitPretestDto,
  SubmitPretestResponseDto,
  SupportedLanguage,
} from '../../../types/roadmapContracts';

export class PretestApiError extends Error {
  readonly code?: string;
  readonly status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'PretestApiError';
    this.code = code;
    this.status = status;
  }
}

function headers(extra?: Record<string, string>): Record<string, string> {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function parse<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: fallback }));
    const rawMessage = typeof body.error === 'string' ? body.error : fallback;
    const message = rawMessage.includes(':') ? rawMessage.slice(rawMessage.indexOf(':') + 1).trim() : rawMessage;
    throw new PretestApiError(message, response.status, body.code);
  }
  return response.json();
}

export const pretestApi = {
  async createOrResume(surveyId: string): Promise<PretestAttemptDto> {
    const response = await fetch(`${API_BASE_URL}/api/pretests`, {
      method: 'POST', headers: headers(), body: JSON.stringify({ surveyId }),
    });
    return parse(response, 'Không thể tạo bài Pre-test.');
  },

  async getAttempt(attemptId: string): Promise<PretestAttemptDto> {
    const response = await fetch(`${API_BASE_URL}/api/pretests/${attemptId}`, { headers: headers() });
    return parse(response, 'Không thể tải bài Pre-test.');
  },

  async saveAnswer(attemptId: string, answer: SubmitAnswerDto): Promise<SavePretestAnswerResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/pretests/${attemptId}/answers`, {
      method: 'PUT', headers: headers(), body: JSON.stringify(answer),
    });
    return parse(response, 'Không thể lưu câu trả lời.');
  },

  async submit(attemptId: string, payload: SubmitPretestDto, idempotencyKey: string): Promise<SubmitPretestResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/pretests/${attemptId}/submit`, {
      method: 'POST', headers: headers({ 'Idempotency-Key': idempotencyKey }), body: JSON.stringify(payload),
    });
    return parse(response, 'Không thể nộp bài Pre-test.');
  },

  async getAssessment(assessmentId: string): Promise<AssessmentResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/pretests/assessments/${assessmentId}`, { headers: headers() });
    return parse(response, 'Không thể tải kết quả Pre-test.');
  },

  async getProfile(language: SupportedLanguage): Promise<LearnerProfileResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/learner-profile?language=${language}`, { headers: headers() });
    return parse(response, 'Không thể tải hồ sơ kỹ năng.');
  },
};
