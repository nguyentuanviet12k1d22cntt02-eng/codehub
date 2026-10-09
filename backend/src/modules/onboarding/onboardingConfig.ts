import fs from 'fs';
import path from 'path';
import { SupportedLanguage } from '../../shared/types/roadmapContracts';

export interface GoalDefinition {
  goalId: string;
  title: string;
  description: string;
  moduleIds: string[];
  skillCount: number;
  estimatedPretestQuestions: number;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
}

export interface LanguageGraphConfig {
  language: SupportedLanguage;
  graphVersion: string;
  domainName: string;
  domainDescription: string;
  modules: ModuleDefinition[];
  goals: GoalDefinition[];
  skills: Array<{ id: string; name: string; moduleId: string; prerequisites: string[] }>;
}

interface RawSkillGraph {
  version?: unknown;
  domain?: { name?: unknown; description?: unknown };
  modules?: Array<{ id?: unknown; name?: unknown; title?: unknown; description?: unknown; order_index?: unknown }>;
  skills?: Array<{ id?: unknown; name?: unknown; module_id?: unknown; prerequisites?: unknown }>;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['PYTHON', 'JAVASCRIPT', 'CPP', 'SQL'];

export const GRAPH_VERSIONS: Record<SupportedLanguage, string> = {
  PYTHON: '2.1',
  JAVASCRIPT: '3.0.0',
  CPP: '4.0.0',
  SQL: '2.0',
};

const GRAPH_FILENAMES: Record<SupportedLanguage, string> = {
  PYTHON: 'pythonSkillGraph.json',
  JAVASCRIPT: 'javascriptSkillGraph.json',
  CPP: 'cppSkillGraph.json',
  SQL: 'sqlSkillGraph.json',
};

// Goals defined in docs/dac_ta_giai_doan_0.md section 2.2
export const GOAL_DEFINITIONS: Record<SupportedLanguage, GoalDefinition[]> = {
  PYTHON: [
    {
      goalId: 'GOAL_PY_BASICS',
      title: 'Nhập môn Python cơ bản',
      description: 'Nền tảng cú pháp, biến, kiểu dữ liệu nguyên thủy và điều khiển luồng (rẽ nhánh & vòng lặp).',
      moduleIds: ['MOD-BASICS', 'MOD-FLOW'],
      skillCount: 9,
      estimatedPretestQuestions: 12,
    },
    {
      goalId: 'GOAL_PY_DATA',
      title: 'Cấu trúc dữ liệu & Thao tác tập hợp',
      description: 'Bao gồm cơ bản và các cấu trúc dữ liệu cốt lõi: List, Tuple, Dictionary, Set, Comprehension.',
      moduleIds: ['MOD-BASICS', 'MOD-FLOW', 'MOD-COLLECTIONS'],
      skillCount: 17,
      estimatedPretestQuestions: 14,
    },
    {
      goalId: 'GOAL_PY_FOUNDATION',
      title: 'Nền tảng Python toàn diện & Lập trình hàm',
      description: 'Làm chủ hàm def, lambda, xử lý ngoại lệ try-except, file I/O và module.',
      moduleIds: ['MOD-BASICS', 'MOD-FLOW', 'MOD-COLLECTIONS', 'MOD-FUNC', 'MOD-EXC-IO'],
      skillCount: 29,
      estimatedPretestQuestions: 15,
    },
    {
      goalId: 'GOAL_PY_FULL',
      title: 'Lập trình hướng đối tượng (OOP) & Dự án',
      description: 'Toàn diện 6 module: Class, Object, Kế thừa, Đa hình, Đóng gói và Magic Methods.',
      moduleIds: ['MOD-BASICS', 'MOD-FLOW', 'MOD-COLLECTIONS', 'MOD-FUNC', 'MOD-EXC-IO', 'MOD-OOP'],
      skillCount: 35,
      estimatedPretestQuestions: 15,
    },
  ],
  JAVASCRIPT: [
    {
      goalId: 'GOAL_JS_BASICS',
      title: 'Nhập môn JavaScript cơ bản',
      description: 'Cú pháp cơ bản, biến (let/const), kiểu dữ liệu nguyên thủy và cấu trúc điều khiển.',
      moduleIds: ['MOD-JS-VAR', 'MOD-JS-TYPE', 'MOD-JS-CONTROL'],
      skillCount: 6,
      estimatedPretestQuestions: 12,
    },
    {
      goalId: 'GOAL_JS_PRACTICAL',
      title: 'JavaScript thực chiến & Thao tác dữ liệu',
      description: 'Nắm vững hàm, mảng, object, ES6+ (destructuring, spread) và higher-order functions.',
      moduleIds: ['MOD-JS-VAR', 'MOD-JS-TYPE', 'MOD-JS-CONTROL', 'MOD-JS-FUNC', 'MOD-JS-DATA', 'MOD-JS-ES6'],
      skillCount: 15,
      estimatedPretestQuestions: 14,
    },
    {
      goalId: 'GOAL_JS_FULL',
      title: 'Lập trình JavaScript nâng cao & Toàn diện',
      description: 'Toàn bộ 9 module: Event Loop, Asynchronous (Promise/Async-Await), OOP Class & Modules.',
      moduleIds: ['MOD-JS-VAR', 'MOD-JS-TYPE', 'MOD-JS-CONTROL', 'MOD-JS-FUNC', 'MOD-JS-DATA', 'MOD-JS-ES6', 'MOD-JS-EXEC', 'MOD-JS-OOP', 'MOD-JS-ENG'],
      skillCount: 23,
      estimatedPretestQuestions: 15,
    },
  ],
  CPP: [
    {
      goalId: 'GOAL_CPP_BASICS',
      title: 'Nhập môn C++ cơ bản & Tư duy lập trình',
      description: 'Cú pháp C++ chuẩn, kiểu dữ liệu, toán tử, rẽ nhánh và các cấu trúc lặp.',
      moduleIds: ['MOD-CPP-SYNTAX', 'MOD-CPP-CONTROL'],
      skillCount: 6,
      estimatedPretestQuestions: 12,
    },
    {
      goalId: 'GOAL_CPP_DATA',
      title: 'Cấu trúc dữ liệu & Bản ghi C++',
      description: 'Mảng tĩnh/động, vector, chuỗi, con trỏ cơ bản và cấu trúc struct/record.',
      moduleIds: ['MOD-CPP-SYNTAX', 'MOD-CPP-CONTROL', 'MOD-CPP-DATA', 'MOD-CPP-RECORDS'],
      skillCount: 13,
      estimatedPretestQuestions: 14,
    },
    {
      goalId: 'GOAL_CPP_FULL',
      title: 'C++ nâng cao & Thư viện chuẩn STL',
      description: 'Toàn bộ 7 module: Con trỏ thông minh (Smart Pointers), Quản lý bộ nhớ, STL Containers, Thuật toán & Đệ quy.',
      moduleIds: ['MOD-CPP-SYNTAX', 'MOD-CPP-CONTROL', 'MOD-CPP-DATA', 'MOD-CPP-RECORDS', 'MOD-CPP-STL', 'MOD-CPP-ALGO', 'MOD-CPP-ROBUST'],
      skillCount: 21,
      estimatedPretestQuestions: 15,
    },
  ],
  SQL: [
    {
      goalId: 'GOAL_SQL_BASICS',
      title: 'Truy vấn SQL Server cơ bản (T-SQL Foundations)',
      description: 'Kiến trúc RDBMS, cú pháp SELECT/FROM, lọc dữ liệu WHERE, toán tử logic và sắp xếp ORDER BY.',
      moduleIds: ['MOD-SQL-RDBMS', 'MOD-SQL-DQL', 'MOD-SQL-FILTER', 'MOD-SQL-LOGIC', 'MOD-SQL-SORT'],
      skillCount: 5,
      estimatedPretestQuestions: 12,
    },
    {
      goalId: 'GOAL_SQL_ANALYTICS',
      title: 'Tổng hợp dữ liệu & Báo cáo phân tích',
      description: 'Bao gồm truy vấn cơ bản kết hợp hàm tổng hợp (COUNT, SUM, AVG) và gom nhóm GROUP BY / HAVING.',
      moduleIds: ['MOD-SQL-RDBMS', 'MOD-SQL-DQL', 'MOD-SQL-FILTER', 'MOD-SQL-LOGIC', 'MOD-SQL-SORT', 'MOD-SQL-AGG'],
      skillCount: 6,
      estimatedPretestQuestions: 14,
    },
    {
      goalId: 'GOAL_SQL_FULL',
      title: 'T-SQL toàn diện & Ghép nối dữ liệu (JOINs)',
      description: 'Toàn bộ 7 module: INNER JOIN, LEFT/RIGHT JOIN, Full Outer Join, Cross Join và truy vấn đa bảng phức tạp.',
      moduleIds: ['MOD-SQL-RDBMS', 'MOD-SQL-DQL', 'MOD-SQL-FILTER', 'MOD-SQL-LOGIC', 'MOD-SQL-SORT', 'MOD-SQL-AGG', 'MOD-SQL-JOIN'],
      skillCount: 7,
      estimatedPretestQuestions: 15,
    },
  ],
};

const cachedConfigs: Partial<Record<SupportedLanguage, LanguageGraphConfig>> = {};

function assertNonEmptyString(value: unknown, errorCode: string, detail: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${errorCode}: ${detail}`);
  }
}

function validateGoalDefinitions(language: SupportedLanguage, modules: ModuleDefinition[], skills: LanguageGraphConfig['skills']): void {
  const moduleIds = new Set(modules.map((module) => module.id));

  for (const goal of GOAL_DEFINITIONS[language]) {
    const unknownModuleIds = goal.moduleIds.filter((moduleId) => !moduleIds.has(moduleId));
    if (unknownModuleIds.length > 0) {
      throw new Error(`GRAPH_GOAL_INVALID: ${goal.goalId} tham chiếu module không tồn tại: ${unknownModuleIds.join(', ')}.`);
    }

    const actualSkillCount = skills.filter((skill) => goal.moduleIds.includes(skill.moduleId)).length;
    if (actualSkillCount !== goal.skillCount) {
      throw new Error(`GRAPH_GOAL_INVALID: ${goal.goalId} khai báo ${goal.skillCount} skills nhưng đồ thị hiện có ${actualSkillCount}.`);
    }

    if (![12, 14, 15].includes(goal.estimatedPretestQuestions)) {
      throw new Error(`GRAPH_GOAL_INVALID: ${goal.goalId} có số câu Pre-test không hợp lệ.`);
    }
  }
}

export function getLanguageGraphConfig(language: string): LanguageGraphConfig {
  const upperLang = language.toUpperCase() as SupportedLanguage;
  if (!SUPPORTED_LANGUAGES.includes(upperLang)) {
    throw new Error(`LANGUAGE_NOT_SUPPORTED: Ngôn ngữ '${language}' không nằm trong phạm vi lộ trình cá nhân hóa (chỉ hỗ trợ PYTHON, JAVASCRIPT, CPP, SQL).`);
  }

  if (cachedConfigs[upperLang]) {
    return cachedConfigs[upperLang]!;
  }

  const fileName = GRAPH_FILENAMES[upperLang];
  const filePath = path.join(__dirname, '../../infrastructure/data', fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`GRAPH_FILE_MISSING: Không tìm thấy tệp đồ thị kỹ năng cho ngôn ngữ '${upperLang}'.`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let data: RawSkillGraph;
  try {
    data = JSON.parse(raw) as RawSkillGraph;
  } catch {
    throw new Error(`GRAPH_FILE_INVALID: Tệp đồ thị kỹ năng '${upperLang}' không phải JSON hợp lệ.`);
  }

  assertNonEmptyString(data.version, 'GRAPH_FILE_INVALID', `Đồ thị ${upperLang} thiếu version.`);
  if (data.version !== GRAPH_VERSIONS[upperLang]) {
    throw new Error(`GRAPH_VERSION_MISMATCH: Đồ thị ${upperLang} có version ${data.version}, khác version đã chốt ${GRAPH_VERSIONS[upperLang]}.`);
  }

  if (!Array.isArray(data.modules) || !Array.isArray(data.skills)) {
    throw new Error(`GRAPH_FILE_INVALID: Đồ thị ${upperLang} phải có mảng modules và skills.`);
  }

  const modules: ModuleDefinition[] = data.modules.map((module, index) => {
    assertNonEmptyString(module.id, 'GRAPH_FILE_INVALID', `Module thứ ${index + 1} của ${upperLang} thiếu id.`);
    const name = typeof module.name === 'string' ? module.name : module.title;
    assertNonEmptyString(name, 'GRAPH_FILE_INVALID', `Module ${module.id} của ${upperLang} thiếu tên.`);
    return {
      id: module.id,
      name,
      description: typeof module.description === 'string' ? module.description : '',
      orderIndex: typeof module.order_index === 'number' ? module.order_index : index + 1,
    };
  });

  const skills = data.skills.map((skill, index) => {
    assertNonEmptyString(skill.id, 'GRAPH_FILE_INVALID', `Skill thứ ${index + 1} của ${upperLang} thiếu id.`);
    assertNonEmptyString(skill.module_id, 'GRAPH_FILE_INVALID', `Skill ${skill.id} của ${upperLang} thiếu module_id.`);
    return {
      id: skill.id,
      name: typeof skill.name === 'string' ? skill.name : skill.id,
      moduleId: skill.module_id,
      prerequisites: Array.isArray(skill.prerequisites) && skill.prerequisites.every((item) => typeof item === 'string')
        ? skill.prerequisites
        : [],
    };
  });

  if (new Set(modules.map((module) => module.id)).size !== modules.length) {
    throw new Error(`GRAPH_FILE_INVALID: Đồ thị ${upperLang} có module id trùng lặp.`);
  }
  if (new Set(skills.map((skill) => skill.id)).size !== skills.length) {
    throw new Error(`GRAPH_FILE_INVALID: Đồ thị ${upperLang} có skill id trùng lặp.`);
  }

  validateGoalDefinitions(upperLang, modules, skills);

  const config: LanguageGraphConfig = {
    language: upperLang,
    graphVersion: data.version,
    domainName: typeof data.domain?.name === 'string' ? data.domain.name : upperLang,
    domainDescription: typeof data.domain?.description === 'string' ? data.domain.description : '',
    modules,
    goals: GOAL_DEFINITIONS[upperLang] || [],
    skills,
  };

  cachedConfigs[upperLang] = config;
  return config;
}
