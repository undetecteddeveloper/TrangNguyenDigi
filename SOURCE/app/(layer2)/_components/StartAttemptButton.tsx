// StartAttemptButton — nút "Bắt đầu làm bài" trên màn Exam Detail (Layer 2).
// GĐ 1: sinh attemptId client-side bằng crypto.randomUUID() (xem M1.3, Q2=A).
// GĐ 2: attemptId sẽ do startAttempt() Server Action tạo từ DB (M2.6).

"use client";

import { useRouter } from "next/navigation";

export function StartAttemptButton({ examId }: { examId: string }) {
  const router = useRouter();

  function start() {
    const attemptId = crypto.randomUUID();
    router.push(`/exams/${examId}/attempt/${attemptId}`);
  }

  return (
    <button type="button" onClick={start}>
      Bắt đầu làm bài
    </button>
  );
}
