// useExamPlayer — quản lý state của Exam Player (Layer 2), M1.5.
// useReducer cho state làm bài: câu đang xem + đáp án từng câu.
// GĐ 3 có thể mở rộng (flag, timer) hoặc nâng lên Zustand store nếu cần
// share cross-component (xem UI-LAYER-MAP Mục 9).

import { useReducer } from "react";
import type { ChoiceId } from "@/types/question";

interface ExamPlayerState {
  current: number;
  answers: Record<string, ChoiceId>;
}

type ExamPlayerAction =
  | { type: "SELECT_ANSWER"; questionId: string; choice: ChoiceId }
  | { type: "GOTO"; index: number }
  | { type: "NEXT" }
  | { type: "PREV" };

function clamp(index: number, total: number): number {
  return Math.max(0, Math.min(total - 1, index));
}

function makeReducer(total: number) {
  return function reducer(
    state: ExamPlayerState,
    action: ExamPlayerAction,
  ): ExamPlayerState {
    switch (action.type) {
      case "SELECT_ANSWER":
        return {
          ...state,
          answers: { ...state.answers, [action.questionId]: action.choice },
        };
      case "GOTO":
        return { ...state, current: clamp(action.index, total) };
      case "NEXT":
        return { ...state, current: clamp(state.current + 1, total) };
      case "PREV":
        return { ...state, current: clamp(state.current - 1, total) };
      default:
        return state;
    }
  };
}

export function useExamPlayer(total: number) {
  const [state, dispatch] = useReducer(makeReducer(total), {
    current: 0,
    answers: {},
  });

  return {
    current: state.current,
    answers: state.answers,
    selectAnswer: (questionId: string, choice: ChoiceId) =>
      dispatch({ type: "SELECT_ANSWER", questionId, choice }),
    goto: (index: number) => dispatch({ type: "GOTO", index }),
    next: () => dispatch({ type: "NEXT" }),
    prev: () => dispatch({ type: "PREV" }),
  };
}
