import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, Code2,
  FileCheck2, LoaderCircle, Save, ShieldCheck,
} from 'lucide-react';
import AppNavbar from '../../../components/AppNavbar';
import type { PretestAttemptDto, SubmitAnswerDto } from '../../../types/roadmapContracts';
import { PretestApiError, pretestApi } from '../services/pretestApi';

type LocalAnswer = { selectedOption: string | null; submittedCode: string | null };

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

function createKey(attemptId: string): string {
  const storageKey = `pretest-submit-key:${attemptId}`;
  const existing = sessionStorage.getItem(storageKey);
  if (existing) return existing;
  const random = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const key = `web-${random}`;
  sessionStorage.setItem(storageKey, key);
  return key;
}

export default function PretestPage() {
  const { surveyId = '' } = useParams();
  const navigate = useNavigate();
  const errorRef = useRef<HTMLDivElement>(null);
  const autoSubmitRef = useRef(false);
  const [attempt, setAttempt] = useState<PretestAttemptDto | null>(null);
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const currentQuestion = attempt?.questions[currentIndex];
  const answeredCount = useMemo(() => attempt?.questions.filter((question) => {
    const answer = answers[question.id];
    return question.questionType === 'PRACTICAL'
      ? Boolean(answer?.submittedCode?.trim()) : Boolean(answer?.selectedOption);
  }).length ?? 0, [answers, attempt]);

  function showError(message: string) {
    setError(message);
    window.requestAnimationFrame(() => errorRef.current?.focus());
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    pretestApi.createOrResume(surveyId).then((data) => {
      if (cancelled) return;
      setRemainingSeconds(Math.max(0, Math.ceil((Date.parse(data.expiresAt) - Date.now()) / 1000)));
      setAttempt(data);
      setAnswers(Object.fromEntries(data.answers.map((answer) => [answer.questionSnapshotId, {
        selectedOption: answer.selectedOption, submittedCode: answer.submittedCode,
      }])));
    }).catch((reason) => {
      if (!cancelled) {
        setErrorCode(reason instanceof PretestApiError ? reason.code ?? null : null);
        showError(reason instanceof Error ? reason.message : 'Không thể mở bài Pre-test.');
      }
    }).finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [navigate, surveyId]);

  useEffect(() => {
    if (!attempt) return;
    const update = () => setRemainingSeconds(Math.max(0, Math.ceil((Date.parse(attempt.expiresAt) - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [attempt]);

  useEffect(() => {
    if (attempt && remainingSeconds === 0 && Date.now() >= Date.parse(attempt.expiresAt)
      && !autoSubmitRef.current && !isSubmitting) {
      autoSubmitRef.current = true;
      void submitAttempt(true);
    }
  }, [attempt, remainingSeconds, isSubmitting]);

  async function save(questionId: string, value: LocalAnswer) {
    if (!attempt) return;
    setIsSaving(true);
    setSavedMessage(null);
    setError(null);
    try {
      await pretestApi.saveAnswer(attempt.id, {
        questionSnapshotId: questionId,
        selectedOption: value.selectedOption,
        submittedCode: value.submittedCode,
      });
      setSavedMessage('Đã lưu');
    } catch (reason) {
      showError(reason instanceof Error ? reason.message : 'Không thể lưu câu trả lời.');
    } finally {
      setIsSaving(false);
    }
  }

  function chooseOption(questionId: string, key: string) {
    const value = { selectedOption: key, submittedCode: null };
    setAnswers((previous) => ({ ...previous, [questionId]: value }));
    void save(questionId, value);
  }

  function changeCode(questionId: string, code: string) {
    setAnswers((previous) => ({ ...previous, [questionId]: { selectedOption: null, submittedCode: code } }));
    setSavedMessage(null);
  }

  async function moveTo(index: number) {
    if (!attempt || !currentQuestion || index < 0 || index >= attempt.questions.length) return;
    const value = answers[currentQuestion.id] ?? { selectedOption: null, submittedCode: null };
    if (currentQuestion.questionType === 'PRACTICAL') await save(currentQuestion.id, value);
    setSavedMessage(null);
    setCurrentIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitAttempt(isTimeout = false) {
    if (!attempt || isSubmitting) return;
    if (!isTimeout && !window.confirm(`Bạn đã trả lời ${answeredCount}/${attempt.totalQuestions} câu. Nộp bài ngay?`)) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payloadAnswers: SubmitAnswerDto[] = attempt.questions.map((question) => ({
        questionSnapshotId: question.id,
        selectedOption: answers[question.id]?.selectedOption ?? null,
        submittedCode: answers[question.id]?.submittedCode ?? null,
      }));
      const result = await pretestApi.submit(attempt.id, { answers: payloadAnswers }, createKey(attempt.id));
      if (!result.assessmentId) throw new Error('Kết quả chưa sẵn sàng. Vui lòng thử lại.');
      navigate(`/pretest/result/${result.assessmentId}`, { replace: true });
    } catch (reason) {
      autoSubmitRef.current = false;
      showError(reason instanceof Error ? reason.message : 'Không thể nộp bài Pre-test.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-bg-primary text-text-primary"><AppNavbar /><main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4"><div className="text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-accent-custom" aria-hidden="true" /><p className="mt-3 text-sm font-bold">Đang chuẩn bị đề đã kiểm định…</p></div></main></div>;
  }

  if (!attempt || !currentQuestion) {
    const isUnavailable = errorCode === 'PRETEST_UNAVAILABLE';
    return <div className="min-h-screen bg-bg-primary text-text-primary"><AppNavbar /><main className="mx-auto max-w-2xl px-4 py-12"><div ref={errorRef} tabIndex={-1} role="alert" className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-900 outline-none dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100"><div className="flex gap-3"><CircleAlert className="h-5 w-5 shrink-0" aria-hidden="true" /><div><h1 className="font-extrabold">{isUnavailable ? 'Mục tiêu này chưa mở Pre-test' : 'Chưa thể mở Pre-test'}</h1><p className="mt-2 text-sm leading-6">{isUnavailable ? 'Hiện bộ đề đã duyệt chỉ mở cho mục tiêu Python cơ bản. Hãy chọn mục tiêu đang mở để tiếp tục.' : error ?? 'Không tìm thấy đề phù hợp.'}</p><button onClick={() => navigate('/onboarding')} className="mt-4 min-h-11 rounded-xl border border-current/20 px-4 text-sm font-bold transition-colors hover:bg-red-100 dark:hover:bg-red-500/10">{isUnavailable ? 'Chọn mục tiêu đang mở' : 'Quay lại khảo sát'}</button></div></div></div></main></div>;
  }

  const currentAnswer = answers[currentQuestion.id] ?? { selectedOption: null, submittedCode: null };
  const urgent = remainingSeconds <= 5 * 60;
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <AppNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col gap-4 rounded-2xl border border-border-custom bg-bg-secondary p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent-custom"><ShieldCheck className="h-4 w-4" /> Pre-test Python Basics</div><h1 className="mt-2 text-xl font-extrabold sm:text-2xl">Câu {currentIndex + 1}/{attempt.totalQuestions}</h1><p className="mt-1 text-sm text-text-secondary">Đã trả lời {answeredCount} câu · câu trả lời được lưu trên máy chủ</p></div>
          <div aria-live="polite" className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 ${urgent ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200' : 'border-border-custom bg-bg-primary text-text-primary'}`}><Clock3 className="h-5 w-5" aria-hidden="true" /><div><span className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Thời gian còn lại</span><span className="font-mono text-lg font-extrabold">{formatTime(remainingSeconds)}</span></div></div>
        </header>

        {error && <div ref={errorRef} tabIndex={-1} role="alert" className="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100"><div className="flex gap-2"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div></div>}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <section className="rounded-2xl border border-border-custom bg-bg-secondary p-5 shadow-sm sm:p-8" aria-labelledby={`question-${currentQuestion.id}`}>
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-accent-bg px-3 py-1 font-bold text-accent-custom">{currentQuestion.questionType === 'PRACTICAL' ? 'Viết code' : currentQuestion.questionType === 'BUG_HUNTING' ? 'Tìm lỗi' : currentQuestion.questionType === 'TRACING' ? 'Đọc code' : 'Khái niệm'}</span><span className="rounded-full bg-bg-tertiary px-3 py-1 font-semibold text-text-secondary">Độ khó {currentQuestion.difficulty}</span></div>
            <div id={`question-${currentQuestion.id}`} className="prose max-w-none text-base leading-7"><ReactMarkdown remarkPlugins={[remarkGfm]}>{currentQuestion.prompt}</ReactMarkdown></div>

            {currentQuestion.questionType === 'PRACTICAL' ? (
              <div className="mt-7"><label htmlFor={`code-${currentQuestion.id}`} className="text-sm font-bold">Mã Python của bạn</label>{currentQuestion.starterCode && <div className="mt-2 rounded-t-xl border border-b-0 border-border-custom bg-bg-tertiary px-4 py-3 font-mono text-xs leading-5 text-text-secondary whitespace-pre-wrap">{currentQuestion.starterCode}</div>}<textarea id={`code-${currentQuestion.id}`} value={currentAnswer.submittedCode ?? ''} onChange={(event) => changeCode(currentQuestion.id, event.target.value)} onBlur={() => void save(currentQuestion.id, currentAnswer)} spellCheck={false} rows={12} className={`w-full resize-y border border-border-custom bg-pre-bg p-4 font-mono text-sm leading-6 text-text-primary outline-none focus:border-accent-custom focus:ring-2 focus:ring-accent-bg ${currentQuestion.starterCode ? 'rounded-b-xl' : 'mt-2 rounded-xl'}`} placeholder="Nhập chương trình Python hoàn chỉnh…" /><p className="mt-2 flex items-center gap-2 text-xs text-text-tertiary"><Code2 className="h-3.5 w-3.5" />Bài được chấm bằng test công khai và test ẩn trong Docker.</p></div>
            ) : (
              <fieldset className="mt-7"><legend className="sr-only">Chọn một đáp án</legend><div className="grid gap-3">{currentQuestion.options?.map((option) => { const selected = currentAnswer.selectedOption === option.key; return <button key={option.key} type="button" role="radio" aria-checked={selected} onClick={() => chooseOption(currentQuestion.id, option.key)} className={`flex min-h-14 items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom ${selected ? 'border-accent-custom bg-accent-bg text-text-primary' : 'border-border-custom bg-bg-primary text-text-secondary hover:border-accent-custom/50 hover:bg-bg-tertiary'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-extrabold ${selected ? 'border-accent-custom bg-accent-custom text-white' : 'border-border-custom bg-bg-secondary'}`}>{selected ? <Check className="h-4 w-4" /> : option.key}</span><span className="font-semibold leading-6">{option.text}</span></button>; })}</div></fieldset>
            )}

            <footer className="mt-8 flex flex-col gap-3 border-t border-border-custom pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-h-5 text-xs text-text-tertiary" aria-live="polite">{isSaving ? <span className="flex items-center gap-2"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />Đang lưu…</span> : savedMessage ? <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300"><Save className="h-3.5 w-3.5" />{savedMessage}</span> : null}</div><div className="flex gap-2"><button type="button" onClick={() => void moveTo(currentIndex - 1)} disabled={currentIndex === 0 || isSubmitting} className="flex min-h-11 items-center gap-2 rounded-xl border border-border-custom px-4 text-sm font-bold text-text-secondary hover:bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" />Trước</button>{currentIndex < attempt.questions.length - 1 ? <button type="button" onClick={() => void moveTo(currentIndex + 1)} disabled={isSubmitting} className="flex min-h-11 items-center gap-2 rounded-xl bg-accent-custom px-5 text-sm font-bold text-white hover:opacity-90">Câu tiếp<ArrowRight className="h-4 w-4" /></button> : <button type="button" onClick={() => void submitAttempt(false)} disabled={isSubmitting} className="flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />}{isSubmitting ? 'Đang chấm…' : 'Nộp bài'}</button>}</div></footer>
          </section>

          <aside className="lg:sticky lg:top-24"><div className="rounded-2xl border border-border-custom bg-bg-secondary p-5 shadow-sm"><h2 className="text-sm font-extrabold">Danh sách câu</h2><div className="mt-4 grid grid-cols-6 gap-2 lg:grid-cols-4">{attempt.questions.map((question, index) => { const value = answers[question.id]; const done = question.questionType === 'PRACTICAL' ? Boolean(value?.submittedCode?.trim()) : Boolean(value?.selectedOption); const current = index === currentIndex; return <button key={question.id} type="button" onClick={() => void moveTo(index)} aria-label={`Câu ${index + 1}${done ? ', đã trả lời' : ', chưa trả lời'}`} aria-current={current ? 'step' : undefined} className={`min-h-11 rounded-lg border text-xs font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom ${current ? 'border-accent-custom bg-accent-custom text-white' : done ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200' : 'border-border-custom bg-bg-primary text-text-secondary hover:bg-bg-tertiary'}`}>{index + 1}</button>; })}</div><div className="mt-5 border-t border-border-custom pt-4"><div className="flex items-center justify-between text-xs"><span className="text-text-tertiary">Tiến độ</span><span className="font-bold">{answeredCount}/{attempt.totalQuestions}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-tertiary"><div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${(answeredCount / attempt.totalQuestions) * 100}%` }} /></div><button type="button" onClick={() => void submitAttempt(false)} disabled={isSubmitting} className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 px-4 text-sm font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"><FileCheck2 className="h-4 w-4" />Nộp bài sớm</button></div></div></aside>
        </div>
      </main>
    </div>
  );
}
