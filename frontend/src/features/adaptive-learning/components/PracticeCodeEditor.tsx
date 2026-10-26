import { useEffect, useRef, useState } from 'react';
import Editor, { type Monaco, type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { PracticeDiagnostic } from './practiceGuidanceResult';
import { installEditorDiagnostic } from './editorDiagnostics';
import './PracticeCodeEditor.css';

interface Props {
    code: string;
    language: string;
    readOnly: boolean;
    diagnostic?: PracticeDiagnostic;
    onChange: (value: string) => void;
}

export function PracticeCodeEditor({code,language,readOnly,diagnostic,onChange}: Props) {
    const [mounted,setMounted] = useState<{editor:editor.IStandaloneCodeEditor;monaco:Monaco} | null>(null);
    const cleanup = useRef<() => void>(()=>{});
    const onMount: OnMount = (instance,monaco)=>setMounted({editor:instance,monaco});
    useEffect(()=>{
        cleanup.current();
        cleanup.current = mounted ? installEditorDiagnostic(mounted.editor,mounted.monaco,diagnostic,code) : ()=>{};
        return ()=>cleanup.current();
    },[mounted,diagnostic,code,language]);
    return <Editor height="430px" language={language} theme="vs-dark" value={code} onMount={onMount}
        onChange={value=>{cleanup.current();onChange(value || '');}}
        options={{readOnly,fontSize:13.5,fontFamily:"'Fira Code', 'Geist Mono', Consolas, monospace",
            minimap:{enabled:false},scrollBeyondLastLine:false,automaticLayout:true,padding:{top:14,bottom:14},
            lineNumbers:'on',renderLineHighlight:'all',renderValidationDecorations:'on'}} />;
}
