import { API_BASE_URL } from '../../../config/api';
import type { RoadmapDto } from '../../../types/roadmapContracts';

export class RoadmapApiError extends Error {
  public readonly status: number;
  public readonly code: string | null;

  constructor(message: string, status: number, code: string | null) {
    super(message);
    this.name = 'RoadmapApiError';
    this.status = status;
    this.code = code;
  }
}

async function request(url: string, method: 'GET' | 'POST', body?: object): Promise<RoadmapDto> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new RoadmapApiError(
      data.error || 'Không thể tải lộ trình.',
      response.status,
      typeof data.code === 'string' ? data.code : null,
    );
  }
  return response.json();
}

export const roadmapApi = {
  create: (assessmentId: string) => request('/api/roadmaps', 'POST', { assessmentId }),
  get: (id: string) => request(`/api/roadmaps/${id}`, 'GET'),
  getLatest: () => request('/api/roadmaps/latest', 'GET'),
  sync: (id: string) => request(`/api/roadmaps/${id}/sync`, 'POST'),
};
