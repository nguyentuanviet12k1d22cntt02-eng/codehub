import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    CheckCircle2, 
    Sparkles, 
    ArrowRight, 
    Layers, 
    ZoomIn, 
    ZoomOut, 
    X, 
    Code2, 
    BookOpen, 
    Flame, 
    Target, 
    Copy, 
    Check, 
    Clock,
    Info,
    Play,
    SlidersHorizontal,
    GraduationCap,
    BarChart2,
    Compass,
    ChevronLeft,
    PanelRightClose,
    PanelRightOpen,
    Database,
    Cpu,
    Move
} from 'lucide-react';
import pythonSkillGraph from '../../../data/pythonSkillGraph.json';
import javascriptSkillGraph from '../../../data/javascriptSkillGraph.json';
import cppSkillGraph from '../../../data/cppSkillGraph.json';
import sqlSkillGraph from '../../../data/sqlSkillGraph.json';
import { MascotWavingBannerIllustration } from '../../ai-tutor/components/AITutorIllustrations';

export type SupportedLanguage = 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'SQL';

export interface KnowledgeGraphTreeProps {
    userMastery: Record<string, number>;
    activeLanguage?: SupportedLanguage;
    onLanguageChange?: (lang: SupportedLanguage) => void;
    isLoading?: boolean;
    activeModel?: 'PAL-Net';
    onModelChange?: (model: 'PAL-Net') => void;
    overallScore: number;
    streakDays?: number;
    studentMeta?: {
        username: string;
        email: string;
        profile: 'STRUGGLING' | 'AVERAGE' | 'EXCELLENT';
    };
    stats?: {
        lessons_completed: number;
        practice_completed: number;
        streak_days: number;
        total_actions: number;
    };
    isFullPage?: boolean;
}

// 4 Language configurations & Brand Identities
export const LANGUAGE_CONFIGS: Record<SupportedLanguage, {
    id: SupportedLanguage;
    name: string;
    badge: string;
    courseTitle: string;
    subtitle: string;
    syntaxLang: string;
    defaultConcept: string;
    brandColor: string;
    accentGradient: string;
    activeBorderClass: string;
    activeBgClass: string;
    activeTabClass: string;
}> = {
    PYTHON: {
        id: 'PYTHON',
        name: 'Python',
        badge: '33 Kỹ năng • 6 Chặng',
        courseTitle: 'Python Toàn Diện',
        subtitle: 'Hành trình trở thành Backend & AI Developer với Python',
        syntaxLang: 'python',
        defaultConcept: 'PY-BASICS-02',
        brandColor: '#2563EB',
        accentGradient: 'from-blue-600 to-indigo-700',
        activeBorderClass: 'border-blue-500 ring-2 ring-blue-500/20',
        activeBgClass: 'bg-blue-50 text-blue-700 border-blue-200',
        activeTabClass: 'bg-blue-600 text-white shadow-blue-500/25 border-blue-600'
    },
    JAVASCRIPT: {
        id: 'JAVASCRIPT',
        name: 'JavaScript',
        badge: '23 Kỹ năng • 6 Chặng',
        courseTitle: 'JavaScript Toàn Diện, ES6+ & OOP',
        subtitle: 'Làm chủ Fullstack Web, ES6+, Closure & Hướng Đối Tượng với JavaScript',
        syntaxLang: 'javascript',
        defaultConcept: 'JS-VAR-01',
        brandColor: '#D97706',
        accentGradient: 'from-amber-500 to-orange-600',
        activeBorderClass: 'border-amber-500 ring-2 ring-amber-500/20',
        activeBgClass: 'bg-amber-50 text-amber-700 border-amber-200',
        activeTabClass: 'bg-amber-500 text-white shadow-amber-500/25 border-amber-500'
    },
    CPP: {
        id: 'CPP',
        name: 'C++',
        badge: '20 Kỹ năng • 6 Chặng',
        courseTitle: 'C++ Toàn Diện, STL & Lập Trình Hệ Thống',
        subtitle: 'Làm chủ Kỹ thuật Hệ thống, Con trỏ, RAII & Tối ưu Cache với C++',
        syntaxLang: 'cpp',
        defaultConcept: 'CPP-SYNTAX-01',
        brandColor: '#0284C7',
        accentGradient: 'from-sky-600 to-blue-700',
        activeBorderClass: 'border-sky-500 ring-2 ring-sky-500/20',
        activeBgClass: 'bg-sky-50 text-sky-700 border-sky-200',
        activeTabClass: 'bg-sky-600 text-white shadow-sky-500/25 border-sky-600'
    },
    SQL: {
        id: 'SQL',
        name: 'SQL Server',
        badge: '7 Kỹ năng • 5 Chặng',
        courseTitle: 'Cơ Sở Dữ Liệu SQL Server',
        subtitle: 'Làm chủ Truy vấn DQL, Gom nhóm & Tối ưu Cơ sở Dữ liệu với SQL',
        syntaxLang: 'sql',
        defaultConcept: 'SQL-DQL-01',
        brandColor: '#0D9488',
        accentGradient: 'from-teal-600 to-emerald-700',
        activeBorderClass: 'border-teal-500 ring-2 ring-teal-500/20',
        activeBgClass: 'bg-teal-50 text-teal-700 border-teal-200',
        activeTabClass: 'bg-teal-600 text-white shadow-teal-500/25 border-teal-600'
    }
};

// Language Emblem Component
export const LanguageLogoIcon: React.FC<{ language: SupportedLanguage; className?: string }> = ({ language, className = "w-5 h-5" }) => {
    switch (language) {
        case 'JAVASCRIPT':
            return (
                <div className={`${className} bg-[#F7DF1E] rounded-md flex items-center justify-center p-0.5 text-[#111] font-black text-[10px] tracking-tighter leading-none select-none shadow-2xs`}>
                    JS
                </div>
            );
        case 'CPP':
            return (
                <div className={`${className} bg-[#00599C] rounded-md flex items-center justify-center p-0.5 text-white font-black text-[9px] tracking-tight leading-none select-none shadow-2xs`}>
                    C++
                </div>
            );
        case 'SQL':
            return (
                <div className={`${className} bg-[#0D9488] rounded-md flex items-center justify-center p-1 text-white shadow-2xs`}>
                    <Database className="w-full h-full text-white" />
                </div>
            );
        case 'PYTHON':
        default:
            return (
                <svg viewBox="0 0 128 128" fill="none" className={className}>
                    <path d="M63.5 12C36.2 12 37.8 23.8 37.8 23.8L37.9 36H64.4V39.7H27.3C27.3 39.7 12 37.9 12 65.5C12 93.1 25.3 92 25.3 92H34.4V79.2C34.4 79.2 33.9 63.8 49.6 63.8H76.2C76.2 63.8 90.7 64.3 90.7 50.1V24.3C90.7 24.3 92.8 12 63.5 12ZM50.8 20.3C53.7 20.3 56 22.6 56 25.5C56 28.4 53.7 30.7 50.8 30.7C47.9 30.7 45.6 28.4 45.6 25.5C45.6 22.6 47.9 20.3 50.8 20.3Z" fill="#3B82F6" />
                    <path d="M64.5 116C91.8 116 90.2 104.2 90.2 104.2L90.1 92H63.6V88.3H100.7C100.7 88.3 116 90.1 116 62.5C116 34.9 102.7 36 102.7 36H93.6V48.8C93.6 48.8 94.1 64.2 78.4 64.2H51.8C51.8 64.2 37.3 63.7 37.3 77.9V103.7C37.3 103.7 35.2 116 64.5 116ZM77.2 107.7C74.3 107.7 72 105.4 72 102.5C72 99.6 74.3 97.3 77.2 97.3C80.1 97.3 82.4 99.6 82.4 102.5C82.4 105.4 80.1 107.7 77.2 107.7Z" fill="#FBBF24" />
                </svg>
            );
    }
};

// Stage Metadata per Language
const STAGE_METADATA_BY_LANG: Record<SupportedLanguage, Record<number, { title: string; subtitle: string; tag: string }>> = {
    PYTHON: {
        0: { title: 'Cơ bản & Nền tảng', subtitle: 'Biến, Kiểu dữ liệu, Toán tử, Chuỗi', tag: 'STAGE 1' },
        1: { title: 'Luồng điều khiển', subtitle: 'Mệnh đề if, Vòng lặp For/While', tag: 'STAGE 2' },
        2: { title: 'Cấu trúc dữ liệu', subtitle: 'List, Tuple, Dict, Set, Comp', tag: 'STAGE 3' },
        3: { title: 'Hàm & Phạm vi', subtitle: 'Def, Lambda, Scope, Generator', tag: 'STAGE 4' },
        4: { title: 'Ngoại lệ & File I/O', subtitle: 'Try/Except, Đọc/Ghi tệp tin', tag: 'STAGE 5' },
        5: { title: 'Hướng đối tượng (OOP)', subtitle: 'Class, Kế thừa, Đa hình, Magic', tag: 'STAGE 6' },
    },
    JAVASCRIPT: {
        0: { title: 'Cơ sở & Khai báo biến', subtitle: 'let, const, kiểu nguyên thủy, typeof, runtime I/O', tag: 'STAGE 1' },
        1: { title: 'Điều khiển & Vòng lặp', subtitle: 'if-else, truthy/falsy, for, while, ép kiểu', tag: 'STAGE 2' },
        2: { title: 'Hàm & Dữ liệu cơ bản', subtitle: 'function, mảng indexing, chuỗi, đối tượng object', tag: 'STAGE 3' },
        3: { title: 'ES6+ & Composition', subtitle: 'arrow fn, HOF map/filter/reduce, destructuring, spread, Set/Map', tag: 'STAGE 4' },
        4: { title: 'Runtime & Execution Model', subtitle: 'scope, execution context, closure, this, prototype', tag: 'STAGE 5' },
        5: { title: 'Kiến trúc OOP & Engineering', subtitle: 'class, inheritance, error handling, modules', tag: 'STAGE 6' },
    },
    CPP: {
        0: { title: 'Cú pháp I/O & Kiểu số', subtitle: 'main, cout/cin, int, double, constexpr, static_cast', tag: 'STAGE 1' },
        1: { title: 'Điều khiển & Đóng gói hàm', subtitle: 'if/switch, for/while, pass-by-ref &, overloading', tag: 'STAGE 2' },
        2: { title: 'Dữ liệu Tuyến tính & STL', subtitle: 'mảng tĩnh, std::vector, std::string, ma trận 2D', tag: 'STAGE 3' },
        3: { title: 'Struct & Mô hình bộ nhớ', subtitle: 'struct, memory layout, enum class, variant, process memory', tag: 'STAGE 4' },
        4: { title: 'Con trỏ, RAII & Đệ quy', subtitle: 'pointer *, pointer arithmetic, smart pointers, đệ quy, quay lui', tag: 'STAGE 5' },
        5: { title: 'Hệ thống & Tối ưu hiệu năng', subtitle: 'binary file I/O, build đa tệp, ngoại lệ, cache locality', tag: 'STAGE 6' },
    },
    SQL: {
        0: { title: 'Lược đồ Quan hệ & Khóa', subtitle: 'Bảng, Primary Key, Foreign Key, RDBMS', tag: 'STAGE 1' },
        1: { title: 'Truy vấn DQL Cơ bản', subtitle: 'SELECT, FROM, DISTINCT, Bí danh AS', tag: 'STAGE 2' },
        2: { title: 'Mệnh đề Lọc & Logic', subtitle: 'WHERE, LIKE, AND/OR, BETWEEN, IN', tag: 'STAGE 3' },
        3: { title: 'Sắp xếp & Gom nhóm', subtitle: 'ORDER BY, COUNT/SUM/AVG, GROUP BY, HAVING', tag: 'STAGE 4' },
        4: { title: 'Liên kết Đa bảng (JOINs)', subtitle: 'INNER JOIN, LEFT/RIGHT JOIN, FULL JOIN', tag: 'STAGE 5' },
    }
};

// Module to Stage Index mapping per language
const MODULE_TO_STAGE_BY_LANG: Record<SupportedLanguage, Record<string, number>> = {
    PYTHON: {
        'MOD-BASICS': 0,
        'MOD-FLOW': 1,
        'MOD-COLLECTIONS': 2,
        'MOD-FUNC': 3,
        'MOD-EXC-IO': 4,
        'MOD-OOP': 5
    },
    JAVASCRIPT: {
        'MOD-JS-VAR': 0,
        'MOD-JS-TYPE': 0,
        'MOD-JS-CONTROL': 1,
        'MOD-JS-FUNC': 2,
        'MOD-JS-DATA': 2,
        'MOD-JS-ES6': 3,
        'MOD-JS-EXEC': 4,
        'MOD-JS-OOP': 5,
        'MOD-JS-ENG': 5
    },
    CPP: {
        'MOD-CPP-SYNTAX': 0,
        'MOD-CPP-CONTROL': 1,
        'MOD-CPP-STL': 2,
        'MOD-CPP-RECORDS': 3,
        'MOD-CPP-MEM': 4,
        'MOD-CPP-ALGO': 4,
        'MOD-CPP-SYS': 5
    },
    SQL: {
        'MOD-SQL-RDBMS': 0,
        'MOD-SQL-DQL': 1,
        'MOD-SQL-FILTER': 2,
        'MOD-SQL-LOGIC': 2,
        'MOD-SQL-SORT': 3,
        'MOD-SQL-AGG': 3,
        'MOD-SQL-JOIN': 4
    }
};

// Topic Filter pills per language
const TOPIC_PILLS_BY_LANG: Record<SupportedLanguage, { id: string; label: string }[]> = {
    PYTHON: [
        { id: 'ALL', label: 'Tất cả' },
        { id: 'MOD-BASICS', label: 'Cơ bản & Làm quen' },
        { id: 'TOPIC-CASTING', label: 'Biến, Kiểu dữ liệu' },
        { id: 'MOD-FLOW', label: 'Cấu trúc điều khiển' },
        { id: 'MOD-FUNC', label: 'Hàm' },
        { id: 'MOD-COLLECTIONS', label: 'Danh sách & Bộ' },
        { id: 'TOPIC-STRING', label: 'Chuỗi ký tự' },
        { id: 'MOD-EXC-IO', label: 'Tệp tin' },
        { id: 'TOPIC-SCOPE', label: 'Thư viện' },
        { id: 'MOD-OOP', label: 'Hướng đối tượng' },
        { id: 'ADVANCED', label: 'Nâng cao' },
    ],
    JAVASCRIPT: [
        { id: 'ALL', label: 'Tất cả' },
        { id: 'MOD-JS-VAR', label: 'Biến & Console' },
        { id: 'MOD-JS-TYPE', label: 'Kiểu & Ép kiểu' },
        { id: 'MOD-JS-CONTROL', label: 'Rẽ nhánh & Lặp' },
        { id: 'MOD-JS-FUNC', label: 'Hàm & Arrow Fn' },
        { id: 'MOD-JS-DATA', label: 'Mảng, Chuỗi & Object' },
        { id: 'MOD-JS-ES6', label: 'Modern ES6+' },
        { id: 'MOD-JS-EXEC', label: 'Scope, Closure & this' },
        { id: 'MOD-JS-OOP', label: 'Class & Kế thừa' },
        { id: 'MOD-JS-ENG', label: 'Bắt lỗi & Modules' },
    ],
    CPP: [
        { id: 'ALL', label: 'Tất cả' },
        { id: 'MOD-CPP-SYNTAX', label: 'Nhập môn & I/O' },
        { id: 'MOD-CPP-CONTROL', label: 'Rẽ nhánh & Hàm' },
        { id: 'MOD-CPP-STL', label: 'Mảng, Vector & Chuỗi' },
        { id: 'MOD-CPP-RECORDS', label: 'Ma trận & Struct' },
        { id: 'MOD-CPP-MEM', label: 'Bộ nhớ & Con trỏ' },
        { id: 'MOD-CPP-ALGO', label: 'Đệ quy & Quay lui' },
        { id: 'MOD-CPP-SYS', label: 'Hệ thống & Hiệu năng' },
    ],
    SQL: [
        { id: 'ALL', label: 'Tất cả' },
        { id: 'MOD-SQL-RDBMS', label: 'Mô hình RDBMS' },
        { id: 'MOD-SQL-DQL', label: 'Truy vấn SELECT' },
        { id: 'MOD-SQL-FILTER', label: 'Mệnh đề WHERE' },
        { id: 'MOD-SQL-LOGIC', label: 'Toán tử AND/OR' },
        { id: 'MOD-SQL-SORT', label: 'Sắp xếp ORDER BY' },
        { id: 'MOD-SQL-AGG', label: 'Gom nhóm GROUP BY' },
        { id: 'MOD-SQL-JOIN', label: 'Liên kết JOINs' },
    ]
};

// Rich code examples for all 4 languages
const CONCEPT_CODE_SNIPPETS: Record<string, { lines: { text: string; comment?: string }[]; time: string }> = {
    // ----------------- PYTHON -----------------
    'PY-BASICS-01': {
        time: '30 phút',
        lines: [
            { text: '# Khởi tạo biến và kiểu dữ liệu trong Python', comment: '' },
            { text: 'ho_ten = "Nguyễn Tuấn Việt"', comment: '# Kiểu str' },
            { text: 'tuoi = 21', comment: '# Kiểu int' },
            { text: 'diem_tb = 8.75', comment: '# Kiểu float' },
            { text: 'is_active = True', comment: '# Kiểu bool' },
            { text: '', comment: '' },
            { text: 'print(f"Xin chào {ho_ten}, tuổi: {tuoi}")', comment: '# f-string' }
        ]
    },
    'PY-BASICS-02': {
        time: '45 phút',
        lines: [
            { text: '# Các kiểu dữ liệu cơ bản', comment: '' },
            { text: 'ten = "Python"', comment: '# chuỗi' },
            { text: 'tuoi = 18', comment: '# số nguyên' },
            { text: 'diem = 9.5', comment: '# số thực' },
            { text: 'la_hoc_sinh = True', comment: '# boolean' },
            { text: '', comment: '' },
            { text: 'print(ten, tuoi, diem, la_hoc_sinh)', comment: '' }
        ]
    },
    'PY-BASICS-03': {
        time: '35 phút',
        lines: [
            { text: '# Toán tử số học và logic', comment: '' },
            { text: 'a, b = 10, 3', comment: '' },
            { text: 'tong = a + b', comment: '# 13' },
            { text: 'chia_lay_du = a % b', comment: '# 1' },
            { text: 'luy_thua = a ** b', comment: '# 1000' },
            { text: 'dieu_kien = (a > 5) and (b < 10)', comment: '# True' },
            { text: 'print("Kết quả:", tong, dieu_kien)', comment: '' }
        ]
    },
    'PY-STRING-01': {
        time: '40 phút',
        lines: [
            { text: '# Indexing & Slicing trên Chuỗi', comment: '' },
            { text: 's = "Python Mastery"', comment: '' },
            { text: 'first_char = s[0]', comment: "# 'P'" },
            { text: 'sub = s[0:6]', comment: "# 'Python'" },
            { text: 'reversed_s = s[::-1]', comment: '# Đảo ngược' },
            { text: 'print("Chuỗi con:", sub, reversed_s)', comment: '' }
        ]
    },
    'PY-FLOW-01': {
        time: '40 phút',
        lines: [
            { text: '# Cấu trúc điều kiện if - elif - else', comment: '' },
            { text: 'diem = 8.5', comment: '' },
            { text: 'if diem >= 8.5:', comment: '' },
            { text: '    xep_loai = "Giỏi"', comment: '' },
            { text: 'elif diem >= 6.5:', comment: '' },
            { text: '    xep_loai = "Khá"', comment: '' },
            { text: 'else:', comment: '' },
            { text: '    xep_loai = "Trung bình"', comment: '' },
            { text: 'print(f"Xếp loại: {xep_loai}")', comment: '' }
        ]
    },
    'PY-FLOW-03': {
        time: '45 phút',
        lines: [
            { text: '# Vòng lặp for ... in range()', comment: '' },
            { text: 'tong_chan = 0', comment: '' },
            { text: 'for i in range(1, 11):', comment: '# 1 đến 10' },
            { text: '    if i % 2 == 0:', comment: '' },
            { text: '        tong_chan += i', comment: '' },
            { text: 'print(f"Tổng số chẵn 1..10: {tong_chan}")', comment: '# 30' }
        ]
    },
    'PY-LIST-01': {
        time: '50 phút',
        lines: [
            { text: '# Thao tác CRUD trên List', comment: '' },
            { text: 'playlist = ["Song A", "Song B"]', comment: '' },
            { text: 'playlist.append("Song C")', comment: '# Thêm cuối' },
            { text: 'playlist.insert(0, "Song VIP")', comment: '# Chèn đầu' },
            { text: 'playlist.remove("Song B")', comment: '# Xóa phần tử' },
            { text: 'print("Hàng đợi nhạc:", playlist)', comment: '' }
        ]
    },

    // ----------------- JAVASCRIPT -----------------
        // ----------------- JAVASCRIPT (23 ATOMIC SKILLS) -----------------
    'JS-VAR-01': {
        time: '25 phút',
        lines: [
            { text: '// Khai báo biến & hằng số: let, const, var', comment: '' },
            { text: 'let score = 10;', comment: '// Có thể gán lại' },
            { text: 'const MAX_SCORE = 100;', comment: '// Bất biến' },
            { text: 'score = 25;', comment: '' },
            { text: 'console.log(`Điểm số: ${score}/${MAX_SCORE}`);', comment: '' }
        ]
    },
    'JS-TYPE-01': {
        time: '25 phút',
        lines: [
            { text: '// Kiểu dữ liệu nguyên thủy & toán tử typeof', comment: '' },
            { text: 'const name = "JavaScript";', comment: '// string' },
            { text: 'const count = 42;', comment: '// number' },
            { text: 'const isActive = true;', comment: '// boolean' },
            { text: 'const empty = null;', comment: '// null' },
            { text: 'let notAssigned;', comment: '// undefined' },
            { text: 'console.log(typeof name, typeof count, typeof isActive);', comment: '' }
        ]
    },
    'JS-RUNTIME-01': {
        time: '20 phút',
        lines: [
            { text: '// Đọc luồng dữ liệu chuẩn stdin trong Node.js', comment: '' },
            { text: 'const fs = require("fs");', comment: '' },
            { text: 'const input = fs.readFileSync(0, "utf-8").trim().split(/\s+/);', comment: '// Đọc tokens' },
            { text: 'const a = parseInt(input[0], 10);', comment: '' },
            { text: 'const b = parseInt(input[1], 10);', comment: '' },
            { text: 'console.log(`Tổng: ${a + b}`);', comment: '' }
        ]
    },
    'JS-COERCE-01': {
        time: '30 phút',
        lines: [
            { text: '// Ép kiểu dữ liệu tường minh & kiểm tra NaN', comment: '' },
            { text: 'const strNum = "123.45px";', comment: '' },
            { text: 'const parsed = parseFloat(strNum);', comment: '// 123.45' },
            { text: 'const invalid = Number("abc");', comment: '// NaN' },
            { text: 'console.log("Là số hợp lệ:", !Number.isNaN(invalid));', comment: '// false' }
        ]
    },
    'JS-COND-01': {
        time: '30 phút',
        lines: [
            { text: '// Cấu trúc rẽ nhánh & Khái niệm Truthy/Falsy', comment: '' },
            { text: 'const age = 21;', comment: '' },
            { text: 'const status = age >= 18 ? "Người lớn" : "Trẻ em";', comment: '// Ternary' },
            { text: 'if (age >= 18 && status) {', comment: '// Short-circuit' },
            { text: '    console.log(`Chào mừng: ${status}`);', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'JS-LOOP-01': {
        time: '35 phút',
        lines: [
            { text: '// Vòng lặp for, while & kiểm soát luồng lặp', comment: '' },
            { text: 'let sum = 0;', comment: '' },
            { text: 'for (let i = 1; i <= 10; i++) {', comment: '' },
            { text: '    if (i % 2 !== 0) continue;', comment: '// Bỏ qua số lẻ' },
            { text: '    sum += i;', comment: '' },
            { text: '}', comment: '' },
            { text: 'console.log(`Tổng số chẵn 1..10: ${sum}`);', comment: '// 30' }
        ]
    },
    'JS-FUNC-01': {
        time: '35 phút',
        lines: [
            { text: '// Khai báo hàm & tham số mặc định', comment: '' },
            { text: 'function calculateTotal(price, taxRate = 0.1) {', comment: '// Default param' },
            { text: '    return price + price * taxRate;', comment: '' },
            { text: '}', comment: '' },
            { text: 'const bill = calculateTotal(100);', comment: '// 110' },
            { text: 'console.log(`Hóa đơn sau thuế: $${bill}`);', comment: '' }
        ]
    },
    'JS-ARROW-01': {
        time: '25 phút',
        lines: [
            { text: '// Cú pháp Arrow Function ES6', comment: '' },
            { text: 'const square = n => n * n;', comment: '// Implicit return' },
            { text: 'const multiply = (a, b) => {', comment: '' },
            { text: '    return a * b;', comment: '' },
            { text: '};', comment: '' },
            { text: 'console.log(`Bình phương 5: ${square(5)}`);', comment: '// 25' }
        ]
    },
    'JS-SCOPE-01': {
        time: '35 phút',
        lines: [
            { text: '// Phạm vi Scope & Variable Shadowing', comment: '' },
            { text: 'let globalVar = "toàn cục";', comment: '' },
            { text: '{', comment: '// Block scope' },
            { text: '    let localVar = "cục bộ";', comment: '' },
            { text: '    let globalVar = "bị che khuất";', comment: '// Shadowing' },
            { text: '    console.log(localVar, globalVar);', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'JS-ARRAY-01': {
        time: '35 phút',
        lines: [
            { text: '// Mảng Array: Thao tác Indexing & Mutating', comment: '' },
            { text: 'const list = [1, 2, 3];', comment: '' },
            { text: 'list.push(4);', comment: '// Thêm cuối: [1, 2, 3, 4]' },
            { text: 'const last = list.pop();', comment: '// Lấy cuối: 4' },
            { text: 'const sub = list.slice(0, 2);', comment: '// Không đột biến' },
            { text: 'console.log("Mảng con:", sub);', comment: '' }
        ]
    },
    'JS-ARRAY-HOF-01': {
        time: '45 phút',
        lines: [
            { text: '// Higher-Order Methods: map, filter, reduce', comment: '' },
            { text: 'const numbers = [1, 2, 3, 4, 5];', comment: '' },
            { text: 'const evenSquares = numbers', comment: '' },
            { text: '    .filter(n => n % 2 === 0)', comment: '// [2, 4]' },
            { text: '    .map(n => n * n);', comment: '// [4, 16]' },
            { text: 'const total = evenSquares.reduce((acc, v) => acc + v, 0);', comment: '// 20' },
            { text: 'console.log("Tổng bình phương số chẵn:", total);', comment: '' }
        ]
    },
    'JS-STRING-01': {
        time: '30 phút',
        lines: [
            { text: '// Xử lý chuỗi văn bản & Template Literals', comment: '' },
            { text: 'const raw = "   clean modern javascript   ";', comment: '' },
            { text: 'const cleaned = raw.trim().toUpperCase();', comment: '' },
            { text: 'const words = cleaned.split(" ");', comment: '// Array từ khóa' },
            { text: 'console.log(`Tìm thấy ${words.length} từ:`, words);', comment: '' }
        ]
    },
    'JS-OBJECT-01': {
        time: '35 phút',
        lines: [
            { text: '// Đối tượng Object & Cấu trúc Key-Value', comment: '' },
            { text: 'const user = { id: 101, name: "Tuấn Việt", role: "Dev" };', comment: '' },
            { text: 'user.age = 21;', comment: '// Dot notation' },
            { text: 'const key = "role";', comment: '' },
            { text: 'console.log(`Người dùng ${user.name} - Vai trò: ${user[key]}`);', comment: '' }
        ]
    },
    'JS-DESTRUCT-01': {
        time: '30 phút',
        lines: [
            { text: '// Phân rã Destructuring Assignment', comment: '' },
            { text: 'const config = { host: "localhost", port: 3000, secure: true };', comment: '' },
            { text: 'const { host, port, protocol = "http" } = config;', comment: '// Default value' },
            { text: 'const [first, , third] = [10, 20, 30];', comment: '// Array destructure' },
            { text: 'console.log(`${protocol}://${host}:${port}`);', comment: '' }
        ]
    },
    'JS-SPREADREST-01': {
        time: '35 phút',
        lines: [
            { text: '// Toán tử Spread (...) & Rest Parameters', comment: '' },
            { text: 'const defaultOpts = { theme: "dark", lang: "vi" };', comment: '' },
            { text: 'const userOpts = { ...defaultOpts, lang: "en" };', comment: '// Gộp options' },
            { text: 'function sumAll(...nums) {', comment: '// Rest parameters' },
            { text: '    return nums.reduce((a, b) => a + b, 0);', comment: '' },
            { text: '}', comment: '' },
            { text: 'console.log(userOpts, sumAll(1, 2, 3, 4));', comment: '' }
        ]
    },
    'JS-SETMAP-01': {
        time: '30 phút',
        lines: [
            { text: '// Cấu trúc dữ liệu Set & Map', comment: '' },
            { text: 'const uniqueIds = new Set([1, 2, 2, 3, 3, 4]);', comment: '// Khử trùng lặp' },
            { text: 'const cache = new Map();', comment: '' },
            { text: 'cache.set("user_101", { name: "Việt" });', comment: '// O(1) set' },
            { text: 'console.log("Set size:", uniqueIds.size, cache.has("user_101"));', comment: '' }
        ]
    },
    'JS-EXEC-01': {
        time: '45 phút',
        lines: [
            { text: '// Ngữ cảnh thực thi & Temporal Dead Zone (TDZ)', comment: '' },
            { text: 'console.log(hoistedVar);', comment: '// undefined (do var hoisted)' },
            { text: 'var hoistedVar = "Tôi là var";', comment: '' },
            { text: '// console.log(letVar); // Lỗi ReferenceError: TDZ!', comment: '' },
            { text: 'let letVar = "Tôi là let";', comment: '' }
        ]
    },
    'JS-CLOSURE-01': {
        time: '45 phút',
        lines: [
            { text: '// Lexical Scope & Kỹ thuật Bao đóng (Closure)', comment: '' },
            { text: 'function createWallet(initial = 0) {', comment: '' },
            { text: '    let balance = initial;', comment: '// Biến riêng tư' },
            { text: '    return {', comment: '' },
            { text: '        deposit: (amount) => { balance += amount; return balance; },', comment: '' },
            { text: '        getBalance: () => balance', comment: '' },
            { text: '    };', comment: '' },
            { text: '}', comment: '' },
            { text: 'const wallet = createWallet(50);', comment: '' },
            { text: 'wallet.deposit(20);', comment: '' },
            { text: 'console.log("Số dư:", wallet.getBalance());', comment: '// 70' }
        ]
    },
    'JS-THIS-01': {
        time: '45 phút',
        lines: [
            { text: '// Từ khóa this & Ràng buộc bind(), call(), apply()', comment: '' },
            { text: 'const account = {', comment: '' },
            { text: '    owner: "Tuấn Việt",', comment: '' },
            { text: '    show() { return `Chủ tài khoản: ${this.owner}`; }', comment: '' },
            { text: '};', comment: '' },
            { text: 'const detached = account.show;', comment: '' },
            { text: 'const bound = detached.bind(account);', comment: '// Ràng buộc ngữ cảnh' },
            { text: 'console.log(bound());', comment: '' }
        ]
    },
    'JS-PROTO-01': {
        time: '40 phút',
        lines: [
            { text: '// Nguyên mẫu Prototype & Prototype Chain', comment: '' },
            { text: 'function Vehicle(type) { this.type = type; }', comment: '' },
            { text: 'Vehicle.prototype.drive = function() {', comment: '// Chia sẻ phương thức' },
            { text: '    return `Đang lái xe ${this.type}`;', comment: '' },
            { text: '};', comment: '' },
            { text: 'const car = new Vehicle("Ô tô");', comment: '' },
            { text: 'console.log(car.drive());', comment: '' }
        ]
    },
    'JS-CLASS-01': {
        time: '50 phút',
        lines: [
            { text: '// Lập trình hướng đối tượng với ES6 Classes', comment: '' },
            { text: 'class Employee {', comment: '' },
            { text: '    #salary = 0;', comment: '// Trường riêng tư Private field' },
            { text: '    constructor(name, salary) { this.name = name; this.#salary = salary; }', comment: '' },
            { text: '    getSalary() { return this.#salary; }', comment: '' },
            { text: '}', comment: '' },
            { text: 'class Manager extends Employee {', comment: '// Kế thừa' },
            { text: '    constructor(name, salary, dept) { super(name, salary); this.dept = dept; }', comment: '' },
            { text: '}', comment: '' },
            { text: 'const m = new Manager("Việt", 2500, "IT");', comment: '' },
            { text: 'console.log(m.name, m.getSalary(), m.dept);', comment: '' }
        ]
    },
    'JS-ERROR-01': {
        time: '40 phút',
        lines: [
            { text: '// Xử lý ngoại lệ với try...catch & Custom ValidationError', comment: '' },
            { text: 'class ValidationError extends Error {', comment: '' },
            { text: '    constructor(msg) { super(msg); this.name = "ValidationError"; }', comment: '' },
            { text: '}', comment: '' },
            { text: 'try {', comment: '' },
            { text: '    throw new ValidationError("Dữ liệu nhập không hợp lệ");', comment: '' },
            { text: '} catch (err) {', comment: '' },
            { text: '    console.log(`Lỗi bắt được: [${err.name}] ${err.message}`);', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'JS-MODULE-01': {
        time: '35 phút',
        lines: [
            { text: '// Mô-đun hóa mã nguồn ES Modules', comment: '' },
            { text: '// export const API_URL = "https://api.codehub.vn";', comment: '// Named Export' },
            { text: '// export default function fetchData() { ... }', comment: '// Default Export' },
            { text: '// import fetchData, { API_URL } from "./api.js";', comment: '// Import' },
            { text: 'console.log("Hệ thống mô-đun hóa độc lập và có thể tái sử dụng");', comment: '' }
        ]
    },

    // ----------------- C++ (20 ATOMIC SKILLS) -----------------
    'CPP-SYNTAX-01': {
        time: '25 phút',
        lines: [
            { text: '// Cấu trúc chương trình C++ chuẩn & luồng cin/cout', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    cout << "Xin chao CodeHub C++!" << endl;', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-TYPE-01': {
        time: '30 phút',
        lines: [
            { text: '// Kiểu nguyên thủy, constexpr & ép kiểu static_cast', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    constexpr int MAX_ITEMS = 1000;', comment: '// Hằng số thời gian biên dịch' },
            { text: '    long long bigNumber = 9223372036854775807LL;', comment: '// 64-bit tránh tràn số' },
            { text: '    double ratio = static_cast<double>(10) / 3;', comment: '// 3.33333' },
            { text: '    cout << "Ratio: " << ratio << endl;', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-COND-01': {
        time: '30 phút',
        lines: [
            { text: '// Cấu trúc điều kiện rẽ nhánh & Short-circuit', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    int score = 85;', comment: '' },
            { text: '    if (score >= 80) cout << "Gioi" << endl;', comment: '' },
            { text: '    else if (score >= 65) cout << "Kha" << endl;', comment: '' },
            { text: '    else cout << "Trung binh" << endl;', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-LOOP-01': {
        time: '35 phút',
        lines: [
            { text: '// Vòng lặp for, while & kiểm soát luồng', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    int total = 0;', comment: '' },
            { text: '    for (int i = 1; i <= 10; ++i) {', comment: '' },
            { text: '        if (i % 2 != 0) continue;', comment: '' },
            { text: '        total += i;', comment: '' },
            { text: '    }', comment: '' },
            { text: '    cout << "Tong so chan: " << total << endl;', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-FUNC-01': {
        time: '35 phút',
        lines: [
            { text: '// Hàm, Truyền tham chiếu (&) và nạp chồng hàm', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'void swapValues(int &a, int &b) {', comment: '// Pass by reference' },
            { text: '    int tmp = a; a = b; b = tmp;', comment: '' },
            { text: '}', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    int x = 10, y = 20;', comment: '' },
            { text: '    swapValues(x, y);', comment: '// Hoán đổi không tốn chi phí copy' },
            { text: '    cout << x << " " << y << endl;', comment: '// 20 10' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-ARRAY-01': {
        time: '30 phút',
        lines: [
            { text: '// Mảng tĩnh bộ nhớ liền kề (Static Array)', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    int arr[5] = {10, 20, 30, 40, 50};', comment: '// Vùng nhớ Stack liên tục' },
            { text: '    cout << "Phan tu 0: " << arr[0] << endl;', comment: '' },
            { text: '    cout << "Kich thuoc byte: " << sizeof(arr) << endl;', comment: '// 20 bytes' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-VECTOR-01': {
        time: '35 phút',
        lines: [
            { text: '// Mảng động std::vector STL', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: '#include <vector>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    vector<int> nums = {1, 2, 3};', comment: '' },
            { text: '    nums.push_back(4);', comment: '// Cấp phát co giãn Heap O(1)' },
            { text: '    for (int x : nums) cout << x << " ";', comment: '// Range-based for' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-STRING-01': {
        time: '30 phút',
        lines: [
            { text: '// Xử lý chuỗi ký tự std::string & stringstream', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: '#include <string>', comment: '' },
            { text: '#include <sstream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    string text = "CodeHub C++ Programming";', comment: '' },
            { text: '    string word = text.substr(8, 3);', comment: '// "C++"' },
            { text: '    cout << "Substr: " << word << endl;', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-MATRIX-01': {
        time: '40 phút',
        lines: [
            { text: '// Ma trận 2 chiều & Vector lồng nhau vector<vector<T>>', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: '#include <vector>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    vector<vector<int>> matrix(3, vector<int>(3, 0));', comment: '// 3x3' },
            { text: '    matrix[1][1] = 99;', comment: '' },
            { text: '    cout << "Center: " << matrix[1][1] << endl;', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-STRUCT-01': {
        time: '35 phút',
        lines: [
            { text: '// Cấu trúc struct & Căn chỉnh bộ nhớ (Memory Alignment)', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'struct Student {', comment: '' },
            { text: '    int id;', comment: '// 4 bytes' },
            { text: '    char rank;', comment: '// 1 byte + 3 bytes padding' },
            { text: '    double gpa;', comment: '// 8 bytes' },
            { text: '};', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    cout << "Kich thuoc struct: " << sizeof(Student) << " bytes" << endl;', comment: '// 16 bytes' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-ENUMVAR-01': {
        time: '35 phút',
        lines: [
            { text: '// Enum class, Bit-fields & std::variant', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'enum class Status : uint8_t { Pending, Approved, Rejected };', comment: '// Scoped enum' },
            { text: 'struct Flags {', comment: '' },
            { text: '    unsigned int is_ready : 1;', comment: '// 1 bit' },
            { text: '    unsigned int has_error : 1;', comment: '// 1 bit' },
            { text: '};', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    Status s = Status::Approved;', comment: '' },
            { text: '    cout << "Approved enum status code: " << static_cast<int>(s) << endl;', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-MEM-01': {
        time: '40 phút',
        lines: [
            { text: '// Mô hình bộ nhớ tiến trình (Process Memory Model)', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int globalVar = 100;', comment: '// Data Segment' },
            { text: 'int main() {', comment: '' },
            { text: '    int stackVar = 10;', comment: '// Stack Frame' },
            { text: '    int* heapVar = new int(20);', comment: '// Heap allocation' },
            { text: '    cout << "Stack addr: " << &stackVar << ", Heap: " << heapVar << endl;', comment: '' },
            { text: '    delete heapVar;', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-PTR-01': {
        time: '45 phút',
        lines: [
            { text: '// Con trỏ thô, Số học con trỏ & Giải tham chiếu', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    int arr[] = {10, 20, 30};', comment: '' },
            { text: '    int *ptr = arr;', comment: '// Trỏ tới phần tử đầu' },
            { text: '    cout << *ptr << " " << *(ptr + 1) << endl;', comment: '// 10 20 (Pointer arithmetic)' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-SMARTPTR-01': {
        time: '45 phút',
        lines: [
            { text: '// Con trỏ thông minh std::unique_ptr & RAII', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: '#include <memory>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'struct Resource {', comment: '' },
            { text: '    Resource() { cout << "Resource acquired\n"; }', comment: '' },
            { text: '    ~Resource() { cout << "Resource destroyed automatically\n"; }', comment: '// RAII' },
            { text: '};', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    auto uptr = make_unique<Resource>();', comment: '// Tự động giải phóng khi ra khỏi scope' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-FILE-01': {
        time: '45 phút',
        lines: [
            { text: '// Đọc ghi tệp nhị phân & Truy cập ngẫu nhiên (Binary File I/O)', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: '#include <fstream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'struct Record { int id; double val; };', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    ofstream out("data.bin", ios::binary);', comment: '' },
            { text: '    Record r = {1, 99.5};', comment: '' },
            { text: '    out.write(reinterpret_cast<char*>(&r), sizeof(Record));', comment: '' },
            { text: '    out.close();', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-BUILD-01': {
        time: '40 phút',
        lines: [
            { text: '// Tiền xử lý & Dự án đa tệp (Multi-file Build)', comment: '' },
            { text: '// header.h:', comment: '' },
            { text: '// #pragma once', comment: '' },
            { text: '// int add(int a, int b);', comment: '// Nguyên mẫu hàm' },
            { text: '// main.cpp:', comment: '' },
            { text: '// #include "header.h"', comment: '' },
            { text: '// g++ -O2 main.cpp math.cpp -o app', comment: '// Biên dịch liên kết' },
            { text: '#include <iostream>', comment: '' },
            { text: 'int main() { std::cout << "Multi-file build OK" << std::endl; return 0; }', comment: '' }
        ]
    },
    'CPP-RECUR-01': {
        time: '45 phút',
        lines: [
            { text: '// Giải thuật Đệ quy & Phân tích Call Stack', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'long long factorial(int n) {', comment: '' },
            { text: '    if (n <= 1) return 1;', comment: '// Base case' },
            { text: '    return n * factorial(n - 1);', comment: '// Recursive call' },
            { text: '}', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    cout << "5! = " << factorial(5) << endl;', comment: '// 120' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-BACKTRACK-01': {
        time: '50 phút',
        lines: [
            { text: '// Kỹ thuật Quay lui (Backtracking) & Hoàn tác trạng thái', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: '#include <vector>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'void generateBinary(int n, string current) {', comment: '' },
            { text: '    if (current.length() == n) { cout << current << endl; return; }', comment: '' },
            { text: '    generateBinary(n, current + "0");', comment: '// Thuử nhánh 0' },
            { text: '    generateBinary(n, current + "1");', comment: '// Thử nhánh 1' },
            { text: '}', comment: '' },
            { text: 'int main() { generateBinary(3, ""); return 0; }', comment: '' }
        ]
    },
    'CPP-EXC-01': {
        time: '40 phút',
        lines: [
            { text: '// Quản lý ngoại lệ hệ thống & noexcept', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: '#include <stdexcept>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'double divide(double a, double b) {', comment: '' },
            { text: '    if (b == 0) throw runtime_error("Loi chia cho 0");', comment: '' },
            { text: '    return a / b;', comment: '' },
            { text: '}', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    try { divide(10, 0); }', comment: '' },
            { text: '    catch (const exception &e) { cout << "Caught: " << e.what() << endl; }', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },
    'CPP-CACHE-01': {
        time: '50 phút',
        lines: [
            { text: '// Tối ưu Cache Locality (Spatial & Temporal Locality)', comment: '' },
            { text: '#include <iostream>', comment: '' },
            { text: '#include <vector>', comment: '' },
            { text: 'using namespace std;', comment: '' },
            { text: 'int main() {', comment: '' },
            { text: '    const int N = 1000;', comment: '' },
            { text: '    vector<vector<int>> arr(N, vector<int>(N, 1));', comment: '' },
            { text: '    long long sum = 0;', comment: '' },
            { text: '    for (int i = 0; i < N; ++i)', comment: '// Row-major: Cache friendly' },
            { text: '        for (int j = 0; j < N; ++j)', comment: '' },
            { text: '            sum += arr[i][j];', comment: '// Tan dung Cache Line 64-byte' },
            { text: '    cout << "Sum: " << sum << endl;', comment: '' },
            { text: '    return 0;', comment: '' },
            { text: '}', comment: '' }
        ]
    },

    // ----------------- SQL SERVER -----------------
    'SQL-RDBMS-01': {
        time: '30 phút',
        lines: [
            { text: '-- Mô hình Quan hệ (RDBMS) & Khóa chính Khóa ngoại', comment: '' },
            { text: 'CREATE TABLE Students (', comment: '' },
            { text: '    StudentID INT PRIMARY KEY IDENTITY(1,1),', comment: '-- Primary Key' },
            { text: '    FullName NVARCHAR(100) NOT NULL,', comment: '' },
            { text: '    Email VARCHAR(100) UNIQUE,', comment: '' },
            { text: '    CreatedAt DATETIME DEFAULT GETDATE()', comment: '' },
            { text: ');', comment: '' }
        ]
    },
    'SQL-DQL-01': {
        time: '35 phút',
        lines: [
            { text: '-- Truy vấn DQL: SELECT, FROM, DISTINCT, Bí danh AS', comment: '' },
            { text: 'SELECT DISTINCT', comment: '-- Loai bo trung lap' },
            { text: '    StudentID AS MaHocVien,', comment: '-- Bi danh cot' },
            { text: '    FullName AS HoTen,', comment: '' },
            { text: '    Email', comment: '' },
            { text: 'FROM Students;', comment: '' }
        ]
    },
    'SQL-WHERE-01': {
        time: '40 phút',
        lines: [
            { text: '-- Mệnh đề lọc điều kiện WHERE và so khớp LIKE', comment: '' },
            { text: 'SELECT StudentID, FullName, Score', comment: '' },
            { text: 'FROM Students', comment: '' },
            { text: 'WHERE Score >= 8.0', comment: '-- Diem gioi' },
            { text: "  AND FullName LIKE N'Nguyễn%'", comment: '-- Ho Nguyen' },
            { text: '  AND Email IS NOT NULL;', comment: '' }
        ]
    },
    'SQL-LOGIC-01': {
        time: '40 phút',
        lines: [
            { text: '-- Toán tử Logic AND, OR, NOT & Mệnh đề IN, BETWEEN', comment: '' },
            { text: 'SELECT StudentID, FullName, Score', comment: '' },
            { text: 'FROM Students', comment: '' },
            { text: 'WHERE Score BETWEEN 7.0 AND 10.0', comment: '-- Khoang diem' },
            { text: '  AND DepartmentID IN (1, 2, 4);', comment: '-- Tap hop phong ban' }
        ]
    },
    'SQL-SORT-01': {
        time: '35 phút',
        lines: [
            { text: '-- Sắp xếp kết quả ORDER BY & Giới hạn TOP', comment: '' },
            { text: 'SELECT TOP 5', comment: '-- Lay top 5 hoc vien' },
            { text: '    StudentID,', comment: '' },
            { text: '    FullName,', comment: '' },
            { text: '    Score', comment: '' },
            { text: 'FROM Students', comment: '' },
            { text: 'ORDER BY Score DESC, FullName ASC;', comment: '-- Giam dan theo diem' }
        ]
    },
    'SQL-AGG-01': {
        time: '50 phút',
        lines: [
            { text: '-- Hàm tổng hợp COUNT/AVG & Gom nhóm GROUP BY / HAVING', comment: '' },
            { text: 'SELECT', comment: '' },
            { text: '    DepartmentID,', comment: '' },
            { text: '    COUNT(*) AS TotalStudents,', comment: '-- Tong so luong' },
            { text: '    ROUND(AVG(Score), 2) AS AverageScore', comment: '-- Diem trung binh' },
            { text: 'FROM Students', comment: '' },
            { text: 'GROUP BY DepartmentID', comment: '-- Gom nhom theo khoa' },
            { text: 'HAVING COUNT(*) >= 5;', comment: '-- Dieu kien sau gom nhom' }
        ]
    },
    'SQL-JOIN-01': {
        time: '55 phút',
        lines: [
            { text: '-- Liên kết đa bảng INNER JOIN & LEFT JOIN', comment: '' },
            { text: 'SELECT', comment: '' },
            { text: '    S.StudentID,', comment: '' },
            { text: '    S.FullName,', comment: '' },
            { text: '    C.CourseName,', comment: '' },
            { text: '    E.EnrollDate', comment: '' },
            { text: 'FROM Students S', comment: '' },
            { text: 'INNER JOIN Enrollments E ON S.StudentID = E.StudentID', comment: '' },
            { text: 'INNER JOIN Courses C ON E.CourseID = C.CourseID;', comment: '' }
        ]
    }
};

export const KnowledgeGraphTree: React.FC<KnowledgeGraphTreeProps> = ({
    userMastery,
    activeLanguage: propActiveLanguage = 'PYTHON',
    onLanguageChange,
    isLoading = false,
    activeModel: _activeModel,
    onModelChange: _onModelChange,
    overallScore,
    streakDays = 3,
    studentMeta,
    stats: _stats,
    isFullPage: _isFullPage = true
}) => {
    const navigate = useNavigate();
    const [internalLanguage, setInternalLanguage] = useState<SupportedLanguage>(propActiveLanguage);
    
    // Sync active language between props and state
    const activeLanguage = onLanguageChange ? propActiveLanguage : internalLanguage;
    const handleLanguageSelect = (lang: SupportedLanguage) => {
        if (onLanguageChange) {
            onLanguageChange(lang);
        } else {
            setInternalLanguage(lang);
        }
    };

    const currentLangConfig = LANGUAGE_CONFIGS[activeLanguage] || LANGUAGE_CONFIGS.PYTHON;

    // Pick active skill graph according to chosen language
    const graphData = useMemo(() => {
        switch (activeLanguage) {
            case 'JAVASCRIPT': return javascriptSkillGraph;
            case 'CPP': return cppSkillGraph;
            case 'SQL': return sqlSkillGraph;
            case 'PYTHON':
            default: return pythonSkillGraph;
        }
    }, [activeLanguage]);

    const [selectedTopicPill, setSelectedTopicPill] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedConceptId, setSelectedConceptId] = useState<string>(currentLangConfig.defaultConcept);
    const [hoveredConceptId, setHoveredConceptId] = useState<string | null>(null);
    const [isFocusMode, setIsFocusMode] = useState<boolean>(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const isDraggingRef = useRef<boolean>(false);
    const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({ x: 0, y: 0, panX: 0, panY: 0 });
    const hasMovedRef = useRef<boolean>(false);
    const [copiedSyntax, setCopiedSyntax] = useState<boolean>(false);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const [executionOutput, setExecutionOutput] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // List of skills and edges for the active graph
    const allSkills = useMemo(() => graphData.skills || [], [graphData]);
    const allEdges = useMemo(() => graphData.edges || [], [graphData]);

    // Map skill ID to concept object
    const skillMap = useMemo(() => {
        const map = new Map<string, any>();
        allSkills.forEach((s: any) => map.set(s.id, s));
        return map;
    }, [allSkills]);

    // Auto-select valid concept if active language changes
    useEffect(() => {
        if (!skillMap.has(selectedConceptId)) {
            setSelectedConceptId(currentLangConfig.defaultConcept);
        }
        setSelectedTopicPill('ALL');
        setExecutionOutput(null);
        setPan({ x: 0, y: 0 });
        setZoomLevel(1);
    }, [activeLanguage, skillMap, currentLangConfig]);

    // Active concept being inspected in the Right Drawer
    const activeConcept = useMemo(() => {
        return skillMap.get(selectedConceptId) || allSkills[0] || null;
    }, [skillMap, selectedConceptId, allSkills]);

    // Topic Filter pills for the active language
    const currentTopicPills = useMemo(() => {
        return TOPIC_PILLS_BY_LANG[activeLanguage] || TOPIC_PILLS_BY_LANG.PYTHON;
    }, [activeLanguage]);

    // Filter skills by topic pill & search
    const filteredSkills = useMemo(() => {
        return allSkills.filter((skill: any) => {
            let matchesFilter = true;
            if (selectedTopicPill !== 'ALL') {
                if (selectedTopicPill.startsWith('MOD-')) {
                    matchesFilter = skill.module_id === selectedTopicPill;
                } else if (selectedTopicPill.startsWith('TOPIC-')) {
                    matchesFilter = skill.topic_id === selectedTopicPill;
                } else if (selectedTopicPill === 'ADVANCED') {
                    matchesFilter = skill.difficulty_level >= 3;
                }
            }
            const query = searchQuery.trim().toLowerCase();
            const matchesSearch = !query || 
                skill.concept_id.toLowerCase().includes(query) ||
                skill.concept_name.toLowerCase().includes(query) ||
                (skill.associated_errors || []).some((err: string) => err.toLowerCase().includes(query));
            
            return matchesFilter && matchesSearch;
        });
    }, [allSkills, selectedTopicPill, searchQuery]);

    // Mastery status & styling calculation
    const getConceptStatus = (skillId: string) => {
        const score = userMastery[skillId] ?? 0.53;
        const pct = Math.round(score * 100);
        
        if (score >= 0.75) {
            return {
                status: 'COMPLETED',
                legend: 'COMPLETED',
                label: 'Đã hoàn thành',
                badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
                iconColor: 'bg-blue-600 text-white',
                dotColor: 'bg-blue-600',
                ringColor: '#2563EB',
                border: 'border-blue-200 hover:border-blue-400',
                pct
            };
        } else if (score >= 0.50) {
            return {
                status: 'IN_PROGRESS',
                legend: 'IN_PROGRESS',
                label: '⚡ Đang rèn luyện (ZPD)',
                badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
                iconColor: 'bg-emerald-500 text-white',
                dotColor: 'bg-emerald-500',
                ringColor: '#10B981',
                border: 'border-slate-200 hover:border-blue-400',
                pct
            };
        } else if (score >= 0.35) {
            return {
                status: 'RECOMMENDED',
                legend: 'RECOMMENDED',
                label: '🟣 Đề xuất tiếp theo',
                badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
                iconColor: 'bg-purple-600 text-white',
                dotColor: 'bg-purple-600',
                ringColor: '#8B5CF6',
                border: 'border-purple-200 hover:border-purple-400',
                pct
            };
        } else {
            return {
                status: 'LOCKED',
                legend: 'LOCKED',
                label: 'Chưa mở khóa',
                badgeBg: 'bg-slate-100 text-slate-500 border-slate-200',
                iconColor: 'bg-slate-300 text-slate-600',
                dotColor: 'bg-slate-400',
                ringColor: '#CBD5E1',
                border: 'border-slate-200 hover:border-slate-300 opacity-80',
                pct
            };
        }
    };

    // Stage groups for active language
    const currentStageMetadata = useMemo(() => {
        return STAGE_METADATA_BY_LANG[activeLanguage] || STAGE_METADATA_BY_LANG.PYTHON;
    }, [activeLanguage]);

    const currentModuleToStage = useMemo(() => {
        return MODULE_TO_STAGE_BY_LANG[activeLanguage] || MODULE_TO_STAGE_BY_LANG.PYTHON;
    }, [activeLanguage]);

    const stageGroups = useMemo(() => {
        const stageCount = Object.keys(currentStageMetadata).length;
        const groups: Record<number, any[]> = {};
        for (let i = 0; i < stageCount; i++) groups[i] = [];

        filteredSkills.forEach((skill: any) => {
            const stage = (skill.stage !== undefined && skill.stage !== null) 
                ? skill.stage 
                : (currentModuleToStage[skill.module_id] ?? 0);
            if (!groups[stage]) groups[stage] = [];
            groups[stage].push(skill);
        });
        return groups;
    }, [filteredSkills, currentStageMetadata, currentModuleToStage]);

    // Grid coordinates layout for nodes (Spacious 330px columns with 70px gutters)
    const nodeLayout = useMemo(() => {
        const positions = new Map<string, { x: number; y: number; stage: number; row: number }>();
        const colWidth = 330;
        const rowHeight = 138;
        const startX = 25;
        const startY = 115;

        Object.keys(stageGroups).forEach((stageStr) => {
            const stage = Number(stageStr);
            const skillsInStage = stageGroups[stage] || [];
            skillsInStage.forEach((skill: any, idx: number) => {
                positions.set(skill.id, {
                    x: startX + stage * colWidth,
                    y: startY + idx * rowHeight,
                    stage,
                    row: idx
                });
            });
        });

        return positions;
    }, [stageGroups]);

    // Visible edges connecting nodes
    const visibleEdges = useMemo(() => {
        return allEdges.filter((edge: any) => {
            return nodeLayout.has(edge.source) && nodeLayout.has(edge.target);
        });
    }, [allEdges, nodeLayout]);

    // Active highlight concept ID (hover takes temporary precedence over selected)
    const activeHighlightId = useMemo(() => {
        return hoveredConceptId || selectedConceptId;
    }, [hoveredConceptId, selectedConceptId]);

    // Prerequisite edges leading into the active concept
    const activePrereqEdges = useMemo(() => {
        if (!activeHighlightId) return [];
        return visibleEdges.filter((e: any) => e.target === activeHighlightId);
    }, [visibleEdges, activeHighlightId]);

    // Outgoing edges unlocking from the active concept
    const activeUnlockEdges = useMemo(() => {
        if (!activeHighlightId) return [];
        return visibleEdges.filter((e: any) => e.source === activeHighlightId);
    }, [visibleEdges, activeHighlightId]);

    // Sort edges so active/highlighted connections render on top of background lines
    const sortedVisibleEdges = useMemo(() => {
        return [...visibleEdges].sort((a, b) => {
            const aRelated = a.source === activeHighlightId || a.target === activeHighlightId;
            const bRelated = b.source === activeHighlightId || b.target === activeHighlightId;
            if (aRelated === bRelated) return 0;
            return aRelated ? 1 : -1;
        });
    }, [visibleEdges, activeHighlightId]);

    // Recommended next concept in DAG
    const recommendedNextConcept = useMemo(() => {
        if (!activeConcept) return null;
        const outgoing = allEdges.filter((e: any) => e.source === activeConcept.id);
        if (outgoing.length > 0) {
            return skillMap.get(outgoing[0].target) || null;
        }
        const idx = allSkills.findIndex((s: any) => s.id === activeConcept.id);
        if (idx >= 0 && idx + 1 < allSkills.length) {
            return allSkills[idx + 1];
        }
        return null;
    }, [activeConcept, allEdges, skillMap, allSkills]);

    // Rich code snippet for selected concept
    const currentCodeSnippet = useMemo(() => {
        if (!activeConcept) return null;
        if (CONCEPT_CODE_SNIPPETS[activeConcept.id]) {
            return CONCEPT_CODE_SNIPPETS[activeConcept.id];
        }
        
        // Smart fallback syntax generator
        if (activeLanguage === 'JAVASCRIPT') {
            return {
                time: '45 phút',
                lines: [
                    { text: `// Ví dụ mẫu: ${activeConcept.concept_name}`, comment: '' },
                    { text: `function demo_${activeConcept.concept_id.toLowerCase().replace(/[^a-z0-9]/g, '_')}() {`, comment: '' },
                    { text: `    const result = { concept: "${activeConcept.concept_id}", status: "OK" };`, comment: '' },
                    { text: `    console.log("[JS Result]:", result);`, comment: '' },
                    { text: `}`, comment: '' },
                    { text: `demo_${activeConcept.concept_id.toLowerCase().replace(/[^a-z0-9]/g, '_')}();`, comment: '' }
                ]
            };
        } else if (activeLanguage === 'CPP') {
            return {
                time: '45 phút',
                lines: [
                    { text: `// Vi du minh hoa: ${activeConcept.concept_name}`, comment: '' },
                    { text: '#include <iostream>', comment: '' },
                    { text: 'using namespace std;', comment: '' },
                    { text: 'int main() {', comment: '' },
                    { text: `    cout << "Chay thanh cong concept: ${activeConcept.concept_id}" << endl;`, comment: '' },
                    { text: '    return 0;', comment: '' },
                    { text: '}', comment: '' }
                ]
            };
        } else if (activeLanguage === 'SQL') {
            return {
                time: '35 phút',
                lines: [
                    { text: `-- Truy vấn mẫu: ${activeConcept.concept_name}`, comment: '' },
                    { text: 'SELECT TOP 10', comment: '' },
                    { text: '    ID, Name, CreatedAt', comment: '' },
                    { text: `FROM KnowledgeBase_${activeConcept.concept_id.replace(/[^A-Za-z0-9]/g, '')}`, comment: '' },
                    { text: 'ORDER BY ID DESC;', comment: '' }
                ]
            };
        } else {
            return {
                time: '45 phút',
                lines: [
                    { text: `# Ví dụ minh họa: ${activeConcept.concept_name}`, comment: '' },
                    { text: `def execute_${activeConcept.concept_id.toLowerCase().replace(/-/g, '_')}():`, comment: '# Khởi tạo' },
                    { text: `    status = "Mastered"`, comment: '# Trạng thái' },
                    { text: `    print(f"Hoàn thành kiến thức {status}")`, comment: '' },
                    { text: ``, comment: '' },
                    { text: `execute_${activeConcept.concept_id.toLowerCase().replace(/-/g, '_')}()`, comment: '' }
                ]
            };
        }
    }, [activeConcept, activeLanguage]);

    // Smooth wheel panning & Ctrl+wheel zooming
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
                setZoomLevel(prev => Math.min(Math.max(Number((prev + zoomDelta).toFixed(2)), 0.5), 1.5));
            } else {
                setPan(prev => ({
                    x: prev.x - e.deltaX,
                    y: prev.y - e.deltaY
                }));
            }
        };

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, []);

    // Free canvas drag-to-pan handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only left click
        isDraggingRef.current = true;
        hasMovedRef.current = false;
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            panX: pan.x,
            panY: pan.y
        };
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            hasMovedRef.current = true;
        }
        setPan({
            x: dragStartRef.current.panX + dx,
            y: dragStartRef.current.panY + dy
        });
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
    };

    // Copy code snippet
    const handleCopyCode = () => {
        if (!currentCodeSnippet) return;
        const rawCode = currentCodeSnippet.lines.map(l => l.text + (l.comment ? `  ${l.comment}` : '')).join('\n');
        navigator.clipboard.writeText(rawCode);
        setCopiedSyntax(true);
        setTimeout(() => setCopiedSyntax(false), 2000);
    };

    // Run simulated code
    const handleRunCode = () => {
        setIsExecuting(true);
        setExecutionOutput(null);
        setTimeout(() => {
            setIsExecuting(false);
            if (activeLanguage === 'JAVASCRIPT') {
                if (activeConcept.id === 'JS-BASICS-01') {
                    setExecutionOutput('[Node.js v20.11.0]: Thực thi thành công\n>>> [PyLearn JS] Xin chào Nguyễn Tuấn Việt!\n>>> Điểm số hiện tại: 95/100\n>>> Process exited with code 0 (0.02s)');
                } else if (activeConcept.id === 'JS-TYPES-01') {
                    setExecutionOutput('[Node.js v20.11.0]: Kiểm tra kiểu dữ liệu\n>>> Kiểm tra type: number boolean\n>>> 5 == "5": true\n>>> 5 === "5": false\n>>> Process exited with code 0 (0.01s)');
                } else {
                    setExecutionOutput(`[Node.js v20.11.0]: Thực thi mẫu ${activeConcept.concept_name}\n>>> Output: [JS Result]: { concept: '${activeConcept.concept_id}', status: 'OK' }\n>>> Process exited with code 0.`);
                }
            } else if (activeLanguage === 'CPP') {
                if (activeConcept.id === 'CPP-BASICS-01') {
                    setExecutionOutput('[g++ 13.2.0 -O2]: Biên dịch thành công (0.08s)\n>>> Output:\nXin chao Nguyen Tuan Viet, GPA: 3.85\n>>> Return code: 0');
                } else if (activeConcept.id === 'CPP-LOOP-01') {
                    setExecutionOutput('[g++ 13.2.0 -O2]: Biên dịch thành công\n>>> Output:\n17 la so nguyen to: true\n>>> Execution time: 0.003s');
                } else {
                    setExecutionOutput(`[g++ 13.2.0 -O2]: Thực thi ${activeConcept.concept_name}\n>>> Output: Chay thanh cong concept: ${activeConcept.concept_id}\n>>> Return code: 0`);
                }
            } else if (activeLanguage === 'SQL') {
                if (activeConcept.id === 'SQL-DQL-01') {
                    setExecutionOutput('(3 rows affected)\nMaHocVien | HoTen            | Email\n----------+------------------+--------------------\n101       | Nguyễn Tuấn Việt | viet@example.com\n102       | Trần Minh Anh    | minhanh@pylearn.vn\n103       | Lê Hoàng Nam     | namlh@pylearn.vn\n>>> Query executed successfully in 0.014s');
                } else {
                    setExecutionOutput(`(5 rows affected)\nID  | Status    | ExecutionDate\n----+-----------+------------------------\n1   | COMPLETED | 2026-09-13 15:30:00.000\n2   | VERIFIED  | 2026-09-13 15:30:01.120\n>>> Truy vấn đạt chuẩn chỉ số RDBMS.`);
                }
            } else {
                if (activeConcept.id === 'PY-BASICS-02') {
                    setExecutionOutput('Python 18 9.5 True\n>>> Chương trình kết thúc với mã 0 (0.04s)');
                } else {
                    setExecutionOutput(`[Python 3.11]: Thực thi mẫu ${activeConcept.concept_name}\n>>> Kết quả kiểm tra đạt tiêu chuẩn ZPD.`);
                }
            }
        }, 600);
    };

    // Adaptive personalized study routing
    const handleStartPractice = () => {
        if (!activeConcept) return;
        navigate('/personalized-path', {
            state: { 
                initialPrompt: `Tôi muốn luyện tập chuyên sâu về chủ đề ${activeConcept.concept_name} (${activeConcept.concept_id}) trong ngôn ngữ ${currentLangConfig.name}`,
                targetConceptId: activeConcept.concept_id,
                language: activeLanguage
            }
        });
    };

    return (
        <div className="w-full flex-1 flex flex-col font-sans bg-[#F4F7FC] text-slate-800 antialiased selection:bg-blue-500 selection:text-white pb-6">
            
            {/* ========================================================================= */}
            {/* 0. MULTI-LANGUAGE NAVIGATION SWITCHER BAR                                */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200/80 mb-3.5 flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5 min-w-max">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ngôn ngữ tri thức:</span>
                    </span>
                    {(Object.keys(LANGUAGE_CONFIGS) as SupportedLanguage[]).map((langKey) => {
                        const isSelected = activeLanguage === langKey;
                        const cfg = LANGUAGE_CONFIGS[langKey];
                        return (
                            <button
                                key={langKey}
                                onClick={() => handleLanguageSelect(langKey)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                    isSelected
                                        ? cfg.activeTabClass
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                                }`}
                            >
                                <LanguageLogoIcon language={langKey} className="w-4 h-4 shrink-0" />
                                <span>{cfg.name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {allSkills.length && activeLanguage === langKey ? `${allSkills.length} KCs` : cfg.badge.split(' • ')[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="hidden lg:flex items-center gap-2 pr-3 text-[11px] font-semibold text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Hệ thống Đồ thị Thích ứng PAL-Net 2.0</span>
                </div>
            </div>

            {/* Inner Content Area: Show loading inside when switching languages */}
            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[580px] bg-white rounded-2xl border border-slate-200/80 shadow-xs p-10 animate-fadeIn my-auto">
                    <div className="relative mb-5">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentLangConfig.accentGradient} flex items-center justify-center text-white shadow-md p-3.5`}>
                            <LanguageLogoIcon language={activeLanguage} className="w-full h-full" />
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shadow-xs">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-base md:text-lg font-extrabold text-slate-900 m-0 tracking-tight">
                        Đang tải bản đồ tri thức {currentLangConfig.name}...
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 m-0 font-medium text-center max-w-sm">
                        Đang đồng bộ dữ liệu kỹ năng, chỉ số thành thạo và đồ thị DAG
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-[11px] font-mono font-bold text-slate-400 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/70">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Hệ thống Đồ thị Thích ứng PAL-Net 2.0</span>
                    </div>
                </div>
            ) : (
                <>
            {/* ========================================================================= */}
            {/* 1. STUDENT IDENTITY & OVERALL STATS HERO CARD (Header Card)              */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xs border border-slate-200/80 mb-3.5 flex flex-wrap items-center justify-between gap-4">
                {/* Left: User Avatar & Persona */}
                <div className="flex items-center gap-3.5 min-w-[280px]">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentLangConfig.accentGradient} flex items-center justify-center text-white shadow-xs p-2.5 shrink-0`}>
                        <LanguageLogoIcon language={activeLanguage} className="w-full h-full" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight m-0">
                                {studentMeta?.username || 'Nguyễn Tuấn Việt'}
                            </h2>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${currentLangConfig.activeBgClass}`}>
                                {currentLangConfig.name}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                            {currentLangConfig.subtitle}
                        </p>
                    </div>
                </div>

                {/* Middle: 4 Key Statistics Columns */}
                <div className="flex items-center gap-6 lg:gap-8 flex-wrap">
                    {/* Stat 1: Khóa học đang học */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-500 font-medium block">Khóa học đang học</span>
                            <span className="text-xs md:text-sm font-extrabold text-slate-900 block">
                                {currentLangConfig.courseTitle}
                            </span>
                        </div>
                    </div>

                    {/* Stat 2: Tiến độ tổng */}
                    <div className="flex flex-col justify-center min-w-[120px]">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] text-slate-500 font-medium">Tiến độ tổng</span>
                            <span className="text-xs font-extrabold text-blue-600">
                                {Math.max(32, Math.round(overallScore * 100))}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full bg-gradient-to-r ${currentLangConfig.accentGradient} rounded-full transition-all duration-500`} 
                                style={{ width: `${Math.max(32, Math.round(overallScore * 100))}%` }}
                            />
                        </div>
                    </div>

                    {/* Stat 3: Streak hôm nay */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
                            <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-500 font-medium block">Streak hôm nay</span>
                            <span className="text-xs md:text-sm font-extrabold text-slate-900 block">
                                {streakDays || 3} ngày
                            </span>
                        </div>
                    </div>

                    {/* Stat 4: Kỹ năng mục tiêu */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-500 font-medium block">Quy mô đồ thị</span>
                            <span className="text-xs md:text-sm font-extrabold text-slate-900 block">
                                {allSkills.length} KCs • {allEdges.length} Cạnh
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Cute Mascot Banner Illustration */}
                <div className="hidden xl:flex items-center shrink-0 pl-2">
                    <MascotWavingBannerIllustration speechText={`Luyện ${currentLangConfig.name} nhé! 💙`} />
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. TOPIC FILTER PILLS BAR & SEARCH INPUT                                  */}
            {/* ========================================================================= */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                {/* Horizontal Scrollable Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none text-xs">
                    {currentTopicPills.map((pill) => {
                        const isSelected = selectedTopicPill === pill.id;
                        return (
                            <button
                                key={pill.id}
                                onClick={() => setSelectedTopicPill(pill.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer shadow-xs flex items-center gap-1.5 ${
                                    isSelected
                                        ? `${currentLangConfig.activeTabClass} font-bold`
                                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {pill.id === 'ALL' && <Layers className="w-3.5 h-3.5" />}
                                <span>{pill.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar + Settings Filter Button */}
                <div className="flex items-center gap-2 min-w-[260px] sm:w-80">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder={`Tìm concept ${currentLangConfig.name}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 shadow-xs transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <button 
                        className="p-2 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs cursor-pointer transition-all"
                        title="Bộ lọc nâng cao"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 3. MAIN WORKSPACE: INTERACTIVE CANVAS + SLIDE-OUT DETAIL DRAWER           */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex-1 flex flex-col overflow-hidden min-h-[660px]">
                
                {/* 3.1 Canvas Top Header: Title & 4 Color Status Legends */}
                <div className="px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white z-10">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${currentLangConfig.activeBgClass} flex items-center justify-center`}>
                            <LanguageLogoIcon language={activeLanguage} className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 m-0 flex items-center gap-1.5">
                            Bản đồ tri thức {currentLangConfig.name}
                            <span title={`Đồ thị tri thức DAG định hướng năng lực lập trình ${currentLangConfig.name} cá nhân hóa theo vùng nhận thức (ZPD).`}>
                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </span>
                        </h3>
                    </div>

                    {/* Status & Path Legends with Focus Mode Switch */}
                    <div className="flex items-center gap-4 text-xs text-slate-600 font-medium flex-wrap">
                        {/* 4 Status Node Badges */}
                        <div className="flex items-center gap-3.5 text-[11px]">
                            <div className="flex items-center gap-1.5" title="Kỹ năng đang học">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                                <span>Đang học</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Kỹ năng đã hoàn thành">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-200" />
                                <span>Đã đạt</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Kỹ năng chưa mở khóa">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-slate-200" />
                                <span>Chưa mở</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Đề xuất học tiếp theo">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-purple-200" />
                                <span>Đề xuất</span>
                            </div>
                        </div>

                        {/* Learning Path Indicators */}
                        <div className="h-4 w-px bg-slate-200 hidden md:block" />
                        <div className="hidden md:flex items-center gap-2 text-[11px] font-semibold">
                            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200" title="Đường màu xanh lá: Kỹ năng cần có trước (Prerequisites)">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Tiền đề {activePrereqEdges.length > 0 ? `(${activePrereqEdges.length})` : ''}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200" title="Đường màu xanh dương: Kỹ năng sẽ được mở khóa tiếp theo (Next Unlocks)">
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                <span>Mở khóa {activeUnlockEdges.length > 0 ? `(${activeUnlockEdges.length})` : ''}</span>
                            </div>
                        </div>

                        {/* Focus Mode Toggle */}
                        <button
                            onClick={() => setIsFocusMode(prev => !prev)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                isFocusMode
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                            }`}
                            title={isFocusMode ? "Chế độ tập trung: Chỉ làm nổi bật đường đi kỹ năng đang chọn để tránh rối mắt" : "Hiển thị toàn bộ tất cả đường liên kết trên đồ thị"}
                        >
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span>{isFocusMode ? 'Đường đi tập trung' : 'Hiện tất cả liên kết'}</span>
                        </button>

                        {/* Quick Toggle Panel Button */}
                        <div className="h-4 w-px bg-slate-200 ml-1 hidden sm:block" />
                        <button
                            onClick={() => setIsDrawerOpen(prev => !prev)}
                            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                isDrawerOpen 
                                    ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900' 
                                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-2xs'
                            }`}
                            title={isDrawerOpen ? "Thu gọn bảng chi tiết" : "Mở bảng chi tiết bài học"}
                        >
                            {isDrawerOpen ? <PanelRightClose className="w-3.5 h-3.5 text-slate-500" /> : <PanelRightOpen className="w-3.5 h-3.5 text-blue-600" />}
                            <span>{isDrawerOpen ? 'Thu gọn' : 'Chi tiết'}</span>
                        </button>
                    </div>
                </div>

                {/* 3.2 Split View: Left Graph Canvas & Right Detail Drawer */}
                <div className="relative flex-1 flex overflow-hidden">
                    
                    {/* Visual Canvas Area */}
                    <div 
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className={`flex-1 overflow-hidden p-6 relative bg-[#FAFBFD] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] select-none transition-colors ${
                            isDragging ? 'cursor-grabbing' : 'cursor-grab'
                        }`}
                        style={{
                            backgroundPosition: `${pan.x}px ${pan.y}px`
                        }}
                    >
                        {/* Floating Pan Navigation Hint */}
                        <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-xs border border-slate-200/80 shadow-2xs text-[11px] font-semibold text-slate-500 select-none">
                            <Move className="w-3.5 h-3.5 text-blue-600" />
                            <span>Giữ chuột trái để di chuyển tự do</span>
                        </div>

                        <div 
                            className="relative pb-16 will-change-transform"
                            style={{ 
                                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                                transformOrigin: '0 0',
                                minWidth: selectedTopicPill === 'ALL' ? (activeLanguage === 'SQL' ? '1750px' : '2050px') : '1050px',
                                minHeight: '940px',
                                transition: isDragging ? 'none' : 'transform 0.12s ease-out'
                            }}
                        >
                            {/* Stage Headers on Top of Canvas */}
                            <div className="absolute top-0 left-0 w-full pointer-events-none z-10">
                                {Object.entries(currentStageMetadata).map(([stageNum, meta]) => {
                                    const s = Number(stageNum);
                                    const count = (stageGroups[s] || []).length;
                                    if (count === 0 && selectedTopicPill !== 'ALL') return null;
                                    return (
                                        <div 
                                            key={s} 
                                            style={{ 
                                                position: 'absolute', 
                                                left: `${25 + s * 330}px`, 
                                                top: '8px', 
                                                width: '260px' 
                                            }}
                                            className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col gap-0.5 select-none"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                                                    {meta.tag}
                                                </span>
                                                <span className="text-[10px] font-semibold text-slate-400">
                                                    {count} bài học
                                                </span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900 truncate m-0 mt-1">
                                                {meta.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-500 truncate m-0">
                                                {meta.subtitle}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* SVG Prerequisite & Progression Connecting Graph */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                                <defs>
                                    {/* Default Slate Arrow for background paths (Non-piercing userSpaceOnUse) */}
                                    <marker id="arrowDim" markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                                        <path d="M1,1 L5.5,3 L1,5 z" fill="#94A3B8" />
                                    </marker>
                                    {/* Prerequisite Arrow (Incoming to selected concept) -> Emerald Green */}
                                    <marker id="arrowPrereq" markerWidth="7" markerHeight="7" refX="6.5" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
                                        <path d="M1,1 L6.5,3.5 L1,6 z" fill="#10B981" />
                                    </marker>
                                    {/* Next Unlock Arrow (Outgoing from selected concept) -> Royal Blue */}
                                    <marker id="arrowNext" markerWidth="7" markerHeight="7" refX="6.5" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
                                        <path d="M1,1 L6.5,3.5 L1,6 z" fill="#2563EB" />
                                    </marker>
                                    {/* Glow Filter for Active Focus Paths */}
                                    <filter id="glowPrereq" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.4" />
                                    </filter>
                                    <filter id="glowNext" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#2563EB" floodOpacity="0.4" />
                                    </filter>
                                </defs>

                                {sortedVisibleEdges.map((edge: any, idx: number) => {
                                    const srcPos = nodeLayout.get(edge.source);
                                    const tgtPos = nodeLayout.get(edge.target);
                                    if (!srcPos || !tgtPos) return null;

                                    const cardW = 260;
                                    const cardH = 92;

                                    const isPrereq = edge.target === activeHighlightId; // Source is required before active
                                    const isUnlock = edge.source === activeHighlightId; // Target unlocks after active
                                    const isRelated = isPrereq || isUnlock;

                                    let pathD = '';

                                    // Case 1: Same column, adjacent nodes (tgt directly below src: diff === 1)
                                    // Flow: Bottom center of upper card -> Top center of lower card
                                    if (srcPos.stage === tgtPos.stage && tgtPos.row - srcPos.row === 1) {
                                        const x1 = srcPos.x + cardW / 2;
                                        const y1 = srcPos.y + cardH;
                                        const x2 = tgtPos.x + cardW / 2;
                                        const y2 = tgtPos.y - 2; // Tip lands right at top border
                                        pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
                                    }
                                    // Case 2: Same column, non-adjacent jump nodes (tgt is > 1 row below src)
                                    // Flow: Right center of src -> Curves through the 70px right gutter -> Right center of tgt
                                    else if (srcPos.stage === tgtPos.stage && tgtPos.row > srcPos.row) {
                                        const diff = tgtPos.row - srcPos.row;
                                        const x1 = srcPos.x + cardW;
                                        const y1 = srcPos.y + cardH / 2;
                                        const channelOffset = 16 + Math.min(diff, 4) * 8; // Smooth bypass arc
                                        const xMid = srcPos.x + cardW + channelOffset;
                                        const x2 = tgtPos.x + cardW + 2; // Tip lands right at right border
                                        const y2 = tgtPos.y + cardH / 2;
                                        pathD = `M ${x1} ${y1} C ${xMid} ${y1}, ${xMid} ${y2}, ${x2} ${y2}`;
                                    }
                                    // Case 3: Cross-stage forward nodes (from earlier stage column to later stage column)
                                    // Flow: Right center of src -> Horizontal S-curve -> Left center of tgt
                                    else if (tgtPos.stage > srcPos.stage) {
                                        const x1 = srcPos.x + cardW;
                                        const y1 = srcPos.y + cardH / 2;
                                        const x2 = tgtPos.x - 2; // Tip lands right at left border
                                        const y2 = tgtPos.y + cardH / 2;
                                        const dx = Math.max(35, (x2 - x1) * 0.45);
                                        pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
                                    }
                                    // Fallback: Safe curve
                                    else {
                                        const x1 = srcPos.x + cardW;
                                        const y1 = srcPos.y + cardH / 2;
                                        const x2 = tgtPos.x - 2;
                                        const y2 = tgtPos.y + cardH / 2;
                                        const dx = Math.max(30, Math.abs(x2 - x1) * 0.4);
                                        pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
                                    }

                                    const strokeColor = isPrereq ? '#10B981' : (isUnlock ? '#2563EB' : '#94A3B8');
                                    const markerId = isPrereq ? 'url(#arrowPrereq)' : (isUnlock ? 'url(#arrowNext)' : 'url(#arrowDim)');
                                    const strokeWidth = isRelated ? 2.5 : 1.3;
                                    const strokeDash = isRelated ? undefined : '4 3';
                                    const opacity = isFocusMode ? (isRelated ? 1 : 0.18) : (isRelated ? 1 : 0.65);
                                    const filter = isPrereq ? 'url(#glowPrereq)' : (isUnlock ? 'url(#glowNext)' : undefined);

                                    return (
                                        <path
                                            key={`${edge.source}-${edge.target}-${idx}`}
                                            d={pathD}
                                            fill="none"
                                            stroke={strokeColor}
                                            strokeWidth={strokeWidth}
                                            markerEnd={markerId}
                                            strokeDasharray={strokeDash}
                                            opacity={opacity}
                                            filter={filter}
                                            className="transition-all duration-300"
                                        />
                                    );
                                })}
                            </svg>

                            {/* Concept Nodes Grid */}
                            <div className="relative z-10">
                                {filteredSkills.map((skill: any) => {
                                    const pos = nodeLayout.get(skill.id);
                                    if (!pos) return null;

                                    const { label, ringColor, pct } = getConceptStatus(skill.id);
                                    const isSelected = selectedConceptId === skill.id;
                                    const isPrereqOfActive = activePrereqEdges.some((e: any) => e.source === skill.id);
                                    const isUnlockOfActive = activeUnlockEdges.some((e: any) => e.target === skill.id);
                                    const hasError = (skill.associated_errors || []).length > 0;
                                    const primaryError = hasError ? skill.associated_errors[0].split(':')[0] : null;

                                    return (
                                        <div
                                            key={skill.id}
                                            onClick={() => {
                                                if (hasMovedRef.current) return;
                                                setSelectedConceptId(skill.id);
                                                setIsDrawerOpen(true);
                                            }}
                                            onMouseEnter={() => setHoveredConceptId(skill.id)}
                                            onMouseLeave={() => setHoveredConceptId(null)}
                                            style={{
                                                position: 'absolute',
                                                left: `${pos.x}px`,
                                                top: `${pos.y}px`,
                                                width: '260px'
                                            }}
                                            className={`group rounded-xl p-3 bg-white border transition-all duration-200 cursor-pointer select-none shadow-xs ${
                                                isSelected 
                                                    ? `${currentLangConfig.activeBorderClass} shadow-md scale-[1.02] z-30 ring-2 ring-blue-500/20` 
                                                    : isPrereqOfActive
                                                    ? 'border-emerald-400 ring-2 ring-emerald-400/25 bg-emerald-50/15 shadow-xs z-20 hover:scale-[1.01]'
                                                    : isUnlockOfActive
                                                    ? 'border-blue-400 ring-2 ring-blue-400/25 bg-blue-50/15 shadow-xs z-20 hover:scale-[1.01]'
                                                    : 'border-slate-200/90 hover:border-blue-300 hover:shadow-sm'
                                            }`}
                                        >
                                            {/* Top Row: Concept ID with Icon + Relationship Tag / Error Tag */}
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                                        <LanguageLogoIcon language={activeLanguage} className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">
                                                        {skill.concept_id}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {isPrereqOfActive && !isSelected && (
                                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100/90 text-emerald-800 border border-emerald-300">
                                                            Tiền đề
                                                        </span>
                                                    )}
                                                    {isUnlockOfActive && !isSelected && (
                                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100/90 text-blue-800 border border-blue-300">
                                                            Mở khóa
                                                        </span>
                                                    )}
                                                    {primaryError && (
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                                                            {primaryError}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Middle Row: Concept Title */}
                                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors m-0">
                                                {skill.concept_name}
                                            </h4>

                                            {/* Bottom Row: Status Badge + Donut Percentage Ring */}
                                            <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
                                                <span className="text-[10px] font-medium text-amber-600 truncate">
                                                    {label}
                                                </span>

                                                {/* Donut Progress Ring */}
                                                <div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                        <path
                                                            className="text-slate-100"
                                                            strokeWidth="3.5"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        />
                                                        <path
                                                            strokeDasharray={`${pct}, 100`}
                                                            strokeWidth="3.5"
                                                            strokeLinecap="round"
                                                            stroke={ringColor}
                                                            fill="none"
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        />
                                                    </svg>
                                                    <span className="absolute text-[8px] font-bold font-mono text-slate-700">
                                                        {pct}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* 3.3 SLIDE-OUT CONCEPT DETAIL DRAWER (Right Inspector Panel)                */}
                    {/* ========================================================================= */}
                    {/* Floating Toggle Button to reopen Drawer when collapsed */}
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1.5 py-3.5 px-2 rounded-l-xl bg-white border-y border-l border-slate-200/90 shadow-md hover:shadow-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-all duration-300 cursor-pointer group ${
                            isDrawerOpen ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
                        }`}
                        title="Mở bảng chi tiết bài học"
                    >
                        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
                        <div className="flex flex-col items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                            <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-bold text-slate-600 group-hover:text-blue-600 tracking-wider select-none">
                                Chi tiết bài học
                            </span>
                        </div>
                    </button>

                    {activeConcept && (
                        <aside
                            aria-label="Chi tiết bài học"
                            className={`w-[360px] lg:w-[400px] border-l border-slate-200/90 bg-white p-5 flex flex-col justify-between overflow-y-auto shadow-xl z-20 shrink-0 transition-all duration-300 ease-in-out ${
                                isDrawerOpen 
                                    ? 'mr-0 opacity-100 visible' 
                                    : '-mr-[360px] lg:-mr-[400px] opacity-0 invisible pointer-events-none'
                            }`}
                        >
                            <div className="space-y-4">
                                
                                {/* Header: Status Pill + Concept ID + Close Button */}
                                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                                            Đang học
                                        </span>
                                        <span className="text-xs text-slate-400 font-semibold">
                                            {currentLangConfig.name} • {activeConcept.concept_id}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                        title="Thu gọn bảng chi tiết"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Concept Title */}
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight m-0">
                                        {activeConcept.concept_name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed m-0">
                                        {activeConcept.description || `Nắm vững lý thuyết, cấu trúc cú pháp và phương pháp áp dụng thực tiễn của ${activeConcept.concept_name} trong lập trình ${currentLangConfig.name}.`}
                                    </p>
                                </div>

                                {/* 3-Column Metrics Card: Độ khó | Thời lượng | Tiến độ */}
                                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    {/* Độ khó */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                                            <BarChart2 className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-medium">Độ khó</span>
                                            <span className="text-xs font-bold text-slate-800">
                                                {activeConcept.difficulty_level <= 1 ? 'Dễ' : activeConcept.difficulty_level === 2 ? 'Vừa sức' : 'Nâng cao'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Thời lượng */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-medium">Thời lượng</span>
                                            <span className="text-xs font-bold text-slate-800">
                                                {currentCodeSnippet?.time || '45 phút'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tiến độ */}
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400 font-medium">Tiến độ</span>
                                            <span className="text-[11px] font-bold text-blue-600">
                                                {Math.round((userMastery[activeConcept.id] ?? 0.53) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                                            <div 
                                                className="h-full bg-blue-600 rounded-full" 
                                                style={{ width: `${Math.round((userMastery[activeConcept.id] ?? 0.53) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Mục tiêu học tập với Green Checkmarks */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                                        <Target className="w-4 h-4 text-emerald-600" />
                                        <span>Mục tiêu học tập</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {(activeConcept.learning_objectives || [
                                            `Hiểu rõ bản chất lý thuyết của ${activeConcept.concept_name}`,
                                            `Phân biệt cách áp dụng trong các bài toán thực tế của ${currentLangConfig.name}`,
                                            'Thực hành viết mã và bắt các lỗi thường gặp'
                                        ]).map((obj: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                <span>{obj}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ví dụ minh họa: Code Block Box with Line Numbers & "▶ Chạy thử" */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                                            <Code2 className="w-4 h-4 text-blue-600" />
                                            <span>Ví dụ cú pháp thực tế</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                {currentLangConfig.syntaxLang}
                                            </span>
                                            <button
                                                onClick={handleCopyCode}
                                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                                title="Sao chép mã"
                                            >
                                                {copiedSyntax ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Code Block Container */}
                                    <div className="bg-[#1E293B] rounded-xl p-3 text-[11px] font-mono text-slate-200 overflow-x-auto shadow-inner border border-slate-800">
                                        {currentCodeSnippet?.lines.map((line, idx) => (
                                            <div key={idx} className="flex gap-3 leading-relaxed">
                                                <span className="text-slate-500 select-none w-4 text-right">{idx + 1}</span>
                                                <div className="flex-1">
                                                    <span className={
                                                        line.text.startsWith('#') || line.text.startsWith('//') || line.text.startsWith('--')
                                                            ? 'text-slate-400 italic' 
                                                            : line.text.includes('"') || line.text.includes("'")
                                                            ? 'text-emerald-300' 
                                                            : 'text-sky-300'
                                                    }>
                                                        {line.text}
                                                    </span>
                                                    {line.comment && (
                                                        <span className="text-slate-500 ml-2 italic">
                                                            {line.comment}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Button "Chạy thử" */}
                                    <div className="flex items-center justify-between gap-2 pt-1">
                                        <button
                                            onClick={handleRunCode}
                                            disabled={isExecuting}
                                            className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
                                            <span>{isExecuting ? 'Đang chạy...' : 'Chạy thử'}</span>
                                        </button>

                                        <button
                                            onClick={handleStartPractice}
                                            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-blue-200/80"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                            <span>Học với AI Tutor</span>
                                        </button>
                                    </div>

                                    {/* Execution Simulation Output */}
                                    {executionOutput && (
                                        <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 text-[10px] font-mono whitespace-pre-wrap border border-slate-800 animate-fadeIn">
                                            {executionOutput}
                                        </div>
                                    )}
                                </div>

                                {/* Section: Bài học tiếp theo (Đề xuất) */}
                                {recommendedNextConcept && (
                                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                        <span className="text-[11px] font-bold text-purple-700 block">
                                            Bài học tiếp theo (Đề xuất)
                                        </span>
                                        <div 
                                            onClick={() => {
                                                setSelectedConceptId(recommendedNextConcept.id);
                                                setIsDrawerOpen(true);
                                            }}
                                            className="p-3 rounded-xl bg-purple-50/80 hover:bg-purple-100/90 border border-purple-200 flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                                                    <Compass className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors block truncate">
                                                        {recommendedNextConcept.concept_id} {recommendedNextConcept.concept_name}
                                                    </span>
                                                    <span className="text-[10px] text-purple-600 font-semibold block">
                                                        Tiến độ: 40%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-7 h-7 rounded-lg bg-white text-purple-600 flex items-center justify-center shrink-0 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    )}
                </div>

                {/* 3.4 Canvas Bottom Bar: Lộ trình hiện tại + Zoom Controls + Engine Badge */}
                <div className="px-6 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white z-10 flex-wrap gap-2">
                    
                    {/* Left: Lộ trình học */}
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800">
                            Lộ trình học: <strong className="text-blue-600 font-bold">{currentLangConfig.courseTitle}</strong>
                        </span>
                    </div>

                    {/* Center: Zoom Controls */}
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                        <button
                            onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.6))}
                            className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer transition-colors"
                            title="Thu nhỏ canvas"
                        >
                            <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-bold font-mono px-2 text-slate-700">
                            {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                            onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.4))}
                            className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer transition-colors"
                            title="Phóng to canvas"
                        >
                            <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setZoomLevel(1)}
                            className="px-2 py-0.5 rounded-lg hover:bg-white text-slate-600 cursor-pointer transition-colors text-[10px] font-semibold"
                            title="Vừa màn hình"
                        >
                            100%
                        </button>
                        <button
                            onClick={() => { setPan({ x: 0, y: 0 }); setZoomLevel(1); }}
                            className="px-2.5 py-1 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 cursor-pointer transition-colors text-[10px] font-bold border border-slate-200/60 shadow-2xs flex items-center gap-1"
                            title="Đưa bản đồ về vị trí trung tâm mặc định"
                        >
                            <Move className="w-3 h-3 text-blue-600" />
                            <span>Căn giữa</span>
                        </button>
                    </div>

                    {/* Right: Cognitive Engine Model Badge & Mini-Map Overview */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200/80 text-[11px] font-semibold text-blue-700">
                            <span className="text-[10px] text-blue-400 mr-1.5 uppercase font-mono">Engine</span>
                            <span className="font-bold">PAL-Net (GCN & Attention)</span>
                        </div>

                        {/* Mini-map Box matching image */}
                        <div className="hidden sm:flex items-center justify-center w-14 h-8 bg-blue-50/80 border border-blue-200 rounded-lg p-1" title="Mini-map">
                            <div className="flex gap-0.5 items-center">
                                <span className="w-1.5 h-3 bg-blue-400 rounded-xs" />
                                <span className="w-1.5 h-4 bg-emerald-500 rounded-xs" />
                                <span className="w-1.5 h-3 bg-purple-400 rounded-xs" />
                                <span className="w-1.5 h-5 bg-blue-600 rounded-xs" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                </>
            )}
        </div>
    );
};

export default KnowledgeGraphTree;
