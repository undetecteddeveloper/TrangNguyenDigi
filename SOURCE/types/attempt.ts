// Data model — Attempt (Layer 2 Core Loop).
// Contract giữ vào production (xem PROJECT_ROADMAP.md M1.1).

import type { ChoiceId } from "./question";

export interface Attempt {
  examId: string;
  /** Map questionId -> đáp án đã chọn. Câu chưa trả lời thì không có key. */
  answers: Record<string, ChoiceId>;
  /** Điểm tổng, có sau khi nộp bài (computeScore — M1.6). */
  score?: number;
}
