import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import type { PracticeDiagnostic } from './practiceGuidanceResult';

export const DIAGNOSTIC_OWNER = 'practice-submission';

export function diagnosticRange(diagnostic: PracticeDiagnostic | undefined, code: string) {
    if (!diagnostic || !['syntax','logic'].includes(diagnostic.kind) || typeof diagnostic.message !== 'string'
        || !diagnostic.message.trim() || diagnostic.message.length > 400
        || (diagnostic.kind === 'syntax' ? diagnostic.source !== 'SANDBOX' : diagnostic.source !== 'AI')) return null;
    const lines = code.split(/\r?\n/);
    const line = diagnostic.line, column = diagnostic.column ?? 1;
    const endLine = diagnostic.endLine ?? line;
    const reportedEnd = diagnostic.endColumn ?? (diagnostic.column === undefined ? (lines[line - 1]?.length ?? 0) + 1 : column + 1);
    // SyntaxError may report a zero-width span. Preserve its start and render one character.
    const endColumn = endLine === line && reportedEnd === column ? column + 1 : reportedEnd;
    if (![line,column,endLine,endColumn].every(Number.isInteger) || line < 1 || endLine < line || endLine > lines.length
        || column < 1 || column > lines[line - 1].length + 1 || endColumn < 1 || endColumn > lines[endLine - 1].length + 2
        || (endLine === line && endColumn <= column)) return null;
    return {startLineNumber:line,startColumn:column,endLineNumber:endLine,endColumn};
}

/** One marker + one reserved view zone, scoped to this exact model and code snapshot. */
export function installEditorDiagnostic(instance: editor.IStandaloneCodeEditor, monaco: Monaco,
    diagnostic: PracticeDiagnostic | undefined, code: string): () => void {
    const model = instance.getModel();
    const range = diagnosticRange(diagnostic,code);
    if (!model || model.getValue() !== code || !range || !diagnostic) return () => {};
    monaco.editor.setModelMarkers(model,DIAGNOSTIC_OWNER,[{...range,source:diagnostic.source === 'SANDBOX' ? 'Sandbox' : 'AI Tutor',
        message:diagnostic.message,severity:diagnostic.kind === 'syntax' ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning}]);
    const node = document.createElement('div');
    node.className = `practice-inline-diagnostic practice-inline-diagnostic--${diagnostic.kind}`;
    node.setAttribute('role','status'); node.setAttribute('aria-live','polite');
    const text = document.createElement('div');
    text.className = 'practice-inline-diagnostic__text';
    text.textContent = `Dòng ${diagnostic.line}${diagnostic.column ? `, cột ${diagnostic.column}` : ''}: ${diagnostic.message}`;
    node.appendChild(text);
    const zone: editor.IViewZone = {afterLineNumber:range.endLineNumber,heightInPx:62,domNode:node,suppressMouseDown:false};
    let zoneId = '', disposed = false;
    instance.changeViewZones(accessor=>{zoneId=accessor.addZone(zone);});
    const layout = () => {
        if (disposed) return;
        const height = Math.max(40,text.scrollHeight + 10);
        if (zone.heightInPx !== height) {
            zone.heightInPx = height;
            instance.changeViewZones(accessor=>accessor.layoutZone(zoneId));
        }
    };
    const raf = requestAnimationFrame(layout);
    const observer = new ResizeObserver(layout); observer.observe(text);
    const layoutSubscription = instance.onDidLayoutChange(layout);
    const cleanup = () => {
        if (disposed) return;
        disposed = true;
        cancelAnimationFrame(raf); observer.disconnect(); layoutSubscription.dispose();
        changeSubscription.dispose(); modelSubscription.dispose();
        if (!model.isDisposed()) monaco.editor.setModelMarkers(model,DIAGNOSTIC_OWNER,[]);
        instance.changeViewZones(accessor=>accessor.removeZone(zoneId));
    };
    const changeSubscription = instance.onDidChangeModelContent(cleanup);
    const modelSubscription = instance.onDidChangeModel(cleanup);
    // Scroll only after a submission result, never steal keyboard focus.
    instance.revealLineInCenterIfOutsideViewport(diagnostic.line);
    return cleanup;
}
