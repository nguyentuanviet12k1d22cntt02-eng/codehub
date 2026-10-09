import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { prisma } from '../../infrastructure/database/prisma';
import { getLanguageGraphConfig } from './onboardingConfig';

export interface PilotLesson {
  lessonId: string;
  title: string;
  primarySkillId: string;
  prerequisiteLessonIds: string[];
  contentSha256: string;
  contentId: string;
  estimatedMinutes: number;
  curriculumOrder: number;
}

export interface PilotCatalog {
  catalogVersion: string;
  mappingVersion: string;
  policyVersion: string;
  graphVersion: string;
  goalId: string;
  catalogSha256: string;
  lessons: PilotLesson[];
}

function sha(value: string): string { return crypto.createHash('sha256').update(value).digest('hex'); }

export async function loadPythonBasicsPilotCatalog(): Promise<PilotCatalog> {
  const compiled = path.join(__dirname, '../../infrastructure/data/pythonBasicsLessonCatalog.pilot.json');
  const filename = fs.existsSync(compiled)
    ? compiled : path.resolve(__dirname, '../../../src/infrastructure/data/pythonBasicsLessonCatalog.pilot.json');
  const raw = fs.readFileSync(filename, 'utf8');
  const manifest = JSON.parse(raw) as {
    catalogVersion: string; mappingVersion: string; policyVersion: string;
    language: string; goalId: string; graphVersion: string; courseTitle: string;
    lessons: Array<Omit<PilotLesson, 'contentId' | 'estimatedMinutes' | 'curriculumOrder'>>;
  };
  const graph = getLanguageGraphConfig('PYTHON');
  const goal = graph.goals.find(item => item.goalId === manifest.goalId);
  if (manifest.language !== 'PYTHON' || manifest.goalId !== 'GOAL_PY_BASICS'
    || manifest.graphVersion !== graph.graphVersion || !goal
    || manifest.policyVersion !== 'palnet-lesson-policy/1.0.0'
    || manifest.mappingVersion !== 'lesson-skill-mapping/1.0.0-py-basics-pilot'
    || !Array.isArray(manifest.lessons) || manifest.lessons.length !== 26) {
    throw new Error('LESSON_CATALOG_INVALID: Phiên bản hoặc phạm vi pilot không hợp lệ.');
  }
  const goalSkills = new Set(graph.skills.filter(skill => goal.moduleIds.includes(skill.moduleId)).map(skill => skill.id));
  const ids = new Set(manifest.lessons.map(item => item.lessonId));
  if (ids.size !== manifest.lessons.length
    || manifest.lessons.some(item => !goalSkills.has(item.primarySkillId)
      || !/^[a-f0-9]{64}$/.test(item.contentSha256)
      || item.prerequisiteLessonIds.some(id => !ids.has(id) || id === item.lessonId))) {
    throw new Error('LESSON_CATALOG_INVALID: Mapping kỹ năng hoặc điều kiện tiên quyết không hợp lệ.');
  }
  if (new Set(manifest.lessons.map(item => item.primarySkillId)).size !== goalSkills.size) {
    throw new Error('LESSON_CATALOG_INVALID: Chưa phủ đủ kỹ năng mục tiêu Python Basics.');
  }
  const mapping = new Map(manifest.lessons.map(item => [item.lessonId, item]));
  const skillsById = new Map(graph.skills.map(skill => [skill.id, skill]));
  const ancestors = new Map<string, Set<string>>();
  const visiting = new Set<string>();
  function ancestorSkills(lessonId: string): Set<string> {
    if (ancestors.has(lessonId)) return ancestors.get(lessonId)!;
    if (visiting.has(lessonId)) throw new Error('LESSON_CATALOG_INVALID: Điều kiện tiên quyết tạo vòng.');
    visiting.add(lessonId);
    const result = new Set<string>();
    for (const prerequisiteId of mapping.get(lessonId)!.prerequisiteLessonIds) {
      const prerequisite = mapping.get(prerequisiteId)!;
      result.add(prerequisite.primarySkillId);
      for (const skillId of ancestorSkills(prerequisiteId)) result.add(skillId);
    }
    visiting.delete(lessonId);
    ancestors.set(lessonId, result);
    return result;
  }
  for (const item of manifest.lessons) {
    const required = skillsById.get(item.primarySkillId)?.prerequisites ?? [];
    const covered = ancestorSkills(item.lessonId);
    if (required.some(skillId => !covered.has(skillId))) {
      throw new Error(`LESSON_CATALOG_INVALID: ${item.lessonId} thiếu bài tiền đề của kỹ năng.`);
    }
  }
  const courses = await prisma.course.findMany({
    where: { title: manifest.courseTitle, status: 'PUBLISHED' },
    include: { modules: { include: { chapters: { include: { lessons: true } } } } },
  });
  if (courses.length !== 1) throw new Error('LESSON_CATALOG_UNAVAILABLE: Không tìm thấy đúng một khóa Python đã phát hành.');
  const dbLessons = courses[0].modules.flatMap(module => module.chapters.flatMap(chapter => chapter.lessons));
  const byId = new Map<string, typeof dbLessons>();
  for (const lesson of dbLessons) {
    const group = byId.get(lesson.lessonId ?? '') ?? [];
    group.push(lesson);
    byId.set(lesson.lessonId ?? '', group);
  }
  const lessons = manifest.lessons.map((item, index) => {
    const matched = byId.get(item.lessonId) ?? [];
    if (matched.length !== 1) throw new Error(`LESSON_CATALOG_UNAVAILABLE: Bài ${item.lessonId} thiếu hoặc trùng.`);
    const db = matched[0];
    const normalized = (db.content ?? '').replace(/\r\n/g, '\n');
    if (db.title !== item.title || sha(db.content ?? '') !== item.contentSha256
      || normalized.length < 1000
      || !normalized.startsWith(`---\nlessonId: "${item.lessonId}"\ntitle: "${item.title}"`)) {
      throw new Error(`LESSON_CONTENT_REVIEW_REQUIRED: Nội dung ${item.lessonId} đã khác bản pilot được duyệt.`);
    }
    return {
      ...item, contentId: db.id, estimatedMinutes: db.durationMinutes ?? 30,
      curriculumOrder: index + 1,
    };
  });
  const exercises = await prisma.codingExercise.findMany({
    where: { lessonId: { in: lessons.map(item => item.contentId) } },
    select: { lessonId: true },
  });
  const lessonsWithExercises = new Set(exercises.map(item => item.lessonId));
  if (lessons.some(item => !lessonsWithExercises.has(item.contentId))) {
    throw new Error('LESSON_CATALOG_UNAVAILABLE: Có bài pilot chưa có bài tập code để xác nhận hoàn thành.');
  }
  return {
    catalogVersion: manifest.catalogVersion, mappingVersion: manifest.mappingVersion,
    policyVersion: manifest.policyVersion, graphVersion: manifest.graphVersion,
    goalId: manifest.goalId, catalogSha256: sha(raw), lessons,
  };
}
