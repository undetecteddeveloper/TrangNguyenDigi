// UI Layer 1 — Trang đăng nhập / đăng ký (GĐ 2 M2.4).
// User đã đăng nhập thì chuyển thẳng vào /exams.
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
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
    <main>
      <AuthForm initialMode={mode === "signup" ? "signup" : "signin"} />
    </main>
  );
}
