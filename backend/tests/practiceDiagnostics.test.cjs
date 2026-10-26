const test=require('node:test'), assert=require('node:assert/strict');
const {sandboxSyntax,canAnalyzeLogic,logicDiagnostic}=require('../dist/modules/adaptive/practiceDiagnostics');
const {requestPracticeGuidance,evidencePracticeGuidance}=require('../dist/modules/adaptive/practiceGuidance');
const result=(stderr,status='RUNTIME_ERROR')=>({status:'EXECUTED',passed:false,test_results:[{
    case_index:1,is_hidden:false,passed:false,status,stderr,expected:'a',actual:''}]});
const run={artifact:{language:'python',spec_snapshot:{required_constructs:['for'],forbidden_constructs:[]}}};

test('Python syntax metadata uses exact sandbox offsets before any constraint or logic hint',async()=>{
    const code='print("Hello)';
    const failed=result('__LEARNER_SYNTAX__'+JSON.stringify({message:'unterminated string literal',line:1,column:7,end_line:1,end_column:7}));
    const guidance=evidencePracticeGuidance(code,failed,run);
    assert.equal(guidance.analysisKind,'syntax');
    assert.equal(guidance.diagnostic.line,1);assert.equal(guidance.diagnostic.column,7);
    assert.match(guidance.reason,/Thiếu dấu " để đóng chuỗi/);assert.doesNotMatch(guidance.hint,/for/);
    const previous=global.fetch;global.fetch=()=>{throw Error('Syntax must never call AI');};
    try{assert.deepEqual(await requestPracticeGuidance(code,failed,run),guidance);}finally{global.fetch=previous;}
});

test('Python codepoint offsets convert to Monaco UTF16, not a guessed quote location',()=>{
    const diagnostic=sandboxSyntax('x = "😀"; print("Hi)',result('__LEARNER_SYNTAX__'+JSON.stringify({message:'unterminated string literal',line:1,column:16}))).diagnostic;
    assert.equal(diagnostic.column,17);
});

test('legacy Python line is supported but a harness line or hidden stderr is never marked',()=>{
    assert.equal(sandboxSyntax('x',result('File "<unknown>", line 1\n x\n ^\nSyntaxError: invalid syntax')).diagnostic.line,1);
    assert.equal(sandboxSyntax('x',result('File "/work/main.py", line 1\nSyntaxError: invalid syntax')).diagnostic,undefined);
    const hidden=result('File "<submission>", line 1\nSyntaxError: PRIVATE');hidden.test_results[0].is_hidden=true;
    assert.equal(sandboxSyntax('x',hidden),null);
    assert.equal(sandboxSyntax('x',result('NameError: x')),null);
});

test('JS and C++ compiler locations are read from stderr without changing the line',()=>{
    const js=sandboxSyntax('const x = ;',result('submission.js:1\nconst x = ;\n          ^\n\nSyntaxError: Unexpected token ;'));
    assert.equal(js.diagnostic.line,1);assert.equal(js.diagnostic.column,11);
    const cpp=sandboxSyntax('int main() {\n  return 0\n}',result('/work/main.cpp:3:1: error: expected ; before } token'));
    assert.equal(cpp.diagnostic.line,3);assert.equal(cpp.diagnostic.column,1);
});

test('runtime, success, constraints and system errors never enter logic analysis',async()=>{
    for(const failed of [result('NameError: x'),{passed:true,status:'EXECUTED',test_results:[]},
        {status:'CONSTRAINT_VIOLATION',errors:['CONSTRAINT_REQUIRED:for']},{status:'INFRA_ERROR'}]) {
        assert.equal(canAnalyzeLogic(failed),false);
        const previous=global.fetch;global.fetch=()=>{throw Error('No model expected');};
        try{assert.equal((await requestPracticeGuidance('pass',failed,run)).source,'EVIDENCE');}finally{global.fetch=previous;}
    }
    assert.equal(canAnalyzeLogic(result('','SUCCESS')),true);
});

test('logic range requires high confidence, exact unique source excerpt and public failed test',()=>{
    const failed=result('','SUCCESS'), code='for ch in input():\n    pass';
    const candidate={line:2,line_evidence:'pass',confidence:'high',reason:'Thân vòng lặp chưa xuất ký tự.',hint:'Kiểm tra thao tác xuất dữ liệu.'};
    const diagnostic=logicDiagnostic(code,failed,candidate);
    assert.deepEqual([diagnostic.line,diagnostic.column,diagnostic.endColumn],[2,5,9]);
    assert.equal(logicDiagnostic(code,failed,{...candidate,confidence:'low'}),undefined);
    assert.equal(logicDiagnostic(code,failed,{...candidate,line_evidence:'print(ch)'}),undefined);
    assert.equal(logicDiagnostic(code,failed,{...candidate,line:20}),undefined);
    failed.test_results[0].is_hidden=true;assert.equal(logicDiagnostic(code,failed,candidate),undefined);
});
