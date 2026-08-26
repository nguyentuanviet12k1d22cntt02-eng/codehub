import type { PaletteCategory } from './types';

export const paletteCategories: PaletteCategory[] = [
    {
        title: 'CƠ BẢN',
        items: [
            {
                type: 'heading',
                label: 'Tiêu đề',
                icon: (
                    <span className="font-serif font-bold text-base text-slate-800 tracking-tight">H</span>
                )
            },
            {
                type: 'paragraph',
                label: 'Đoạn văn',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                )
            },
            {
                type: 'list',
                label: 'Danh sách',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round" />
                        <line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round" />
                        <line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round" />
                        <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                        <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                        <circle cx="4" cy="18" r="1.5" fill="currentColor" />
                    </svg>
                )
            },
            {
                type: 'callout',
                label: 'Callout',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                )
            },
            {
                type: 'note',
                label: 'Ghi chú',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )
            },
            {
                type: 'divider',
                label: 'Đường kẻ',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
                    </svg>
                )
            }
        ]
    },
    {
        title: 'NỘI DUNG LẬP TRÌNH',
        items: [
            {
                type: 'code',
                label: 'Khối mã (Code)',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            },
            {
                type: 'output',
                label: 'Kết quả (Output)',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="14" rx="2" strokeLinecap="round" />
                        <polyline points="7 9 10 11 7 13" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="13" x2="16" y2="13" strokeLinecap="round" />
                    </svg>
                )
            },
            {
                type: 'explanation',
                label: 'Giải thích',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" strokeLinecap="round" />
                        <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
                        <circle cx="12" cy="8" r="1" fill="currentColor" />
                    </svg>
                )
            },
            {
                type: 'exercise',
                label: 'Bài tập (Exercise)',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                )
            },
            {
                type: 'quiz',
                label: 'Quiz',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" strokeLinecap="round" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                        <circle cx="12" cy="17" r="1" fill="currentColor" />
                    </svg>
                )
            },
            {
                type: 'theory',
                label: 'Lý thuyết',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                )
            }
        ]
    },
    {
        title: 'DỮ LIỆU & SQL',
        items: [
            {
                type: 'table',
                label: 'Bảng (Table)',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" />
                        <path strokeLinecap="round" d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                    </svg>
                )
            },
            {
                type: 'erd',
                label: 'Sơ đồ ERD',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="6" cy="12" r="3" strokeLinecap="round" />
                        <circle cx="18" cy="6" r="3" strokeLinecap="round" />
                        <circle cx="18" cy="18" r="3" strokeLinecap="round" />
                        <path strokeLinecap="round" d="M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4" />
                    </svg>
                )
            },
            {
                type: 'output',
                label: 'Kết quả SQL',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <ellipse cx="12" cy="5" rx="9" ry="3" strokeLinecap="round" />
                        <path strokeLinecap="round" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                        <path strokeLinecap="round" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                )
            }
        ]
    },
    {
        title: 'ĐA PHƯƠNG TIỆN',
        items: [
            {
                type: 'image',
                label: 'Hình ảnh',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" />
                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                        <polyline points="21 15 16 10 5 21" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            },
            {
                type: 'video',
                label: 'Video',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" strokeLinecap="round" />
                        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                    </svg>
                )
            },
            {
                type: 'code',
                label: 'Iframe',
                icon: (
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            }
        ]
    }
];
