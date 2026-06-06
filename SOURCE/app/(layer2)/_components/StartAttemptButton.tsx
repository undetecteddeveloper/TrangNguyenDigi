// StartAttemptButton — nút "Bắt đầu làm bài" trên màn Exam Detail (Layer 2).
// GĐ 2 (M2.6): startAttempt() Server Action tạo attempt trong DB rồi redirect.
// (Trước đây GĐ 1 sinh attemptId client-side bằng crypto.randomUUID.)

import { startAttempt } from "@/app/(layer2)/actions";

export function StartAttemptButton({ examId }: { examId: string }) {
  const start = startAttempt.bind(null, examId);

  return (
    <form action={start}>
      <button type="submit">Bắt đầu làm bài</button>
    </form>
  );
}
