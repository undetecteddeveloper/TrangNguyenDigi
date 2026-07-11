// Data model — Exam (Layer 2 Core Loop).
// Contract giữ vào production (xem PROJECT_ROADMAP.md M1.1).

export interface Exam {
  id: string;
  title: string;
  /** Thứ tự câu hỏi trong đề; trỏ tới Question.id. */
  questionIds: string[];
  /** Thời lượng làm bài (phút). Dùng cho ExamTimer ở GĐ 3. */
  durationMinutes: number;
  /** Môn học — hiển thị trên ExamCard (xem UI-LAYER-MAP Mục 4.3). */
  subject: string;
  /** Cấp lớp 6–12 — hiển thị trên ExamCard. */
  grade: number;
  /** Trường biên soạn/nguồn đề (free-text) — S#27, nullable trong DB. */
  school?: string;
  /** Niên khóa ra đề (vd 2024) — S#27, nullable trong DB. */
  schoolYear?: number;
  /** Học kỳ ra đề: 'HK1' | 'HK2' — S#27, nullable trong DB. */
  semester?: string;
}
