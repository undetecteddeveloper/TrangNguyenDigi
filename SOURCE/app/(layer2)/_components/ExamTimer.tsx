// ExamTimer — đồng hồ đếm ngược cho Exam Player (Layer 2). GĐ 3 M3.1 Task 3.
// Đếm từ `durationMinutes` về 0; hết giờ → gọi `onTimeUp` (ExamPlayer auto-submit, PA A).
// Hiển thị MM:SS dạng mono, KHÔNG nhấp nháy (UI-LAYER-MAP 4.2) — chỉ đổi màu cảnh
// báo ở phút cuối. Đếm bằng setTimeout từng giây để tránh dồn tick khi tab nền.
"use client";

import { useEffect, useRef, useState } from "react";

interface ExamTimerProps {
  durationMinutes: number;
  /** Gọi đúng một lần khi đồng hồ về 0. */
  onTimeUp: () => void;
}

export function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.round(durationMinutes * 60)),
  );

  // Giữ callback mới nhất trong ref — fire lúc hết giờ dùng answers mới nhất.
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  // Tick mỗi giây cho tới 0.
  useEffect(() => {
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  // Khi chạm 0 → auto-submit (đúng một lần vì `remaining` chỉ tới 0 một lần).
  useEffect(() => {
    if (remaining === 0) onTimeUpRef.current();
  }, [remaining]);

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const low = remaining <= 60; // cảnh báo phút cuối

  return (
    <span
      role="timer"
      aria-label="Time remaining"
      className={`font-mono text-sm tabular-nums transition-colors ${
        low ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
    </span>
  );
}
