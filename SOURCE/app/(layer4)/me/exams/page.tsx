// S-02 My exams — /me/exams (UGC v2.0, Task 6.3). Server Component.
// Guard: chưa đăng nhập → /?auth=signin (AC-002). Banner ?published=1 (D13).

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { listMyExams } from "@/app/(layer4)/queries";
import { MyExamsList } from "@/app/(layer4)/_components/MyExamsList";

export default async function MyExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/?auth=signin");

  const { published } = await searchParams;
  const exams = await listMyExams();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <MyExamsList exams={exams} justPublished={published === "1"} />
    </main>
  );
}
