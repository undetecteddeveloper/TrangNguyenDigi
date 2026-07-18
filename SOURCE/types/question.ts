// Data model — Question (Layer 2 Core Loop).
// Contract giữ vào production (xem PROJECT_ROADMAP.md M1.1).

/** Nhãn của một lựa chọn đáp án. Trắc nghiệm 4 lựa chọn A–D. */
export type ChoiceId = "A" | "B" | "C" | "D";

export interface Choice {
  id: ChoiceId;
  text: string;
}

/** Nhãn ý con của câu đúng/sai (UGC v2.1, ADR-0005 — PHẦN II đề chuẩn 2025). */
export type SubItemId = "a" | "b" | "c" | "d";

export interface SubItem {
  id: SubItemId;
  text: string;
}

export interface Question {
  id: string;
  /** Nội dung câu hỏi. GĐ 3 sẽ render markdown + LaTeX (xem M3.1). */
  content: string;
  choices: Choice[];
  correctAnswer: ChoiceId;
  /** Môn học, vd "Toán", "Vật Lý". */
  subject: string;
  /** Cấp lớp 6–12. */
  grade: number;
  /**
   * Chủ đề con (vd "Lượng giác", "Tích phân").
   * Cần cho `topicBreakdown` của computeScore (M1.6) — gom điểm theo chủ đề.
   */
  topic: string;
  /** Loại câu (UGC v2.0/v2.1). Mặc định 'mcq'; đề seed không set → 'mcq'. */
  questionType?: "mcq" | "essay" | "true_false" | "short_answer";
  /** Phần chứa câu hỏi (UGC v2.1 — đề chuẩn 2025 nhiều phần). Không set = 1. */
  partNumber?: number;
  /** Các ý a–d của câu true_false (UGC v2.1) — nội dung, KHÔNG có đáp án. */
  subItems?: SubItem[];
  /**
   * Đáp án Đ/S từng ý của true_false (UGC v2.1) — CHỈ server-side, KHÔNG lộ ra
   * PublicQuestion (kỷ luật như correctAnswer).
   */
  subAnswers?: Partial<Record<SubItemId, boolean>>;
  /** URL hình thân câu (UGC v2.0) — render qua QuestionFigure. */
  imageUrl?: string;
  /**
   * Đáp án mẫu cho câu tự luận / giá trị mong đợi của short_answer (UGC
   * v2.0/v2.1, cùng cột DB) — CHỈ dùng server-side, KHÔNG lộ ra
   * PublicQuestion (giống correctAnswer). Bị Omit khỏi câu gửi client player.
   */
  essayAnswer?: string;
}

/**
 * Câu hỏi gửi xuống client player — KHÔNG có `correctAnswer`, `essayAnswer`,
 * `subAnswers` (mọi dạng đáp án đều không được lộ) (GĐ 2 M2.6 + UGC v2.1).
 * Ranh giới bảo mật: đáp án chỉ tồn tại server-side; `computeScore` chấm
 * trong `submitExam()` với `Question` đầy đủ lấy từ DB. Giữ `imageUrl`/
 * `questionType`/`partNumber`/`subItems` (an toàn — nội dung hiển thị được).
 */
export type PublicQuestion = Omit<Question, "correctAnswer" | "essayAnswer" | "subAnswers">;
