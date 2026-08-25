export interface QuizQuestion {
    id: string;
    question: string;
    level?: string;
    options: {
        key: string;
        text: string;
    }[];
    correctAnswer: string; // 'A' | 'B' | 'C' | 'D'
    explanation: string;
}

export const extractQuizFromMarkdown = (markdown: string): QuizQuestion[] => {
    if (!markdown) return [];

    const questions: QuizQuestion[] = [];

    // Tìm tất cả các block trắc nghiệm dạng:
    // ### 🎯 Level 1: ... hoặc ### 🎯 Câu hỏi ... hoặc ### 🎯 ...
    const quizRegex = /###\s*🎯\s*([^\n]+)\n+([\s\S]*?)(?=(?:\n###\s*|\n##\s*|\n---\s*|$))/g;
    let match;

    let index = 1;
    while ((match = quizRegex.exec(markdown)) !== null) {
        const title = match[1].trim();
        const blockContent = match[2].trim();

        // Tìm các options A, B, C, D
        const options: { key: string; text: string }[] = [];
        const optionRegex = /(?:^|\n)\s*[-*]\s*([A-D])\.\s*([\s\S]*?)(?=(?:\n\s*[-*]\s*[A-D]\.|\n\s*\*\(|\n\s*\(|\n\s*Đáp án|$))/g;
        let optMatch;

        while ((optMatch = optionRegex.exec(blockContent)) !== null) {
            options.push({
                key: optMatch[1].trim(),
                text: optMatch[2].trim().replace(/\n+/g, ' ')
            });
        }

        if (options.length >= 2) {
            // Tìm đáp án đúng và giải thích
            // Dạng: *(Đáp án đúng: **C** - Vì cả 2 phía...)* hoặc (Đáp án: B...)
            const ansMatch = /(?:\*\(|\()?\s*Đáp án\s*(?:đúng)?\s*:\s*\**([A-D])\**\s*[-–—:]?\s*([\s\S]*?)(?:\)\*|\)|$)/i.exec(blockContent);
            const correctAnswer = ansMatch ? ansMatch[1].toUpperCase().trim() : 'A';
            const rawExplanation = ansMatch && ansMatch[2] ? ansMatch[2].replace(/\)\*$/, '').replace(/\)$/, '').trim() : '';

            // Lấy nội dung câu hỏi (bỏ phần options và đáp án)
            let questionText = blockContent.split(/[-*]\s*[A-D]\./)[0].trim();

            questions.push({
                id: `quiz_${index}`,
                question: questionText,
                level: title,
                options,
                correctAnswer,
                explanation: rawExplanation || 'Chúc mừng bạn đã chọn chính xác!'
            });
            index++;
        }
    }

    return questions;
};

/**
 * Loại bỏ toàn bộ phần "Thực hành phân bậc (Scaffolded Practice)" và các Level 1, 2, 3
 * ra khỏi Markdown lý thuyết để trang đọc lý thuyết thuần khiết và tập trung 100% vào kiến thức.
 * Các phần trắc nghiệm và thực hành code sẽ được chuyển riêng sang màn hình Trắc nghiệm và Workspace thực hành.
 */
export const stripQuizSectionFromMarkdown = (markdown: string): string => {
    if (!markdown) return '';

    let cleaned = markdown;

    // 1. Loại bỏ toàn bộ phần "## [Số]. Thực hành phân bậc (Scaffolded Practice)" cho đến heading ## kế tiếp hoặc kết thúc bài
    cleaned = cleaned.replace(/##\s*(?:\d+\.?\s*)?Thực hành phân bậc[\s\S]*?(?=(?:\n##\s*\d|\n##\s*[A-ZÀ-Ỹ]|\n---\s*\n##\s*|$))/gi, '');

    // 2. Loại bỏ các block Level 1 / Level 2 / Level 3 lẻ nếu còn
    cleaned = cleaned.replace(/###\s*(?:🎯\s*)?Level\s*\d+[\s\S]*?(?=(?:\n###\s*|\n##\s*|\n---\s*\n##\s*|$))/gi, '');

    // 3. Dọn dẹp các đường phân cách --- thừa hoặc khoảng trắng liên tiếp ở cuối
    cleaned = cleaned.replace(/(\n---\s*){2,}/g, '\n---\n');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    return cleaned.trim();
};
