// QuestionRenderer — hiển thị nội dung một câu hỏi + 4 lựa chọn (Layer 2).
// GĐ 3 M3.1 Task 2: đồng bộ layout TEMPLATE/L2/ExamPage — card hairline bo góc
// 8px, hàng đầu "Câu N" + FlagButton, khu vực trả lời cao cố định 238px cuộn
// dọc khi nội dung dài.
// Task 5: nội dung render markdown + LaTeX qua <RichText>.

import type { ChoiceId, PublicQuestion } from "@/types/question";
import { RichText } from "@/components/shared/RichText";
import { AnswerChoice } from "./AnswerChoice";
import { FlagButton } from "./FlagButton";

interface QuestionRendererProps {
  /** Số thứ tự câu (1-based) — để hiển thị "Câu N". */
  index: number;
  /** Không cần `correctAnswer` để render — dùng PublicQuestion (bảo mật, M2.6). */
  question: PublicQuestion;
  /** Đáp án đang chọn của câu này, hoặc undefined nếu chưa chọn. */
  selectedAnswer?: ChoiceId;
  onSelectAnswer: (id: ChoiceId) => void;
  flagged: boolean;
  onToggleFlag: () => void;
}

export function QuestionRenderer({
  index,
  question,
  selectedAnswer,
  onSelectAnswer,
  flagged,
  onToggleFlag,
}: QuestionRendererProps) {
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="eyebrow">Question {index}</span>
        <FlagButton flagged={flagged} onToggle={onToggleFlag} />
      </div>

      <RichText
        text={question.content}
        className="text-lg leading-relaxed text-foreground"
      />

      {/* Khu vực trả lời — chiều cao cố định, cuộn dọc khi dài (đồng bộ template). */}
      <div className="h-[238px] overflow-y-auto pr-2">
        <fieldset className="flex flex-col gap-2.5 border-0 p-0">
          <legend className="sr-only">Choose an answer</legend>
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
    </div>
  );
}
