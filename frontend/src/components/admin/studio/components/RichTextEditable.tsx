import React, { useRef, useEffect } from 'react';

interface RichTextEditableProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
    isDarkTheme?: boolean;
    autoFocus?: boolean;
}

// Convert markdown symbols (like **bold**, *italic*, `code`) into clean HTML for WYSIWYG
export const markdownToHtml = (md: string = ''): string => {
    if (!md) return '';
    let html = md;
    
    // If it's already HTML (contains tags), return as is
    if (/<[a-z][\s\S]*>/i.test(html)) {
        return html;
    }

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
    
    // Newlines to <br/>
    html = html.replace(/\n/g, '<br/>');

    return html;
};

// Convert innerHTML back to clean Markdown
export const htmlToMarkdown = (html: string = ''): string => {
    if (!html) return '';
    let md = html;

    // Convert <br> and <div> to newlines
    md = md.replace(/<br\s*[\/]?>/gi, '\n');
    md = md.replace(/<\/div>/gi, '\n');
    md = md.replace(/<div>/gi, '');
    md = md.replace(/<\/p>/gi, '\n\n');
    md = md.replace(/<p>/gi, '');

    // Bold <strong> / <b>
    md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');

    // Italic <em> / <i>
    md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');

    // Strikethrough <del> / <s>
    md = md.replace(/<del>(.*?)<\/del>/gi, '~~$1~~');
    md = md.replace(/<s>(.*?)<\/s>/gi, '~~$1~~');

    // Code <code>
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Strip any remaining unwanted HTML tags except basic formatting
    md = md.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    md = md.replace(/&nbsp;/g, ' ');
    md = md.replace(/&amp;/g, '&');
    md = md.replace(/&lt;/g, '<');
    md = md.replace(/&gt;/g, '>');
    md = md.replace(/&quot;/g, '"');

    return md.trim();
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
            className={`outline-none min-h-[3.5rem] leading-relaxed cursor-text whitespace-pre-wrap ${
                isDarkTheme ? 'text-white/90 focus:text-white' : 'text-slate-800 focus:text-slate-900'
            } empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none ${className}`}
        />
    );
};
