import React, { useRef, useEffect } from 'react';

interface RichTextEditableProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
    isDarkTheme?: boolean;
    autoFocus?: boolean;
}

// Convert markdown symbols into clean visual HTML for WYSIWYG
export const markdownToHtml = (md: string = ''): string => {
    if (!md) return '';
    let text = md;

    // 1. Bold & Strikethrough & Code
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
    text = text.replace(/`([^`]+)`/g, '<code style="background-color: rgba(147, 51, 234, 0.1); color: #7e22ce; padding: 2px 5px; border-radius: 4px; font-family: monospace;">$1</code>');

    // 2. Line by line processing for Lists
    const lines = text.split('\n');
    const result: string[] = [];
    let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = () => {
        if (!currentList) return;
        const tag = currentList.type;
        const listClass = tag === 'ul' ? 'list-disc pl-5 my-1 space-y-1' : 'list-decimal pl-5 my-1 space-y-1';
        const lis = currentList.items.map(item => `<li>${item}</li>`).join('');
        result.push(`<${tag} class="${listClass}">${lis}</${tag}>`);
        currentList = null;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        const bulletMatch = /^(\*|\-|\+|•)\s+(.*)$/.exec(trimmed);
        const orderMatch = /^(\d+)\.\s+(.*)$/.exec(trimmed);

        if (bulletMatch) {
            if (currentList && currentList.type !== 'ul') flushList();
            if (!currentList) currentList = { type: 'ul', items: [] };
            let itemContent = bulletMatch[2].replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '<em>$1</em>');
            currentList.items.push(itemContent);
        } else if (orderMatch) {
            if (currentList && currentList.type !== 'ol') flushList();
            if (!currentList) currentList = { type: 'ol', items: [] };
            let itemContent = orderMatch[2].replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '<em>$1</em>');
            currentList.items.push(itemContent);
        } else {
            flushList();
            if (trimmed === '') {
                // Ignore empty lines between list items or add paragraph spacing
                continue;
            }
            let lineContent = line.replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '<em>$1</em>');
            result.push(lineContent);
        }
    }
    flushList();

    return result.join('<br/>');
};

// Convert innerHTML back to clean Markdown with accurate DOM traversal
export const htmlToMarkdown = (html: string = ''): string => {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const serializeNode = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || '';
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        // Handle Lists with clean single lines and no empty items
        if (tagName === 'ul') {
            const lis = Array.from(el.children).filter(c => c.tagName.toLowerCase() === 'li');
            return lis.map(li => `* ${Array.from(li.childNodes).map(serializeNode).join('').trim()}`).join('\n') + '\n';
        }
        if (tagName === 'ol') {
            const lis = Array.from(el.children).filter(c => c.tagName.toLowerCase() === 'li');
            return lis.map((li, idx) => `${idx + 1}. ${Array.from(li.childNodes).map(serializeNode).join('').trim()}`).join('\n') + '\n';
        }
        if (tagName === 'li') {
            return `* ${Array.from(el.childNodes).map(serializeNode).join('').trim()}\n`;
        }

        const inner = Array.from(el.childNodes).map(serializeNode).join('');

        if (tagName === 'strong' || tagName === 'b') return `**${inner}**`;
        if (tagName === 'em' || tagName === 'i') return `*${inner}*`;
        if (tagName === 'del' || tagName === 's') return `~~${inner}~~`;
        if (tagName === 'code') return `\`${inner}\``;
        if (tagName === 'br') return '\n';

        // Alignment check
        const align = el.getAttribute('align') || el.style.textAlign;
        if (align === 'center') return `<div align="center">${inner.trim()}</div>`;
        if (align === 'right') return `<div align="right">${inner.trim()}</div>`;
        if (align === 'left' || align === 'justify') return inner.trim();

        if (tagName === 'p') return `${inner}\n\n`;
        if (tagName === 'div') return inner ? `${inner}\n` : '';

        return inner;
    };

    let md = Array.from(tempDiv.childNodes).map(serializeNode).join('').trim();
    // Normalize excessive newlines (keep at most 2 newlines)
    md = md.replace(/\n{3,}/g, '\n\n');
    return md;
};

export const RichTextEditable: React.FC<RichTextEditableProps> = ({
    value,
    onChange,
    placeholder = 'Nhập nội dung...',
    className = '',
    isDarkTheme = false
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalUpdate = useRef(false);

    // Sync external value to innerHTML when value changes externally
    useEffect(() => {
        if (!editorRef.current) return;
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }
        const initialHtml = markdownToHtml(value);
        if (editorRef.current.innerHTML !== initialHtml) {
            editorRef.current.innerHTML = initialHtml;
        }
    }, [value]);

    const handleInput = () => {
        if (!editorRef.current) return;
        isInternalUpdate.current = true;
        const currentHtml = editorRef.current.innerHTML;
        const convertedMd = htmlToMarkdown(currentHtml);
        onChange(convertedMd);
    };

    return (
        <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={handleInput}
            data-placeholder={placeholder}
            className={`outline-none min-h-[1.5rem] leading-relaxed cursor-text whitespace-pre-wrap ${
                isDarkTheme ? 'text-white/90 focus:text-white' : 'text-slate-800 focus:text-slate-900'
            } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none ${className}`}
        />
    );
};
