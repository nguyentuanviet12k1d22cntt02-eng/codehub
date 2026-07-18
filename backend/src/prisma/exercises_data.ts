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
  ]
};
