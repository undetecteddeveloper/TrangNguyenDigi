// Exam Browser — /exams (Layer 2).
// Server Component: đọc fake data, render list đề (GĐ 1, M1.3).

import { getFakeExams } from "@/lib/fake-data/exams";
import { ExamBrowser } from "@/app/(layer2)/_components/ExamBrowser";

export default function ExamsPage() {
  const exams = getFakeExams();

  return (
    <main>
      <h1>Chọn đề luyện</h1>
      <ExamBrowser exams={exams} />
    </main>
  );
}
