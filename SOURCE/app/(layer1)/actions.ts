// Logic Layer 1 — Auth Server Actions (GĐ 2 M2.4).
// Xem BACK-END-ARCHITECTURE-MAP.md Mục 3.2 & 9.1.
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string } | null;

/** Đăng ký email/password. user_profiles row được tạo tự động qua DB trigger (schema.sql). */
export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName || email } },
  });

  if (error) return { error: error.message };
  redirect("/exams");
}

/** Đăng nhập email/password. */
export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  redirect("/exams");
}

/** Đăng xuất, quay về homepage với form đăng nhập mở. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/?auth=signin");
}

/** Đổi tên hiển thị (user_profiles.display_name) — gọi từ AccountMenu (dropdown
 * navbar). RLS "profiles_update_own" đã cho phép user tự sửa profile của mình. */
export async function updateProfile(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!displayName) return { error: "Tên hiển thị không được để trống" };
  if (displayName.length > 12)
    return { error: "Tên hiển thị tối đa 12 ký tự" };
  if (!/^[\p{L}.]+$/u.test(displayName))
    return { error: "Tên hiển thị chỉ được chứa chữ cái và dấu chấm" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Phiên đăng nhập đã hết hạn" };

  const { error } = await supabase
    .from("user_profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return null;
}
