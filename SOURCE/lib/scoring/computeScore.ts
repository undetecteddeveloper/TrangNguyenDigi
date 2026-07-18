// computeScore — ⭐ TRACER CODE (giữ mãi vào production).
// Hàm THUẦN (pure): không phụ thuộc UI, không I/O, không fake-data lookup.
// GĐ 2 (M2.6) gọi chính hàm này server-side trong submitExam().
//
// Nhận danh sách câu hỏi (đã resolve, vì Exam chỉ giữ questionIds) + đáp án,
// trả về điểm thang 10 + chi tiết từng câu + breakdown theo chủ đề.
//
// v2.1 (ADR-0005, product decision 2026-07-17): CHỈ câu mcq được chấm điểm —
// true_false / short_answer / essay là "stored, not auto-scored" (feature chấm
// riêng trong tương lai). Câu không chấm vẫn có mặt trong perQuestion (scored:
// false, giữ input của user để màn Chi tiết hiển thị) nhưng KHÔNG vào mẫu số
// điểm lẫn topic breakdown — tránh đề trộn 22 câu bị chia điểm /22 dù chỉ 12
// câu mcq chấm được.

import type { Question } from "@/types/question";
import type {
  PerQuestionResult,
  ScoreResult,
  TopicResult,
} from "@/types/result";

/** Câu có tham gia chấm điểm tự động không (mcq; đề seed không set type = mcq). */
function isScored(q: Question): boolean {
  return (q.questionType ?? "mcq") === "mcq";
}

export function computeScore(
  questions: Question[],
  answers: Record<string, string>,
): ScoreResult {
  const perQuestion: PerQuestionResult[] = questions.map((q) => {
    const selected = answers[q.id];
    if (!isScored(q)) {
      return { questionId: q.id, selected, isCorrect: false, scored: false };
    }
    return {
      questionId: q.id,
      selected,
      correct: q.correctAnswer,
      isCorrect: selected === q.correctAnswer,
      scored: true,
    };
  });

  const scored = perQuestion.filter((r) => r.scored !== false);
  const total = scored.length;
  const correct = scored.filter((r) => r.isCorrect).length;

  // Thang 10. total=0 → 0 để tránh chia cho 0 (đề toàn câu không chấm).
  const totalScore =
    total === 0 ? 0 : Math.round((correct / total) * 10 * 100) / 100;

  // Gom theo chủ đề — CHỈ câu được chấm, giữ thứ tự chủ đề xuất hiện lần đầu.
  const topicOrder: string[] = [];
  const buckets = new Map<string, { correct: number; total: number }>();
  questions.forEach((q, i) => {
    if (perQuestion[i].scored === false) return;
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
