# Kế Hoạch Phát Triển Tính Năng: Video Hướng Dẫn Từng Chapter (Chapter Video System)

> **Mục tiêu:** Nâng tầm trải nghiệm học tập đa giác quan (Hybrid Learning), kết hợp giữa **Video bài giảng tổng quan/thực chiến (Visual/Audio)** và **Tài liệu đọc chuyên sâu + Bài tập tương tác (Hands-on Practice)** cho từng Chapter trong khóa học.

---

## 1. Định Vị Chiến Lược & Vai Trò Của Video

Ở cấp độ **Chapter** (thay vì bài học nhỏ lẻ), Video đóng hai vai trò trọng tâm:
1. **Video Khởi động & Định hướng (Chapter Kickoff / Overview Video):**
   * **Thời lượng:** 3 – 7 phút.
   * **Nội dung:** Giảng viên giới thiệu *"Tại sao cần học chương này?"*, bức tranh tổng thể (Roadmap), sơ đồ tư duy các kiến thức sẽ đi qua, và ứng dụng thực tế trong dự án doanh nghiệp.
2. **Video Thực chiến & Case Study (Hands-on Walkthrough / Masterclass):**
   * **Thời lượng:** 15 – 30 phút.
   * **Nội dung:** Giảng viên mở công cụ (SSMS / IDE), live-coding giải quyết một bài toán thực tế tổng hợp toàn bộ kỹ năng của các bài học trong Chapter đó.

---

## 2. Thiết Kế Trải Nghiệm Người Dùng (UI / UX)

### A. Tại Trang Chi Tiết Khóa Học (`CourseDetail.tsx`):
* Mỗi thanh Accordion của từng Chapter sẽ có thêm một badge trực quan:
  * Ví dụ: `[ ▶️ Video tổng quan (5 phút) ]` hoặc nút **"Xem Video giới thiệu chương"**.
  * Khi click, hệ thống có thể mở một **Video Modal (Cinema Mode)** với nền tối cao cấp hoặc dẫn thẳng vào bài giảng Video.

### B. Tại Không Gian Học Tập (`Lesson.tsx` / `ChapterWorkspace`):
* **Hệ thống Tab chuyển đổi mượt mà:**
  * **Tab 1:** 📖 *Lý thuyết & Đọc chuyên sâu (Markdown)*
  * **Tab 2:** 🎬 *Video bài giảng của Chapter (Video Player)*
  * **Tab 3:** 💻 *Thực hành Code & Làm bài tập (Coding Workspace)*
* **Trình phát Video Player thông minh:**
  * Tùy chỉnh tốc độ phát (`0.75x`, `1x`, `1.25x`, `1.5x`, `2x`).
  * **Timestamps / Chapter Markers:** Đánh dấu mốc thời gian từng phần trong video để học viên tua nhanh đến chủ đề mong muốn.
  * **Resume Playback:** Tự động ghi nhớ thời gian học viên đang xem dở và tiếp tục khi mở lại.

---

## 3. Kiến Trúc Kỹ Thuật (Architecture & Database)

### 3.1. Thiết Kế Cơ Sở Dữ Liệu (Prisma Schema)
Mở rộng bảng `Chapter` trong `backend/src/prisma/schema.prisma`:

```prisma
model Chapter {
  id                   String    @id @default(uuid()) @db.Uuid
  chapterId            String?   @map("chapter_id")
  moduleId             String    @map("module_id") @db.Uuid
  title                String
  objective            String?
  coreKnowledge        String?   @map("core_knowledge")
  skillsAcquired       String?   @map("skills_acquired")
  orderIndex           Int       @map("order_index")
  
  // 🌟 Các trường mới dành riêng cho Chapter Video:
  videoUrl             String?   @map("video_url")           // Link video (YouTube / Vimeo / Cloudinary / HLS)
  videoTitle           String?   @map("video_title")         // Tiêu đề hiển thị của video
  videoDurationSeconds Int?      @map("video_duration")      // Thời lượng video (tính bằng giây)
  videoThumbnailUrl    String?   @map("video_thumbnail_url") // Ảnh bìa poster của video
  videoDescription     String?   @map("video_description")   // Tóm tắt nội dung video
  
  createdAt            DateTime  @default(now()) @map("created_at")
  updatedAt            DateTime  @updatedAt @map("updated_at")
  
  module               Module    @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  lessons              Lesson[]

  @@map("chapters")
}
```

### 3.2. Giải Pháp Lưu Trữ & Phát Video: MIỄN PHÍ 100% (Zero-Cost Architecture)

Để hệ thống vận hành **hoàn toàn miễn phí, không tốn 1 đồng chi phí duy trì máy chủ hay băng thông video**, chúng ta chọn giải pháp:

> 🌟 **Phương án chuẩn: YouTube Unlisted (Không công khai) + `react-player`**

* **Chi phí:** **0 VNĐ vĩnh viễn** — Không giới hạn dung lượng lưu trữ, không giới hạn số lượng học viên xem cùng lúc, không tốn băng thông server.
* **Chất lượng truyền tải:** Sử dụng toàn bộ hạ tầng CDN khổng lồ của Google, tự động điều chỉnh độ phân giải (1080p, 720p, 480p) mượt mà trên mọi đường truyền.
* **Cơ chế bảo mật (Unlisted Mode):**
  * Video được tải lên ở chế độ **"Không công khai" (Unlisted)**.
  * Video **không** hiển thị trên kênh YouTube, **không** thể tìm kiếm trên Google/YouTube Search. Chỉ hiển thị duy nhất bên trong website của chúng ta.
* **Tích hợp Frontend:**
  * Sử dụng thư viện `react-player` (nhẹ, hỗ trợ tốt, không quảng cáo chen ngang nếu kênh không bật kiếm tiền).
  * Lắng nghe các sự kiện: `onProgress` (bắt mốc thời gian), `onEnded` (tự động cộng điểm/đánh dấu hoàn thành), và `playbackRate` (chỉnh tốc độ `1.25x`, `1.5x`).

---

## 4. Tính Năng Nâng Cao Định Hướng AI (Future Enhancements)

1. **Gắn liền Tiến độ học tập (Progress Tracking):**
   * Học viên xem đạt $\ge 85\%$ thời lượng $\rightarrow$ Tự động tích xanh hoàn thành mục Video của Chapter.
2. **AI Video Assistant (Tích hợp AI Microservice sẵn có):**
   * Đặt nút **"Hỏi AI về video này"** bên cạnh video player.
   * AI dựa vào Video Transcript để giải thích ngay khái niệm mà giảng viên đang nói tại phút thứ `03:45`.

---

## 5. Lộ Trình Triển Khai Chi Tiết (Implementation Roadmap)

| Giai đoạn | Nhiệm vụ kỹ thuật | Kết quả đầu ra |
| :--- | :--- | :--- |
| **P1: Database & Backend** | • Cập nhật `schema.prisma`<br>• Chạy `npx prisma db push` / `migrate`<br>• Cập nhật `courseController.ts` trả về trường video của Chapter. | API Backend trả về đầy đủ metadata video cho từng Chapter. |
| **P2: Frontend Video Component** | • Cài đặt `react-player`<br>• Xây dựng Component `ChapterVideoModal.tsx` & `ChapterVideoPlayer.tsx`<br>• Thiết kế giao diện Dark Mode đồng bộ. | Trình phát video mượt mà, hỗ trợ tua, đổi tốc độ và timestamps. |
| **P3: Tích hợp Giao diện** | • Gắn nút xem video vào `CourseDetail.tsx`<br>• Tích hợp Tab xem video trong `Lesson.tsx`. | Học viên dễ dàng truy cập video ở cả trang lộ trình và phòng học. |
| **P4: Seed Dữ liệu & Nghiệm thu** | • Cập nhật kịch bản Seed nạp link video thực tế cho Chapter 1<br>• Kiểm thử đa thiết bị (Desktop & Mobile). | Hoàn thành trọn vẹn tính năng sẵn sàng phục vụ học viên. |
