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

/** Đăng xuất, quay về trang login. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
