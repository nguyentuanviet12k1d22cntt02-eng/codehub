import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import { pretestRuntimeService } from './pretestRuntimeService';

function errorCode(message: string): string {
  return message.split(':', 1)[0] || 'PRETEST_ERROR';
}

function statusCode(message: string): number {
  if (message.includes('FORBIDDEN')) return 403;
  if (message.includes('NOT_FOUND')) return 404;
  if (message.includes('PRETEST_UNAVAILABLE') || message.includes('RUNNER_UNAVAILABLE')) return 503;
  if (/COOLDOWN|CONFLICT|NOT_ACTIVE|EXPIRED|IN_PROGRESS|SCOPE_MISMATCH/.test(message)) return 409;
  if (/^(INVALID_|SURVEY_DRAFT|LANGUAGE_NOT_SUPPORTED)/.test(message)) return 400;
  return 500;
}

function userId(req: AuthenticatedRequest, res: Response): string | null {
  if (req.user?.id) return req.user.id;
  res.status(401).json({ error: 'Yêu cầu xác thực tài khoản', code: 'UNAUTHORIZED' });
  return null;
}

export class PretestRuntimeController {
  public async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const ownerId = userId(req, res);
    if (!ownerId) return;
    try {
      const result = await pretestRuntimeService.createOrResumeAttempt(ownerId, req.body?.surveyId);
      res.status(201).json(result);
    } catch (error: any) {
      this.respondError(res, error);
    }
  }

  public async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    const ownerId = userId(req, res);
    if (!ownerId) return;
    try {
      res.status(200).json(await pretestRuntimeService.getAttempt(ownerId, req.params.id as string));
    } catch (error: any) {
      this.respondError(res, error);
    }
  }

  public async saveAnswer(req: AuthenticatedRequest, res: Response): Promise<void> {
    const ownerId = userId(req, res);
    if (!ownerId) return;
    try {
      const result = await pretestRuntimeService.saveAnswer(ownerId, req.params.id as string, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      this.respondError(res, error);
    }
  }

  public async submit(req: AuthenticatedRequest, res: Response): Promise<void> {
    const ownerId = userId(req, res);
    if (!ownerId) return;
    try {
      const key = req.header('Idempotency-Key') ?? '';
      const result = await pretestRuntimeService.submitAttempt(ownerId, req.params.id as string, req.body ?? {}, key);
      res.status(200).json(result);
    } catch (error: any) {
      this.respondError(res, error);
    }
  }

  public async getAssessment(req: AuthenticatedRequest, res: Response): Promise<void> {
    const ownerId = userId(req, res);
    if (!ownerId) return;
    try {
      res.status(200).json(await pretestRuntimeService.getAssessment(ownerId, req.params.id as string));
    } catch (error: any) {
      this.respondError(res, error);
    }
  }

  public async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const ownerId = userId(req, res);
    if (!ownerId) return;
    try {
      res.status(200).json(await pretestRuntimeService.getLearnerProfile(ownerId, String(req.query.language ?? 'PYTHON')));
    } catch (error: any) {
      this.respondError(res, error);
    }
  }

  private respondError(res: Response, error: any): void {
    const message = error?.message || 'Lỗi khi xử lý Pre-test';
    res.status(statusCode(message)).json({ error: message, code: errorCode(message) });
  }
}

export const pretestRuntimeController = new PretestRuntimeController();
