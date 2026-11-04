import {useEffect,useState} from 'react';
import {useParams,useNavigate,Link} from 'react-router-dom';
import {authService} from '../../../services/authService';
import AppNavbar from '../../../components/AppNavbar';
import {usePracticeRecommendation} from '../hooks/usePracticeRecommendation';
import {PracticeRecommendationCard} from '../components/PracticeRecommendationCard';
import {hasPracticeSelection} from '../services/modulePracticeContracts';
import type {PracticeBank,Difficulty} from '../services/modulePracticeContracts';
interface DBLesson extends PracticeBank {title:string}
const tiers:{difficulty:Difficulty;title:string;description:string}[]=[
    {difficulty:'EASY',title:'Củng cố nền tảng',description:'Luyện những thao tác cơ bản và làm quen với cách giải bài.'},
    {difficulty:'MEDIUM',title:'Ứng dụng tư duy',description:'Kết hợp kiến thức và luyện cách tổ chức lời giải.'},
    {difficulty:'HARD',title:'Thử thách nâng cao',description:'Thực hành các bài cần nhiều bước xử lý và phân tích.'},
];
export default function ModulePracticeSelect(){
    const {lessonId}=useParams(),navigate=useNavigate();
    const [lesson,setLesson]=useState<DBLesson|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
    const {state,refresh,invalidate}=usePracticeRecommendation(lessonId||'');
    useEffect(()=>{
        const controller=new AbortController();let active=true;
        const load=async()=>{
            setLoading(true);setError('');setLesson(null);invalidate();
            if(!lessonId){setError('Không tìm thấy bộ bài.');setLoading(false);return;}
            try{
                const data:DBLesson=await authService.getLessonDetail(lessonId,controller.signal);if(!active)return;
                setLesson(data);setLoading(false);void refresh(data,new Map(),lessonId);
            }catch{if(active){setError('Không thể tải bộ bài. Hãy quay lại khóa học hoặc thử lại.');setLoading(false);}}
        };
        void load();return()=>{active=false;controller.abort();};
    },[lessonId,refresh,invalidate]);
    if(loading)return <main className="min-h-screen bg-bg-primary text-text-primary grid place-items-center"><p role="status">Đang tải bộ bài luyện tập…</p></main>;
    if(error||!lesson)return <main className="min-h-screen bg-bg-primary text-text-primary grid place-items-center p-6"><div><p role="alert">{error||'Không tìm thấy bộ bài.'}</p><Link to="/dashboard" className="text-accent-custom underline">Về khóa học</Link></div></main>;
    const selected=state.value&&hasPracticeSelection(state.value)?state.value:null;
    const denied=state.error==='ACCESS_DENIED'||state.error==='BANK_NOT_FOUND'||state.error==='AUTH_REQUIRED'||state.error==='BANK_CONTEXT_CHANGED';
    return <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
        <AppNavbar/>
        <nav aria-label="Vị trí hiện tại" className="border-b border-border-custom px-5 py-4 text-sm text-text-secondary"><Link to="/dashboard" className="text-accent-custom">Khóa học</Link><span aria-hidden="true"> / </span>{lesson.title}</nav>
        <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12 flex flex-col gap-7">
            <header><p className="text-xs font-bold text-accent-custom uppercase tracking-wide">Luyện tập tổng hợp</p><h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">{lesson.title}</h1><p className="text-sm sm:text-base text-text-secondary">Bắt đầu với bài được gợi ý hoặc tự chọn mức luyện tập.</p></header>
            <PracticeRecommendationCard state={state} onRetry={()=>void refresh(lesson,new Map(),lessonId)} manualHref={lesson.codingExercises?.length?`/practice/${encodeURIComponent(lesson.id)}`:undefined}
                onOpen={selected?()=>navigate(`/practice/${encodeURIComponent(lesson.id)}?adaptive=1&exerciseId=${encodeURIComponent(selected.exerciseId)}`):undefined}/>
            {!denied&&<section aria-label="Tự chọn độ khó" className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {tiers.map(tier=>{const count=lesson.codingExercises?.filter(e=>e.difficulty===tier.difficulty).length||0;return <article key={tier.difficulty} className="rounded-2xl border border-border-custom bg-bg-secondary p-6 flex flex-col gap-4">
                    <p className="text-xs font-bold text-accent-custom m-0">{tier.difficulty==='EASY'?'Dễ':tier.difficulty==='MEDIUM'?'Trung bình':'Khó'} · {count} bài</p>
                    <h2 className="text-lg font-bold m-0">{tier.title}</h2><p className="text-sm leading-relaxed text-text-secondary flex-1 m-0">{tier.description}</p>
                    <button type="button" disabled={!count} onClick={()=>navigate(`/practice/${encodeURIComponent(lesson.id)}?difficulty=${tier.difficulty}`)} className="min-h-11 rounded-xl bg-bg-tertiary border border-border-custom px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-custom disabled:opacity-50 disabled:cursor-not-allowed">{count?'Chọn bài '+(tier.difficulty==='EASY'?'dễ':tier.difficulty==='MEDIUM'?'trung bình':'khó'):'Chưa có bài ở mức này'}</button>
                </article>;})}
            </section>}
            <Link to="/dashboard" className="text-sm text-text-secondary underline min-h-11 inline-flex items-center">Về khóa học</Link>
        </main>
    </div>;
}
