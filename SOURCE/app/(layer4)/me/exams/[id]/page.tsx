// S-03 Review & edit — /me/exams/[id] (UGC v2.0, Task 6.4). Server Component.
// Guard: chưa đăng nhập → /?auth=signin; không phải của mình / không tồn tại →
// /me/exams (getMyExam trả null qua RLS + author check).

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getMyExam } from "@/app/(layer4)/queries";
import { ReviewScreen } from "@/app/(layer4)/_components/ReviewScreen";

export default async function ReviewExamPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/?auth=signin");

  const { id } = await params;
  const detail = await getMyExam(id);
  if (!detail) redirect("/me/exams");

  // processing: extract chưa xong (không nên vào đây trực tiếp) → về danh sách.
  if (detail.status === "processing") redirect("/me/exams");

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <ReviewScreen examId={detail.id} status={detail.status} initialExam={detail.exam} />
    </main>
  );
}
