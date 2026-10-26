const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Danh sách username cần xóa để cập nhật lại email chuẩn
const TARGET_USERNAMES = [
  "Mèo Lười Học Code", "Hoàng Nam", "Bắp Cải Nhỏ", "quocbao_it", "Thùy Linh",
  "Gấu Béo 2k4", "Bích Ngọc", "Kira_2004", "Trà Sữa Full Thạch", "Thế Vinh",
  "ZunZun", "tung_phan04", "Ánh Tuyết", "cáo_ngốc", "Thiên Hương",
  "Pikachu_dev", "Hải Yến", "tuankiet_tk", "Cẩm Tú", "Chó Con Lon Ton",
  "Ngọc Ánh", "Văn Phúc", "Bé Heo Cute", "Minh Trí", "Hà My",
  "shironeko", "Kim Ngân", "khoaitaylac", "Khánh Linh", "Nhật Minh",
  "Cà Phê Muối", "Quỳnh Như", "Tấn Phát", "Nắng Mùa Hạ", "Văn Đạt",
  "Thảo Vy", "Thỏ Bảy Màu", "Mỹ Duyên", "dinhkhang_dk", "Thu Trang",
  "Bạch Tuộc Biết Bơi", "Thảo Nguyên", "Quốc Anh", "Minh Châu", "Gió Đầu Mùa",
  "Diệu Linh", "Trường Giang", "Bảo Trâm", "Cậu Bé Bút Chì", "Hải Lam",
  "Minh Thông", "Kem Dâu Tây", "Đức Nhân", "Cát Tường", "Đình Phong",
  "Hồng Hạnh", "zenith_coder", "Mai Khanh", "Hữu Tài", "Thu Thủy",
  "Quốc Cường", "Bé Đậu Đậu", "Gia Bảo", "Ngọc Mai", "Thành Đạt",
  "Kiều Oanh", "Quang Huy", "Bích Phương", "Thành Trung", "Thanh Thảo"
];

// Danh sách 70 học viên với email bỏ dấu chấm (chỉ giữ lại 5 email có dấu chấm)
const STUDENTS_CLEAN_EMAIL = [
  // --- Đợt 1: Cuối tháng 8/2026 ---
  { username: "Mèo Lười Học Code", email: "meoluoicode2004@gmail.com", gender: "FEMALE", date: "2026-08-28T09:14:22" },
  { username: "Hoàng Nam", email: "hoangnamdev2k4@gmail.com", gender: "MALE", date: "2026-08-28T14:35:10" },
  { username: "Bắp Cải Nhỏ", email: "bapcainho99@gmail.com", gender: "FEMALE", date: "2026-08-29T10:20:45" },
  { username: "quocbao_it", email: "baolequoc2004@gmail.com", gender: "MALE", date: "2026-08-29T16:42:18" },
  { username: "Thùy Linh", email: "thuylinhpt2004@gmail.com", gender: "FEMALE", date: "2026-08-30T08:50:33" },
  { username: "Gấu Béo 2k4", email: "gaubeo2k4it@gmail.com", gender: "MALE", date: "2026-08-30T19:15:05" },
  { username: "Bích Ngọc", email: "bichngocvo04@gmail.com", gender: "FEMALE", date: "2026-08-31T11:05:40" },
  { username: "Kira_2004", email: "kiranguyen2004@gmail.com", gender: "MALE", date: "2026-08-31T20:30:12" },

  // --- Đợt 2: Đầu tháng 9/2026 ---
  { username: "Trà Sữa Full Thạch", email: "trasuafulltopping04@gmail.com", gender: "FEMALE", date: "2026-09-02T13:25:50" },
  { username: "Thế Vinh", email: "vinhbuithe04@gmail.com", gender: "MALE", date: "2026-09-02T15:40:22" },
  { username: "ZunZun", email: "zunzunnguyen2004@gmail.com", gender: "FEMALE", date: "2026-09-03T09:10:15" },
  { username: "tung_phan04", email: "tungphan04@gmail.com", gender: "MALE", date: "2026-09-03T18:22:45" },
  { username: "Ánh Tuyết", email: "anhtuyetduong04@gmail.com", gender: "FEMALE", date: "2026-09-04T10:45:30" },
  { username: "cáo_ngốc", email: "caongocle2k4@gmail.com", gender: "MALE", date: "2026-09-04T14:12:08" },
  { username: "Thiên Hương", email: "thienhuongly03@gmail.com", gender: "FEMALE", date: "2026-09-05T08:30:40" },
  { username: "Pikachu_dev", email: "pikachucoder2004@gmail.com", gender: "MALE", date: "2026-09-05T21:18:35" },
  { username: "Hải Yến", email: "haiyennguyen2k4@gmail.com", gender: "FEMALE", date: "2026-09-06T11:20:19" },
  { username: "tuankiet_tk", email: "tuankietdinh04@gmail.com", gender: "MALE", date: "2026-09-06T16:05:42" },
  { username: "Cẩm Tú", email: "camtule2k4@gmail.com", gender: "FEMALE", date: "2026-09-07T10:15:25" },
  { username: "Chó Con Lon Ton", email: "choconlonton04@gmail.com", gender: "MALE", date: "2026-09-07T19:55:10" },

  // --- Đợt 3: Giữa tháng 9/2026 ---
  { username: "Ngọc Ánh", email: "ngocanhvu2004@gmail.com", gender: "FEMALE", date: "2026-09-09T09:40:12" },
  { username: "Văn Phúc", email: "phucmaivan04@gmail.com", gender: "MALE", date: "2026-09-09T15:25:30" },
  { username: "Bé Heo Cute", email: "beheocutepham04@gmail.com", gender: "FEMALE", date: "2026-09-10T11:10:05" },
  { username: "Minh Trí", email: "minhtri.doan2k4@gmail.com", gender: "MALE", date: "2026-09-11T14:32:18" }, // có dấu chấm
  { username: "Hà My", email: "hamypham2k4@gmail.com", gender: "FEMALE", date: "2026-09-12T08:45:50" },
  { username: "shironeko", email: "shironekotran04@gmail.com", gender: "MALE", date: "2026-09-13T17:15:22" },
  { username: "Kim Ngân", email: "kimngannguyen04@gmail.com", gender: "FEMALE", date: "2026-09-14T10:05:40" },
  { username: "khoaitaylac", email: "khoaitaylacdev04@gmail.com", gender: "MALE", date: "2026-09-14T20:40:15" },
  { username: "Khánh Linh", email: "khanhlinhvo2k4@gmail.com", gender: "FEMALE", date: "2026-09-15T09:18:25" },
  { username: "Nhật Minh", email: "nhatminhhoang2k4@gmail.com", gender: "MALE", date: "2026-09-15T15:50:33" },

  // --- Đợt 4: Cuối tháng 9/2026 ---
  { username: "Cà Phê Muối", email: "caphemuoidang04@gmail.com", gender: "MALE", date: "2026-09-17T11:22:10" },
  { username: "Quỳnh Như", email: "quynhnhudo04@gmail.com", gender: "FEMALE", date: "2026-09-18T16:15:45" },
  { username: "Tấn Phát", email: "tanphathuynh2k4@gmail.com", gender: "MALE", date: "2026-09-19T08:35:20" },
  { username: "Nắng Mùa Hạ", email: "nangmuahabui04@gmail.com", gender: "FEMALE", date: "2026-09-20T14:40:12" },
  { username: "Văn Đạt", email: "datnguyenvan04@gmail.com", gender: "MALE", date: "2026-09-21T10:12:30" },
  { username: "Thảo Vy", email: "thaovytran04@gmail.com", gender: "FEMALE", date: "2026-09-22T19:25:05" },
  { username: "Thỏ Bảy Màu", email: "thobaymauit2004@gmail.com", gender: "MALE", date: "2026-09-23T09:05:40" },
  { username: "Mỹ Duyên", email: "myduyenho2k4@gmail.com", gender: "FEMALE", date: "2026-09-24T15:18:22" },
  { username: "dinhkhang_dk", email: "dinhkhangduong04@gmail.com", gender: "MALE", date: "2026-09-25T11:45:15" },
  { username: "Thu Trang", email: "thutrangngo2k4@gmail.com", gender: "FEMALE", date: "2026-09-26T18:30:50" },

  // --- Đợt 5: Đầu tháng 10/2026 ---
  { username: "Bạch Tuộc Biết Bơi", email: "bachtuoccode2k4@gmail.com", gender: "MALE", date: "2026-10-01T08:40:15" },
  { username: "Thảo Nguyên", email: "thaonguyenle04@gmail.com", gender: "FEMALE", date: "2026-10-01T14:22:38" },
  { username: "Quốc Anh", email: "quocanhdang2k4@gmail.com", gender: "MALE", date: "2026-10-02T10:15:50" },
  { username: "Minh Châu", email: "minhchauhoang04@gmail.com", gender: "FEMALE", date: "2026-10-03T16:05:12" },
  { username: "Gió Đầu Mùa", email: "giodaumuatrinh04@gmail.com", gender: "MALE", date: "2026-10-04T09:30:25" },
  { username: "Diệu Linh", email: "dieulinh.pham04@gmail.com", gender: "FEMALE", date: "2026-10-05T19:10:40" }, // có dấu chấm
  { username: "Trường Giang", email: "truonggiangnguyen04@gmail.com", gender: "MALE", date: "2026-10-06T11:05:18" },
  { username: "Bảo Trâm", email: "baotramly2k4@gmail.com", gender: "FEMALE", date: "2026-10-07T15:45:30" },
  { username: "Cậu Bé Bút Chì", email: "caubebutchicit@gmail.com", gender: "MALE", date: "2026-10-08T08:55:10" },
  { username: "Hải Lam", email: "hailamdo2k4@gmail.com", gender: "FEMALE", date: "2026-10-09T17:20:45" },

  // --- Đợt 6: Giữa tháng 10/2026 ---
  { username: "Minh Thông", email: "minhthongvo04@gmail.com", gender: "MALE", date: "2026-10-11T10:35:20" },
  { username: "Kem Dâu Tây", email: "kemdautaybui04@gmail.com", gender: "FEMALE", date: "2026-10-12T14:15:35" },
  { username: "Đức Nhân", email: "ducnhanle2k4@gmail.com", gender: "MALE", date: "2026-10-13T09:22:15" },
  { username: "Cát Tường", email: "cattuongho2k4@gmail.com", gender: "FEMALE", date: "2026-10-14T18:40:50" },
  { username: "Đình Phong", email: "dinhphongphan2k4@gmail.com", gender: "MALE", date: "2026-10-15T11:12:05" },
  { username: "Hồng Hạnh", email: "honghanhnguyen04@gmail.com", gender: "FEMALE", date: "2026-10-16T16:25:30" },
  { username: "zenith_coder", email: "zenithcoder2004@gmail.com", gender: "MALE", date: "2026-10-17T08:30:15" },
  { username: "Mai Khanh", email: "maikhanh.vu2k4@gmail.com", gender: "FEMALE", date: "2026-10-18T20:10:40" }, // có dấu chấm
  { username: "Hữu Tài", email: "huutaidang04@gmail.com", gender: "MALE", date: "2026-10-19T10:45:22" },
  { username: "Thu Thủy", email: "thuthuymai2k4@gmail.com", gender: "FEMALE", date: "2026-10-20T15:30:10" },

  // --- Đợt 7: Tuần gần đây (21/10/2026 - 25/10/2026) ---
  { username: "Quốc Cường", email: "quoccuongdoan2k4@gmail.com", gender: "MALE", date: "2026-10-21T09:15:30" },
  { username: "Bé Đậu Đậu", email: "bedaudauduong04@gmail.com", gender: "FEMALE", date: "2026-10-21T17:40:15" },
  { username: "Gia Bảo", email: "giabaongo04@gmail.com", gender: "MALE", date: "2026-10-22T11:05:40" },
  { username: "Ngọc Mai", email: "ngocmai.tran04@gmail.com", gender: "FEMALE", date: "2026-10-22T19:20:25" }, // có dấu chấm
  { username: "Thành Đạt", email: "thanhdatnguyen2k4@gmail.com", gender: "MALE", date: "2026-10-23T08:50:10" },
  { username: "Kiều Oanh", email: "kieuoanhle04@gmail.com", gender: "FEMALE", date: "2026-10-23T14:15:35" },
  { username: "Quang Huy", email: "quanghuy.pham2k4@gmail.com", gender: "MALE", date: "2026-10-24T10:30:20" }, // có dấu chấm
  { username: "Bích Phương", email: "bichphuonghoang04@gmail.com", gender: "FEMALE", date: "2026-10-24T16:45:50" },
  { username: "Thành Trung", email: "thanhtrungvo2k4@gmail.com", gender: "MALE", date: "2026-10-25T09:05:15" },
  { username: "Thanh Thảo", email: "thanhthaoho04@gmail.com", gender: "FEMALE", date: "2026-10-25T21:10:30" }
];

async function updateEmails() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("🚀 Kết nối CSDL Supabase PostgreSQL thành công.");

    // 1. Xóa sạch 70 tài khoản đợt trước
    console.log("🧹 Xóa 70 tài khoản đợt trước để cập nhật email...");
    const deleteRes = await client.query(
      `DELETE FROM users WHERE username = ANY($1) RETURNING username`,
      [TARGET_USERNAMES]
    );
    console.log(`✅ Đã xóa ${deleteRes.rowCount} tài khoản.`);

    // 2. Chèn 70 tài khoản mới
    const defaultPassword = "Student@123";
    const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

    let insertedCount = 0;
    const insertedUsers = [];

    console.log(`\n⏳ Bắt đầu nạp 70 tài khoản với email đã bỏ dấu chấm (chỉ giữ lại 5 email có dấu chấm)...`);

    for (const student of STUDENTS_CLEAN_EMAIL) {
      const res = await client.query(
        `INSERT INTO users (id, username, email, password, role, gender, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 'STUDENT', $4, $5, $5)
         RETURNING id, username, email, role, gender, created_at`,
        [student.username, student.email, hashedPassword, student.gender, student.date]
      );
      insertedCount++;
      insertedUsers.push(res.rows[0]);
    }

    console.log(`\n🎉 HOÀN TẤT CẬP NHẬT EMAIL CHO 70 HỌC VIÊN!`);
    console.log(`- Số tài khoản tạo thành công: ${insertedCount}`);

    // Đếm số lượng email có dấu chấm trong 70 học viên
    const dotCount = insertedUsers.filter(u => u.email.split('@')[0].includes('.')).length;
    const noDotCount = insertedUsers.length - dotCount;
    console.log(`- Số email KHÔNG có dấu chấm: ${noDotCount}`);
    console.log(`- Số email GIỮ dấu chấm: ${dotCount}`);

    // Hiển thị mẫu 20 tài khoản đầu tiên
    console.log(`\n📋 Mẫu 20 tài khoản sau khi bỏ dấu chấm:`);
    console.table(insertedUsers.slice(0, 20).map((u, i) => ({
      STT: i + 1,
      Username: u.username,
      Email: u.email,
      CoDauCham: u.email.split('@')[0].includes('.') ? 'CÓ' : 'KHÔNG'
    })));

  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    await client.end();
  }
}

updateEmails();
