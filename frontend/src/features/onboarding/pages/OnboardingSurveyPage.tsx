import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Braces,
  Check,
  CheckCircle2,
  CircleAlert,
  CircleDot,
  Clock3,
  Code2,
  Database,
  FileCheck2,
  Gauge,
  GraduationCap,
  Info,
  Layers3,
  RefreshCcw,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import AppNavbar from '../../../components/AppNavbar';
import type {
  CreateSurveyDto,
  ExternalExperience,
  LearnerSurveyDto,
  LearningGoalDto,
  McodeHistory,
  ModuleDefinitionDto,
  PreferredPace,
  StudyHoursPerWeek,
  SupportedLanguage,
  SurveyResponseDto,
  SurveyVerificationStatus,
} from '../../../types/roadmapContracts';
import { onboardingApi } from '../services/onboardingApi';

const STEPS = [
  { id: 1, label: 'Ngôn ngữ' },
  { id: 2, label: 'Mục tiêu' },
  { id: 3, label: 'Kinh nghiệm' },
  { id: 4, label: 'Tự đánh giá' },
  { id: 5, label: 'Kế hoạch học' },
] as const;

const LANGUAGE_CARDS: Array<{ id: SupportedLanguage; name: string; description: string; icon: LucideIcon; accentClass: string }> = [
  { id: 'PYTHON', name: 'Python', description: 'Cú pháp, cấu trúc dữ liệu và lập trình hướng đối tượng.', icon: Code2, accentClass: 'bg-blue-600 text-white' },
  { id: 'JAVASCRIPT', name: 'JavaScript', description: 'Lập trình web hiện đại, ES6+ và bất đồng bộ.', icon: Braces, accentClass: 'bg-amber-500 text-slate-950' },
  { id: 'CPP', name: 'C++', description: 'Tư duy lập trình, bộ nhớ và thư viện chuẩn STL.', icon: Gauge, accentClass: 'bg-cyan-600 text-white' },
  { id: 'SQL', name: 'SQL Server (T-SQL)', description: 'Truy vấn dữ liệu quan hệ, tổng hợp và JOIN.', icon: Database, accentClass: 'bg-emerald-600 text-white' },
];

const MCODE_HISTORY_OPTIONS: Array<{ id: McodeHistory; label: string; description: string }> = [
  { id: 'NEVER_ENROLLED', label: 'Chưa từng học', description: 'Chưa học lộ trình này trên MCODE.' },
  { id: 'LEARNING', label: 'Đang học', description: 'Đã bắt đầu nhưng chưa hoàn tất.' },
  { id: 'COMPLETED', label: 'Đã hoàn thành', description: 'Đã học xong lộ trình MCODE tương ứng.' },
  { id: 'NOT_SURE', label: 'Không chắc', description: 'Không nhớ rõ tiến độ đã học.' },
];

const EXPERIENCE_OPTIONS: Array<{ id: ExternalExperience; label: string; description: string }> = [
  { id: 'NONE', label: 'Hoàn toàn mới', description: 'Chưa từng học hoặc làm bài tập.' },
  { id: 'LESS_THAN_3_MONTHS', label: 'Dưới 3 tháng', description: 'Đã biết một số khái niệm cơ bản.' },
  { id: '3_TO_12_MONTHS', label: '3 đến 12 tháng', description: 'Đã tự học hoặc làm bài tập đều đặn.' },
  { id: 'OVER_1_YEAR', label: 'Trên 1 năm', description: 'Đã làm dự án hoặc dùng trong công việc.' },
];

const HOURS_OPTIONS: Array<{ id: StudyHoursPerWeek; label: string; description: string }> = [
  { id: '2_TO_5_HOURS', label: '2–5 giờ mỗi tuần', description: 'Nhịp học nhẹ, đều đặn.' },
  { id: '5_TO_10_HOURS', label: '5–10 giờ mỗi tuần', description: 'Nhịp học tiêu chuẩn.' },
  { id: 'OVER_10_HOURS', label: 'Trên 10 giờ mỗi tuần', description: 'Có thể học tập trung.' },
];

const PACE_OPTIONS: Array<{ id: PreferredPace; label: string; description: string }> = [
  { id: 'PRACTICE_HEAVY', label: 'Ưu tiên thực hành', description: 'Lý thuyết ngắn, nhiều bài tập.' },
  { id: 'BALANCED', label: 'Cân bằng', description: 'Kết hợp khái niệm và bài tập.' },
  { id: 'THEORY_FIRST', label: 'Ưu tiên nền tảng', description: 'Học kỹ bản chất trước khi thực hành.' },
];

function getLanguageLabel(language: SupportedLanguage): string {
  return LANGUAGE_CARDS.find((item) => item.id === language)?.name ?? language;
}

function getVerificationCopy(status: SurveyVerificationStatus) {
  switch (status) {
    case 'VERIFIED_COURSE_COMPLETION':
      return { title: 'Đã xác minh hoàn thành khóa học', description: 'MCODE có chứng chỉ hoặc toàn bộ bài học của khóa tương ứng đã hoàn thành.', className: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100' };
    case 'VERIFIED_ACTIVITY':
      return { title: 'Đã xác minh hoạt động học tập', description: 'Tiến độ trong khóa học tương ứng đạt từ 80%. Kết quả Pre-test vẫn là dữ liệu đánh giá năng lực chính.', className: 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100' };
    case 'SELF_REPORTED_UNVERIFIED':
      return { title: 'Kinh nghiệm được ghi nhận là lời tự khai', description: 'Dữ liệu MCODE hiện chưa đủ điều kiện xác minh. Thông tin này chỉ dùng để chọn đề, không cộng trực tiếp vào năng lực.', className: 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100' };
    default:
      return { title: 'Hồ sơ học viên mới', description: 'Chưa có dữ liệu học tập MCODE tương ứng. Pre-test sẽ thiết lập mốc năng lực ban đầu.', className: 'border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-100' };
  }
}

function makeAssessment(nextModules: ModuleDefinitionDto[], previous: Record<string, number>): Record<string, number> {
  return Object.fromEntries(nextModules.map((module) => [module.id, previous[module.id] ?? 1]));
}

function OptionCard<T extends string>({ option, selected, onSelect }: { option: { id: T; label: string; description: string }; selected: boolean; onSelect: (id: T) => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(option.id)}
      className={`relative min-h-24 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${
        selected
          ? 'border-accent-custom bg-accent-bg text-text-primary shadow-sm'
          : 'border-border-custom bg-bg-primary text-text-secondary hover:border-accent-custom/50 hover:bg-bg-secondary'
      }`}
    >
      <span className="block pr-7 text-sm font-bold">{option.label}</span>
      <span className="mt-1 block text-xs leading-5 text-text-tertiary">{option.description}</span>
      <span className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-accent-custom bg-accent-custom text-white' : 'border-border-custom'}`}>
        {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
      </span>
    </button>
  );
}

export default function OnboardingSurveyPage() {
  const navigate = useNavigate();
  const errorRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<SupportedLanguage>('PYTHON');
  const [goalId, setGoalId] = useState('');
  const [mcodeHistory, setMcodeHistory] = useState<McodeHistory>('NEVER_ENROLLED');
  const [externalExperience, setExternalExperience] = useState<ExternalExperience>('NONE');
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>({});
  const [hoursPerWeek, setHoursPerWeek] = useState<StudyHoursPerWeek>('5_TO_10_HOURS');
  const [preferredPace, setPreferredPace] = useState<PreferredPace>('BALANCED');
  const [goals, setGoals] = useState<LearningGoalDto[]>([]);
  const [modules, setModules] = useState<ModuleDefinitionDto[]>([]);
  const [domain, setDomain] = useState({ name: '', description: '' });
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [setupLoadFailed, setSetupLoadFailed] = useState(false);
  const [setupReloadKey, setSetupReloadKey] = useState(0);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SurveyResponseDto | null>(null);

  const selectedGoal = useMemo(() => goals.find((goal) => goal.goalId === goalId), [goals, goalId]);
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const showError = (message: string) => {
    setErrorMessage(message);
    window.requestAnimationFrame(() => errorRef.current?.focus());
  };

  useEffect(() => {
    let cancelled = false;
    const loadSurveySetup = async () => {
      setIsLoadingGoals(true);
      setSetupLoadFailed(false);
      setErrorMessage(null);
      setDraftMessage(null);
      try {
        const goalResponse = await onboardingApi.getGoals(language);
        if (cancelled) return;

        const nextGoals = goalResponse.goals;
        const nextModules = goalResponse.modules ?? [];
        setGoals(nextGoals);
        setModules(nextModules);
        setDomain({ name: goalResponse.domainName, description: goalResponse.domainDescription });

        let latestSurvey: LearnerSurveyDto | null = null;
        if (localStorage.getItem('token')) {
          try {
            latestSurvey = await onboardingApi.getLatestSurvey(language);
          } catch {
            if (!cancelled) setDraftMessage('Đã tải mục tiêu học; chưa thể khôi phục bản nháp cũ.');
          }
        }
        if (cancelled) return;

        const defaultGoal = nextGoals.find((goal) => goal.pretestAvailable)?.goalId ?? '';
        const previousGoalAvailable = latestSurvey
          ? nextGoals.some((goal) => goal.goalId === latestSurvey.goalId && goal.pretestAvailable)
          : false;
        const restoreSurvey = (survey: LearnerSurveyDto, restoredGoalId: string) => {
          setGoalId(restoredGoalId);
          setMcodeHistory(survey.mcodeHistory);
          setExternalExperience(survey.externalExperience);
          setSelfAssessment(makeAssessment(nextModules, survey.selfAssessment ?? {}));
          setHoursPerWeek(survey.hoursPerWeek);
          setPreferredPace(survey.preferredPace);
        };
        if (latestSurvey && !previousGoalAvailable) {
          restoreSurvey(latestSurvey, defaultGoal);
          setCurrentStep(2);
          setDraftMessage('Mục tiêu cũ chưa có đề Pre-test. Hệ thống đã chọn mục tiêu đang mở; hãy kiểm tra và hoàn tất lại khảo sát.');
        } else if (latestSurvey?.isDraft) {
          restoreSurvey(latestSurvey, latestSurvey.goalId);
          setDraftMessage('Đã khôi phục bản nháp gần nhất cho ngôn ngữ này.');
        } else {
          setGoalId((previous) => nextGoals.some((goal) => goal.goalId === previous && goal.pretestAvailable) ? previous : defaultGoal);
          setSelfAssessment((previous) => makeAssessment(nextModules, previous));
        }
      } catch (error) {
        if (!cancelled) {
          setGoals([]);
          setModules([]);
          setGoalId('');
          setDomain({ name: '', description: '' });
          setSetupLoadFailed(true);
          showError(error instanceof Error ? error.message : 'Không thể tải cấu hình khảo sát.');
        }
      } finally {
        if (!cancelled) setIsLoadingGoals(false);
      }
    };
    void loadSurveySetup();
    return () => { cancelled = true; };
  }, [language, setupReloadKey]);

  function buildDto(isDraft: boolean): CreateSurveyDto {
    return { surveyVersion: '2.0', language, goalId, mcodeHistory, externalExperience, selfAssessment, hoursPerWeek, preferredPace, isDraft };
  }

  function goToNextStep() {
    if (currentStep === 1 && isLoadingGoals) {
      showError('Đang tải cấu hình của ngôn ngữ. Vui lòng chờ trong giây lát.');
      return;
    }
    if (currentStep === 1 && setupLoadFailed) {
      showError('Chưa tải được mục tiêu học. Hãy thử lại trước khi tiếp tục.');
      return;
    }
    if (currentStep === 2 && (!selectedGoal || !selectedGoal.pretestAvailable)) {
      showError('Hãy chọn một mục tiêu đang mở Pre-test trước khi tiếp tục.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep((step) => Math.min(step + 1, STEPS.length));
  }

  async function saveDraft() {
    if (!selectedGoal?.pretestAvailable) {
      showError('Cần chọn một mục tiêu đang mở Pre-test trước khi lưu nháp.');
      return;
    }
    setIsSavingDraft(true);
    setErrorMessage(null);
    try {
      await onboardingApi.submitSurvey(buildDto(true));
      setDraftMessage('Đã lưu bản nháp. Bạn có thể quay lại hoàn tất sau.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Không thể lưu bản nháp.');
    } finally {
      setIsSavingDraft(false);
    }
  }

  async function submitSurvey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentStep !== STEPS.length) return;
    if (!selectedGoal?.pretestAvailable) {
      showError('Mục tiêu này chưa mở Pre-test. Vui lòng chọn mục tiêu đang mở.');
      setCurrentStep(2);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      setResult(await onboardingApi.submitSurvey(buildDto(false)));
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Không thể nộp khảo sát.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result) {
    const verification = getVerificationCopy(result.verificationStatus);
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <AppNavbar />
        <main className="mx-auto flex w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <section className="w-full rounded-2xl border border-border-custom bg-bg-secondary p-6 shadow-sm sm:p-10">
            <div className="mx-auto max-w-xl text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"><FileCheck2 className="h-7 w-7" /></span>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-accent-custom">Khảo sát đã lưu</p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Hồ sơ đầu vào đã sẵn sàng</h1>
              <p className="mt-3 text-sm leading-6 text-text-secondary">Thông tin khảo sát sẽ chọn phạm vi đề Pre-test. Kết quả năng lực chỉ được tạo sau khi bài kiểm tra được chấm.</p>
            </div>
            <div className={`mt-8 rounded-xl border p-5 ${verification.className}`}>
              <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /><div><h2 className="font-bold">{verification.title}</h2><p className="mt-1 text-sm leading-6 opacity-85">{verification.description}</p></div></div>
              {result.verifiedCourseProgress.declarationConflict && <p className="mt-3 border-t border-current/15 pt-3 text-xs leading-5 opacity-80">Lời khai “chưa từng học” khác với dữ liệu hoạt động MCODE đã tìm thấy. Hệ thống giữ dữ liệu thực tế để chọn đề phù hợp.</p>}
            </div>
            <div className="mt-6 grid gap-3 rounded-xl border border-border-custom bg-bg-primary p-4 text-sm sm:grid-cols-3">
              <div><span className="block text-xs text-text-tertiary">Ngôn ngữ</span><span className="mt-1 block font-bold">{getLanguageLabel(result.language)}</span></div>
              <div><span className="block text-xs text-text-tertiary">Mục tiêu</span><span className="mt-1 block font-bold">{selectedGoal?.title ?? result.goalId}</span></div>
              <div><span className="block text-xs text-text-tertiary">Bước kế tiếp</span><span className="mt-1 block font-bold">Pre-test {selectedGoal?.estimatedPretestQuestions ?? 12} câu · 30 phút</span></div>
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => navigate('/personalized-path')} className="min-h-11 rounded-xl border border-border-custom px-5 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-tertiary">Về trang lộ trình</button>
              <button type="button" onClick={() => { setResult(null); setCurrentStep(1); }} className="min-h-11 rounded-xl border border-border-custom px-5 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-tertiary">Tạo khảo sát khác</button>
              <button type="button" onClick={() => navigate(`/pretest/${result.surveyId}`)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-custom px-5 text-sm font-bold text-white transition-colors hover:opacity-90">Bắt đầu Pre-test<ArrowRight className="h-4 w-4" /></button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <AppNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <form onSubmit={submitSurvey} className="min-w-0">
            <header className="mb-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-accent-custom"><GraduationCap className="h-4 w-4" /> Thiết lập đánh giá đầu vào</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Khảo sát định hướng học tập</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">5 bước ngắn để chọn đúng phạm vi Pre-test và khởi tạo roadmap học tuần tự. Thông tin tự khai không làm tăng điểm năng lực.</p>
            </header>

            <nav aria-label="Tiến trình khảo sát" className="mb-6 rounded-2xl border border-border-custom bg-bg-secondary p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between"><span className="text-sm font-bold">Bước {currentStep}/{STEPS.length}</span><span className="text-xs text-text-tertiary">{STEPS[currentStep - 1].label}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary"><div className="h-full rounded-full bg-accent-custom transition-all duration-300" style={{ width: `${progressPercent}%` }} /></div>
              <ol className="mt-4 grid grid-cols-5 gap-1">
                {STEPS.map((step) => {
                  const isComplete = step.id < currentStep;
                  const isCurrent = step.id === currentStep;
                  return <li key={step.id}><button type="button" disabled={step.id > currentStep} onClick={() => setCurrentStep(step.id)} className={`flex w-full flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-center text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom ${isCurrent ? 'text-accent-custom' : isComplete ? 'text-text-primary' : 'cursor-not-allowed text-text-tertiary'}`} aria-current={isCurrent ? 'step' : undefined}><span className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${isCurrent ? 'border-accent-custom bg-accent-custom text-white' : isComplete ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-border-custom'}`}>{isComplete ? <Check className="h-3.5 w-3.5" /> : step.id}</span><span className="hidden sm:block">{step.label}</span></button></li>;
                })}
              </ol>
            </nav>

            {errorMessage && <div ref={errorRef} tabIndex={-1} role="alert" className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950 outline-none dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"><CircleAlert className="h-5 w-5 shrink-0" aria-hidden="true" /><span className="min-w-0 flex-1">{errorMessage}</span>{setupLoadFailed && <button type="button" onClick={() => setSetupReloadKey((key) => key + 1)} disabled={isLoadingGoals} className="flex min-h-11 items-center gap-2 rounded-lg border border-current/20 px-4 font-bold transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-rose-500/10"><RefreshCcw className="h-4 w-4" aria-hidden="true" />Thử lại</button>}</div>}
            {draftMessage && <div aria-live="polite" className="mb-6 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100"><CheckCircle2 className="h-5 w-5 shrink-0" /><span>{draftMessage}</span></div>}

            <section className="rounded-2xl border border-border-custom bg-bg-secondary p-5 shadow-sm sm:p-8">
              {currentStep === 1 && <section aria-labelledby="language-heading"><StepHeading icon={Code2} title="Bạn muốn học ngôn ngữ nào?" description="Mỗi ngôn ngữ có đồ thị kỹ năng, quy tắc chọn đề và môi trường thực hành riêng." /><div role="radiogroup" aria-label="Ngôn ngữ" className="grid gap-3 sm:grid-cols-2">{LANGUAGE_CARDS.map((item) => { const Icon = item.icon; const selected = item.id === language; return <button key={item.id} type="button" role="radio" aria-checked={selected} onClick={() => setLanguage(item.id)} className={`relative min-h-44 rounded-xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary ${selected ? 'border-accent-custom bg-accent-bg shadow-sm' : 'border-border-custom bg-bg-primary hover:border-accent-custom/50 hover:bg-bg-secondary'}`}><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.accentClass}`}><Icon className="h-5 w-5" /></span><span className="mt-5 block text-base font-extrabold">{item.name}</span><span className="mt-1 block text-xs leading-5 text-text-secondary">{item.description}</span><span className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-accent-custom bg-accent-custom text-white' : 'border-border-custom'}`}>{selected && <Check className="h-3.5 w-3.5" />}</span></button>; })}</div><div className="mt-5 flex items-start gap-2 rounded-xl border border-border-custom bg-bg-primary p-3 text-xs leading-5 text-text-secondary"><Info className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" />Ngôn ngữ C chưa có đồ thị kỹ năng và khóa học trong phạm vi roadmap hiện tại.</div></section>}

              {currentStep === 2 && <section aria-labelledby="goal-heading"><StepHeading icon={Layers3} title={`Mục tiêu với ${getLanguageLabel(language)}`} description={domain.description || 'Chọn phạm vi kiến thức bạn muốn xây dựng lộ trình.'} />{isLoadingGoals ? <div className="flex min-h-48 items-center justify-center text-sm text-text-secondary">Đang tải mục tiêu học tập…</div> : <div role="radiogroup" aria-label="Mục tiêu học tập" className="space-y-3">{goals.map((goal) => { const available = goal.pretestAvailable; return <button key={goal.goalId} type="button" role="radio" aria-checked={goal.goalId === goalId} disabled={!available} onClick={() => setGoalId(goal.goalId)} className={`w-full rounded-xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary ${!available ? 'cursor-not-allowed border-border-custom bg-bg-tertiary opacity-65' : goal.goalId === goalId ? 'border-accent-custom bg-accent-bg shadow-sm' : 'border-border-custom bg-bg-primary hover:border-accent-custom/50'}`}><div className="flex flex-wrap items-start justify-between gap-3"><span className="text-base font-extrabold">{goal.title}</span><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${available ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300' : 'border-border-custom bg-bg-secondary text-text-tertiary'}`}>{available ? 'Đang mở' : 'Sắp mở'}</span></div><span className="mt-2 block text-sm leading-6 text-text-secondary">{goal.description}</span><span className="mt-3 block text-xs text-text-tertiary">{goal.skillCount} kỹ năng · {goal.estimatedPretestQuestions} câu · {goal.availabilityMessage}</span></button>; })}</div>}</section>}

              {currentStep === 3 && <section aria-labelledby="experience-heading"><StepHeading icon={BookOpen} title="Kinh nghiệm hiện tại" description="Thông tin này chỉ điều chỉnh độ khó và phạm vi đề; Pre-test mới là căn cứ đánh giá năng lực." /><div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-5 text-blue-950 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />MCODE đối chiếu tiến độ trong đúng khóa học của ngôn ngữ đã chọn. Chứng chỉ hoặc hoàn thành toàn bộ bài học mới xác nhận hoàn thành; tiến độ từ 80% xác nhận hoạt động học tập.</div><fieldset><legend className="mb-3 text-sm font-bold">Bạn đã học {getLanguageLabel(language)} trên MCODE?</legend><div role="radiogroup" className="grid gap-3 sm:grid-cols-2">{MCODE_HISTORY_OPTIONS.map((option) => <OptionCard key={option.id} option={option} selected={mcodeHistory === option.id} onSelect={setMcodeHistory} />)}</div></fieldset><fieldset className="mt-7"><legend className="mb-3 text-sm font-bold">Kinh nghiệm ngoài MCODE</legend><div role="radiogroup" className="grid gap-3 sm:grid-cols-2">{EXPERIENCE_OPTIONS.map((option) => <OptionCard key={option.id} option={option} selected={externalExperience === option.id} onSelect={setExternalExperience} />)}</div></fieldset></section>}

              {currentStep === 4 && <section aria-labelledby="assessment-heading"><StepHeading icon={Sparkles} title="Tự đánh giá theo nhóm kiến thức" description="Chọn mức gần nhất với trải nghiệm hiện tại. Chưa biết là lựa chọn hoàn toàn hợp lệ." /><div className="space-y-3">{modules.map((module) => { const selectedLevel = selfAssessment[module.id] ?? 1; return <fieldset key={module.id} className="rounded-xl border border-border-custom bg-bg-primary p-4"><legend className="sr-only">Mức tự tin với {module.name}</legend><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start"><div><p className="text-sm font-extrabold">{module.name}</p>{module.description && <p className="mt-1 text-xs leading-5 text-text-secondary">{module.description}</p>}</div><span className="shrink-0 rounded bg-bg-tertiary px-2 py-1 font-mono text-[10px] text-text-tertiary">{module.id}</span></div><div role="radiogroup" aria-label={`Mức tự tin ${module.name}`} className="mt-4 grid gap-2 sm:grid-cols-3">{[{ value: 1, label: 'Chưa biết' }, { value: 2, label: 'Biết lý thuyết' }, { value: 3, label: 'Đã tự viết code' }].map((level) => <button key={level.value} type="button" role="radio" aria-checked={selectedLevel === level.value} onClick={() => setSelfAssessment((previous) => ({ ...previous, [module.id]: level.value }))} className={`min-h-10 rounded-lg border px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom ${selectedLevel === level.value ? 'border-accent-custom bg-accent-custom text-white' : 'border-border-custom bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'}`}>{level.label}</button>)}</div></fieldset>; })}</div></section>}

              {currentStep === 5 && <section aria-labelledby="study-plan-heading"><StepHeading icon={Clock3} title="Kế hoạch học của bạn" description="Thông tin này sẽ được dùng để điều chỉnh nhịp và trọng tâm của roadmap sau khi có kết quả Pre-test." /><fieldset><legend className="mb-3 text-sm font-bold">Bạn có thể học bao nhiêu thời gian mỗi tuần?</legend><div role="radiogroup" className="grid gap-3 sm:grid-cols-3">{HOURS_OPTIONS.map((option) => <OptionCard key={option.id} option={option} selected={hoursPerWeek === option.id} onSelect={setHoursPerWeek} />)}</div></fieldset><fieldset className="mt-7"><legend className="mb-3 text-sm font-bold">Bạn muốn ưu tiên cách học nào?</legend><div role="radiogroup" className="grid gap-3 sm:grid-cols-3">{PACE_OPTIONS.map((option) => <OptionCard key={option.id} option={option} selected={preferredPace === option.id} onSelect={setPreferredPace} />)}</div></fieldset><div className="mt-7 rounded-xl border border-border-custom bg-bg-primary p-4"><p className="text-sm font-bold">Sẵn sàng ghi nhận khảo sát?</p><p className="mt-1 text-xs leading-5 text-text-secondary">Sau khi lưu khảo sát, bạn có thể bắt đầu ngay Pre-test 12 câu trong 30 phút. Ba câu lập trình được chấm an toàn bằng Docker.</p></div></section>}

              <footer className="mt-8 flex flex-col-reverse gap-3 border-t border-border-custom pt-5 sm:flex-row sm:items-center sm:justify-between"><div>{currentStep > 1 && <button type="button" onClick={() => { setErrorMessage(null); setCurrentStep((step) => step - 1); }} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-tertiary"><ArrowLeft className="h-4 w-4" />Quay lại</button>}</div><div className="flex flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={() => void saveDraft()} disabled={isSavingDraft || isSubmitting || !selectedGoal?.pretestAvailable} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-custom px-4 text-sm font-bold text-text-secondary transition-colors hover:bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" />{isSavingDraft ? 'Đang lưu…' : 'Lưu nháp'}</button>{currentStep < STEPS.length ? <button type="button" onClick={goToNextStep} disabled={((isLoadingGoals || setupLoadFailed) && currentStep === 1) || (currentStep === 2 && !selectedGoal?.pretestAvailable)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-custom px-5 text-sm font-bold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">Tiếp tục<ArrowRight className="h-4 w-4" /></button> : <button type="submit" disabled={isSubmitting || !selectedGoal?.pretestAvailable} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-custom px-5 text-sm font-bold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Đang ghi nhận…' : 'Hoàn tất khảo sát'}<CheckCircle2 className="h-4 w-4" /></button>}</div></footer>
            </section>
          </form>

          <aside className="hidden lg:block lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border-custom bg-bg-secondary p-5 shadow-sm"><div className="flex items-center gap-2 text-sm font-extrabold"><CircleDot className="h-4 w-4 text-accent-custom" />Tóm tắt thiết lập</div><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-xs text-text-tertiary">Ngôn ngữ</dt><dd className="mt-1 font-bold">{getLanguageLabel(language)}</dd></div><div><dt className="text-xs text-text-tertiary">Mục tiêu</dt><dd className="mt-1 font-bold leading-5">{selectedGoal?.title ?? (isLoadingGoals ? 'Đang tải…' : setupLoadFailed ? 'Chưa tải được' : 'Chưa chọn')}</dd></div><div><dt className="text-xs text-text-tertiary">Phạm vi Pre-test</dt><dd className="mt-1 font-bold">{selectedGoal ? `${selectedGoal.estimatedPretestQuestions} câu · 30 phút` : (isLoadingGoals ? 'Đang tải…' : setupLoadFailed ? 'Chưa tải được' : 'Chưa xác định')}</dd></div></dl><div className="mt-5 border-t border-border-custom pt-4 text-xs leading-5 text-text-secondary"><p className="font-bold text-text-primary">Nguyên tắc đánh giá</p><p className="mt-1">Tự khai chỉ giúp chọn đề. Điểm Pre-test và bài thực hành mới tạo bằng chứng năng lực.</p></div></div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function StepHeading({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return <div className="mb-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-bg text-accent-custom"><Icon className="h-5 w-5" /></span><h2 className="mt-4 text-xl font-extrabold tracking-tight">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">{description}</p></div>;
}
