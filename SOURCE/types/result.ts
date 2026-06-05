// Data model — Result của một lần làm đề (Layer 2 Core Loop).
// Contract output của computeScore (M1.6); GĐ 2 getResult() trả về đúng shape này.

import type { ChoiceId } from "./question";

export interface PerQuestionResult {
  questionId: string;
  /** Đáp án user chọn; undefined = bỏ trống. */
  selected?: ChoiceId;
  correct: ChoiceId;
  isCorrect: boolean;
}

export interface TopicResult {
  topic: string;
  correct: number;
  total: number;
}

export interface ScoreResult {
  /** Điểm thang 10 (chuẩn THPT VN), làm tròn 2 chữ số. */
  totalScore: number;
  correct: number;
  total: number;
  perQuestion: PerQuestionResult[];
  topicBreakdown: TopicResult[];
}
