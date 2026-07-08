// StartAttemptButton — nút "Bắt đầu" trên màn Exam Detail (Layer 2).
// GĐ 2 (M2.6): startAttempt() Server Action tạo attempt trong DB rồi redirect.
// (Trước đây GĐ 1 sinh attemptId client-side bằng crypto.randomUUID.)
// GĐ 3 M3.2: style brand, full-width trên mobile, auto trên desktop.
// Feedback: nhãn "Bắt đầu", chữ trắng, hover phát sáng nhẹ (glow brand).

import { startAttempt } from "@/app/(layer2)/actions";

export function StartAttemptButton({ examId }: { examId: string }) {
  const start = startAttempt.bind(null, examId);

  return (
    <form action={start}>
      <button
        type="submit"
        className="w-full rounded-lg bg-brand px-6 py-3 font-medium text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(129,140,248,0.65)] sm:w-auto sm:px-12"
      >
        Bắt đầu
      </button>
    </form>
  );
}
