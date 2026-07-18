// UGC Exam Upload v2.0 — chuyển image_url lưu trong DB → signed URL (Task 4.2/5.1).
//
// DB lưu URL object ổn định cùng origin Supabase (dạng getPublicUrl) nhưng
// bucket exam-images là PRIVATE — <img> trong browser không gửi được header
// auth, nên tầng đọc phải đổi sang SIGNED URL trước khi đưa xuống client.
// Tạo signed URL qua client PHIÊN USER → RLS select trên storage.objects vẫn
// là tầng cưỡng chế (non-author không sign được hình đề chưa published);
// QuestionFigure allowlist origin Supabase nên signed URL đi qua được.

import type { SupabaseClient } from "@supabase/supabase-js";

const IMAGES_BUCKET = "exam-images";
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1h — đủ một phiên làm bài/review

/** Path object trong bucket từ URL đã lưu (`.../exam-images/{examId}/qN.png`). */
export function imagePathFromUrl(url: string): string | null {
  try {
    const m = /\/exam-images\/(.+)$/.exec(new URL(url).pathname);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

/** URL lưu trong DB → signed URL cho <img>; fail → undefined (fail closed). */
export async function resolveSignedImageUrl(
  supabase: SupabaseClient,
  storedUrl: string | null | undefined
): Promise<string | undefined> {
  if (!storedUrl) return undefined;
  const path = imagePathFromUrl(storedUrl);
  if (!path) return undefined;
  const { data } = await supabase.storage
    .from(IMAGES_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  return data?.signedUrl ?? undefined;
}
