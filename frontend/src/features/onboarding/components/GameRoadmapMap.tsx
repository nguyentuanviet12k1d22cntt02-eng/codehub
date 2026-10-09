import { Check, Clock3, Flag, LockKeyhole, Map, Play, Sparkles, Star, Trophy } from 'lucide-react';
import type { RoadmapDto, RoadmapItemDto } from '../../../types/roadmapContracts';

const TOP_SPACE = 104;
const STEP_GAP = 152;
const BOTTOM_SPACE = 126;
// Keep nodes away from the center on narrow screens so their information
// cards always remain inside the map while the path still snakes naturally.
const X_PATTERN = [34, 66, 66, 34, 34, 66];

interface MapPoint {
  x: number;
  y: number;
}

function makePath(points: readonly MapPoint[]): string {
  if (points.length === 0) return '';
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const middle = (previous.y + point.y) / 2;
    return `${path} C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

function statusCopy(item: RoadmapItemDto): string {
  if (item.learningStatus === 'COMPLETED') return 'Đã chinh phục';
  if (item.learningStatus === 'AVAILABLE' || item.learningStatus === 'IN_PROGRESS') return 'Ải hiện tại';
  return 'Chưa mở';
}

export default function GameRoadmapMap({ roadmap }: { roadmap: RoadmapDto }) {
  const points = roadmap.items.map((_, index) => ({
    x: X_PATTERN[index % X_PATTERN.length],
    y: TOP_SPACE + index * STEP_GAP,
  }));
  const height = Math.max(360, TOP_SPACE + Math.max(0, roadmap.items.length - 1) * STEP_GAP + BOTTOM_SPACE);
  const path = makePath(points);
  const progress = roadmap.totalItems > 0 ? Math.round(100 * roadmap.completedItems / roadmap.totalItems) : 0;

  return (
    <section className="mt-8 overflow-hidden rounded-[28px] border border-border-custom bg-bg-secondary shadow-sm" aria-labelledby="journey-map-title">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-custom bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(14,165,233,0.08),transparent)] px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-custom text-white shadow-lg shadow-violet-500/20"><Map className="h-5 w-5" aria-hidden="true" /></span>
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent-custom">Thế giới Python</p><h2 id="journey-map-title" className="mt-1 text-xl font-extrabold">Bản đồ chinh phục</h2></div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border-custom bg-bg-secondary/80 px-3 py-2 text-xs font-bold text-text-secondary backdrop-blur-sm"><Flag className="h-4 w-4 text-accent-custom" aria-hidden="true" />{roadmap.totalItems} cửa ải</div>
      </div>

      {roadmap.items.length === 0 ? (
        <div className="px-6 py-16 text-center"><Map className="mx-auto h-10 w-10 text-text-tertiary" aria-hidden="true" /><p className="mt-4 font-extrabold">Bản đồ đang được chuẩn bị</p><p className="mt-2 text-sm text-text-secondary">Cập nhật tiến độ để tải lại các cửa ải.</p></div>
      ) : (
        <div className="relative mx-auto w-full max-w-3xl overflow-hidden bg-[radial-gradient(circle_at_16%_10%,rgba(52,211,153,0.10),transparent_20rem),radial-gradient(circle_at_84%_45%,rgba(99,102,241,0.12),transparent_22rem),radial-gradient(circle_at_20%_86%,rgba(14,165,233,0.10),transparent_20rem)]" style={{ height }}>
          <Sparkles className="absolute left-[8%] top-12 h-7 w-7 text-amber-400/70" aria-hidden="true" />
          <Star className="absolute right-[9%] top-[24%] h-6 w-6 text-violet-400/50" aria-hidden="true" />
          <Sparkles className="absolute bottom-[18%] left-[10%] h-8 w-8 text-sky-400/45" aria-hidden="true" />

          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={path} fill="none" stroke="var(--border-color)" strokeWidth="12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={path} fill="none" stroke="var(--bg-secondary)" strokeWidth="7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={path} fill="none" stroke="var(--accent-color)" strokeWidth="7" strokeLinecap="round" pathLength="100" strokeDasharray={`${progress} 100`} vectorEffect="non-scaling-stroke" />
          </svg>

          <ol aria-label="Các cửa ải trong lộ trình">
            {roadmap.items.map((item, index) => {
              const point = points[index];
              const done = item.learningStatus === 'COMPLETED';
              const current = item.learningStatus === 'AVAILABLE' || item.learningStatus === 'IN_PROGRESS';
              const cardOnLeft = point.x > 50 || (point.x === 50 && index % 2 === 1);
              const milestone = (index + 1) % 5 === 0 || index === roadmap.items.length - 1;
              const nodeClass = done
                ? 'border-emerald-200 bg-emerald-500 text-white shadow-[0_12px_30px_-10px_rgba(16,185,129,0.75)] dark:border-emerald-400/40'
                : current
                  ? 'border-violet-200 bg-accent-custom text-white shadow-[0_0_0_8px_var(--accent-bg),0_15px_35px_-10px_rgba(124,58,237,0.8)] motion-safe:animate-pulse dark:border-violet-400/50'
                  : 'border-border-custom bg-bg-tertiary text-text-tertiary shadow-sm';
              const cardClass = current
                ? 'border-accent-border bg-bg-secondary shadow-[0_16px_38px_-24px_rgba(99,102,241,0.8)]'
                : done ? 'border-emerald-200/70 bg-bg-secondary dark:border-emerald-500/20' : 'border-border-custom bg-bg-secondary/95';
              const node = (
                <span className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 transition-colors ${nodeClass}`}>
                  {done ? <Check className="h-7 w-7" aria-hidden="true" /> : current ? <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" /> : <LockKeyhole className="h-5 w-5" aria-hidden="true" />}
                  {milestone && <span className="absolute -right-1 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-bg-secondary bg-amber-400 text-amber-950 shadow-sm"><Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" /></span>}
                </span>
              );

              const targetId = item.contentId || item.lessonId;
              const isUnlocked = (done || current) && !!targetId;
              const lessonUrl = targetId ? `/lesson/${targetId}${roadmap.id ? `?roadmapId=${roadmap.id}` : ''}` : '#';

              return (
                <li key={item.id} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${point.x}%`, top: point.y }}>
                  <div className="relative">
                    {isUnlocked ? (
                      <a
                        href={lessonUrl}
                        aria-label={`${done ? 'Ôn lại' : 'Bắt đầu'} bài ${item.orderIndex}: ${item.title}`}
                        className="block rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-custom/40 focus-visible:ring-offset-4 focus-visible:ring-offset-bg-secondary cursor-pointer transform transition-transform hover:scale-110 active:scale-95"
                      >
                        {node}
                      </a>
                    ) : (
                      <button type="button" disabled aria-label={`Bài ${item.orderIndex} đang khóa: ${item.title}`} className="block cursor-not-allowed rounded-full">{node}</button>
                    )}

                    {isUnlocked ? (
                      <a
                        href={lessonUrl}
                        className={`group absolute top-1/2 w-40 -translate-y-1/2 rounded-2xl border p-3 text-left sm:w-56 sm:p-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg ${cardOnLeft ? 'right-full mr-3 sm:mr-5' : 'left-full ml-3 sm:ml-5'} ${cardClass} cursor-pointer block`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-extrabold uppercase tracking-[0.12em] ${done ? 'text-emerald-600 dark:text-emerald-300' : current ? 'text-accent-custom' : 'text-text-tertiary'}`}>{statusCopy(item)}</span>
                          <span className="font-mono text-[10px] text-text-tertiary">#{item.orderIndex}</span>
                        </div>
                        <h3 className="mt-1 line-clamp-2 text-xs font-extrabold leading-5 text-text-primary sm:text-sm group-hover:text-accent-custom transition-colors">{item.title}</h3>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-text-tertiary"><Clock3 className="h-3 w-3" aria-hidden="true" />{item.estimatedMinutes} phút<span aria-hidden="true">·</span><span className="truncate">{item.skillId}</span></div>
                      </a>
                    ) : (
                      <article className={`absolute top-1/2 w-40 -translate-y-1/2 rounded-2xl border p-3 text-left sm:w-56 sm:p-4 ${cardOnLeft ? 'right-full mr-3 sm:mr-5' : 'left-full ml-3 sm:ml-5'} ${cardClass}`}>
                        <div className="flex items-center justify-between gap-2"><span className={`text-[10px] font-extrabold uppercase tracking-[0.12em] ${done ? 'text-emerald-600 dark:text-emerald-300' : current ? 'text-accent-custom' : 'text-text-tertiary'}`}>{statusCopy(item)}</span><span className="font-mono text-[10px] text-text-tertiary">#{item.orderIndex}</span></div>
                        <h3 className="mt-1 line-clamp-2 text-xs font-extrabold leading-5 text-text-primary sm:text-sm">{item.title}</h3>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-text-tertiary"><Clock3 className="h-3 w-3" aria-hidden="true" />{item.estimatedMinutes} phút<span aria-hidden="true">·</span><span className="truncate">{item.skillId}</span></div>
                      </article>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center text-center">
            <span className={`flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-bg-secondary shadow-xl ${roadmap.status === 'COMPLETED' ? 'bg-amber-400 text-amber-950' : 'bg-bg-tertiary text-text-tertiary'}`}><Trophy className="h-8 w-8" aria-hidden="true" /></span>
            <span className="mt-2 rounded-full border border-border-custom bg-bg-secondary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-text-secondary">Kho báu cuối hành trình</span>
          </div>
        </div>
      )}
    </section>
  );
}
