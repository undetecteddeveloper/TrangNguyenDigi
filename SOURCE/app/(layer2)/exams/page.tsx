// Exam Browser — /exams (Layer 2).
// Server Component: đọc đề từ Supabase (GĐ 2 M2.5, thay fake-data).

import { listExams } from "@/app/(layer2)/queries";
import { ExamBrowser } from "@/app/(layer2)/_components/ExamBrowser";

export default async function ExamsPage() {
  const exams = await listExams();

  return (
    <main>
      <h1>Chọn đề luyện</h1>
      <ExamBrowser exams={exams} />
    </main>
  );
}
