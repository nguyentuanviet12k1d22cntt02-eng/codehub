import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import { onboardingService } from './onboardingService';
import { evaluatePretestBank, loadPretestBank } from './pretestBankGate';
import { SUPPORTED_LANGUAGES } from './onboardingConfig';
import { SupportedLanguage } from '../../shared/types/roadmapContracts';

function getErrorCode(message: string): string {
  return message.split(':', 1)[0] || 'ONBOARDING_ERROR';
}

function getStatusCode(message: string): number {
  if (message.includes('FORBIDDEN')) return 403;
  if (message.includes('NOT_FOUND')) return 404;
  if (message.includes('PRETEST_UNAVAILABLE')) return 503;
  if (/^(LANGUAGE_NOT_SUPPORTED|INVALID_|SURVEY_)/.test(message)) return 400;
  return 500;
}

export class OnboardingController {
  /** Read-only authoring gate; never creates an attempt or exposes answer material. */
  public async getPretestReadiness(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Yêu cầu xác thực tài khoản' });
        return;
      }
      const surveyId = req.params.surveyId as string;
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(surveyId)) {
        res.status(400).json({ error: 'INVALID_SURVEY_ID', code: 'INVALID_SURVEY_ID' });
        return;
      }
      const survey = await onboardingService.getSurveyById(userId, surveyId);
      if (survey.isDraft) {
        res.status(400).json({ error: 'SURVEY_DRAFT: Cần hoàn tất khảo sát trước Pre-test.', code: 'SURVEY_DRAFT' });
        return;
      }
      if (!SUPPORTED_LANGUAGES.includes(survey.language as SupportedLanguage)) {
        res.status(400).json({ error: 'LANGUAGE_NOT_SUPPORTED', code: 'LANGUAGE_NOT_SUPPORTED' });
        return;
      }
      const result = evaluatePretestBank(survey.language as SupportedLanguage, survey.goalId, loadPretestBank());
      res.status(result.status === 'PRETEST_UNAVAILABLE' ? 503 : 200).json(result);
    } catch (err: any) {
      const message = err.message || 'Lỗi khi kiểm tra ngân hàng Pre-test';
      res.status(getStatusCode(message)).json({ error: message, code: getErrorCode(message) });
    }
  }

  /**
   * GET /api/onboarding/goals?language=PYTHON
   */
  public async getGoals(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const language = (req.query.language as string) || 'PYTHON';
      const result = onboardingService.getGoals(language);
      res.status(200).json(result);
    } catch (err: any) {
      const message = err.message || 'Lỗi khi tải mục tiêu học';
      res.status(getStatusCode(message)).json({ error: message, code: getErrorCode(message) });
    }
  }

  /**
   * POST /api/onboarding/survey
   */
  public async submitSurvey(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Yêu cầu xác thực tài khoản' });
        return;
      }

      const result = await onboardingService.createOrUpdateSurvey(userId, req.body);
      res.status(201).json(result);
    } catch (err: any) {
      const message = err.message || 'Lỗi khi lưu khảo sát';
      res.status(getStatusCode(message)).json({ error: message, code: getErrorCode(message) });
    }
  }

  /**
   * GET /api/onboarding/survey?language=PYTHON
   */
  public async getLatestSurvey(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Yêu cầu xác thực tài khoản' });
        return;
      }

      const language = (req.query.language as string) || 'PYTHON';
      const survey = await onboardingService.getLatestSurvey(userId, language);
      if (!survey) {
        res.status(404).json({ error: `Chưa có khảo sát nào cho ngôn ngữ ${language}` });
        return;
      }

      res.status(200).json(survey);
    } catch (err: any) {
      const message = err.message || 'Lỗi khi tải khảo sát';
      res.status(getStatusCode(message)).json({ error: message, code: getErrorCode(message) });
    }
  }

  /**
   * GET /api/onboarding/survey/:id
   */
  public async getSurveyById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Yêu cầu xác thực tài khoản' });
        return;
      }

      const surveyId = req.params.id as string;
      const survey = await onboardingService.getSurveyById(userId, surveyId);
      res.status(200).json(survey);
    } catch (err: any) {
      const message = err.message || 'Lỗi khi tải khảo sát';
      res.status(getStatusCode(message)).json({ error: message, code: getErrorCode(message) });
    }
  }
}

export const onboardingController = new OnboardingController();
