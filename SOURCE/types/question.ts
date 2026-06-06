// Data model — Question (Layer 2 Core Loop).
// Contract giữ vào production (xem PROJECT_ROADMAP.md M1.1).

/** Nhãn của một lựa chọn đáp án. Trắc nghiệm 4 lựa chọn A–D. */
export type ChoiceId = "A" | "B" | "C" | "D";

export interface Choice {
  id: ChoiceId;
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
}

/**
 * Câu hỏi gửi xuống client player — KHÔNG có `correctAnswer` (GĐ 2 M2.6).
 * Ranh giới bảo mật: đáp án đúng chỉ tồn tại server-side; `computeScore` chấm
 * trong `submitExam()` với `Question` đầy đủ lấy từ DB.
 */
export type PublicQuestion = Omit<Question, "correctAnswer">;
