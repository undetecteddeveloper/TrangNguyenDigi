import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// GĐ 2 M2.4: refresh Supabase session mỗi request + chặn route chưa auth.
// Logic chi tiết (public paths, redirect) nằm trong lib/supabase/middleware.ts.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
