/** Thông điệp cho học viên khi nộp bài nhưng chưa có kết quả chấm hợp lệ; không hiện mã nội bộ (GRADER_UNAVAILABLE, ...). */
const KNOWN: Record<string, string> = {
    GRADER_UNAVAILABLE: 'Dịch vụ chấm bài tạm thời không phản hồi. Hãy giữ nguyên mã và bấm “Nộp Bài & Chấm Điểm” lại sau ít phút.',
    GRADING_UNAVAILABLE: 'Dịch vụ chấm bài tạm thời không phản hồi. Hãy giữ nguyên mã và bấm “Nộp Bài & Chấm Điểm” lại sau ít phút.',
    SUBMISSION_IN_PROGRESS: 'Lượt nộp trước vẫn đang được chấm. Hãy đợi kết quả rồi nộp lại.',
    SUBMISSION_ID_CONFLICT: 'Lượt nộp này trùng với một lượt khác. Hãy bấm nộp lại.',
    EXERCISE_NOT_PUBLISHED: 'Bài tập này chưa sẵn sàng để chấm. Hãy mở lại bài từ AI Tutor.',
    INVALID_SUBMISSION_ID: 'Không gửi được bài làm. Hãy tải lại trang rồi nộp lại.',
};

export function submissionErrorText(error: unknown): string {
    const value = typeof error === 'string' ? error.trim() : '';
    if (KNOWN[value]) return KNOWN[value];
    // Câu tiếng Việt từ máy chủ thì giữ; mã nội bộ hoặc chuỗi rỗng thì dùng câu chung.
    if (value && /\s/.test(value) && !/^[A-Z0-9_:.-]+$/.test(value)) return value;
    return 'Chưa nhận được kết quả chấm hợp lệ. Hãy giữ nguyên mã và thử nộp lại sau ít phút.';
}
