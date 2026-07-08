// Logic Layer 1 — getCurrentUser helper (GĐ 2 M2.4).
// Dùng trong Server Component để biết user hiện tại. Xem BACK-END map Mục 3.2 & 8.1.

import { createClient } from "@/lib/supabase/server";

/** Trả về user đang đăng nhập (từ cookie session), hoặc null nếu chưa đăng nhập. */
export async function getCurrentUser() {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    // Backend Supabase không kết nối được (project paused/deleted, hoặc mạng) →
    // coi như chưa đăng nhập thay vì để AuthRetryableFetchError crash trang.
    console.warn("[getCurrentUser] Supabase auth không kết nối được:", err);
    return null;
  }
}
