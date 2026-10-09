import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../src/infrastructure/database/prisma';

async function main() {
  const targetLessonId = 'd2b13581-b3bb-4e8d-86c8-cfa8586003bd';
  const markdownPath = path.resolve(__dirname, '../../docs/Dữ liệu nội dung bài học/Python/Cấu trúc bài học/Chapter 05/Lession1.md');
  const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

  console.log('=== 1. CẬP NHẬT NỘI DUNG BÀI HỌC (LOẠI BỎ TRẮC NGHIỆM KHỎI CONTENT) ===');
  await prisma.lesson.update({
    where: { id: targetLessonId },
    data: {
      content: markdownContent,
      updatedAt: new Date()
    }
  });
  console.log('✅ Đã cập nhật xong nội dung lý thuyết thuần túy vào bảng lessons.');

  console.log('=== 2. ĐỒNG BỘ NỘI DUNG VÀO FILE SEED seed_course_data.json ===');
  const seedPath = path.resolve(__dirname, '../prisma/seed/seed_course_data.json');
  if (fs.existsSync(seedPath)) {
    const rawData = fs.readFileSync(seedPath, 'utf-8');
    const courseData = JSON.parse(rawData);
    for (const mod of courseData) {
      if (mod.chapters) {
        for (const chap of mod.chapters) {
          if (chap.lessons) {
            for (const les of chap.lessons) {
              if (les.id === targetLessonId || les.lessonId === 'LS-03.01') {
                les.content = markdownContent;
                les.updatedAt = new Date().toISOString();
                break;
              }
            }
          }
        }
      }
    }
    fs.writeFileSync(seedPath, JSON.stringify(courseData, null, 2), 'utf-8');
    console.log('✅ Đã đồng bộ vào seed_course_data.json.');
  }

  console.log('=== 3. CHUYỂN TOÀN BỘ CÂU HỎI TRẮC NGHIỆM VÀO BẢNG lesson_quiz_questions ===');
  // Xóa các câu hỏi cũ nếu có
  await prisma.lessonQuizOption.deleteMany({
    where: {
      question: { lessonId: targetLessonId }
    }
  });
  await prisma.lessonQuizQuestion.deleteMany({
    where: { lessonId: targetLessonId }
  });

  // Danh sách các câu hỏi trắc nghiệm chuẩn sư phạm cho Lesson 3.1
  const quizData = [
    {
      orderIndex: 1,
      level: 'EASY',
      question: 'Trong các tình huống sau đây, tình huống nào mang bản chất của một thao tác lặp lại nhiều lần?',
      explanation: 'Hành động gửi tin nhắn 30 lần cho 30 người là một thao tác lặp lại cùng một công việc nhiều lần. Các phương án còn lại chỉ là hành động đơn lẻ diễn ra một lần.',
      options: [
        { key: 'A', text: 'Nhấn công tắc để bật đèn phòng khách khi trời tối.', isCorrect: false },
        { key: 'B', text: 'Gửi tin nhắn thông báo họp đến từng người trong danh bạ 30 đồng nghiệp.', isCorrect: true },
        { key: 'C', text: 'Tắt máy tính khi kết thúc một ngày làm việc.', isCorrect: false },
        { key: 'D', text: 'Cắm sạc điện thoại khi máy báo pin yếu.', isCorrect: false }
      ]
    },
    {
      orderIndex: 2,
      level: 'EASY',
      question: 'Tại sao trong lập trình ta không nên sao chép (copy - paste) một câu lệnh giống nhau nhiều lần bằng tay?',
      explanation: 'Việc copy-paste thủ công khiến mã nguồn cồng kềnh, dễ gõ nhầm số lần lặp và khi cần sửa đổi nội dung ta phải sửa ở rất nhiều chỗ, dễ gây sai sót.',
      options: [
        { key: 'A', text: 'Vì máy tính không thể thực thi được các dòng lệnh giống nhau.', isCorrect: false },
        { key: 'B', text: 'Vì làm chương trình dài dòng, dễ nhầm lẫn số lần lặp và rất khó chỉnh sửa khi có thay đổi.', isCorrect: true },
        { key: 'C', text: 'Vì Python sẽ báo lỗi cú pháp ngay khi phát hiện 2 dòng lệnh giống hệt nhau.', isCorrect: false },
        { key: 'D', text: 'Vì sẽ làm máy tính bị quá tải bộ nhớ RAM ngay lập tức.', isCorrect: false }
      ]
    },
    {
      orderIndex: 3,
      level: 'MEDIUM',
      question: 'Cho yêu cầu: "Đếm từ 1 đến 5 và đọc to từng số". Cách mô tả nào dưới đây thể hiện đúng tư duy của một thao tác lặp?',
      explanation: 'Cách mô tả B chỉ rõ điểm bắt đầu (số 1), hành động lặp (đọc số, tăng 1) và điều kiện dừng (khi chạm mốc 5), đây chính là tư duy cốt lõi của một vòng lặp.',
      options: [
        { key: 'A', text: 'Đọc số 1, đọc số 2, đọc số 3, đọc số 4, đọc số 5.', isCorrect: false },
        { key: 'B', text: 'Bắt đầu từ số 1. Lặp lại hành động: Đọc số hiện tại, sau đó tăng thêm 1 cho đến khi chạm mốc số 5 thì dừng lại.', isCorrect: true },
        { key: 'C', text: 'Đọc ngẫu nhiên một số bất kỳ từ 1 đến 5.', isCorrect: false },
        { key: 'D', text: 'Chờ đợi máy tính tự động đếm từ 1 đến 5.', isCorrect: false }
      ]
    },
    {
      orderIndex: 4,
      level: 'MEDIUM',
      question: 'Khi cần tính tổng điểm của 50 học sinh trong lớp, lợi ích lớn nhất của việc áp dụng tư duy vòng lặp là gì?',
      explanation: 'Nhờ vòng lặp, đoạn mã của chúng ta vẫn cực kỳ ngắn gọn vì chỉ cần viết quy trình một lần cho 1 học sinh và giao cho máy tính tự lặp lại cho 50, 500 hay 5.000 học sinh.',
      options: [
        { key: 'A', text: 'Chỉ cần mô tả quy trình nhập và cộng điểm cho 1 học sinh, sau đó yêu cầu máy tính tự lặp lại 50 lần.', isCorrect: true },
        { key: 'B', text: 'Buộc phải khai báo 50 biến riêng biệt (diem1, diem2, ..., diem50) trong chương trình.', isCorrect: false },
        { key: 'C', text: 'Giúp điểm thi của học sinh tự động tăng thêm mà không cần nhập liệu.', isCorrect: false },
        { key: 'D', text: 'Làm cho chương trình dài thêm 50 dòng lệnh để dễ đọc hơn.', isCorrect: false }
      ]
    }
  ];

  for (const q of quizData) {
    const createdQ = await prisma.lessonQuizQuestion.create({
      data: {
        lessonId: targetLessonId,
        question: q.question,
        level: q.level,
        explanation: q.explanation,
        orderIndex: q.orderIndex,
        options: {
          create: q.options.map(opt => ({
            key: opt.key,
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        }
      },
      include: {
        options: true
      }
    });
    console.log(`  ➕ Đã thêm câu hỏi trắc nghiệm #${q.orderIndex}: "${q.question.slice(0, 45)}..." với ${createdQ.options.length} lựa chọn.`);
  }

  console.log('\n=== 4. KIỂM TRA LẠI DỮ LIỆU TỔNG THỂ ===');
  const countQuizzes = await prisma.lessonQuizQuestion.count({
    where: { lessonId: targetLessonId }
  });
  console.log(`✅ Tổng số câu hỏi trắc nghiệm đã nạp vào DB cho Lesson 3.1: ${countQuizzes}`);

  process.exit(0);
}

main().catch(err => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
