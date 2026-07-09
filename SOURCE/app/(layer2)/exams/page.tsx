// Exam Browser — /exams (Layer 2). Server Component.
// GĐ 3 M3.1 (LÀM LẠI #2): bố cục bám sát TEMPLATE/L2/L2_mobile.png.
//  - SiteHeader (logo + dropdown menu) sticky trên cùng. KHÔNG có tiêu đề trang
//    (template không có — engineer yêu cầu bỏ).
//  - *Filter nằm BÊN TRÁI, ngay cạnh exam list; khi mở thì ĐÈ LÊN list (overlay).
//    Cả block *Filter là position: sticky → đi theo user khi cuộn.
//  - Exam list chiếm phần còn lại (flex-1).
// Visual language "tờ giấy trắng / focused". Bộ lọc qua URL searchParams → re-query.

import { listExams, listExamFacets } from "@/app/(layer2)/queries";
import { ExamBrowser } from "@/app/(layer2)/_components/ExamBrowser";
import { ExamFilters } from "@/app/(layer2)/_components/ExamFilters";

type SearchParams = Promise<{ subject?: string; grade?: string }>;

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const subject = sp.subject || undefined;
  const grade = sp.grade ? Number(sp.grade) : undefined;

  const [exams, facets] = await Promise.all([
    listExams({ subject, grade }),
    listExamFacets(),
  ]);

  return (
    // Scope theme EBP: override biến --nav-*/--block-* (globals.css). Nền dark
    // kế thừa root (bg-background) — đúng yêu cầu "Layer ngoài L1 dựa vào root".
    <div className="theme-ebp bg-background">
      <main className="mx-auto w-full max-w-3xl">
        {/* MỘT block căn giữa: *Filter (trái, sticky, overlay) + lưới ExamCard
            2 cột × n hàng (phải, flex-1). mx-auto của <main> giữ block căn giữa. */}
        <div className="relative flex items-start">
          <ExamFilters
            subjects={facets.subjects}
            grades={facets.grades}
            selected={{ subject, grade }}
          />

          <div className="min-w-0 flex-1 px-4 py-5">
            <ExamBrowser exams={exams} />
          </div>
        </div>
      </main>
    </div>
  );
}
