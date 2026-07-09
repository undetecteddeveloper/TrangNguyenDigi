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

export type CurrentUserProfile = { id: string; email: string; displayName: string };

/** Giống getCurrentUser() nhưng kèm display_name từ user_profiles — dùng cho
 * navbar (AccountMenu) hiển thị tên + biết trạng thái đăng nhập. */
export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email ?? "",
      displayName: profile?.display_name || user.email || "Người dùng",
    };
  } catch (err) {
    console.warn(
      "[getCurrentUserProfile] Supabase auth không kết nối được:",
      err,
    );
    return null;
  }
}
