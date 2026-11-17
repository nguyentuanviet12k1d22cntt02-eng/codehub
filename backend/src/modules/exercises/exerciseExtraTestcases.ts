// Tệp sinh tự động bởi reviews/exercise-content-audit-2026-11-16/scripts/build_group_d_tests.py, đừng sửa tay.
/**
 * Nhóm D: testcase ẩn bổ sung cho bài luyện tập theo module (nội dung bị model r03 ghim nên không ghi DB).
 * Đáp án là output của lời giải mẫu. Backend nối thêm các test này khi chấm.
 *  - LS-02.MP Hệ Thống Đánh Giá Học Sinh Toàn Diện: 3 test
 *  - LS-02.MP Hệ Thống Giá Cước Taxi: 3 test
 *  - LS-02.MP Kiểm Tra Tính Hợp Lệ Của Ngày (Tháng có 30, 31, 28/29 ngày): 3 test
 *  - LS-02.MP Mô Phỏng Điều Khiển Đèn Giao Thông Đơn Giản: 2 test
 *  - LS-02.MP Phân Loại Phản Hồi Khách Hàng: 3 test
 *  - LS-02.MP Quyết định xem phim theo tuổi và thể loại: 3 test
 *  - LS-02.MP Tính hóa đơn tiền điện luỹ tiến và thuế suất: 3 test
 *  - LS-02.MP Xác định Điểm Đến của Người Dùng (Theo Thời gian và Sở thích): 7 test
 *  - LS-02.MP Xác định Phân Loại Số Học (Dương/Âm, Chẵn/Lẻ, Chia hết cho 3/5): 3 test
 *  - LS-02.MP Xử Lý Đơn Hàng Online (Trạng thái và Thông báo): 3 test
 *  - LS-02.MP Hệ thống phát hiện giao dịch bất thường (Gian lận): 6 test
 *  - LS-02.MP Quyết Định Giảm Giá Đơn Hàng (Nâng Cao): 5 test
 *  - LS-03.MP_WHILE Giới hạn ba lần nhập mã PIN: 3 test
 *  - LS-03.MP_FOR Tính tích từ 1 đến N: 2 test
 *  - LS-03.MP_WHILE Tính tích từ 1 đến N bằng while: 2 test
 *  - LS-03.MP_FOR Tìm số chia hết cho 7 đầu tiên: 3 test
 *  - LS-05.MP Xoay vòng danh sách (Rotate List): 3 test
 *  - LS-06.MP Đếm số lượng phần tử duy nhất trong danh sách: 2 test
 *  - LS-07.MP Hàm kiểm tra số nguyên tố: 7 test
 */
export interface ExtraTestcase { input: string; expectedOutput: string; isHidden: true }

export const EXTRA_TESTCASES: Readonly<Record<string, readonly ExtraTestcase[]>> = Object.freeze({
    "83d56e04-fe17-4f8c-b42c-03bdefae1d53": [
        {
            "input": "6.0\n4.0\n8\n",
            "expectedOutput": "Học sinh Trung bình\n",
            "isHidden": true
        },
        {
            "input": "4.0\n4.5\n2\n",
            "expectedOutput": "Học sinh Yếu\n",
            "isHidden": true
        },
        {
            "input": "8.0\n8.0\n6\n",
            "expectedOutput": "Học sinh Khá\n",
            "isHidden": true
        }
    ],
    "294c15d4-ec35-41fd-8cd7-424c355a5587": [
        {
            "input": "12\nngay\n",
            "expectedOutput": "Tổng tiền cước: 143000.0 VND\n",
            "isHidden": true
        },
        {
            "input": "7.5\ndem\n",
            "expectedOutput": "Tổng tiền cước: 115500.0 VND\n",
            "isHidden": true
        },
        {
            "input": "1.0\nngay\n",
            "expectedOutput": "Tổng tiền cước: 15000.0 VND\n",
            "isHidden": true
        }
    ],
    "f6a4b73e-427a-447e-8327-c8bbfe5687a3": [
        {
            "input": "10\n13\n",
            "expectedOutput": "Ngày KHÔNG hợp lệ.\n",
            "isHidden": true
        },
        {
            "input": "30\n2\n",
            "expectedOutput": "Ngày KHÔNG hợp lệ.\n",
            "isHidden": true
        },
        {
            "input": "31\n12\n",
            "expectedOutput": "Ngày hợp lệ.\n",
            "isHidden": true
        }
    ],
    "1f410d7d-f7ae-43f6-b3b3-f96519e13a1a": [
        {
            "input": "tim\nFalse\n",
            "expectedOutput": "Trạng thái đèn không xác định.\n",
            "isHidden": true
        },
        {
            "input": "vang\nTrue\n",
            "expectedOutput": "Đèn ưu tiên: Xe ưu tiên được đi.\n",
            "isHidden": true
        }
    ],
    "bb920549-a509-42e7-b741-1951d4731c8f": [
        {
            "input": "4\nFalse\n",
            "expectedOutput": "Phản hồi Tích cực.\n",
            "isHidden": true
        },
        {
            "input": "2\nFalse\n",
            "expectedOutput": "Phản hồi Tiêu cực (không có chi tiết).\n",
            "isHidden": true
        },
        {
            "input": "2\nTrue\n",
            "expectedOutput": "Phản hồi Rất tiêu cực, có chi tiết.\n",
            "isHidden": true
        }
    ],
    "06a574af-d994-4c55-a3d0-3d322745c21b": [
        {
            "input": "13\nhành động\n",
            "expectedOutput": "Có thể xem phim\n",
            "isHidden": true
        },
        {
            "input": "30\ntình cảm\n",
            "expectedOutput": "Không thể xem phim\n",
            "isHidden": true
        },
        {
            "input": "18\nkinh dị\n",
            "expectedOutput": "Có thể xem phim\n",
            "isHidden": true
        }
    ],
    "7b7c4561-f92e-467d-9747-595bc1499dcd": [
        {
            "input": "250\nFalse\n",
            "expectedOutput": "538704.0\n",
            "isHidden": true
        },
        {
            "input": "200\nFalse\n",
            "expectedOutput": "401760.0\n",
            "isHidden": true
        },
        {
            "input": "100\nFalse\n",
            "expectedOutput": "184248.0\n",
            "isHidden": true
        }
    ],
    "c1c9af81-641d-45ca-8429-c7a5ea2cd81c": [
        {
            "input": "9\nam thuc\n",
            "expectedOutput": "Gợi ý: Quán ăn sáng hoặc cafe.\n",
            "isHidden": true
        },
        {
            "input": "10\nkhac\n",
            "expectedOutput": "Gợi ý: Khu vực trung tâm thành phố.\n",
            "isHidden": true
        },
        {
            "input": "13\nam thuc\n",
            "expectedOutput": "Gợi ý: Nhà hàng ăn trưa.\n",
            "isHidden": true
        },
        {
            "input": "16\nkhac\n",
            "expectedOutput": "Gợi ý: Bảo tàng hoặc phòng trưng bày.\n",
            "isHidden": true
        },
        {
            "input": "19\nkhac\n",
            "expectedOutput": "Gợi ý: Rạp chiếu phim hoặc nhà hát.\n",
            "isHidden": true
        },
        {
            "input": "6\nthien nhien\n",
            "expectedOutput": "Gợi ý: Công viên hoặc hồ.\n",
            "isHidden": true
        },
        {
            "input": "0\nam thuc\n",
            "expectedOutput": "Gợi ý: Hãy nghỉ ngơi, trời đã muộn rồi.\n",
            "isHidden": true
        }
    ],
    "bface3fd-55a4-4827-b8be-c917819f2859": [
        {
            "input": "7\n",
            "expectedOutput": "Số dương lẻ.\n",
            "isHidden": true
        },
        {
            "input": "-8\n",
            "expectedOutput": "Số âm chẵn.\n",
            "isHidden": true
        },
        {
            "input": "-15\n",
            "expectedOutput": "Số âm lẻ.\n",
            "isHidden": true
        }
    ],
    "143e25d2-39b8-4af1-a585-aa9c7956a772": [
        {
            "input": "dang van chuyen\nFalse\n",
            "expectedOutput": "Đơn hàng của bạn đang trên đường vận chuyển.\n",
            "isHidden": true
        },
        {
            "input": "da huy\nTrue\n",
            "expectedOutput": "Đơn hàng của bạn đã bị hủy.\n",
            "isHidden": true
        },
        {
            "input": "abc\nFalse\n",
            "expectedOutput": "Trạng thái đơn hàng không xác định.\n",
            "isHidden": true
        }
    ],
    "3baeca09-ecb0-4053-98e9-a42f49b39824": [
        {
            "input": "100000000\n10\nFalse\n",
            "expectedOutput": "Rủi ro Trung bình\n",
            "isHidden": true
        },
        {
            "input": "50000000\n10\nTrue\n",
            "expectedOutput": "Rủi ro Cao\n",
            "isHidden": true
        },
        {
            "input": "10000000\n10\nTrue\n",
            "expectedOutput": "Rủi ro Trung bình\n",
            "isHidden": true
        },
        {
            "input": "9999999\n100\nTrue\n",
            "expectedOutput": "Giao dịch An toàn\n",
            "isHidden": true
        },
        {
            "input": "5000000\n500\nTrue\n",
            "expectedOutput": "Rủi ro Trung bình\n",
            "isHidden": true
        },
        {
            "input": "5000000\n501\nFalse\n",
            "expectedOutput": "Giao dịch An toàn\n",
            "isHidden": true
        }
    ],
    "348c1adc-93e5-470c-872b-de593bc010c3": [
        {
            "input": "1000000\n20\nTrue\n",
            "expectedOutput": "Tổng tiền sau giảm giá 20%: 800000.0 VND (Siêu giảm giá)\n",
            "isHidden": true
        },
        {
            "input": "1000000\n20\nFalse\n",
            "expectedOutput": "Tổng tiền sau giảm giá 10%: 900000.0 VND (Giảm giá đặc biệt)\n",
            "isHidden": true
        },
        {
            "input": "1000000\n10\nFalse\n",
            "expectedOutput": "Tổng tiền sau giảm giá 10%: 900000.0 VND (Giảm giá đặc biệt)\n",
            "isHidden": true
        },
        {
            "input": "5000000\n1\nFalse\n",
            "expectedOutput": "Tổng tiền sau giảm giá 20%: 4000000.0 VND (Siêu giảm giá)\n",
            "isHidden": true
        },
        {
            "input": "2000000\n1\nFalse\n",
            "expectedOutput": "Tổng tiền sau giảm giá 10%: 1800000.0 VND (Giảm giá đặc biệt)\n",
            "isHidden": true
        }
    ],
    "1bf893c8-ce12-4770-9764-1ee296c28016": [
        {
            "input": "1\n2\n1234\n",
            "expectedOutput": "DUNG\n",
            "isHidden": true
        },
        {
            "input": "1234\n",
            "expectedOutput": "DUNG\n",
            "isHidden": true
        },
        {
            "input": "1\n2\n3\n1234\n",
            "expectedOutput": "KHOA\n",
            "isHidden": true
        }
    ],
    "da8062a8-faa7-4d0c-91ce-ab01c10132e6": [
        {
            "input": "1\n",
            "expectedOutput": "1\n",
            "isHidden": true
        },
        {
            "input": "6\n",
            "expectedOutput": "720\n",
            "isHidden": true
        }
    ],
    "c03edb56-558d-4cec-85e6-dc5b983ea7f4": [
        {
            "input": "1\n",
            "expectedOutput": "1\n",
            "isHidden": true
        },
        {
            "input": "6\n",
            "expectedOutput": "720\n",
            "isHidden": true
        }
    ],
    "b8f7d9cd-becd-4786-aeb8-7ec52091ad4e": [
        {
            "input": "7\n7\n",
            "expectedOutput": "7\n",
            "isHidden": true
        },
        {
            "input": "15\n20\n",
            "expectedOutput": "KHONG CO\n",
            "isHidden": true
        },
        {
            "input": "21\n30\n",
            "expectedOutput": "21\n",
            "isHidden": true
        }
    ],
    "d4f8f603-d8b7-44ef-b6d2-86a729ba1956": [
        {
            "input": "1 2 3\n5\n",
            "expectedOutput": "[2, 3, 1]\n",
            "isHidden": true
        },
        {
            "input": "1 2 3\n3\n",
            "expectedOutput": "[1, 2, 3]\n",
            "isHidden": true
        },
        {
            "input": "4\n10\n",
            "expectedOutput": "[4]\n",
            "isHidden": true
        }
    ],
    "9e1f6f04-580e-46b2-8f46-24e76e0822a9": [
        {
            "input": "\n",
            "expectedOutput": "{1: 2, 2: 3, 3: 1, 4: 1, 5: 1}\n",
            "isHidden": true
        },
        {
            "input": "5\n",
            "expectedOutput": "{5: 1}\n",
            "isHidden": true
        }
    ],
    "cc3b3941-aa81-47e0-8e6a-2358a1a08a69": [
        {
            "input": "9\n",
            "expectedOutput": "False\n",
            "isHidden": true
        },
        {
            "input": "15\n",
            "expectedOutput": "False\n",
            "isHidden": true
        },
        {
            "input": "25\n",
            "expectedOutput": "False\n",
            "isHidden": true
        },
        {
            "input": "49\n",
            "expectedOutput": "False\n",
            "isHidden": true
        },
        {
            "input": "97\n",
            "expectedOutput": "True\n",
            "isHidden": true
        },
        {
            "input": "0\n",
            "expectedOutput": "False\n",
            "isHidden": true
        },
        {
            "input": "-7\n",
            "expectedOutput": "False\n",
            "isHidden": true
        }
    ]
} as Record<string, ExtraTestcase[]>);
