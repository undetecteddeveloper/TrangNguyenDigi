// Exam Browser — /exams (Layer 2). Server Component.
// GĐ 3 M3.1 (LÀM LẠI #2): bố cục bám sát TEMPLATE/L2/L2_mobile.png.
//  - SiteHeader (navbar kiểu homepage, từ (layer2)/layout.tsx) sticky trên cùng.
//    KHÔNG có tiêu đề trang (template không có — engineer yêu cầu bỏ).
//  - *Filter nằm BÊN TRÁI, ngay cạnh exam list; khi mở thì ĐÈ LÊN list (overlay).
//    Cả block *Filter là position: sticky → đi theo user khi cuộn.
//  - Exam list chiếm phần còn lại (flex-1) — S#19: container nới max-w-6xl
//    (khớp bề ngang navbar) để lưới hiển thị tới 3 card/hàng.
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
    // Theme root "Mực & Sơn mài" (S#17) — scope .theme-ebp đã xóa, block/nav
    // lấy từ biến mặc định ở :root (globals.css).
    <div className="bg-background">
      <main className="mx-auto w-full max-w-6xl">
        {/* MỘT block căn giữa: *Filter (trái, sticky, overlay) + lưới ExamCard
            tối đa 3 cột (phải, flex-1). mx-auto của <main> giữ block căn giữa. */}
        <div className="relative flex items-start">
          <ExamFilters
            subjects={facets.subjects}
            grades={facets.grades}
            selected={{ subject, grade }}
          />

          {/* preload order 2 — lưới card fade sau navbar (0) + filter (1) (S#21). */}
          <div
            className="preload-fade min-w-0 flex-1 px-4 py-5"
            style={{ "--preload-order": 2 } as React.CSSProperties}
          >
            <ExamBrowser exams={exams} />
          </div>
        </div>
      </main>
    </div>
  );
}
