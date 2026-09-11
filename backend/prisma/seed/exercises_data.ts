import { ExerciseDifficulty } from '@prisma/client';

export interface TestCaseData {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ExerciseData {
  title: string;
  difficulty: ExerciseDifficulty;
  problemDescription: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCaseData[];
}

export const exercisesData: Record<string, ExerciseData[]> = {
  'LS-01.01': [
    {
      title: 'Chương trình Hello World',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Viết chương trình Python in ra dòng chữ "Hello, World!"',
      starterCode: '# Hãy viết câu lệnh print ở đây\n',
      solutionCode: 'print("Hello, World!")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Hello, World!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Chào mừng bạn đến với Python',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết chương trình Python in ra dòng chữ "Chào mừng bạn đến với Python!"',
      starterCode: '# Hãy viết câu lệnh print ở đây\n',
      solutionCode: 'print("Chào mừng bạn đến với Python!")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Chào mừng bạn đến với Python!\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.02': [
    {
      title: 'Sử dụng lệnh in cơ bản',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Viết chương trình in ra dòng chữ "Học Python thật thú vị!"',
      starterCode: '# Viết lệnh in của bạn ở đây\n',
      solutionCode: 'print("Học Python thật thú vị!")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Học Python thật thú vị!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'In thông điệp lập trình',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết chương trình in ra dòng chữ "Tôi muốn trở thành lập trình viên Python."',
      starterCode: '# Viết lệnh in của bạn ở đây\n',
      solutionCode: 'print("Tôi muốn trở thành lập trình viên Python.")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Tôi muốn trở thành lập trình viên Python.\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.03': [
    {
      title: 'Viết chú thích và in nhiều dòng',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết một chú thích bất kỳ bắt đầu bằng dấu #, sau đó dùng 2 lệnh print để in ra 2 dòng chữ lần lượt là "Xin chào" và "Tên tôi là Python".',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: '# Chú thích dòng lệnh\nprint("Xin chào")\nprint("Tên tôi là Python")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Xin chào\nTên tôi là Python\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Chú thích phép tính',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết chú thích bắt đầu bằng dấu # để giải thích, sau đó dùng lệnh print để in ra chữ "5 + 3 =" ở dòng 1 và in kết quả của phép tính 5 + 3 ở dòng 2.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: '# Tính tổng của 5 và 3\nprint("5 + 3 =")\nprint(5 + 3)',
      testCases: [
        {
          input: '',
          expectedOutput: '5 + 3 =\n8\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.04': [
    {
      title: 'Khai báo biến cơ bản',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy tạo một biến tên là `course_title` và gán cho nó giá trị chuỗi là `"Học Python cùng MCODE"`. Sau đó dùng lệnh `print()` để in giá trị của biến đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'course_title = "Học Python cùng MCODE"\nprint(course_title)',
      testCases: [
        {
          input: '',
          expectedOutput: 'Học Python cùng MCODE\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tính toán hóa đơn áo thun',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo biến `so_ao_thun` gán giá trị `5`, `gia_moi_ao` gán giá trị `120000`. Khai báo biến `tong_tien` lưu kết quả tích của hai biến trên và in `tong_tien` ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'so_ao_thun = 5\ngia_moi_ao = 120000\ntong_tien = so_ao_thun * gia_moi_ao\nprint(tong_tien)',
      testCases: [
        {
          input: '',
          expectedOutput: '600000\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.05': [
    {
      title: 'Khai báo kiểu dữ liệu nguyên thủy',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy khai báo 3 biến: `tuoi` gán giá trị số nguyên `15`, `diem_so` gán giá trị số thực `8.5`, và `is_student` gán giá trị logic `True`. Sau đó in ra giá trị của từng biến này trên 3 dòng riêng biệt.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'tuoi = 15\ndiem_so = 8.5\nis_student = True\nprint(tuoi)\nprint(diem_so)\nprint(is_student)',
      testCases: [
        {
          input: '',
          expectedOutput: '15\n8.5\nTrue\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kiểm tra kiểu dữ liệu với type()',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo biến `chieu_cao` gán giá trị `1.75`. Sử dụng hàm `type()` kết hợp với `print()` để in ra kiểu dữ liệu của biến này.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'chieu_cao = 1.75\nprint(type(chieu_cao))',
      testCases: [
        {
          input: '',
          expectedOutput: "<class 'float'>\n",
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.06': [
    {
      title: 'Tính toán chia chia lấy dư pizza',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Một nhóm bạn gồm `4` người đi ăn pizza hết tổng cộng `350000` đồng. Hãy tính số tiền mỗi người phải trả khi chia đều và gán vào biến `so_tien_moi_nguoi`. Tính số tiền dư không thể chia đều và gán vào biến `so_tien_du`. In cả hai biến ra màn hình lần lượt trên 2 dòng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'so_tien_moi_nguoi = 350000 / 4\nso_tien_du = 350000 % 4\nprint(so_tien_moi_nguoi)\nprint(so_tien_du)',
      testCases: [
        {
          input: '',
          expectedOutput: '87500.0\n0\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tính chu vi diện tích hình chữ nhật',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo biến `chieu_dai` gán giá trị `10` và biến `chieu_rong` gán giá trị `5`. Tính chu vi lưu vào biến `chu_vi` và diện tích lưu vào biến `dien_tich`. In kết quả của `chu_vi` ở dòng 1 và `dien_tich` ở dòng 2.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'chieu_dai = 10\nchieu_rong = 5\nchu_vi = (chieu_dai + chieu_rong) * 2\ndien_tich = chieu_dai * chieu_rong\nprint(chu_vi)\nprint(dien_tich)',
      testCases: [
        {
          input: '',
          expectedOutput: '30\n50\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tính lũy thừa cơ số 2',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo biến `a = 2` và `b = 10`. Tính lũy thừa `a` mũ `b` (2 mũ 10) và in kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'a = 2\nb = 10\nprint(a ** b)',
      testCases: [
        {
          input: '',
          expectedOutput: '1024\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.07': [
    {
      title: 'Cập nhật ví tiết kiệm',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khởi tạo biến `tien_tiet_kiem = 100000`. Dùng toán tử gán rút gọn để cộng thêm `50000`, sau đó tiếp tục dùng toán tử gán rút gọn nhân đôi số tiền tiết kiệm hiện tại. In giá trị biến `tien_tiet_kiem` cuối cùng ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'tien_tiet_kiem = 100000\ntien_tiet_kiem += 50000\ntien_tiet_kiem *= 2\nprint(tien_tiet_kiem)',
      testCases: [
        {
          input: '',
          expectedOutput: '300000\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Đếm số lượt truy cập',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khởi tạo biến `luot_truy_cap = 0`. Dùng toán tử gán rút gọn `+=` để tăng giá trị biến này lên 1 đơn vị sau mỗi lần có truy cập. Thực hiện tăng 3 lần, sau đó in giá trị cuối cùng ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'luot_truy_cap = 0\nluot_truy_cap += 1\nluot_truy_cap += 1\nluot_truy_cap += 1\nprint(luot_truy_cap)',
      testCases: [
        {
          input: '',
          expectedOutput: '3\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Chia kẹo giảm dần',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khởi tạo biến `so_keo = 20`. Chia đều số kẹo cho 4 người bằng toán tử gán chia rút gọn `/=`. In giá trị biến `so_keo` còn lại ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'so_keo = 20\nso_keo /= 4\nprint(so_keo)',
      testCases: [
        {
          input: '',
          expectedOutput: '5.0\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.08': [
    {
      title: 'Định dạng ngày xuất bản',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy khai báo 3 biến chứa ngày tháng năm: `ngay = 16`, `thang = 7`, `nam = 2026`. Sử dụng một câu lệnh `print()` duy nhất với tham số `sep` để in ra màn hình chuỗi ngày tháng năm có dạng `16/7/2026`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'ngay = 16\nthang = 7\nnam = 2026\nprint(ngay, thang, nam, sep="/")',
      testCases: [
        {
          input: '',
          expectedOutput: '16/7/2026\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'In các từ nối bằng dấu gạch ngang',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo 3 biến chuỗi: `w1 = "Python"`, `w2 = "is"`, `w3 = "awesome"`. Sử dụng một câu lệnh `print()` duy nhất với tham số `sep` để in ra màn hình chuỗi có dạng `"Python-is-awesome"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'w1 = "Python"\nw2 = "is"\nw3 = "awesome"\nprint(w1, w2, w3, sep="-")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Python-is-awesome\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.09': [
    {
      title: 'Nhập món ăn yêu thích',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết một chương trình yêu cầu người dùng nhập vào món ăn yêu thích của họ bằng câu lệnh `input()` (không ghi prompt text bên trong). Sau đó in ra màn hình dòng chữ `"Món ăn yêu thích của bạn là: [tên món ăn]"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'mon_an = input()\nprint("Món ăn yêu thích của bạn là:", mon_an)',
      testCases: [
        {
          input: 'Phở bò\n',
          expectedOutput: 'Món ăn yêu thích của bạn là: Phở bò\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Chào hỏi người dùng',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Viết chương trình nhận tên của người dùng từ bàn phím bằng hàm `input()`. In ra màn hình câu chào có dạng `"Xin chào, [tên]!"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'name = input()\nprint(f"Xin chào, {name}!")',
      testCases: [
        {
          input: 'Nam\n',
          expectedOutput: 'Xin chào, Nam!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Lặp lại từ khóa',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Viết chương trình nhận 1 từ khóa từ bàn phím, sau đó in ra từ khóa đó lặp lại 3 lần cách nhau bởi khoảng trắng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'keyword = input()\nprint(keyword, keyword, keyword)',
      testCases: [
        {
          input: 'Python\n',
          expectedOutput: 'Python Python Python\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.10': [
    {
      title: 'Cộng thêm 100',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết một chương trình yêu cầu người dùng nhập vào một số nguyên từ bàn phím bằng câu lệnh `input()` (không ghi prompt text bên trong). Hãy cộng số đó với `100` rồi in kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'so_nhap = int(input())\nprint(so_nhap + 100)',
      testCases: [
        {
          input: '50\n',
          expectedOutput: '150\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tính tổng hai số thực',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Nhập hai số thực trên hai dòng từ bàn phím. Hãy ép kiểu chúng thành số thực (`float`), tính tổng và in kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'num1 = float(input())\nnum2 = float(input())\nprint(num1 + num2)',
      testCases: [
        {
          input: '1.5\n2.5\n',
          expectedOutput: '4.0\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Ghép tuổi của bạn',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Nhập vào một số nguyên đại diện cho tuổi của bạn. Hãy chuyển đổi số nguyên đó thành chuỗi văn bản (`str`), sau đó ghép thêm chuỗi `" tuổi"` vào sau và in ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'age = int(input())\nprint(str(age) + " tuổi")',
      testCases: [
        {
          input: '18\n',
          expectedOutput: '18 tuổi\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-02.01': [
    {
      title: 'Kiểm tra sốt',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo hai biến `nhiet_do = 38.5` và `nhiet_do_binh_thuong = 37.0`. Hãy tạo một biểu thức so sánh kiểm tra xem `nhiet_do` có lớn hơn `nhiet_do_binh_thuong` hay không và lưu kết quả vào biến `is_sot`. In kết quả của `is_sot` ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'nhiet_do = 38.5\nnhiet_do_binh_thuong = 37.0\nis_sot = nhiet_do > nhiet_do_binh_thuong\nprint(is_sot)',
      testCases: [
        {
          input: '',
          expectedOutput: 'True\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'So sánh hai số nhập vào',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Viết chương trình nhập hai số nguyên từ bàn phím trên hai dòng. Kiểm tra xem số thứ nhất có bằng số thứ hai hay không và in giá trị Boolean kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'a = int(input())\nb = int(input())\nprint(a == b)',
      testCases: [
        {
          input: '5\n5\n',
          expectedOutput: 'True\n',
          isHidden: false
        },
        {
          input: '3\n4\n',
          expectedOutput: 'False\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-02.02': [
    {
      title: 'Kiểm tra ví mua vé phim',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy khai báo hai biến `so_tien_hien_co = 15000` và `gia_ve_xem_phim = 45000`. Viết một câu lệnh `if` kiểm tra xem `so_tien_hien_co` có nhỏ hơn `gia_ve_xem_phim` hay không. Nếu đúng, hãy in ra màn hình dòng chữ `"Bạn không đủ tiền mua vé xem phim!"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'so_tien_hien_co = 15000\ngia_ve_xem_phim = 45000\nif so_tien_hien_co < gia_ve_xem_phim:\n    print("Bạn không đủ tiền mua vé xem phim!")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Bạn không đủ tiền mua vé xem phim!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kiểm tra điểm đạt',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Nhập điểm học tập của học sinh từ bàn phím (số thực). Viết câu lệnh `if` kiểm tra xem điểm có lớn hơn hoặc bằng `5.0` hay không. Nếu đúng, in ra chữ `"Đạt"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'diem = float(input())\nif diem >= 5.0:\n    print("Đạt")',
      testCases: [
        {
          input: '6.5\n',
          expectedOutput: 'Đạt\n',
          isHidden: false
        },
        {
          input: '4.0\n',
          expectedOutput: '',
          isHidden: false
        }
      ]
    }
  ],
  'LS-02.03': [
    {
      title: 'Phân loại độ tuổi',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Khai báo biến `so_tuoi = 15`. Viết cấu trúc `if-elif-else` để phân loại độ tuổi: nếu `so_tuoi >= 18` in ra `"Người lớn"`, ngược lại nếu `so_tuoi >= 12` in ra `"Thiếu niên"`, ngược lại in ra `"Trẻ em"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'so_tuoi = 15\nif so_tuoi >= 18:\n    print("Người lớn")\nelif so_tuoi >= 12:\n    print("Thiếu niên")\nelse:\n    print("Trẻ em")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Thiếu niên\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kiểm tra chẵn lẻ',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập một số nguyên từ bàn phím. Nếu số đó chia hết cho 2, in ra `"Chẵn"`, ngược lại in ra `"Lẻ"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'n = int(input())\nif n % 2 == 0:\n    print("Chẵn")\nelse:\n    print("Lẻ")',
      testCases: [
        {
          input: '4\n',
          expectedOutput: 'Chẵn\n',
          isHidden: false
        },
        {
          input: '7\n',
          expectedOutput: 'Lẻ\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Phân loại học lực',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập điểm trung bình của một học sinh (số thực) từ bàn phím. Phân loại học lực:\n- Điểm từ `8.5` trở lên: in `"Giỏi"`\n- Điểm từ `6.5` đến dưới `8.5`: in `"Khá"`\n- Điểm từ `5.0` đến dưới `6.5`: in `"Trung bình"`\n- Điểm dưới `5.0`: in `"Yếu"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'diem = float(input())\nif diem >= 8.5:\n    print("Giỏi")\nelif diem >= 6.5:\n    print("Khá")\nelif diem >= 5.0:\n    print("Trung bình")\nelse:\n    print("Yếu")',
      testCases: [
        {
          input: '8.7\n',
          expectedOutput: 'Giỏi\n',
          isHidden: false
        },
        {
          input: '7.0\n',
          expectedOutput: 'Khá\n',
          isHidden: false
        },
        {
          input: '4.5\n',
          expectedOutput: 'Yếu\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tìm số lớn nhất',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập 3 số nguyên khác nhau từ bàn phím trên 3 dòng. Hãy tìm số lớn nhất trong 3 số đó và in ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'a = int(input())\nb = int(input())\nc = int(input())\nmax_val = a\nif b > max_val:\n    max_val = b\nif c > max_val:\n    max_val = c\nprint(max_val)',
      testCases: [
        {
          input: '10\n25\n15\n',
          expectedOutput: '25\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-02.04': [
    {
      title: 'Xét duyệt giảm giá',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Khai báo 3 biến: `co_the_thanh_vien = True`, `la_cuoi_tuan = True`, và `hoa_don = 250000`. Viết câu lệnh `if` kiểm tra xem khách hàng có thẻ thành viên **và** hóa đơn lớn hơn `200000` đồng, **hoặc** khách hàng có thẻ thành viên nhưng đi mua sắm vào ngày cuối tuần. Nếu thỏa mãn điều kiện, hãy in ra dòng chữ `"Được giảm giá 10%!"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'co_the_thanh_vien = True\nla_cuoi_tuan = True\nhoa_don = 250000\nif (co_the_thanh_vien and hoa_don > 200000) or (co_the_thanh_vien and la_cuoi_tuan):\n    print("Được giảm giá 10%!")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Được giảm giá 10%!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kiểm tra năm nhuận',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập một năm (số nguyên) từ bàn phím. Năm nhuận là năm chia hết cho 400, hoặc chia hết cho 4 nhưng không chia hết cho 100. Hãy kiểm tra và in ra `"Năm nhuận"` hoặc `"Năm thường"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'year = int(input())\nif (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):\n    print("Năm nhuận")\nelse:\n    print("Năm thường")',
      testCases: [
        {
          input: '2000\n',
          expectedOutput: 'Năm nhuận\n',
          isHidden: false
        },
        {
          input: '2100\n',
          expectedOutput: 'Năm thường\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Xét tuyển đại học',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập điểm Toán, Lý, Hóa (3 số thực) trên 3 dòng. Học sinh trúng tuyển nếu điểm mỗi môn đều lớn hơn hoặc bằng `5.0` và tổng điểm 3 môn lớn hơn hoặc bằng `21.0`. Hãy in ra `"Đỗ"` hoặc `"Trượt"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 't = float(input())\nl = float(input())\nh = float(input())\nif t >= 5.0 and l >= 5.0 and h >= 5.0 and (t + l + h) >= 21.0:\n    print("Đỗ")\nelse:\n    print("Trượt")',
      testCases: [
        {
          input: '8\n7\n6\n',
          expectedOutput: 'Đỗ\n',
          isHidden: false
        },
        {
          input: '4\n9\n9\n',
          expectedOutput: 'Trượt\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kiểm tra thông tin đăng nhập',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập vào tên đăng nhập và mật khẩu trên 2 dòng. Kiểm tra xem tên đăng nhập có là `"admin"` và mật khẩu là `"123456"` hay không. Nếu đúng, in `"Đăng nhập thành công"`, ngược lại in `"Sai thông tin"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'username = input()\npassword = input()\nif username == "admin" and password == "123456":\n    print("Đăng nhập thành công")\nelse:\n    print("Sai thông tin")',
      testCases: [
        {
          input: 'admin\n123456\n',
          expectedOutput: 'Đăng nhập thành công\n',
          isHidden: false
        },
        {
          input: 'admin\n1111\n',
          expectedOutput: 'Sai thông tin\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-02.05': [
    {
      title: 'Vòng lặp while cơ bản',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Hãy khởi tạo biến `so_du = 3`. Hãy viết một vòng lặp `while` kiểm tra điều kiện `so_du > 0`. Bên trong vòng lặp, hãy in ra màn hình dòng chữ `"Đang hoạt động"` và giảm `so_du` đi 1 đơn vị sau mỗi lần lặp.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'so_du = 3\nwhile so_du > 0:\n    print("Đang hoạt động")\n    so_du -= 1',
      testCases: [
        {
          input: '',
          expectedOutput: 'Đang hoạt động\nĐang hoạt động\nĐang hoạt động\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tính tổng các số nhỏ hơn N',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập số nguyên dương N từ bàn phím. Sử dụng vòng lặp `while` để tính tổng các số từ 1 đến N và in kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'n = int(input())\ntotal = 0\ni = 1\nwhile i <= n:\n    total += i\n    i += 1\nprint(total)',
      testCases: [
        {
          input: '5\n',
          expectedOutput: '15\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tìm ước chung lớn nhất (UCLN)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập hai số nguyên dương `a` và `b` trên 2 dòng từ bàn phím. Hãy sử dụng vòng lặp `while` để tìm và in ra UCLN của chúng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'a = int(input())\nb = int(input())\nwhile b != 0:\n    a, b = b, a % b\nprint(a)',
      testCases: [
        {
          input: '12\n18\n',
          expectedOutput: '6\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Rút tiền tài khoản',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập số tiền ban đầu trong tài khoản (số nguyên) ở dòng 1 và số tiền cố định muốn rút mỗi lần ở dòng 2. Dùng vòng lặp `while` trừ dần số tiền rút khỏi tài khoản cho đến khi số tiền còn lại không đủ để rút. In ra số lần rút được và số tiền còn dư cách nhau bởi khoảng trắng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'balance = int(input())\nwithdraw_amount = int(input())\ncount = 0\nwhile balance >= withdraw_amount:\n    balance -= withdraw_amount\n    count += 1\nprint(count, balance)',
      testCases: [
        {
          input: '100\n30\n',
          expectedOutput: '3 10\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-02.06': [
    {
      title: 'Sinh dãy số chia hết cho 5',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy dùng hàm `range()` kết hợp với hàm `list()` để tạo ra và in ra màn hình danh sách các số chia hết cho 5 trong khoảng từ 5 đến 30 (bao gồm cả số 30). Kết quả mong muốn hiển thị là: `[5, 10, 15, 20, 25, 30]`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'day_so = list(range(5, 31, 5))\nprint(day_so)',
      testCases: [
        {
          input: '',
          expectedOutput: '[5, 10, 15, 20, 25, 30]\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tạo dãy số chẵn giảm dần',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Sử dụng hàm `range()` và `list()` để tạo ra một danh sách chứa các số chẵn giảm dần từ 10 về 2 (bao gồm cả 10 và 2). In danh sách đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'even_desc = list(range(10, 1, -2))\nprint(even_desc)',
      testCases: [
        {
          input: '',
          expectedOutput: '[10, 8, 6, 4, 2]\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-02.07': [
    {
      title: 'In số lẻ tuần tự',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Hãy viết chương trình sử dụng vòng lặp `for` kết hợp với hàm `range()` để in ra màn hình các số lẻ từ 1 đến 7 (bao gồm cả số 7), mỗi số được in trên một dòng riêng biệt.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'for i in range(1, 8, 2):\n    print(i)',
      testCases: [
        {
          input: '',
          expectedOutput: '1\n3\n5\n7\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tính giai thừa N!',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập số nguyên dương N từ bàn phím. Dùng vòng lặp `for` để tính giai thừa N! (tích từ 1 đến N) và in kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'n = int(input())\nfact = 1\nfor i in range(1, n + 1):\n    fact *= i\nprint(fact)',
      testCases: [
        {
          input: '5\n',
          expectedOutput: '120\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Bảng cửu chương rút gọn',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập số nguyên N từ bàn phím. Sử dụng vòng lặp `for` để in ra bảng nhân từ N x 1 đến N x 5. Định dạng in: `N x i = tích` (mỗi dòng một phép tính).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'n = int(input())\nfor i in range(1, 6):\n    print(f"{n} x {i} = {n * i}")',
      testCases: [
        {
          input: '3\n',
          expectedOutput: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Đếm số chia hết cho 3',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập hai số nguyên `a` và `b` (`a < b`) trên 2 dòng từ bàn phím. Đếm xem có bao nhiêu số chia hết cho 3 trong đoạn từ `a` đến `b` (bao gồm cả `a` và `b`).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'a = int(input())\nb = int(input())\ncount = 0\nfor i in range(a, b + 1):\n    if i % 3 == 0:\n        count += 1\nprint(count)',
      testCases: [
        {
          input: '1\n10\n',
          expectedOutput: '3\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-02.08': [
    {
      title: 'Ngắt vòng lặp khẩn cấp',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Hãy viết chương trình sử dụng vòng lặp `for` duyệt qua các số trong `range(1, 6)`. Nếu gặp số `4`, hãy dùng lệnh `break` để thoát vòng lặp. Với các số khác, hãy in giá trị của số đó ra màn hình (mỗi số trên một dòng).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'for i in range(1, 6):\n    if i == 4:\n        break\n    print(i)',
      testCases: [
        {
          input: '',
          expectedOutput: '1\n2\n3\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Bỏ qua số chia hết cho 3',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Sử dụng vòng lặp `for` duyệt các số từ 1 đến 10. Nếu số đó chia hết cho 3, hãy dùng lệnh `continue` để bỏ qua việc in. Với các số khác, in trên cùng một dòng cách nhau bởi khoảng trắng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'result = []\nfor i in range(1, 11):\n    if i % 3 == 0:\n        continue\n    result.append(str(i))\nprint(" ".join(result))',
      testCases: [
        {
          input: '',
          expectedOutput: '1 2 4 5 7 8 10\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tìm số chia hết cho 7 đầu tiên',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập hai số nguyên `a` và `b` (`a < b`) trên 2 dòng. Sử dụng vòng lặp `for` để tìm số đầu tiên chia hết cho 7 trong đoạn `[a, b]`. In số đó ra màn hình và dừng vòng lặp bằng `break`. Nếu không tìm thấy, in ra `"Không có"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'a = int(input())\nb = int(input())\nfound = False\nfor i in range(a, b + 1):\n    if i % 7 == 0:\n        print(i)\n        found = True\n        break\nif not found:\n    print("Không có")',
      testCases: [
        {
          input: '10\n20\n',
          expectedOutput: '14\n',
          isHidden: false
        },
        {
          input: '1\n5\n',
          expectedOutput: 'Không có\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tính tổng số dương',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập liên tục các số nguyên từ bàn phím (mỗi dòng một số). Nếu gặp số `0` hoặc số âm, dùng lệnh `break` để thoát khỏi vòng lặp ngay lập tức. Hãy in ra tổng của tất cả các số dương đã nhập.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'total = 0\nwhile True:\n    val = int(input())\n    if val <= 0:\n        break\n    total += val\nprint(total)',
      testCases: [
        {
          input: '5\n10\n-3\n',
          expectedOutput: '15\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.01': [
    {
      title: 'Lấy ký tự đặc trưng',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo biến `s = "MCODE"`. Hãy in ra màn hình ký tự đầu tiên và ký tự cuối cùng của chuỗi `s` trên 2 dòng riêng biệt.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 's = "MCODE"\nprint(s[0])\nprint(s[-1])',
      testCases: [
        {
          input: '',
          expectedOutput: 'M\nE\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Lấy ký tự áp chót',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Nhập một chuỗi từ bàn phím. Hãy dùng chỉ số âm để in ra ký tự đứng trước ký tự cuối cùng của chuỗi (ký tự ở vị trí thứ hai từ cuối lên).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 's = input().strip()\nprint(s[-2])',
      testCases: [
        {
          input: 'Python\n',
          expectedOutput: 'o\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.02': [
    {
      title: 'Cắt ghép tên file',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo biến `file_name = "report_2026.pdf"`. Hãy cắt chuỗi để lấy ra chuỗi `"2026"` (gán vào biến `year`) và chuỗi `"pdf"` (gán vào biến `ext`). Sau đó in ra màn hình hai biến này cách nhau bởi dấu gạch ngang (ví dụ: `"2026-pdf"`).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'file_name = "report_2026.pdf"\nyear = file_name[7:11]\next = file_name[-3:]\nprint(f"{year}-{ext}")',
      testCases: [
        {
          input: '',
          expectedOutput: '2026-pdf\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Đảo ngược chuỗi',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Nhập một chuỗi từ bàn phím. Sử dụng cú pháp cắt chuỗi (slicing) với bước nhảy âm để đảo ngược toàn bộ chuỗi đó và in ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 's = input().strip()\nprint(s[::-1])',
      testCases: [
        {
          input: 'mcode\n',
          expectedOutput: 'edocm\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.03': [
    {
      title: 'Chuẩn hóa tên đăng nhập',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo biến `raw_username = "  STUDENT_01  "`. Hãy thực hiện loại bỏ khoảng trắng dư thừa ở hai đầu và chuyển toàn bộ chuỗi thành chữ thường. In kết quả cuối cùng ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'raw_username = "  STUDENT_01  "\nclean_username = raw_username.strip().lower()\nprint(clean_username)',
      testCases: [
        {
          input: '',
          expectedOutput: 'student_01\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Thay thế từ nhạy cảm',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Nhập một câu từ bàn phím. Hãy viết chương trình thay thế tất cả các từ `"xấu"` bằng từ `"đẹp"`. In câu mới ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'sentence = input()\nprint(sentence.replace("xấu", "đẹp"))',
      testCases: [
        {
          input: 'Thời tiết rất xấu\n',
          expectedOutput: 'Thời tiết rất đẹp\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.04': [
    {
      title: 'Tạo câu chào tự động',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khai báo 3 biến: `name = "Duy"`, `math_score = 9`, và `english_score = 8`. Sử dụng F-string để in ra màn hình câu thông báo: `"Học sinh Duy có điểm trung bình là 8.5"` (trong đó 8.5 là kết quả tính toán trực tiếp điểm trung bình của hai môn trong f-string).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'name = "Duy"\nmath_score = 9\nenglish_score = 8\nprint(f"Học sinh {name} có điểm trung bình là {(math_score + english_score) / 2}")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Học sinh Duy có điểm trung bình là 8.5\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'In hóa đơn chi tiết',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Nhập tên sản phẩm `item` ở dòng 1 và đơn giá `price` (số nguyên) ở dòng 2. Hãy sử dụng F-string để in ra màn hình thông điệp: `"Sản phẩm [item] có giá [price] VNĐ"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'item = input().strip()\nprice = int(input())\nprint(f"Sản phẩm {item} có giá {price} VNĐ")',
      testCases: [
        {
          input: 'Bánh mì\n15000\n',
          expectedOutput: 'Sản phẩm Bánh mì có giá 15000 VNĐ\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.05': [
    {
      title: 'Truy xuất điểm thi',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khởi tạo danh sách `diem_so = [8.5, 7.0, 9.5, 6.0]`. Hãy in ra màn hình phần tử có giá trị lớn nhất trong danh sách (sử dụng chỉ số index tương ứng) và độ dài của danh sách này trên 2 dòng riêng biệt.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'diem_so = [8.5, 7.0, 9.5, 6.0]\nprint(diem_so[2])\nprint(len(diem_so))',
      testCases: [
        {
          input: '',
          expectedOutput: '9.5\n4\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tạo danh sách từ đầu vào',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Nhập 3 chuỗi trên 3 dòng từ bàn phím đại diện cho 3 loại quả yêu thích. Hãy gom chúng lại thành 1 List và in List đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'q1 = input().strip()\nq2 = input().strip()\nq3 = input().strip()\nlist_qua = [q1, q2, q3]\nprint(list_qua)',
      testCases: [
        {
          input: 'Cam\nTáo\nỔi\n',
          expectedOutput: "['Cam', 'Táo', 'Ổi']\n",
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.06': [
    {
      title: 'Quản lý giỏ hàng',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Cho danh sách `shopping = ["Táo", "Bột mì"]`. Thực hiện lần lượt:\n1. Thêm `"Sữa"` vào cuối danh sách.\n2. Thay thế phần tử thứ hai `"Bột mì"` bằng `"Bơ"`.\n3. Xóa phần tử đầu tiên khỏi danh sách.\nIn danh sách kết quả cuối cùng ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'shopping = ["Táo", "Bột mì"]\nshopping.append("Sữa")\nshopping[1] = "Bơ"\nshopping.pop(0)\nprint(shopping)',
      testCases: [
        {
          input: '',
          expectedOutput: "['Bơ', 'Sữa']\n",
          isHidden: false
        }
      ]
    },
    {
      title: 'Xóa phần tử theo giá trị',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Cho danh sách `languages = ["Python", "Java", "C++", "Java"]`. Hãy xóa phần tử `"Java"` xuất hiện đầu tiên bằng phương thức `.remove()`. In danh sách kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'languages = ["Python", "Java", "C++", "Java"]\nlanguages.remove("Java")\nprint(languages)',
      testCases: [
        {
          input: '',
          expectedOutput: "['Python', 'C++', 'Java']\n",
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.07': [
    {
      title: 'Tính tổng điểm giỏi',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Cho danh sách điểm `scores = [6.5, 8.0, 5.5, 9.0, 7.5]`. Viết chương trình sử dụng vòng lặp duyệt qua danh sách và tính tổng các điểm số lớn hơn hoặc bằng 7.0. In tổng đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'scores = [6.5, 8.0, 5.5, 9.0, 7.5]\ntong = 0.0\nfor s in scores:\n    if s >= 7.0:\n        tong += s\nprint(tong)',
      testCases: [
        {
          input: '',
          expectedOutput: '24.5\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Lọc số chẵn',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Cho danh sách số nguyên `numbers = [3, 8, 12, 5, 6, 9]`. Dùng vòng lặp `for` lọc ra các số chẵn và in chúng trên cùng một dòng, cách nhau bởi khoảng trắng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'numbers = [3, 8, 12, 5, 6, 9]\nevens = []\nfor num in numbers:\n    if num % 2 == 0:\n        evens.append(str(num))\nprint(" ".join(evens))',
      testCases: [
        {
          input: '',
          expectedOutput: '8 12 6\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Nhân đôi phần tử',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Cho danh sách số nguyên `nums = [1, 2, 3, 4]`. Sử dụng vòng lặp duyệt qua chỉ số index của danh sách để nhân đôi giá trị của từng phần tử. In danh sách sau khi sửa đổi ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'nums = [1, 2, 3, 4]\nfor i in range(len(nums)):\n    nums[i] *= 2\nprint(nums)',
      testCases: [
        {
          input: '',
          expectedOutput: '[2, 4, 6, 8]\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tìm phần tử lớn nhất',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập vào số lượng phần tử N ở dòng 1, sau đó nhập N số nguyên cách nhau bởi khoảng trắng ở dòng 2. Sử dụng vòng lặp duyệt qua danh sách để tìm số lớn nhất và in ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'n = int(input())\nnums = [int(x) for x in input().split()]\nmax_val = nums[0]\nfor num in nums:\n    if num > max_val:\n        max_val = num\nprint(max_val)',
      testCases: [
        {
          input: '5\n3 9 1 15 7\n',
          expectedOutput: '15\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.08': [
    {
      title: 'Sắp xếp điểm số',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Cho danh sách điểm học viên `scores = [8, 5, 9, 7]`. Hãy sắp xếp danh sách này theo thứ tự giảm dần và in kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'scores = [8, 5, 9, 7]\nscores.sort(reverse=True)\nprint(scores)',
      testCases: [
        {
          input: '',
          expectedOutput: '[9, 8, 7, 5]\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kiểm tra tồn tại',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập danh sách các loại quả cách nhau bởi khoảng trắng ở dòng 1, và một tên quả cần tìm ở dòng 2. In `"Tìm thấy"` nếu quả đó có trong danh sách, ngược lại in `"Không tìm thấy"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'list_qua = input().split()\nsearch_qua = input().strip()\nif search_qua in list_qua:\n    print("Tìm thấy")\nelse:\n    print("Không tìm thấy")',
      testCases: [
        {
          input: 'táo cam xoài\ncam\n',
          expectedOutput: 'Tìm thấy\n',
          isHidden: false
        },
        {
          input: 'táo cam xoài\nổi\n',
          expectedOutput: 'Không tìm thấy\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Sắp xếp tên học sinh',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập vào 4 tên học sinh trên 4 dòng khác nhau. Hãy sắp xếp danh sách tên học sinh này theo thứ tự từ điển tăng dần (sử dụng `.sort()` hoặc `sorted()`) và in danh sách kết quả ra.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'names = []\nfor _ in range(4):\n    names.append(input().strip())\nnames.sort()\nprint(names)',
      testCases: [
        {
          input: 'Vy\nAn\nBình\nDuy\n',
          expectedOutput: "['An', 'Bình', 'Duy', 'Vy']\n",
          isHidden: false
        }
      ]
    },
    {
      title: 'Tìm vị trí của màu sắc',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Cho danh sách `colors = ["red", "blue", "green", "blue"]`. Nhập một tên màu từ bàn phím. Nếu màu đó nằm trong danh sách, hãy in ra chỉ số (index) đầu tiên của nó. Nếu không có, in `"Không tồn tại"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'colors = ["red", "blue", "green", "blue"]\ncolor = input().strip()\nif color in colors:\n    print(colors.index(color))\nelse:\n    print("Không tồn tại")',
      testCases: [
        {
          input: 'blue\n',
          expectedOutput: '1\n',
          isHidden: false
        },
        {
          input: 'yellow\n',
          expectedOutput: 'Không tồn tại\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.09': [
    {
      title: 'Khởi tạo tọa độ',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy khởi tạo một Tuple tên là `point` chứa hai số 15 và 30 đại diện cho tọa độ x và y. Hãy in ra màn hình phần tử y (tọa độ thứ hai) của Tuple đó.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'point = (15, 30)\nprint(point[1])',
      testCases: [
        {
          input: '',
          expectedOutput: '30\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Mở gói Tuple thông tin',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Khởi tạo Tuple `student_info = ("Nam", 15, "10A")`. Hãy mở gói tuple này vào 3 biến: `name`, `age`, `class_name`. In ra màn hình dòng chữ: `"[name] học lớp [class_name] và năm nay [age] tuổi"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'student_info = ("Nam", 15, "10A")\nname, age, class_name = student_info\nprint(f"{name} học lớp {class_name} và năm nay {age} tuổi")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Nam học lớp 10A và năm nay 15 tuổi\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.10': [
    {
      title: 'Lọc trùng số điện thoại',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Cho danh sách số điện thoại trùng lặp `phones = ["090", "091", "090", "098", "091"]`. Hãy loại bỏ các phần tử trùng lặp, sắp xếp tăng dần và in kết quả ra màn hình dưới dạng một List (sử dụng: `list(sorted(set(phones)))`).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'phones = ["090", "091", "090", "098", "091"]\nunique_phones = list(sorted(set(phones)))\nprint(unique_phones)',
      testCases: [
        {
          input: '',
          expectedOutput: "['090', '091', '098']\n",
          isHidden: false
        }
      ]
    },
    {
      title: 'Tìm phần tử chung của hai Set',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Cho hai danh sách `list1 = [1, 2, 3, 4]` và `list2 = [3, 4, 5, 6]`. Hãy chuyển chúng thành Set, tìm phần giao của hai Set, chuyển kết quả giao đó thành một List đã sắp xếp tăng dần và in ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'list1 = [1, 2, 3, 4]\nlist2 = [3, 4, 5, 6]\nset1 = set(list1)\nset2 = set(list2)\ncommon = list(sorted(set1.intersection(set2)))\nprint(common)',
      testCases: [
        {
          input: '',
          expectedOutput: '[3, 4]\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Đếm ký tự duy nhất',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập một chuỗi ký tự từ bàn phím. Hãy đếm số lượng ký tự khác nhau trong chuỗi đó (không tính khoảng trắng và ký tự xuống dòng `\\n`). In số lượng ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 's = input().replace(" ", "").replace("\\n", "").replace("\\r", "")\nprint(len(set(s)))',
      testCases: [
        {
          input: 'hello world\n',
          expectedOutput: '8\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Học sinh chung hai câu lạc bộ',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: 'Nhập danh sách tên các thành viên CLB Toán ở dòng 1 (phân tách bởi khoảng trắng), CLB Văn ở dòng 2. Hãy tìm và in ra danh sách học sinh tham gia cả hai CLB. Danh sách trả về là List đã sắp xếp tăng dần theo bảng chữ cái.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'toan = set(input().split())\nvan = set(input().split())\nchung = list(sorted(toan.intersection(van)))\nprint(chung)',
      testCases: [
        {
          input: 'An Bình Chi\nBình Vy Chi\n',
          expectedOutput: "['Bình', 'Chi']\n",
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.11': [
    {
      title: 'Thông tin sản phẩm',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Hãy khởi tạo một Dictionary tên là `product` lưu trữ thông tin gồm: `"name"` là `"Laptop"`, `"price"` là `15000000`. Hãy in ra màn hình giá bán (`"price"`) của sản phẩm đó.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'product = {\n    "name": "Laptop",\n    "price": 15000000\n}\nprint(product["price"])',
      testCases: [
        {
          input: '',
          expectedOutput: '15000000\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kiểm tra sự tồn tại của khóa',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Cho từ điển `config = {"host": "localhost", "port": 8080}`. Nhập một từ khóa `key` từ bàn phím. Nếu khóa đó tồn tại trong từ điển, in giá trị của nó. Nếu không, in `"Không tìm thấy"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'config = {"host": "localhost", "port": 8080}\nkey = input().strip()\nif key in config:\n    print(config[key])\nelse:\n    print("Không tìm thấy")',
      testCases: [
        {
          input: 'host\n',
          expectedOutput: 'localhost\n',
          isHidden: false
        },
        {
          input: 'username\n',
          expectedOutput: 'Không tìm thấy\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tra cứu bảng giá quả',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Cho từ điển `prices = {"táo": 20, "cam": 15, "chuối": 10}`. Nhập tên loại quả từ bàn phím. In ra màn hình dòng chữ `"Giá: [giá bán] VNĐ"`. Nếu loại quả nhập vào không có trong từ điển, in `"Không bán"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'prices = {"táo": 20, "cam": 15, "chuối": 10}\nname = input().strip()\nif name in prices:\n    print(f"Giá: {prices[name]} VNĐ")\nelse:\n    print("Không bán")',
      testCases: [
        {
          input: 'cam\n',
          expectedOutput: 'Giá: 15 VNĐ\n',
          isHidden: false
        },
        {
          input: 'ổi\n',
          expectedOutput: 'Không bán\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Ghép hai List thành Dictionary',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Cho hai danh sách `keys = ["a", "b", "c"]` và `values = [1, 2, 3]`. Sử dụng hàm `zip()` để ghép chúng thành một Dictionary và in Dictionary đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'keys = ["a", "b", "c"]\nvalues = [1, 2, 3]\ndict_res = dict(zip(keys, values))\nprint(dict_res)',
      testCases: [
        {
          input: '',
          expectedOutput: "{'a': 1, 'b': 2, 'c': 3}\n",
          isHidden: false
        }
      ]
    },
    {
      title: 'Tần suất xuất hiện của các từ',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Nhập một chuỗi gồm các từ cách nhau bởi khoảng trắng từ bàn phím. Đếm số lần xuất hiện của mỗi từ và lưu vào một Dictionary. In Dictionary kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'words = input().split()\ncounter = {}\nfor w in words:\n    counter[w] = counter.get(w, 0) + 1\nprint(counter)',
      testCases: [
        {
          input: 'táo cam táo chuối\n',
          expectedOutput: "{'táo': 2, 'cam': 1, 'chuối': 1}\n",
          isHidden: false
        }
      ]
    }
  ],
  'LS-03.12': [
    {
      title: 'Quản lý tồn kho',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Cho từ điển kho hàng `stock = {"táo": 10, "cam": 5}`. Hãy thực hiện:\n1. Thêm mặt hàng `"chuối"` với số lượng là `20`.\n2. Cập nhật số lượng mặt hàng `"cam"` lên thành `12`.\n3. Xóa mặt hàng `"táo"` khỏi kho hàng.\nIn từ điển `stock` ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'stock = {"táo": 10, "cam": 5}\nstock["chuối"] = 20\nstock["cam"] = 12\ndel stock["táo"]\nprint(stock)',
      testCases: [
        {
          input: '',
          expectedOutput: "{'cam': 12, 'chuối': 20}\n",
          isHidden: false
        }
      ]
    },
    {
      title: 'In cặp thông tin điểm số',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Cho từ điển học lực `grades = {"An": 8.5, "Bình": 7.0}`. Sử dụng vòng lặp để duyệt qua các cặp `key, value` của từ điển (dùng `.items()`) và in ra màn hình thông tin theo định dạng `"[Tên]: [Điểm]"` trên từng dòng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'grades = {"An": 8.5, "Bình": 7.0}\nfor name, score in grades.items():\n    print(f"{name}: {score}")',
      testCases: [
        {
          input: '',
          expectedOutput: 'An: 8.5\nBình: 7.0\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tìm thủ khoa của lớp',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Cho từ điển điểm thi của một nhóm: `scores = {"Vy": 9.2, "Duy": 8.8, "Nam": 9.5}`. Hãy tìm người có điểm số cao nhất và in ra tên cùng điểm số của người đó cách nhau bởi khoảng trắng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'scores = {"Vy": 9.2, "Duy": 8.8, "Nam": 9.5}\nbest_student = ""\nmax_score = -1\nfor name, score in scores.items():\n    if score > max_score:\n        max_score = score\n        best_student = name\nprint(best_student, max_score)',
      testCases: [
        {
          input: '',
          expectedOutput: 'Nam 9.5\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tổng hóa đơn giỏ hàng',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Cho từ điển giỏ hàng gồm số lượng mua của từng sản phẩm: `cart = {"áo": 2, "quần": 1}`. Từ điển đơn giá từng sản phẩm là: `prices = {"áo": 150, "quần": 300}`. Tính tổng số tiền của giỏ hàng này và in ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'cart = {"áo": 2, "quần": 1}\nprices = {"áo": 150, "quần": 300}\ntotal = 0\nfor item, qty in cart.items():\n    total += qty * prices[item]\nprint(total)',
      testCases: [
        {
          input: '',
          expectedOutput: '600\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Gộp doanh số hai ngày',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Cho doanh thu sản phẩm hai ngày: `day1 = {"A": 100, "B": 200}` và `day2 = {"B": 150, "C": 300}`. Hãy gộp hai từ điển này lại, nếu sản phẩm xuất hiện ở cả 2 ngày thì cộng dồn doanh thu. In từ điển kết quả (đã sắp xếp các Key tăng dần) ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'day1 = {"A": 100, "B": 200}\nday2 = {"B": 150, "C": 300}\nres = day1.copy()\nfor k, v in day2.items():\n    res[k] = res.get(k, 0) + v\nsorted_res = {k: res[k] for k in sorted(res.keys())}\nprint(sorted_res)',
      testCases: [
        {
          input: '',
          expectedOutput: "{'A': 100, 'B': 350, 'C': 300}\n",
          isHidden: false
        }
      ]
    }
  ],
  'LS-04.01': [
    {
      title: 'Hàm in khẩu hiệu',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy định nghĩa một hàm tên là `show_slogan` không nhận tham số đầu vào. Hàm sẽ in ra màn hình chuỗi: `"Học Python thật thú vị!"`. Đừng quên viết câu lệnh gọi hàm này hoạt động ở dòng cuối cùng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def show_slogan():\n    print("Học Python thật thú vị!")\n\nshow_slogan()',
      testCases: [
        {
          input: '',
          expectedOutput: 'Học Python thật thú vị!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Hàm in vạch kẻ ngang',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Định nghĩa một hàm tên là `print_line()` thực hiện nhiệm vụ in ra một dòng gồm 10 ký tự dấu gạch ngang liên tiếp: `"----------"`. Gọi hàm này 2 lần liên tiếp.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def print_line():\n    print("----------")\n\nprint_line()\nprint_line()',
      testCases: [
        {
          input: '',
          expectedOutput: '----------\n----------\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-04.02': [
    {
      title: 'Hàm chào tên riêng',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Định nghĩa một hàm tên là `say_hello` nhận vào một tham số `name`. Hàm sẽ in ra màn hình chuỗi: `"Xin chào, {name}!"`. Gọi hàm này với đối số truyền vào là `"MCode"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def say_hello(name):\n    print(f"Xin chào, {name}!")\n\nsay_hello("MCode")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Xin chào, MCode!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Hàm tính lũy thừa mặc định',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Định nghĩa hàm `power` nhận vào cơ số `base` và tham số mặc định `exponent = 2` (số mũ). Hàm trả về kết quả phép lũy thừa. Hãy gọi hàm `power(3)` rồi in ra ở dòng 1, sau đó gọi `power(2, 3)` rồi in ra ở dòng 2.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def power(base, exponent=2):\n    return base ** exponent\n\nprint(power(3))\nprint(power(2, 3))',
      testCases: [
        {
          input: '',
          expectedOutput: '9\n8\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-04.03': [
    {
      title: 'Hàm tính diện tích',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Định nghĩa hàm `calc_area` nhận vào tham số là chiều rộng `width` và chiều cao `height` của hình chữ nhật. Hàm sẽ tính toán và **trả về** (bằng lệnh `return`) diện tích hình chữ nhật đó. Gọi hàm này với kích thước `5` và `10`, lưu kết quả vào biến `area` và in giá trị biến đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def calc_area(width, height):\n    return width * height\n\narea = calc_area(5, 10)\nprint(area)',
      testCases: [
        {
          input: '',
          expectedOutput: '50\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Hàm tìm số lớn nhất của hai số',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Định nghĩa hàm `find_max` nhận hai số `a` và `b`. Hàm sẽ so sánh và **trả về** số lớn hơn trong hai số. Gọi hàm này với `5` và `9`, in kết quả trực tiếp ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def find_max(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(find_max(5, 9))',
      testCases: [
        {
          input: '',
          expectedOutput: '9\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-04.04': [
    {
      title: 'Tăng biến toàn cục',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Khai báo biến toàn cục `score = 10`. Hãy định nghĩa hàm `add_score()` sử dụng từ khóa `global` để cộng thêm `5` điểm vào biến toàn cục `score`. Gọi hàm này và in ra màn hình giá trị của biến `score` sau khi gọi.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'score = 10\ndef add_score():\n    global score\n    score += 5\n\nadd_score()\nprint(score)',
      testCases: [
        {
          input: '',
          expectedOutput: '15\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tránh ghi đè biến toàn cục',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Khai báo biến toàn cục `x = 10`. Định nghĩa hàm `set_local()` gán biến cục bộ `x = 5`. Hãy gọi hàm `set_local()`, sau đó in giá trị của biến toàn cục `x` ra màn hình để xem nó có bị thay đổi không.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'x = 10\ndef set_local():\n    x = 5\n\nset_local()\nprint(x)',
      testCases: [
        {
          input: '',
          expectedOutput: '10\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Sửa đổi danh sách toàn cục',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Khai báo danh sách toàn cục `my_list = [1, 2]`. Định nghĩa hàm `append_element(val)` thực hiện thêm phần tử `val` vào danh sách `my_list`. Gọi hàm với tham số `3` và in danh sách `my_list` ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'my_list = [1, 2]\ndef append_element(val):\n    my_list.append(val)\n\nappend_element(3)\nprint(my_list)',
      testCases: [
        {
          input: '',
          expectedOutput: '[1, 2, 3]\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Đếm lượt gọi hàm',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Khai báo biến toàn cục `count = 0`. Định nghĩa hàm `click()` sử dụng từ khóa `global` để cộng thêm `1` vào `count` mỗi lần gọi. Hãy gọi hàm này 3 lần liên tiếp, sau đó in giá trị của `count` ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'count = 0\ndef click():\n    global count\n    count += 1\n\nclick()\nclick()\nclick()\nprint(count)',
      testCases: [
        {
          input: '',
          expectedOutput: '3\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Phạm vi nonlocal',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa hàm ngoài `outer()`. Bên trong `outer()`, tạo biến `x = "bố"`. Định nghĩa hàm trong `inner()` lồng bên trong `outer()`, dùng từ khóa `nonlocal x` để thay đổi giá trị của `x` thành `"con"`. Trong hàm `outer()`, hãy gọi `inner()` rồi in giá trị của `x`. Cuối cùng, hãy gọi hàm `outer()` ở ngoài cùng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def outer():\n    x = "bố"\n    def inner():\n        nonlocal x\n        x = "con"\n    inner()\n    print(x)\n\nouter()',
      testCases: [
        {
          input: '',
          expectedOutput: 'con\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-04.05': [
    {
      title: 'Lấy mẫu chia cho 0',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết chương trình thực hiện phép tính chia `10 / 0` nằm trong khối `try-except`, bắt ngoại lệ `ZeroDivisionError` và in ra dòng chữ `"Lỗi chia cho 0"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'try:\n    10 / 0\nexcept ZeroDivisionError:\n    print("Lỗi chia cho 0")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Lỗi chia cho 0\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Bắt lỗi ép kiểu chữ',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Thực hiện ép kiểu chuỗi `"abc"` sang số nguyên bằng hàm `int()` trong khối `try-except`. Hãy bắt lỗi `ValueError` và in ra màn hình dòng chữ `"Lỗi chuyển đổi kiểu"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'try:\n    int("abc")\nexcept ValueError:\n    print("Lỗi chuyển đổi kiểu")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Lỗi chuyển đổi kiểu\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-04.06': [
    {
      title: 'Ép kiểu an toàn',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết chương trình nhận vào một chuỗi từ câu lệnh `input()`. Thử ép kiểu chuỗi đó sang số nguyên bằng `int()`. Nếu thành công, hãy in số nguyên đó ra màn hình. Nếu xảy ra lỗi `ValueError`, hãy bắt lỗi và in ra màn hình dòng chữ `"Không phải số nguyên"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 's = input()\ntry:\n    n = int(s)\n    print(n)\nexcept ValueError:\n    print("Không phải số nguyên")',
      testCases: [
        {
          input: '123\n',
          expectedOutput: '123\n',
          isHidden: false
        },
        {
          input: 'abc\n',
          expectedOutput: 'Không phải số nguyên\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Truy xuất phần tử List an toàn',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Cho danh sách `colors = ["red", "green"]`. Hãy nhập một số nguyên `index` từ bàn phím. Sử dụng khối `try-except` để in phần tử `colors[index]`. Nếu chỉ số `index` nằm ngoài phạm vi danh sách, hãy bắt lỗi `IndexError` và in ra màn hình `"Chỉ số vượt quá giới hạn"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'colors = ["red", "green"]\ntry:\n    idx = int(input())\n    print(colors[idx])\nexcept IndexError:\n    print("Chỉ số vượt quá giới hạn")',
      testCases: [
        {
          input: '1\n',
          expectedOutput: 'green\n',
          isHidden: false
        },
        {
          input: '5\n',
          expectedOutput: 'Chỉ số vượt quá giới hạn\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-04.07': [
    {
      title: 'Kiểm tra số âm',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Hãy định nghĩa hàm `check_positive` nhận vào tham số `n`. Nếu `n` nhỏ hơn `0`, hãy dùng lệnh `raise ValueError("Số âm")`. Hãy viết chương trình gọi hàm này với giá trị nhập từ `input()` (được ép kiểu sang số nguyên). Sử dụng `try-except` để bắt `ValueError` và in ra thông báo lỗi đó ra màn hình, và trong khối `finally` hãy luôn in ra chữ `"Xong"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def check_positive(n):\n    if n < 0:\n        raise ValueError("Số âm")\n\ntry:\n    val = int(input())\n    check_positive(val)\nexcept ValueError as e:\n    print(e)\nfinally:\n    print("Xong")',
      testCases: [
        {
          input: '5\n',
          expectedOutput: 'Xong\n',
          isHidden: false
        },
        {
          input: '-2\n',
          expectedOutput: 'Số âm\nXong\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Bắt lỗi ném ra chủ động',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa hàm `vote(age)` kiểm tra tuổi. Nếu `age < 18`, sử dụng từ khóa `raise` để ném ngoại lệ `ValueError` với thông báo `"Chưa đủ tuổi bầu cử"`. Gọi hàm này trong khối `try-except` với tham số `15`, bắt lỗi và in ra thông báo lỗi.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def vote(age):\n    if age < 18:\n        raise ValueError("Chưa đủ tuổi bầu cử")\n\ntry:\n    vote(15)\nexcept ValueError as e:\n    print(e)',
      testCases: [
        {
          input: '',
          expectedOutput: 'Chưa đủ tuổi bầu cử\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Thử thách số chẵn',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa hàm `check_even(n)` ném ngoại lệ `TypeError` với thông báo `"Không phải số chẵn"` nếu `n` lẻ. Nhập số nguyên N từ bàn phím, bọc lệnh gọi hàm trong `try-except`, bắt `TypeError` và in ra thông báo lỗi.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def check_even(n):\n    if n % 2 != 0:\n        raise TypeError("Không phải số chẵn")\n\ntry:\n    val = int(input())\n    check_even(val)\nexcept TypeError as e:\n    print(e)',
      testCases: [
        {
          input: '3\n',
          expectedOutput: 'Không phải số chẵn\n',
          isHidden: false
        },
        {
          input: '4\n',
          expectedOutput: '',
          isHidden: false
        }
      ]
    },
    {
      title: 'Rút tiền an toàn',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa hàm `withdraw(amount, balance)` ném ngoại lệ `ValueError("Số dư không đủ")` nếu số tiền rút `amount` lớn hơn số dư `balance`. Hãy nhập vào số tiền rút ở dòng 1 và số dư ở dòng 2. Hãy gọi hàm này trong khối `try-except`, in ra thông báo lỗi nếu có, và khối `finally` phải luôn in ra `"Giao dịch hoàn thành"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'def withdraw(amount, balance):\n    if amount > balance:\n        raise ValueError("Số dư không đủ")\n\ntry:\n    a = int(input())\n    b = int(input())\n    withdraw(a, b)\nexcept ValueError as e:\n    print(e)\nfinally:\n    print("Giao dịch hoàn thành")',
      testCases: [
        {
          input: '150\n100\n',
          expectedOutput: 'Số dư không đủ\nGiao dịch hoàn thành\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Ngoại lệ tự định nghĩa',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Hãy định nghĩa một lớp ngoại lệ tùy chỉnh tên là `InvalidEmailError` kế thừa từ lớp `Exception`. Định nghĩa hàm `check_email(email)` kiểm tra xem chuỗi email có chứa ký tự `"@"` hay không. Nếu không, hãy ném ngoại lệ `InvalidEmailError` với thông báo `"Email không hợp lệ"`. Nhập email từ bàn phím, gọi hàm `check_email` trong khối `try-except`, bắt lỗi `InvalidEmailError` và in ra thông báo lỗi.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class InvalidEmailError(Exception):\n    pass\n\ndef check_email(email):\n    if "@" not in email:\n        raise InvalidEmailError("Email không hợp lệ")\n\ntry:\n    email_input = input().strip()\n    check_email(email_input)\nexcept InvalidEmailError as e:\n    print(e)',
      testCases: [
        {
          input: 'test.com\n',
          expectedOutput: 'Email không hợp lệ\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-04.08': [
    {
      title: 'Sử dụng hàm math.floor',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy import thư viện `math` và dùng hàm `math.floor(x)` để làm tròn xuống một số thực nhập từ bàn phím bằng `float(input())`. In kết quả đã làm tròn đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'import math\nval = float(input())\nprint(math.floor(val))',
      testCases: [
        {
          input: '5.7\n',
          expectedOutput: '5\n',
          isHidden: false
        },
        {
          input: '2.1\n',
          expectedOutput: '2\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Import và đổi tên thư viện',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy import thư viện `math` dưới tên đổi là `m`. Nhập vào một số nguyên dương từ bàn phím và sử dụng hàm `m.sqrt()` để tính căn bậc hai của số đó. In kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'import math as m\nval = float(input())\nprint(m.sqrt(val))',
      testCases: [
        {
          input: '16\n',
          expectedOutput: '4.0\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-04.09': [
    {
      title: 'Chọn phần tử ngẫu nhiên cố định',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy import thư viện `random`. Để kết quả ngẫu nhiên luôn cố định cho việc kiểm tra testcase, chương trình đã đặt sẵn hạt giống `random.seed(42)` cho bạn. Bạn chỉ cần viết lệnh dùng hàm `random.choice(items)` để lấy ra một phần tử ngẫu nhiên từ danh sách `items = ["Táo", "Cam", "Bưởi"]` và in phần tử đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'import random\nrandom.seed(42)\nitems = ["Táo", "Cam", "Bưởi"]\nprint(random.choice(items))',
      testCases: [
        {
          input: '',
          expectedOutput: 'Bưởi\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Định dạng ngày hiện tại',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Import class `datetime` từ module `datetime`. Hãy tạo đối tượng đại diện cho ngày 18 tháng 7 năm 2026, lúc 9 giờ 30 phút bằng lệnh `datetime(2026, 7, 18, 9, 30)`. Dùng phương thức `.strftime("%d/%m/%Y")` để định dạng và in ngày ra màn hình theo cấu trúc `"ngày/tháng/năm"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'from datetime import datetime\nd = datetime(2026, 7, 18, 9, 30)\nprint(d.strftime("%d/%m/%Y"))',
      testCases: [
        {
          input: '',
          expectedOutput: '18/07/2026\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-05.01': [
    {
      title: 'Mở file cấu hình',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết một dòng lệnh sử dụng hàm `open()` để mở một tập tin tên là `"config.txt"` ở chế độ ghi tiếp dữ liệu (`"a"`) có mã hóa `"utf-8"`. Lưu đối tượng file này vào biến `f`, sau đó đóng file bằng lệnh `f.close()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'f = open("config.txt", "a", encoding="utf-8")\nf.close()',
      testCases: [
        {
          input: '',
          expectedOutput: '',
          isHidden: false
        }
      ]
    },
    {
      title: 'Bắt lỗi không tìm thấy tập tin',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết chương trình thử mở tập tin `"nonexistent.txt"` ở chế độ đọc (`"r"`). Sử dụng khối `try-except` bắt lỗi `FileNotFoundError` và in ra màn hình dòng chữ `"File không tồn tại"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'try:\n    f = open("nonexistent.txt", "r")\n    f.close()\nexcept FileNotFoundError:\n    print("File không tồn tại")',
      testCases: [
        {
          input: '',
          expectedOutput: 'File không tồn tại\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-05.02': [
    {
      title: 'Ghi điểm số',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết chương trình mở tập tin tên là `"scores.txt"` ở chế độ ghi mới (`"w"`), mã hóa `"utf-8"`. Hãy ghi hai dòng chữ sau vào tập tin, mỗi dòng kết thúc bằng ký tự xuống dòng `\\n`:\n1. `"Math: 9.5"\\n`\n2. `"English: 8.0"\\n`\nĐóng tập tin lại sau khi ghi xong. Sau khi đóng tập tin, hãy mở lại tập tin đó ở chế độ đọc, đọc toàn bộ nội dung của nó và in ra màn hình để kiểm tra.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'f = open("scores.txt", "w", encoding="utf-8")\nf.write("Math: 9.5\\n")\nf.write("English: 8.0\\n")\nf.close()\n\nf = open("scores.txt", "r", encoding="utf-8")\nprint(f.read(), end="")\nf.close()',
      testCases: [
        {
          input: '',
          expectedOutput: 'Math: 9.5\nEnglish: 8.0\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Đếm số dòng của tập tin',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Hãy viết một chương trình tạo ra file `"notes.txt"` và ghi vào đó 3 dòng chữ. Sau đó, mở lại file này để đọc và đếm xem file có bao nhiêu dòng. In số lượng dòng đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'f = open("notes.txt", "w", encoding="utf-8")\nf.write("Dòng 1\\nDòng 2\\nDòng 3\\n")\nf.close()\n\nf = open("notes.txt", "r", encoding="utf-8")\nlines = f.readlines()\nprint(len(lines))\nf.close()',
      testCases: [
        {
          input: '',
          expectedOutput: '3\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-05.03': [
    {
      title: 'Đọc ghi an toàn',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Sử dụng cấu trúc `with open(...)` để mở tập tin `"log.txt"` ở chế độ ghi mới (`"w"`), mã hóa `"utf-8"`. Ghi vào tập tin chuỗi `"System: Active"`. Sau đó, tiếp tục dùng cấu trúc `with open(...)` để mở lại tập tin đó ở chế độ đọc, đọc nội dung và in ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'with open("log.txt", "w", encoding="utf-8") as f:\n    f.write("System: Active")\n\nwith open("log.txt", "r", encoding="utf-8") as f:\n    print(f.read())',
      testCases: [
        {
          input: '',
          expectedOutput: 'System: Active\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Đọc từng dòng với with',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: 'Viết chương trình dùng `with open("names.txt", "w", encoding="utf-8") as f` để ghi hai dòng: `"An"` và `"Bình"`. Sau đó dùng `with open("names.txt", "r", encoding="utf-8") as f` duyệt qua từng dòng và in ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'with open("names.txt", "w", encoding="utf-8") as f:\n    f.write("An\\nBình\\n")\n\nwith open("names.txt", "r", encoding="utf-8") as f:\n    for line in f:\n        print(line, end="")',
      testCases: [
        {
          input: '',
          expectedOutput: 'An\nBình\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-05.04': [
    {
      title: 'Khởi tạo đối tượng Xe',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Hãy định nghĩa một lớp trống tên là `Car` (dùng từ khóa `pass`). Sau đó khởi tạo một đối tượng cụ thể từ lớp này và gán vào biến `my_car`. In kiểu dữ liệu của biến `my_car` ra màn hình (sử dụng hàm `type(my_car)`).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Car:\n    pass\n\nmy_car = Car()\nprint(type(my_car))',
      testCases: [
        {
          input: '',
          expectedOutput: "<class '__main__.Car'>\n",
          isHidden: false
        }
      ]
    },
    {
      title: 'Khởi tạo đối tượng Người',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa một lớp trống tên là `Person`. Tạo một thực thể `p` từ lớp này. Gán thuộc tính `p.name = "Duy"` ở ngoài lớp, sau đó in giá trị thuộc tính đó ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Person:\n    pass\n\np = Person()\np.name = "Duy"\nprint(p.name)',
      testCases: [
        {
          input: '',
          expectedOutput: 'Duy\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'So sánh hai đối tượng độc lập',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp trống `Point`. Hãy khởi tạo hai đối tượng `p1` và `p2` độc lập từ lớp này. So sánh hai đối tượng bằng `p1 == p2` và in giá trị Boolean kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Point:\n    pass\n\np1 = Point()\np2 = Point()\nprint(p1 == p2)',
      testCases: [
        {
          input: '',
          expectedOutput: 'False\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Thiết lập thuộc tính Sách',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp trống `Book`. Tạo đối tượng `b = Book()`. Gán thuộc tính `b.title = "Python"` và `b.pages = 300` từ bên ngoài lớp. In ra câu: `"Cuốn sách Python có 300 trang"`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Book:\n    pass\n\nb = Book()\nb.title = "Python"\nb.pages = 300\nprint(f"Cuốn sách {b.title} có {b.pages} trang")',
      testCases: [
        {
          input: '',
          expectedOutput: 'Cuốn sách Python có 300 trang\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kiểm tra kiểu thực thể',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp trống `Animal`. Khởi tạo đối tượng `dog` từ lớp này. Sử dụng hàm `isinstance(dog, Animal)` kết hợp với `print()` để in ra kết quả kiểm tra xem đối tượng có phải là thực thể của lớp hay không.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Animal:\n    pass\n\ndog = Animal()\nprint(isinstance(dog, Animal))',
      testCases: [
        {
          input: '',
          expectedOutput: 'True\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-05.05': [
    {
      title: 'Phương thức của Mèo',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `Cat` có thuộc tính lớp `legs = 4`. Định nghĩa thêm một phương thức tên là `meow(self)` in ra màn hình chuỗi `"Meo meo!"`. Khởi tạo đối tượng `my_cat = Cat()`, in ra thuộc tính `legs` của nó và gọi phương thức `meow()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Cat:\n    legs = 4\n    def meow(self):\n        print("Meo meo!")\n\nmy_cat = Cat()\nprint(my_cat.legs)\nmy_cat.meow()',
      testCases: [
        {
          input: '',
          expectedOutput: '4\nMeo meo!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Phương thức chào của Người',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `Person` có thuộc tính lớp `species = "Human"`. Thiết lập một phương thức `greet(self)` in ra màn hình chuỗi `"Hello!"`. Hãy tạo thực thể `p = Person()`, in thuộc tính `species` của nó và gọi phương thức `greet()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Person:\n    species = "Human"\n    def greet(self):\n        print("Hello!")\n\np = Person()\nprint(p.species)\np.greet()',
      testCases: [
        {
          input: '',
          expectedOutput: 'Human\nHello!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Tính chu vi Hình tròn',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `Circle` có thuộc tính lớp `pi = 3.14`. Hãy định nghĩa phương thức `calc_perimeter(self, radius)` tính và trả về chu vi hình tròn (`2 * pi * radius`). Tạo thực thể lớp `Circle`, gọi phương thức với bán kính `5` và in kết quả ra.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Circle:\n    pi = 3.14\n    def calc_perimeter(self, radius):\n        return 2 * self.pi * radius\n\nc = Circle()\nprint(c.calc_perimeter(5))',
      testCases: [
        {
          input: '',
          expectedOutput: '31.4\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Gửi tiền vào tài khoản',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `BankAccount` có thuộc tính đối tượng `balance = 0`. Định nghĩa phương thức `deposit(self, amount)` thực hiện cộng thêm `amount` vào thuộc tính `balance`. Hãy tạo đối tượng tài khoản, gọi phương thức `deposit(100)` và in giá trị `balance` cuối cùng ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class BankAccount:\n    balance = 0\n    def deposit(self, amount):\n        self.balance += amount\n\nacc = BankAccount()\nacc.deposit(100)\nprint(acc.balance)',
      testCases: [
        {
          input: '',
          expectedOutput: '100\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Bộ đếm số lần gọi phương thức',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `Counter` có thuộc tính đối tượng `count = 0`. Hãy định nghĩa phương thức `increment(self)` để tăng `count` lên 1 đơn vị mỗi lần gọi. Khởi tạo đối tượng, gọi `increment()` 3 lần liên tiếp và in ra thuộc tính `count` để kiểm tra.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Counter:\n    count = 0\n    def increment(self):\n        self.count += 1\n\ncnt = Counter()\ncnt.increment()\ncnt.increment()\ncnt.increment()\nprint(cnt.count)',
      testCases: [
        {
          input: '',
          expectedOutput: '3\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-05.06': [
    {
      title: 'Thiết lập Học sinh',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Hãy định nghĩa lớp `Student` có phương thức khởi tạo `__init__(self, name, age)`. Trong phương thức khởi tạo, hãy gán các giá trị tham số này cho các thuộc tính đối tượng `self.name` và `self.age`. Khởi tạo đối tượng `s = Student("Minh", 16)`, in ra màn hình thuộc tính `name` và `age` của đối tượng cách nhau bởi một khoảng trắng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Student:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\ns = Student("Minh", 16)\nprint(s.name, s.age)',
      testCases: [
        {
          input: '',
          expectedOutput: 'Minh 16\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Khởi tạo tọa độ Điểm',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `Point` nhận tham số `x` và `y` trong phương thức khởi tạo `__init__`. Gán các tham số này vào thuộc tính `self.x` và `self.y`. Khởi tạo đối tượng `p = Point(3, 4)` và in ra tọa độ theo định dạng `"(x, y)"` (ví dụ: `"(3, 4)"`).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Point(3, 4)\nprint(f"({p.x}, {p.y})")',
      testCases: [
        {
          input: '',
          expectedOutput: '(3, 4)\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Khởi tạo và tính diện tích hình chữ nhật',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `Rectangle` có constructor `__init__(self, width, height)` gán thuộc tính. Định nghĩa phương thức `get_area(self)` trả về diện tích (`width * height`). Tạo đối tượng kích thước 4 và 5, gọi `get_area()` và in ra.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def get_area(self):\n        return self.width * self.height\n\nr = Rectangle(4, 5)\nprint(r.get_area())',
      testCases: [
        {
          input: '',
          expectedOutput: '20\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Sản phẩm có giá mặc định',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `Item` có constructor `__init__(self, name, price=1000)` gán thuộc tính. Khởi tạo `item1 = Item("Kẹo")` và `item2 = Item("Bánh", 5000)`. In ra tên và giá bán của cả hai sản phẩm trên 2 dòng riêng biệt cách nhau bởi khoảng trắng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Item:\n    def __init__(self, name, price=1000):\n        self.name = name\n        self.price = price\n\nitem1 = Item("Kẹo")\nitem2 = Item("Bánh", 5000)\nprint(item1.name, item1.price)\nprint(item2.name, item2.price)',
      testCases: [
        {
          input: '',
          expectedOutput: 'Kẹo 1000\nBánh 5000\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Quản lý thành viên nhóm',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `Group` có constructor `__init__(self, name)` khởi tạo thuộc tính `self.name = name` và thuộc tính `self.members` là một danh sách rỗng `[]`. Tạo phương thức `add_member(self, member_name)` để thêm thành viên vào danh sách. Khởi tạo nhóm `"Admin"`, thêm `"An"` và `"Bình"`. In ra thuộc tính `members` của nhóm.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Group:\n    def __init__(self, name):\n        self.name = name\n        self.members = []\n    def add_member(self, member_name):\n        self.members.append(member_name)\n\ng = Group("Admin")\ng.add_member("An")\ng.add_member("Bình")\nprint(g.members)',
      testCases: [
        {
          input: '',
          expectedOutput: "['An', 'Bình']\n",
          isHidden: false
        }
      ]
    }
  ],
  'LS-05.07': [
    {
      title: 'Lớp con kế thừa Xe điện',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Hãy định nghĩa lớp cha `Vehicle` có phương thức khởi tạo `__init__(self, brand)` gán thuộc tính `self.brand = brand`. Định nghĩa lớp con `ElectricCar` kế thừa từ `Vehicle`. Trong lớp con `ElectricCar`, định nghĩa phương thức `__init__(self, brand, battery_capacity)` sử dụng hàm `super().__init__(brand)` để kế thừa thuộc tính `brand`, và tự gán thuộc tính `self.battery_capacity = battery_capacity`. Khởi tạo đối tượng `ev = ElectricCar("Tesla", 85)`. In thương hiệu và dung lượng pin của xe ra màn hình cách nhau bởi khoảng trắng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n\nclass ElectricCar(Vehicle):\n    def __init__(self, brand, battery_capacity):\n        super().__init__(brand)\n        self.battery_capacity = battery_capacity\n\nev = ElectricCar("Tesla", 85)\nprint(ev.brand, ev.battery_capacity)',
      testCases: [
        {
          input: '',
          expectedOutput: 'Tesla 85\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kế thừa tiếng kêu của Động vật',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp cha `Animal` có phương thức `speak(self)` in ra `"Tiếng kêu động vật"`. Định nghĩa lớp con `Dog` kế thừa từ `Animal` thực hiện ghi đè (override) phương thức `speak(self)` để in ra `"Gâu gâu!"`. Khởi tạo thực thể `d = Dog()` và gọi phương thức `speak()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Animal:\n    def speak(self):\n        print("Tiếng kêu động vật")\n\nclass Dog(Animal):\n    def speak(self):\n        print("Gâu gâu!")\n\nd = Dog()\nd.speak()',
      testCases: [
        {
          input: '',
          expectedOutput: 'Gâu gâu!\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Kế thừa và mở rộng thuộc tính',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp cha `Person` nhận `name` trong `__init__`. Định nghĩa lớp con `Teacher` kế thừa từ `Person` nhận `name` và `subject` trong `__init__`, dùng `super().__init__(name)` để kế thừa tên và tự thiết lập thuộc tính `subject`. Khởi tạo `t = Teacher("Bình", "Python")` và in ra tên cùng môn học cách nhau bởi khoảng trắng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Teacher(Person):\n    def __init__(self, name, subject):\n        super().__init__(name)\n        self.subject = subject\n\nt = Teacher("Bình", "Python")\nprint(t.name, t.subject)',
      testCases: [
        {
          input: '',
          expectedOutput: 'Bình Python\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Gọi phương thức lớp cha bằng super()',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp cha `Employee` có phương thức `work(self)` trả về chuỗi `"Làm việc"`. Định nghĩa lớp con `Manager` kế thừa từ `Employee` ghi đè phương thức `work(self)` để trả về chuỗi kết quả của `super().work() + " và quản lý"`. Khởi tạo một quản lý và in kết quả gọi phương thức `work()` ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class Employee:\n    def work(self):\n        return "Làm việc"\n\nclass Manager(Employee):\n    def work(self):\n        return super().work() + " và quản lý"\n\nm = Manager()\nprint(m.work())',
      testCases: [
        {
          input: '',
          expectedOutput: 'Làm việc và quản lý\n',
          isHidden: false
        }
      ]
    },
    {
      title: 'Đa cấp kế thừa',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: 'Định nghĩa lớp `LivingThing` có phương thức `breathe(self)` in ra `"Hít thở"`. Định nghĩa lớp `Animal` kế thừa từ `LivingThing`. Định nghĩa lớp `Cat` kế thừa từ `Animal` có thêm phương thức `meow(self)` in ra `"Meo"`. Khởi tạo đối tượng `c = Cat()`, gọi phương thức `breathe()` ở dòng 1 và `meow()` ở dòng 2.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'class LivingThing:\n    def breathe(self):\n        print("Hít thở")\n\nclass Animal(LivingThing):\n    pass\n\nclass Cat(Animal):\n    def meow(self):\n        print("Meo")\n\nc = Cat()\nc.breathe()\nc.meow()',
      testCases: [
        {
          input: '',
          expectedOutput: 'Hít thở\nMeo\n',
          isHidden: false
        }
      ]
    }
  ],
  'LS-01.MP': [
    {
      title: 'Tính tổng hai số',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 1: Tính tổng hai số\n\n- **Mô tả:** Viết chương trình nhận vào hai số nguyên `a` và `b`. Tính và in ra **tổng** của chúng.\n- **Input:**\n    - Hai số nguyên `a` và `b` được cung cấp.\n- **Output:**\n    - Một số nguyên duy nhất là tổng của `a` và `b`.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # a = 5\n    # b = 3\n    # Output:\n    # 8\n    ```\n    \n- **Giải thích ví dụ:** 5+3=8.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là tổng của a và b.\\n")',
      testCases: [
        { input: '- Hai số nguyên a và b được cung cấp.\n', expectedOutput: '- Một số nguyên duy nhất là tổng của a và b.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính hiệu hai số',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 2: Tính hiệu hai số\n\n- **Mô tả:** Viết chương trình nhận vào hai số nguyên `a` và `b`. Tính và in ra **hiệu** của `a` trừ `b`.\n- **Input:**\n    - Hai số nguyên `a` và `b` được cung cấp.\n- **Output:**\n    - Một số nguyên duy nhất là hiệu của `a` và `b`.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # a = 10\n    # b = 4\n    # Output:\n    # 6\n    ```\n    \n- **Giải thích ví dụ:** 10−4=6.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là hiệu của a và b.\\n")',
      testCases: [
        { input: '- Hai số nguyên a và b được cung cấp.\n', expectedOutput: '- Một số nguyên duy nhất là hiệu của a và b.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính tích ba số',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 3: Tính tích ba số\n\n- **Mô tả:** Viết chương trình nhận vào ba số nguyên `x`, `y`, và `z`. Tính và in ra **tích** của chúng.\n- **Input:**\n    - Ba số nguyên `x`, `y`, và `z` được cung cấp.\n- **Output:**\n    - Một số nguyên duy nhất là tích của `x`, `y`, và `z`.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # x = 2\n    # y = 3\n    # z = 4\n    # Output:\n    # 24\n    ```\n    \n- **Giải thích ví dụ:** 2×3×4=24.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là tích của x, y, và z.\\n")',
      testCases: [
        { input: '- Ba số nguyên x, y, và z được cung cấp.\n', expectedOutput: '- Một số nguyên duy nhất là tích của x, y, và z.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính thương nguyên và phần dư',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 4: Tính thương nguyên và phần dư\n\n- **Mô tả:** Viết chương trình nhận vào hai số nguyên `so_bi_chia` và `so_chia`. Tính và in ra **thương nguyên** và **phần dư** của phép chia `so_bi_chia` cho `so_chia`. (Giả sử `so_chia` luôn khác 0).\n- **Input:**\n    - Hai số nguyên `so_bi_chia` và `so_chia` được cung cấp.\n- **Output:**\n    - Dòng 1: Thương nguyên.\n    - Dòng 2: Phần dư.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # so_bi_chia = 17\n    # so_chia = 5\n    # Output:\n    # 3\n    # 2\n    ```\n    \n- **Giải thích ví dụ:** 17÷5 được thương là 3 và dư 2.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dòng 1: Thương nguyên.\\n")',
      testCases: [
        { input: '- Hai số nguyên so_bi_chia và so_chia được cung cấp.\n', expectedOutput: '- Dòng 1: Thương nguyên.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính chu vi và diện tích hình chữ nhật',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 5: Tính chu vi và diện tích hình chữ nhật\n\n- **Mô tả:** Viết chương trình nhận vào chiều dài `dai` và chiều rộng `rong` của một hình chữ nhật. Tính và in ra **chu vi** và **diện tích** của nó.\n- **Input:**\n    - Hai số thực `dai` và `rong` được cung cấp.\n- **Output:**\n    - Dòng 1: Chu vi của hình chữ nhật (số thực).\n    - Dòng 2: Diện tích của hình chữ nhật (số thực).\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # dai = 5.0\n    # rong = 3.0\n    # Output:\n    # 16.0\n    # 15.0\n    ```\n    \n- **Giải thích ví dụ:**\n    - Chu vi: 2×(5.0+3.0)=2×8.0=16.0.\n    - Diện tích: 5.0×3.0=15.0.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dòng 1: Chu vi của hình chữ nhật (số thực).\\n")',
      testCases: [
        { input: '- Hai số thực dai và rong được cung cấp.\n', expectedOutput: '- Dòng 1: Chu vi của hình chữ nhật (số thực).\n', isHidden: false }
      ]
    },
    {
      title: 'Chuyển đổi nhiệt độ từ Celsius sang Fahrenheit',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 6: Chuyển đổi nhiệt độ từ Celsius sang Fahrenheit\n\n- **Mô tả:** Viết chương trình nhận vào nhiệt độ `C` theo độ Celsius. Chuyển đổi và in ra nhiệt độ đó sang độ Fahrenheit.3223\n- **Công thức:** F=C×9/5+32\n- **Input:**\n    - Một số thực `C` (nhiệt độ Celsius) được cung cấp.\n- **Output:**\n    - Một số thực duy nhất là nhiệt độ theo độ Fahrenheit.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # C = 25.0\n    # Output:\n    # 77.0\n    ```\n    \n- **Giải thích ví dụ:** 25.0×9/5+32=45+32=77.0.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là nhiệt độ theo độ Fahrenheit.\\n")',
      testCases: [
        { input: '- Một số thực C (nhiệt độ Celsius) được cung cấp.\n', expectedOutput: '- Một số thực duy nhất là nhiệt độ theo độ Fahrenheit.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính tổng tiền mua hàng',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 7: Tính tổng tiền mua hàng\n\n- **Mô tả:** Một người mua 3 loại mặt hàng. Viết chương trình nhận vào số lượng và đơn giá của từng loại mặt hàng A, B, C. Tính và in ra **tổng số tiền** người đó phải trả.\n- **Input:**\n    - `so_luong_A`, `don_gia_A` (số nguyên)\n    - `so_luong_B`, `don_gia_B` (số nguyên)\n    - `so_luong_C`, `don_gia_C` (số nguyên)\n- **Output:**\n    - Một số nguyên duy nhất là tổng số tiền phải trả.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # so_luong_A = 2, don_gia_A = 10000\n    # so_luong_B = 1, don_gia_B = 50000\n    # so_luong_C = 3, don_gia_C = 5000\n    # Output:\n    # 85000\n    ```\n    \n- **Giải thích ví dụ:** (2×10000)+(1×50000)+(3×5000)=20000+50000+15000=85000.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là tổng số tiền phải trả.\\n")',
      testCases: [
        { input: '- so_luong_A, don_gia_A (số nguyên)\n', expectedOutput: '- Một số nguyên duy nhất là tổng số tiền phải trả.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính điểm trung bình của ba môn',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 8: Tính điểm trung bình của ba môn\n\n- **Mô tả:** Viết chương trình nhận vào điểm ba môn học: `diem_toan`, `diem_ly`, `diem_hoa`. Tính và in ra **điểm trung bình cộng** của ba môn này.\n- **Input:**\n    - Ba số thực `diem_toan`, `diem_ly`, `diem_hoa` được cung cấp.\n- **Output:**\n    - Một số thực duy nhất là điểm trung bình.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # diem_toan = 8.5\n    # diem_ly = 7.0\n    # diem_hoa = 9.0\n    # Output:\n    # 8.166666666666666\n    ```\n    \n- **Giải thích ví dụ:** (8.5+7.0+9.0)/3=24.5/3≈8.166....\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là điểm trung bình.\\n")',
      testCases: [
        { input: '- Ba số thực diem_toan, diem_ly, diem_hoa được cung cấp.\n', expectedOutput: '- Một số thực duy nhất là điểm trung bình.\n', isHidden: false }
      ]
    },
    {
      title: 'Hoán đổi giá trị hai biến',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 9: Hoán đổi giá trị hai biến\n\n- **Mô tả:** Viết chương trình nhận vào hai số nguyên `x` và `y`. **Hoán đổi** giá trị của chúng (nghĩa là giá trị của `x` sẽ trở thành giá trị của `y` và ngược lại). In ra giá trị mới của `x` và `y`. (Yêu cầu sử dụng một biến tạm để thực hiện hoán đổi).\n- **Input:**\n    - Hai số nguyên `x` và `y` được cung cấp.\n- **Output:**\n    - Dòng 1: Giá trị mới của `x`.\n        \n        ```python\n        # Input:\n        # x = 10\n        # y = 20\n        # Output:\n        # 20\n        # 10\n        ```\n        \n    - Dòng 2: Giá trị mới của `y`.\n- **Ví dụ:**\n- **Giải thích ví dụ:** Ban đầu x=10,y=20. Sau khi hoán đổi, x trở thành 20 và y trở thành 10.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dòng 1: Giá trị mới của x.\\n")',
      testCases: [
        { input: '- Hai số nguyên x và y được cung cấp.\n', expectedOutput: '- Dòng 1: Giá trị mới của x.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính giá trị biểu thức số học',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài 10: Tính giá trị biểu thức số học\n\n- **Mô tả:** Viết chương trình nhận vào ba số thực `a`, `b`, `c`. Tính và in ra giá trị của biểu thức: (a+b)×c−(a/b). (Giả sử `b` luôn khác 0).\n- **Input:**\n    - Ba số thực `a`, `b`, `c` được cung cấp.\n- **Output:**\n    - Một số thực duy nhất là kết quả của biểu thức.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # a = 6.0\n    # b = 2.0\n    # c = 3.0\n    # Output:\n    # 21.0\n    ```\n    \n- **Giải thích ví dụ:** (6.0+2.0)×3.0−(6.0/2.0)=8.0×3.0−3.0=24.0−3.0=21.0.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là kết quả của biểu thức.\\n")',
      testCases: [
        { input: '- Ba số thực a, b, c được cung cấp.\n', expectedOutput: '- Một số thực duy nhất là kết quả của biểu thức.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính toán chi phí xây dựng hàng rào',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 21: Tính toán chi phí xây dựng hàng rào\n\n- **Mô tả:** Viết chương trình nhận vào chiều dài `dai` và chiều rộng `rong` của một khu vườn hình chữ nhật. Tính và in ra tổng chi phí để xây dựng hàng rào xung quanh khu vườn, biết rằng chi phí vật liệu là `gia_vat_lieu_tren_met` (VNĐ/mét) và chi phí nhân công là `gia_nhan_cong_tren_met` (VNĐ/mét).\n- **Input:**\n    - `dai` (số thực), `rong` (số thực)\n    - `gia_vat_lieu_tren_met` (số nguyên), `gia_nhan_cong_tren_met` (số nguyên)\n- **Output:**\n    - Một số nguyên duy nhất là tổng chi phí xây dựng hàng rào.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # dai = 10.0, rong = 5.0\n    # gia_vat_lieu_tren_met = 50000\n    # gia_nhan_cong_tren_met = 20000\n    # Output:\n    # 2100000\n    ```\n    \n- **Giải thích ví dụ:**\n    - Chu vi khu vườn: 2×(10.0+5.0)=30.0 mét.\n    - Tổng chi phí trên mỗi mét: 50000+20000=70000 VNĐ/mét.\n    - Tổng chi phí: 30.0×70000=2100000 VNĐ.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là tổng chi phí xây dựng hàng rào.\\n")',
      testCases: [
        { input: '- dai (số thực), rong (số thực)\n', expectedOutput: '- Một số nguyên duy nhất là tổng chi phí xây dựng hàng rào.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính thể tích hình nón',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 22: Tính thể tích hình nón\n\n- **Mô tả:** Viết chương trình nhận vào bán kính đáy `ban_kinh_day` và chiều cao `chieu_cao` của một hình nón. Tính và in ra **thể tích** của hình nón đó.\n- **Công thức:** Thể tích = `(1/3) * PI * bán_kính_đáy * bán_kính_đáy * chiều_cao`\n- **Input:**\n    - Hai số thực `ban_kinh_day` và `chieu_cao`.\n- **Output:**\n    - Một số thực duy nhất là thể tích hình nón.\n- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)\n    \n    ```python\n    # Input:\n    # ban_kinh_day = 3.0\n    # chieu_cao = 4.0\n    # Output:\n    # 37.699111842\n    ```\n    \n- **Giải thích ví dụ:** 31×PI×3.02×4.0=31×PI×9.0×4.0=12.0×PI≈37.699....\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là thể tích hình nón.\\n")',
      testCases: [
        { input: '- Hai số thực ban_kinh_day và chieu_cao.\n', expectedOutput: '- Một số thực duy nhất là thể tích hình nón.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính diện tích toàn phần của hình trụ',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 23: Tính diện tích toàn phần của hình trụ\n\n- **Mô tả:** Viết chương trình nhận vào bán kính đáy `ban_kinh_day` và chiều cao `chieu_cao` của một hình trụ. Tính và in ra **diện tích toàn phần** của hình trụ đó.\n- **Công thức:**\n    - Diện tích đáy = `PI * bán_kính_đáy * bán_kính_đáy`\n    - Diện tích xung quanh = `2 * PI * bán_kính_đáy * chiều_cao`\n    - Diện tích toàn phần = `2 * Diện tích đáy + Diện tích xung quanh`\n- **Input:**\n    - Hai số thực `ban_kinh_day` và `chieu_cao`.\n- **Output:**\n    - Một số thực duy nhất là diện tích toàn phần hình trụ.\n- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)\n    \n    ```python\n    # Input:\n    # ban_kinh_day = 2.0\n    # chieu_cao = 5.0\n    # Output:\n    # 87.9645943\n    ```\n    \n- **Giải thích ví dụ:**\n    - Diện tích đáy: PI×2.02=4×PI.\n    - Diện tích xung quanh: 2×PI×2.0×5.0=20×PI.\n    - Diện tích toàn phần: 2×(4×PI)+(20×PI)=8×PI+20×PI=28×PI≈87.964....\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là diện tích toàn phần hình trụ.\\n")',
      testCases: [
        { input: '- Hai số thực ban_kinh_day và chieu_cao.\n', expectedOutput: '- Một số thực duy nhất là diện tích toàn phần hình trụ.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính diện tích hình bình hành',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 24: Tính diện tích hình bình hành\n\n- **Mô tả:** Viết chương trình nhận vào độ dài cạnh đáy `day` và chiều cao `chieu_cao` tương ứng của một hình bình hành. Tính và in ra **diện tích** của hình bình hành đó.\n- **Công thức:** Diện tích = `đáy * chiều_cao`\n- **Input:**\n    - Hai số thực `day` và `chieu_cao`.\n- **Output:**\n    - Một số thực duy nhất là diện tích hình bình hành.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # day = 7.0\n    # chieu_cao = 4.0\n    # Output:\n    # 28.0\n    ```\n    \n- **Giải thích ví dụ:** 7.0×4.0=28.0.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là diện tích hình bình hành.\\n")',
      testCases: [
        { input: '- Hai số thực day và chieu_cao.\n', expectedOutput: '- Một số thực duy nhất là diện tích hình bình hành.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính toán chi phí sơn nhà',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 25: Tính toán chi phí sơn nhà\n\n- **Mô tả:** Viết chương trình nhận vào chiều dài `chieu_dai_phong`, chiều rộng `chieu_rong_phong` và chiều cao `chieu_cao_phong` của một căn phòng. Tính và in ra tổng chi phí để sơn bốn bức tường của căn phòng đó, biết giá sơn là `gia_son_tren_met_vuong` (VNĐ/mét vuông). Bỏ qua diện tích cửa và các vật cản khác.\n- **Input:**\n    - `chieu_dai_phong` (số thực), `chieu_rong_phong` (số thực), `chieu_cao_phong` (số thực)\n    - `gia_son_tren_met_vuong` (số nguyên)\n- **Output:**\n    - Một số nguyên duy nhất là tổng chi phí sơn.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # chieu_dai_phong = 5.0, chieu_rong_phong = 4.0, chieu_cao_phong = 3.0\n    # gia_son_tren_met_vuong = 25000\n    # Output:\n    # 1350000\n    ```\n    \n- **Giải thích ví dụ:**\n    - Chu vi đáy phòng: 2×(5.0+4.0)=18.0 mét.\n    - Diện tích bốn bức tường (diện tích xung quanh): 18.0×3.0=54.0 mét vuông.\n    - Tổng chi phí sơn: 54.0×25000=1350000 VNĐ.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là tổng chi phí sơn.\\n")',
      testCases: [
        { input: '- chieu_dai_phong (số thực), chieu_rong_phong (số thực), chieu_cao_phong (số thực)\n', expectedOutput: '- Một số nguyên duy nhất là tổng chi phí sơn.\n', isHidden: false }
      ]
    },
    {
      title: 'Chuyển đổi đơn vị tiền tệ',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 26: Chuyển đổi đơn vị tiền tệ\n\n- **Mô tả:** Viết chương trình nhận vào một số tiền `so_tien_USD` (đô la Mỹ). Chuyển đổi và in ra số tiền này sang VNĐ, Euro và Yên Nhật.\n- **Tỷ giá cố định (chỉ dùng cho bài này):**\n    \n    ```python\n    1 USD = 25000 VNĐ\n    ```\n    \n    - `1 USD = 0.92 Euro`\n    - `1 USD = 155.0 Yên Nhật`\n- **Input:**\n    - Một số thực `so_tien_USD`.\n- **Output:**\n    - Dòng 1: Số tiền VNĐ (số thực).\n    - Dòng 2: Số tiền Euro (số thực).\n    - Dòng 3: Số tiền Yên Nhật (số thực).\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # so_tien_USD = 100.0\n    # Output:\n    # 2500000.0\n    # 92.0\n    # 15500.0\n    ```\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dòng 1: Số tiền VNĐ (số thực).\\n")',
      testCases: [
        { input: '- Một số thực so_tien_USD.\n', expectedOutput: '- Dòng 1: Số tiền VNĐ (số thực).\n', isHidden: false }
      ]
    },
    {
      title: 'Tính toán lợi nhuận và phần trăm lợi nhuận',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 27: Tính toán lợi nhuận và phần trăm lợi nhuận\n\n- **Mô tả:** Viết chương trình nhận vào giá mua `gia_mua` và giá bán `gia_ban` của một sản phẩm. Tính và in ra **lợi nhuận** và **phần trăm lợi nhuận** (so với giá mua).\n- **Công thức:**\n    - Lợi nhuận = `Giá bán - Giá mua`\n    - Phần trăm lợi nhuận = `(Lợi nhuận / Giá mua) * 100`\n- **Input:**\n    - Hai số thực `gia_mua` và `gia_ban` (giả sử `gia_mua` luôn dương).\n- **Output:**\n    - Dòng 1: Lợi nhuận (số thực).\n    - Dòng 2: Phần trăm lợi nhuận (số thực).\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # gia_mua = 80.0\n    # gia_ban = 100.0\n    # Output:\n    # 20.0\n    # 25.0\n    ```\n    \n- **Giải thích ví dụ:**\n    - Lợi nhuận: 100.0−80.0=20.0.\n    - Phần trăm lợi nhuận: (20.0/80.0)×100=0.25×100=25.0.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dòng 1: Lợi nhuận (số thực).\\n")',
      testCases: [
        { input: '- Hai số thực gia_mua và gia_ban (giả sử gia_mua luôn dương).\n', expectedOutput: '- Dòng 1: Lợi nhuận (số thực).\n', isHidden: false }
      ]
    },
    {
      title: 'Tính điểm thi cuối kỳ (có trọng số)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 28: Tính điểm thi cuối kỳ (có trọng số)\n\n- **Mô tả:** Viết chương trình nhận vào điểm bài tập `diem_bai_tap`, điểm giữa kỳ `diem_giua_ky` và điểm cuối kỳ `diem_cuoi_ky`. Tính và in ra **điểm tổng kết** của học sinh, biết rằng mỗi loại điểm có trọng số khác nhau.\n- **Trọng số:**\n    - Bài tập: 20%\n    - Giữa kỳ: 30%\n    - Cuối kỳ: 50%\n- **Input:**\n    - Ba số thực `diem_bai_tap`, `diem_giua_ky`, `diem_cuoi_ky`.\n- **Output:**\n    - Một số thực duy nhất là điểm tổng kết.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # diem_bai_tap = 9.0\n    # diem_giua_ky = 7.0\n    # diem_cuoi_ky = 8.0\n    # Output:\n    # 7.9\n    ```\n    \n- **Giải thích ví dụ:** (9.0×0.20)+(7.0×0.30)+(8.0×0.50)=1.8+2.1+4.0=7.9.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là điểm tổng kết.\\n")',
      testCases: [
        { input: '- Ba số thực diem_bai_tap, diem_giua_ky, diem_cuoi_ky.\n', expectedOutput: '- Một số thực duy nhất là điểm tổng kết.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính thời gian di chuyển',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 29: Tính thời gian di chuyển\n\n- **Mô tả:** Viết chương trình nhận vào khoảng cách `khoang_cach_km` (km) và vận tốc trung bình `van_toc_km_h` (km/giờ). Tính và in ra **thời gian di chuyển** tính bằng **giờ, phút và giây**.\n- **Input:**\n    - `khoang_cach_km` (số thực)\n    - `van_toc_km_h` (số thực, giả sử > 0)\n- **Output:**\n    - Dòng 1: Số giờ (số nguyên).\n    - Dòng 2: Số phút (số nguyên).\n    - Dòng 3: Số giây (số nguyên).\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # khoang_cach_km = 100.0\n    # van_toc_km_h = 40.0\n    # Output:\n    # 2\n    # 30\n    # 0\n    ```\n    \n- **Giải thích ví dụ:**\n    - Tổng thời gian (giờ): 100.0/40.0=2.5 giờ.\n    - Giờ nguyên: 2 giờ.\n    - Phần thập phân của giờ: 0.5 giờ.\n    - Số phút: 0.5×60=30 phút.\n    - Số giây (trong trường hợp này là 0).\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dòng 1: Số giờ (số nguyên).\\n")',
      testCases: [
        { input: '- khoang_cach_km (số thực)\n', expectedOutput: '- Dòng 1: Số giờ (số nguyên).\n', isHidden: false }
      ]
    },
    {
      title: 'Chuyển đổi giây thành giờ, phút, giây',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài 30: Chuyển đổi giây thành giờ, phút, giây\n\n- **Mô tả:** Viết chương trình nhận vào tổng số giây `tong_so_giay`. Chuyển đổi và in ra số giờ, số phút và số giây còn lại.\n- **Input:**\n- **Output:**\n    - Một số nguyên `tong_so_giay` (giả sử không âm).\n    - Dòng 1: Số giờ (số nguyên).\n    - Dòng 2: Số phút (số nguyên).\n    - Dòng 3: Số giây còn lại (số nguyên).\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # tong_so_giay = 3665\n    # Output:\n    # 1\n    # 1\n    # 5\n    ```\n    \n- **Giải thích ví dụ:**\n    - Số giờ: 3665÷3600=1 (dư 65)\n    - Số phút: 65÷60=1 (dư 5)\n    - Số giây còn lại: 5',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên tong_so_giay (giả sử không âm).\\n")',
      testCases: [
        { input: '- Output:\n', expectedOutput: '- Một số nguyên tong_so_giay (giả sử không âm).\n', isHidden: false }
      ]
    },
    {
      title: 'Tính diện tích hình tam giác (khi biết đáy và chiều cao)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 11: Tính diện tích hình tam giác (khi biết đáy và chiều cao)\n\n- **Mô tả:** Viết chương trình nhận vào độ dài cạnh đáy `day` và chiều cao `chieu_cao` tương ứng của một hình tam giác. Tính và in ra **diện tích** của tam giác đó.\n- **Công thức:** Diện tích = `(đáy * chiều_cao) / 2`\n- **Input:**\n    - Hai số thực `day` và `chieu_cao`.\n- **Output:**\n    - Một số thực duy nhất là diện tích hình tam giác.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # day = 10.0\n    # chieu_cao = 5.0\n    # Output:\n    # 25.0\n    ```\n    \n- **Giải thích ví dụ:** `(10.0 * 5.0) / 2 = 25.0`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là diện tích hình tam giác.\\n")',
      testCases: [
        { input: '- Hai số thực day và chieu_cao.\n', expectedOutput: '- Một số thực duy nhất là diện tích hình tam giác.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính chu vi và diện tích hình tròn',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 12: Tính chu vi và diện tích hình tròn\n\n- **Mô tả:** Viết chương trình nhận vào bán kính `ban_kinh` của một hình tròn. Tính và in ra **chu vi** và **diện tích** của hình tròn đó.\n- **Công thức:**\n    - Chu vi = `2 * PI * bán_kính`\n    - Diện tích = `PI * bán_kính * bán_kính` (hoặc `PI * bán_kính^2`)\n- **Input:**\n    - Một số thực `ban_kinh`.\n- **Output:**\n    - Dòng 1: Chu vi hình tròn (số thực).\n    - Dòng 2: Diện tích hình tròn (số thực).\n- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)\n    \n    ```python\n    # Input:\n    # ban_kinh = 3.0\n    # Output:\n    # 18.849555921\n    # 28.2743338815\n    ```\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dòng 1: Chu vi hình tròn (số thực).\\n")',
      testCases: [
        { input: '- Một số thực ban_kinh.\n', expectedOutput: '- Dòng 1: Chu vi hình tròn (số thực).\n', isHidden: false }
      ]
    },
    {
      title: 'Tính diện tích hình thang',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 13: Tính diện tích hình thang\n\n- **Mô tả:** Viết chương trình nhận vào độ dài hai đáy `day_lon`, `day_be` và chiều cao `chieu_cao` của một hình thang. Tính và in ra **diện tích** của hình thang đó.\n- **Công thức:** Diện tích = `((đáy_lớn + đáy_bé) * chiều_cao) / 2`\n- **Input:**\n    - Ba số thực `day_lon`, `day_be`, `chieu_cao`.\n- **Output:**\n    - Một số thực duy nhất là diện tích hình thang.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # day_lon = 8.0\n    # day_be = 4.0\n    # chieu_cao = 6.0\n    # Output:\n    # 36.0\n    ```\n    \n- **Giải thích ví dụ:** `((8.0 + 4.0) * 6.0) / 2 = (12.0 * 6.0) / 2 = 72.0 / 2 = 36.0`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là diện tích hình thang.\\n")',
      testCases: [
        { input: '- Ba số thực day_lon, day_be, chieu_cao.\n', expectedOutput: '- Một số thực duy nhất là diện tích hình thang.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính thể tích hình hộp chữ nhật',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 14: Tính thể tích hình hộp chữ nhật\n\n- **Mô tả:** Viết chương trình nhận vào chiều dài `dai`, chiều rộng `rong` và chiều cao `cao` của một hình hộp chữ nhật. Tính và in ra **thể tích** của nó.\n- **Công thức:** Thể tích = `dài * rộng * cao`\n- **Input:**\n    - Ba số thực `dai`, `rong`, `cao`.\n- **Output:**\n    - Một số thực duy nhất là thể tích hình hộp.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # dai = 4.0\n    # rong = 2.0\n    # cao = 3.0\n    # Output:\n    # 24.0\n    ```\n    \n- **Giải thích ví dụ:** `4.0 * 2.0 * 3.0 = 24.0`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là thể tích hình hộp.\\n")',
      testCases: [
        { input: '- Ba số thực dai, rong, cao.\n', expectedOutput: '- Một số thực duy nhất là thể tích hình hộp.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính diện tích bề mặt và thể tích hình cầu',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 15: Tính diện tích bề mặt và thể tích hình cầu\n\n- **Mô tả:** Viết chương trình nhận vào bán kính `ban_kinh` của một hình cầu. Tính và in ra **diện tích bề mặt** và **thể tích** của hình cầu đó.\n- **Công thức:**\n    - Diện tích bề mặt = `4 * PI * bán_kính * bán_kính` (hoặc `4 * PI * bán_kính^2`)\n    - Thể tích = `(4/3) * PI * bán_kính * bán_kính * bán_kính` (hoặc `(4/3) * PI * bán_kính^3`)\n- **Input:**\n    - Một số thực `ban_kinh`.\n- **Output:**\n    - Dòng 1: Diện tích bề mặt hình cầu (số thực).\n    - Dòng 2: Thể tích hình cầu (số thực).\n- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)\n    \n    ```python\n    # Input:\n    # ban_kinh = 2.0\n    # Output:\n    # 50.265482456\n    # 33.510321637333336\n    ```\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dòng 1: Diện tích bề mặt hình cầu (số thực).\\n")',
      testCases: [
        { input: '- Một số thực ban_kinh.\n', expectedOutput: '- Dòng 1: Diện tích bề mặt hình cầu (số thực).\n', isHidden: false }
      ]
    },
    {
      title: 'Tính độ dài cạnh huyền của tam giác vuông',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 16: Tính độ dài cạnh huyền của tam giác vuông\n\n- **Mô tả:** Viết chương trình nhận vào độ dài hai cạnh góc vuông `canh_a` và `canh_b` của một tam giác vuông. Tính và in ra **độ dài cạnh huyền**.\n- **Công thức (Định lý Pitago):** Cạnh huyền = `căn bậc hai của (canh_a^2 + canh_b^2)`\n    - **Gợi ý:** Để tính căn bậc hai mà không dùng thư viện, bạn có thể dùng phép lũy thừa `* 0.5`. Ví dụ: `ket_qua ** 0.5`.\n- **Input:**\n    - Hai số thực `canh_a` và `canh_b`.\n- **Output:**\n    - Một số thực duy nhất là độ dài cạnh huyền.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # canh_a = 3.0\n    # canh_b = 4.0\n    # Output:\n    # 5.0\n    ```\n    \n- **Giải thích ví dụ:** `căn bậc hai của (3.0^2 + 4.0^2) = căn bậc hai của (9.0 + 16.0) = căn bậc hai của (25.0) = 5.0`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là độ dài cạnh huyền.\\n")',
      testCases: [
        { input: '- Hai số thực canh_a và canh_b.\n', expectedOutput: '- Một số thực duy nhất là độ dài cạnh huyền.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính diện tích hình vành khăn (hình tròn đồng tâm)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 17: Tính diện tích hình vành khăn (hình tròn đồng tâm)\n\n- **Mô tả:** Viết chương trình nhận vào bán kính của hai hình tròn đồng tâm: `ban_kinh_lon` (hình tròn lớn) và `ban_kinh_be` (hình tròn nhỏ). Tính và in ra **diện tích** của hình vành khăn (phần diện tích giữa hai hình tròn).\n- **Công thức:** Diện tích vành khăn = `Diện tích hình tròn lớn - Diện tích hình tròn nhỏ`\n    - (Trong đó: Diện tích hình tròn = `PI * bán_kính * bán_kính`)\n- **Input:**\n    - Hai số thực `ban_kinh_lon` và `ban_kinh_be` (giả sử `ban_kinh_lon > ban_kinh_be`).\n- **Output:**\n    - Một số thực duy nhất là diện tích hình vành khăn.\n- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)\n    \n    ```python\n    # Input:\n    # ban_kinh_lon = 5.0\n    # ban_kinh_be = 3.0\n    # Output:\n    # 50.265482456\n    ```\n    \n- **Giải thích ví dụ:**\n    - Diện tích lớn: `PI * 5.0 * 5.0 = 25 * PI`.\n    - Diện tích bé: `PI * 3.0 * 3.0 = 9 * PI`.\n    - Vành khăn: `(25 - 9) * PI = 16 * PI ≈ 50.265...`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là diện tích hình vành khăn.\\n")',
      testCases: [
        { input: '- Hai số thực ban_kinh_lon và ban_kinh_be (giả sử ban_kinh_lon > ban_kinh_be).\n', expectedOutput: '- Một số thực duy nhất là diện tích hình vành khăn.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính thể tích hình trụ',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 18: Tính thể tích hình trụ\n\n- **Mô tả:** Viết chương trình nhận vào bán kính đáy `ban_kinh_day` và chiều cao `chieu_cao` của một hình trụ. Tính và in ra **thể tích** của hình trụ đó.\n- **Công thức:** Thể tích = `PI * bán_kính_đáy * bán_kính_đáy * chiều_cao` (hoặc `PI * bán_kính_đáy^2 * chiều_cao`)\n- **Input:**\n    - Hai số thực `ban_kinh_day` và `chieu_cao`.\n- **Output:**\n    - Một số thực duy nhất là thể tích hình trụ.\n- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)\n    \n    ```python\n    # Input:\n    # ban_kinh_day = 2.0\n    # chieu_cao = 5.0\n    # Output:\n    # 62.83185307\n    ```\n    \n- **Giải thích ví dụ:** `PI * 2.0 * 2.0 * 5.0 = PI * 20.0 ≈ 62.831...`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là thể tích hình trụ.\\n")',
      testCases: [
        { input: '- Hai số thực ban_kinh_day và chieu_cao.\n', expectedOutput: '- Một số thực duy nhất là thể tích hình trụ.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính tọa độ trung điểm của đoạn thẳng trong mặt phẳng 2D',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 19: Tính tọa độ trung điểm của đoạn thẳng trong mặt phẳng 2D\n\n- **Mô tả:** Viết chương trình nhận vào tọa độ hai điểm A(`x1`, `y1`) và B(`x2`, `y2`) trong mặt phẳng 2D. Tính và in ra **tọa độ trung điểm** M(`xm`, `ym`) của đoạn thẳng AB.\n- **Công thức:**\n    - `xm = (x1 + x2) / 2`\n    - `ym = (y1 + y2) / 2`\n- **Input:**\n    - Bốn số thực `x1`, `y1`, `x2`, `y2`.\n- **Output:**\n    - Dòng 1: Tọa độ `xm` (số thực).\n    - Dòng 2: Tọa độ `ym` (số thực).\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # x1 = 1.0, y1 = 1.0\n    # x2 = 5.0, y2 = 5.0\n    # Output:\n    # 3.0\n    # 3.0\n    ```\n    \n- **Giải thích ví dụ:**\n    - `xm = (1.0 + 5.0) / 2 = 6.0 / 2 = 3.0`.\n    - `ym = (1.0 + 5.0) / 2 = 6.0 / 2 = 3.0`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dòng 1: Tọa độ xm (số thực).\\n")',
      testCases: [
        { input: '- Bốn số thực x1, y1, x2, y2.\n', expectedOutput: '- Dòng 1: Tọa độ xm (số thực).\n', isHidden: false }
      ]
    },
    {
      title: 'Tính khoảng cách giữa hai điểm trong mặt phẳng 2D',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 20: Tính khoảng cách giữa hai điểm trong mặt phẳng 2D\n\n- **Mô tả:** Viết chương trình nhận vào tọa độ hai điểm A(`x1`, `y1`) và B(`x2`, `y2`) trong mặt phẳng 2D. Tính và in ra **khoảng cách** giữa hai điểm này.\n- **Công thức:** Khoảng cách = `căn bậc hai của ((x2 - x1)^2 + (y2 - y1)^2)`\n    - **Gợi ý:** Để tính căn bậc hai mà không dùng thư viện, bạn có thể dùng phép lũy thừa `* 0.5`.\n- **Input:**\n    - Bốn số thực `x1`, `y1`, `x2`, `y2`.\n- **Output:**\n    - Một số thực duy nhất là khoảng cách giữa hai điểm.\n- **Ví dụ:**\n    \n    ```python\n    # Input:\n    # x1 = 1.0, y1 = 1.0\n    # x2 = 4.0, y2 = 5.0\n    # Output:\n    # 5.0\n    ```\n    \n- **Giải thích ví dụ:** `căn bậc hai của ((4.0 - 1.0)^2 + (5.0 - 1.0)^2) = căn bậc hai của (3.0^2 + 4.0^2) = căn bậc hai của (9.0 + 16.0) = căn bậc hai của (25.0) = 5.0`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số thực duy nhất là khoảng cách giữa hai điểm.\\n")',
      testCases: [
        { input: '- Bốn số thực x1, y1, x2, y2.\n', expectedOutput: '- Một số thực duy nhất là khoảng cách giữa hai điểm.\n', isHidden: false }
      ]
    }
  ],
  'LS-02.MP': [
    {
      title: 'Kiểm tra tính hợp lệ của tuổi và điểm',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 1: Kiểm tra tính hợp lệ của tuổi và điểm**\n\n- **Mô tả:** Cho tuổi `tuoi` và điểm số `diem`. Kiểm tra xem một người có đủ điều kiện để tham gia một cuộc thi hay không.\n- **Yêu cầu:** In ra "Đủ điều kiện tham gia" nếu **tuổi từ 18 trở lên AND điểm số từ 70 trở lên**. Ngược lại, in ra "Không đủ điều kiện tham gia".\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `tuoi = 20 # Thay đổi giá trị này\n    diem = 85 # Thay đổi giá trị này`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `tuoi = 25, diem = 90` **Output:** `Đủ điều kiện tham gia`\n    - **Input:** `tuoi = 17, diem = 80` **Output:** `Không đủ điều kiện tham gia`\n    - **Input:** `tuoi = 18, diem = 65` **Output:** `Không đủ điều kiện tham gia`\n    - **Input:** `tuoi = 18, diem = 70` **Output:** `Đủ điều kiện tham gia`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: tuoi = 25, diem = 90 Output: Đủ điều kiện tham gia\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: tuoi = 25, diem = 90 Output: Đủ điều kiện tham gia\n', isHidden: false }
      ]
    },
    {
      title: 'Xác định loại số phức tạp',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 2: Xác định loại số phức tạp**\n\n- **Mô tả:** Cho một số nguyên `num`. Xác định tính chất của số đó.\n- **Yêu cầu:**\n    - Nếu `num` là **số dương VÀ là số chẵn**, in ra "Số dương chẵn".\n    - Nếu `num` là **số dương VÀ là số lẻ**, in ra "Số dương lẻ".\n    - Nếu `num` là **số âm**, in ra "Số âm".\n    - Nếu `num` là **0**, in ra "Số 0".\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `num = -5 # Thay đổi giá trị này`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `num = 4` **Output:** `Số dương chẵn`\n    - **Input:** `num = 7` **Output:** `Số dương lẻ`\n    - **Input:** `num = -3` **Output:** `Số âm`\n    - **Input:** `num = 0` **Output:** `Số 0`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: num = 4 Output: Số dương chẵn\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: num = 4 Output: Số dương chẵn\n', isHidden: false }
      ]
    },
    {
      title: 'Quyết định mở/đóng cửa hàng theo giờ và ngày',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 3: Quyết định mở/đóng cửa hàng theo giờ và ngày**\n\n- **Mô tả:** Cho giờ hiện tại `gio_hien_tai` (số nguyên từ 0 đến 23) và `la_cuoi_tuan` (boolean, `True` nếu là cuối tuần, `False` nếu không). Cửa hàng mở cửa từ 9h đến 18h các ngày trong tuần, và đóng cửa vào cuối tuần.\n- **Yêu cầu:** In ra "Cửa hàng đang mở" hoặc "Cửa hàng đang đóng".\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `gio_hien_tai = 10 # Thay đổi giá trị này\n    la_cuoi_tuan = False # Thay đổi giá trị này`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `gio_hien_tai = 12, la_cuoi_tuan = False` **Output:** `Cửa hàng đang mở`\n    - **Input:** `gio_hien_tai = 8, la_cuoi_tuan = False` **Output:** `Cửa hàng đang đóng`\n    - **Input:** `gio_hien_tai = 19, la_cuoi_tuan = False` **Output:** `Cửa hàng đang đóng`\n    - **Input:** `gio_hien_tai = 12, la_cuoi_tuan = True` **Output:** `Cửa hàng đang đóng`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: gio_hien_tai = 12, la_cuoi_tuan = False Output: Cửa hàng đang mở\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: gio_hien_tai = 12, la_cuoi_tuan = False Output: Cửa hàng đang mở\n', isHidden: false }
      ]
    },
    {
      title: 'Xác định loại nhiệt độ',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 4: Xác định loại nhiệt độ**\n\n- **Mô tả:** Cho nhiệt độ `temp` (số nguyên).\n- **Yêu cầu:**\n    - Nếu `temp` lớn hơn hoặc bằng 30, in ra "Rất nóng".\n    - Nếu `temp` từ 20 đến 29 (bao gồm), in ra "Ấm áp".\n    - Nếu `temp` từ 10 đến 19 (bao gồm), in ra "Mát mẻ".\n    - Ngược lại (dưới 10), in ra "Lạnh".\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `temp = 15 # Thay đổi giá trị này`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `temp = 35` **Output:** `Rất nóng`\n    - **Input:** `temp = 25` **Output:** `Ấm áp`\n    - **Input:** `temp = 10` **Output:** `Mát mẻ`\n    - **Input:** `temp = 5` **Output:** `Lạnh`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: temp = 35 Output: Rất nóng\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: temp = 35 Output: Rất nóng\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra số có 2 chữ số',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 5: Kiểm tra số có 2 chữ số**\n\n- **Mô tả:** Cho một số nguyên `so`. Kiểm tra xem số đó có phải là số có hai chữ số hay không (từ 10 đến 99 hoặc từ -99 đến -10).\n- **Yêu cầu:** In ra "Đây là số có hai chữ số" nếu đúng. Ngược lại, in ra "Đây KHÔNG phải là số có hai chữ số".\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `so = 42 # Thay đổi giá trị này`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `so = 25` **Output:** `Đây là số có hai chữ số`\n    - **Input:** `so = 7` **Output:** `Đây KHÔNG phải là số có hai chữ số`\n    - **Input:** `so = 100` **Output:** `Đây KHÔNG phải là số có hai chữ số`\n    - **Input:** `so = -55` **Output:** `Đây là số có hai chữ số`\n    - **Input:** `so = -5` **Output:** `Đây KHÔNG phải là số có hai chữ số`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: so = 25 Output: Đây là số có hai chữ số\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: so = 25 Output: Đây là số có hai chữ số\n', isHidden: false }
      ]
    },
    {
      title: 'Xác định loại hình học (Tam giác cân/đều)',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 6: Xác định loại hình học (Tam giác cân/đều)**\n\n- **Mô tả:** Cho ba cạnh của một tam giác `canh1`, `canh2`, `canh3`.\n- **Yêu cầu:**\n    - Nếu ba cạnh bằng nhau, in ra "Tam giác đều".\n    - Nếu có ít nhất hai cạnh bằng nhau (nhưng không phải cả ba), in ra "Tam giác cân".\n    - Ngược lại, in ra "Tam giác thường".\n    - (Bỏ qua điều kiện kiểm tra tam giác hợp lệ để tập trung vào if-else).\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `canh1 = 5 # Thay đổi giá trị này\n    canh2 = 5 # Thay đổi giá trị này\n    canh3 = 3 # Thay đổi giá trị này`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `canh1 = 3, canh2 = 3, canh3 = 3` **Output:** `Tam giác đều`\n    - **Input:** `canh1 = 4, canh2 = 4, canh3 = 5` **Output:** `Tam giác cân`\n    - **Input:** `canh1 = 6, canh2 = 8, canh3 = 10` **Output:** `Tam giác thường`\n    - **Input:** `canh1 = 5, canh2 = 3, canh3 = 5` **Output:** `Tam giác cân`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: canh1 = 3, canh2 = 3, canh3 = 3 Output: Tam giác đều\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: canh1 = 3, canh2 = 3, canh3 = 3 Output: Tam giác đều\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra ký tự đầu tiên của chuỗi',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 7: Kiểm tra ký tự đầu tiên của chuỗi**\n\n- **Mô tả:** Cho một chuỗi `ten`. Kiểm tra ký tự đầu tiên của chuỗi đó.\n- **Yêu cầu:**\n    - Nếu ký tự đầu tiên là \'A\' hoặc \'a\', in ra "Tên bắt đầu bằng chữ A".\n    - Ngược lại, in ra "Tên KHÔNG bắt đầu bằng chữ A".\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `ten = "An" # Thay đổi giá trị này (ví dụ: "Binh", "Alice")`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `ten = "An"` **Output:** `Tên bắt đầu bằng chữ A`\n    - **Input:** `ten = "Alice"` **Output:** `Tên bắt đầu bằng chữ A`\n    - **Input:** `ten = "Binh"` **Output:** `Tên KHÔNG bắt đầu bằng chữ A`\n    - **Input:** `ten = "apple"` **Output:** `Tên bắt đầu bằng chữ A`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: ten = \\"An\\" Output: Tên bắt đầu bằng chữ A\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: ten = "An" Output: Tên bắt đầu bằng chữ A\n', isHidden: false }
      ]
    },
    {
      title: 'Quyết định xem phim theo tuổi và thể loại',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 8: Quyết định xem phim theo tuổi và thể loại**\n\n- **Mô tả:** Cho tuổi của người xem `tuoi_xem` và thể loại phim `the_loai` (chuỗi: "kinh dị", "hành động", "hài hước").\n    - Phim kinh dị yêu cầu tuổi từ 18 trở lên.\n    - Phim hành động yêu cầu tuổi từ 13 trở lên.\n    - Phim hài hước không giới hạn tuổi.\n- **Yêu cầu:** In ra "Có thể xem phim" hoặc "Không thể xem phim".\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `tuoi_xem = 15 # Thay đổi giá trị này\n    the_loai = "hành động" # Thay đổi giá trị này`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `tuoi_xem = 20, the_loai = "kinh dị"` **Output:** `Có thể xem phim`\n    - **Input:** `tuoi_xem = 15, the_loai = "kinh dị"` **Output:** `Không thể xem phim`\n    - **Input:** `tuoi_xem = 12, the_loai = "hành động"` **Output:** `Không thể xem phim`\n    - **Input:** `tuoi_xem = 15, the_loai = "hành động"` **Output:** `Có thể xem phim`\n    - **Input:** `tuoi_xem = 10, the_loai = "hài hước"` **Output:** `Có thể xem phim`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: tuoi_xem = 20, the_loai = \\"kinh dị\\" Output: Có thể xem phim\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: tuoi_xem = 20, the_loai = "kinh dị" Output: Có thể xem phim\n', isHidden: false }
      ]
    },
    {
      title: 'Phân loại điểm số chi tiết',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 9: Phân loại điểm số chi tiết**\n\n- **Mô tả:** Cho điểm số `diem`. Phân loại học lực chi tiết.\n- **Yêu cầu:**\n    - Nếu `diem` từ 90 trở lên, in ra "Xuất sắc".\n    - Nếu `diem` từ 80 đến 89, in ra "Giỏi".\n    - Nếu `diem` từ 70 đến 79, in ra "Khá".\n    - Nếu `diem` từ 50 đến 69, in ra "Trung bình".\n    - Ngược lại (dưới 50), in ra "Yếu".\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `diem = 78 # Thay đổi giá trị này`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `diem = 95` **Output:** `Xuất sắc`\n    - **Input:** `diem = 82` **Output:** `Giỏi`\n    - **Input:** `diem = 70` **Output:** `Khá`\n    - **Input:** `diem = 65` **Output:** `Trung bình`\n    - **Input:** `diem = 45` **Output:** `Yếu`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: diem = 95 Output: Xuất sắc\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: diem = 95 Output: Xuất sắc\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra trạng thái nước',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 10: Kiểm tra trạng thái nước**\n\n- **Mô tả:** Cho nhiệt độ của nước `nhiet_do_nuoc` (số nguyên). Biết rằng nước đóng băng ở 0 độ C và sôi ở 100 độ C.\n- **Yêu cầu:**\n    - Nếu `nhiet_do_nuoc` nhỏ hơn hoặc bằng 0, in ra "Nước ở thể rắn (đóng băng)".\n    - Nếu `nhiet_do_nuoc` lớn hơn 0 VÀ nhỏ hơn 100, in ra "Nước ở thể lỏng".\n    - Nếu `nhiet_do_nuoc` lớn hơn hoặc bằng 100, in ra "Nước ở thể khí (hơi nước)".\n- **Thiết lập ban đầu:**\n    \n    **Python**\n    \n    `nhiet_do_nuoc = 50 # Thay đổi giá trị này`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `nhiet_do_nuoc = -5` **Output:** `Nước ở thể rắn (đóng băng)`\n    - **Input:** `nhiet_do_nuoc = 0` **Output:** `Nước ở thể rắn (đóng băng)`\n    - **Input:** `nhiet_do_nuoc = 25` **Output:** `Nước ở thể lỏng`\n    - **Input:** `nhiet_do_nuoc = 99` **Output:** `Nước ở thể lỏng`\n    - **Input:** `nhiet_do_nuoc = 100` **Output:** `Nước ở thể khí (hơi nước)`\n    - **Input:** `nhiet_do_nuoc = 120` **Output:** `Nước ở thể khí (hơi nước)`',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: nhiet_do_nuoc = -5 Output: Nước ở thể rắn (đóng băng)\\n")',
      testCases: [
        { input: 'Python\n', expectedOutput: '- Input: nhiet_do_nuoc = -5 Output: Nước ở thể rắn (đóng băng)\n', isHidden: false }
      ]
    },
    {
      title: 'Tính hóa đơn tiền điện luỹ tiến và thuế suất',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 1: Tính hóa đơn tiền điện luỹ tiến và thuế suất**\n\n- **Mô tả:** Viết chương trình tính tiền điện tiêu thụ hộ gia đình dựa trên số điện `kwh` tiêu thụ và hộ kinh doanh `la_kinh_doanh` (boolean).\n- **Yêu cầu:** \n    - Nếu `la_kinh_doanh` là `True`, tính đồng giá 3.000 VND / kWh. Thuế VAT là 10% tổng tiền.\n    - Nếu `la_kinh_doanh` là `False`, tính theo bậc thang như sau:\n        - 50 kWh đầu tiên: 1.678 VND / kWh.\n        - Từ kWh 51 đến 100: 1.734 VND / kWh.\n        - Từ kWh 101 đến 200: 2.014 VND / kWh.\n        - Từ kWh 201 trở đi: 2.536 VND / kWh.\n        - Thuế VAT cho hộ gia đình là 8% tổng tiền.\n    - Kết quả in ra tổng tiền cuối cùng (làm tròn 1 chữ số thập phân).\n- **Thiết lập ban đầu:**\n    \n    `kwh = 120\n    la_kinh_doanh = False`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `kwh = 120, la_kinh_doanh = False` **Output:** `248558.4` (Tổng tiền trước thuế là 50*1678 + 50*1734 + 20*2014 = 230280 => Sau VAT 8% là 248702.4. Tính lại: 50*1678 + 50*1734 + 20*2014 = 83900 + 86700 + 40280 = 210880. Nhân 1.08 = 227750.4)\n    - **Input:** `kwh = 150, la_kinh_doanh = True` **Output:** `495000.0` (150 * 3000 * 1.1 = 495000.0)\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: kwh = 120, la_kinh_doanh = False Output: 248558.4 (Tổng tiền trước thuế là 501678 + 501734 + 202014 = 230280 => Sau VAT 8% là 248702.4. Tính lại: 501678 + 501734 + 202014 = 83900 + 86700 + 40280 = 210880. Nhân 1.08 = 227750.4)\\n")',
      testCases: [
        { input: '120\n', expectedOutput: '- Input: kwh = 120, la_kinh_doanh = False Output: 248558.4 (Tổng tiền trước thuế là 501678 + 501734 + 202014 = 230280 => Sau VAT 8% là 248702.4. Tính lại: 501678 + 501734 + 202014 = 83900 + 86700 + 40280 = 210880. Nhân 1.08 = 227750.4)\n', isHidden: false }
      ]
    },
    {
      title: 'Hệ thống phát hiện giao dịch bất thường (Gian lận)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 2: Hệ thống phát hiện giao dịch bất thường (Gian lận)**\n\n- **Mô tả:** Cho số tiền giao dịch `so_tien`, khoảng cách địa lý giao dịch `khoang_cach` (km, so với vị trí trước đó), và cờ thiết bị lạ `thiet_bi_la` (boolean).\n- **Yêu cầu:** Xác định độ rủi ro giao dịch (in ra "Rủi ro Cao", "Rủi ro Trung bình", "Giao dịch An toàn").\n    - **Rủi ro Cao** nếu:\n        - Số tiền >= 50.000.000 AND thiết bị lạ là `True`.\n        - HOẶC khoảng cách > 500 km AND thiết bị lạ là `True`.\n    - **Rủi ro Trung bình** nếu:\n        - Số tiền từ 10.000.000 đến dưới 50.000.000 AND thiết bị lạ là `True`.\n        - HOẶC khoảng cách > 100 km (nhưng không quá 500 km) AND thiết bị lạ là `True`.\n        - HOẶC số tiền >= 100.000.000 (dù thiết bị quen).\n    - **Giao dịch An toàn:** Các trường hợp còn lại.\n- **Thiết lập ban đầu:**\n    \n    `so_tien = 20000000\n    khoang_cach = 150\n    thiet_bi_la = True`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `so_tien = 60000000, khoang_cach = 10, thiet_bi_la = True` **Output:** `Rủi ro Cao`\n    - **Input:** `so_tien = 5000000, khoang_cach = 600, thiet_bi_la = True` **Output:** `Rủi ro Cao`\n    - **Input:** `so_tien = 20000000, khoang_cach = 150, thiet_bi_la = True` **Output:** `Rủi ro Trung bình`\n    - **Input:** `so_tien = 150000000, khoang_cach = 5, thiet_bi_la = False` **Output:** `Rủi ro Trung bình`\n    - **Input:** `so_tien = 5000000, khoang_cach = 10, thiet_bi_la = False` **Output:** `Giao dịch An toàn`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: so_tien = 60000000, khoang_cach = 10, thiet_bi_la = True Output: Rủi ro Cao\\n")',
      testCases: [
        { input: '20000000\n', expectedOutput: '- Input: so_tien = 60000000, khoang_cach = 10, thiet_bi_la = True Output: Rủi ro Cao\n', isHidden: false }
      ]
    },
    {
      title: 'Giải phương trình bậc hai',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 3: Giải phương trình bậc hai**\n\n- **Mô tả:** Cho 3 hệ số `a`, `b`, `c` của phương trình $ax^2 + bx + c = 0$.\n- **Yêu cầu:** Xác định số nghiệm của phương trình và in ra:\n    - Nếu `a == 0` (phương trình bậc nhất bx + c = 0):\n        - Nếu `b == 0` và `c == 0`, in "Vô số nghiệm".\n        - Nếu `b == 0` và `c != 0`, in "Vô nghiệm".\n        - Nếu `b != 0`, in "Có 1 nghiệm".\n    - Nếu `a != 0`:\n        - Tính delta = $b^2 - 4ac$.\n        - Nếu delta < 0, in "Vô nghiệm".\n        - Nếu delta == 0, in "Có nghiệm kép".\n        - Nếu delta > 0, in "Có 2 nghiệm phân biệt".\n- **Thiết lập ban đầu:**\n    \n    `a = 1\n    b = -3\n    c = 2`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `a = 0, b = 2, c = -4` **Output:** `Có 1 nghiệm`\n    - **Input:** `a = 1, b = -3, c = 2` **Output:** `Có 2 nghiệm phân biệt`\n    - **Input:** `a = 1, b = 2, c = 5` **Output:** `Vô nghiệm`\n    - **Input:** `a = 1, b = -2, c = 1` **Output:** `Có nghiệm kép`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: a = 0, b = 2, c = -4 Output: Có 1 nghiệm\\n")',
      testCases: [
        { input: '1\n', expectedOutput: '- Input: a = 0, b = 2, c = -4 Output: Có 1 nghiệm\n', isHidden: false }
      ]
    },
    {
      title: 'Định vị điểm trong hệ tọa độ 2D',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 4: Định vị điểm trong hệ tọa độ 2D**\n\n- **Mô tả:** Cho tọa độ một điểm $(x, y)$ và một hình tròn có tâm $(x_0, y_0)$ bán kính $R$.\n- **Yêu cầu:** Xác định vị trí điểm so với hình tròn và in ra:\n    - Nếu khoảng cách từ tâm hình tròn tới điểm nhỏ hơn bán kính $R$, in "Nằm trong hình tròn".\n    - Nếu bằng $R$, in "Nằm trên biên hình tròn".\n    - Nếu lớn hơn $R$, in "Nằm ngoài hình tròn".\n    - *Chú ý:* Khoảng cách d = $\\sqrt{(x - x_0)^2 + (y - y_0)^2}$. (Có thể so sánh $d^2$ với $R^2$ để tránh căn bậc hai).\n- **Thiết lập ban đầu:**\n    \n    `x = 3\n    y = 4\n    x0 = 0\n    y0 = 0\n    R = 5`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `x = 3, y = 4, x0 = 0, y0 = 0, R = 5` **Output:** `Nằm trên biên hình tròn`\n    - **Input:** `x = 2, y = 2, x0 = 0, y0 = 0, R = 5` **Output:** `Nằm trong hình tròn`\n    - **Input:** `x = 6, y = 0, x0 = 0, y0 = 0, R = 5` **Output:** `Nằm ngoài hình tròn`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: x = 3, y = 4, x0 = 0, y0 = 0, R = 5 Output: Nằm trên biên hình tròn\\n")',
      testCases: [
        { input: '3\n', expectedOutput: '- Input: x = 3, y = 4, x0 = 0, y0 = 0, R = 5 Output: Nằm trên biên hình tròn\n', isHidden: false }
      ]
    },
    {
      title: 'Xác định ngày hôm sau (Next Day)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 5: Xác định ngày hôm sau (Next Day)**\n\n- **Mô tả:** Cho một ngày hợp lệ gồm `ngay`, `thang`, `nam`. Xác định ngày tiếp theo.\n- **Yêu cầu:** Tính và in ra ngày hôm sau dưới dạng `"Ngày mai: [ngày]/[tháng]/[năm]"`.\n    - Cần xem xét năm nhuận (tháng 2 có 29 ngày) và các tháng có 30, 31 ngày.\n    - Nếu là ngày cuối cùng của tháng, ngày hôm sau sẽ là ngày 1 của tháng tiếp theo.\n    - Nếu là ngày cuối của năm (31/12), ngày hôm sau sẽ là 1/1 của năm tiếp theo.\n- **Thiết lập ban đầu:**\n    \n    `ngay = 31\n    thang = 12\n    nam = 2023`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `ngay = 28, thang = 2, nam = 2024` **Output:** `Ngày mai: 29/2/2024` (Năm nhuận)\n    - **Input:** `ngay = 28, thang = 2, nam = 2023` **Output:** `Ngày mai: 1/3/2023` (Năm thường)\n    - **Input:** `ngay = 31, thang = 12, nam = 2023` **Output:** `Ngày mai: 1/1/2024`\n    - **Input:** `ngay = 30, thang = 4, nam = 2023` **Output:** `Ngày mai: 1/5/2023`',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: ngay = 28, thang = 2, nam = 2024 Output: Ngày mai: 29/2/2024 (Năm nhuận)\\n")',
      testCases: [
        { input: '31\n', expectedOutput: '- Input: ngay = 28, thang = 2, nam = 2024 Output: Ngày mai: 29/2/2024 (Năm nhuận)\n', isHidden: false }
      ]
    },
    {
      title: 'Xác định Loại Năm (Năm Nhuận Nâng Cao)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 1: Xác định Loại Năm (Năm Nhuận Nâng Cao)**\n\n- **Mô tả bài toán:** Cho một năm `nam`. Xác định xem đó có phải là năm nhuận hay không.\n- **Input:** Một số nguyên `nam`.\n- **Output:** In ra "Đây là năm nhuận." hoặc "Đây KHÔNG phải là năm nhuận."\n- **Ràng buộc:** `0 <= nam <= 3000`\n- **Điều kiện năm nhuận:**\n    1. Năm đó chia hết cho 400.\n    2. HOẶC năm đó chia hết cho 4 nhưng KHÔNG chia hết cho 100.\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: nam = 2000\n    Output: Đây là năm nhuận.\n    \n    Input: nam = 2024\n    Output: Đây là năm nhuận.\n    \n    Input: nam = 1900\n    Output: Đây KHÔNG phải là năm nhuận.\n    \n    Input: nam = 2023\n    Output: Đây KHÔNG phải là năm nhuận.\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra \\"Đây là năm nhuận.\\" hoặc \\"Đây KHÔNG phải là năm nhuận.\\"\\n")',
      testCases: [
        { input: 'Một số nguyên nam.\n', expectedOutput: 'In ra "Đây là năm nhuận." hoặc "Đây KHÔNG phải là năm nhuận."\n', isHidden: false }
      ]
    },
    {
      title: 'Hệ Thống Đánh Giá Học Sinh Toàn Diện',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 2: Hệ Thống Đánh Giá Học Sinh Toàn Diện**\n\n- **Mô tả bài toán:** Cho điểm môn Toán `diem_toan`, điểm môn Văn `diem_van`, và số buổi học vắng `so_buoi_vang`.\n- **Input:**\n    - `diem_toan`: Một số thực (0.0 - 10.0).\n    - `diem_van`: Một số thực (0.0 - 10.0).\n    - `so_buoi_vang`: Một số nguyên không âm.\n- **Output:** In ra xếp loại học lực của học sinh.\n- **Ràng buộc:** `0.0 <= diem_toan, diem_van <= 10.0`, `0 <= so_buoi_vang <= 100`\n- **Xếp loại:**\n    - **Xuất sắc:** Trung bình cộng 2 môn >= 9.0 VÀ số buổi vắng < 3.\n    - **Giỏi:** Trung bình cộng 2 môn >= 8.0 VÀ không có môn nào dưới 6.5 VÀ số buổi vắng < 5.\n    - **Khá:** Trung bình cộng 2 môn >= 6.5 VÀ không có môn nào dưới 5.0 VÀ số buổi vắng < 7.\n    - **Trung bình:** Trung bình cộng 2 môn >= 5.0 HOẶC chỉ có 1 môn dưới 5.0 VÀ số buổi vắng < 10.\n    - **Yếu:** Các trường hợp còn lại.\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: diem_toan = 9.5, diem_van = 9.0, so_buoi_vang = 2\n    Output: Học sinh Xuất sắc.\n    \n    Input: diem_toan = 8.0, diem_van = 8.5, so_buoi_vang = 4\n    Output: Học sinh Giỏi.\n    \n    Input: diem_toan = 7.0, diem_van = 6.0, so_buoi_vang = 6\n    Output: Học sinh Khá.\n    \n    Input: diem_toan = 4.0, diem_van = 7.0, so_buoi_vang = 8\n    Output: Học sinh Trung bình.\n    \n    Input: diem_toan = 3.0, diem_van = 4.0, so_buoi_vang = 12\n    Output: Học sinh Yếu.\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra xếp loại học lực của học sinh.\\n")',
      testCases: [
        { input: '- diem_toan: Một số thực (0.0 - 10.0).\n', expectedOutput: 'In ra xếp loại học lực của học sinh.\n', isHidden: false }
      ]
    },
    {
      title: 'Hệ Thống Giá Cước Taxi',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 3: Hệ Thống Giá Cước Taxi**\n\n- **Mô tả bài toán:** Một hãng taxi tính giá cước dựa trên khoảng cách `khoang_cach` (km) và thời gian trong ngày `thoi_gian_trong_ngay` (chuỗi: "ngay" hoặc "dem").\n- **Input:**\n    - `khoang_cach`: Một số thực dương.\n    - `thoi_gian_trong_ngay`: Chuỗi ("ngay" hoặc "dem").\n- **Output:** In ra tổng số tiền cước taxi.\n- **Ràng buộc:** `khoang_cach > 0`, `thoi_gian_trong_ngay` là "ngay" hoặc "dem".\n- **Mức giá:**\n    - **Ban ngày:**\n        - 1 km đầu: 15.000 VND\n        - Từ km thứ 2 đến km thứ 10: 12.000 VND/km\n        - Từ km thứ 11 trở đi: 10.000 VND/km\n    - **Ban đêm (từ 22h - 6h sáng hôm sau):**\n        - 1 km đầu: 18.000 VND\n        - Từ km thứ 2 đến km thứ 10: 15.000 VND/km\n        - Từ km thứ 11 trở đi: 13.000 VND/km\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: khoang_cach = 0.5, thoi_gian_trong_ngay = "ngay"\n    Output: Tổng tiền cước: 15000.0 VND\n    \n    Input: khoang_cach = 7.0, thoi_gian_trong_ngay = "ngay"\n    Output: Tổng tiền cước: 90000.0 VND\n    \n    Input: khoang_cach = 15.0, thoi_gian_trong_ngay = "dem"\n    Output: Tổng tiền cước: 200000.0 VND\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra tổng số tiền cước taxi.\\n")',
      testCases: [
        { input: '- khoang_cach: Một số thực dương.\n', expectedOutput: 'In ra tổng số tiền cước taxi.\n', isHidden: false }
      ]
    },
    {
      title: 'Phân Loại Thời Tiết và Hoạt Động Gợi Ý',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 4: Phân Loại Thời Tiết và Hoạt Động Gợi Ý**\n\n- **Mô tả bài toán:** Cho nhiệt độ `nhiet_do` (độ C) và trạng thái trời `trang_thai_troi` (chuỗi: "nang", "nhieu may", "mua", "tuyet").\n- **Input:**\n    - `nhiet_do`: Một số thực.\n    - `trang_thai_troi`: Chuỗi ("nang", "nhieu may", "mua", "tuyet").\n- **Output:** In ra dự báo thời tiết và gợi ý hoạt động.\n- **Ràng buộc:** `50 <= nhiet_do <= 50`\n- **Phân loại nhiệt độ:**\n    - **Nhiệt độ >= 30:** "Nóng"\n    - **Nhiệt độ 20-29:** "Ấm áp"\n    - **Nhiệt độ 10-19:** "Mát mẻ"\n    - **Nhiệt độ 0-9:** "Lạnh"\n    - **Nhiệt độ < 0:** "Rất lạnh"\n- **Gợi ý hoạt động (dựa trên thời tiết tổng thể):**\n    - **Trời nắng (nang) và Nóng/Ấm áp:** "Thích hợp đi chơi ngoài trời!"\n    - **Trời mưa (mua):** "Nên ở trong nhà, đọc sách hoặc xem phim."\n    - **Trời tuyết (tuyet) và Rất lạnh:** "Cẩn thận trượt ngã, mặc ấm và ở trong nhà."\n    - **Các trường hợp còn lại:** "Hoạt động bình thường."\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: nhiet_do = 32, trang_thai_troi = "nang"\n    Output: Thời tiết: Nóng. Gợi ý: Thích hợp đi chơi ngoài trời!\n    \n    Input: nhiet_do = 15, trang_thai_troi = "mua"\n    Output: Thời tiết: Mát mẻ. Gợi ý: Nên ở trong nhà, đọc sách hoặc xem phim.\n    \n    Input: nhiet_do = -5, trang_thai_troi = "tuyet"\n    Output: Thời tiết: Rất lạnh. Gợi ý: Cẩn thận trượt ngã, mặc ấm và ở trong nhà.\n    \n    Input: nhiet_do = 22, trang_thai_troi = "nhieu may"\n    Output: Thời tiết: Ấm áp. Gợi ý: Hoạt động bình thường.\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra dự báo thời tiết và gợi ý hoạt động.\\n")',
      testCases: [
        { input: '- nhiet_do: Một số thực.\n', expectedOutput: 'In ra dự báo thời tiết và gợi ý hoạt động.\n', isHidden: false }
      ]
    },
    {
      title: 'Xác định Phân Loại Thu Nhập và Thuế',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 5: Xác định Phân Loại Thu Nhập và Thuế**\n\n- **Mô tả bài toán:** Cho tổng thu nhập hàng năm `thu_nhap_nam`. Tính mức thuế phải đóng và phân loại thu nhập.\n- **Input:** Một số thực dương `thu_nhap_nam`.\n- **Output:** In ra "Phân loại thu nhập: [Phân loại]", "Thuế phải đóng: [Số tiền thuế]".\n- **Ràng buộc:** `thu_nhap_nam >= 0`\n- **Phân loại và Thuế suất:**\n    - **Dưới 100 triệu:** "Thấp". Thuế 5%.\n    - **Từ 100 triệu đến dưới 300 triệu:** "Trung bình". Thuế 10%.\n    - **Từ 300 triệu đến dưới 500 triệu:** "Khá". Thuế 15%.\n    - **Từ 500 triệu trở lên:** "Cao". Thuế 20%.\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: thu_nhap_nam = 75000000\n    Output: Phân loại thu nhập: Thấp. Thuế phải đóng: 3750000.0 VND\n    \n    Input: thu_nhap_nam = 200000000\n    Output: Phân loại thu nhập: Trung bình. Thuế phải đóng: 20000000.0 VND\n    \n    Input: thu_nhap_nam = 600000000\n    Output: Phân loại thu nhập: Cao. Thuế phải đóng: 120000000.0 VND\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra \\"Phân loại thu nhập: [Phân loại]\\", \\"Thuế phải đóng: [Số tiền thuế]\\".\\n")',
      testCases: [
        { input: 'Một số thực dương thu_nhap_nam.\n', expectedOutput: 'In ra "Phân loại thu nhập: [Phân loại]", "Thuế phải đóng: [Số tiền thuế]".\n', isHidden: false }
      ]
    },
    {
      title: 'Quyết Định Giảm Giá Đơn Hàng (Nâng Cao)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 6: Quyết Định Giảm Giá Đơn Hàng (Nâng Cao)**\n\n- **Mô tả bài toán:** Một cửa hàng có nhiều chính sách giảm giá dựa trên tổng giá trị đơn hàng `tong_gia_tri_don_hang`, số lượng mặt hàng `so_luong_mat_hang`, và việc khách hàng có là thành viên thân thiết hay không `la_thanh_vien_than_thiet` (Boolean).\n- **Input:**\n    - `tong_gia_tri_don_hang`: Một số thực dương.\n    - `so_luong_mat_hang`: Một số nguyên dương.\n    - `la_thanh_vien_than_thiet`: Boolean (`True` hoặc `False`).\n- **Output:** In ra tổng giá trị đơn hàng cuối cùng sau khi áp dụng giảm giá và lý do giảm giá.\n- **Ràng buộc:** `tong_gia_tri_don_hang > 0`, `so_luong_mat_hang > 0`\n- **Chính sách giảm giá (ưu tiên từ trên xuống):**\n    1. **Siêu giảm giá:** Nếu `tong_gia_tri_don_hang` >= 5.000.000 VND HOẶC (`so_luong_mat_hang` >= 20 VÀ `la_thanh_vien_than_thiet` là `True`): Giảm 20% tổng giá trị.\n    2. **Giảm giá đặc biệt:** Nếu `tong_gia_tri_don_hang` >= 2.000.000 VND HOẶC `so_luong_mat_hang` >= 10: Giảm 10% tổng giá trị.\n    3. **Giảm giá cho thành viên:** Nếu `la_thanh_vien_than_thiet` là `True` (và không thuộc các trường hợp trên): Giảm 5% tổng giá trị.\n    4. **Không giảm giá:** Các trường hợp còn lại.\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: tong_gia_tri_don_hang = 6000000, so_luong_mat_hang = 5, la_thanh_vien_than_thiet = False\n    Output: Tổng tiền sau giảm giá 20%: 4800000.0 VND (Siêu giảm giá)\n    \n    Input: tong_gia_tri_don_hang = 1000000, so_luong_mat_hang = 25, la_thanh_vien_than_thiet = True\n    Output: Tổng tiền sau giảm giá 20%: 800000.0 VND (Siêu giảm giá)\n    \n    Input: tong_gia_tri_don_hang = 2500000, so_luong_mat_hang = 8, la_thanh_vien_than_thiet = False\n    Output: Tổng tiền sau giảm giá 10%: 2250000.0 VND (Giảm giá đặc biệt)\n    \n    Input: tong_gia_tri_don_hang = 500000, so_luong_mat_hang = 3, la_thanh_vien_than_thiet = True\n    Output: Tổng tiền sau giảm giá 5%: 475000.0 VND (Giảm giá cho thành viên)\n    \n    Input: tong_gia_tri_don_hang = 100000, so_luong_mat_hang = 2, la_thanh_vien_than_thiet = False\n    Output: Không có giảm giá. Tổng tiền: 100000.0 VND\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra tổng giá trị đơn hàng cuối cùng sau khi áp dụng giảm giá và lý do giảm giá.\\n")',
      testCases: [
        { input: '- tong_gia_tri_don_hang: Một số thực dương.\n', expectedOutput: 'In ra tổng giá trị đơn hàng cuối cùng sau khi áp dụng giảm giá và lý do giảm giá.\n', isHidden: false }
      ]
    },
    {
      title: 'Xác định Phân Loại Số Học (Dương/Âm, Chẵn/Lẻ, Chia hết cho 3/5)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 7: Xác định Phân Loại Số Học (Dương/Âm, Chẵn/Lẻ, Chia hết cho 3/5)**\n\n- **Mô tả bài toán:** Cho một số nguyên `so_nguyen`. Phân loại số đó dựa trên tính chẵn/lẻ, dương/âm, và khả năng chia hết cho 3 hoặc 5.\n- **Input:** Một số nguyên `so_nguyen`.\n- **Output:** In ra phân loại của số.\n- **Ràng buộc:** `1000 <= so_nguyen <= 1000`\n- **Phân loại (ưu tiên từ trên xuống):**\n    - Nếu `so_nguyen` là 0: "Số 0."\n    - Nếu `so_nguyen` là số dương:\n        - Nếu `so_nguyen` chia hết cho cả 3 và 5: "Số dương, chia hết cho 3 và 5."\n        - Nếu `so_nguyen` chỉ chia hết cho 3 (không chia hết cho 5): "Số dương, chỉ chia hết cho 3."\n        - Nếu `so_nguyen` chỉ chia hết cho 5 (không chia hết cho 3): "Số dương, chỉ chia hết cho 5."\n        - Nếu `so_nguyen` là số chẵn (và không thuộc các trường hợp trên): "Số dương chẵn."\n        - Nếu `so_nguyen` là số lẻ (và không thuộc các trường hợp trên): "Số dương lẻ."\n    - Nếu `so_nguyen` là số âm:\n        - Nếu `so_nguyen` chia hết cho 2: "Số âm chẵn."\n            - Nếu `so_nguyen` không chia hết cho 2: "Số âm lẻ."\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: so_nguyen = 0\n    Output: Số 0.\n    \n    Input: so_nguyen = 15\n    Output: Số dương, chia hết cho 3 và 5.\n    \n    Input: so_nguyen = 6\n    Output: Số dương, chỉ chia hết cho 3.\n    \n    Input: so_nguyen = 10\n    Output: Số dương, chỉ chia hết cho 5.\n    \n    Input: so_nguyen = 4\n    Output: Số dương chẵn.\n    \n    Input: so_nguyen = 7\n    Output: Số dương lẻ.\n    \n    Input: so_nguyen = -4\n    Output: Số âm chẵn.\n    \n    Input: so_nguyen = -7\n    Output: Số âm lẻ.\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra phân loại của số.\\n")',
      testCases: [
        { input: 'Một số nguyên so_nguyen.\n', expectedOutput: 'In ra phân loại của số.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm Tra và Đánh Giá Mật Khẩu Đơn Giản',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 8: Kiểm Tra và Đánh Giá Mật Khẩu Đơn Giản**\n\n- **Mô tả bài toán:** Cho một chuỗi `mat_khau`. Đánh giá độ mạnh của mật khẩu dựa trên các tiêu chí đơn giản. (Để đơn giản hóa, học sinh có thể dùng vòng lặp để kiểm tra từng ký tự hoặc dùng các phương thức chuỗi nếu đã học).\n- **Input:** Một chuỗi `mat_khau`.\n- **Output:** In ra "Mật khẩu [Độ mạnh]" và lý do.\n- **Ràng buộc:** Độ dài chuỗi từ 1 đến 50 ký tự.\n- **Tiêu chí:**\n    - **Rất mạnh:** Độ dài >= 12 ký tự VÀ (có chứa ít nhất một chữ hoa) VÀ (có chứa ít nhất một chữ số).\n    - **Mạnh:** Độ dài >= 8 ký tự VÀ ((có chứa ít nhất một chữ hoa) HOẶC (có chứa ít nhất một chữ số)).\n    - **Trung bình:** Độ dài >= 6 ký tự.\n    - **Yếu:** Các trường hợp còn lại.\n    - *(Gợi ý nếu chưa học vòng lặp/any(): Để kiểm tra "có chứa ít nhất một chữ hoa", bạn có thể đơn giản hóa bằng cách: "Có ký tự nào là chữ hoa trong \'A\'...\'Z\' không?" (và tương tự cho chữ số).)*\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: mat_khau = "Password123"\n    Output: Mật khẩu Rất mạnh.\n    \n    Input: mat_khau = "mypassword"\n    Output: Mật khẩu Yếu.\n    \n    Input: mat_khau = "MyPass1"\n    Output: Mật khẩu Mạnh.\n    \n    Input: mat_khau = "short"\n    Output: Mật khẩu Yếu.\n    \n    Input: mat_khau = "LongEnough"\n    Output: Mật khẩu Mạnh.\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra \\"Mật khẩu [Độ mạnh]\\" và lý do.\\n")',
      testCases: [
        { input: 'Một chuỗi mat_khau.\n', expectedOutput: 'In ra "Mật khẩu [Độ mạnh]" và lý do.\n', isHidden: false }
      ]
    },
    {
      title: 'Xử Lý Đơn Hàng Online (Trạng thái và Thông báo)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 9: Xử Lý Đơn Hàng Online (Trạng thái và Thông báo)**\n\n- **Mô tả bài toán:** Một hệ thống quản lý đơn hàng có các trạng thái `trang_thai_don_hang` (chuỗi: "cho xu ly", "dang van chuyen", "da giao", "da huy") và cờ `co_van_de` (Boolean: `True` nếu có vấn đề, `False` nếu không).\n- **Input:**\n    - `trang_thai_don_hang`: Chuỗi trạng thái.\n    - `co_van_de`: Boolean.\n- **Output:** In ra thông báo cho khách hàng về trạng thái đơn hàng.\n- **Ràng buộc:** `trang_thai_don_hang` là một trong các giá trị cho trước.\n- **Thông báo (ưu tiên từ trên xuống):**\n    - Nếu `trang_thai_don_hang` là "da huy": "Đơn hàng của bạn đã bị hủy."\n    - Nếu `co_van_de` là `True`: "Đơn hàng của bạn có vấn đề. Vui lòng liên hệ hỗ trợ."\n    - Nếu `trang_thai_don_hang` là "da giao": "Đơn hàng của bạn đã được giao thành công!"\n    - Nếu `trang_thai_don_hang` là "dang van chuyen": "Đơn hàng của bạn đang trên đường vận chuyển."\n    - Nếu `trang_thai_don_hang` là "cho xu ly": "Đơn hàng của bạn đang chờ xử lý."\n    - Nếu `trang_thai_don_hang` không hợp lệ: "Trạng thái đơn hàng không xác định."\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: trang_thai_don_hang = "da huy", co_van_de = False\n    Output: Đơn hàng của bạn đã bị hủy.\n    \n    Input: trang_thai_don_hang = "dang van chuyen", co_van_de = True\n    Output: Đơn hàng của bạn có vấn đề. Vui lòng liên hệ hỗ trợ.\n    \n    Input: trang_thai_don_hang = "da giao", co_van_de = False\n    Output: Đơn hàng của bạn đã được giao thành công!\n    \n    Input: trang_thai_don_hang = "cho xu ly", co_van_de = False\n    Output: Đơn hàng của bạn đang chờ xử lý.\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra thông báo cho khách hàng về trạng thái đơn hàng.\\n")',
      testCases: [
        { input: '- trang_thai_don_hang: Chuỗi trạng thái.\n', expectedOutput: 'In ra thông báo cho khách hàng về trạng thái đơn hàng.\n', isHidden: false }
      ]
    },
    {
      title: 'Xếp Loại Điểm Chuẩn cho Nhập Học',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 10: Xếp Loại Điểm Chuẩn cho Nhập Học**\n\n- **Mô tả bài toán:** Một trường học xét tuyển dựa trên điểm phỏng vấn `diem_phong_van` và số lượng giải thưởng `so_giai_thuong` mà học sinh đạt được.\n- **Input:**\n    - `diem_phong_van`: Một số thực (0.0 - 10.0).\n    - `so_giai_thuong`: Một số nguyên không âm.\n- **Output:** In ra trạng thái "Được chấp nhận" hoặc "Bị từ chối" cùng với lý do.\n- **Ràng buộc:** `0.0 <= diem_phong_van <= 10.0`, `0 <= so_giai_thuong <= 100`\n- **Tiêu chí tuyển dụng:**\n    - **Được chấp nhận:**\n        - Điểm phỏng vấn >= 9.0 (được chấp nhận thẳng).\n        - HOẶC Điểm phỏng vấn >= 8.0 VÀ số giải thưởng >= 3.\n        - HOẶC Điểm phỏng vấn >= 7.0 VÀ số giải thưởng >= 5.\n    - **Bị từ chối:** Các trường hợp còn lại.\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: diem_phong_van = 9.2, so_giai_thuong = 1\n    Output: Được chấp nhận (Điểm cao).\n    \n    Input: diem_phong_van = 8.5, so_giai_thuong = 4\n    Output: Được chấp nhận (Điểm tốt và nhiều giải thưởng).\n    \n    Input: diem_phong_van = 7.5, so_giai_thuong = 2\n    Output: Bị từ chối (Chưa đủ điều kiện).\n    \n    Input: diem_phong_van = 7.0, so_giai_thuong = 5\n    Output: Được chấp nhận (Điểm vừa và nhiều giải thưởng).\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra trạng thái \\"Được chấp nhận\\" hoặc \\"Bị từ chối\\" cùng với lý do.\\n")',
      testCases: [
        { input: '- diem_phong_van: Một số thực (0.0 - 10.0).\n', expectedOutput: 'In ra trạng thái "Được chấp nhận" hoặc "Bị từ chối" cùng với lý do.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm Tra Tính Hợp Lệ Của Ngày (Tháng có 30, 31, 28/29 ngày)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 11: Kiểm Tra Tính Hợp Lệ Của Ngày (Tháng có 30, 31, 28/29 ngày)**\n\n- **Mô tả bài toán:** Cho `ngay` và `thang`. Kiểm tra xem ngày đó có hợp lệ trong năm (không xét năm nhuận ở đây, tháng 2 luôn có 28 ngày) hay không.\n- **Input:**\n    - `ngay`: Một số nguyên.\n    - `thang`: Một số nguyên.\n- **Output:** In ra "Ngày hợp lệ." hoặc "Ngày KHÔNG hợp lệ."\n- **Ràng buộc:** `ngay >= 1`, `thang >= 1`\n- **Quy tắc:**\n    - Các tháng có 31 ngày: 1, 3, 5, 7, 8, 10, 12.\n    - Các tháng có 30 ngày: 4, 6, 9, 11.\n    - Tháng 2: Có 28 ngày.\n    - Kiểm tra `ngay` phải nằm trong giới hạn của `thang` đó.\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: ngay = 31, thang = 1\n    Output: Ngày hợp lệ.\n    \n    Input: ngay = 31, thang = 4\n    Output: Ngày KHÔNG hợp lệ.\n    \n    Input: ngay = 29, thang = 2\n    Output: Ngày KHÔNG hợp lệ.\n    \n    Input: ngay = 15, thang = 10\n    Output: Ngày hợp lệ.\n    \n    Input: ngay = 0, thang = 5\n    Output: Ngày KHÔNG hợp lệ.\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra \\"Ngày hợp lệ.\\" hoặc \\"Ngày KHÔNG hợp lệ.\\"\\n")',
      testCases: [
        { input: '- ngay: Một số nguyên.\n', expectedOutput: 'In ra "Ngày hợp lệ." hoặc "Ngày KHÔNG hợp lệ."\n', isHidden: false }
      ]
    },
    {
      title: 'Phân Loại Phản Hồi Khách Hàng',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 12: Phân Loại Phản Hồi Khách Hàng**\n\n- **Mô tả bài toán:** Cho điểm hài lòng `diem_hai_long` (1-5) và một cờ `co_tu_ngu_tieu_cuc` (Boolean: `True` nếu phản hồi chứa từ ngữ tiêu cực như "tệ", "xấu", `False` nếu không).\n- **Input:**\n    - `diem_hai_long`: Một số nguyên (1-5).\n    - `co_tu_ngu_tieu_cuc`: Boolean.\n- **Output:** In ra phân loại phản hồi chi tiết.\n- **Ràng buộc:** `1 <= diem_hai_long <= 5`\n- **Phân loại (ưu tiên từ trên xuống):**\n    - Nếu `diem_hai_long` = 5:\n        - Nếu `co_tu_ngu_tieu_cuc` là `True`: "Phản hồi mâu thuẫn (Điểm cao nhưng có từ ngữ tiêu cực)."\n        - Nếu `co_tu_ngu_tieu_cuc` là `False`: "Phản hồi Rất tích cực."\n    - Nếu `diem_hai_long` = 4: "Phản hồi Tích cực."\n    - Nếu `diem_hai_long` = 3: "Phản hồi Trung lập."\n    - Nếu `diem_hai_long` = 1 HOẶC `diem_hai_long` = 2:\n        - Nếu `co_tu_ngu_tieu_cuc` là `True`: "Phản hồi Rất tiêu cực, có chi tiết."\n        - Nếu `co_tu_ngu_tieu_cuc` là `False`: "Phản hồi Tiêu cực (không có chi tiết)."\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: diem_hai_long = 5, co_tu_ngu_tieu_cuc = True\n    Output: Phản hồi mâu thuẫn (Điểm cao nhưng có từ ngữ tiêu cực).\n    \n    Input: diem_hai_long = 5, co_tu_ngu_tieu_cuc = False\n    Output: Phản hồi Rất tích cực.\n    \n    Input: diem_hai_long = 3, co_tu_ngu_tieu_cuc = False\n    Output: Phản hồi Trung lập.\n    \n    Input: diem_hai_long = 1, co_tu_ngu_tieu_cuc = True\n    Output: Phản hồi Rất tiêu cực, có chi tiết.\n    \n    Input: diem_hai_long = 2, co_tu_ngu_tieu_cuc = False\n    Output: Phản hồi Tiêu cực (không có chi tiết).\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra phân loại phản hồi chi tiết.\\n")',
      testCases: [
        { input: '- diem_hai_long: Một số nguyên (1-5).\n', expectedOutput: 'In ra phân loại phản hồi chi tiết.\n', isHidden: false }
      ]
    },
    {
      title: 'Quyết Định Tuyển Dụng Nhân Sự',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 13: Quyết Định Tuyển Dụng Nhân Sự**\n\n- **Mô tả bài toán:** Một công ty tuyển dụng dựa trên điểm phỏng vấn `diem_phong_van`, kinh nghiệm làm việc `so_nam_kinh_nghiem`, và việc có bằng cấp liên quan `co_bang_cap_lien_quan` (Boolean).\n- **Input:**\n    - `diem_phong_van`: Một số thực (0.0 - 10.0).\n    - `so_nam_kinh_nghiem`: Một số nguyên không âm.\n    - `co_bang_cap_lien_quan`: Boolean.\n- **Output:** In ra "Ứng viên [Trạng thái]" và lý do.\n- **Ràng buộc:** `0.0 <= diem_phong_van <= 10.0`, `0 <= so_nam_kinh_nghiem <= 50`\n- **Tiêu chí tuyển dụng (ưu tiên từ trên xuống):**\n    - **Tuyển thẳng:** `diem_phong_van` >= 9.0 VÀ `so_nam_kinh_nghiem` >= 5.\n    - **Xem xét thêm:** `diem_phong_van` >= 7.0 HOẶC (`so_nam_kinh_nghiem` >= 3 VÀ `co_bang_cap_lien_quan` là `True`).\n    - **Từ chối (không đủ điều kiện cơ bản):** `diem_phong_van` < 5.0.\n    - **Phỏng vấn lại:** Các trường hợp còn lại.\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: diem_phong_van = 9.5, so_nam_kinh_nghiem = 6, co_bang_cap_lien_quan = True\n    Output: Ứng viên Tuyển thẳng (Điểm cao và kinh nghiệm).\n    \n    Input: diem_phong_van = 7.5, so_nam_kinh_nghiem = 2, co_bang_cap_lien_quan = True\n    Output: Ứng viên Xem xét thêm (Điểm tốt).\n    \n    Input: diem_phong_van = 6.0, so_nam_kinh_nghiem = 4, co_bang_cap_lien_quan = False\n    Output: Ứng viên Phỏng vấn lại.\n    \n    Input: diem_phong_van = 4.0, so_nam_kinh_nghiem = 1, co_bang_cap_lien_quan = True\n    Output: Ứng viên Từ chối (Không đủ điều kiện cơ bản).\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra \\"Ứng viên [Trạng thái]\\" và lý do.\\n")',
      testCases: [
        { input: '- diem_phong_van: Một số thực (0.0 - 10.0).\n', expectedOutput: 'In ra "Ứng viên [Trạng thái]" và lý do.\n', isHidden: false }
      ]
    },
    {
      title: 'Xác định Điểm Đến của Người Dùng (Theo Thời gian và Sở thích)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 14: Xác định Điểm Đến của Người Dùng (Theo Thời gian và Sở thích)**\n\n- **Mô tả bài toán:** Một ứng dụng gợi ý địa điểm dựa trên `gio_hien_tai` (số nguyên 0-23) và `so_thich_nguoi_dung` (chuỗi: "am thuc", "thien nhien", "mua sam", "khac").\n- **Input:**\n    - `gio_hien_tai`: Một số nguyên (0-23).\n    - `so_thich_nguoi_dung`: Chuỗi.\n- **Output:** In ra gợi ý điểm đến.\n- **Ràng buộc:** `0 <= gio_hien_tai <= 23`\n- **Gợi ý:**\n    - **Buổi sáng (6h-11h):**\n        - Nếu `so_thich_nguoi_dung` là "thien nhien": "Gợi ý: Công viên hoặc hồ."\n        - Nếu `so_thich_nguoi_dung` là "am thuc": "Gợi ý: Quán ăn sáng hoặc cafe."\n        - Các sở thích khác: "Gợi ý: Khu vực trung tâm thành phố."\n    - **Buổi trưa/chiều (12h-17h):**\n        - Nếu `so_thich_nguoi_dung` là "mua sam": "Gợi ý: Trung tâm thương mại."\n        - Nếu `so_thich_nguoi_dung` là "am thuc": "Gợi ý: Nhà hàng ăn trưa."\n        - Các sở thích khác: "Gợi ý: Bảo tàng hoặc phòng trưng bày."\n    - **Buổi tối (18h-23h):**\n        - Nếu `so_thich_nguoi_dung` là "am thuc": "Gợi ý: Quán ăn tối hoặc bar/pub."\n        - Các sở thích khác: "Gợi ý: Rạp chiếu phim hoặc nhà hát."\n    - **Đêm khuya/sáng sớm (0h-5h):** "Gợi ý: Hãy nghỉ ngơi, trời đã muộn rồi."\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: gio_hien_tai = 8, so_thich_nguoi_dung = "thien nhien"\n    Output: Gợi ý: Công viên hoặc hồ.\n    \n    Input: gio_hien_tai = 14, so_thich_nguoi_dung = "mua sam"\n    Output: Gợi ý: Trung tâm thương mại.\n    \n    Input: gio_hien_tai = 20, so_thich_nguoi_dung = "am thuc"\n    Output: Gợi ý: Quán ăn tối hoặc bar/pub.\n    \n    Input: gio_hien_tai = 3, so_thich_nguoi_dung = "khac"\n    Output: Gợi ý: Hãy nghỉ ngơi, trời đã muộn rồi.\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra gợi ý điểm đến.\\n")',
      testCases: [
        { input: '- gio_hien_tai: Một số nguyên (0-23).\n', expectedOutput: 'In ra gợi ý điểm đến.\n', isHidden: false }
      ]
    },
    {
      title: 'Mô Phỏng Điều Khiển Đèn Giao Thông Đơn Giản',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 15: Mô Phỏng Điều Khiển Đèn Giao Thông Đơn Giản**\n\n- **Mô tả bài toán:** Mô phỏng hoạt động của đèn giao thông dựa trên `mau_den_hien_tai` (chuỗi: "do", "vang", "xanh") và `co_xe_uu_tien` (Boolean: `True` nếu có xe ưu tiên).\n- **Input:**\n    - `mau_den_hien_tai`: Chuỗi.\n    - `co_xe_uu_tien`: Boolean.\n- **Output:** In ra hành động được phép cho phương tiện.\n- **Ràng buộc:** `mau_den_hien_tai` là "do", "vang", "xanh".\n- **Quy tắc (ưu tiên từ trên xuống):**\n    - Nếu `co_xe_uu_tien` là `True`: "Đèn ưu tiên: Xe ưu tiên được đi."\n    - Nếu `mau_den_hien_tai` là "do": "Dừng lại."\n    - Nếu `mau_den_hien_tai` là "vang": "Chuẩn bị dừng hoặc tăng tốc cẩn thận."\n    - Nếu `mau_den_hien_tai` là "xanh": "Được phép đi."\n    - Nếu `mau_den_hien_tai` không hợp lệ: "Trạng thái đèn không xác định."\n- **Ví dụ kiểm thử:**\n    \n    ```python\n    Input: mau_den_hien_tai = "do", co_xe_uu_tien = True\n    Output: Đèn ưu tiên: Xe ưu tiên được đi.\n    \n    Input: mau_den_hien_tai = "xanh", co_xe_uu_tien = False\n    Output: Được phép đi.\n    \n    Input: mau_den_hien_tai = "do", co_xe_uu_tien = False\n    Output: Dừng lại.\n    \n    Input: mau_den_hien_tai = "vang", co_xe_uu_tien = False\n    Output: Chuẩn bị dừng hoặc tăng tốc cẩn thận.\n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("In ra hành động được phép cho phương tiện.\\n")',
      testCases: [
        { input: '- mau_den_hien_tai: Chuỗi.\n', expectedOutput: 'In ra hành động được phép cho phương tiện.\n', isHidden: false }
      ]
    }
  ],
  'LS-03.MP_FOR': [
    {
      title: 'Đếm số lượng số chẵn và lẻ từ 1 đến n',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài tập 1: Đếm số lượng số chẵn và lẻ từ 1 đến n**\n\n- **Mô tả**:\nNhập một số nguyên dương n và đếm số lượng số chẵn và số lẻ từ 1 đến n.\n- **Input**:\nMột số nguyên dương n (ví dụ: 10).\n- **Output**:\nSố lượng số chẵn và số lẻ từ 1 đến n (ví dụ: "Số chẵn: 5, Số lẻ: 5").',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(":\\n")',
      testCases: [
        { input: ':\n', expectedOutput: ':\n', isHidden: false }
      ]
    },
    {
      title: 'Tính tổng các số chẵn',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 2: Tính tổng các số chẵn**\n\n- **Mô tả**: Nhập một số nguyên dương `n` và tính tổng các số chẵn từ 1 đến `n`.\n- **Input**: Một số nguyên dương `n` (ví dụ: 10).\n- **Output**: Tổng các số chẵn từ 1 đến `n` (ví dụ: 30, vì 2 + 4 + 6 + 8 + 10 = 30).\n- **Gợi ý**: Dùng vòng lặp `for` từ 1 đến `n`, dùng `if` để kiểm tra số chẵn (`số % 2 == 0`), rồi cộng vào biến tổng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Tổng các số chẵn từ 1 đến n (ví dụ: 30, vì 2 + 4 + 6 + 8 + 10 = 30).\\n")',
      testCases: [
        { input: ': Một số nguyên dương n (ví dụ: 10).\n', expectedOutput: ': Tổng các số chẵn từ 1 đến n (ví dụ: 30, vì 2 + 4 + 6 + 8 + 10 = 30).\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm số lớn nhất trong danh sách',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 3: Tìm số lớn nhất trong danh sách**\n\n- **Mô tả**: Nhập số lượng phần tử và danh sách các số nguyên, sau đó tìm số lớn nhất.\n- **Input**: Số lượng phần tử `n`, rồi `n` số nguyên (ví dụ: 5, rồi 3 1 4 1 5).\n- **Output**: Số lớn nhất (ví dụ: 5).\n- **Gợi ý**: Khởi tạo biến `max_value` bằng số đầu tiên, dùng vòng lặp `for` để so sánh từng số với `max_value`, nếu lớn hơn thì cập nhật lại `max_value`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Số lớn nhất (ví dụ: 5).\\n")',
      testCases: [
        { input: ': Số lượng phần tử n, rồi n số nguyên (ví dụ: 5, rồi 3 1 4 1 5).\n', expectedOutput: ': Số lớn nhất (ví dụ: 5).\n', isHidden: false }
      ]
    },
    {
      title: 'In bảng cửu chương',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 4: In bảng cửu chương**\n\n- **Mô tả**: Nhập một số nguyên dương `n` và in bảng cửu chương từ 1 đến `n`.\n- **Input**: Một số nguyên dương `n` (ví dụ: 3).\n- **Output**: Bảng cửu chương từ 1 đến `n` (ví dụ:\n    \n    ```\n    1x1 = 1\n    1x2 = 2\n    1x3 = 3\n    ...\n    1x10 = 10\n    ....\n    \n    2x1 =2\n    ..\n    2x10 = 20\n    \n    ```\n    \n- **Gợi ý**: Dùng hai vòng lặp `for` lồng nhau: vòng ngoài từ 1 đến `n` (hàng), vòng trong từ 1 đến `n` (cột), in ra phép nhân.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Bảng cửu chương từ 1 đến n (ví dụ:\\n")',
      testCases: [
        { input: ': Một số nguyên dương n (ví dụ: 3).\n', expectedOutput: ': Bảng cửu chương từ 1 đến n (ví dụ:\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra chuỗi palindrome',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 5: Kiểm tra chuỗi palindrome**\n\n- **Mô tả**: Nhập một chuỗi và kiểm tra xem nó có phải chuỗi palindrome không (chuỗi đọc xuôi ngược đều giống nhau).\n- **Input**: Một chuỗi `s` (ví dụ: "radar").\n- **Output**: "YES" nếu là palindrome, "NO" nếu không phải (ví dụ: "YES").\n- **Gợi ý**: Dùng vòng lặp `for` để so sánh ký tự từ đầu và cuối chuỗi, nếu có cặp nào khác nhau thì in "NO", ngược lại in "YES".',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": \\"YES\\" nếu là palindrome, \\"NO\\" nếu không phải (ví dụ: \\"YES\\").\\n")',
      testCases: [
        { input: ': Một chuỗi s (ví dụ: "radar").\n', expectedOutput: ': "YES" nếu là palindrome, "NO" nếu không phải (ví dụ: "YES").\n', isHidden: false }
      ]
    },
    {
      title: 'Tính giai thừa',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 6: Tính giai thừa**\n\n- **Mô tả**: Nhập một số nguyên dương `n` và tính giai thừa của nó (giai thừa là tích các số từ 1 đến `n`).\n- **Input**: Một số nguyên dương `n` (ví dụ: 5).\n- **Output**: Giai thừa của `n` (ví dụ: 120, vì 1 * 2 * 3 * 4 * 5 = 120).\n- **Gợi ý**: Dùng vòng lặp `for` từ 1 đến `n`, nhân từng số vào biến kết quả.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Giai thừa của n (ví dụ: 120, vì 1  2  3  4  5 = 120).\\n")',
      testCases: [
        { input: ': Một số nguyên dương n (ví dụ: 5).\n', expectedOutput: ': Giai thừa của n (ví dụ: 120, vì 1  2  3  4  5 = 120).\n', isHidden: false }
      ]
    },
    {
      title: 'Đảo ngược danh sách',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 7: Đảo ngược danh sách**\n\n- **Mô tả**: Nhập số lượng phần tử và danh sách các số nguyên, sau đó in danh sách theo thứ tự đảo ngược.\n- **Input**: Số lượng phần tử `n`, rồi `n` số nguyên (ví dụ: 4, rồi 1 2 3 4).\n- **Output**: Danh sách đảo ngược (ví dụ: 4 3 2 1).\n- **Gợi ý**: Lưu danh sách vào một biến, dùng vòng lặp `for` từ chỉ số cuối về đầu để in ra từng phần tử.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Danh sách đảo ngược (ví dụ: 4 3 2 1).\\n")',
      testCases: [
        { input: ': Số lượng phần tử n, rồi n số nguyên (ví dụ: 4, rồi 1 2 3 4).\n', expectedOutput: ': Danh sách đảo ngược (ví dụ: 4 3 2 1).\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm số Fibonacci thứ n',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 8: Tìm số Fibonacci thứ n**\n\n- **Mô tả**: Nhập một số nguyên dương `n` và tính số Fibonacci thứ `n` (dãy Fibonacci: 0, 1, 1, 2, 3, 5, 8, ...).\n- **Input**: Một số nguyên dương `n` (ví dụ: 6).\n- **Output**: Số Fibonacci thứ `n` (ví dụ: 5, vì dãy là 0 1 1 2 3 5).\n- **Gợi ý**: Dùng vòng lặp `for`, khởi tạo hai số đầu (0 và 1), sau đó tính số tiếp theo bằng tổng hai số trước.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Số Fibonacci thứ n (ví dụ: 5, vì dãy là 0 1 1 2 3 5).\\n")',
      testCases: [
        { input: ': Một số nguyên dương n (ví dụ: 6).\n', expectedOutput: ': Số Fibonacci thứ n (ví dụ: 5, vì dãy là 0 1 1 2 3 5).\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra số hoàn hảo',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 9: Kiểm tra số hoàn hảo**\n\n- **Mô tả**: Nhập một số nguyên dương `n` và kiểm tra xem nó có phải số hoàn hảo không (số hoàn hảo là số bằng tổng các ước của nó trừ chính nó).\n- **Input**: Một số nguyên dương `n` (ví dụ: 6).\n- **Output**: "YES" nếu là số hoàn hảo, "NO" nếu không phải (ví dụ: "YES", vì 1 + 2 + 3 = 6).\n- **Gợi ý**: Dùng vòng lặp `for` từ 1 đến `n-1`, kiểm tra ước bằng `%`, tính tổng các ước và so sánh với `n`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": \\"YES\\" nếu là số hoàn hảo, \\"NO\\" nếu không phải (ví dụ: \\"YES\\", vì 1 + 2 + 3 = 6).\\n")',
      testCases: [
        { input: ': Một số nguyên dương n (ví dụ: 6).\n', expectedOutput: ': "YES" nếu là số hoàn hảo, "NO" nếu không phải (ví dụ: "YES", vì 1 + 2 + 3 = 6).\n', isHidden: false }
      ]
    },
    {
      title: 'Tính tổng các số đảo ngược',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### BÀi 10: Tính tổng các số đảo ngược\n\nNhập số n sao cho n > 1 và n < 100 \n\nin ra các số có tận cùng là 3,5,7, 9 và là số nguyên tố trong khoảng từ 1 đến n \n\nví dụ n=13 \n\nIn ra: 3,5,7,13\n\nn=17 \n\nIn ra: \n\n3,5,7,13,17\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'n = int(input())\nres = []\nfor x in range(2, n + 1):\n    if x % 10 in [3, 5, 7, 9]:\n        is_prime = True\n        for i in range(2, int(x**0.5) + 1):\n            if x % i == 0:\n                is_prime = False\n                break\n        if is_prime:\n            res.append(str(x))\nprint(",".join(res))\n',
      testCases: [
        { input: '13\n', expectedOutput: '3,5,7,13\n', isHidden: false },
        { input: '17\n', expectedOutput: '3,5,7,13,17\n', isHidden: false },
        { input: '30\n', expectedOutput: '3,5,7,13,17,19,23,29\n', isHidden: true }
      ]
    },
    {
      title: 'Tìm ước chung lớn nhất (GCD)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 11: Tìm ước chung lớn nhất (GCD)**\n\n- **Mô tả**: Nhập hai số nguyên dương `a` và `b`, tìm ước chung lớn nhất của chúng.\n- **Input**: Hai số nguyên dương `a`, `b` (ví dụ: 12 và 18).\n- **Output**: Ước chung lớn nhất (ví dụ: 6).\n- **Gợi ý**:\n    - Dùng thuật toán Euclid:\n        - Trong khi `b != 0`, thay thế `a = b` và `b = a % b`.\n        - Khi `b == 0`, `a` là GCD.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Ước chung lớn nhất (ví dụ: 6).\\n")',
      testCases: [
        { input: ': Hai số nguyên dương a, b (ví dụ: 12 và 18).\n', expectedOutput: ': Ước chung lớn nhất (ví dụ: 6).\n', isHidden: false }
      ]
    },
    {
      title: 'Đếm ký tự nguyên âm trong chuỗi',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 12: Đếm ký tự nguyên âm trong chuỗi**\n\n- **Mô tả**: Nhập một chuỗi và đếm số lượng ký tự nguyên âm (`a, e, i, o, u`, không phân biệt hoa/thường).\n- **Input**: Một chuỗi `s` (ví dụ: "Hello World").\n- **Output**: Số lượng nguyên âm (ví dụ: 3).\n- **Gợi ý**:\n    - Chuyển chuỗi về chữ thường (`s.lower()`), sau đó dùng vòng lặp `for` để kiểm tra từng ký tự.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Số lượng nguyên âm (ví dụ: 3).\\n")',
      testCases: [
        { input: ': Một chuỗi s (ví dụ: "Hello World").\n', expectedOutput: ': Số lượng nguyên âm (ví dụ: 3).\n', isHidden: false }
      ]
    },
    {
      title: 'Tính tổng dãy số nhập từ người dùng',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài 13: Tính tổng dãy số nhập từ người dùng\n\n- **Mô tả**: Nhập các số nguyên từ người dùng cho đến khi nhập `1`, sau đó tính tổng các số đã nhập.\n- **Input**: Dãy số nguyên (ví dụ: 5, 3, -1).\n- **Output**: Tổng các số (ví dụ: 8).\n- **Gợi ý**:\n    - Dùng vòng lặp `while True` để nhập liên tục, dùng `if` để kiểm tra nếu nhập `1` thì dừng.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Tổng các số (ví dụ: 8).\\n")',
      testCases: [
        { input: ': Dãy số nguyên (ví dụ: 5, 3, -1).\n', expectedOutput: ': Tổng các số (ví dụ: 8).\n', isHidden: false }
      ]
    },
    {
      title: 'In bảng số nguyên từ 1 đến n²',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 14: In bảng số nguyên từ 1 đến n²**\n\n- **Mô tả**: Nhập một số nguyên dương `n`, in ra bảng số nguyên từ `1` đến `n²` theo dạng ma trận `n x n`.\n- **Input**: Một số nguyên dương `n` (ví dụ: 3).\n- **Output**:\n    \n    ```\n    1 2 3\n    4 5 6\n    7 8 9\n    \n    ```\n    \n- **Gợi ý**:\n    - Dùng hai vòng lặp `for`: vòng ngoài quản lý hàng, vòng trong quản lý cột.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(":\\n")',
      testCases: [
        { input: ': Một số nguyên dương n (ví dụ: 3).\n', expectedOutput: ':\n', isHidden: false }
      ]
    },
    {
      title: 'Tính tổng các chữ số của một số',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 15: Tính tổng các chữ số của một số**\n\n- **Mô tả**: Nhập một số nguyên dương `n`, tính tổng các chữ số của `n`.\n- **Input**: Một số nguyên dương `n` (ví dụ: 123).\n- **Output**: Tổng các chữ số (ví dụ: 6).\n- **Gợi ý**:\n    - Dùng vòng lặp `while` hoặc `for` kết hợp với phép chia `%` và `//`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint(": Tổng các chữ số (ví dụ: 6).\\n")',
      testCases: [
        { input: ': Một số nguyên dương n (ví dụ: 123).\n', expectedOutput: ': Tổng các chữ số (ví dụ: 6).\n', isHidden: false }
      ]
    }
  ],
  'LS-03.MP_WHILE': [
    {
      title: 'Đếm ngược đơn giản',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 1: Đếm ngược đơn giản**\n\n- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để đếm ngược từ `n` về 1 và in ra từng số.\n- **Input:**\n    - Một số nguyên dương `n` (ví dụ: `5`).\n- **Output:**\n    - Các số được in trên từng dòng, đếm ngược từ `n` về 1.\n- **Ví dụ:**\n    \n    `# Input:\n    # 5\n    # Output:\n    # 5\n    # 4\n    # 3\n    # 2\n    # 1`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Các số được in trên từng dòng, đếm ngược từ n về 1.\\n")',
      testCases: [
        { input: '- Một số nguyên dương n (ví dụ: 5).\n', expectedOutput: '- Các số được in trên từng dòng, đếm ngược từ n về 1.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính tổng các số từ 1 đến N',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 2: Tính tổng các số từ 1 đến N**\n\n- **Mô tả:** Nhập một số nguyên dương `N`. Sử dụng vòng lặp `while` để tính và in ra tổng các số nguyên từ 1 đến `N`.\n- **Input:**\n    - Một số nguyên dương `N` (ví dụ: `10`).\n- **Output:**\n    - Một số nguyên duy nhất là tổng.\n- **Ví dụ:**\n    \n    `# Input:\n    # 10\n    # Output:\n    # 55`\n    \n- **Giải thích ví dụ:** `1 + 2 + ... + 10 = 55`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là tổng.\\n")',
      testCases: [
        { input: '- Một số nguyên dương N (ví dụ: 10).\n', expectedOutput: '- Một số nguyên duy nhất là tổng.\n', isHidden: false }
      ]
    },
    {
      title: 'Nhập số đến khi gặp số âm',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 3: Nhập số đến khi gặp số âm**\n\n- **Mô tả:** Yêu cầu người dùng nhập các số nguyên dương. Tính tổng các số đã nhập. Dừng việc nhập và in ra tổng khi người dùng nhập một số âm.\n- **Input:**\n    - Các số nguyên (ví dụ: `5`, `10`, `3`, `1`).\n- **Output:**\n    - Một số nguyên duy nhất là tổng các số dương đã nhập.\n- **Ví dụ:**\n    \n    `# Input:\n    # 5\n    # 10\n    # 3\n    # -1\n    # Output:\n    # 18`\n    \n- **Gợi ý:** Dùng `while True` và lệnh `break`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là tổng các số dương đã nhập.\\n")',
      testCases: [
        { input: '- Các số nguyên (ví dụ: 5, 10, 3, 1).\n', expectedOutput: '- Một số nguyên duy nhất là tổng các số dương đã nhập.\n', isHidden: false }
      ]
    },
    {
      title: 'Đếm chữ số của một số nguyên',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 4: Đếm chữ số của một số nguyên**\n\n- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để đếm xem số đó có bao nhiêu chữ số.\n- **Input:**\n    - Một số nguyên dương `n` (ví dụ: `12345`).\n- **Output:**\n    - Một số nguyên duy nhất là số lượng chữ số.\n- **Ví dụ:**\n    \n    `# Input:\n    # 12345\n    # Output:\n    # 5`\n    \n- **Gợi ý:** Trong mỗi lần lặp, chia số cho 10 (chia nguyên) và tăng biến đếm.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là số lượng chữ số.\\n")',
      testCases: [
        { input: '- Một số nguyên dương n (ví dụ: 12345).\n', expectedOutput: '- Một số nguyên duy nhất là số lượng chữ số.\n', isHidden: false }
      ]
    },
    {
      title: 'Đảo ngược một số nguyên',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 5: Đảo ngược một số nguyên**\n\n- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để đảo ngược các chữ số của nó và in ra số mới.\n- **Input:**\n    - Một số nguyên dương `n` (ví dụ: `123`).\n- **Output:**\n    - Một số nguyên duy nhất là số đã đảo ngược.\n- **Ví dụ:**\n    \n    `# Input:\n    # 123\n    # Output:\n    # 321`\n    \n- **Gợi ý:** Dùng phép chia lấy dư (`% 10`) để lấy chữ số cuối cùng và phép chia nguyên (`// 10`) để loại bỏ chữ số cuối cùng. Xây dựng số đảo ngược.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là số đã đảo ngược.\\n")',
      testCases: [
        { input: '- Một số nguyên dương n (ví dụ: 123).\n', expectedOutput: '- Một số nguyên duy nhất là số đã đảo ngược.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra số Palindrome (Số)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 6: Kiểm tra số Palindrome (Số)**\n\n- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để kiểm tra xem số đó có phải là số Palindrome không (đọc xuôi hay ngược đều giống nhau).\n- **Input:**\n    - Một số nguyên dương `n` (ví dụ: `121`).\n- **Output:**\n    - `YES` nếu là số Palindrome, `NO` nếu không.\n- **Ví dụ:**\n    \n    `# Input:\n    # 121\n    # Output:\n    # YES\n    \n    # Input:\n    # 123\n    # Output:\n    # NO`\n    \n- **Gợi ý:** Tạo một bản sao của số ban đầu. Sau đó, đảo ngược bản sao và so sánh với số ban đầu.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- YES nếu là số Palindrome, NO nếu không.\\n")',
      testCases: [
        { input: '- Một số nguyên dương n (ví dụ: 121).\n', expectedOutput: '- YES nếu là số Palindrome, NO nếu không.\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm chữ số lớn nhất của một số',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 7: Tìm chữ số lớn nhất của một số**\n\n- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để tìm và in ra chữ số lớn nhất trong số đó.\n- **Input:**\n    - Một số nguyên dương `n` (ví dụ: `51823`).\n- **Output:**\n    - Một số nguyên duy nhất là chữ số lớn nhất.\n- **Ví dụ:**\n    \n    `# Input:\n    # 51823\n    # Output:\n    # 8`\n    \n- **Gợi ý:** Khởi tạo `max_chu_so` bằng 0. Trong mỗi lần lặp, lấy chữ số cuối cùng (`% 10`), so sánh với `max_chu_so` và cập nhật.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là chữ số lớn nhất.\\n")',
      testCases: [
        { input: '- Một số nguyên dương n (ví dụ: 51823).\n', expectedOutput: '- Một số nguyên duy nhất là chữ số lớn nhất.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính lũy thừa (không dùng )',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 8: Tính lũy thừa (không dùng `*`*)**\n\n- **Mô tả:** Nhập một số nguyên `co_so` và một số nguyên dương `so_mu`. Sử dụng vòng lặp `while` để tính `co_so` mũ `so_mu` (ví dụ: 23=8) và in ra kết quả.\n- **Input:**\n    - Hai số nguyên `co_so`, `so_mu` (ví dụ: `2`, `3`).\n- **Output:**\n    - Một số nguyên duy nhất là kết quả lũy thừa.\n- **Ví dụ:**\n    \n    `# Input:\n    # 2\n    # 3\n    # Output:\n    # 8`\n    \n- **Gợi ý:** Khởi tạo kết quả bằng 1. Lặp `so_mu` lần, mỗi lần nhân kết quả với `co_so`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là kết quả lũy thừa.\\n")',
      testCases: [
        { input: '- Hai số nguyên co_so, so_mu (ví dụ: 2, 3).\n', expectedOutput: '- Một số nguyên duy nhất là kết quả lũy thừa.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra số nguyên tố',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 9: Kiểm tra số nguyên tố**\n\n- **Mô tả:** Nhập một số nguyên dương `n` (lớn hơn 1). Sử dụng vòng lặp `while` để kiểm tra xem `n` có phải là số nguyên tố không (chỉ chia hết cho 1 và chính nó).\n- **Input:**\n    - Một số nguyên dương `n` (ví dụ: `7`).\n- **Output:**\n    - `YES` nếu là số nguyên tố, `NO` nếu không.\n- **Ví dụ:**\n    \n    `# Input:\n    # 7\n    # Output:\n    # YES\n    \n    # Input:\n    # 9\n    # Output:\n    # NO`\n    \n- **Gợi ý:** Bắt đầu kiểm tra từ 2. Nếu `n` chia hết cho bất kỳ số nào từ 2 đến `sqrt(n)` thì không phải số nguyên tố. Dùng `break` khi tìm thấy ước.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- YES nếu là số nguyên tố, NO nếu không.\\n")',
      testCases: [
        { input: '- Một số nguyên dương n (ví dụ: 7).\n', expectedOutput: '- YES nếu là số nguyên tố, NO nếu không.\n', isHidden: false }
      ]
    },
    {
      title: 'Ước chung lớn nhất (GCD) - Thuật toán Euclid',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 10: Ước chung lớn nhất (GCD) - Thuật toán Euclid**\n\n- **Mô tả:** Nhập hai số nguyên dương `a` và `b`. Sử dụng vòng lặp `while` để tìm và in ra ước chung lớn nhất (GCD) của chúng bằng thuật toán Euclid.\n- **Input:**\n    - Hai số nguyên dương `a`, `b` (ví dụ: `12`, `18`).\n- **Output:**\n    - Một số nguyên duy nhất là GCD.\n- **Ví dụ:**\n    \n    `# Input:\n    # 12\n    # 18\n    # Output:\n    # 6`\n    \n- **Gợi ý:** Thuật toán Euclid: Trong khi `b` khác 0, thay thế `a` bằng `b` và `b` bằng phần dư của `a` chia `b` (`a % b`). Khi `b` bằng 0, `a` chính là GCD.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là GCD.\\n")',
      testCases: [
        { input: '- Hai số nguyên dương a, b (ví dụ: 12, 18).\n', expectedOutput: '- Một số nguyên duy nhất là GCD.\n', isHidden: false }
      ]
    },
    {
      title: 'Bội chung nhỏ nhất (LCM)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 11: Bội chung nhỏ nhất (LCM)**\n\n- **Mô tả:** Nhập hai số nguyên dương `a` và `b`. Sử dụng vòng lặp `while` và kết hợp với GCD để tìm và in ra bội chung nhỏ nhất (LCM) của chúng.\n- **Công thức:** `LCM(a, b) = (a * b) / GCD(a, b)`\n- **Input:**\n    - Hai số nguyên dương `a`, `b` (ví dụ: `4`, `6`).\n- **Output:**\n    - Một số nguyên duy nhất là LCM.\n- **Ví dụ:**\n    \n    `# Input:\n    # 4\n    # 6\n    # Output:\n    # 12`\n    \n- **Gợi ý:** Trước hết, tính GCD của `a` và `b` bằng vòng lặp `while` (như Bài 10). Sau đó áp dụng công thức.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là LCM.\\n")',
      testCases: [
        { input: '- Hai số nguyên dương a, b (ví dụ: 4, 6).\n', expectedOutput: '- Một số nguyên duy nhất là LCM.\n', isHidden: false }
      ]
    },
    {
      title: 'Dãy Fibonacci đến N',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 12: Dãy Fibonacci đến N**\n\n- **Mô tả:** Nhập một số nguyên dương `N`. In ra tất cả các số trong dãy Fibonacci nhỏ hơn hoặc bằng `N`.\n- **Dãy Fibonacci:** Bắt đầu bằng 0, 1. Số tiếp theo là tổng của hai số liền trước (ví dụ: 0, 1, 1, 2, 3, 5, 8, ...).\n- **Input:**\n    - Một số nguyên dương `N` (ví dụ: `10`).\n- **Output:**\n    - Các số Fibonacci, mỗi số trên một dòng.\n- **Ví dụ:**\n    \n    `# Input:\n    # 10\n    # Output:\n    # 0\n    # 1\n    # 1\n    # 2\n    # 3\n    # 5\n    # 8`\n    \n- **Gợi ý:** Khởi tạo hai biến `a = 0`, `b = 1`. Dùng `while` với điều kiện `a <= N`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Các số Fibonacci, mỗi số trên một dòng.\\n")',
      testCases: [
        { input: '- Một số nguyên dương N (ví dụ: 10).\n', expectedOutput: '- Các số Fibonacci, mỗi số trên một dòng.\n', isHidden: false }
      ]
    },
    {
      title: 'Vòng lặp với số tiền rút từ ATM',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 13: Vòng lặp với số tiền rút từ ATM**\n\n- **Mô tả:** Bạn có `so_tien_ban_dau`. Người dùng muốn rút `so_tien_muon_rut`. Yêu cầu người dùng nhập số tiền muốn rút. Nếu số tiền rút lớn hơn số tiền bạn có, hoặc số tiền rút không phải là bội số của 50 (VD: ATM chỉ cho rút 50k, 100k, 150k...), yêu cầu nhập lại. In ra số tiền còn lại sau khi rút thành công.\n- **Input:**\n    - Dòng 1: `so_tien_ban_dau` (số nguyên, ví dụ: 500)\n    - Các dòng tiếp theo: `so_tien_muon_rut` cho đến khi hợp lệ (ví dụ: `70`, `120`, `100`).\n- **Output:**\n    - Số tiền còn lại (số nguyên).\n- **Ví dụ:**\n    \n    `# Input:\n    # 500\n    # 70\n    # 120\n    # 100\n    # Output:\n    # 400`\n    \n- **Gợi ý:** Dùng `while True` và `break` khi điều kiện hợp lệ. Kiểm tra hai điều kiện: `so_tien_muon_rut <= so_tien_ban_dau` và `so_tien_muon_rut % 50 == 0`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Số tiền còn lại (số nguyên).\\n")',
      testCases: [
        { input: '- Dòng 1: so_tien_ban_dau (số nguyên, ví dụ: 500)\n', expectedOutput: '- Số tiền còn lại (số nguyên).\n', isHidden: false }
      ]
    },
    {
      title: 'Đếm số ước của một số',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 14: Đếm số ước của một số**\n\n- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để đếm và in ra tổng số lượng ước số của `n` (bao gồm 1 và chính nó).\n- **Input:**\n    - Một số nguyên dương `n` (ví dụ: `12`).\n- **Output:**\n    - Một số nguyên duy nhất là tổng số ước.\n- **Ví dụ:**\n    \n    `# Input:\n    # 12\n    # Output:\n    # 6`\n    \n- **Giải thích ví dụ:** Các ước của 12 là 1, 2, 3, 4, 6, 12 (có 6 ước).\n- **Gợi ý:** Dùng một biến `dem = 1`, và một biến `so_uoc = 0`. Lặp `while dem <= n`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Một số nguyên duy nhất là tổng số ước.\\n")',
      testCases: [
        { input: '- Một số nguyên dương n (ví dụ: 12).\n', expectedOutput: '- Một số nguyên duy nhất là tổng số ước.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra số Armstrong',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 15: Kiểm tra số Armstrong**\n\n- **Mô tả:** Nhập một số nguyên dương `n`. Kiểm tra xem `n` có phải là số Armstrong hay không. Một số Armstrong là số mà tổng lập phương của các chữ số của nó bằng chính số đó. (Ví dụ: 153 = 13+53+33=1+125+27=153).\n- **Input:**\n    - Một số nguyên dương `n` (ví dụ: `153`).\n- **Output:**\n    - `YES` nếu là số Armstrong, `NO` nếu không.\n- **Ví dụ:**\n    \n    `# Input:\n    # 153\n    # Output:\n    # YES\n    \n    # Input:\n    # 123\n    # Output:\n    # NO`\n    \n- **Gợi ý:** Tạo một bản sao của `n`. Dùng `while` để lặp qua từng chữ số của bản sao (lấy chữ số cuối `% 10`, loại bỏ chữ số cuối `// 10`), tính tổng lập phương và so sánh với số `n` ban đầu.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- YES nếu là số Armstrong, NO nếu không.\\n")',
      testCases: [
        { input: '- Một số nguyên dương n (ví dụ: 153).\n', expectedOutput: '- YES nếu là số Armstrong, NO nếu không.\n', isHidden: false }
      ]
    }
  ],
  'LS-04.MP': [
    {
      title: 'Trích xuất một phần của chuỗi',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài tập 1: Trích xuất một phần của chuỗi**\n\n- **Yêu cầu:** Cho chuỗi `s = "Hello, World!"`. Sử dụng slicing để trích xuất từ "World".\n- **Ví dụ đầu ra:**\n    \n    ```\n    World\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Lấy ký tự ở vị trí cụ thể',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài tập 2: Lấy ký tự ở vị trí cụ thể**\n\n- **Yêu cầu:** Cho chuỗi `s = "Python"`. Sử dụng slicing để trích xuất ký tự thứ hai và ký tự thứ tư.\n- **Ví dụ đầu ra:**\n    \n    ```\n    y\n    h\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Đảo ngược chuỗi',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài tập 3: Đảo ngược chuỗi**\n\n- **Yêu cầu:** Cho chuỗi `s = "Python"`. Sử dụng slicing để đảo ngược chuỗi.\n- **Ví dụ đầu ra:**\n    \n    ```\n    nohtyP\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Trích xuất các ký tự với bước nhảy',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài tập 4: Trích xuất các ký tự với bước nhảy**\n\n- **Yêu cầu:** Cho chuỗi `s = "123456789"`. Sử dụng slicing để trích xuất các ký tự ở vị trí lẻ (bắt đầu từ vị trí 1).\n- **Ví dụ đầu ra:**\n    \n    ```\n    13579\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Slicing với chỉ số âm',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài tập 5: Slicing với chỉ số âm**\n\n- **Yêu cầu:** Cho chuỗi `s = "Hello, World!"`. Sử dụng slicing với chỉ số âm để trích xuất từ "World".\n- **Ví dụ đầu ra:**\n    \n    ```\n    World\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Trích xuất một phần chuỗi từ đầu',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài tập 6: Trích xuất một phần chuỗi từ đầu**\n\n- **Yêu cầu:** Cho chuỗi `s = "Programming"`. Sử dụng slicing để trích xuất 5 ký tự đầu tiên.\n- **Ví dụ đầu ra:**\n    \n    ```\n    Progr\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Trích xuất một phần chuỗi từ cuối',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài tập 7: Trích xuất một phần chuỗi từ cuối**\n\n- **Yêu cầu:** Cho chuỗi `s = "Programming"`. Sử dụng slicing để trích xuất 6 ký tự cuối cùng.\n- **Ví dụ đầu ra:**\n    \n    ```\n    amming\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Slicing để loại bỏ ký tự đầu và cuối',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài tập 8: Slicing để loại bỏ ký tự đầu và cuối**\n\n- **Yêu cầu:** Cho chuỗi `s = "[Python]"`. Sử dụng slicing để loại bỏ dấu `[` ở đầu và dấu `]` ở cuối.\n- **Ví dụ đầu ra:**\n    \n    ```\n    Python\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Slicing với bước nhảy lớn',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài tập 9: Slicing với bước nhảy lớn**\n\n- **Yêu cầu:** Cho chuỗi `s = "0123456789"`. Sử dụng slicing để trích xuất các ký tự với bước nhảy 3, bắt đầu từ vị trí 0.\n- **Ví dụ đầu ra:**\n    \n    ```\n    0369\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Trích xuất xen kẽ và đảo ngược',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài tập 10: Trích xuất xen kẽ và đảo ngược**\n\n- **Yêu cầu:** Cho chuỗi `s = "abcdefghij"`. Sử dụng slicing để trích xuất các ký tự ở vị trí chẵn, sau đó đảo ngược kết quả.\n- **Ví dụ đầu ra:**\n    \n    ```\n    jhfdb\n    \n    ```\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Tạo và in chuỗi',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài tập 1: Tạo và in chuỗi\n\n- **Yêu cầu:** Tạo một chuỗi với nội dung "Hello, Python!" và in nó ra màn hình.\n- **Ví dụ đầu ra:**\n    \n    ```python\n    Hello, Python!\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("python\\n")',
      testCases: [
        { input: '', expectedOutput: 'python\n', isHidden: false }
      ]
    },
    {
      title: 'Nối chuỗi',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài tập 2: Nối chuỗi\n\n- **Yêu cầu:** Tạo hai chuỗi, ví dụ "Hello" và "World", sau đó nối chúng với một khoảng trắng ở giữa và in kết quả.\n- **Ví dụ đầu ra:**\n    \n    ```\n    Hello World\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Lặp chuỗi',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài tập 3: Lặp chuỗi\n\n- **Yêu cầu:** Tạo một chuỗi, ví dụ "Ha", và lặp lại nó 4 lần, sau đó in kết quả.\n- **Ví dụ đầu ra:**\n    \n    ```\n    HaHaHaHa\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Truy cập ký tự',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài tập 4: Truy cập ký tự\n\n- **Yêu cầu:** Tạo một chuỗi, ví dụ "Python", và in ra ký tự thứ ba (chỉ số 2).\n- **Ví dụ đầu ra:**\n    \n    ```\n    t\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Độ dài chuỗi',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài tập 5: Độ dài chuỗi\n\n- **Yêu cầu:** Tạo một chuỗi và in ra độ dài của nó.\n- **Ví dụ đầu ra:**\n    \n    ```\n    Độ dài chuỗi: 6\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Chuyển đổi chữ hoa, chữ thường',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài tập 6: Chuyển đổi chữ hoa, chữ thường\n\n- **Yêu cầu:** Tạo một chuỗi với các ký tự hỗn hợp, ví dụ "PyThOn", sau đó chuyển tất cả thành chữ thường và in ra.\n- **Ví dụ đầu ra:**\n    \n    ```\n    python\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Loại bỏ khoảng trắng',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài tập 7: Loại bỏ khoảng trắng\n\n- **Yêu cầu:** Tạo một chuỗi có khoảng trắng ở đầu và cuối, ví dụ "     Hello     ", sau đó sử dụng `strip()` để loại bỏ khoảng trắng và in kết quả.\n- **Ví dụ đầu ra:**\n    \n    ```\n    Hello\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Thay thế chuỗi con',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### Bài tập 8: Thay thế chuỗi con\n\n- **Yêu cầu:** Tạo một chuỗi, ví dụ "I like apples", sau đó thay thế "apples" bằng "oranges" và in kết quả.\n- **Ví dụ đầu ra:**\n    \n    ```\n    I like oranges\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Định dạng chuỗi với f-string',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### Bài tập 9: Định dạng chuỗi với f-string\n\n- **Yêu cầu:** Tạo hai biến, ví dụ `ten = "Minh"` và `tuoi = 20`, sau đó sử dụng f-string để tạo chuỗi "Tôi tên là Minh, 20 tuổi." và in ra.\n- **Ví dụ đầu ra:**\n    \n    ```\n    Tôi tên là Minh, 20 tuổi.\n    \n    ```',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm và đếm chuỗi con',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### Bài tập 10: Tìm và đếm chuỗi con\n\n- **Yêu cầu:** Tạo một chuỗi, ví dụ "banana", sau đó tìm vị trí đầu tiên của "a" và đếm số lần xuất hiện của "a".\n- **Ví dụ đầu ra:**\n    \n    ```\n    Vị trí đầu tiên của \'a\': 1\n    Số lần xuất hiện của \'a\': 3\n    \n    ```\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("\\n")',
      testCases: [
        { input: '', expectedOutput: '\n', isHidden: false }
      ]
    }
  ],
  'LS-05.MP': [
    {
      title: 'Khai báo và In Danh sách Đơn giản',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 1: Khai báo và In Danh sách Đơn giản**\n\n- **Mô tả bài toán:** Tạo và in một danh sách chứa 3 số nguyên bất kỳ.\n- **Input:** (Tự nhập)\n- **Output:** Danh sách đã tạo.\n- **Ví dụ kiểm thử:** `[1, 2, 3]`\n- **Gợi ý:** Sử dụng `[]` để tạo danh sách và `print()` để hiển thị.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Danh sách đã tạo.\\n")',
      testCases: [
        { input: '', expectedOutput: 'Danh sách đã tạo.\n', isHidden: false }
      ]
    },
    {
      title: 'Lấy một Phần tử theo Vị trí',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 2: Lấy một Phần tử theo Vị trí**\n\n- **Mô tả bài toán:** Cho `colors = ["red", "green", "blue"]`. In phần tử thứ hai.\n- **Input:** `colors`\n- **Output:** Phần tử thứ hai.\n- **Ví dụ kiểm thử:** `green`\n- **Gợi ý:** Nhớ chỉ số bắt đầu từ 0.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Phần tử thứ hai.\\n")',
      testCases: [
        { input: 'colors\n', expectedOutput: 'Phần tử thứ hai.\n', isHidden: false }
      ]
    },
    {
      title: 'Thay đổi Giá trị của một Phần tử',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 3: Thay đổi Giá trị của một Phần tử**\n\n- **Mô tả bài toán:** Cho `scores = [7, 8, 9]`. Thay đổi điểm đầu tiên thành 10. In danh sách mới.\n- **Input:** `scores`\n- **Output:** Danh sách đã cập nhật.\n- **Ví dụ kiểm thử:** `[10, 8, 9]`\n- **Gợi ý:** Gán giá trị mới trực tiếp vào chỉ số.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Danh sách đã cập nhật.\\n")',
      testCases: [
        { input: 'scores\n', expectedOutput: 'Danh sách đã cập nhật.\n', isHidden: false }
      ]
    },
    {
      title: 'Thêm Phần tử vào Cuối Danh sách',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 4: Thêm Phần tử vào Cuối Danh sách**\n\n- **Mô tả bài toán:** Cho `fruits = ["apple", "banana"]`. Thêm `"orange"` vào cuối. In danh sách mới.\n- **Input:** `fruits`\n- **Output:** Danh sách đã thêm.\n- **Ví dụ kiểm thử:** `[\'apple\', \'banana\', \'orange\']`\n- **Gợi ý:** Tìm phương thức để thêm vào cuối.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Danh sách đã thêm.\\n")',
      testCases: [
        { input: 'fruits\n', expectedOutput: 'Danh sách đã thêm.\n', isHidden: false }
      ]
    },
    {
      title: 'Xóa một Phần tử cụ thể (theo giá trị)',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 5: Xóa một Phần tử cụ thể (theo giá trị)**\n\n- **Mô tả bài toán:** Cho `animals = ["cat", "dog", "fish"]`. Xóa `"dog"`. In danh sách mới.\n- **Input:** `animals`\n- **Output:** Danh sách đã xóa.\n- **Ví dụ kiểm thử:** `[\'cat\', \'fish\']`\n- **Gợi ý:** Có một phương thức để xóa phần tử theo giá trị.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Danh sách đã xóa.\\n")',
      testCases: [
        { input: 'animals\n', expectedOutput: 'Danh sách đã xóa.\n', isHidden: false }
      ]
    },
    {
      title: 'Xóa Phần tử theo Vị trí',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 6: Xóa Phần tử theo Vị trí**\n\n- **Mô tả bài toán:** Cho `numbers = [10, 20, 30, 40]`. Xóa phần tử ở chỉ số 2. In danh sách mới.\n- **Input:** `numbers`\n- **Output:** Danh sách đã xóa.\n- **Ví dụ kiểm thử:** `[10, 20, 40]`\n- **Gợi ý:** Có thể dùng `del` hoặc `pop()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Danh sách đã xóa.\\n")',
      testCases: [
        { input: 'numbers\n', expectedOutput: 'Danh sách đã xóa.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra Độ dài Danh sách',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 7: Kiểm tra Độ dài Danh sách**\n\n- **Mô tả bài toán:** Cho `items = ["laptop", "mouse", "keyboard", "monitor"]`. In số lượng phần tử.\n- **Input:** `items`\n- **Output:** Số lượng phần tử.\n- **Ví dụ kiểm thử:** `4`\n- **Gợi ý:** Sử dụng hàm `len()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Số lượng phần tử.\\n")',
      testCases: [
        { input: 'items\n', expectedOutput: 'Số lượng phần tử.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra Phần tử có Tồn tại không',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 8: Kiểm tra Phần tử có Tồn tại không**\n\n- **Mô tả bài toán:** Cho `fruits = ["apple", "banana", "cherry"]`. Kiểm tra `"banana"` có tồn tại không. In `True` hoặc `False`.\n- **Input:** `fruits`\n- **Output:** `True` hoặc `False`.\n- **Ví dụ kiểm thử:** `True`\n- **Gợi ý:** Sử dụng toán tử `in`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("True hoặc False.\\n")',
      testCases: [
        { input: 'fruits\n', expectedOutput: 'True hoặc False.\n', isHidden: false }
      ]
    },
    {
      title: 'In từng Phần tử của Danh sách',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 9: In từng Phần tử của Danh sách**\n\n- **Mô tả bài toán:** Cho `cities = ["Hanoi", "Ho Chi Minh", "Da Nang"]`. Dùng vòng lặp `for` in từng thành phố trên một dòng.\n- **Input:** `cities`\n- **Output:** Các thành phố (mỗi dòng một thành phố).\n- **Ví dụ kiểm thử:**\n    \n    `Hanoi\n    Ho Chi Minh\n    Da Nang`\n    \n- **Gợi ý:** Vòng lặp `for item in list:`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Các thành phố (mỗi dòng một thành phố).\\n")',
      testCases: [
        { input: 'cities\n', expectedOutput: 'Các thành phố (mỗi dòng một thành phố).\n', isHidden: false }
      ]
    },
    {
      title: 'Tính Tổng các số trong Danh sách',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 10: Tính Tổng các số trong Danh sách**\n\n- **Mô tả bài toán:** Cho `numbers = [5, 10, 15, 20]`. Tính và in tổng các số.\n- **Input:** `numbers`\n- **Output:** Tổng các số.\n- **Ví dụ kiểm thử:** `50`\n- **Gợi ý:** Sử dụng hàm `sum()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Tổng các số.\\n")',
      testCases: [
        { input: 'numbers\n', expectedOutput: 'Tổng các số.\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm số Lớn nhất trong Danh sách',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 11: Tìm số Lớn nhất trong Danh sách**\n\n- **Mô tả bài toán:** Cho `points = [100, 75, 120, 90]`. Tìm và in số lớn nhất.\n- **Input:** `points`\n- **Output:** Số lớn nhất.\n- **Ví dụ kiểm thử:** `120`\n- **Gợi ý:** Sử dụng hàm `max()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Số lớn nhất.\\n")',
      testCases: [
        { input: 'points\n', expectedOutput: 'Số lớn nhất.\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm số Nhỏ nhất trong Danh sách',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 12: Tìm số Nhỏ nhất trong Danh sách**\n\n- **Mô tả bài toán:** Cho `temperatures = [25, 18, 30, 22]`. Tìm và in số nhỏ nhất.\n- **Input:** `temperatures`\n- **Output:** Số nhỏ nhất.\n- **Ví dụ kiểm thử:** `18`\n- **Gợi ý:** Sử dụng hàm `min()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Số nhỏ nhất.\\n")',
      testCases: [
        { input: 'temperatures\n', expectedOutput: 'Số nhỏ nhất.\n', isHidden: false }
      ]
    },
    {
      title: 'Sắp xếp Danh sách Tăng dần',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 13: Sắp xếp Danh sách Tăng dần**\n\n- **Mô tả bài toán:** Cho `data = [5, 2, 8, 1]`. Sắp xếp tăng dần. In danh sách đã sắp xếp.\n- **Input:** `data`\n- **Output:** Danh sách đã sắp xếp.\n- **Ví dụ kiểm thử:** `[1, 2, 5, 8]`\n- **Gợi ý:** Sử dụng phương thức `.sort()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Danh sách đã sắp xếp.\\n")',
      testCases: [
        { input: 'data\n', expectedOutput: 'Danh sách đã sắp xếp.\n', isHidden: false }
      ]
    },
    {
      title: 'Lấy một Phần của Danh sách (Slicing cơ bản)',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 14: Lấy một Phần của Danh sách (Slicing cơ bản)**\n\n- **Mô tả bài toán:** Cho `alphabet = ["a", "b", "c", "d", "e", "f"]`. Trích xuất và in danh sách con từ chỉ số 1 đến chỉ số 4 (không bao gồm).\n- **Input:** `alphabet`\n- **Output:** Danh sách con.\n- **Ví dụ kiểm thử:** `[\'b\', \'c\', \'d\', \'e\']`\n- **Gợi ý:** Nhớ cú pháp `[start:end]`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Danh sách con.\\n")',
      testCases: [
        { input: 'alphabet\n', expectedOutput: 'Danh sách con.\n', isHidden: false }
      ]
    },
    {
      title: 'Tạo danh sách từ Dữ liệu người dùng nhập',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 15: Tạo danh sách từ Dữ liệu người dùng nhập**\n\n- **Mô tả bài toán:** Nhập 3 số nguyên từ người dùng. Tạo danh sách từ 3 số đó. In danh sách.\n- **Input:** 3 số nguyên (ví dụ: `10`, `20`, `30`).\n- **Output:** Danh sách chứa các số đã nhập.\n- **Ví dụ kiểm thử:** `[10, 20, 30]`\n- **Gợi ý:** Dùng `input()` và `int()` cho mỗi số, sau đó tạo danh sách.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Danh sách chứa các số đã nhập.\\n")',
      testCases: [
        { input: '3 số nguyên (ví dụ: 10, 20, 30).\n', expectedOutput: 'Danh sách chứa các số đã nhập.\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm phần tử xuất hiện nhiều nhất (Mode)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '**Bài 31: Tìm phần tử xuất hiện nhiều nhất (Mode)**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tìm và in ra phần tử (hoặc các phần tử) xuất hiện nhiều nhất trong danh sách. Nếu có nhiều phần tử có cùng số lần xuất hiện nhiều nhất, in tất cả chúng.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 2, 3, 3, 3, 4]`)\n- **Output:**\n    - Danh sách các phần tử xuất hiện nhiều nhất.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 2, 3, 3, 3, 4]`\n    - Output: `[3]`\n    - Input: `[1, 2, 2, 3, 3]`\n    - Output: `[2, 3]`\n- **Gợi ý:** Dùng vòng lặp để đếm số lần xuất hiện của từng phần tử (có thể dùng phương thức `.count()` hoặc một danh sách/dictionary tạm để lưu trữ tần suất), tìm số lần xuất hiện tối đa, sau đó duyệt lại để thu thập các phần tử có tần suất đó.\n    \n    lời Giải',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách các phần tử xuất hiện nhiều nhất.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 2, 3, 3, 3, 4])\n', expectedOutput: '- Danh sách các phần tử xuất hiện nhiều nhất.\n', isHidden: false }
      ]
    },
    {
      title: 'Xóa các phần tử trùng lặp và giữ thứ tự (Unique and Ordered)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '**Bài 32: Xóa các phần tử trùng lặp và giữ thứ tự (Unique and Ordered)**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tạo và in ra một danh sách mới chỉ chứa các phần tử duy nhất (không trùng lặp) từ danh sách gốc, đồng thời giữ nguyên thứ tự xuất hiện lần đầu của chúng.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 2, 3, 1, 4]`)\n- **Output:**\n    - Danh sách mới chỉ chứa các phần tử duy nhất theo thứ tự.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 2, 3, 1, 4]`\n    - Output: `[1, 2, 3, 4]`\n- **Gợi ý:** Duyệt qua danh sách gốc. Với mỗi phần tử, kiểm tra xem nó đã có trong danh sách kết quả mới chưa trước khi thêm vào.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách mới chỉ chứa các phần tử duy nhất theo thứ tự.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 2, 3, 1, 4])\n', expectedOutput: '- Danh sách mới chỉ chứa các phần tử duy nhất theo thứ tự.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra và sửa lỗi Danh sách đã sắp xếp (Gần đúng)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '**Bài 33: Kiểm tra và sửa lỗi Danh sách đã sắp xếp (Gần đúng)**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên. Kiểm tra xem danh sách đó có phải là danh sách đã được sắp xếp tăng dần hay không. Nếu không, in ra vị trí của phần tử đầu tiên làm cho danh sách không còn được sắp xếp (ví dụ: `[1, 5, 3, 8]` thì `3` ở vị trí 2 là lỗi).\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 3, 5, 2, 8]`)\n- **Output:**\n    - `True` nếu đã sắp xếp, hoặc "Lỗi tại vị trí: [chỉ số lỗi]" nếu không.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 3, 4, 5]`\n    - Output: `True`\n    - Input: `[1, 3, 5, 2, 8]`\n    - Output: `Lỗi tại vị trí: 3` (số 2 làm hỏng thứ tự tăng dần)\n- **Gợi ý:** Duyệt danh sách từ phần tử thứ hai. So sánh mỗi phần tử với phần tử đứng ngay trước nó. Nếu tìm thấy một cặp `list[i] < list[i-1]`, thì đó là vị trí lỗi và bạn có thể dừng.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- True nếu đã sắp xếp, hoặc \\"Lỗi tại vị trí: [chỉ số lỗi]\\" nếu không.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 3, 5, 2, 8])\n', expectedOutput: '- True nếu đã sắp xếp, hoặc "Lỗi tại vị trí: [chỉ số lỗi]" nếu không.\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm cặp số có tổng bằng K',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '**Bài 34: Tìm cặp số có tổng bằng K**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên và một số nguyên `K`. Tìm và in ra tất cả các cặp số trong danh sách có tổng bằng `K`. Mỗi cặp chỉ được in một lần và thứ tự các số trong cặp không quan trọng.l\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 5, 2, 8, 3]`)\n    - Số `K` (ví dụ: `10`)\n- **Output:**\n    - Các cặp số (ví dụ: `(2, 8)`, `(1, 9)` nếu có, hoặc `Không tìm thấy cặp nào` nếu không có).\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 5, 2, 8, 3]`, `10`\n    - Output: `(2, 8)`\n    - Input: `[4, 2, 6, 7]`, `10`\n    - Output: `(4, 6)`\n    - Input: `[1, 2, 3]`, `10`\n    - Output: `Không tìm thấy cặp nào`\n- **Gợi ý:** Sử dụng vòng lặp lồng nhau để duyệt qua tất cả các cặp số có thể. Cẩn thận tránh in trùng lặp (ví dụ: `(2, 8)` và `(8, 2)`).',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Các cặp số (ví dụ: (2, 8), (1, 9) nếu có, hoặc Không tìm thấy cặp nào nếu không có).\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 5, 2, 8, 3])\n', expectedOutput: '- Các cặp số (ví dụ: (2, 8), (1, 9) nếu có, hoặc Không tìm thấy cặp nào nếu không có).\n', isHidden: false }
      ]
    },
    {
      title: 'Xoay vòng danh sách (Rotate List)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '**Bài 35: Xoay vòng danh sách (Rotate List)**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên và một số nguyên `k`. Xoay danh sách sang phải `k` bước. Nghĩa là, các phần tử ở cuối danh sách sẽ di chuyển về phía trước.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5]`)\n    - Số bước xoay `k` (ví dụ: `2`)\n- **Output:**\n    - Danh sách sau khi xoay.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 3, 4, 5]`, `2`\n    - Output: `[4, 5, 1, 2, 3]`\n    - Input: `[1, 2, 3]`, `1`\n    - Output: `[3, 1, 2]`\n- **Gợi ý:** Bạn có thể tính toán `k` hiệu quả bằng `k = k % len(danh_sach)` để xử lý `k` lớn hơn độ dài danh sách. Sau đó, chia danh sách thành hai phần (phần cuối cần xoay lên đầu và phần đầu còn lại) và nối chúng lại. Hoặc dùng vòng lặp để thực hiện từng bước xoay nhỏ (di chuyển phần tử cuối lên đầu).\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách sau khi xoay.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 3, 4, 5])\n', expectedOutput: '- Danh sách sau khi xoay.\n', isHidden: false }
      ]
    },
    {
      title: 'Đếm số lần xuất hiện của một phần tử',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 16: Đếm số lần xuất hiện của một phần tử**\n\n- **Mô tả bài toán:** Cho một danh sách số nguyên và một số nguyên cần tìm. Đếm xem số đó xuất hiện bao nhiêu lần trong danh sách.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 2, 3, 2, 4]`)\n    - Số nguyên cần tìm (ví dụ: `2`)\n- **Output:**\n    - Số lần xuất hiện.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 2, 3, 2, 4]`, `2`\n    - Output: `3`\n- **Gợi ý:** Dùng vòng lặp `for` để duyệt từng phần tử và dùng `if` để kiểm tra.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Số lần xuất hiện.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 2, 3, 2, 4])\n', expectedOutput: '- Số lần xuất hiện.\n', isHidden: false }
      ]
    },
    {
      title: 'Tạo danh sách số chẵn/lẻ từ danh sách khác',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 17: Tạo danh sách số chẵn/lẻ từ danh sách khác**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tạo ra hai danh sách mới: một danh sách chỉ chứa các số chẵn, và một danh sách chỉ chứa các số lẻ.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5, 6]`)\n- **Output:**\n    - Hai danh sách riêng biệt (danh sách số chẵn, danh sách số lẻ).\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 3, 4, 5, 6]`\n    - Output: `Chẵn: [2, 4, 6]`, `Lẻ: [1, 3, 5]`\n- **Gợi ý:** Dùng vòng lặp `for` để duyệt, toán tử `%` để kiểm tra chẵn/lẻ, và phương thức `append()` để thêm vào danh sách mới.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Hai danh sách riêng biệt (danh sách số chẵn, danh sách số lẻ).\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 3, 4, 5, 6])\n', expectedOutput: '- Hai danh sách riêng biệt (danh sách số chẵn, danh sách số lẻ).\n', isHidden: false }
      ]
    },
    {
      title: 'Xóa tất cả các lần xuất hiện của một phần tử',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 18: Xóa tất cả các lần xuất hiện của một phần tử**\n\n- **Mô tả bài toán:** Cho một danh sách số nguyên và một số nguyên cần xóa. Xóa **tất cả** các lần số đó xuất hiện trong danh sách.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 2, 3, 2, 4]`)\n    - Số nguyên cần xóa (ví dụ: `2`)\n- **Output:**\n    - Danh sách sau khi đã xóa các phần tử.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 2, 3, 2, 4]`, `2`\n    - Output: `[1, 3, 4]`\n- **Gợi ý:** Tạo một danh sách mới và chỉ thêm vào đó những phần tử không bị xóa.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách sau khi đã xóa các phần tử.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 2, 3, 2, 4])\n', expectedOutput: '- Danh sách sau khi đã xóa các phần tử.\n', isHidden: false }
      ]
    },
    {
      title: 'Đảo ngược thứ tự danh sách (không dùng slicing [-1])',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 19: Đảo ngược thứ tự danh sách (không dùng slicing `[::-1]`)**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên. Đảo ngược thứ tự các phần tử trong danh sách đó mà không dùng cú pháp cắt lát (slicing) `[::-1]`.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5]`)\n- **Output:**\n    - Danh sách đã đảo ngược.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 3, 4, 5]`\n    - Output: `[5, 4, 3, 2, 1]`\n- **Gợi ý:** Dùng vòng lặp `for` để duyệt từ cuối danh sách gốc và thêm vào một danh sách mới, hoặc sử dụng phương thức `.reverse()` nếu đã học.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách đã đảo ngược.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 3, 4, 5])\n', expectedOutput: '- Danh sách đã đảo ngược.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra danh sách có chứa phần tử trùng lặp không',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 20: Kiểm tra danh sách có chứa phần tử trùng lặp không**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên. Kiểm tra xem danh sách đó có bất kỳ phần tử nào bị trùng lặp hay không.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 2]`)\n- **Output:**\n    - `True` nếu có trùng lặp, `False` nếu không.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 3, 2]`\n    - Output: `True`\n    - Input: `[1, 2, 3]`\n    - Output: `False`\n- **Gợi ý:** Dùng vòng lặp lồng nhau để so sánh từng cặp phần tử, hoặc dùng một danh sách phụ để lưu các phần tử đã thấy.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- True nếu có trùng lặp, False nếu không.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 3, 2])\n', expectedOutput: '- True nếu có trùng lặp, False nếu không.\n', isHidden: false }
      ]
    },
    {
      title: 'Nối hai danh sách',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 21: Nối hai danh sách**\n\n- **Mô tả bài toán:** Cho hai danh sách các số nguyên. Nối chúng lại thành một danh sách duy nhất.\n- **Input:**\n    - Danh sách 1 (ví dụ: `[1, 2]`)\n    - Danh sách 2 (ví dụ: `[3, 4]`)\n- **Output:**\n    - Danh sách đã nối.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2]`, `[3, 4]`\n    - Output: `[1, 2, 3, 4]`\n- **Gợi ý:** Sử dụng toán tử `+` để nối danh sách hoặc phương thức `.extend()`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách đã nối.\\n")',
      testCases: [
        { input: '- Danh sách 1 (ví dụ: [1, 2])\n', expectedOutput: '- Danh sách đã nối.\n', isHidden: false }
      ]
    },
    {
      title: 'Lọc các số dương từ danh sách',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 22: Lọc các số dương từ danh sách**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên (có thể có số âm, số dương và số 0). Tạo một danh sách mới chỉ chứa các số dương.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[-1, 5, -3, 8, 0]`)\n- **Output:**\n    - Danh sách các số dương.\n- **Ví dụ kiểm thử:**\n    - Input: `[-1, 5, -3, 8, 0]`\n    - Output: `[5, 8]`\n- **Gợi ý:** Dùng vòng lặp `for` và điều kiện `if` để kiểm tra từng số.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách các số dương.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [-1, 5, -3, 8, 0])\n', expectedOutput: '- Danh sách các số dương.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính trung bình cộng của các số trong danh sách',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 23: Tính trung bình cộng của các số trong danh sách**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên hoặc số thực. Tính trung bình cộng của các số đó. (Giả sử danh sách không rỗng).\n- **Input:**\n    - Danh sách số (ví dụ: `[10, 20, 30]`)\n- **Output:**\n    - Trung bình cộng (số thực).\n- **Ví dụ kiểm thử:**\n    - Input: `[10, 20, 30]`\n    - Output: `20.0`\n- **Gợi ý:** Sử dụng hàm `sum()` để tính tổng và hàm `len()` để lấy số lượng phần tử.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Trung bình cộng (số thực).\\n")',
      testCases: [
        { input: '- Danh sách số (ví dụ: [10, 20, 30])\n', expectedOutput: '- Trung bình cộng (số thực).\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm vị trí (chỉ số) của một phần tử',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 24: Tìm vị trí (chỉ số) của một phần tử**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên và một số nguyên cần tìm. Tìm chỉ số của lần xuất hiện **Thứ 2** của số đó trong danh sách. Nếu số đó không có trong danh sách, in ra thông báo "Không tìm thấy".\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[10, 20, 30, 20]`)\n    - Số nguyên cần tìm (ví dụ: `20`)\n- **Output:**\n    - 3\n- **Ví dụ kiểm thử:**\n    - Input: `[10, 20, 30, 20]`, `20`\n    - Output: 3\n    - Input: `[10, 20, 30]`, `40`\n    - Output: `Không tìm thấy`\n- **Gợi ý:** Duyệt danh sách bằng chỉ số (`range(len())`), dùng `if` để kiểm tra.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- 3\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [10, 20, 30, 20])\n', expectedOutput: '- 3\n', isHidden: false }
      ]
    },
    {
      title: 'Lấy N phần tử đầu tiên',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 25: Lấy N phần tử đầu tiên**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên và một số nguyên `N`. Tạo và in một danh sách mới chứa `N` phần tử đầu tiên của danh sách gốc.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5]`)\n    - Số `N` (ví dụ: `3`)\n- **Output:**\n    - Danh sách con chứa `N` phần tử đầu tiên.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 3, 4, 5]`, `3`\n    - Output: `[1, 2, 3]`\n- **Gợi ý:** Sử dụng slicing `[start:end]`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách con chứa N phần tử đầu tiên.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 3, 4, 5])\n', expectedOutput: '- Danh sách con chứa N phần tử đầu tiên.\n', isHidden: false }
      ]
    },
    {
      title: 'Xóa các phần tử tại các chỉ số cụ thể',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 26: Xóa các phần tử tại các chỉ số cụ thể**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên và một danh sách các chỉ số cần xóa. Xóa các phần tử tại những chỉ số đó từ danh sách gốc.\n- **Input:**\n    - Danh sách gốc (ví dụ: `[10, 20, 30, 40, 50]`)\n    - Danh sách chỉ số cần xóa (ví dụ: `[1, 3]`)\n- **Output:**\n    - Danh sách sau khi xóa.\n- **Ví dụ kiểm thử 1:**\n\n- Input: `[10, 20, 30, 40, 50]`, `[1, 3]`\n- Output: `[10, 30, 50]`\n- **Gợi ý:** Khi xóa nhiều phần tử theo chỉ số, nên tạo danh sách mới hoặc xóa các phần tử từ chỉ số lớn nhất trở xuống để tránh lỗi.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách sau khi xóa.\\n")',
      testCases: [
        { input: '- Danh sách gốc (ví dụ: [10, 20, 30, 40, 50])\n', expectedOutput: '- Danh sách sau khi xóa.\n', isHidden: false }
      ]
    },
    {
      title: 'Nhân đôi các phần tử trong danh sách (tạo danh sách mới)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 27: Nhân đôi các phần tử trong danh sách (tạo danh sách mới)**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tạo một danh sách mới trong đó mỗi số của danh sách gốc được lặp lại hai lần.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 3]`)\n- **Output:**\n    - Danh sách mới với các phần tử được lặp lại.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 3]`\n    - Output: `[1, 1, 2, 2, 3, 3]`\n- **Gợi ý:** Duyệt danh sách gốc và dùng `append()` hai lần cho mỗi phần tử vào danh sách mới.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Danh sách mới với các phần tử được lặp lại.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 3])\n', expectedOutput: '- Danh sách mới với các phần tử được lặp lại.\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra danh sách rỗng',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 28: Kiểm tra danh sách rỗng**\n\n- **Mô tả bài toán:** Cho một danh sách bất kỳ. Kiểm tra xem danh sách đó có rỗng (không có phần tử nào) hay không.\n- **Input:**\n    - Danh sách (ví dụ: `[]` hoặc `[1, 2]`)\n- **Output:**\n    - `True` nếu rỗng, `False` nếu không rỗng.\n- **Ví dụ kiểm thử:**\n    - Input: `[]`\n    - Output: `True`\n    - Input: `[1, 2]`\n    - Output: `False`\n- **Gợi ý:** Sử dụng hàm `len()` hoặc kiểm tra trực tiếp danh sách trong điều kiện `if`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- True nếu rỗng, False nếu không rỗng.\\n")',
      testCases: [
        { input: '- Danh sách (ví dụ: [] hoặc [1, 2])\n', expectedOutput: '- True nếu rỗng, False nếu không rỗng.\n', isHidden: false }
      ]
    },
    {
      title: 'Tính tổng các phần tử chẵn/lẻ trong danh sách',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 29: Tính tổng các phần tử chẵn/lẻ trong danh sách**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tính riêng tổng của tất cả các số chẵn và tổng của tất cả các số lẻ trong danh sách đó.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5]`)\n- **Output:**\n    - Tổng số chẵn, tổng số lẻ.\n- **Ví dụ kiểm thử:**\n    - Input: `[1, 2, 3, 4, 5]`\n    - Output: `Tổng chẵn: 6`, `Tổng lẻ: 9`\n- **Gợi ý:** Khởi tạo hai biến tổng riêng biệt cho chẵn và lẻ. Dùng vòng lặp `for` và `if` để phân loại.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Tổng số chẵn, tổng số lẻ.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [1, 2, 3, 4, 5])\n', expectedOutput: '- Tổng số chẵn, tổng số lẻ.\n', isHidden: false }
      ]
    },
    {
      title: 'Đếm các số lớn hơn một ngưỡng cho trước',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 30: Đếm các số lớn hơn một ngưỡng cho trước**\n\n- **Mô tả bài toán:** Cho một danh sách các số nguyên và một ngưỡng số `X`. Đếm xem có bao nhiêu số trong danh sách lớn hơn `X`.\n- **Input:**\n    - Danh sách số nguyên (ví dụ: `[10, 20, 5, 30, 15]`)\n    - Ngưỡng `X` (ví dụ: `15`)\n- **Output:**\n    - Số lượng số lớn hơn ngưỡng.\n- **Ví dụ kiểm thử:**\n    - Input: `[10, 20, 5, 30, 15]`, `15`\n    - Output: `2` (là 20 và 30)\n- **Gợi ý:** Dùng một biến đếm, lặp qua danh sách và dùng `if` để kiểm tra điều kiện.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Số lượng số lớn hơn ngưỡng.\\n")',
      testCases: [
        { input: '- Danh sách số nguyên (ví dụ: [10, 20, 5, 30, 15])\n', expectedOutput: '- Số lượng số lớn hơn ngưỡng.\n', isHidden: false }
      ]
    }
  ],
  'LS-06.MP': [
    {
      title: 'Tạo Dictionary và truy cập giá trị',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 1: Tạo Dictionary và truy cập giá trị**\n\n- **Mô tả:** Tạo một dictionary lưu trữ thông tin của một người với các key `"ten"`, `"tuoi"`, `"thanh_pho"`. Sau đó, in ra tên và thành phố của người đó.\n- **Input:** Không có (tạo dictionary cố định trong code).\n- **Output:**\n    \n    `Tên: [Tên người]\n    Thành phố: [Thành phố]`\n    \n- **Ví dụ:**\n    \n    **Python**\n    \n    `# Input (trong code):\n    # thong_tin_nguoi = {"ten": "An", "tuoi": 25, "thanh_pho": "Hà Nội"}\n    \n    # Output:\n    # Tên: An\n    # Thành phố: Hà Nội`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Tên: [Tên người]\\n")',
      testCases: [
        { input: 'Không có (tạo dictionary cố định trong code).\n', expectedOutput: 'Tên: [Tên người]\n', isHidden: false }
      ]
    },
    {
      title: 'Thêm cặp key-value mới',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 2: Thêm cặp key-value mới**\n\n- **Mô tả:** Cho một dictionary `sinh_vien = {"ma_sv": "SV001", "ten": "Bình"}`. Thêm key `"lop"` với giá trị `"K21"` và key `"diem_tb"` với giá trị `8.8` vào dictionary này. Sau đó in toàn bộ dictionary.\n- **Input:** Không có.\n- **Output:**\n    \n    `{\'ma_sv\': \'SV001\', \'ten\': \'Bình\', \'lop\': \'K21\', \'diem_tb\': 8.8}`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("{\'ma_sv\': \'SV001\', \'ten\': \'Bình\', \'lop\': \'K21\', \'diem_tb\': 8.8}\\n")',
      testCases: [
        { input: 'Không có.\n', expectedOutput: '{\'ma_sv\': \'SV001\', \'ten\': \'Bình\', \'lop\': \'K21\', \'diem_tb\': 8.8}\n', isHidden: false }
      ]
    },
    {
      title: 'Sửa đổi giá trị',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 3: Sửa đổi giá trị**\n\n- **Mô tả:** Cho dictionary `san_pham = {"ten": "Laptop", "gia": 15000000, "so_luong": 5}`. Cập nhật `gia` thành `14500000` và `so_luong` thành `7`. Sau đó in toàn bộ dictionary.\n- **Input:** Không có.\n- **Output:**\n    \n    `{\'ten\': \'Laptop\', \'gia\': 14500000, \'so_luong\': 7}`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("{\'ten\': \'Laptop\', \'gia\': 14500000, \'so_luong\': 7}\\n")',
      testCases: [
        { input: 'Không có.\n', expectedOutput: '{\'ten\': \'Laptop\', \'gia\': 14500000, \'so_luong\': 7}\n', isHidden: false }
      ]
    },
    {
      title: 'Xóa cặp key-value',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 4: Xóa cặp key-value**\n\n- **Mô tả:** Cho dictionary `cau_hinh = {"CPU": "i7", "RAM": "16GB", "SSD": "512GB", "VGA": "RTX 3060"}`. Xóa key `"VGA"`. Sau đó in toàn bộ dictionary.\n- **Input:** Không có.\n- **Output:**\n    \n    `{\'CPU\': \'i7\', \'RAM\': \'16GB\', \'SSD\': \'512GB\'}`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("{\'CPU\': \'i7\', \'RAM\': \'16GB\', \'SSD\': \'512GB\'}\\n")',
      testCases: [
        { input: 'Không có.\n', expectedOutput: '{\'CPU\': \'i7\', \'RAM\': \'16GB\', \'SSD\': \'512GB\'}\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra sự tồn tại của key',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 5: Kiểm tra sự tồn tại của key**\n\n- **Mô tả:** Cho dictionary `thoi_tiet = {"Ha Noi": "Mưa", "Sai Gon": "Nắng"}`. Kiểm tra xem key `"Da Nang"` có trong dictionary không. In ra thông báo thích hợp.\n- **Input:** Không có.\n- **Output:**\n    \n    `Có thông tin thời tiết của Da Nang. (hoặc) Không có thông tin thời tiết của Da Nang.`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Có thông tin thời tiết của Da Nang. (hoặc) Không có thông tin thời tiết của Da Nang.\\n")',
      testCases: [
        { input: 'Không có.\n', expectedOutput: 'Có thông tin thời tiết của Da Nang. (hoặc) Không có thông tin thời tiết của Da Nang.\n', isHidden: false }
      ]
    },
    {
      title: 'Lặp qua các key',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 6: Lặp qua các key**\n\n- **Mô tả:** Cho dictionary `khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}` (tên khóa học: số lượng học viên). In ra tất cả các tên khóa học (chỉ key).\n- **Input:** Không có.\n- **Output:**\n    \n    `Python\n    Java\n    C++`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Python\\n")',
      testCases: [
        { input: 'Không có.\n', expectedOutput: 'Python\n', isHidden: false }
      ]
    },
    {
      title: 'Lặp qua các value',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 7: Lặp qua các value**\n\n- **Mô tả:** Cho dictionary `khoa_hoc` như bài 6. In ra tất cả số lượng học viên (chỉ value).\n- **Input:** Không có.\n- **Output:**\n    \n    `10\n    8\n    7`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("10\\n")',
      testCases: [
        { input: 'Không có.\n', expectedOutput: '10\n', isHidden: false }
      ]
    },
    {
      title: 'Lặp qua cả key và value',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 8: Lặp qua cả key và value**\n\n- **Mô tả:** Cho dictionary `khoa_hoc` như bài 6. In ra từng cặp "Tên khóa học: Số lượng học viên".\n- **Input:** Không có.\n- **Output:**\n    \n    `Python: 10\n    Java: 8\n    C++: 7`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Python: 10\\n")',
      testCases: [
        { input: 'Không có.\n', expectedOutput: 'Python: 10\n', isHidden: false }
      ]
    },
    {
      title: 'Sử dụng .get() với giá trị mặc định',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 9: Sử dụng `.get()` với giá trị mặc định**\n\n- **Mô tả:** Cho dictionary `diem_thi = {"Toan": 9, "Ly": 8}`. Lấy điểm môn "Hoa". Nếu môn "Hoa" không có, trả về `0`. In ra điểm môn "Hoa".\n- **Input:** Không có.\n- **Output:**\n    \n    `Điểm môn Hoa: 0`\n    \n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Điểm môn Hoa: 0\\n")',
      testCases: [
        { input: 'Không có.\n', expectedOutput: 'Điểm môn Hoa: 0\n', isHidden: false }
      ]
    },
    {
      title: 'Kích thước của Dictionary',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '**Bài 10: Kích thước của Dictionary**\n\n- **Mô tả:** Cho dictionary `danh_ba = {"An": "0912345678", "Binh": "0987654321", "Cuong": "0909090909"}`. In ra tổng số liên lạc trong danh bạ.\n- **Input:** Không có.\n- **Output:**\n    \n    `Tổng số liên lạc: 3`',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("Tổng số liên lạc: 3\\n")',
      testCases: [
        { input: 'Không có.\n', expectedOutput: 'Tổng số liên lạc: 3\n', isHidden: false }
      ]
    },
    {
      title: 'Phân tích phần tử trùng và độc nhất giữa 2 danh sách khách hàng',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 1: Phân tích phần tử trùng và độc nhất giữa 2 danh sách khách hàng**\n\n- **Mô tả:** Cho hai danh sách email đăng ký sự kiện của hai ngày khác nhau: `ngay1` và `ngay2`.\n- **Yêu cầu:** Hãy viết chương trình sử dụng **Set** để:\n    1. Tìm danh sách tất cả các email đã đăng ký tham gia (không trùng lặp).\n    2. Tìm danh sách các email tham gia cả hai ngày.\n    3. Tìm danh sách các email chỉ tham gia ngày thứ nhất mà không tham gia ngày thứ hai.\n    4. Tìm danh sách các email chỉ tham gia duy nhất một trong hai ngày.\n- **Thiết lập ban đầu:**\n    \n    `ngay1 = ["an@gmail.com", "binh@gmail.com", "cuong@gmail.com"]\n    ngay2 = ["binh@gmail.com", "duong@gmail.com", "an@gmail.com"]`\n    \n- **Ví dụ kiểm thử:**\n    - **Dữ liệu trên:**\n        - Tất cả email: `{\'an@gmail.com\', \'binh@gmail.com\', \'cuong@gmail.com\', \'duong@gmail.com\'}`\n        - Cả hai ngày: `{\'an@gmail.com\', \'binh@gmail.com\'}`\n        - Chỉ ngày 1: `{\'cuong@gmail.com\'}`\n        - Chỉ duy nhất 1 ngày: `{\'cuong@gmail.com\', \'duong@gmail.com\'}`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Dữ liệu trên:\\n")',
      testCases: [
        { input: '["an@gmail.com"\n', expectedOutput: '- Dữ liệu trên:\n', isHidden: false }
      ]
    },
    {
      title: 'Hệ thống quản lý Hashtags bài viết',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 2: Hệ thống quản lý Hashtags bài viết**\n\n- **Mô tả:** Cho một dictionary lưu các bài viết và danh sách hashtag tương ứng: `bai_viet = {"id1": {"python", "code"}, "id2": {"code", "web", "learn"}, "id3": {"python", "data"}}`. Cho một danh sách tag tìm kiếm `tieu_chi = {"python", "code"}`.\n- **Yêu cầu:** Hãy tìm ra tất cả ID bài viết thỏa mãn **chứa toàn bộ** các thẻ tag trong `tieu_chi`.\n- **Thiết lập ban đầu:**\n    \n    `bai_viet = {\n        "id1": {"python", "code", "dev"},\n        "id2": {"code", "web", "learn"},\n        "id3": {"python", "data", "code"}\n    }\n    tieu_chi = {"python", "code"}`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `bai_viet`, `tieu_chi` ở trên.\n    - **Output:** `[\'id1\', \'id3\']` (vì cả hai bài này đề chứa tag "python" và "code").\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: bai_viet, tieu_chi ở trên.\\n")',
      testCases: [
        { input: '{\n', expectedOutput: '- Input: bai_viet, tieu_chi ở trên.\n', isHidden: false }
      ]
    },
    {
      title: 'Loại bỏ từ trùng và hiển thị sắp xếp',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 3: Loại bỏ từ trùng và hiển thị sắp xếp**\n\n- **Mô tả:** Nhập vào một dòng văn bản chứa các từ phân cách bằng dấu cách.\n- **Yêu cầu:** In ra tất cả các từ duy nhất theo thứ tự chữ cái, cách nhau bằng dấu phẩy.\n- **Thiết lập ban đầu:**\n    \n    `van_ban = "hoc python va hoc code va hoc lap trinh"`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `"hoc python va hoc code va hoc lap trinh"`\n    - **Output:** `code, hoc, lap, python, trinh, va`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: \\"hoc python va hoc code va hoc lap trinh\\"\\n")',
      testCases: [
        { input: '"hoc\n', expectedOutput: '- Input: "hoc python va hoc code va hoc lap trinh"\n', isHidden: false }
      ]
    },
    {
      title: 'Phép toán hiệu đối xứng tùy biến',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 4: Phép toán hiệu đối xứng tùy biến**\n\n- **Mô tả:** Cho hai danh sách số nguyên `listA` và `listB`.\n- **Yêu cầu:** Hãy in ra các số nguyên xuất hiện ở `listA` hoặc `listB` nhưng **không thuộc về cả hai** (loại bỏ trùng lặp và sắp xếp tăng dần).\n- **Thiết lập ban đầu:**\n    \n    `listA = [1, 2, 3, 4, 4]\n    listB = [3, 4, 5, 6, 6]`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `listA = [1, 2, 3, 4, 4], listB = [3, 4, 5, 6, 6]`\n    - **Output:** `[1, 2, 5, 6]`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: listA = [1, 2, 3, 4, 4], listB = [3, 4, 5, 6, 6]\\n")',
      testCases: [
        { input: '[1\n', expectedOutput: '- Input: listA = [1, 2, 3, 4, 4], listB = [3, 4, 5, 6, 6]\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm mối quan hệ bạn chung (Social Network)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 5: Tìm mối quan hệ bạn chung (Social Network)**\n\n- **Mô tả:** Cho một mạng xã hội đơn giản lưu trữ danh sách bạn bè của từng người dưới dạng dictionary các sets: `friends = {"An": {"Binh", "Cuong", "Dat"}, "Binh": {"An", "Cuong", "Giang"}, "Cuong": {"An", "Binh"}}`.\n- **Yêu cầu:** Viết hàm `ban_chung(person1, person2, network)` trả về set chứa danh sách bạn chung của `person1` và `person2`.\n- **Thiết lập ban đầu:**\n    \n    `friends = {\n        "An": {"Binh", "Cuong", "Dat"},\n        "Binh": {"An", "Cuong", "Giang"},\n        "Cuong": {"An", "Binh"}\n    }`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `ban_chung("An", "Binh", friends)`\n    - **Output:** `{\'Cuong\'}`',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: ban_chung(\\"An\\", \\"Binh\\", friends)\\n")',
      testCases: [
        { input: '{\n', expectedOutput: '- Input: ban_chung("An", "Binh", friends)\n', isHidden: false }
      ]
    },
    {
      title: 'Đếm số lần xuất hiện của các từ',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 11: Đếm số lần xuất hiện của các từ**\n\n- **Mô tả:** Cho một chuỗi văn bản. Viết một hàm `dem_tu(van_ban)` nhận vào chuỗi văn bản và trả về một dictionary, trong đó key là các từ (viết thường) và value là số lần xuất hiện của từ đó. Các từ được phân tách bằng dấu cách.\n- **Input:** `van_ban` (chuỗi)\n- **Output:** `dictionary` (các từ và số lần xuất hiện của chúng)\n- **Ví dụ:**\n    \n    **Python**\n    \n    ```cpp\n    # Input:\n    # van_ban = "Python la mot ngon ngu lap trinh Python rat pho bien"\n    \n    # Expected Output (thứ tự các key có thể khác nhau):\n    # {\'python\': 2, \'la\': 1, \'mot\': 1, \'ngon\': 1, \'ngu\': 1, \'lap\': 1, \'trinh\': 1, \'rat\': 1, \'pho\': 1, \'bien\': 1}\n    ```\n    \n- **Gợi ý:** Dùng `.lower()` và `.split()` cho chuỗi. Dùng `if/else` để kiểm tra từ đã có trong dictionary chưa.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("dictionary (các từ và số lần xuất hiện của chúng)\\n")',
      testCases: [
        { input: 'van_ban (chuỗi)\n', expectedOutput: 'dictionary (các từ và số lần xuất hiện của chúng)\n', isHidden: false }
      ]
    },
    {
      title: 'Quản lý điểm học sinh',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 12: Quản lý điểm học sinh**\n\n- **Mô tả:** Viết hàm `cap_nhat_diem(diem_hoc_sinh, ten_hoc_sinh, mon_hoc, diem)` để cập nhật điểm cho học sinh.\n    - `diem_hoc_sinh` là một dictionary có cấu trúc: `{ten_hoc_sinh: {mon_hoc: diem, ...}}`.\n    - Nếu học sinh chưa có trong `diem_hoc_sinh`, thêm học sinh đó và điểm môn học.\n    - Nếu học sinh đã có, cập nhật điểm cho môn học đó.\n    - Hàm trả về dictionary đã được cập nhật.\n- **Input:**\n    - `diem_hoc_sinh`: dictionary\n    - `ten_hoc_sinh`: chuỗi\n    - `mon_hoc`: chuỗi\n    - `diem`: số\n- **Output:** `dictionary` đã cập nhật.\n- **Ví dụ:**\n    \n    **Python**\n    \n    ```cpp\n    # Initial:\n    # diem_goc = {"An": {"Toan": 8, "Van": 7}}\n    \n    # Call 1:\n    # diem_cap_nhat = cap_nhat_diem(diem_goc, "An", "Ly", 9)\n    # Expected Output (diem_cap_nhat): {"An": {"Toan": 8, "Van": 7, "Ly": 9}}\n    \n    # Call 2:\n    # diem_cap_nhat = cap_nhat_diem(diem_cap_nhat, "Binh", "Toan", 7.5)\n    # Expected Output (diem_cap_nhat): {"An": {"Toan": 8, "Van": 7, "Ly": 9}, "Binh": {"Toan": 7.5}}\n    ```\n    \n- **Gợi ý:** Sử dụng `.get()` hoặc kiểm tra `in` để xử lý các trường hợp học sinh/môn học chưa có.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("dictionary đã cập nhật.\\n")',
      testCases: [
        { input: '- diem_hoc_sinh: dictionary\n', expectedOutput: 'dictionary đã cập nhật.\n', isHidden: false }
      ]
    },
    {
      title: 'Đếm số lượng phần tử duy nhất trong danh sách',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 13: Đếm số lượng phần tử duy nhất trong danh sách**\n\n- **Mô tả:** Viết hàm `dem_phan_tu_duy_nhat(danh_sach)` nhận vào một list các phần tử. Hàm trả về một dictionary, trong đó key là phần tử duy nhất và value là số lần xuất hiện của phần tử đó trong danh sách.\n- **Input:** `danh_sach` (list)\n- **Output:** `dictionary` (phần tử: số lần xuất hiện)\n- **Ví dụ:**\n    \n    **Python**\n    \n    ```cpp\n    # Input:\n    # danh_sach_so = [1, 2, 2, 3, 1, 4, 2, 5]\n    \n    # Expected Output (thứ tự các key có thể khác nhau):\n    # {1: 2, 2: 3, 3: 1, 4: 1, 5: 1}\n    ```\n    \n- **Gợi ý:** Lặp qua list, dùng `if/else` để kiểm tra và cập nhật dictionary.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("dictionary (phần tử: số lần xuất hiện)\\n")',
      testCases: [
        { input: 'danh_sach (list)\n', expectedOutput: 'dictionary (phần tử: số lần xuất hiện)\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm giá trị lớn nhất/nhỏ nhất trong Dictionary',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 14: Tìm giá trị lớn nhất/nhỏ nhất trong Dictionary**\n\n- **Mô tả:** Viết hàm `tim_san_pham_gia_cao_nhat(danh_sach_san_pham)` nhận vào một dictionary có cấu trúc `{"ma_sp": {"ten": "...", "gia": ...}}`. Hàm trả về tên của sản phẩm có giá cao nhất. (Giả sử luôn có ít nhất một sản phẩm).\n- **Input:** `danh_sach_san_pham` (dictionary)\n- **Output:** `string` (tên sản phẩm)\n- **Ví dụ:**\n    \n    **Python**\n    \n    ```cpp\n    # Input:\n    # san_pham_kho = {\n    #     "SP001": {"ten": "Chuột", "gia": 200000},\n    #     "SP002": {"ten": "Bàn phím", "gia": 700000},\n    #     "SP003": {"ten": "Màn hình", "gia": 2500000}\n    # }\n    \n    # Expected Output:\n    # "Màn hình"\n    ```\n    \n- **Gợi ý:** Khởi tạo một biến `max_gia` và `ten_san_pham_max`. Lặp qua `.items()` hoặc `.values()` của dictionary để tìm giá trị lớn nhất và cập nhật tên sản phẩm tương ứng.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("string (tên sản phẩm)\\n")',
      testCases: [
        { input: 'danh_sach_san_pham (dictionary)\n', expectedOutput: 'string (tên sản phẩm)\n', isHidden: false }
      ]
    },
    {
      title: 'Chuyển đổi List of Dictionaries sang Dictionary',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 15: Chuyển đổi List of Dictionaries sang Dictionary**\n\n- **Mô tả:** Viết hàm `chuyen_doi_danh_sach(danh_sach_dict)` nhận vào một list các dictionary. Mỗi dictionary trong list có key `"id"` duy nhất. Hàm trả về một dictionary mới, trong đó `key` là giá trị của `"id"` và `value` là toàn bộ dictionary gốc đó.\n- **Input:** `danh_sach_dict` (list các dictionary)\n- **Output:** `dictionary` (id: dictionary gốc)\n- **Ví dụ:**\n    \n    **Python**\n    \n    ```cpp\n    # Input:\n    # users = [\n    #     {"id": 101, "name": "Alice", "age": 30},\n    #     {"id": 102, "name": "Bob", "age": 24},\n    #     {"id": 103, "name": "Charlie", "age": 35}\n    # ]\n    \n    # Expected Output:\n    # {\n    #     101: {"id": 101, "name": "Alice", "age": 30},\n    #     102: {"id": 102, "name": "Bob", "age": 24},\n    #     103: {"id": 103, "name": "Charlie", "age": 35}\n    # }\n    ```\n    \n- **Gợi ý:** Dùng vòng lặp `for` để duyệt qua từng dictionary trong list. Lấy giá trị của key `"id"` để làm key cho dictionary kết quả.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("dictionary (id: dictionary gốc)\\n")',
      testCases: [
        { input: 'danh_sach_dict (list các dictionary)\n', expectedOutput: 'dictionary (id: dictionary gốc)\n', isHidden: false }
      ]
    },
    {
      title: 'Đảo ngược dictionary (có trùng value)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '**Bài 16: Đảo ngược dictionary (có trùng value)**\n\nCho dictionary:\n\nd = {\'a\': 1, \'b\': 2, \'c\': 1}\n\nHãy đảo key ↔ value, nhưng:\n\n- Nếu trùng value → gom thành list\n\nKết quả:\n\n{1: [\'a\', \'c\'], 2: [\'b\']}',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    }
  ],
  'LS-07.MP': [
    {
      title: 'Hàm in lời chào',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 1: Hàm in lời chào**\n\n- **Yêu cầu:** Viết một hàm `xin_chao(ten)` nhận vào một tên và in ra màn hình dòng chữ "Xin chào, [ten]!".\n- **Ví dụ:** `xin_chao("Python")` in ra `Xin chào, Python!`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("xin_chao(\\"Python\\") in ra Xin chào, Python!.\\n")',
      testCases: [
        { input: '', expectedOutput: 'xin_chao("Python") in ra Xin chào, Python!.\n', isHidden: false }
      ]
    },
    {
      title: 'Hàm tính bình phương',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 2: Hàm tính bình phương**\n\n- **Yêu cầu:** Viết một hàm `binh_phuong(x)` nhận vào một số `x` và trả về ($x^2$).\n- **Ví dụ:** `binh_phuong(5)` trả về `25`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("binh_phuong(5) trả về 25.\\n")',
      testCases: [
        { input: '', expectedOutput: 'binh_phuong(5) trả về 25.\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm số lớn hơn',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 3: Tìm số lớn hơn**\n\n- **Yêu cầu:** Viết hàm `so_lon_nhat(a, b)` nhận vào hai số `a` và `b`, trả về số lớn hơn.\n- **Ví dụ:** `so_lon_nhat(12, 18)` trả về `18`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("so_lon_nhat(12, 18) trả về 18.\\n")',
      testCases: [
        { input: '', expectedOutput: 'so_lon_nhat(12, 18) trả về 18.\n', isHidden: false }
      ]
    },
    {
      title: 'Hàm tính chu vi hình chữ nhật',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 4: Hàm tính chu vi hình chữ nhật**\n\n- **Yêu cầu:** Viết hàm `chu_vi_hcn(chieu_dai, chieu_rong)` nhận vào chiều dài và chiều rộng, trả về chu vi hình chữ nhật.\n- **Ví dụ:** `chu_vi_hcn(5, 3)` trả về `16`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("chu_vi_hcn(5, 3) trả về 16.\\n")',
      testCases: [
        { input: '', expectedOutput: 'chu_vi_hcn(5, 3) trả về 16.\n', isHidden: false }
      ]
    },
    {
      title: 'Bắt lỗi chia cho 0',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 5: Bắt lỗi chia cho 0**\n\n- **Yêu cầu:** Viết khối lệnh nhập vào hai số nguyên `a` và `b` từ người dùng, thực hiện phép chia `a / b` trong khối `try-except` để bắt lỗi `ZeroDivisionError` và in ra thông báo "Không thể chia cho 0".\n- **Ví dụ:** Khi `b = 0` in ra `Không thể chia cho 0`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Khi b = 0 in ra Không thể chia cho 0.\\n")',
      testCases: [
        { input: '', expectedOutput: 'Khi b = 0 in ra Không thể chia cho 0.\n', isHidden: false }
      ]
    },
    {
      title: 'Bắt lỗi ép kiểu dữ liệu',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 6: Bắt lỗi ép kiểu dữ liệu**\n\n- **Yêu cầu:** Nhập vào giá trị `x` từ bàn phím và sử dụng `try-except` để ép kiểu sang số nguyên `int()`. Nếu gặp lỗi `ValueError`, in ra "Đầu vào không phải là số hợp lệ".\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Sử dụng module math để tính căn bậc hai',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 7: Sử dụng module `math` để tính căn bậc hai**\n\n- **Yêu cầu:** Khai báo một số, sử dụng hàm `sqrt` từ module `math` để tính căn bậc hai và in kết quả.\n- **Ví dụ:** Với số `16` in ra `4.0`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Với số 16 in ra 4.0.\\n")',
      testCases: [
        { input: '', expectedOutput: 'Với số 16 in ra 4.0.\n', isHidden: false }
      ]
    },
    {
      title: 'Sử dụng module random sinh số ngẫu nhiên',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 8: Sử dụng module `random` sinh số ngẫu nhiên**\n\n- **Yêu cầu:** Import module `random` và viết chương trình in ra một số nguyên ngẫu nhiên từ 1 đến 10.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Hàm kiểm tra số chẵn',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 9: Hàm kiểm tra số chẵn**\n\n- **Yêu cầu:** Viết hàm `la_so_chan(n)` trả về `True` nếu n là số chẵn, ngược lại trả về `False`.\n- **Ví dụ:** `la_so_chan(10)` trả về `True`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("la_so_chan(10) trả về True.\\n")',
      testCases: [
        { input: '', expectedOutput: 'la_so_chan(10) trả về True.\n', isHidden: false }
      ]
    },
    {
      title: 'Hàm tính tổng một danh sách',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 10: Hàm tính tổng một danh sách**\n\n- **Yêu cầu:** Viết hàm `tinh_tong_danh_sach(lst)` nhận vào một danh sách số nguyên và trả về tổng các phần tử đó.\n- **Ví dụ:** `tinh_tong_danh_sach([1, 2, 3, 4])` trả về `10`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("tinh_tong_danh_sach([1, 2, 3, 4]) trả về 10.\\n")',
      testCases: [
        { input: '', expectedOutput: 'tinh_tong_danh_sach([1, 2, 3, 4]) trả về 10.\n', isHidden: false }
      ]
    },
    {
      title: 'Thuật toán Tìm kiếm Nhị phân (Binary Search)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 1: Thuật toán Tìm kiếm Nhị phân (Binary Search)**\n\n- **Mô tả:** Cho một danh sách số nguyên đã được sắp xếp tăng dần và một số nguyên `x`.\n- **Yêu cầu:** Viết hàm đệ quy `BinarySearch(lst, x, low, high)` trả về chỉ số của `x` trong danh sách `lst`. Nếu không tìm thấy, trả về `-1`.\n- **Thiết lập ban đầu:**\n    \n    `arr = [2, 3, 4, 10, 40]\n    target = 10`\n    \n- **Ví dụ kiểm thử:**\n    - **Input:** `BinarySearch(arr, 10, 0, len(arr)-1)` **Output:** `3`\n    - **Input:** `BinarySearch(arr, 5, 0, len(arr)-1)` **Output:** `-1`\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: BinarySearch(arr, 10, 0, len(arr)-1) Output: 3\\n")',
      testCases: [
        { input: '[2\n', expectedOutput: '- Input: BinarySearch(arr, 10, 0, len(arr)-1) Output: 3\n', isHidden: false }
      ]
    },
    {
      title: 'Custom Exception - Lỗi số âm',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 2: Custom Exception - Lỗi số âm**\n\n- **Mô tả:** Lập trình viên cần kiểm soát việc nhập tuổi của học viên. Tuổi không được phép là số âm.\n- **Yêu cầu:**\n    1. Tạo một lớp ngoại lệ tự định nghĩa có tên `SoAmError` kế thừa từ `Exception`.\n    2. Viết kiểm tra điều kiện trong hàm `nhap_tuoi(tuoi)`. Nếu `tuoi < 0`, ném ra lỗi `SoAmError` bằng từ khóa `raise`.\n    3. Trong khối code chính, gọi hàm `nhap_tuoi` với giá trị kiểm tra và dùng `try-except` để bắt `SoAmError`, in ra thông báo tương ứng.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Giao dịch rút tiền ATM an toàn',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 3: Giao dịch rút tiền ATM an toàn**\n\n- **Mô tả:** Cho số dư ban đầu `so_du = 10000000` (10 triệu) và hạn mức rút tối đa mỗi lần là `5000000` (5 triệu).\n- **Yêu cầu:** Viết hàm `rut_tien(so_tien)` thực thi việc rút tiền.\n    - Ném ra `ValueError` nếu số tiền gửi yêu cầu không phải là bội số của `50000` hoặc nhỏ hơn `50000`.\n    - Ném ra một custom exception `SoDuKhongDuError` nếu số tiền rút lớn hơn số dư hiện hữu.\n    - Ném ra custom exception `VuotHanMucError` nếu số tiền rút vượt quá hạn mức tối đa mỗi lần.\n    - Bắt toàn bộ lỗi và in ra các thông điệp thích hợp giúp chương trình không bị tắt.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Tự thiết kế thư viện toán học riêng và nạp',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 4: Tự thiết kế thư viện toán học riêng và nạp**\n\n- **Mô tả:** Yêu cầu tổ chức mã nguồn thành cấu trúc thư mục gồm 2 file:\n    - File thứ nhất `my_math.py`: chứa hàm `tinh_ucln(a, b)` (ước chung lớn nhất) và `tinh_bcnn(a, b)` (bội chung nhỏ nhất).\n    - File thứ hai `main.py`: import 2 hàm từ file `my_math.py` để tính toán và in kết quả.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Khử trùng lặp chuỗi dùng đệ quy',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 5: Khử trùng lặp chuỗi dùng đệ quy**\n\n- **Mô tả:** Cho một chuỗi ký tự bất kỳ.\n- **Yêu cầu:** Viết một hàm đệ quy `loai_bo_trung_lap_ke_tiep(s)` loại bỏ các ký tự trùng nhau đứng cạnh nhau trong chuỗi (ví dụ: `"abbaca"` -> `"abaca"` -> `"aca"`).\n- **Ví dụ kiểm thử:**\n    - **Input:** `"abbaca"` **Output:** `"ca"` (sau khi loại bỏ "bb" còn "aaca", loại bỏ "aa" còn "ca").',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'val_0 = input()\nprint("- Input: \\"abbaca\\" Output: \\"ca\\" (sau khi loại bỏ \\"bb\\" còn \\"aaca\\", loại bỏ \\"aa\\" còn \\"ca\\").\\n")',
      testCases: [
        { input: '"abbaca" Output: "ca" (sau khi loại bỏ "bb" còn "aaca", loại bỏ "aa" còn "ca").\n', expectedOutput: '- Input: "abbaca" Output: "ca" (sau khi loại bỏ "bb" còn "aaca", loại bỏ "aa" còn "ca").\n', isHidden: false }
      ]
    },
    {
      title: 'Hàm kiểm tra số nguyên tố',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 1: Hàm kiểm tra số nguyên tố**\n\n- **Yêu cầu:** Viết hàm `la_so_nguyen_to(n)` trả về `True` nếu n là số nguyên tố, ngược lại trả về `False`.\n- **Ví dụ:** `la_so_nguyen_to(7)` -> `True`, `la_so_nguyen_to(4)` -> `False`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("la_so_nguyen_to(7) -> True, la_so_nguyen_to(4) -> False.\\n")',
      testCases: [
        { input: '', expectedOutput: 'la_so_nguyen_to(7) -> True, la_so_nguyen_to(4) -> False.\n', isHidden: false }
      ]
    },
    {
      title: 'Hàm tính giai thừa',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 2: Hàm tính giai thừa**\n\n- **Yêu cầu:** Viết hàm `giai_thua(n)` tính giai thừa của một số nguyên không âm $n$.\n- **Ví dụ:** `giai_thua(5)` trả về `120`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("giai_thua(5) trả về 120.\\n")',
      testCases: [
        { input: '', expectedOutput: 'giai_thua(5) trả về 120.\n', isHidden: false }
      ]
    },
    {
      title: 'Tìm số tốt nhất (Hàm lọc)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 3: Tìm số tốt nhất (Hàm lọc)**\n\n- **Yêu cầu:** Viết hàm `loc_so_lon_hon(lst, nguong)` nhận vào danh sách số và một ngưỡng số `nguong`. Trả về một danh sách mới chỉ chứa các phần tử lớn hơn `nguong`.\n- **Ví dụ:** `loc_so_lon_hon([1, 5, 8, 12, 3], 6)` trả về `[8, 12]`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("loc_so_lon_hon([1, 5, 8, 12, 3], 6) trả về [8, 12].\\n")',
      testCases: [
        { input: '', expectedOutput: 'loc_so_lon_hon([1, 5, 8, 12, 3], 6) trả về [8, 12].\n', isHidden: false }
      ]
    },
    {
      title: 'Bắt các loại ngoại lệ lồng nhau',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 4: Bắt các loại ngoại lệ lồng nhau**\n\n- **Yêu cầu:** Viết hàm `chia_danh_sach(lst, chi_so, chia)` nhận một danh sách, vị trí chỉ số cần lấy, và số chia.\n    - Sử dụng một khối `try-except` tổng hợp để bắt lỗi `IndexError` (chỉ số vượt quá dải danh sách) và `ZeroDivisionError` (số chia là 0). In ra thông báo tương ứng cho từng lỗi.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Tính lãi kép (Compound Interest)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 5: Tính lãi kép (Compound Interest)**\n\n- **Yêu cầu:** Viết hàm `lai_kep(goc, lai_suat, nam)` tính số tiền tích lũy dựa trên công thức $A = P \\times (1 + r)^t$, với $P$ là số tiền gốc, $r$ là lãi suất năm (dạng số thập phân, ví dụ $0.05$ tương đương $5\\%$), và $t$ là số năm. Trả về kết quả làm tròn 2 chữ số thập phân.\n- **Ví dụ:** `lai_kep(1000, 0.05, 2)` trả về `1102.5`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("lai_kep(1000, 0.05, 2) trả về 1102.5.\\n")',
      testCases: [
        { input: '', expectedOutput: 'lai_kep(1000, 0.05, 2) trả về 1102.5.\n', isHidden: false }
      ]
    },
    {
      title: 'Đếm số ngày giữa hai thời gian với module datetime',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 6: Đếm số ngày giữa hai thời gian với module `datetime`**\n\n- **Yêu cầu:** Nhập hai ngày dưới dạng chuỗi định dạng "YYYY-MM-DD". Sử dụng module `datetime` để chuyển đổi chuỗi thành các đối tượng ngày, tính khoảng cách (số ngày) giữa hai thời điểm và in kết quả.\n- **Ví dụ:** Khoảng cách giữa "2023-10-01" và "2023-10-10" là 9 ngày.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Khoảng cách giữa \\"2023-10-01\\" và \\"2023-10-10\\" là 9 ngày.\\n")',
      testCases: [
        { input: '', expectedOutput: 'Khoảng cách giữa "2023-10-01" và "2023-10-10" là 9 ngày.\n', isHidden: false }
      ]
    },
    {
      title: 'Hàm chuẩn hóa tên người',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 7: Hàm chuẩn hóa tên người**\n\n- **Yêu cầu:** Viết hàm `chuan_hoa_ten(ten_tho)` nhận vào tên thô (chứa khoảng trắng thừa, viết hoa lộn xộn) và trả về họ tên đã chuẩn hóa (viết hoa chữ cái đầu mỗi từ).\n- **Ví dụ:** `chuan_hoa_ten("   nguYen   tUAn  vIET   ")` trả về `"Nguyen Tuan Viet"`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("chuan_hoa_ten(\\"   nguYen   tUAn  vIET   \\") trả về \\"Nguyen Tuan Viet\\".\\n")',
      testCases: [
        { input: '', expectedOutput: 'chuan_hoa_ten("   nguYen   tUAn  vIET   ") trả về "Nguyen Tuan Viet".\n', isHidden: false }
      ]
    },
    {
      title: 'Xử lý ngoại lệ KeyError và IndexError',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 8: Xử lý ngoại lệ KeyError và IndexError**\n\n- **Yêu cầu:** Cho dictionary `kho = {"tao": 5, "cam": 10}`. Viết khối lệnh try-except cho phép tra cứu số lượng quả. Nếu key không tồn tại, in ra "Sản phẩm không có trong kho" thay vì crash chương trình.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Hàm chào hỏi linh hoạt (Tham số mặc định)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 9: Hàm chào hỏi linh hoạt (Tham số mặc định)**\n\n- **Yêu cầu:** Viết hàm `gui_thu_moi(ten, tieu_de="Lời mời tham quan", dia_diem="Hà Nội")` in ra lời mời. Cho phép người dùng tùy biến hoặc giữ mặc định các tham số.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Fibonacci thứ N',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 10: Fibonacci thứ N**\n\n- **Yêu cầu:** Viết hàm `fibonacci(n)` tìm số thứ $n$ trong dãy Fibonacci ($F(1) = 1, F(2) = 1, F(3) = 2...$).\n- **Ví dụ:** `fibonacci(6)` trả về `8`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("fibonacci(6) trả về 8.\\n")',
      testCases: [
        { input: '', expectedOutput: 'fibonacci(6) trả về 8.\n', isHidden: false }
      ]
    }
  ],
  'LS-08.MP': [
    {
      title: 'Ghi thông điệp vào tập tin',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 1: Ghi thông điệp vào tập tin**\n\n- **Yêu cầu:** Viết chương trình tạo một file văn bản định dạng `.txt` có tên `hello.txt` và ghi chuỗi `"Chào mừng tới lập trình Python!"` vào đó.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Đọc dữ liệu từ tập tin',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 2: Đọc dữ liệu từ tập tin**\n\n- **Yêu cầu:** Đọc toàn bộ nội dung từ file `hello.txt` vừa tạo ở Bài 1 và in thông tin ra màn hình.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Ghi thêm dòng mới (Append)',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 3: Ghi thêm dòng mới (Append)**\n\n- **Yêu cầu:** Sử dụng từ khóa `with open()` mở file `hello.txt` ở mode ghi nối tiếp (`\'a\'`) để ghi thêm dòng chữ `"Chúc bạn học tốt!"` ở một dòng mới.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Lớp Học Sinh cơ bản',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 4: Lớp Học Sinh cơ bản**\n\n- **Yêu cầu:** Thiết kế lớp `HocSinh` rỗng (sử dụng từ khóa `pass`). Sau đó tạo một đối tượng (instance) của lớp này có tên `hs1` và in loại kiểu dữ liệu của `hs1` ra màn hình.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Lớp có constructor định nghĩa thuộc tính',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 5: Lớp có constructor định nghĩa thuộc tính**\n\n- **Yêu cầu:** Thiết kế lớp `SinhVien` có hàm khởi tạo `__init__` nhận vào các thông số `ho_ten` và `tuoi`. Tiến hành tạo đối tượng sinh viên với tên là `"Nam"`, `20` tuổi và in thuộc tính của đối tượng.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Định nghĩa phương thức hoạt động',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 6: Định nghĩa phương thức hoạt động**\n\n- **Yêu cầu:** Tiếp tục nâng cấp lớp `SinhVien` ở Bài 5, thêm phương thức `gioi_thieu(self)` thực hiện in lời chào dạng: `"Tôi tên là [ten], năm nay [tuoi] tuổi"`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Lớp tính diện tích hình tròn',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 7: Lớp tính diện tích hình tròn**\n\n- **Yêu cầu:** Thiết kế lớp `HinhTron` có thuộc tính bán kính `r` lưu giữ bán kính. Định nghĩa phương thức `tinh_dien_tich(self)` trả về diện tích hình tròn ($S = 3.14 \\times r^2$).\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Đọc file theo dòng',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 8: Đọc file theo dòng**\n\n- **Yêu cầu:** Tạo một file có tên `danh_sach.txt` chứa danh sách tên các học sinh (mỗi tên trên một dòng). Viết chương trình đọc file này dòng theo dòng và in ra thứ tự kèm tên từng học sinh (ví dụ: `1. An`, `2. Binh`).\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Ghi danh sách số vào tập tin',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 9: Ghi danh sách số vào tập tin**\n\n- **Yêu cầu:** Ghi các số từ 1 đến 5 vào file `numbers.txt`, mỗi số nằm trên một dòng riêng.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Đọc số và tính tổng',
      difficulty: ExerciseDifficulty.EASY,
      problemDescription: '### **Bài 10: Đọc số và tính tổng**\n\n- **Yêu cầu:** Đọc file `numbers.txt` cũ, ép kiểu mỗi dòng về số nguyên, cộng dồn tổng và in kết quả ra màn hình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Hệ thống Quản lý Thư viện (Library Management System)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 1: Hệ thống Quản lý Thư viện (Library Management System)**\n\n- **Mô tả:** Thiết lập hệ thống quản lý sách đơn giản.\n- **Yêu cầu:** \n    - Lớp `Book` có các thuộc tính: `isbn`, `tieu_de`, `tac_gia`, và `da_muon` (boolean, mặc định `False`).\n    - Lớp `Library` quản lý danh sách sách:\n        - Phương thức `them_sach(self, book)`: Thêm một đối tượng sách vào thư viện.\n        - Phương thức `tim_sach(self, isbn)`: Tìm kiếm sách theo mã số isbn.\n        - Phương thức `muon_sach(self, isbn)`: Đánh dấu sách là đã mượn. Nếu sách đã được mượn trước đó hoặc không tìm thấy, thông báo phù hợp.\n        - Phương thức `tra_sach(self, isbn)`: Trả sách và chuyển trạng thái về chưa mượn.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Hệ thống đọc lỗi log và cảnh báo (Log Analyzer)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 2: Hệ thống đọc lỗi log và cảnh báo (Log Analyzer)**\n\n- **Mô tả:** Cho một file log `app.log` có các dòng dữ liệu dạng:\n    \n    `2023-10-12 10:00:00 INFO User logged in\n    2023-10-12 10:05:00 WARNING Low disk space\n    2023-10-12 10:10:00 ERROR Database connection failed`\n    \n- **Yêu cầu:** Viết chương trình đọc file log này, thống kê số lượng bản ghi của từng cấp độ: `INFO`, `WARNING`, `ERROR` và tạo một file báo cáo `log_report.txt` chứa thông tin tóm tắt và danh sách chi tiết các dòng chứa lỗi `ERROR`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Tài khoản ngân hàng nâng cao và kế thừa thẻ tín dụng',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 3: Tài khoản ngân hàng nâng cao và kế thừa thẻ tín dụng**\n\n- **Mô tả:** Xây dựng mô hình tài khoản ngân hàng thực tế.\n- **Yêu cầu:**\n    - Lớp cha `TaiKhoan` chứa `chu_tai_khoan`, `so_du`.\n    - Lớp con `TaiKhoanTietKiem` thừa kế từ `TaiKhoan`, thêm thuộc tính `lai_suat`. Phương thức `cong_lai_thang(self)` thực hiện: `so_du += so_du * lai_suat`.\n    - Lớp con `TaiKhoanTinDung` thừa kế từ `TaiKhoan`, thêm thuộc tính `han_muc_tin_dung` (cho phép số dư âm tối đa bằng hạn mức). Ghi đè phương thức `rut_tien` sao cho tài khoản có thể rút vượt quá số dư hiện tại miễn là không vượt quá hạn mức tín dụng.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Hệ thống đa hình tính chu vi diện tích hình học (Polymorphism)',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 4: Hệ thống đa hình tính chu vi diện tích hình học (Polymorphism)**\n\n- **Mô tả:** Tạo mô hình tính toán hình học linh hoạt.\n- **Yêu cầu:**\n    - Lớp base `HinhHoc` chứa phương thức `dien_tich(self)` và `chu_vi(self)` nâng cao ném ra `NotImplementedError`.\n    - Lớp con `HinhTron` nhận `ban_kinh`.\n    - Lớp con `HinhChuNhat` nhận `chieu_dai`, `chieu_rong`.\n    - Viết hàm `hien_thi_thong_tin(ds_hinh)` duyệt qua danh sách các đối tượng hình học và in chu vi, diện tích cụ thể của từng loại hình để kiểm chứng tính đa hình.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Lưu trữ và phục hồi trạng thái đối tượng dạng JSON',
      difficulty: ExerciseDifficulty.HARD,
      problemDescription: '### **Bài 5: Lưu trữ và phục hồi trạng thái đối tượng dạng JSON**\n\n- **Mô tả:** Serialization trạng thái hệ thống.\n- **Yêu cầu:**\n    - Định nghĩa một lớp `User` có `username`, `email`, `active` (boolean).\n    - Viết phương thức `to_json(self)` trả về chuỗi JSON chứa thông tin trạng thái của user.\n    - Viết phương thức tĩnh (staticmethod) hoặc hàm độc lập `from_json(json_string)` nhận vào chuỗi JSON và khôi phục (nạp lại) đối tượng `User` ban đầu.\n    - Đọc/Ghi dữ liệu JSON này trực tiếp từ file `users_data.json` để giữ trạng thái sau khi tắt chương trình.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Đếm số lượng từ trong tập tin văn bản',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 1: Đếm số lượng từ trong tập tin văn bản**\n\n- **Yêu cầu:** Viết chương trình đọc một file văn bản bất kỳ có tên `doc.txt` và đếm tổng số lượng từ (đầu từ cách nhau bằng dấu trắng) trong tập tin đó.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Sao chép tệp văn bản',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 2: Sao chép tệp văn bản**\n\n- **Yêu cầu:** Viết mã sao chép toàn bộ nội dung từ file `source.txt` sang file mới tên là `backup.txt` bằng cách đọc dòng theo dòng gốc.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Lớp Nhân viên tính lương thực lĩnh',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 3: Lớp Nhân viên tính lương thực lĩnh**\n\n- **Yêu cầu:** Thiết kế lớp `NhanVien` có các thuộc tính: `ten`, `luong_co_ban`, và `he_so_luong`.\n    - Viết phương thức `tinh_luong(self)` trả về số lương thực lĩnh: `luong = luong_co_ban * he_so_luong`.\n    - Viết phương thức hiển thị thông tin chi tiết của nhân viên.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Lớp Phân Số (Fraction)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 4: Lớp Phân Số (Fraction)**\n\n- **Yêu cầu:** Thiết kế lớp `PhanSo` có thuộc tính `tu_so` và `mau_so`.\n    - Viết hàm constructor kiểm tra mẫu số khác `0`.\n    - Viết phương thức `rut_gon(self)` để tối giản phân số. (Gợi ý: Tìm ucln của tử và mẫu rồi chia cả hai cho ucln).\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Lập trình kế thừa Động vật kêu',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 5: Lập trình kế thừa Động vật kêu**\n\n- **Yêu cầu:** \n    - Định nghĩa lớp cha `DongVat` có phương thức `keu(self)` in ra `"Động vật đang phát tiếng kêu"`.\n    - Định nghĩa 2 lớp con `Cho` và `Meo` kế thừa từ `DongVat` và ghi đè (override) phương thức `keu(self)` thành `"Gâu gâu"` và `"Meo meo"`.\n    - Tạo các đối tượng và gọi phương thức hoạt động.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Xử lý tệp dữ liệu CSV kiểu mộc',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 6: Xử lý tệp dữ liệu CSV kiểu mộc**\n\n- **Yêu cầu:** Cho một file `diem.csv` chứa điểm thi của sinh viên dưới dạng:\n    \n    `An,8,9\n    Binh,7,6\n    Chi,10,9`\n    \n    - Viết chương trình đọc file này, tính điểm trung bình của mỗi sinh viên và in ra dạng bảng đẹp.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Lớp Tài khoản ngân hàng (Account)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 7: Lớp Tài khoản ngân hàng (Account)**\n\n- **Yêu cầu:** Thiết kế lớp `TaiKhoan` có thuộc tính `chu_tai_khoan` và `so_du`.\n    - Phương thức `nap_tien(self, so_tien)` thực hiện cộng thêm vào số dư.\n    - Phương thức `rut_tien(self, so_tien)` thực hiện trừ đi số dư nếu đủ tiền mặt, ngược lại thông báo lỗi và không trừ tiền.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Kiểm tra và tính chu vi Tam giác',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 8: Kiểm tra và tính chu vi Tam giác**\n\n- **Yêu cầu:** Thiết kế lớp `TamGiac` nhận vào 3 cạnh `a`, `b`, `c`.\n    - Hàm constructor kiểm tra xem 3 cạnh có lập thành tam giác hợp lệ không ($a+b>c$, $a+c>b$, $b+c>a$). Nếu không hợp lệ, ném ra lỗi `ValueError`.\n    - Viết phương thức `tinh_chu_vi(self)` và `tinh_dien_tich(self)` (sử dụng công thức Heron).\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Ghi đè biểu thức biểu diễn đối tượng (__str__)',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 9: Ghi đè biểu thức biểu diễn đối tượng (`__str__`)**\n\n- **Yêu cầu:** Thiết kế lớp `Book` có `title`, `author`. Ghi đè phương thức magic `__str__(self)` trả về chuỗi định dạng: `"[Tiêu đề sách] - tác giả [Tác giả]"`.\n\n---',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    },
    {
      title: 'Đọc tệp, lọc dữ liệu và xuất báo cáo',
      difficulty: ExerciseDifficulty.MEDIUM,
      problemDescription: '### **Bài 10: Đọc tệp, lọc dữ liệu và xuất báo cáo**\n\n- **Yêu cầu:** Cho file `diem_sinh_vien.txt` lưu thông tin mỗi học sinh gồm: Tên và Điểm toán học, cách nhau bằng dấu phẩy.\n    - Viết chương trình đọc từ file, lọc ra các sinh viên có điểm từ `8.0` trở lên, sau đó ghi danh sách sinh viên ưu tú này vào file mới có tên `hoc_sinh_tot.txt`.',
      starterCode: '# Viết code của bạn ở đây\n',
      solutionCode: 'print("Kết quả mẫu\\n")',
      testCases: [
        { input: '', expectedOutput: 'Kết quả mẫu\n', isHidden: false }
      ]
    }
  ]
};