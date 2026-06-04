import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Skeleton proxy — auth logic sẽ được thêm ở GĐ 2 (M2.4)
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
