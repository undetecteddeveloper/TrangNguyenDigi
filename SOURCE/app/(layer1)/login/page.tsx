// UI Layer 1 — Trang đăng nhập / đăng ký (GĐ 2 M2.4).
// User đã đăng nhập thì chuyển thẳng vào /exams.
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { AuthForm } from "../_components/AuthForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/exams");

  return (
    <main>
      <AuthForm />
    </main>
  );
}
