// computeScore — ⭐ TRACER CODE (giữ mãi vào production).
// Hàm THUẦN (pure): không phụ thuộc UI, không I/O, không fake-data lookup.
// GĐ 2 (M2.6) gọi chính hàm này server-side trong submitExam().
//
// Nhận danh sách câu hỏi (đã resolve, vì Exam chỉ giữ questionIds) + đáp án,
// trả về điểm thang 10 + chi tiết từng câu + breakdown theo chủ đề.

import type { ChoiceId, Question } from "@/types/question";
import type {
  PerQuestionResult,
  ScoreResult,
  TopicResult,
} from "@/types/result";

export function computeScore(
  questions: Question[],
  answers: Record<string, ChoiceId>,
): ScoreResult {
  const perQuestion: PerQuestionResult[] = questions.map((q) => {
    const selected = answers[q.id];
    return {
      questionId: q.id,
      selected,
      correct: q.correctAnswer,
      isCorrect: selected === q.correctAnswer,
    };
  });

  const total = questions.length;
  const correct = perQuestion.filter((r) => r.isCorrect).length;

  // Thang 10. total=0 → 0 để tránh chia cho 0.
  const totalScore =
    total === 0 ? 0 : Math.round((correct / total) * 10 * 100) / 100;

  // Gom theo chủ đề, giữ thứ tự chủ đề xuất hiện lần đầu.
  const topicOrder: string[] = [];
  const buckets = new Map<string, { correct: number; total: number }>();
  questions.forEach((q, i) => {
    let bucket = buckets.get(q.topic);
    if (!bucket) {
      bucket = { correct: 0, total: 0 };
      buckets.set(q.topic, bucket);
      topicOrder.push(q.topic);
    }
    bucket.total += 1;
    if (perQuestion[i].isCorrect) bucket.correct += 1;
  });
  const topicBreakdown: TopicResult[] = topicOrder.map((topic) => {
    const b = buckets.get(topic)!;
    return { topic, correct: b.correct, total: b.total };
  });

  return { totalScore, correct, total, perQuestion, topicBreakdown };
}
