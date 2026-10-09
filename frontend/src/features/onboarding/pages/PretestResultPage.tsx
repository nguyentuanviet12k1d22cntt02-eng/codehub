import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle2, LoaderCircle, RotateCcw } from 'lucide-react';
import AppNavbar from '../../../components/AppNavbar';
import type { AssessmentResponseDto, LearnerSkillStatus } from '../../../types/roadmapContracts';
import { pretestApi } from '../services/pretestApi';
import { roadmapApi } from '../services/roadmapApi';

const STATUS_COPY: Record<LearnerSkillStatus, { label: string; className: string }> = {
  PROFICIENT: { label: 'Đã vững', className: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200' },
  DEVELOPING: { label: 'Đang phát triển', className: 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200' },
  NEEDS_FOUNDATION: { label: 'Cần học nền tảng', className: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100' },
  UNKNOWN: { label: 'Chưa đủ dữ liệu', className: 'border-border-custom bg-bg-tertiary text-text-secondary' },
};

export default function PretestResultPage() {
  const { assessmentId = '' } = useParams();
  const navigate = useNavigate();
  const errorRef = useRef<HTMLDivElement>(null);
  const [assessment, setAssessment] = useState<AssessmentResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);
  const [creatingRoadmap, setCreatingRoadmap] = useState(false);
  const [roadmapId, setRoadmapId] = useState<string | null>(null);

  async function createRoadmap() {
    if (!assessment || creatingRoadmap) return;
    setCreatingRoadmap(true);
    setRoadmapError(null);
    try {
      const roadmap = await roadmapApi.create(assessment.id);
      setRoadmapId(roadmap.id);
      navigate(`/roadmap/${roadmap.id}`);
    } catch (reason) {
      setRoadmapError(reason instanceof Error ? reason.message : 'Không thể tạo lộ trình.');
      window.requestAnimationFrame(() => errorRef.current?.focus());
    } finally { setCreatingRoadmap(false); }
  }

  useEffect(() => {
    let cancelled = false;
    pretestApi.getAssessment(assessmentId).then((data) => {
      if (!cancelled) setAssessment(data);
    }).catch((reason) => {
      if (!cancelled) {
        setError(reason instanceof Error ? reason.message : 'Không thể tải kết quả.');
        window.requestAnimationFrame(() => errorRef.current?.focus());
      }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [assessmentId]);

  useEffect(() => {
    if (!assessment) return;
    let cancelled = false;
    setCreatingRoadmap(true);
    roadmapApi.create(assessment.id).then(roadmap => {
      if (!cancelled) setRoadmapId(roadmap.id);
    }).catch(reason => {
      if (!cancelled) setRoadmapError(reason instanceof Error ? reason.message : 'Không thể tạo lộ trình.');
    }).finally(() => { if (!cancelled) setCreatingRoadmap(false); });
    return () => { cancelled = true; };
  }, [assessment?.id]);

  const skills = useMemo(() => assessment ? Object.values(assessment.skills).sort((a, b) => a.skillId.localeCompare(b.skillId)) : [], [assessment]);
  const percent = assessment && assessment.maxPossibleScore > 0
    ? Math.round((assessment.totalScore / assessment.maxPossibleScore) * 100) : 0;

  if (loading) return <div className="min-h-screen bg-bg-primary text-text-primary"><AppNavbar /><main className="flex min-h-[70vh] items-center justify-center"><div className="text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-accent-custom" /><p className="mt-3 text-sm font-bold">Đang tải kết quả…</p></div></main></div>;
  if (!assessment) return <div className="min-h-screen bg-bg-primary text-text-primary"><AppNavbar /><main className="mx-auto max-w-2xl px-4 py-12"><div ref={errorRef} tabIndex={-1} role="alert" className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100"><h1 className="font-extrabold">Không thể hiển thị kết quả</h1><p className="mt-2 text-sm">{error}</p></div></main></div>;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary"><AppNavbar /><main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-2xl border border-border-custom bg-bg-secondary shadow-sm"><div className="bg-[linear-gradient(135deg,#312e81,#6d28d9_55%,#0f766e)] p-6 text-white sm:p-10"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15"><CheckCircle2 className="h-6 w-6" /></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-violet-100">Đã chấm xong</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Kết quả Pre-test của bạn</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100">Điểm được tính từ câu khách quan và bài code chạy trong Docker. Kỹ năng chưa có đủ bằng chứng sẽ giữ trạng thái “chưa đủ dữ liệu”.</p></div>
        <div className="grid gap-4 p-6 sm:grid-cols-4 sm:p-8"><div className="rounded-xl border border-border-custom bg-bg-primary p-5 sm:col-span-2"><span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Tổng điểm</span><div className="mt-2 flex items-end gap-2"><span className="text-4xl font-extrabold">{percent}%</span><span className="pb-1 text-sm text-text-secondary">{assessment.totalScore.toFixed(2)}/{assessment.maxPossibleScore.toFixed(2)}</span></div></div><Summary label="Đã vững" value={assessment.proficientCount} tone="text-emerald-600 dark:text-emerald-300" /><Summary label="Cần củng cố" value={assessment.developingCount + assessment.needsFoundationCount} tone="text-amber-600 dark:text-amber-300" /></div>
      </section>

      <section className="mt-6" aria-labelledby="skills-heading"><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-accent-custom" /><h2 id="skills-heading" className="text-xl font-extrabold">Hồ sơ 9 kỹ năng</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{skills.map((skill) => { const status = STATUS_COPY[skill.status]; const mastery = skill.masteryScore === null ? null : Math.round(skill.masteryScore * 100); return <article key={skill.skillId} className="rounded-xl border border-border-custom bg-bg-secondary p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><h3 className="font-mono text-sm font-extrabold text-text-primary">{skill.skillId}</h3><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.className}`}>{status.label}</span></div><div className="mt-5 flex items-end justify-between"><span className="text-2xl font-extrabold">{mastery === null ? '—' : `${mastery}%`}</span><span className="text-xs text-text-tertiary">{skill.evidenceCount} bằng chứng</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-tertiary"><div className="h-full rounded-full bg-accent-custom" style={{ width: `${mastery ?? 0}%` }} /></div><p className="mt-3 text-xs text-text-secondary">Độ tin cậy: {Math.round(skill.confidence * 100)}%{skill.hasApplicationEvidence ? ' · Có bài thực hành' : ''}</p></article>; })}</div></section>

      {roadmapError && <div ref={errorRef} role="alert" tabIndex={-1} className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">{roadmapError}</div>}
      {roadmapId && <p className="mt-6 text-sm font-bold text-emerald-700 dark:text-emerald-300" role="status">Lộ trình đã sẵn sàng. Bài đầu tiên đã được mở.</p>}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => navigate('/onboarding')} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-custom px-5 text-sm font-bold text-text-secondary hover:bg-bg-tertiary"><RotateCcw className="h-4 w-4" />Khảo sát khác</button><button type="button" onClick={() => navigate('/dashboard')} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border-custom px-5 text-sm font-bold text-text-secondary hover:bg-bg-tertiary">Về trang tổng quan</button><button type="button" disabled={creatingRoadmap} onClick={() => roadmapId ? navigate(`/roadmap/${roadmapId}`) : void createRoadmap()} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-custom px-5 text-sm font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{creatingRoadmap ? 'Đang tạo lộ trình…' : roadmapId ? 'Xem lộ trình học' : 'Thử tạo lộ trình'}<ArrowRight className="h-4 w-4" /></button></div>
    </main></div>
  );
}

function Summary({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <div className="rounded-xl border border-border-custom bg-bg-primary p-5"><span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">{label}</span><span className={`mt-2 block text-3xl font-extrabold ${tone}`}>{value}</span></div>;
}
