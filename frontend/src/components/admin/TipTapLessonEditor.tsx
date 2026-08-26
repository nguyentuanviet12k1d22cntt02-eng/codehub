import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Highlight } from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extension-placeholder';

interface TipTapLessonEditorProps {
    content: string;
    onChange: (htmlContent: string) => void;
}

export const TipTapLessonEditor: React.FC<TipTapLessonEditorProps> = ({ content, onChange }) => {
    const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
    const [rawText, setRawText] = useState(content);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Use customized codeBlock
            }),
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-[#121216] text-[#e2e8f0] p-4 rounded-xl font-mono text-xs border border-white/10 my-3 block overflow-x-auto whitespace-pre',
                },
            }),
            Highlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    class: 'bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded border border-purple-500/30',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full my-4 border border-border-custom rounded-lg overflow-hidden text-xs',
                },
            }),
            TableRow.configure({
                HTMLAttributes: {
                    class: 'border-b border-border-custom hover:bg-bg-tertiary/40 transition-colors',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'bg-bg-tertiary font-bold text-text-primary p-2.5 text-left border-r border-border-custom last:border-r-0',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'p-2.5 text-text-secondary border-r border-border-custom last:border-r-0',
                },
            }),
            Placeholder.configure({
                placeholder: 'Nhập nội dung bài học hoặc chèn bảng dữ liệu, code mẫu tại đây...',
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setRawText(html);
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[350px] p-4 text-sm leading-relaxed text-text-primary',
            },
        },
    });

    // Update editor when external content changes
    useEffect(() => {
        if (editor && content !== editor.getHTML() && viewMode === 'visual') {
            editor.commands.setContent(content || '', { emitUpdate: false });
            setRawText(content || '');
        }
    }, [content, editor, viewMode]);

    if (!editor) {
        return <div className="p-4 text-xs text-text-secondary">Đang tải trình soạn thảo TipTap...</div>;
    }

    const handleRawTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setRawText(val);
        onChange(val);
        if (editor) {
            editor.commands.setContent(val, { emitUpdate: false });
        }
    };

    return (
        <div className="border border-border-custom rounded-xl overflow-hidden bg-bg-tertiary/20 flex flex-col">
            {/* Top Toolbar */}
            <div className="bg-bg-secondary p-2 border-b border-border-custom flex flex-wrap items-center justify-between gap-2 select-none">
                {/* Formatting Tools */}
                <div className="flex flex-wrap items-center gap-1">
                    {/* Headings */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                            editor.isActive('heading', { level: 1 })
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="Tiêu đề chính H1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                            editor.isActive('heading', { level: 2 })
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="Tiêu đề phụ H2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                            editor.isActive('heading', { level: 3 })
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="Tiêu đề nhỏ H3"
                    >
                        H3
                    </button>

                    <div className="h-4 w-[1px] bg-border-custom mx-1" />

                    {/* Text Styles */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                            editor.isActive('bold')
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="In đậm (Bold)"
                    >
                        B
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`px-2.5 py-1 text-xs italic font-serif rounded transition-colors ${
                            editor.isActive('italic')
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="In nghiêng (Italic)"
                    >
                        I
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                            editor.isActive('highlight')
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="Tô sáng (Highlight)"
                    >
                        Highlight
                    </button>

                    <div className="h-4 w-[1px] bg-border-custom mx-1" />

                    {/* Code & Callout */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`px-2.5 py-1 text-xs font-mono font-bold rounded transition-colors ${
                            editor.isActive('codeBlock')
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="Khung Code mẫu"
                    >
                        Code
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                            editor.isActive('blockquote')
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="Khung ghi chú / Lưu ý"
                    >
                        Ghi Chú
                    </button>

                    <div className="h-4 w-[1px] bg-border-custom mx-1" />

                    {/* Lists */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                            editor.isActive('bulletList')
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="Danh sách gạch đầu dòng"
                    >
                        Danh sách
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                            editor.isActive('orderedList')
                                ? 'bg-accent-custom text-white'
                                : 'bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary'
                        }`}
                        title="Danh sách số thứ tự"
                    >
                        1. 2. 3.
                    </button>

                    <div className="h-4 w-[1px] bg-border-custom mx-1" />

                    {/* SQL & Table Controls */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 transition-colors"
                        title="Chèn bảng mới (3x3)"
                    >
                        Chèn Bảng SQL
                    </button>

                    {editor.isActive('table') && (
                        <div className="flex items-center gap-1 bg-bg-primary p-1 rounded-lg border border-border-custom">
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().addRowAfter().run()}
                                className="px-2 py-0.5 text-[11px] rounded bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                title="Thêm dòng"
                            >
                                + Dòng
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().deleteRow().run()}
                                className="px-2 py-0.5 text-[11px] rounded bg-bg-tertiary text-rose-400 hover:bg-rose-500/20"
                                title="Xóa dòng"
                            >
                                - Dòng
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().addColumnAfter().run()}
                                className="px-2 py-0.5 text-[11px] rounded bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                title="Thêm cột"
                            >
                                + Cột
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().deleteColumn().run()}
                                className="px-2 py-0.5 text-[11px] rounded bg-bg-tertiary text-rose-400 hover:bg-rose-500/20"
                                title="Xóa cột"
                            >
                                - Cột
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().deleteTable().run()}
                                className="px-2 py-0.5 text-[11px] rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold"
                                title="Xóa toàn bộ bảng"
                            >
                                Xóa Bảng
                            </button>
                        </div>
                    )}
                </div>

                {/* View Mode Toggle (Visual vs Raw HTML/Markdown) */}
                <div className="flex items-center gap-1 bg-bg-primary p-1 rounded-lg border border-border-custom">
                    <button
                        type="button"
                        onClick={() => setViewMode('visual')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                            viewMode === 'visual'
                                ? 'bg-accent-custom text-white'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        Trực Quan (TipTap)
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('raw')}
                        className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                            viewMode === 'raw'
                                ? 'bg-accent-custom text-white'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        Mã Nguồn (HTML/MD)
                    </button>
                </div>
            </div>

            {/* Editor Body */}
            {viewMode === 'visual' ? (
                <div className="bg-bg-primary min-h-[380px] max-h-[550px] overflow-y-auto cursor-text">
                    <EditorContent editor={editor} />
                </div>
            ) : (
                <div className="p-3 bg-[#0a0a0d]">
                    <textarea
                        rows={16}
                        value={rawText}
                        onChange={handleRawTextChange}
                        className="w-full bg-transparent font-mono text-xs text-text-primary focus:outline-none p-2"
                        placeholder="Chỉnh sửa mã nguồn HTML hoặc Markdown..."
                    />
                </div>
            )}
        </div>
    );
};
