// useExamPlayer — quản lý state của Exam Player (Layer 2), M1.5.
// useReducer cho state làm bài: câu đang xem + đáp án từng câu + đánh dấu (flag).
// GĐ 3 M3.1 Task 3: thêm `flags` (đánh dấu câu để xem lại — UX trong session,
// không persist DB). Có thể nâng lên Zustand store nếu cần (xem UI-LAYER-MAP Mục 9).

import { useReducer } from "react";

interface ExamPlayerState {
  current: number;
  /** questionId → input. mcq: "A".."D"; true_false: "a:Đ,b:S,..." (tfCodec);
   * short_answer: text tự do (UGC v2.1 — player thu input, không chấm). */
  answers: Record<string, string>;
  /** questionId → true nếu được đánh dấu để xem lại. */
  flags: Record<string, true>;
}

type ExamPlayerAction =
  | { type: "SELECT_ANSWER"; questionId: string; choice: string }
  | { type: "TOGGLE_FLAG"; questionId: string }
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
      case "TOGGLE_FLAG": {
        const flags = { ...state.flags };
        if (flags[action.questionId]) {
          delete flags[action.questionId];
        } else {
          flags[action.questionId] = true;
        }
        return { ...state, flags };
      }
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
    flags: {},
  });

  return {
    current: state.current,
    answers: state.answers,
    flags: state.flags,
    selectAnswer: (questionId: string, choice: string) =>
      dispatch({ type: "SELECT_ANSWER", questionId, choice }),
    toggleFlag: (questionId: string) =>
      dispatch({ type: "TOGGLE_FLAG", questionId }),
    goto: (index: number) => dispatch({ type: "GOTO", index }),
    next: () => dispatch({ type: "NEXT" }),
    prev: () => dispatch({ type: "PREV" }),
  };
}
