import React, { useRef, useEffect } from 'react';

interface RichTextEditableProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
    isDarkTheme?: boolean;
    autoFocus?: boolean;
}

// Convert markdown symbols into clean HTML for WYSIWYG
export const markdownToHtml = (md: string = ''): string => {
    if (!md) return '';
    let html = md;

    // Bold **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic *text* or _text_
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Strikethrough ~~text~~
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code style="background-color: rgba(147, 51, 234, 0.1); color: #7e22ce; padding: 2px 5px; border-radius: 4px; font-family: monospace;">$1</code>');

    return html;
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
