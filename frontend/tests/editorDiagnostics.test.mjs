import assert from 'node:assert/strict';
import {test} from 'node:test';
import {diagnosticRange,installEditorDiagnostic,DIAGNOSTIC_OWNER} from '../src/features/adaptive-learning/components/editorDiagnostics.ts';

const diagnostic={kind:'syntax',source:'SANDBOX',line:1,column:7,message:'Thiếu dấu " để đóng chuỗi.'};
test('ranges preserve sandbox coordinates and reject invented lines or invalid sources',()=>{
    assert.deepEqual(diagnosticRange(diagnostic,'print("Hello)'),{startLineNumber:1,startColumn:7,endLineNumber:1,endColumn:8});
    assert.equal(diagnosticRange({...diagnostic,line:2},'x'),null);
    assert.equal(diagnosticRange({...diagnostic,source:'AI'},'print("Hello)'),null);
    assert.equal(diagnosticRange({...diagnostic,column:100},'x'),null);
});

test('markers and view zones clear on edit/model switch and do not apply to stale code',()=>{
    const before={document:global.document,requestAnimationFrame:global.requestAnimationFrame,cancelAnimationFrame:global.cancelAnimationFrame,ResizeObserver:global.ResizeObserver};
    const markers=[],zones=new Map();let onEdit,onModel;let cleaned=0;
    global.document={createElement:()=>({setAttribute(){},appendChild(){},scrollHeight:42})};
    global.requestAnimationFrame=()=>1;global.cancelAnimationFrame=()=>{};
    global.ResizeObserver=class {observe(){} disconnect(){cleaned++;}};
    const disposable=()=>({dispose(){}});
    const model={getValue:()=> 'print("Hello)',isDisposed:()=>false};
    const monaco={MarkerSeverity:{Error:8,Warning:4},editor:{setModelMarkers:(_model,owner,value)=>{assert.equal(owner,DIAGNOSTIC_OWNER);markers.push(value);}}};
    const instance={getModel:()=>model,changeViewZones:callback=>callback({addZone:zone=>{zones.set('zone',zone);return 'zone';},removeZone:id=>zones.delete(id),layoutZone(){}}),
        onDidLayoutChange:disposable,onDidChangeModelContent:callback=>{onEdit=callback;return disposable();},
        onDidChangeModel:callback=>{onModel=callback;return disposable();},revealLineInCenterIfOutsideViewport(){}};
    try {
        installEditorDiagnostic(instance,monaco,diagnostic,'stale');assert.equal(markers.length,0);
        const cleanup=installEditorDiagnostic(instance,monaco,diagnostic,model.getValue());
        assert.equal(markers[0][0].startColumn,7);assert.equal(markers[0][0].severity,8);assert.equal(zones.get('zone').afterLineNumber,1);
        onEdit();assert.equal(zones.size,0);assert.deepEqual(markers.at(-1),[]);
        cleanup();assert.equal(cleaned,1);
        installEditorDiagnostic(instance,monaco,diagnostic,model.getValue());onModel();assert.equal(zones.size,0);assert.equal(cleaned,2);
    } finally {Object.assign(global,before);}
});
