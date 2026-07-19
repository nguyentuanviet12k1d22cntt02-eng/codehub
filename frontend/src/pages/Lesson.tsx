import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { authService } from '../services/authService';
import { ThemeToggle } from '../components/ThemeToggle';


const stripFrontmatter = (content: string) => {
    if (!content) return '';
    return content.replace(/^---\s*[\s\S]*?---\s*/, '');
};

const getReactTextContent = (node: any): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getReactTextContent).join('');
    if (node.props && node.props.children) return getReactTextContent(node.props.children);
    return '';
};

const cleanAlertPrefix = (node: any): any => {
    if (!node) return node;
    if (typeof node === 'string') {
        return node
            .replace('[!NOTE]', '')
            .replace('[!WARNING]', '')
            .replace('[!TIP]', '')
            .replace('[!IMPORTANT]', '')
            .trim();
    }
    if (Array.isArray(node)) {
        return node.map(cleanAlertPrefix);
    }
    if (node.props && node.props.children) {
        return React.cloneElement(node, {
            ...node.props,
            children: cleanAlertPrefix(node.props.children)
        });
    }
    return node;
};

import { useQuery } from '@tanstack/react-query';

const Lesson: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Sử dụng useQuery để quản lý nạp dữ liệu bài học lý thuyết
    const { data: lesson, isLoading, error } = useQuery({
        queryKey: ['lesson', id],
        queryFn: () => authService.getLessonDetail(id!),
        enabled: !!id,
    });

    const hasExercise = !!(lesson?.codingExercises && lesson.codingExercises.length > 0);

    const handleCompleteWithoutExercise = async () => {
        if (!lesson) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:3000/api/auth/lessons/${id}/complete`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (lesson.nextLessonId) {
                navigate(`/lesson/${lesson.nextLessonId}`);
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Lỗi hoàn thành bài học:', err);
            // Fallback quay lại dashboard
            navigate('/dashboard');
        }
    };

    if (isLoading) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex items-center justify-center">
                <span className="text-sm text-text-tertiary">Đang tải lý thuyết bài học...</span>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col items-center justify-center gap-4">
                <span className="text-sm text-rose-400">⚠️ {error ? (error as any).response?.data?.message || error.message : 'Không tìm thấy thông tin bài học'}</span>
                <Link to="/dashboard" className="text-xs text-accent-custom hover:underline">
                    Quay lại Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen w-full relative flex flex-col font-sans select-none transition-colors duration-200">
            {/* Header */}
            <header className="h-14 border-b border-border-custom bg-bg-secondary px-6 md:px-12 flex justify-between items-center shrink-0 sticky top-0 z-50 transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <span 
                        className="text-xl font-bold tracking-tight text-text-primary cursor-pointer"
                        onClick={() => navigate('/dashboard')}
                    >
                        MCODE
                    </span>
                    <div className="h-4 w-[1px] bg-border-custom"></div>
                    <span className="text-xs text-text-tertiary font-medium">
                        Lý thuyết bài học: <span className="text-text-primary font-semibold">{lesson.title}</span>
                    </span>
                </div>
                
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link 
                        to="/dashboard" 
                        className="text-xs text-text-secondary hover:text-text-primary no-underline transition-colors px-3 py-1.5 rounded-lg hover:bg-bg-tertiary border border-border-custom flex items-center gap-1.5"
                    >
                        <span>Quay lại Dashboard</span>
                    </Link>
                </div>
            </header>

            {/* Theory Content (Centered for readability) */}
            <main className="flex-1 overflow-y-auto px-6 py-12 flex justify-center">
                <div className="w-full max-w-[840px] flex flex-col gap-8 text-left select-text">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold bg-accent-bg text-accent-custom px-2 py-0.5 rounded border border-accent-border self-start uppercase tracking-wider">
                            Bài học lý thuyết
                        </span>
                        <h1 className="text-3xl font-extrabold text-text-primary m-0 tracking-tight mt-1">{lesson.title}</h1>
                    </div>

                    <hr className="border-border-custom m-0" />

                    <div className="select-text prose max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ ...props }) => <h1 className="text-2xl font-bold text-text-primary mt-8 mb-4 tracking-tight" {...props} />,
                                h2: ({ ...props }) => <h2 className="text-xl font-bold text-text-primary mt-8 mb-4 pb-1.5 border-b border-border-custom tracking-tight" {...props} />,
                                h3: ({ ...props }) => <h3 className="text-lg font-bold text-text-primary mt-6 mb-3 tracking-tight" {...props} />,
                                p: ({ ...props }) => <p className="text-sm text-text-secondary mb-4 leading-relaxed" {...props} />,
                                ul: ({ ...props }) => <ul className="list-disc pl-5 mb-5 text-sm text-text-secondary flex flex-col gap-2" {...props} />,
                                ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-5 text-sm text-text-secondary flex flex-col gap-2" {...props} />,
                                li: ({ ...props }) => <li className="mb-1" {...props} />,
                                strong: ({ ...props }) => <strong className="font-bold text-text-primary" {...props} />,
                                blockquote: ({ children }) => {
                                    const textContent = getReactTextContent(children);
                                    const isNote = textContent.includes('[!NOTE]');
                                    const isWarning = textContent.includes('[!WARNING]') || textContent.includes('[!CAUTION]');
                                    const isTip = textContent.includes('[!TIP]') || textContent.includes('[!IMPORTANT]');

                                    let typeLabel = '';
                                    let borderColor = 'border-border-custom';
                                    let bgColor = 'bg-bg-tertiary';
                                    let textColor = 'text-text-secondary';

                                    if (isNote) {
                                        typeLabel = 'Lưu ý';
                                        borderColor = 'border-blue-500/30';
                                        bgColor = 'bg-blue-500/5';
                                        textColor = 'text-blue-700 dark:text-blue-200';
                                    } else if (isWarning) {
                                        typeLabel = 'Chú ý';
                                        borderColor = 'border-amber-500/30';
                                        bgColor = 'bg-amber-500/5';
                                        textColor = 'text-amber-700 dark:text-amber-200';
                                    } else if (isTip) {
                                        typeLabel = 'Gợi ý';
                                        borderColor = 'border-emerald-500/30';
                                        bgColor = 'bg-emerald-500/5';
                                        textColor = 'text-emerald-700 dark:text-emerald-200';
                                    }

                                    const cleaned = cleanAlertPrefix(children);

                                    if (isNote || isWarning || isTip) {
                                        return (
                                            <div className={`p-5 rounded-xl border my-6 ${borderColor} ${bgColor} ${textColor} text-left transition-colors duration-200`}>
                                                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2.5">
                                                    <span>{typeLabel}</span>
                                                </div>
                                                <div className="text-sm leading-relaxed">
                                                    {cleaned}
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <blockquote className="border-l-4 border-accent-custom/50 pl-4 py-1.5 my-5 text-text-tertiary italic text-left">
                                            {children}
                                        </blockquote>
                                    );
                                },
                                code: ({ className, children, ...props }) => {
                                    const contentStr = String(children || '');
                                    const hasNewline = contentStr.includes('\n');
                                    const match = /language-(\w+)/.exec(className || '');
                                    const isInline = !match && !hasNewline;

                                    return isInline ? (
                                        <code className="bg-accent-bg text-accent-custom border border-accent-border px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <pre className="bg-pre-bg border border-border-custom p-4 rounded-lg overflow-x-auto text-xs font-mono my-4 text-text-secondary select-text transition-colors duration-200">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    );
                                },
                                table: ({ ...props }) => (
                                     <div className="overflow-x-auto w-full border border-border-custom rounded-xl my-6 transition-colors duration-200">
                                         <table className="w-full text-sm text-left border-collapse" {...props} />
                                     </div>
                                 ),
                                 thead: ({ ...props }) => <thead className="bg-bg-tertiary border-b border-border-custom" {...props} />,
                                 tbody: ({ ...props }) => <tbody className="divide-y divide-border-custom" {...props} />,
                                 tr: ({ ...props }) => <tr className="hover:bg-bg-tertiary/30" {...props} />,
                                 th: ({ ...props }) => <th className="p-3 font-semibold text-text-primary border-r border-border-custom last:border-r-0" {...props} />,
                                 td: ({ ...props }) => <td className="p-3 text-text-secondary border-r border-border-custom/50 last:border-r-0" {...props} />
                            }}
                        >
                            {stripFrontmatter(lesson.content || '')}
                        </ReactMarkdown>
                    </div>

                    <div className="h-4"></div>

                    {/* Bottom CTA Button */}
                    {hasExercise ? (
                        <button 
                            className="bg-accent-custom hover:bg-accent-hover text-white dark:text-[#030303] py-3.5 rounded-xl text-sm font-bold cursor-pointer active:scale-95 transition-all w-full border-none shadow-lg shadow-accent-custom/10 flex items-center justify-center gap-2"
                            onClick={() => navigate(`/practice/${id}`)}
                        >
                            <span>Chuyển sang làm bài tập thực hành</span>
                            <span>&rarr;</span>
                        </button>
                    ) : (
                        <button 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold cursor-pointer active:scale-95 transition-all w-full border-none shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                            onClick={handleCompleteWithoutExercise}
                        >
                            <span>Hoàn thành bài học này</span>
                            <span>✔</span>
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Lesson;
