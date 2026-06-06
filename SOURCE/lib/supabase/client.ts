// Supabase browser client (Logic L1/L2 — dùng trong 'use client' components).
// Xem BACK-END-ARCHITECTURE-MAP.md Mục 9.2.

import { createBrowserClient } from "@supabase/ssr";

/** Tạo Supabase client cho phía trình duyệt (realtime, optimistic UI). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
