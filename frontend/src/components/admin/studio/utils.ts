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
        case 'sql_output':
            return {
                id,
                type: 'sql_output',
                title: 'Kết quả SQL',
                tableHeaders: ['id', 'student_name', 'score'],
                tableRows: [
                    ['101', 'Nguyễn Văn A', '9.5'],
                    ['102', 'Trần Thị B', '8.0']
                ],
                tableNote: 'Truy vấn trả về 2 dòng dữ liệu.',
                content: ''
            };
        case 'iframe':
            return {
                id,
                type: 'iframe',
                title: 'Iframe nhúng',
                content: '<iframe src="https://example.com" width="100%" height="300"></iframe>'
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

// Check if a line is a markdown table separator (e.g. | --- | :---: | --- |)
const isTableSeparator = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return false;
    const inner = trimmed.substring(1, trimmed.length - 1);
    const cols = inner.split('|').map(c => c.trim());
    return cols.length > 0 && cols.every(c => /^:?-+:?$/.test(c));
};

// Parse a single markdown table row line (| a | b | c |)
const parseTableRow = (line: string): string[] => {
    let trimmed = line.trim();
    if (trimmed.startsWith('|')) trimmed = trimmed.substring(1);
    if (trimmed.endsWith('|')) trimmed = trimmed.substring(0, trimmed.length - 1);
    return trimmed.split('|').map(cell => cell.trim());
};

// Convert Markdown string to initial structured blocks (with full table & callout support)
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
    let blockCounter = 1;

    const flushCurrentText = () => {
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
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // 1. CODE BLOCK (```lang ... ```)
        if (trimmedLine.startsWith('```')) {
            flushCurrentText();
            const codeLang = trimmedLine.replace('```', '').trim() || 'Python';
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
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
            continue;
        }

        // 2. EXERCISE WITH <details><summary>Xem đáp án</summary>
        if (trimmedLine.includes('<details>') && (trimmedLine.includes('Xem đáp án') || cleanMarkdown.substring(i).includes('Xem đáp án'))) {
            flushCurrentText();
            const exerciseLines: string[] = [];
            let solutionCode = '';
            let inSolutionCode = false;

            while (i < lines.length && !lines[i].includes('</details>')) {
                const cur = lines[i];
                if (cur.trim().startsWith('```')) {
                    inSolutionCode = !inSolutionCode;
                } else if (inSolutionCode) {
                    solutionCode += (solutionCode ? '\n' : '') + cur;
                } else if (!cur.includes('<details>') && !cur.includes('<summary>') && !cur.includes('</summary>')) {
                    exerciseLines.push(cur);
                }
                i++;
            }

            blocks.push({
                id: `b-${blockCounter++}`,
                type: 'exercise',
                title: 'Bài tập vận dụng',
                content: exerciseLines.join('\n').trim(),
                solutionCode: solutionCode.trim() || '# Lời giải mẫu',
                isSolutionVisible: false
            });
            continue;
        }

        // 3. MARKDOWN TABLE (| col1 | col2 |)
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
            flushCurrentText();
            const headers = parseTableRow(trimmedLine);
            i++; // skip separator line (| --- | --- |)

            const rows: string[][] = [];
            while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|') && lines[i + 1].trim().endsWith('|')) {
                i++;
                rows.push(parseTableRow(lines[i]));
            }

            // Check if immediate next line is a table note (*Kết quả trả về...*)
            let tableNote = '';
            if (i + 1 < lines.length && lines[i + 1].trim().startsWith('*') && lines[i + 1].trim().endsWith('*') && !lines[i + 1].trim().startsWith('**')) {
                i++;
                tableNote = lines[i].trim().replace(/^\*|\*$/g, '').trim();
            }

            blocks.push({
                id: `b-${blockCounter++}`,
                type: 'output',
                title: 'Kết quả (Output)',
                tableHeaders: headers,
                tableRows: rows.length > 0 ? rows : [['', '']],
                tableNote: tableNote || undefined,
                content: ''
            });
            continue;
        }

        // 4. CALLOUT / EXPLANATION (> [!NOTE] or > ...)
        if (trimmedLine.startsWith('>')) {
            flushCurrentText();
            const calloutLines: string[] = [];
            let calloutTitle = 'Giải thích';
            let calloutType: 'info' | 'tip' | 'warning' | 'explanation' = 'explanation';

            while (i < lines.length && (lines[i].trim().startsWith('>') || (lines[i].trim() === '' && i + 1 < lines.length && lines[i + 1].trim().startsWith('>')))) {
                if (lines[i].trim() === '') {
                    i++;
                    continue;
                }
                let rawText = lines[i].trim().replace(/^>\s*/, '');
                if (rawText.startsWith('[!NOTE]') || rawText.startsWith('[!TIP]') || rawText.startsWith('[!WARNING]')) {
                    if (rawText.startsWith('[!TIP]')) calloutType = 'tip';
                    if (rawText.startsWith('[!WARNING]')) calloutType = 'warning';
                } else if (rawText.startsWith('**') && rawText.includes('**', 2) && calloutLines.length === 0) {
                    const match = rawText.match(/^\*\*([^*]+)\*\*(.*)/);
                    if (match) {
                        calloutTitle = match[1].trim();
                        if (match[2].trim()) calloutLines.push(match[2].trim());
                    } else {
                        calloutLines.push(rawText);
                    }
                } else {
                    calloutLines.push(rawText);
                }
                i++;
            }
            i--; // step back since outer loop does i++

            blocks.push({
                id: `b-${blockCounter++}`,
                type: 'explanation',
                title: calloutTitle,
                calloutType: calloutType,
                content: calloutLines.join('\n').trim()
            });
            continue;
        }

        // 5. HEADINGS (# , ## , ### )
        if (trimmedLine.startsWith('# ') || trimmedLine.startsWith('## ') || trimmedLine.startsWith('### ')) {
            flushCurrentText();
            const level: 'H1' | 'H2' | 'H3' = trimmedLine.startsWith('### ') ? 'H3' : trimmedLine.startsWith('## ') ? 'H2' : 'H1';
            const headingTitle = trimmedLine.replace(/^#{1,3}\s+/, '').trim();
            blocks.push({
                id: `b-${blockCounter++}`,
                type: 'heading',
                headingLevel: level,
                title: headingTitle,
                content: ''
            });
            continue;
        }

        // 6. DIVIDER (---, ***, ___)
        if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
            flushCurrentText();
            blocks.push({
                id: `b-${blockCounter++}`,
                type: 'divider',
                content: '---'
            });
            continue;
        }

        // 7. DEFAULT PARAGRAPH ACCUMULATION
        currentText.push(line);
    }

    flushCurrentText();

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
                return `${prefix}${b.title || ''}${b.content ? `\n\n${b.content}` : ''}`.trim();
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
                return `> [!NOTE]\n> **${b.title || 'Giải thích'}**\n> ${b.content.replace(/\n/g, '\n> ')}`;
            case 'table':
            case 'output':
            case 'sql_output': {
                if (b.tableHeaders && b.tableHeaders.length > 0) {
                    const headerLine = `| ${b.tableHeaders.join(' | ')} |`;
                    const separatorLine = `| ${b.tableHeaders.map(() => '---').join(' | ')} |`;
                    const rowsLines = (b.tableRows && b.tableRows.length > 0)
                        ? b.tableRows.map(r => `| ${r.join(' | ')} |`).join('\n')
                        : `| ${b.tableHeaders.map(() => '').join(' | ')} |`;
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
