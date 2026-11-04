import {Link} from 'react-router-dom';
import {hasPracticeSelection,isPythonPracticeDecision,isPilotRecommendation,recommendationReason,recommendationErrorText} from '../services/modulePracticeContracts';
import type {PracticeRecommendationState} from '../hooks/usePracticeRecommendation';
interface Props {state:PracticeRecommendationState;onRetry:()=>void;onOpen?:()=>void;manualHref?:string;disabled?:boolean;compact?:boolean}
const action='inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-custom disabled:opacity-50 disabled:cursor-not-allowed';
export function PracticeRecommendationCard({state,onRetry,onOpen,manualHref,disabled=false,compact=false}:Props){
    const value=state.value,selected=value&&hasPracticeSelection(value)?value:null;
    const blocked=state.error==='AUTH_REQUIRED'||state.error==='ACCESS_DENIED'||state.error==='BANK_NOT_FOUND'||state.error==='BANK_CONTEXT_CHANGED';
    const python=value&&isPythonPracticeDecision(value)?value:null;
    const loading=state.status==='loading';
    return <section aria-label="Bài phù hợp tiếp theo" aria-busy={loading} className={`rounded-2xl border border-accent-border bg-accent-bg/30 text-left font-sans ${compact?'p-3':'p-5 sm:p-6'}`}>
        <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between ${compact?'gap-2':'gap-4'}`}>
            <div className="min-w-0 flex-1" aria-live="polite" aria-atomic="true">
                <p className="text-xs font-bold uppercase tracking-wide text-accent-custom m-0">{python?.mode==='PALNET_ADVISORY'?'Gợi ý AI · Thử nghiệm':python?.mode==='RULE_BASED'?'Luyện tập theo quy tắc':'Bài phù hợp tiếp theo'}</p>
                {state.status==='idle'?<p className="text-sm text-text-secondary mt-2 mb-0" role="status">{disabled?'Đề xuất sẽ được cập nhật sau khi có kết quả chấm.':'Làm mới để xem đề xuất hiện tại.'}</p>:loading?<p className="text-sm text-text-secondary mt-2 mb-0" role="status">Đang cập nhật đề xuất bài tập…</p>:state.status==='error'?<p role="alert" className="text-sm text-text-secondary mt-2 mb-0">{recommendationErrorText(state.error||'SERVICE_UNAVAILABLE')}</p>:<>
                    <h2 className={`font-bold text-text-primary break-words ${compact?'text-base mt-1 mb-1':'text-lg sm:text-xl mt-2 mb-2'}`}>{selected?.title||(value?.mode==='COMPLETE'?'Bạn đã hoàn thành bộ bài':'Chọn bài để tiếp tục luyện tập')}</h2>
                    {selected&&!compact&&<p className="text-sm text-text-secondary m-0">Mức {selected.difficulty==='EASY'?'Dễ':selected.difficulty==='MEDIUM'?'Trung bình':'Khó'}</p>}
                    <p className={`${compact?'text-xs mt-1':'text-sm mt-2'} leading-relaxed text-text-secondary mb-0`}>{value&&isPilotRecommendation(value)?'Gợi ý luyện tập từ lịch sử làm bài cùng ngôn ngữ.':recommendationReason(value&&'reason'in value?value.reason:'')}</p>
                    {!compact&&python?.mode==='PALNET_ADVISORY'&&<p className="text-xs leading-relaxed text-text-tertiary mt-3 mb-0">Dự đoán làm đúng lần đầu theo kỹ năng: <strong className="text-text-primary">{Math.round(python.predictedCorrectness!*100)}%</strong>. Điểm mang tính tham khảo, không phải mức độ thành thạo.</p>}
                    {!compact&&python&&python.totalCount>0&&<p className="text-xs text-text-tertiary mt-2 mb-0">Đã xác minh hoàn thành {python.passedCount}/{python.totalCount} bài.{python.quarantinedCount>0?` ${python.quarantinedCount} bài cần luyện thủ công hoặc xác minh thêm.`:''}</p>}
                </>}
            </div>
            <div className="flex flex-wrap gap-2 shrink-0 sm:max-w-64">
                {selected&&onOpen&&<button type="button" className={`${action} bg-accent-custom text-white dark:text-[#030303]`} disabled={disabled||loading} onClick={onOpen}>{python?.reason==='RETRY_RULE'?'Luyện lại bài này':'Mở bài được gợi ý →'}</button>}
                {!loading&&<button type="button" className={`${action} bg-bg-secondary border border-border-custom text-text-primary`} onClick={onRetry} disabled={disabled}>Làm mới đề xuất</button>}
                {blocked?state.error==='AUTH_REQUIRED'?<Link className={`${action} text-accent-custom underline`} to="/login">Đăng nhập</Link>:null:manualHref?<Link className={`${action} text-text-secondary underline`} to={manualHref}>Chọn bài thủ công</Link>:null}
            </div>
        </div>
    </section>;
}
