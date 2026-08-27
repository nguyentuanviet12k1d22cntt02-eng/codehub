import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Table,
    Database,
    Code2,
    Tag,
    Bold,
    Lightbulb,
    PenLine,
    Columns2,
    Eye,
    Plus,
    Trash2,
    Save,
    Check,
    CheckCircle2,
    Laptop,
    Edit3,
    Shield,
    Search,
    Ban,
    MessageSquare
} from 'lucide-react';

import type { BlockType, LessonBlock } from './studio/types';
import { createDefaultBlock, parseMarkdownToBlocks, convertBlocksToMarkdown } from './studio/utils';
import { StudioTopBar } from './studio/components/StudioTopBar';
import { StudioSidebarPalette } from './studio/components/StudioSidebarPalette';
import { StudioCanvas } from './studio/components/StudioCanvas';
import { StudioBlockProperties } from './studio/components/StudioBlockProperties';
import { StudioBottomMiniMap } from './studio/components/StudioBottomMiniMap';
import { API_BASE_URL } from '../../config/api';

export * from './studio/types';

interface TestCase {
    id?: string;
    exerciseId?: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

interface CodingExercise {
    id: string;
    lessonId: string;
    title: string;
    difficulty: string;
    problemDescription: string;
    starterCode: string;
    solutionCode: string;
    testCases: TestCase[];
}

interface QuizOption {
    id?: string;
    key: string;
    text: string;
    isCorrect: boolean;
}

interface QuizQuestion {
    id: string;
    lessonId: string;
    question: string;
    explanation: string;
    level: string;
    orderIndex: number;
    options: QuizOption[];
}

interface LessonStudioEditorProps {
    lesson: any;
    onSave: (updatedLesson: any) => Promise<void>;
    onClose: () => void;
}

// ==========================================
// 🎨 BEAUTIFUL LIVE MARKDOWN VIEWER COMPONENT
// ==========================================
const LiveMarkdownViewer: React.FC<{ content: string; isDarkTheme?: boolean }> = ({ content, isDarkTheme }) => {
    return (
        <div className={`prose max-w-none text-xs leading-relaxed ${isDarkTheme ? 'text-slate-200' : 'text-slate-800'}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ node, ...props }) => <p className="mb-2.5 last:mb-0 leading-relaxed font-sans" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-extrabold text-purple-600 dark:text-purple-400" {...props} />,
                    em: ({ node, ...props }) => <em className="italic text-slate-600 dark:text-slate-400" {...props} />,
                    code: ({ node, className, children, ...props }) => {
                        const contentStr = String(children || '');
                        const hasNewline = contentStr.includes('\n');
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !hasNewline;

                        return isInline ? (
                            <code className="bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/40 px-1.5 py-0.5 rounded-[4px] font-mono text-[11px] font-bold mx-0.5 inline-block" {...props}>
                                {children}
                            </code>
                        ) : (
                            <div className="my-2.5 rounded-[5px] overflow-hidden border border-slate-700/60 bg-[#12131a] shadow-xs">
                                {match && (
                                    <div className="bg-[#181a24] border-b border-slate-700/50 px-3 py-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                                        <span className="font-bold uppercase tracking-wider text-purple-400">{match[1]}</span>
                                    </div>
                                )}
                                <pre className="p-3 overflow-x-auto text-xs font-mono text-[#00ff88] leading-relaxed">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        );
                    },
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto w-full border border-slate-200 dark:border-white/10 rounded-[5px] my-3 shadow-xs bg-white dark:bg-[#121217]">
                            <table className="w-full text-xs text-left border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-slate-100/90 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                        <tr className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-3 py-2 font-bold border-r border-slate-200/80 dark:border-white/10 last:border-r-0" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-3 py-1.5 border-r border-slate-200/60 dark:border-white/5 last:border-r-0 font-medium" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-purple-500 bg-purple-50/40 dark:bg-purple-950/20 p-2.5 my-2 rounded-r-[4px] text-xs font-medium text-slate-700 dark:text-slate-300" {...props} />
                    ),
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 text-xs" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 text-xs" {...props} />
                }}
            >
                {content || '*Chưa có nội dung mô tả*'}
            </ReactMarkdown>
        </div>
    );
};

// ==========================================
// 🛠️ QUICK FORMAT INSERTION TOOLBAR
// ==========================================
interface QuickInsertToolbarProps {
    onInsert: (textToInsert: string) => void;
    isDarkTheme?: boolean;
}

const QuickInsertToolbar: React.FC<QuickInsertToolbarProps> = ({ onInsert, isDarkTheme }) => {
    const insertTableTemplate = () => {
        const tableMD = `\n| EMPLOYEEID | FULLNAME | AGE | DEPARTMENT |\n| :--- | :--- | :--- | :--- |\n| 1 | Nguyễn Văn A | 22 | IT |\n| 2 | Trần Thị B | 25 | Sales |\n| 3 | Lê Văn C | 35 | Sales |\n| 4 | Phạm Minh D | 28 | HR |\n\n`;
        onInsert(tableMD);
    };

    const insertSqlBlockTemplate = () => {
        const sqlMD = `\n\`\`\`sql\nSELECT *\nFROM hr.Employees\nWHERE Age > 30\n  AND Department = 'Sales'\n  OR Department = 'IT';\n\`\`\`\n\n`;
        onInsert(sqlMD);
    };

    const insertPythonBlockTemplate = () => {
        const pyMD = `\n\`\`\`python\ndef tinh_tong(a, b):\n    return a + b\n\nprint(tinh_tong(5, 10))\n\`\`\`\n\n`;
        onInsert(pyMD);
    };

    const insertBadge = () => {
        onInsert(' `hr.Employees` ');
    };

    const insertBold = () => {
        onInsert(' **chắc chắn sẽ xuất hiện** ');
    };

    const insertCallout = () => {
        onInsert('\n> 💡 **Lưu ý:** Ghi chú quan trọng ở đây...\n\n');
    };

    const btnStyle = `px-2 py-1 rounded-[3px] border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
        isDarkTheme
            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200'
            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
    }`;

    return (
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[4px] mb-2">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 tracking-wider mr-1">
                + Chèn nhanh:
            </span>
            <button type="button" onClick={insertTableTemplate} className={btnStyle} title="Chèn bảng dữ liệu mẫu">
                <Table className="w-3.5 h-3.5 text-indigo-500" />
                <span>Bảng dữ liệu</span>
            </button>
            <button type="button" onClick={insertSqlBlockTemplate} className={btnStyle} title="Chèn khối lệnh SQL">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                <span>Khối SQL</span>
            </button>
            <button type="button" onClick={insertPythonBlockTemplate} className={btnStyle} title="Chèn khối code Python">
                <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Code Python</span>
            </button>
            <button type="button" onClick={insertBadge} className={btnStyle} title="Chèn badge tên bảng/cột">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Badge tên</span>
            </button>
            <button type="button" onClick={insertBold} className={btnStyle} title="In đậm văn bản">
                <Bold className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
                <span>In đậm</span>
            </button>
            <button type="button" onClick={insertCallout} className={btnStyle} title="Chèn hộp lưu ý">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Ghi chú</span>
            </button>
        </div>
    );
};

export const LessonStudioEditor: React.FC<LessonStudioEditorProps> = ({ lesson, onSave, onClose }) => {
    const [activeTab, setActiveTab] = useState<'content' | 'exercises' | 'quizzes'>('content');

    // Lesson content states
    const [title, setTitle] = useState(lesson.title || '');
    const [lessonIdCode, setLessonIdCode] = useState(lesson.lessonId || '');
    const [objective, setObjective] = useState(lesson.objective || '');
    const [difficulty, setDifficulty] = useState(lesson.difficulty || 'EASY');
    const [durationMinutes, setDurationMinutes] = useState(lesson.durationMinutes || 15);
    const [blocks, setBlocks] = useState<LessonBlock[]>(() => parseMarkdownToBlocks(lesson.content || '', lesson.title || ''));
    const [selectedBlockId, setSelectedBlockId] = useState<string>(blocks[0]?.id || '');
    const [searchBlockQuery, setSearchBlockQuery] = useState('');
    const [isSaved, setIsSaved] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [history, setHistory] = useState<LessonBlock[][]>([blocks]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [previewMode, setPreviewMode] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [insertMenuOpenIndex, setInsertMenuOpenIndex] = useState<number | null>(null);

    // ============ EXERCISES & TESTCASES STATES ============
    const [exercises, setExercises] = useState<CodingExercise[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
    const [editingExercise, setEditingExercise] = useState<CodingExercise | null>(null);
    const [exerciseDescriptionViewMode, setExerciseDescriptionViewMode] = useState<'edit' | 'preview' | 'split'>('split');
    const [deletedTestCaseIds, setDeletedTestCaseIds] = useState<string[]>([]);
    const [isSavingExercise, setIsSavingExercise] = useState(false);

    // ============ CODE CONSTRAINT RULES STATES ============
    const [requireComment, setRequireComment] = useState<boolean>(false);
    const [requiredKeywords, setRequiredKeywords] = useState<string>('');
    const [forbiddenKeywords, setForbiddenKeywords] = useState<string>('');
    const [customErrorMessage, setCustomErrorMessage] = useState<string>('');

    const loadExerciseConstraints = (ex: CodingExercise | null) => {
        if (!ex) {
            setRequireComment(false);
            setRequiredKeywords('');
            setForbiddenKeywords('');
            setCustomErrorMessage('');
            return;
        }
        const match = /<!--\s*CONSTRAINTS:\s*(\{[\s\S]*?\})\s*-->/.exec(ex.problemDescription || '');
        if (match) {
            try {
                const cfg = JSON.parse(match[1]);
                setRequireComment(Boolean(cfg.requireComment));
                setRequiredKeywords(Array.isArray(cfg.requiredKeywords) ? cfg.requiredKeywords.join(', ') : '');
                setForbiddenKeywords(Array.isArray(cfg.forbiddenKeywords) ? cfg.forbiddenKeywords.join(', ') : '');
                setCustomErrorMessage(cfg.customErrorMessage || '');
                return;
            } catch {}
        }
        setRequireComment(false);
        setRequiredKeywords('');
        setForbiddenKeywords('');
        setCustomErrorMessage('');
    };

    // ============ QUIZZES STATES ============
    const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
    const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);
    const [quizModalTab, setQuizModalTab] = useState<'edit' | 'preview'>('edit');
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    const activeBlock = blocks.find(b => b.id === selectedBlockId) || blocks[0];

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Load exercises & quizzes for this lesson
    const fetchExercises = async () => {
        if (!lesson.id) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/exercises?lessonId=${lesson.id}`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            setExercises(list);
            if (list.length > 0) {
                const target = list.find(e => e.id === selectedExerciseId) || list[0];
                setSelectedExerciseId(target.id);
                setEditingExercise(JSON.parse(JSON.stringify(target)));
                loadExerciseConstraints(target);
            } else {
                setSelectedExerciseId('');
                setEditingExercise(null);
                loadExerciseConstraints(null);
            }
            setDeletedTestCaseIds([]);
        } catch (err) {
            console.error('Lỗi khi tải bài tập:', err);
        }
    };

    const fetchQuizzes = async () => {
        if (!lesson.id) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/quizzes?lessonId=${lesson.id}`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            setQuizzes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Lỗi khi tải câu hỏi:', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'exercises') {
            fetchExercises();
        } else if (activeTab === 'quizzes') {
            fetchQuizzes();
        }
    }, [activeTab]);

    // Push state to history for undo/redo
    const updateBlocksWithHistory = (newBlocks: LessonBlock[]) => {
        setBlocks(newBlocks);
        setIsSaved(false);
        const newHist = history.slice(0, historyIndex + 1);
        newHist.push(newBlocks);
        setHistory(newHist);
        setHistoryIndex(newHist.length - 1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setBlocks(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setBlocks(history[historyIndex + 1]);
        }
    };

    // Add Block to end
    const handleAddBlock = (type: BlockType) => {
        const newId = `block-${Date.now()}`;
        const newBlock: LessonBlock = createDefaultBlock(type, newId);
        const newBlocks = [...blocks, newBlock];
        updateBlocksWithHistory(newBlocks);
        setSelectedBlockId(newId);
    };

    // Insert Block at specific index
    const handleInsertBlockAt = (type: BlockType, index: number) => {
        const newId = `block-${Date.now()}`;
        const newBlock: LessonBlock = createDefaultBlock(type, newId);
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        updateBlocksWithHistory(newBlocks);
        setSelectedBlockId(newId);
        setInsertMenuOpenIndex(null);
    };

    // Update active block
    const handleUpdateActiveBlock = (fields: Partial<LessonBlock>) => {
        if (!activeBlock) return;
        const newBlocks = blocks.map(b => b.id === activeBlock.id ? { ...b, ...fields } : b);
        updateBlocksWithHistory(newBlocks);
    };

    // Delete block
    const handleDeleteBlock = (id: string) => {
        if (blocks.length <= 1) {
            alert('Bài học phải có ít nhất 1 khối nội dung.');
            return;
        }
        const newBlocks = blocks.filter(b => b.id !== id);
        updateBlocksWithHistory(newBlocks);
        setSelectedBlockId(newBlocks[0].id);
    };

    // Drag and drop handler
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        if (result.source.droppableId === 'sidebar-palette') {
            if (result.destination.droppableId === 'lesson-blocks-droppable') {
                const blockType = result.draggableId.replace('sidebar-', '') as BlockType;
                const newId = `block-${Date.now()}`;
                const newBlock = createDefaultBlock(blockType, newId);
                const newBlocks = [...blocks];
                newBlocks.splice(result.destination.index, 0, newBlock);
                updateBlocksWithHistory(newBlocks);
                setSelectedBlockId(newId);
            }
            return;
        }

        if (result.source.droppableId === 'lesson-blocks-droppable' && result.destination.droppableId === 'lesson-blocks-droppable') {
            const items = Array.from(blocks);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            updateBlocksWithHistory(items);
        }
    };

    // Save All Lesson Content
    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const finalMarkdown = convertBlocksToMarkdown(blocks);
            await onSave({
                ...lesson,
                title,
                lessonId: lessonIdCode,
                objective,
                difficulty,
                durationMinutes,
                content: finalMarkdown
            });
            setIsSaved(true);
        } finally {
            setIsSaving(false);
        }
    };

    // ============ EXERCISE CRUD HANDLERS ============
    const handleCreateNewExercise = () => {
        const newEx: CodingExercise = {
            id: '',
            lessonId: lesson.id,
            title: 'Bài tập thực hành mới',
            difficulty: 'EASY',
            problemDescription: 'Cho bảng dữ liệu `hr.Employees` sau:\n\n| EMPLOYEEID | FULLNAME | AGE | DEPARTMENT |\n| :--- | :--- | :--- | :--- |\n| 1 | Nguyễn Văn A | 22 | IT |\n| 2 | Trần Thị B | 25 | Sales |\n\n**Yêu cầu:** Viết câu lệnh truy vấn lọc danh sách nhân viên.',
            starterCode: '# Viết code của bạn ở đây\n',
            solutionCode: '# Lời giải tham khảo\n',
            testCases: [
                { input: '', expectedOutput: 'Hello World', isHidden: false }
            ]
        };
        setEditingExercise(newEx);
        setSelectedExerciseId('NEW');
        setDeletedTestCaseIds([]);
        loadExerciseConstraints(newEx);
    };

    const handleSaveExercise = async () => {
        if (!editingExercise) return;
        setIsSavingExercise(true);
        try {
            const isEdit = Boolean(editingExercise.id);
            const url = isEdit
                ? `${API_BASE_URL}/api/admin/exercises/${editingExercise.id}`
                : `${API_BASE_URL}/api/admin/exercises`;
            const method = isEdit ? 'PUT' : 'POST';

            // Construct clean problemDescription with CONSTRAINTS metadata
            const cleanDesc = (editingExercise.problemDescription || '').replace(/<!--\s*CONSTRAINTS:\s*(\{[\s\S]*?\})\s*-->/g, '').trim();
            const reqArr = requiredKeywords.split(',').map(s => s.trim()).filter(Boolean);
            const forbArr = forbiddenKeywords.split(',').map(s => s.trim()).filter(Boolean);
            
            let finalDescription = cleanDesc;
            if (requireComment || reqArr.length > 0 || forbArr.length > 0 || customErrorMessage.trim()) {
                const constraintObj = {
                    requireComment,
                    requiredKeywords: reqArr,
                    forbiddenKeywords: forbArr,
                    customErrorMessage: customErrorMessage.trim() || undefined
                };
                finalDescription = `${cleanDesc}\n\n<!-- CONSTRAINTS: ${JSON.stringify(constraintObj)} -->`;
            }

            const payload = {
                title: editingExercise.title,
                difficulty: editingExercise.difficulty,
                problemDescription: finalDescription,
                starterCode: editingExercise.starterCode,
                solutionCode: editingExercise.solutionCode,
                lessonId: lesson.id
            };

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || 'Lỗi khi lưu bài tập');
                return;
            }

            const savedEx = await res.json();
            const exerciseId = savedEx.id || editingExercise.id;

            // Save / Update each testcase:
            if (editingExercise.testCases && editingExercise.testCases.length > 0) {
                for (const tc of editingExercise.testCases) {
                    if (tc.id) {
                        await fetch(`${API_BASE_URL}/api/admin/testcases/${tc.id}`, {
                            method: 'PUT',
                            headers: getAuthHeaders(),
                            body: JSON.stringify({
                                input: tc.input || '',
                                expectedOutput: tc.expectedOutput || '',
                                isHidden: Boolean(tc.isHidden)
                            })
                        });
                    } else {
                        await fetch(`${API_BASE_URL}/api/admin/testcases`, {
                            method: 'POST',
                            headers: getAuthHeaders(),
                            body: JSON.stringify({
                                exerciseId,
                                input: tc.input || '',
                                expectedOutput: tc.expectedOutput || '',
                                isHidden: Boolean(tc.isHidden)
                            })
                        });
                    }
                }
            }

            // Delete deleted testcases:
            if (deletedTestCaseIds.length > 0) {
                for (const tcId of deletedTestCaseIds) {
                    await fetch(`${API_BASE_URL}/api/admin/testcases/${tcId}`, {
                        method: 'DELETE',
                        headers: getAuthHeaders()
                    });
                }
                setDeletedTestCaseIds([]);
            }

            alert(isEdit ? 'Đã lưu cập nhật bài tập và test cases thành công!' : 'Đã tạo bài tập mới thành công!');
            await fetchExercises();
        } catch {
            alert('Lỗi kết nối máy chủ khi lưu bài tập');
        } finally {
            setIsSavingExercise(false);
        }
    };

    const handleDeleteExercise = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/exercises/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                fetchExercises();
            } else {
                alert('Lỗi khi xóa bài tập');
            }
        } catch {
            alert('Lỗi kết nối máy chủ');
        }
    };

    const handleAddTestCase = () => {
        if (!editingExercise) return;
        setEditingExercise({
            ...editingExercise,
            testCases: [
                ...(editingExercise.testCases || []),
                { input: '', expectedOutput: '', isHidden: false }
            ]
        });
    };

    const handleUpdateTestCase = (index: number, fields: Partial<TestCase>) => {
        if (!editingExercise) return;
        const newTCs = [...(editingExercise.testCases || [])];
        newTCs[index] = { ...newTCs[index], ...fields };
        setEditingExercise({ ...editingExercise, testCases: newTCs });
    };

    const handleDeleteTestCase = (index: number) => {
        if (!editingExercise) return;
        const targetTC = editingExercise.testCases?.[index];
        if (targetTC?.id) {
            setDeletedTestCaseIds(prev => [...prev, targetTC.id!]);
        }
        const newTCs = (editingExercise.testCases || []).filter((_, i) => i !== index);
        setEditingExercise({ ...editingExercise, testCases: newTCs });
    };

    // ============ QUIZ CRUD HANDLERS ============
    const handleSaveQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingQuiz) return;
        try {
            const isEdit = Boolean(editingQuiz.id);
            const url = isEdit
                ? `${API_BASE_URL}/api/admin/quizzes/${editingQuiz.id}`
                : `${API_BASE_URL}/api/admin/quizzes`;
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...editingQuiz,
                lessonId: lesson.id
            };

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsQuizModalOpen(false);
                fetchQuizzes();
            } else {
                const err = await res.json();
                alert(err.message || 'Lỗi khi lưu câu hỏi');
            }
        } catch {
            alert('Lỗi kết nối máy chủ');
        }
    };

    const handleDeleteQuiz = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/quizzes/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                fetchQuizzes();
            } else {
                alert('Lỗi khi xóa câu hỏi');
            }
        } catch {
            alert('Lỗi kết nối máy chủ');
        }
    };

    return createPortal(
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={`fixed inset-0 top-0 left-0 w-screen h-screen z-[99999] flex flex-col font-sans select-none overflow-hidden transition-colors ${
                isDarkTheme ? 'bg-[#0c0c10] text-white' : 'bg-[#f8fafc] text-slate-900'
            }`}>
                {/* 1. TOP NAVIGATION BAR */}
                <StudioTopBar
                    title={title}
                    setTitle={setTitle}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isSaved={isSaved}
                    isSaving={isSaving}
                    isDarkTheme={isDarkTheme}
                    setIsDarkTheme={setIsDarkTheme}
                    historyIndex={historyIndex}
                    historyLength={history.length}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    previewMode={previewMode}
                    setPreviewMode={setPreviewMode}
                    onSaveAll={handleSaveAll}
                    onClose={onClose}
                />

                {/* 2. TAB CONTENT 1: STUDIO VISUAL BLOCK EDITOR */}
                {activeTab === 'content' && (
                    <>
                        <div className="flex-1 flex overflow-hidden">
                            {/* 2.1 LEFT SIDEBAR: THÊM KHỐI */}
                            <StudioSidebarPalette
                                searchBlockQuery={searchBlockQuery}
                                setSearchBlockQuery={setSearchBlockQuery}
                                isDarkTheme={isDarkTheme}
                                onAddBlock={handleAddBlock}
                            />

                            {/* 2.2 CENTER CANVAS: SOẠN THẢO TRỰC QUAN */}
                            <StudioCanvas
                                blocks={blocks}
                                selectedBlockId={selectedBlockId}
                                isDarkTheme={isDarkTheme}
                                insertMenuOpenIndex={insertMenuOpenIndex}
                                setInsertMenuOpenIndex={setInsertMenuOpenIndex}
                                onSelectBlock={setSelectedBlockId}
                                onDeleteBlock={handleDeleteBlock}
                                onUpdateActiveBlock={handleUpdateActiveBlock}
                                onInsertBlockAt={handleInsertBlockAt}
                                onAddBlock={handleAddBlock}
                            />

                            {/* 2.3 RIGHT SIDEBAR: CÀI ĐẶT KHỐI */}
                            <StudioBlockProperties
                                lessonIdCode={lessonIdCode}
                                setLessonIdCode={setLessonIdCode}
                                difficulty={difficulty}
                                setDifficulty={setDifficulty}
                                durationMinutes={durationMinutes}
                                setDurationMinutes={setDurationMinutes}
                                objective={objective}
                                setObjective={setObjective}
                                activeBlock={activeBlock}
                                isDarkTheme={isDarkTheme}
                                setIsSaved={setIsSaved}
                                onUpdateActiveBlock={handleUpdateActiveBlock}
                                onDeleteBlock={handleDeleteBlock}
                            />
                        </div>

                        {/* 3. BOTTOM BAR: CẤU TRÚC BÀI HỌC */}
                        <StudioBottomMiniMap
                            blocks={blocks}
                            selectedBlockId={selectedBlockId}
                            isDarkTheme={isDarkTheme}
                            onSelectBlock={setSelectedBlockId}
                            onAddBlock={handleAddBlock}
                        />
                    </>
                )}

                {/* 3. TAB CONTENT 2: BÀI TẬP THỰC HÀNH & TEST CASES */}
                {activeTab === 'exercises' && (
                    <div className="flex-1 flex overflow-hidden p-5 gap-5">
                        {/* 3.1 LEFT: LIST OF EXERCISES */}
                        <div className={`w-80 rounded-[5px] border flex flex-col p-3.5 shadow-xs ${
                            isDarkTheme ? 'bg-[#121217] border-white/10' : 'bg-white border-slate-200'
                        }`}>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-3">
                                <div>
                                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Danh sách bài tập</h2>
                                    <span className="text-[11px] text-slate-400 font-semibold">{exercises.length} bài tập</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCreateNewExercise}
                                    className="px-3 py-1.5 rounded-[4px] bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Thêm mới</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                                {exercises.length === 0 && selectedExerciseId !== 'NEW' ? (
                                    <div className="py-12 text-center text-slate-400 text-xs font-medium">
                                        Bài học này chưa có bài tập nào. Hãy bấm "+ Thêm mới" để tạo.
                                    </div>
                                ) : (
                                    <>
                                        {selectedExerciseId === 'NEW' && (
                                            <div className="p-3 rounded-[5px] border-2 border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                                <PenLine className="w-3.5 h-3.5" />
                                                <span>Bài tập mới (Đang tạo...)</span>
                                            </div>
                                        )}
                                        {exercises.map((ex) => (
                                            <div
                                                key={ex.id}
                                                onClick={() => {
                                                    setSelectedExerciseId(ex.id);
                                                    const copy = JSON.parse(JSON.stringify(ex));
                                                    setEditingExercise(copy);
                                                    loadExerciseConstraints(copy);
                                                }}
                                                className={`p-3 rounded-[5px] border cursor-pointer transition-all ${
                                                    selectedExerciseId === ex.id
                                                        ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-xs'
                                                        : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-xs truncate max-w-[170px]">{ex.title}</span>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-600 border border-emerald-200">
                                                        {ex.difficulty || 'EASY'}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    {ex.testCases?.length || 0} Test cases
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 3.2 RIGHT: EXERCISE & TESTCASES EDITOR FORM */}
                        <div className={`flex-1 rounded-[5px] border flex flex-col p-5 shadow-xs overflow-y-auto ${
                            isDarkTheme ? 'bg-[#121217] border-white/10' : 'bg-white border-slate-200'
                        }`}>
                            {editingExercise ? (
                                <div className="space-y-5 w-full">
                                    {/* Header & Save Action */}
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                                        <div>
                                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                {editingExercise.id ? `Chỉnh sửa: ${editingExercise.title}` : 'Tạo bài tập thực hành mới'}
                                            </h2>
                                            <p className="text-xs text-slate-400 mt-0.5">Biên soạn yêu cầu, code mẫu và các test cases chấm điểm tự động</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {editingExercise.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteExercise(editingExercise.id)}
                                                    className="px-3 py-1.5 rounded-[4px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Xóa bài tập</span>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleSaveExercise}
                                                disabled={isSavingExercise}
                                                className="px-4 py-2 rounded-[4px] bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                                            >
                                                <Save className="w-3.5 h-3.5" />
                                                <span>{isSavingExercise ? 'Đang lưu...' : 'Lưu bài tập & Test Cases'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                                Tiêu đề bài tập
                                            </label>
                                            <input
                                                type="text"
                                                value={editingExercise.title}
                                                onChange={(e) => setEditingExercise({ ...editingExercise, title: e.target.value })}
                                                placeholder="VD: Tính tổng 2 số nguyên, Tìm số lớn nhất..."
                                                className="w-full px-3 py-1.5 text-xs font-semibold rounded-[4px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                                Mức độ khó
                                            </label>
                                            <select
                                                value={editingExercise.difficulty}
                                                onChange={(e) => setEditingExercise({ ...editingExercise, difficulty: e.target.value })}
                                                className="w-full px-3 py-1.5 text-xs font-semibold rounded-[4px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                                            >
                                                <option value="EASY">Dễ (Easy)</option>
                                                <option value="MEDIUM">Trung bình (Medium)</option>
                                                <option value="HARD">Khó (Hard)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Problem Description with Visual / Live Preview Support */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                                Mô tả đề bài / Yêu cầu &amp; Bảng dữ liệu
                                            </label>

                                            {/* View mode toggle */}
                                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-0.5 rounded-[4px] border border-slate-200 dark:border-white/10">
                                                <button
                                                    type="button"
                                                    onClick={() => setExerciseDescriptionViewMode('edit')}
                                                    className={`px-2 py-0.5 text-[11px] font-bold rounded-[3px] transition-all cursor-pointer flex items-center gap-1 ${
                                                        exerciseDescriptionViewMode === 'edit'
                                                            ? 'bg-purple-600 text-white shadow-xs'
                                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <PenLine className="w-3 h-3" />
                                                    <span>Soạn thảo</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setExerciseDescriptionViewMode('split')}
                                                    className={`px-2 py-0.5 text-[11px] font-bold rounded-[3px] transition-all cursor-pointer flex items-center gap-1 ${
                                                        exerciseDescriptionViewMode === 'split'
                                                            ? 'bg-purple-600 text-white shadow-xs'
                                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <Columns2 className="w-3 h-3" />
                                                    <span>Chia đôi (Live)</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setExerciseDescriptionViewMode('preview')}
                                                    className={`px-2 py-0.5 text-[11px] font-bold rounded-[3px] transition-all cursor-pointer flex items-center gap-1 ${
                                                        exerciseDescriptionViewMode === 'preview'
                                                            ? 'bg-purple-600 text-white shadow-xs'
                                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    <span>Xem trước</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quick Insert Toolbar */}
                                        <QuickInsertToolbar
                                            isDarkTheme={isDarkTheme}
                                            onInsert={(txt) => {
                                                const current = editingExercise.problemDescription || '';
                                                setEditingExercise({ ...editingExercise, problemDescription: current + txt });
                                            }}
                                        />

                                        {/* Editor / Live Preview Container */}
                                        <div className={`grid gap-3 ${
                                            exerciseDescriptionViewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                                        }`}>
                                            {(exerciseDescriptionViewMode === 'edit' || exerciseDescriptionViewMode === 'split') && (
                                                <div>
                                                    <textarea
                                                        value={editingExercise.problemDescription}
                                                        onChange={(e) => setEditingExercise({ ...editingExercise, problemDescription: e.target.value })}
                                                        rows={7}
                                                        placeholder="Nhập chi tiết yêu cầu bài toán, markdown table, input/output..."
                                                        className="w-full p-3 text-xs rounded-[4px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-900 dark:text-white font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
                                                    />
                                                </div>
                                            )}

                                            {(exerciseDescriptionViewMode === 'preview' || exerciseDescriptionViewMode === 'split') && (
                                                <div className="p-3.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121217] overflow-y-auto max-h-[175px] shadow-xs">
                                                    <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 tracking-wider flex items-center gap-1 mb-2">
                                                        <Eye className="w-3 h-3" />
                                                        <span>Xem trước hiển thị phía học sinh:</span>
                                                    </span>
                                                    <LiveMarkdownViewer
                                                        content={editingExercise.problemDescription}
                                                        isDarkTheme={isDarkTheme}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Code Editors */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                                Code khởi tạo (Starter Code)
                                            </label>
                                            <textarea
                                                value={editingExercise.starterCode}
                                                onChange={(e) => setEditingExercise({ ...editingExercise, starterCode: e.target.value })}
                                                rows={6}
                                                className="w-full p-3 text-xs rounded-[4px] border border-slate-200 dark:border-white/10 bg-[#12131a] text-[#00ff88] font-mono focus:outline-none focus:border-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                                Code giải mẫu (Solution Reference)
                                            </label>
                                            <textarea
                                                value={editingExercise.solutionCode}
                                                onChange={(e) => setEditingExercise({ ...editingExercise, solutionCode: e.target.value })}
                                                rows={6}
                                                className="w-full p-3 text-xs rounded-[4px] border border-slate-200 dark:border-white/10 bg-[#12131a] text-[#60a5fa] font-mono focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    </div>

                                    {/* 3.3 CODE CONSTRAINTS & RULES CONFIGURATION */}
                                    <div className="p-4 rounded-[5px] border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10 space-y-3.5 shadow-xs">
                                        <div className="flex items-center justify-between pb-2 border-b border-purple-200/60 dark:border-purple-900/30">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                                                    Ràng buộc cú pháp &amp; Quy tắc chấm mã nguồn
                                                </h3>
                                            </div>
                                            <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-[4px]">
                                                Tự động kiểm tra trước khi chạy Test Cases
                                            </span>
                                        </div>

                                        {/* Rule 1: Require Comment */}
                                        <div className="flex items-center gap-2">
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={requireComment}
                                                    onChange={(e) => setRequireComment(e.target.checked)}
                                                    className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"
                                                />
                                                <span>Bắt buộc học viên phải viết chú thích (Comment có dấu <code>#</code>)</span>
                                            </label>
                                        </div>

                                        {/* Rule 2 & 3: Required & Forbidden Keywords */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                                            <div>
                                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                    <Search className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                    <span>Từ khóa / Cú pháp bắt buộc (Cách nhau bằng dấu phẩy)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={requiredKeywords}
                                                    onChange={(e) => setRequiredKeywords(e.target.value)}
                                                    placeholder="VD: def, course_title, for, while, print"
                                                    className="w-full px-3 py-1.5 text-xs rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12131a] text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                                                />
                                                <span className="text-[10px] text-slate-400 mt-0.5 block">Học viên bắt buộc phải dùng các từ khóa này trong code</span>
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                    <Ban className="w-3.5 h-3.5 text-rose-500" />
                                                    <span>Từ khóa / Hàm cấm sử dụng (Cách nhau bằng dấu phẩy)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={forbiddenKeywords}
                                                    onChange={(e) => setForbiddenKeywords(e.target.value)}
                                                    placeholder="VD: sum, sort, sorted, eval, exec"
                                                    className="w-full px-3 py-1.5 text-xs rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12131a] text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                                                />
                                                <span className="text-[10px] text-slate-400 mt-0.5 block">Chặn học viên dùng hàm tắt/mẹo để bắt tự viết thuật toán</span>
                                            </div>
                                        </div>

                                        {/* Rule 4: Custom Error Message */}
                                        <div>
                                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                                                <span>Lời nhắc lỗi tùy chỉnh khi vi phạm quy tắc (Tùy chọn)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={customErrorMessage}
                                                onChange={(e) => setCustomErrorMessage(e.target.value)}
                                                placeholder="VD: Đề bài yêu cầu bạn phải viết chú thích # và tự cài đặt thuật toán tính tổng..."
                                                className="w-full px-3 py-1.5 text-xs rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12131a] text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    </div>

                                    {/* TEST CASES SECTION */}
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                                                    Danh sách Test Cases ({editingExercise.testCases?.length || 0})
                                                </h3>
                                                <span className="text-[11px] text-slate-400">Dùng để chấm điểm tự động khi học viên nhấn "Chạy code" hoặc "Nộp bài"</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddTestCase}
                                                className="px-3 py-1.5 rounded-[4px] border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-all cursor-pointer flex items-center gap-1"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Thêm Test Case</span>
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {editingExercise.testCases?.map((tc, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3.5 rounded-[5px] border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-bg-tertiary space-y-2.5 shadow-xs"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                                            Test Case #{idx + 1}
                                                        </span>
                                                        <div className="flex items-center gap-3">
                                                            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={tc.isHidden}
                                                                    onChange={(e) => handleUpdateTestCase(idx, { isHidden: e.target.checked })}
                                                                    className="rounded text-purple-600 focus:ring-0 cursor-pointer"
                                                                />
                                                                <span>Test ẩn (Ẩn input/output với học viên)</span>
                                                            </label>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteTestCase(idx)}
                                                                className="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer flex items-center gap-0.5"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                                <span>Xóa</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                                        <div>
                                                            <span className="block text-[11px] font-bold text-slate-500 mb-1">
                                                                Đầu vào (Input / Stdin):
                                                            </span>
                                                            <textarea
                                                                value={tc.input}
                                                                onChange={(e) => handleUpdateTestCase(idx, { input: e.target.value })}
                                                                rows={2}
                                                                placeholder="<Không có input nếu bài không cần input>"
                                                                className="w-full p-2 text-xs font-mono rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12131a] text-slate-800 dark:text-white focus:outline-none focus:border-purple-500"
                                                            />
                                                        </div>

                                                        <div>
                                                            <span className="block text-[11px] font-bold text-slate-500 mb-1">
                                                                Kết quả mong đợi (Expected Output):
                                                            </span>
                                                            <textarea
                                                                value={tc.expectedOutput}
                                                                onChange={(e) => handleUpdateTestCase(idx, { expectedOutput: e.target.value })}
                                                                rows={2}
                                                                placeholder="Kết quả in ra màn hình..."
                                                                className="w-full p-2 text-xs font-mono rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12131a] text-slate-800 dark:text-white focus:outline-none focus:border-purple-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-400 space-y-3">
                                    <Laptop className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                    <span className="text-xs font-semibold">Chọn một bài tập từ danh sách bên trái hoặc tạo bài tập mới để chỉnh sửa</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 4. TAB CONTENT 3: TRẮC NGHIỆM (QUIZZES) */}
                {activeTab === 'quizzes' && (
                    <div className="flex-1 overflow-y-auto p-5 w-full space-y-3.5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                            <div>
                                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Câu hỏi trắc nghiệm</h2>
                                <span className="text-xs text-slate-400">{quizzes.length} câu hỏi thuộc bài học này</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditingQuiz({
                                        id: '',
                                        lessonId: lesson.id,
                                        question: 'Cho bảng dữ liệu `hr.Employees` và câu lệnh truy vấn dưới đây:\n\n| EMPLOYEEID | FULLNAME | AGE | DEPARTMENT |\n| :--- | :--- | :--- | :--- |\n| 1 | Nguyễn Văn A | 22 | IT |\n| 2 | Trần Thị B | 25 | Sales |\n| 3 | Lê Văn C | 35 | Sales |\n| 4 | Phạm Minh D | 28 | HR |\n\n```sql\nSELECT *\nFROM hr.Employees\nWHERE Age > 30\n  AND Department = \'Sales\'\n  OR Department = \'IT\';\n```\n\nTheo thứ tự ưu tiên toán tử logic trong SQL, nhân viên nào sau đây **chắc chắn sẽ xuất hiện** trong kết quả truy vấn?',
                                        explanation: 'Toán tử AND có độ ưu tiên cao hơn OR. Do đó điều kiện (Age > 30 AND Department = \'Sales\') sẽ được thực hiện trước, sau đó mới OR với (Department = \'IT\'). Vì vậy nhân viên 22 tuổi phòng IT luôn thỏa mãn điều kiện OR.',
                                        level: 'EASY',
                                        orderIndex: quizzes.length + 1,
                                        options: [
                                            { key: 'A', text: 'Một nhân viên 22 tuổi thuộc phòng IT.', isCorrect: true },
                                            { key: 'B', text: 'Một nhân viên 25 tuổi thuộc phòng Sales.', isCorrect: false },
                                            { key: 'C', text: 'Một nhân viên 28 tuổi thuộc phòng HR.', isCorrect: false },
                                            { key: 'D', text: 'Không có nhân viên nào dưới 30 tuổi được chọn.', isCorrect: false }
                                        ]
                                    });
                                    setQuizModalTab('edit');
                                    setIsQuizModalOpen(true);
                                }}
                                className="px-3.5 py-1.5 rounded-[4px] bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Thêm câu hỏi</span>
                            </button>
                        </div>

                        {quizzes.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 text-xs font-medium bg-white dark:bg-bg-secondary rounded-[5px] border border-slate-200 dark:border-white/10">
                                Bài học này chưa có câu hỏi trắc nghiệm nào. Hãy bấm "+ Thêm câu hỏi" để tạo.
                            </div>
                        ) : (
                            quizzes.map((q, idx) => (
                                <div
                                    key={q.id}
                                    className={`p-4 rounded-[5px] border shadow-xs space-y-3 ${
                                        isDarkTheme ? 'bg-[#121217] border-white/10' : 'bg-white border-slate-200'
                                    }`}
                                >
                                    {/* Question Card Header */}
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 mr-2">
                                                Câu {q.orderIndex || idx + 1}:
                                            </span>
                                            {/* Rich Render Question with Markdown & Tables */}
                                            <div className="mt-1">
                                                <LiveMarkdownViewer
                                                    content={q.question}
                                                    isDarkTheme={isDarkTheme}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingQuiz(q);
                                                    setQuizModalTab('edit');
                                                    setIsQuizModalOpen(true);
                                                }}
                                                className="text-xs font-semibold px-2.5 py-1 rounded-[4px] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-1"
                                            >
                                                <Edit3 className="w-3 h-3" />
                                                <span>Sửa</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteQuiz(q.id)}
                                                className="text-xs font-semibold px-2.5 py-1 rounded-[4px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                <span>Xóa</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Options Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {q.options?.map((opt) => (
                                            <div
                                                key={opt.key}
                                                className={`p-2.5 rounded-[4px] border text-xs flex items-center gap-2 ${
                                                    opt.isCorrect
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 font-bold'
                                                        : 'bg-slate-50/70 dark:bg-bg-tertiary border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                                                }`}
                                            >
                                                <span className={`w-5 h-5 rounded-[3px] flex items-center justify-center border font-bold text-[11px] ${
                                                    opt.isCorrect
                                                        ? 'bg-emerald-600 text-white border-emerald-700'
                                                        : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-300'
                                                }`}>
                                                    {opt.key}
                                                </span>
                                                <span className="flex-1">{opt.text}</span>
                                                {opt.isCorrect && (
                                                    <span className="text-[10px] uppercase font-bold text-emerald-600 flex items-center gap-0.5">
                                                        <Check className="w-3 h-3" />
                                                        <span>Đáp án đúng</span>
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {q.explanation && (
                                        <div className="p-2.5 bg-slate-50 dark:bg-bg-tertiary rounded-[4px] border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">Giải thích: </span>
                                                {q.explanation}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* MODAL EDIT & LIVE PREVIEW QUIZ */}
                {isQuizModalOpen && editingQuiz && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100000] flex items-center justify-center p-4">
                        <div className={`w-full max-w-3xl rounded-[5px] border p-5 shadow-2xl space-y-3.5 max-h-[90vh] flex flex-col overflow-hidden ${
                            isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}>
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                                <h3 className="text-sm font-bold">
                                    {editingQuiz.id ? 'Chỉnh sửa câu hỏi trắc nghiệm' : 'Thêm câu hỏi trắc nghiệm mới'}
                                </h3>

                                {/* Tab Toggle in Modal */}
                                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-0.5 rounded-[4px] border border-slate-200 dark:border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setQuizModalTab('edit')}
                                        className={`px-3 py-1 text-xs font-bold rounded-[3px] transition-all cursor-pointer flex items-center gap-1.5 ${
                                            quizModalTab === 'edit'
                                                ? 'bg-purple-600 text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        <PenLine className="w-3.5 h-3.5" />
                                        <span>Soạn câu hỏi &amp; Đáp án</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setQuizModalTab('preview')}
                                        className={`px-3 py-1 text-xs font-bold rounded-[3px] transition-all cursor-pointer flex items-center gap-1.5 ${
                                            quizModalTab === 'preview'
                                                ? 'bg-purple-600 text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Xem trước giao diện học viên</span>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto pr-1">
                                {quizModalTab === 'edit' ? (
                                    <form id="quiz-edit-form" onSubmit={handleSaveQuiz} className="space-y-3.5 text-xs">
                                        <div>
                                            <label className="block font-bold mb-1">
                                                Nội dung câu hỏi (Hỗ trợ Bảng dữ liệu Markdown, Khối code SQL, In đậm...)
                                            </label>

                                            {/* Quick Insert Toolbar */}
                                            <QuickInsertToolbar
                                                isDarkTheme={isDarkTheme}
                                                onInsert={(txt) => {
                                                    setEditingQuiz({
                                                        ...editingQuiz,
                                                        question: (editingQuiz.question || '') + txt
                                                    });
                                                }}
                                            />

                                            <textarea
                                                value={editingQuiz.question}
                                                onChange={(e) => setEditingQuiz({ ...editingQuiz, question: e.target.value })}
                                                required
                                                rows={5}
                                                placeholder="Nhập câu hỏi, chèn bảng Markdown hoặc code SQL..."
                                                className="w-full p-2.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block font-bold">
                                                Các lựa chọn đáp án (Tích chọn 1 đáp án đúng):
                                            </label>
                                            {editingQuiz.options?.map((opt, idx) => (
                                                <div key={opt.key} className="flex items-center gap-2">
                                                    <span className="w-6 font-bold text-center">{opt.key}.</span>
                                                    <input
                                                        type="text"
                                                        value={opt.text}
                                                        onChange={(e) => {
                                                            const newOpts = [...editingQuiz.options];
                                                            newOpts[idx].text = e.target.value;
                                                            setEditingQuiz({ ...editingQuiz, options: newOpts });
                                                        }}
                                                        required
                                                        placeholder={`Nội dung đáp án ${opt.key}...`}
                                                        className="flex-1 px-2.5 py-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary"
                                                    />
                                                    <label className="flex items-center gap-1 cursor-pointer font-bold">
                                                        <input
                                                            type="radio"
                                                            name="correctOption"
                                                            checked={opt.isCorrect}
                                                            onChange={() => {
                                                                const newOpts = editingQuiz.options.map((o, i) => ({
                                                                    ...o,
                                                                    isCorrect: i === idx
                                                                }));
                                                                setEditingQuiz({ ...editingQuiz, options: newOpts });
                                                            }}
                                                            className="text-purple-600 focus:ring-0 cursor-pointer"
                                                        />
                                                        <span className={opt.isCorrect ? 'text-emerald-600' : ''}>Đúng</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <label className="block font-bold mb-1">Giải thích chi tiết đáp án đúng</label>
                                            <textarea
                                                value={editingQuiz.explanation}
                                                onChange={(e) => setEditingQuiz({ ...editingQuiz, explanation: e.target.value })}
                                                rows={2}
                                                placeholder="Giải thích vì sao đáp án này đúng để hỗ trợ học viên khi làm bài..."
                                                className="w-full p-2.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary font-sans focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    </form>
                                ) : (
                                    /* LIVE STUDENT SIMULATION PREVIEW */
                                    <div className="space-y-4 p-4 rounded-[5px] border border-purple-200 dark:border-purple-900/50 bg-purple-50/20 dark:bg-purple-950/10">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Mô phỏng màn hình học sinh làm bài:</span>
                                        </div>

                                        {/* Question Content */}
                                        <div className="bg-white dark:bg-[#121217] p-4 rounded-[5px] border border-slate-200 dark:border-white/10 shadow-xs">
                                            <LiveMarkdownViewer
                                                content={editingQuiz.question}
                                                isDarkTheme={isDarkTheme}
                                            />
                                        </div>

                                        {/* Simulated Options */}
                                        <div className="space-y-2">
                                            {editingQuiz.options?.map((opt) => (
                                                <div
                                                    key={opt.key}
                                                    className={`p-3 rounded-[5px] border text-xs flex items-center gap-3 transition-all ${
                                                        opt.isCorrect
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                                                            : 'bg-white dark:bg-[#121217] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                                                    }`}
                                                >
                                                    <span className={`w-6 h-6 rounded-[4px] flex items-center justify-center font-bold text-xs ${
                                                        opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                                                    }`}>
                                                        {opt.key}
                                                    </span>
                                                    <span className="flex-1">{opt.text || `(Đáp án ${opt.key})`}</span>
                                                    {opt.isCorrect && (
                                                        <span className="text-[10px] uppercase font-bold text-emerald-600 flex items-center gap-0.5">
                                                            <Check className="w-3 h-3" />
                                                            <span>Đáp án chính xác</span>
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {editingQuiz.explanation && (
                                            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-[5px] text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-1.5">
                                                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-bold">Giải thích: </span>
                                                    {editingQuiz.explanation}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsQuizModalOpen(false)}
                                    className="px-3.5 py-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 hover:bg-slate-50 cursor-pointer text-xs font-semibold"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    form="quiz-edit-form"
                                    onClick={() => {
                                        if (quizModalTab === 'preview') {
                                            setQuizModalTab('edit');
                                        }
                                    }}
                                    className="px-4 py-1.5 rounded-[4px] bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Lưu câu hỏi trắc nghiệm</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DragDropContext>,
        document.body
    );
};
