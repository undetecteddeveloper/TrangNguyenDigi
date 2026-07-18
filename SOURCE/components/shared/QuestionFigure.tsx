// QuestionFigure — hình minh họa của câu hỏi (UGC v2.0, ADR-0002 / Task 3.2).
//
// Chỉ render <img> khi origin của URL nằm trong allowlist cố định (origin
// Supabase Storage của site, lấy từ env) — mọi origin khác, javascript:/data:
// hay URL hỏng đều render KHÔNG GÌ CẢ (fail closed). Đây là điểm cưỡng chế
// AC-023 phía render; Storage read policy (schema.sql §8) là phía dữ liệu —
// cả hai phải cùng đúng.
//
// Server-safe, thuần (không hook) — dùng được trong cả Server lẫn Client
// Component (player, exam detail, màn review S-03).

import { cn } from "@/lib/utils";

/** Origin Storage được phép — tính lười để test set env trước khi gọi. */
function getAllowedImageOrigins(): string[] {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return [];
  try {
    return [new URL(supabaseUrl).origin];
  } catch {
    return [];
  }
}

/** URL hợp lệ để render hình? (export cho tái dùng — queries/màn review). */
export function isAllowedImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    // javascript:/data:/URL tương đối → origin "null" hoặc throw → false.
    return getAllowedImageOrigins().includes(new URL(url).origin);
  } catch {
    return false;
  }
}

interface QuestionFigureProps {
  /** URL hình từ questions.image_url (có thể null — câu không có hình). */
  url: string | null | undefined;
  /** Số câu — dùng cho alt mặc định. */
  questionNumber: number;
  /** Alt tuỳ chỉnh; luôn đảm bảo non-empty (fallback theo số câu). */
  alt?: string;
  className?: string;
}

export function QuestionFigure({ url, questionNumber, alt, className }: QuestionFigureProps) {
  if (!isAllowedImageUrl(url)) return null;
  const altText = alt?.trim() || `Figure for Câu ${questionNumber}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- ảnh Storage động, không qua next/image optimizer
    <img
      src={url as string}
      alt={altText}
      className={cn("border-border h-auto max-w-full rounded-md border", className)}
    />
  );
}
