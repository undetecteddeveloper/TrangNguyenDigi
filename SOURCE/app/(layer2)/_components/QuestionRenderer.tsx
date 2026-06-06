// QuestionRenderer — hiển thị nội dung một câu hỏi + 4 lựa chọn (Layer 2).
// GĐ 1: text thuần, chưa style (xem PROJECT_ROADMAP.md M1.4).
// GĐ 3 (M3.1) sẽ thêm markdown + LaTeX rendering cho `content`.

import type { ChoiceId, PublicQuestion } from "@/types/question";
import { AnswerChoice } from "./AnswerChoice";

interface QuestionRendererProps {
  /** Số thứ tự câu (1-based) — để hiển thị "Câu N". */
  index: number;
  total: number;
  /** Không cần `correctAnswer` để render — dùng PublicQuestion (bảo mật, M2.6). */
  question: PublicQuestion;
  /** Đáp án đang chọn của câu này, hoặc undefined nếu chưa chọn. */
  selectedAnswer?: ChoiceId;
  onSelectAnswer: (id: ChoiceId) => void;
}

export function QuestionRenderer({
  index,
  total,
  question,
  selectedAnswer,
  onSelectAnswer,
}: QuestionRendererProps) {
  return (
    <div>
      <p>
        Câu {index}/{total}
      </p>
      <p>{question.content}</p>
      <fieldset>
        {question.choices.map((choice) => (
          <AnswerChoice
            key={choice.id}
            name={`question-${question.id}`}
            choice={choice}
            selected={selectedAnswer === choice.id}
            onSelect={onSelectAnswer}
          />
        ))}
      </fieldset>
    </div>
  );
}
