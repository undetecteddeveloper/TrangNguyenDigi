// UI Layer 1 — Trang đăng nhập / đăng ký (GĐ 3 Polish, S#15).
// Navbar KẾ THỪA HomeHeader của homepage (cùng world Entry). Card trắng/đen
// (AuthForm) căn giữa trên nền tối L1 #0d0d11. User đã đăng nhập → /exams.
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { HomeHeader } from "../_components/HomeHeader";
import { AuthForm } from "../_components/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/exams");

  const { mode } = await searchParams;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0d0d11]">
      <HomeHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <AuthForm initialMode={mode === "signup" ? "signup" : "signin"} />
      </main>
    </div>
  );
}
