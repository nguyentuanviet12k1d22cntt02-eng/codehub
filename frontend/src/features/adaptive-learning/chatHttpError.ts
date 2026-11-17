/**
 * Lỗi HTTP khi gửi tin cho AI Tutor, kèm thông điệp tiếng Việt dành cho học viên.
 * Không hiện mã kỹ thuật (409 Conflict, ...) và không gọi nhầm mọi lỗi là "kết nối gián đoạn".
 */
export class ChatHttpError extends Error {
    readonly status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = 'ChatHttpError';
        this.status = status;
    }
}

const readable = (value: unknown): string | null =>
    typeof value === 'string' && /\s/.test(value.trim()) && !/^[A-Z0-9_]+$/.test(value.trim()) ? value.trim() : null;

export function chatHttpErrorMessage(status: number, payload: any = {}): string {
    const fromServer = readable(payload?.message) || readable(payload?.error);
    // 409: server có câu hướng dẫn riêng (vd lượt trước đang tự tiếp tục) thì dùng; còn lại một câu chung, không lặp ý.
    if (status === 409) return readable(payload?.message)
        || 'Yêu cầu trước trong cuộc trò chuyện này vẫn đang được xử lý. Bạn hãy đợi kết quả (có thể tải lại trang để xem) rồi gửi tiếp.';
    if (status === 423) return 'AI Tutor đang được quản trị viên tạm khóa. Bạn vẫn có thể tiếp tục học các bài học và bài tập khác.';
    if (status === 429) return 'AI Tutor đang nhận quá nhiều yêu cầu. Bạn vui lòng thử lại sau ít phút.';
    if (status === 401 || status === 403) return 'Phiên đăng nhập đã hết hạn. Bạn vui lòng đăng nhập lại.';
    if (status === 400) return fromServer || 'Tin nhắn chưa hợp lệ (cần từ 1 đến 6.000 ký tự).';
    if (status === 404) return 'Không tìm thấy cuộc trò chuyện này. Bạn hãy mở đoạn chat mới.';
    if (status >= 500) return 'Máy chủ AI Tutor đang gặp sự cố. Bạn vui lòng thử lại sau ít phút.';
    return fromServer || 'AI Tutor chưa xử lý được yêu cầu. Bạn vui lòng thử lại.';
}
