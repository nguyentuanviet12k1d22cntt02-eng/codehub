import type { BlockType, LessonBlock } from './types';

// Helper to create default block by type
export const createDefaultBlock = (type: BlockType, id: string): LessonBlock => {
    switch (type) {
        case 'heading':
            return {
                id,
                type: 'heading',
                headingLevel: 'H2',
                title: '1. Tiêu đề mục bài học',
                content: 'Nhập nội dung giải thích chi tiết cho mục này...'
            };
        case 'paragraph':
            return {
                id,
                type: 'paragraph',
                content: 'Nhập nội dung đoạn văn lý thuyết tại đây...'
            };
        case 'list':
            return {
                id,
                type: 'list',
                content: '• Mục danh sách thứ nhất\n• Mục danh sách thứ hai\n• Mục danh sách thứ ba'
            };
        case 'code':
            return {
                id,
                type: 'code',
                language: 'Python',
                showLineNumbers: true,
                allowCopy: true,
                theme: 'Dark',
                fontSize: '14px',
                content: '# Viết code minh họa tại đây\nprint("Hello, World!")'
            };
        case 'output':
        case 'table':
            return {
                id,
                type: 'output',
                title: 'Kết quả (Output)',
                tableHeaders: ['id', 'name', 'age'],
                tableRows: [
                    ['1', 'An', '20'],
                    ['2', 'Bình', '21']
                ],
                tableNote: 'Kết quả trả về 2 dòng.',
                content: ''
            };
        case 'explanation':
            return {
                id,
                type: 'explanation',
                title: 'Giải thích',
                calloutType: 'explanation',
                content: '• Ý 1: Điểm cốt lõi\n• Ý 2: Cú pháp cần nhớ\n• Ý 3: Mẹo thực hành'
            };
        case 'callout':
            return {
                id,
                type: 'callout',
                title: 'Lưu ý quan trọng',
                calloutType: 'warning',
                content: 'Đây là thông tin quan trọng cần chú ý khi thực hành.'
            };
        case 'note':
            return {
                id,
                type: 'note',
                title: 'Ghi chú thêm',
                calloutType: 'info',
                content: 'Ghi chú bổ sung kiến thức mở rộng.'
            };
        case 'exercise':
            return {
                id,
                type: 'exercise',
                title: 'Bài tập vận dụng',
                content: 'Mô tả yêu cầu bài tập cho học viên thực hành...',
                solutionCode: '# Lời giải mẫu\nprint("Xong")',
                isSolutionVisible: false
            };
        case 'quiz':
            return {
                id,
                type: 'quiz',
                title: 'Câu hỏi trắc nghiệm',
                content: 'Đâu là kiểu dữ liệu số nguyên trong Python?\nA. int\nB. float\nC. str\nD. bool'
            };
        case 'theory':
            return {
                id,
                type: 'theory',
                title: 'Khái niệm lý thuyết',
                content: 'Phân tích lý thuyết và nguyên lý hoạt động chi tiết...'
            };
        case 'erd':
            return {
                id,
                type: 'erd',
                title: 'Sơ đồ quan hệ thực thể (ERD)',
                content: 'Mô tả quan hệ 1-N giữa bảng Students và Orders.'
            };
        case 'image':
            return {
                id,
                type: 'image',
                title: 'Hình ảnh minh họa',
                content: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'
            };
        case 'video':
            return {
                id,
                type: 'video',
                title: 'Video bài giảng',
                content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            };
        case 'divider':
            return {
                id,
                type: 'divider',
                content: '---'
            };
        default:
            return {
                id,
                type,
                content: 'Nội dung khối mới...'
            };
    }
};

// Convert Markdown string to initial structured blocks
export const parseMarkdownToBlocks = (markdown: string, lessonTitle: string): LessonBlock[] => {
    let cleanMarkdown = (markdown || '').trim();

    // Strip YAML frontmatter if present (e.g. --- \n lessonId: ... \n title: ... \n ---)
    if (cleanMarkdown.startsWith('---')) {
        const endIdx = cleanMarkdown.indexOf('---', 3);
        if (endIdx !== -1) {
            cleanMarkdown = cleanMarkdown.substring(endIdx + 3).trim();
        }
    }

    if (!cleanMarkdown) {
        return [
            {
                id: 'b-1',
                type: 'heading',
                headingLevel: 'H2',
                title: lessonTitle || '1. Giới thiệu bài học',
                content: 'Nhập nội dung giới thiệu bài học tại đây...'
            },
            {
                id: 'b-2',
                type: 'code',
                language: 'Python',
                showLineNumbers: true,
                allowCopy: true,
                theme: 'Dark',
                fontSize: '14px',
                content: '# Viết code minh họa tại đây\nprint("Hello, World!")'
            }
        ];
    }

    const blocks: LessonBlock[] = [];
    const lines = cleanMarkdown.split('\n');
    let currentText: string[] = [];
    let inCode = false;
    let codeLang = 'Python';
    let codeLines: string[] = [];

    let blockCounter = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('```')) {
            if (!inCode) {
                if (currentText.length > 0) {
                    const textJoined = currentText.join('\n').trim();
                    if (textJoined) {
                        blocks.push({
                            id: `b-${blockCounter++}`,
                            type: 'paragraph',
                            content: textJoined
                        });
                    }
                    currentText = [];
                }
                inCode = true;
                codeLang = line.replace('```', '').trim() || 'Python';
                codeLines = [];
            } else {
                inCode = false;
                blocks.push({
                    id: `b-${blockCounter++}`,
                    type: 'code',
                    language: codeLang.toUpperCase() === 'SQL' ? 'SQL' : 'Python',
                    showLineNumbers: true,
                    allowCopy: true,
                    theme: 'Dark',
                    fontSize: '14px',
                    content: codeLines.join('\n')
                });
                codeLines = [];
            }
            continue;
        }

        if (inCode) {
            codeLines.push(line);
            continue;
        }

        if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
            if (currentText.length > 0) {
                const textJoined = currentText.join('\n').trim();
                if (textJoined) {
                    blocks.push({
                        id: `b-${blockCounter++}`,
                        type: 'paragraph',
                        content: textJoined
                    });
                }
                currentText = [];
            }

            const level: 'H1' | 'H2' | 'H3' = line.startsWith('### ') ? 'H3' : line.startsWith('## ') ? 'H2' : 'H1';
            const title = line.replace(/^#{1,3}\s+/, '').trim();
            blocks.push({
                id: `b-${blockCounter++}`,
                type: 'heading',
                headingLevel: level,
                title: title,
                content: ''
            });
            continue;
        }

        currentText.push(line);
    }

    if (currentText.length > 0) {
        const textJoined = currentText.join('\n').trim();
        if (textJoined) {
            blocks.push({
                id: `b-${blockCounter++}`,
                type: 'paragraph',
                content: textJoined
            });
        }
    }

    return blocks.length > 0 ? blocks : [
        {
            id: 'b-init',
            type: 'paragraph',
            content: cleanMarkdown
        }
    ];
};

// Convert blocks back to structured Markdown for saving
export const convertBlocksToMarkdown = (blocks: LessonBlock[]): string => {
    return blocks.map(b => {
        switch (b.type) {
            case 'heading': {
                const prefix = b.headingLevel === 'H1' ? '# ' : b.headingLevel === 'H3' ? '### ' : '## ';
                return `${prefix}${b.title || ''}\n\n${b.content || ''}`.trim();
            }
            case 'paragraph':
            case 'theory':
                return b.content;
            case 'list':
                return b.content;
            case 'code':
                return `\`\`\`${(b.language || 'python').toLowerCase()}\n${b.content}\n\`\`\``;
            case 'callout':
            case 'explanation':
            case 'note':
                return `> [!NOTE]\n> **${b.title || 'Lưu ý'}**\n> ${b.content.replace(/\n/g, '\n> ')}`;
            case 'table':
            case 'output': {
                if (b.tableHeaders && b.tableRows) {
                    const headerLine = `| ${b.tableHeaders.join(' | ')} |`;
                    const separatorLine = `| ${b.tableHeaders.map(() => '---').join(' | ')} |`;
                    const rowsLines = b.tableRows.map(r => `| ${r.join(' | ')} |`).join('\n');
                    const noteText = b.tableNote ? `\n\n*${b.tableNote}*` : '';
                    return `${headerLine}\n${separatorLine}\n${rowsLines}${noteText}`;
                }
                return b.content;
            }
            case 'exercise':
                return `### ${b.title || 'Bài tập vận dụng'}\n${b.content}${b.solutionCode ? `\n\n<details><summary>Xem đáp án</summary>\n\n\`\`\`python\n${b.solutionCode}\n\`\`\`\n</details>` : ''}`;
            case 'divider':
                return `---`;
            default:
                return b.content;
        }
    }).join('\n\n');
};
