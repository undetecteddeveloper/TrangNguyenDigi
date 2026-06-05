// AnswerChoice — một lựa chọn đáp án (radio) trong Exam Player (Layer 2).
// GĐ 1: radio thuần, chưa style (xem PROJECT_ROADMAP.md M1.4).
// Component được điều khiển (controlled) qua props selected/onSelect.

import type { Choice, ChoiceId } from "@/types/question";

interface AnswerChoiceProps {
  /** name của nhóm radio — để mỗi câu là một nhóm độc lập. */
  name: string;
  choice: Choice;
  selected: boolean;
  onSelect: (id: ChoiceId) => void;
}

export function AnswerChoice({
  name,
  choice,
  selected,
  onSelect,
}: AnswerChoiceProps) {
  return (
    <label>
      <input
        type="radio"
        name={name}
        value={choice.id}
        checked={selected}
        onChange={() => onSelect(choice.id)}
      />
      <span>
        {choice.id}. {choice.text}
      </span>
    </label>
  );
}
