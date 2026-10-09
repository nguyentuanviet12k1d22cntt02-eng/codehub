import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, LoaderCircle, MapPinned, RefreshCcw, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import AppNavbar from '../../../components/AppNavbar';
import type { RoadmapDto } from '../../../types/roadmapContracts';
import GameRoadmapMap from '../components/GameRoadmapMap';
import { RoadmapApiError, roadmapApi } from '../services/roadmapApi';

export default function RoadmapPage() {
  const { roadmapId = '' } = useParams();
  const navigate = useNavigate();
  const errorRef = useRef<HTMLDivElement>(null);
  const refreshInFlightRef = useRef(false);
  const [roadmap, setRoadmap] = useState<RoadmapDto | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmapMissing, setRoadmapMissing] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const loadRoadmap = useCallback(async () => {
    if (refreshInFlightRef.current) return;
    refreshInFlightRef.current = true;
    setBusy(true);
    setError(null);
    setRoadmapMissing(false);
    setRoadmap(null);

    // This legacy key was shared by every account in the same browser.
    // Roadmap ownership is now resolved exclusively by the authenticated API.
    localStorage.removeItem('latest_roadmap_id');

    try {
      if (!token) {
        setRoadmapMissing(true);
        return;
      }

      const data = roadmapId
        ? await roadmapApi.sync(roadmapId)
        : await roadmapApi.getLatest();

      if (!data.items || data.items.length === 0) {
        throw new Error('Lộ trình chưa có bài học hợp lệ.');
      }
      setRoadmap(data);
    } catch (reason: unknown) {
      if (reason instanceof RoadmapApiError
        && ['ROADMAP_NOT_FOUND', 'INVALID_ROADMAP_ID'].includes(reason.code ?? '')) {
        setRoadmapMissing(true);
      } else if (reason instanceof RoadmapApiError && reason.code === 'FORBIDDEN') {
        setError('Lộ trình này thuộc tài khoản khác. Bạn không có quyền xem.');
      } else {
        setError(reason instanceof Error ? reason.message : 'Không thể tải lộ trình của tài khoản này.');
      }
    } finally {
      refreshInFlightRef.current = false;
      setBusy(false);
    }
  }, [roadmapId, token]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadRoadmap(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [loadRoadmap]);

  const current = roadmap?.items.find(item => item.learningStatus === 'AVAILABLE' || item.learningStatus === 'IN_PROGRESS');
  const progress = roadmap && roadmap.totalItems > 0 ? Math.round(100 * roadmap.completedItems / roadmap.totalItems) : 0;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <AppNavbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header Title */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-accent-custom">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Python Basics · Adventure
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Hành trình Python của bạn</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Chinh phục từng cửa ải theo kết quả Pre-test. Hoàn thành bài tập code để mở đường tới thử thách tiếp theo.
            </p>
          </div>
          {roadmap && (
            <button
              type="button"
              onClick={() => void loadRoadmap()}
              disabled={busy}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-border-custom bg-bg-secondary px-4 text-sm font-bold shadow-sm hover:bg-bg-tertiary disabled:opacity-50 cursor-pointer"
            >
              <RefreshCcw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} aria-hidden="true" />
              Cập nhật bản đồ
            </button>
          )}
        </div>

        {error && (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100"
          >
            <span className="min-w-0 flex-1">{error}</span>
            <button
              type="button"
              onClick={() => void loadRoadmap()}
              disabled={busy}
              className="min-h-11 rounded-lg border border-current/20 px-4 font-bold hover:bg-red-100 disabled:opacity-50 dark:hover:bg-red-500/10 cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        )}

        {!roadmap && busy && (
          <div className="flex min-h-60 items-center justify-center gap-3 text-sm text-text-secondary">
            <LoaderCircle className="h-5 w-5 animate-spin text-accent-custom" />
            Đang tải lộ trình…
          </div>
        )}

        {!busy && !roadmap && !error && roadmapMissing && (
          <section className="overflow-hidden rounded-3xl border border-border-custom bg-bg-secondary shadow-sm" aria-labelledby="empty-roadmap-title">
            <div className="bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(14,165,233,0.08),transparent)] px-6 py-12 text-center sm:px-10 sm:py-16">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-bg text-accent-custom shadow-sm">
                <MapPinned className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 id="empty-roadmap-title" className="mt-5 text-2xl font-extrabold">
                {token ? 'Tài khoản này chưa có lộ trình' : 'Đăng nhập để xem lộ trình của bạn'}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-secondary">
                {token
                  ? 'Lộ trình chỉ được tạo từ kết quả Pre-test của chính tài khoản đang đăng nhập. Hệ thống sẽ không hiển thị bản đồ mẫu hoặc dữ liệu của tài khoản khác.'
                  : 'Mỗi tài khoản có kết quả Pre-test, tiến độ và lộ trình riêng.'}
              </p>
              <Link
                to={token ? '/onboarding' : '/login'}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-custom px-5 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
              >
                {token ? 'Bắt đầu tạo lộ trình' : 'Đăng nhập'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}

        {roadmap && (
          <>
            {/* Progress Level Card */}
            <section
              className="overflow-hidden rounded-3xl border border-border-custom bg-[linear-gradient(135deg,#1e1b4b,#4338ca_55%,#0f766e)] p-6 text-white shadow-xl shadow-indigo-950/10 sm:p-8"
              aria-label="Tiến độ hành trình"
            >
              <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-violet-200">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Cấp độ hành trình
                  </div>
                  <p className="mt-3 text-3xl font-black">
                    {roadmap.completedItems}/{roadmap.totalItems} cửa ải
                  </p>
                  <p className="mt-2 text-sm leading-6 text-indigo-100">
                    Thứ tự cửa ải ưu tiên kỹ năng cần củng cố nhưng luôn giữ đúng điều kiện tiên quyết.
                  </p>
                </div>
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-white/15 bg-white/10 text-2xl font-black shadow-inner backdrop-blur-sm">
                  {progress}%
                </div>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#34d399,#a3e635,#facc15)] transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {/* Current Quest Banner */}
            {current ? (
              <section
                className="mt-6 grid gap-5 rounded-2xl border border-accent-custom/40 bg-accent-bg p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                aria-labelledby="current-lesson"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-custom text-white shadow-md shadow-violet-500/20">
                  <BookOpen className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-accent-custom">Nhiệm vụ tiếp theo</p>
                  <h2 id="current-lesson" className="mt-1 text-lg font-extrabold">
                    {current.title}
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    {current.lessonId} · {current.estimatedMinutes} phút · {current.skillId}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{current.reason}</p>
                </div>
                <a
                  href={`/lesson/${current.contentId || current.lessonId}${roadmap.id ? `?roadmapId=${roadmap.id}` : ''}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-custom px-5 text-sm font-bold text-white hover:opacity-90 shadow-md transition-opacity cursor-pointer"
                >
                  Vào cửa ải
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </section>
            ) : roadmap.status === 'COMPLETED' && roadmap.totalItems > 0 ? (
              <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-950 sm:flex-row sm:items-center dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-amber-950 shadow-md">
                  <Trophy className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-extrabold text-lg">Bạn đã chinh phục toàn bộ bản đồ!</h2>
                  <p className="mt-1 text-sm">Các cửa ải vẫn mở để bạn quay lại ôn tập bất cứ lúc nào.</p>
                </div>
              </section>
            ) : null}

            {/* Game Roadmap Map 26 levels */}
            <GameRoadmapMap roadmap={roadmap} />

            {/* Bottom Actions */}
            <div className="mt-8 flex justify-end">
              {roadmap.assessmentId ? (
                <button
                  type="button"
                  onClick={() => navigate(`/pretest/result/${roadmap.assessmentId}`)}
                  className="min-h-11 rounded-xl border border-border-custom bg-bg-secondary px-5 text-sm font-bold hover:bg-bg-tertiary transition-colors cursor-pointer"
                >
                  Xem lại kết quả Pre-test
                </button>
              ) : (
                <Link
                  to="/onboarding"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-accent-custom/40 bg-accent-bg px-5 text-sm font-bold text-accent-custom hover:bg-accent-custom hover:text-white transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Làm bài đánh giá Pre-test cá nhân hóa
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
