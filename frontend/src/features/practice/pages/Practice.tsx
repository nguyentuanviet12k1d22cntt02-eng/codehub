import { submitWithPolling } from '../submitWithPolling';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../../../services/authService';
import { getInitialTheme } from '../../../utils/themeHelper';
import { API_BASE_URL } from '../../../config/api';
import {hasPracticeSelection,committedPracticeVersion} from '../../lesson/services/modulePracticeContracts';
import {usePracticeRecommendation} from '../../lesson/hooks/usePracticeRecommendation';
import {PracticeRecommendationCard} from '../../lesson/components/PracticeRecommendationCard';

import type { ExerciseMock, TestCaseMock, SubmitStats, SubmissionItem } from '../components/practice/types';
import { PracticeHeader } from '../components/practice/PracticeHeader';
import { ProblemDescriptionPanel } from '../components/practice/ProblemDescriptionPanel';
import { CodeEditorPanel } from '../components/practice/CodeEditorPanel';
import { TerminalPanel } from '../components/practice/TerminalPanel';

interface PracticeLesson {id:string;lessonId:string;title:string;codingExercises?:ExerciseMock[];nextLessonId?:string|null}
interface SubmitGrade {success:boolean;allPassed:boolean;failureType?:'COMPILE_ERROR';results:TestCaseMock[];runtimeMs:number;runtimeBeats:number;distribution:SubmitStats['distribution'];message?:string;output?:string}

const Practice: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const difficultyFilter = searchParams.get('difficulty');
    const adaptiveMode = searchParams.get('adaptive') === '1';
    const requestedExerciseId = searchParams.get('exerciseId');
    const roadmapId = searchParams.get('roadmapId');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getInitialTheme());

    useEffect(() => {
        const handleThemeChange = () => {
            setCurrentTheme(getInitialTheme());
        };
        window.addEventListener('theme-change', handleThemeChange);
        return () => window.removeEventListener('theme-change', handleThemeChange);
    }, []);

    // 1. Quản trị Dữ liệu Bài học & Bài tập
    const [lesson, setLesson] = useState<PracticeLesson|null>(null);
    const [exercises, setExercises] = useState<ExerciseMock[]>([]);
    const [currentExerciseIdx, setCurrentExerciseIdx] = useState<number>(0);
    const [exercise, setExercise] = useState<ExerciseMock | null>(null);
    const [code, setCode] = useState<string>('');
    const [customInput, setCustomInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // 2. Quản trị Trạng thái UI & Tabs
    const [activeLeftTab, setActiveLeftTab] = useState<'desc' | 'submissions'>('desc');
    const [activeTerminalTab, setActiveTerminalTab] = useState<'console' | 'testcase'>('console');

    // 3. Quản trị Tiến trình Chạy/Nộp bài
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSelectingNext, setIsSelectingNext] = useState<boolean>(false);
    const [adaptiveComplete, setAdaptiveComplete] = useState<boolean>(false);
    const [consoleOutput, setConsoleOutput] = useState<string>('Bấm "Chạy thử" để xem kết quả đầu ra tại đây...');
    const [testcaseResults, setTestCaseResults] = useState<TestCaseMock[]>([]);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [userCodes, setUserCodes] = useState<Record<string, string>>({});
    const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

    // 4. Quản trị Thống kê Xếp hạng & Lịch sử nộp bài
    const [submitStats, setSubmitStats] = useState<SubmitStats | null>(null);
    const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
    const recommendation=usePracticeRecommendation(id||'');
    const {refresh:refreshRecommendation,invalidate:invalidateRecommendation,markCommitted}=recommendation;
    const draftsRef=React.useRef<Record<string,string>>({});
    const passedVersionsRef=React.useRef(new Map<string,string>());
    const routeScope=`${id||''}|${difficultyFilter||''}|${adaptiveMode}|${requestedExerciseId||''}`;
    const viewRef=React.useRef({routeScope,exerciseId:exercise?.id});
    React.useLayoutEffect(()=>{viewRef.current={routeScope,exerciseId:exercise?.id};},[routeScope,exercise?.id]);
    const runRef=React.useRef<AbortController|null>(null),submitRef=React.useRef<AbortController|null>(null),historyRef=React.useRef<AbortController|null>(null);
    const [compact,setCompact]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width: 767px)').matches);
    const pythonBank=/^LS-0[1-8]\.MP(?:_FOR|_WHILE)?$/.test(lesson?.lessonId||'');
    const hasRecommendation=adaptiveMode||pythonBank;
    useEffect(()=>{const media=window.matchMedia('(max-width: 767px)'),update=()=>setCompact(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
    useEffect(()=>()=>{runRef.current?.abort();submitRef.current?.abort();historyRef.current?.abort();},[routeScope]);

    const interactionStartedAtRef = React.useRef<number>(0);
    const interactionSessionIdRef = React.useRef<string>('');

    useEffect(() => {
        if (!exercise?.id) return;
        interactionStartedAtRef.current = Date.now();
        interactionSessionIdRef.current = crypto.randomUUID();
    }, [exercise?.id]);

    // Route-scoped lesson loading: stale requests cannot replace a different bank or erase a draft.
    useEffect(() => {
        const controller=new AbortController();let active=true;
        const fetchLessonData=async()=>{
            setLoading(true);setError('');setLesson(null);setExercise(null);setExercises([]);
            setIsCompleted(false);setTestCaseResults([]);setSubmitStats(null);setSubmissions([]);setCompletedExercises({});setAdaptiveComplete(false);
            setIsRunning(false);setIsSubmitting(false);setIsSelectingNext(false);invalidateRecommendation();
            setConsoleOutput('Bấm "Chạy thử" để xem kết quả đầu ra tại đây...');
            if(!id){setError('Không tìm thấy bài học.');setLoading(false);return;}
            try{
                const data:PracticeLesson=await authService.getLessonDetail(id,controller.signal);if(!active)return;
                setLesson(data);
                let exList=[...(data.codingExercises||[])];
                if(difficultyFilter&&!adaptiveMode)exList=exList.filter(e=>e.difficulty===difficultyFilter.toUpperCase());
                exList.sort((a,b)=>{
                    const aa=/Bài\s*(\d+)/i.exec(a.problemDescription||'')||/Bài\s*(\d+)/i.exec(a.title||'');
                    const bb=/Bài\s*(\d+)/i.exec(b.problemDescription||'')||/Bài\s*(\d+)/i.exec(b.title||'');
                    return aa&&bb?Number(aa[1])-Number(bb[1]):(a.title||'').localeCompare(b.title||'',undefined,{numeric:true,sensitivity:'base'});
                });
                setExercises(exList);
                let index=requestedExerciseId?exList.findIndex(e=>e.id===requestedExerciseId):0;
                const modulePython=/^LS-0[1-8]\.MP(?:_FOR|_WHILE)?$/.test(data.lessonId||'');
                if(adaptiveMode){
                    const suggestion=await refreshRecommendation(data,passedVersionsRef.current,id);if(!active)return;
                    if(suggestion?.mode==='COMPLETE'){setAdaptiveComplete(true);return;}
                    if(!suggestion||!hasPracticeSelection(suggestion))return;
                    index=exList.findIndex(e=>e.id===suggestion.exerciseId);
                }else if(modulePython){void refreshRecommendation(data,passedVersionsRef.current,id);}
                if(!exList.length){setCode('');setCustomInput('');return;}
                if(index<0){setError('Bài được chọn không còn trong bộ bài. Hãy quay lại để chọn bài khác.');return;}
                const first=exList[index];
                const initialCodes:Record<string,string>={};for(const e of exList)initialCodes[e.id]=draftsRef.current[e.id]??e.starterCode??'# Viết code của bạn ở đây\n';
                setUserCodes(initialCodes);setCurrentExerciseIdx(index);
                setExercise({...first,starterCode:first.starterCode||'# Viết code của bạn ở đây\n',testCases:first.testCases||[]});
                setCode(initialCodes[first.id]!);setCustomInput(first.testCases?.[0]?.input||'');setActiveLeftTab('desc');
                if(adaptiveMode){const params=new URLSearchParams(window.location.search);params.delete('difficulty');params.set('exerciseId',first.id);window.history.replaceState(window.history.state,'',`${window.location.pathname}?${params}`);}
                // Ordinary lessons and non-Python pilots retain their existing progress behavior.
                const token=localStorage.getItem('token');
                if(token&&!modulePython){
                    const completed:Record<string,boolean>={};
                    await Promise.all((adaptiveMode?[first]:exList).map(async e=>{
                        try{const response=await axios.get<SubmissionItem[]>(`${API_BASE_URL}/api/auth/exercises/${e.id}/submissions`,{headers:{Authorization:`Bearer ${token}`},signal:controller.signal});completed[e.id]=response.data.some(x=>x.status==='PASSED');}catch{/* Old progress may be unavailable without blocking the lesson. */}
                    }));
                    if(active){setCompletedExercises(completed);setIsCompleted(!adaptiveMode&&exList.every(e=>completed[e.id]));}
                }
            }catch{if(active)setError('Không thể tải dữ liệu bài học. Vui lòng thử lại sau.');}
            finally{if(active)setLoading(false);}
        };
        void fetchLessonData();return()=>{active=false;controller.abort();};
    },[id,difficultyFilter,adaptiveMode,requestedExerciseId,refreshRecommendation,invalidateRecommendation]);

    const selectExercise = (idx: number) => {
        if (idx < 0 || idx >= exercises.length || isSubmitting || isRunning) return;

        if (exercise) {
            draftsRef.current[exercise.id]=code;
            setUserCodes(prev => ({ ...prev, [exercise.id]: code }));
        }

        const nextEx = exercises[idx];
        setCurrentExerciseIdx(idx);
        setExercise({
            id: nextEx.id,
            title: nextEx.title,
            difficulty: nextEx.difficulty,
            problemDescription: nextEx.problemDescription,
            starterCode: nextEx.starterCode || '# Viết code Python của bạn ở đây\n',
            testCases: nextEx.testCases || []
        });

        const savedCode = userCodes[nextEx.id] !== undefined
            ? userCodes[nextEx.id]
            : (nextEx.starterCode || '# Viết code Python của bạn ở đây\n');
        setCode(savedCode);
        historyRef.current?.abort();setSubmissions([]);

        setConsoleOutput('Bấm "Chạy thử" để xem kết quả đầu ra tại đây...');
        setTestCaseResults([]);
        setSubmitStats(null);
        setActiveLeftTab('desc');
        setActiveTerminalTab('console');

        if (nextEx.testCases && nextEx.testCases.length > 0) {
            setCustomInput(nextEx.testCases[0].input || '');
        } else {
            setCustomInput('');
        }
    };

    const handleCodeChange = (newVal: string) => {
        setCode(newVal);
        if (exercise) {
            draftsRef.current[exercise.id]=newVal;
            setUserCodes(prev => ({ ...prev, [exercise.id]: newVal }));
        }
    };

    const handleNextExercise=async()=>{
        if(!adaptiveMode){selectExercise(currentExerciseIdx+1);return;}
        if(!id||!lesson||isSubmitting||isRunning||isSelectingNext)return;
        const scope=routeScope,current=exercise?.id;setIsSelectingNext(true);
        try{
            const suggestion=await refreshRecommendation(lesson,passedVersionsRef.current,id);
            if(viewRef.current.routeScope!==scope||viewRef.current.exerciseId!==current||!suggestion)return;
            if(suggestion.mode==='COMPLETE'){setAdaptiveComplete(true);return;}
            if(!hasPracticeSelection(suggestion))return;
            const nextIndex=exercises.findIndex(e=>e.id===suggestion.exerciseId);if(nextIndex<0)return;
            // A retry may validly select the same FAILED item; keep its draft and last grading output.
            if(!exercise||nextIndex!==currentExerciseIdx)selectExercise(nextIndex);
            const params=new URLSearchParams(window.location.search);params.delete('difficulty');params.set('exerciseId',suggestion.exerciseId);
            window.history.replaceState(window.history.state,'',`${window.location.pathname}?${params}`);
        }finally{if(viewRef.current.routeScope===scope)setIsSelectingNext(false);}
    };

    const fetchSubmissions=async()=>{
        if(!exercise)return;
        historyRef.current?.abort();const controller=new AbortController();historyRef.current=controller;
        const scope=routeScope,exerciseId=exercise.id,token=localStorage.getItem('token');
        try{
            const response=await axios.get(`${API_BASE_URL}/api/auth/exercises/${exerciseId}/submissions`,{headers:{Authorization:`Bearer ${token}`},signal:controller.signal});
            if(!controller.signal.aborted&&viewRef.current.routeScope===scope&&viewRef.current.exerciseId===exerciseId&&localStorage.getItem('token')===token)setSubmissions(response.data);
        }catch{/* Keep a different exercise's history out of this view. */}
    };

    const handleLeftTab=(tab:'desc'|'submissions')=>{
        setActiveLeftTab(tab);
        if(tab==='submissions')void fetchSubmissions();else historyRef.current?.abort();
    };

    const handleRunCode = async () => {
        if (!code.trim()) {
            setConsoleOutput('Lỗi: Mã nguồn không được để trống!');
            return;
        }
        runRef.current?.abort();const runController=new AbortController();runRef.current=runController;
        const runScope=routeScope,runExerciseId=exercise?.id;
        const runCurrent=()=>!runController.signal.aborted&&viewRef.current.routeScope===runScope&&viewRef.current.exerciseId===runExerciseId;
        setIsRunning(true);
        setConsoleOutput('Đang chạy code trong môi trường sandbox...');
        setActiveTerminalTab('console');

        try {
            const isCpp = lesson?.lessonId?.startsWith('CPP-') || /#include\s*<|std::/i.test(code);
            const isSql = !isCpp && (lesson?.lessonId?.startsWith('SQL-') || /SELECT|FROM/i.test(code));
            const isJs = !isCpp && !isSql && (lesson?.lessonId?.startsWith('JS-') || /console\.log|function\s*\(|let\s+|const\s+/i.test(code));
            const language = isJs ? 'JAVASCRIPT' : isCpp ? 'CPP' : isSql ? 'SQL' : 'PYTHON';
            const response = await axios.post(`${API_BASE_URL}/api/auth/compiler/run`, {
                code,
                input: customInput,
                language
            }, {signal:runController.signal});
            if(!runCurrent())return;
            setIsRunning(false);
            if (response.data.success) {
                setConsoleOutput(`[stdout]\n${response.data.output}\n\n[Thực thi hoàn tất]`);
            } else {
                setConsoleOutput(`[stderr/error]\n${response.data.output}\n\n[Thực thi gặp lỗi]`);
            }
        } catch (err) {
            if(!runCurrent())return;
            setIsRunning(false);
            setConsoleOutput(`Lỗi hệ thống biên dịch: ${err instanceof Error?err.message:'Không xác định'}`);
        }
    };

    const handleSubmitCode = async () => {
        if (!exercise) return;
        if (!code.trim()) {
            setConsoleOutput('Lỗi: Mã nguồn không được để trống!');
            return;
        }
        submitRef.current?.abort();const submitController=new AbortController();submitRef.current=submitController;
        const submitScope=routeScope,submittedExerciseId=exercise.id,submitToken=localStorage.getItem('token');
        const submitCurrent=()=>!submitController.signal.aborted&&viewRef.current.routeScope===submitScope&&viewRef.current.exerciseId===submittedExerciseId&&localStorage.getItem('token')===submitToken;
        if(hasRecommendation)invalidateRecommendation();
        setIsSubmitting(true);
        setActiveTerminalTab('console');
        setConsoleOutput('Đang gửi bài và chạy kiểm tra trên server...');
        setSubmitStats(null);

        try {
            const openedAt=interactionStartedAtRef.current||Date.now();
            const response = await submitWithPolling<SubmitGrade>(
                `${API_BASE_URL}/api/auth/exercises/${exercise.id}/submit`,
                {
                    code,
                    telemetry: {
                        sessionId: interactionSessionIdRef.current||crypto.randomUUID(),
                        openedAt: new Date(openedAt).toISOString(),
                        activeTimeSeconds: Math.max(0, Math.floor((Date.now() - openedAt) / 1000)),
                        hintCount: 0,
                    },
                },
                {
                    headers: { Authorization: `Bearer ${submitToken}` }, signal:submitController.signal
                },
                progress => {
                    if(submitCurrent())setConsoleOutput(progress.state==='running'?'Đang chấm bài của bạn trên server...':`Đang xếp hàng chấm bài${progress.ahead>0?` (còn ${progress.ahead} bài trước bạn)`:''}...`);
                }
            );
            if(!submitCurrent())return;

            setIsSubmitting(false);

            if (response.data.success) {
                const { allPassed, failureType, results, runtimeMs, runtimeBeats, distribution, message } = response.data;
                setTestCaseResults(results);

                if (allPassed) {
                    queryClient.invalidateQueries();
                    const updatedCompleted = { ...completedExercises, [exercise.id]: true };
                    setCompletedExercises(updatedCompleted);

                    setSubmitStats({ runtimeMs, runtimeBeats, distribution });

                    const allPassedLesson = !adaptiveMode && !pythonBank && exercises.every(ex => updatedCompleted[ex.id]);
                    if (allPassedLesson) {
                        setIsCompleted(true);
                        setConsoleOutput(`🎉 Tuyệt vời! Bạn đã vượt qua tất cả các bài tập trong bài học này.\nTrạng thái bài học: HOÀN THÀNH`);
                    } else {
                        setConsoleOutput(`🎉 Tuyệt vời! Bạn đã vượt qua tất cả ${results.length}/${results.length} testcases của bài tập này.\n${hasRecommendation ? 'Kết quả bài này đã được lưu. Xem đề xuất tiếp theo ở phía trên.' : 'Hãy tiếp tục hoàn thành các bài tập còn lại!'}`);
                    }

                    if (activeLeftTab === 'submissions') {
                        fetchSubmissions();
                    }
                } else {
                    setSubmitStats(null);
                    const updatedCompleted = { ...completedExercises, [exercise.id]: adaptiveMode && completedExercises[exercise.id] ? true : false };
                    setCompletedExercises(updatedCompleted);
                    setIsCompleted(false);
                    if (failureType === 'COMPILE_ERROR') {
                        const compilerOutput = results.find((result: TestCaseMock) => result.failureType === 'COMPILE_ERROR')?.actualOutput || message;
                        const needsStdNamespace = isCpp && /['`]cout['`] was not declared|undeclared identifier ['`]cout['`]/i.test(compilerOutput || '');
                        const hint = needsStdNamespace
                            ? "\n\nGợi ý: trong C++, hãy dùng `std::cout` và kết thúc câu lệnh bằng dấu `;`.\nVí dụ: std::cout << \"Noi dung\" << '\\n';"
                            : '';
                        setConsoleOutput(`❌ [Lỗi biên dịch${isCpp ? ' C++' : ''}]:\n${compilerOutput || 'Không xác định'}${hint}`);
                    } else if (message) {
                        setConsoleOutput(`❌ [Lỗi cấu trúc / logic code]:\n${message}`);
                    } else {
                        setConsoleOutput(`❌ Kết quả: Vượt qua ${results.filter(r => r.passed).length}/${results.length} testcases. Vui lòng kiểm tra lại logic.`);
                    }
                }
                if(hasRecommendation&&lesson){
                    const version=committedPracticeVersion(response.data,lesson.id);
                    if(version)markCommitted(lesson.id);
                    if(allPassed&&version)passedVersionsRef.current.set(submittedExerciseId,version);
                    void refreshRecommendation(lesson,passedVersionsRef.current,id);
                }
            } else {
                setSubmitStats(null);
                const updatedCompleted = { ...completedExercises, [exercise.id]: adaptiveMode && completedExercises[exercise.id] ? true : false };
                setCompletedExercises(updatedCompleted);
                setIsCompleted(false);
                setConsoleOutput(`❌ Lỗi biên dịch/thực thi:\n${response.data.output || 'Không xác định'}`);
            }
        } catch (err) {
            if(!submitCurrent())return;
            setIsSubmitting(false);
            setSubmitStats(null);
            const failure=axios.isAxiosError<{error?:string}>(err)?err:null;
            if (failure?.response?.status === 401 || failure?.response?.status === 403) {
                setConsoleOutput('❌ Lỗi chấm bài: Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại để tiếp tục.');
            } else {
                setConsoleOutput(`Lỗi chấm bài: ${failure?.response?.data?.error || (err instanceof Error?err.message:'Không xác định')}`);
            }
        } finally {
            if(submitRef.current===submitController&&viewRef.current.routeScope===submitScope)setIsSubmitting(false);
        }
    };

    const handleCompleteWithoutExercise = () => {
        setIsCompleted(true);
        setConsoleOutput('🎉 Chúc mừng! Bạn đã hoàn thành học phần lý thuyết bài học này.\nTrạng thái bài học: HOÀN THÀNH');
    };

    if (loading) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-text-tertiary">Đang tải dữ liệu bài học...</span>
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex items-center justify-center font-sans">
                <div className="text-center flex flex-col gap-4">
                    <span className="text-sm text-rose-400">{error || 'Không tìm thấy thông tin bài học.'}</span>
                    {adaptiveMode && error && (
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-accent-custom text-white px-4 py-2 rounded-lg text-xs font-semibold"
                        >
                            Thử lại
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary px-4 py-2 rounded-lg text-xs font-semibold border border-border-custom"
                    >
                        Quay lại Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (adaptiveMode && adaptiveComplete) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col font-sans">
                <PracticeHeader lessonTitle={lesson.title} roadmapId={roadmapId} />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full rounded-xl border border-border-custom bg-bg-secondary p-8 text-center flex flex-col gap-4">
                        <h1 className="text-xl font-bold">Đã hoàn thành bộ bài hiện tại</h1>
                        <p className="text-sm text-text-secondary">Tất cả bài được xác minh ở phiên bản hiện tại đã hoàn thành.</p>
                        <button
                            onClick={() => navigate(roadmapId ? `/roadmap/${roadmapId}` : '/dashboard')}
                            className="bg-accent-custom text-white rounded-lg px-4 py-2 text-sm font-semibold"
                        >
                            {roadmapId ? 'Quay lại lộ trình' : 'Quay lại Dashboard'}
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    if(adaptiveMode&&!exercise){
        return <div className="min-h-screen bg-bg-primary text-text-primary font-sans"><PracticeHeader lessonTitle={lesson.title} roadmapId={roadmapId}/><main className="max-w-4xl mx-auto p-5 sm:p-8"><PracticeRecommendationCard state={recommendation.state} onRetry={()=>void handleNextExercise()} disabled={isSelectingNext} manualHref={lesson.codingExercises?.length?`/practice/${encodeURIComponent(id||'')}`:undefined}/></main></div>;
    }

    if(pythonBank&&!exercise){
        const returnUrl=`/module-practice/${lesson.lessonId.replace(/^LS-(\d+).*/, 'MOD-$1')}/${encodeURIComponent(lesson.id)}`;
        return <div className="min-h-screen bg-bg-primary text-text-primary"><PracticeHeader lessonTitle={lesson.title} roadmapId={roadmapId}/><main className="max-w-4xl mx-auto p-6"><h1 className="text-xl font-bold">Chưa có bài tập ở lựa chọn này</h1><p role="status" className="text-sm text-text-secondary">Hãy quay lại bộ bài để xem các lựa chọn luyện tập khác.</p><Link to={returnUrl} className="text-accent-custom underline">Về bộ bài luyện tập</Link></main></div>;
    }

    const suggested=recommendation.state.value&&hasPracticeSelection(recommendation.state.value)?recommendation.state.value:null;
    const isCpp = lesson?.lessonId?.startsWith('CPP-') || /#include\s*<|std::/i.test(code);
    const isSql = !isCpp && (lesson?.lessonId?.startsWith('SQL-') || /SELECT|FROM/i.test(code));
    const isJs = !isCpp && !isSql && (lesson?.lessonId?.startsWith('JS-') || /console\.log|function\s*\(|let\s+|const\s+/i.test(code));

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col font-sans select-none overflow-hidden h-screen transition-colors duration-200">
            {/* 1. Header Component */}
            <PracticeHeader lessonTitle={lesson.title} roadmapId={roadmapId} />

            {hasRecommendation&&<div className="shrink-0 max-h-[40vh] overflow-y-auto px-2 pt-2"><PracticeRecommendationCard state={recommendation.state} compact={compact} disabled={isRunning||isSubmitting||isSelectingNext}
                onRetry={()=>void refreshRecommendation(lesson,passedVersionsRef.current,id)}
                onOpen={adaptiveMode?()=>void handleNextExercise():suggested?()=>navigate(`/practice/${encodeURIComponent(id||'')}?adaptive=1&exerciseId=${encodeURIComponent(suggested.exerciseId)}`):undefined}
                manualHref={`/practice/${encodeURIComponent(id||'')}${exercise?`?exerciseId=${encodeURIComponent(exercise.id)}`:''}`}/></div>}

            {/* 2. Split Panels Container */}
            <main className="flex-1 overflow-hidden p-2">
                <PanelGroup direction={compact?'vertical':'horizontal'}>
                    {/* Cột Trái: Đề bài & Lịch sử nộp bài */}
                    <Panel defaultSize={35} minSize={25}>
                        <ProblemDescriptionPanel
                            lessonId={id || ''}
                            adaptiveMode={adaptiveMode}
                            exercises={exercises}
                            currentExerciseIdx={currentExerciseIdx}
                            exercise={exercise}
                            completedExercises={completedExercises}
                            activeLeftTab={activeLeftTab}
                            submissions={submissions}
                            isBusy={isRunning||isSubmitting}
                            onSelectExercise={selectExercise}
                            onTabChange={handleLeftTab}
                            onRestoreCode={handleCodeChange}
                        />
                    </Panel>

                    {/* Thanh kéo chia chiều rộng */}
                    <PanelResizeHandle className={compact?'h-1.5 bg-transparent hover:bg-accent-custom/30 cursor-row-resize rounded':'w-1.5 hover:w-2 bg-transparent hover:bg-accent-custom/30 cursor-col-resize rounded'} />

                    {/* Cột Phải: Code Editor (trên) & Terminal Output (dưới) */}
                    <Panel defaultSize={65} minSize={40} className="flex flex-col h-full ml-1">
                        <PanelGroup direction="vertical">
                            {/* Khung Editor */}
                            <Panel defaultSize={65} minSize={30}>
                                <CodeEditorPanel
                                    isSql={isSql}
                                    isCpp={isCpp}
                                    isJs={isJs}
                                    currentTheme={currentTheme}
                                    code={code}
                                    exercise={exercise}
                                    onCodeChange={handleCodeChange}
                                    onResetCode={() => exercise && handleCodeChange(exercise.starterCode)}
                                />
                            </Panel>

                            {/* Thanh kéo chia chiều cao */}
                            <PanelResizeHandle className="h-1.5 hover:h-2 bg-transparent hover:bg-accent-custom/30 transition-all cursor-row-resize rounded" />

                            {/* Khung Terminal & Console Output */}
                            <Panel defaultSize={35} minSize={20}>
                                <TerminalPanel
                                    activeTerminalTab={activeTerminalTab}
                                    consoleOutput={consoleOutput}
                                    submitStats={submitStats}
                                    testcaseResults={testcaseResults}
                                    customInput={customInput}
                                    exercise={exercise}
                                    exercisesCount={exercises.length}
                                    currentExerciseIdx={currentExerciseIdx}
                                    completedExercises={completedExercises}
                                    isCompleted={isCompleted}
                                    nextLessonId={lesson?.nextLessonId}
                                    roadmapId={roadmapId}
                                    isRunning={isRunning}
                                    isSubmitting={isSubmitting}
                                    adaptiveMode={adaptiveMode}
                                    adaptiveComplete={adaptiveComplete}
                                    isSelectingNext={isSelectingNext}
                                    onTabChange={setActiveTerminalTab}
                                    onCustomInputChange={setCustomInput}
                                    onRunCode={handleRunCode}
                                    onSubmitCode={handleSubmitCode}
                                    onNextExercise={handleNextExercise}
                                    onCompleteWithoutExercise={handleCompleteWithoutExercise}
                                />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </main>
        </div>
    );
};

export default Practice;
