// QuestionRenderer — hiển thị nội dung một câu hỏi + 4 lựa chọn (Layer 2).
// GĐ 3 M3.1 Task 2: style "focus mode" — eyebrow mono, nội dung serif đọc thoải mái.
// Task 5: nội dung render markdown + LaTeX qua <RichText>.

import type { ChoiceId, PublicQuestion } from "@/types/question";
import { RichText } from "@/components/shared/RichText";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">
          Câu {index} / {total}
        </span>
        <RichText
          text={question.content}
          className="font-serif text-xl leading-relaxed text-foreground"
        />
      </div>

      <fieldset className="flex flex-col gap-3 border-0 p-0">
        <legend className="sr-only">Chọn đáp án</legend>
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
