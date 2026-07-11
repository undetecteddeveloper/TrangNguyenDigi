// Fake data cho GĐ 1 (Functional Prototype).
// TẠM THỜI — GĐ 2 thay bằng Supabase (xem PROJECT_ROADMAP.md M2.3, M2.5).
// Toàn bộ trong file, không cần internet.

import type { Exam } from "@/types/exam";
import type { Question } from "@/types/question";

// --- Ngân hàng câu hỏi ---------------------------------------------------
// Đáp án đúng đã được kiểm tra tay để verify computeScore (M1.6).

const QUESTIONS: Question[] = [
  // Đề 1 — Toán 10 (Hàm số & Phương trình)
  {
    id: "q-t10-1",
    content: "Tập xác định của hàm số y = 1 / (x - 2) là?",
    choices: [
      { id: "A", text: "ℝ" },
      { id: "B", text: "ℝ \\ {2}" },
      { id: "C", text: "ℝ \\ {0}" },
      { id: "D", text: "(2; +∞)" },
    ],
    correctAnswer: "B",
    subject: "Math",
    grade: 10,
    topic: "Hàm số",
  },
  {
    id: "q-t10-2",
    content: "Nghiệm của phương trình 2x + 6 = 0 là?",
    choices: [
      { id: "A", text: "x = 3" },
      { id: "B", text: "x = -3" },
      { id: "C", text: "x = 6" },
      { id: "D", text: "x = -6" },
    ],
    correctAnswer: "B",
    subject: "Math",
    grade: 10,
    topic: "Phương trình",
  },
  {
    id: "q-t10-3",
    content: "Parabol y = x² - 4x + 3 có tọa độ đỉnh là?",
    choices: [
      { id: "A", text: "(2; -1)" },
      { id: "B", text: "(-2; -1)" },
      { id: "C", text: "(2; 1)" },
      { id: "D", text: "(1; 0)" },
    ],
    correctAnswer: "A",
    subject: "Math",
    grade: 10,
    topic: "Hàm số",
  },
  {
    id: "q-t10-4",
    content: "Phương trình x² - 5x + 6 = 0 có tập nghiệm là?",
    choices: [
      { id: "A", text: "{1; 6}" },
      { id: "B", text: "{-2; -3}" },
      { id: "C", text: "{2; 3}" },
      { id: "D", text: "{-1; -6}" },
    ],
    correctAnswer: "C",
    subject: "Math",
    grade: 10,
    topic: "Phương trình",
  },
  {
    id: "q-t10-5",
    content: "Hàm số y = 2x - 1 đồng biến hay nghịch biến trên ℝ?",
    choices: [
      { id: "A", text: "Đồng biến" },
      { id: "B", text: "Nghịch biến" },
      { id: "C", text: "Không đổi" },
      { id: "D", text: "Vừa đồng vừa nghịch biến" },
    ],
    correctAnswer: "A",
    subject: "Math",
    grade: 10,
    topic: "Hàm số",
  },

  // Đề 2 — Vật Lý 10 (Động học & Động lực học)
  {
    id: "q-l10-1",
    content:
      "Một vật chuyển động thẳng đều với vận tốc 5 m/s. Quãng đường đi được trong 4 s là?",
    choices: [
      { id: "A", text: "9 m" },
      { id: "B", text: "20 m" },
      { id: "C", text: "1,25 m" },
      { id: "D", text: "0,8 m" },
    ],
    correctAnswer: "B",
    subject: "Physics",
    grade: 10,
    topic: "Động học",
  },
  {
    id: "q-l10-2",
    content: "Đơn vị của gia tốc trong hệ SI là?",
    choices: [
      { id: "A", text: "m/s" },
      { id: "B", text: "m·s" },
      { id: "C", text: "m/s²" },
      { id: "D", text: "N" },
    ],
    correctAnswer: "C",
    subject: "Physics",
    grade: 10,
    topic: "Động học",
  },
  {
    id: "q-l10-3",
    content:
      "Theo định luật II Newton, lực F tác dụng lên vật khối lượng m gây gia tốc a được tính bởi?",
    choices: [
      { id: "A", text: "F = m / a" },
      { id: "B", text: "F = a / m" },
      { id: "C", text: "F = m + a" },
      { id: "D", text: "F = m · a" },
    ],
    correctAnswer: "D",
    subject: "Physics",
    grade: 10,
    topic: "Động lực học",
  },
  {
    id: "q-l10-4",
    content:
      "Một vật khối lượng 2 kg chịu lực 10 N. Gia tốc của vật là? (bỏ qua ma sát)",
    choices: [
      { id: "A", text: "5 m/s²" },
      { id: "B", text: "20 m/s²" },
      { id: "C", text: "0,2 m/s²" },
      { id: "D", text: "12 m/s²" },
    ],
    correctAnswer: "A",
    subject: "Physics",
    grade: 10,
    topic: "Động lực học",
  },
  {
    id: "q-l10-5",
    content: "Trọng lực tác dụng lên một vật có đặc điểm nào sau đây?",
    choices: [
      { id: "A", text: "Luôn hướng lên trên" },
      { id: "B", text: "Hướng thẳng đứng xuống dưới" },
      { id: "C", text: "Hướng theo phương ngang" },
      { id: "D", text: "Bằng 0 ở mọi nơi" },
    ],
    correctAnswer: "B",
    subject: "Physics",
    grade: 10,
    topic: "Động lực học",
  },

  // Đề 3 — Hóa Học 10 (Nguyên tử & Bảng tuần hoàn) — S#20, test lưới 3 cột.
  {
    id: "q-h10-1",
    content: "Hạt mang điện tích dương trong hạt nhân nguyên tử là?",
    choices: [
      { id: "A", text: "Proton" },
      { id: "B", text: "Electron" },
      { id: "C", text: "Neutron" },
      { id: "D", text: "Photon" },
    ],
    correctAnswer: "A",
    subject: "Chemistry",
    grade: 10,
    topic: "Nguyên tử",
  },
  {
    id: "q-h10-2",
    content: "Số hiệu nguyên tử Z cho biết điều gì?",
    choices: [
      { id: "A", text: "Số neutron trong hạt nhân" },
      { id: "B", text: "Số khối của nguyên tử" },
      { id: "C", text: "Số proton trong hạt nhân" },
      { id: "D", text: "Số electron lớp ngoài cùng" },
    ],
    correctAnswer: "C",
    subject: "Chemistry",
    grade: 10,
    topic: "Bảng tuần hoàn",
  },
  {
    id: "q-h10-3",
    content:
      "Nguyên tố có Z = 11 (Natri) thuộc nhóm nào trong bảng tuần hoàn?",
    choices: [
      { id: "A", text: "Nhóm IIA" },
      { id: "B", text: "Nhóm IA" },
      { id: "C", text: "Nhóm VIIA" },
      { id: "D", text: "Nhóm VIIIA" },
    ],
    correctAnswer: "B",
    subject: "Chemistry",
    grade: 10,
    topic: "Bảng tuần hoàn",
  },
  {
    id: "q-h10-4",
    content:
      "Đồng vị là những nguyên tử có cùng số proton nhưng khác nhau về số hạt nào?",
    choices: [
      { id: "A", text: "Electron" },
      { id: "B", text: "Lớp vỏ electron" },
      { id: "C", text: "Điện tích hạt nhân" },
      { id: "D", text: "Neutron" },
    ],
    correctAnswer: "D",
    subject: "Chemistry",
    grade: 10,
    topic: "Nguyên tử",
  },
  {
    id: "q-h10-5",
    content: "Cấu hình electron của nguyên tử Oxy (Z = 8) là?",
    choices: [
      { id: "A", text: "1s² 2s² 2p⁴" },
      { id: "B", text: "1s² 2s² 2p⁶" },
      { id: "C", text: "1s² 2s³ 2p³" },
      { id: "D", text: "1s² 2p⁶" },
    ],
    correctAnswer: "A",
    subject: "Chemistry",
    grade: 10,
    topic: "Nguyên tử",
  },
];

// --- Đề thi --------------------------------------------------------------

// S#27: school/schoolYear/semester là giá trị DEMO (đa dạng có chủ đích để
// test đủ nhánh filter — 2 năm khác nhau, cả HK1 lẫn HK2). Engineer đổi tùy ý.
const EXAMS: Exam[] = [
  {
    id: "exam-toan-10",
    title: "Đề luyện Toán 10 — Hàm số & Phương trình",
    questionIds: ["q-t10-1", "q-t10-2", "q-t10-3", "q-t10-4", "q-t10-5"],
    durationMinutes: 15,
    subject: "Math",
    grade: 10,
    school: "THPT Trần Phú",
    schoolYear: 2024,
    semester: "HK1",
  },
  {
    id: "exam-ly-10",
    title: "Đề luyện Vật Lý 10 — Động học & Động lực học",
    questionIds: ["q-l10-1", "q-l10-2", "q-l10-3", "q-l10-4", "q-l10-5"],
    durationMinutes: 15,
    subject: "Physics",
    grade: 10,
    school: "THPT Nguyễn Huệ",
    schoolYear: 2024,
    semester: "HK2",
  },
  {
    id: "exam-hoa-10",
    title: "Đề luyện Hóa Học 10 — Nguyên tử & Bảng tuần hoàn",
    questionIds: ["q-h10-1", "q-h10-2", "q-h10-3", "q-h10-4", "q-h10-5"],
    durationMinutes: 15,
    subject: "Chemistry",
    grade: 10,
    school: "THPT Lê Quý Đôn",
    schoolYear: 2025,
    semester: "HK1",
  },
];

// --- Truy vấn (sẽ thay bằng query Supabase ở GĐ 2) -----------------------

/** Trả về toàn bộ đề mẫu cho Exam Browser. */
export function getFakeExams(): Exam[] {
  return EXAMS;
}

/** Trả về một đề theo id, hoặc undefined nếu không tìm thấy. */
export function getFakeExam(id: string): Exam | undefined {
  return EXAMS.find((exam) => exam.id === id);
}

/**
 * Trả về danh sách Question (theo đúng thứ tự questionIds) của một đề.
 * Helper cho Exam Player (M1.4); rỗng nếu đề không tồn tại.
 */
export function getFakeQuestions(examId: string): Question[] {
  const exam = getFakeExam(examId);
  if (!exam) return [];
  return exam.questionIds
    .map((qid) => QUESTIONS.find((q) => q.id === qid))
    .filter((q): q is Question => q !== undefined);
}
