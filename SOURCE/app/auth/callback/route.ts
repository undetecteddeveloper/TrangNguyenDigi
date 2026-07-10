// Auth callback — /auth/callback (Logic Layer 1, S#23).
// Điểm về CHUNG của mọi flow PKCE `?code=`:
//  - OAuth Google/Facebook (signInWithOAuth → provider → Supabase → đây)
//  - Link email reset mật khẩu (resetPasswordForEmail → đây, next=/reset-password)
//  - Link email xác nhận đăng ký (nếu template Supabase trỏ về đây)
// Đổi code lấy session (cookie) rồi redirect theo `next` — CHỈ nhận giá trị
// trong whitelist (chống open-redirect). Path này nằm trong PUBLIC_PATHS của
// middleware (request tới đây CHƯA có session).

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_NEXT = ["/exams", "/reset-password"];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/exams";
  const next = ALLOWED_NEXT.includes(nextParam) ? nextParam : "/exams";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.warn("[auth/callback] exchangeCodeForSession:", error.message);
  }

  // Code thiếu/hết hạn/đã dùng → về form đăng nhập.
  return NextResponse.redirect(`${origin}/?auth=signin`);
}
