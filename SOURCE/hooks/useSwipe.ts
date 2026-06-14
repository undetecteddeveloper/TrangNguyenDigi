// useSwipe — phát hiện cử chỉ vuốt ngang trên cảm ứng (Layer 2, M3.2 Task 1).
// Trả về props {onTouchStart, onTouchEnd} để spread lên phần tử cần bắt vuốt.
// Chỉ tính là swipe khi đoạn vuốt ngang vượt ngưỡng VÀ trội hơn vuốt dọc — để
// không nuốt thao tác cuộn trang. Không preventDefault nên cuộn dọc vẫn mượt.
// Dùng cho Exam Player mobile: vuốt trái → câu sau, vuốt phải → câu trước.

import { useRef } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface SwipeOptions {
  /** Khoảng vuốt ngang tối thiểu (px) để được tính là swipe. */
  threshold?: number;
}

export function useSwipe(
  { onSwipeLeft, onSwipeRight }: SwipeHandlers,
  { threshold = 50 }: SwipeOptions = {},
) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      // Bỏ qua nếu vuốt quá ngắn hoặc thiên về dọc (đang cuốn trang).
      if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
  };
}
