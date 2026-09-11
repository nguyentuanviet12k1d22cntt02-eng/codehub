import React from 'react';
import Editor from '@monaco-editor/react';
import type { ExerciseMock } from './types';

interface CodeEditorPanelProps {
    isSql: boolean;
    currentTheme: 'light' | 'dark';
    code: string;
    exercise: ExerciseMock | null;
    onCodeChange: (code: string) => void;
    onResetCode: () => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
    isSql,
    currentTheme,
    code,
    exercise,
    onCodeChange,
    onResetCode
}) => {
    return (
        <div className="bg-bg-secondary rounded-xl border border-border-custom flex flex-col overflow-hidden h-full mb-1 transition-colors duration-200">
            {/* Header thanh công cụ Editor */}
            <div className="bg-bg-tertiary border-b border-border-custom px-4 py-2 flex justify-between items-center shrink-0 transition-colors duration-200">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-accent-bg text-accent-custom px-1.5 py-0.5 rounded border border-accent-border tracking-wider uppercase">
                        {isSql ? 'SQL SERVER (T-SQL)' : 'PYTHON 3'}
                    </span>
                </div>
                {exercise && (
                    <button
                        className="text-xs text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer flex items-center gap-1 transition-colors"
                        onClick={onResetCode}
                    >
                        🔄 Reset Code
                    </button>
                )}
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 w-full overflow-hidden pt-2 bg-bg-primary">
                <Editor
                    height="100%"
                    language={isSql ? 'sql' : 'python'}
                    theme={currentTheme === 'dark' ? 'vs-dark' : 'light'}
                    value={code}
                    onChange={(val) => onCodeChange(val || '')}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        cursorBlinking: 'smooth',
                        formatOnPaste: true,
                        tabSize: 4
                    }}
                />
            </div>
        </div>
    );
};
