// ImportContentManagement — trang import nội dung generic (Layer 4).
// Theo TEMPLATE/L4/import&uploadhistorymanagement.zip: 2 tab Upload (dropzone)
// / Upload History (bảng + menu hành động mỗi hàng). Client component vì cần
// state tab + menu mở.
//
// PHẠM VI: UI-only (đã chốt với product owner) — dữ liệu lịch sử là mock,
// dropzone/"Choose file"/"View details"/"Retry import"/"Delete" chưa nối
// backend thật. Khi có backend, thay MOCK_HISTORY bằng data thật + wire các
// handler tương ứng.

"use client";

import { useEffect, useRef, useState } from "react";

type UploadStatus = "success" | "failed" | "processing";

interface UploadHistoryRow {
  name: string;
  time: string;
  status: UploadStatus;
}

const STATUS_LABEL: Record<UploadStatus, string> = {
  success: "Success",
  failed: "Failed",
  processing: "Processing",
};

const STATUS_DOT: Record<UploadStatus, string> = {
  success: "bg-[#3F6B3A]",
  failed: "bg-brand",
  processing: "bg-muted-foreground",
};

const STATUS_TEXT: Record<UploadStatus, string> = {
  success: "text-[#3F6B3A]",
  failed: "text-brand",
  processing: "text-muted-foreground",
};

const MOCK_HISTORY: UploadHistoryRow[] = [
  { name: "q2-report.xlsx", time: "2026-07-14 09:42", status: "success" },
  { name: "customer-list.csv", time: "2026-07-14 08:15", status: "success" },
  { name: "june-contract.pdf", time: "2026-07-13 17:03", status: "failed" },
  { name: "product-data.xlsx", time: "2026-07-13 11:20", status: "processing" },
  { name: "internal-policy.docx", time: "2026-07-12 15:47", status: "success" },
  { name: "user-survey.csv", time: "2026-07-11 10:05", status: "failed" },
];

type Tab = "upload" | "history";

const TAB_BUTTON_BASE =
  "rounded-[4px] px-5 py-3 text-xs font-medium uppercase tracking-[0.04em] transition-colors";

export function ImportContentManagement() {
  const [tab, setTab] = useState<Tab>("upload");
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Click ngoài menu đang mở → đóng lại (README template khuyến nghị; prototype
  // gốc chưa có). Ref gắn lên wrapper (nút "⋯" + menu) nên click chính nút toggle
  // không bị coi là "ngoài".
  useEffect(() => {
    if (openMenuIndex === null) return;
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuIndex(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenuIndex]);

  return (
    <main className="mx-auto flex h-[calc(100dvh-3.75rem)] w-full max-w-[880px] flex-col overflow-hidden px-10 pt-10 pb-8">
      <div className="preload-fade" style={{ "--preload-order": 1 } as React.CSSProperties}>
        <h1 className="text-foreground font-serif text-4xl font-semibold">
          Import Content Management
        </h1>
        <div className="bg-ring mt-4 h-0.5 w-10" />
        <p className="text-muted-foreground mt-4 max-w-[560px] leading-relaxed">
          Upload documents to import content into the system. All upload activity is recorded below.
        </p>
      </div>

      <div
        className="preload-fade border-border mt-6 mb-6 flex gap-2 border-t pt-5"
        style={{ "--preload-order": 2 } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={() => setTab("upload")}
          aria-pressed={tab === "upload"}
          className={`${TAB_BUTTON_BASE} ${
            tab === "upload"
              ? "bg-brand text-brand-foreground hover:opacity-90"
              : "border-border text-foreground hover:bg-accent border"
          }`}
        >
          Upload
        </button>
        <button
          type="button"
          onClick={() => setTab("history")}
          aria-pressed={tab === "history"}
          className={`${TAB_BUTTON_BASE} ${
            tab === "history"
              ? "bg-brand text-brand-foreground hover:opacity-90"
              : "border-border text-foreground hover:bg-accent border"
          }`}
        >
          Upload History
        </button>
      </div>

      {tab === "upload" ? (
        <div key="upload" className="fade-slide-in min-h-0 flex-1">
          <div className="border-ring flex flex-col items-center gap-4 rounded-lg border-2 border-dashed px-10 py-10 text-center">
            <svg
              aria-hidden
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-brand"
              strokeWidth="1.3"
            >
              <path d="M12 3v12" strokeLinecap="round" />
              <path d="M7 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13A1.5 1.5 0 0 0 20 19.5V17"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p className="text-foreground text-[17px]">Drag and drop a document here</p>
              <p className="text-muted-foreground mt-1.5 text-[13px]">or</p>
            </div>
            <button
              type="button"
              className="bg-brand text-brand-foreground rounded-[4px] px-6 py-3 text-xs font-medium tracking-[0.04em] uppercase transition-opacity hover:opacity-90"
            >
              Choose file
            </button>
            <p className="text-muted-foreground mt-1 text-xs">
              Supports CSV, XLSX, PDF, DOCX — up to 25MB per file
            </p>
          </div>
        </div>
      ) : (
        <div key="history" className="fade-slide-in flex min-h-0 flex-1 flex-col">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-foreground font-serif text-2xl font-medium">Upload History</h2>
            <span className="text-muted-foreground text-sm">{MOCK_HISTORY.length} items</span>
          </div>

          {/* Chỉ vùng danh sách cuộn nội bộ — trang không cuộn dù danh sách dài. */}
          <div className="border-border min-h-0 flex-1 overflow-y-auto rounded-lg border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-foreground bg-background sticky top-0 border-b">
                  <th className="text-muted-foreground py-3 pl-4 text-left text-xs font-medium tracking-[0.04em] uppercase">
                    File name
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-[0.04em] uppercase">
                    Uploaded
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-[0.04em] uppercase">
                    Status
                  </th>
                  <th className="text-muted-foreground py-3 pr-4 text-right text-xs font-medium tracking-[0.04em] uppercase" />
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((row, i) => (
                  <tr
                    key={row.name}
                    className="border-border border-b transition-colors hover:bg-[#E3D5B4]"
                  >
                    <td className="text-foreground py-4 pr-4 pl-4 font-serif text-[15px]">
                      {row.name}
                    </td>
                    <td className="text-muted-foreground px-4 py-4 text-sm whitespace-nowrap">
                      {row.time}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm ${STATUS_TEXT[row.status]}`}
                      >
                        <span
                          aria-hidden
                          className={`size-1.5 rounded-full ${STATUS_DOT[row.status]}`}
                        />
                        {STATUS_LABEL[row.status]}
                      </span>
                    </td>
                    <td className="relative py-4 pr-4 text-right text-sm whitespace-nowrap">
                      <div
                        ref={openMenuIndex === i ? menuRef : undefined}
                        className="relative inline-block"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenMenuIndex((cur) => (cur === i ? null : i))}
                          aria-haspopup="menu"
                          aria-expanded={openMenuIndex === i}
                          className="text-muted-foreground hover:text-foreground px-2 py-1 leading-none tracking-[0.08em] transition-colors"
                        >
                          ⋯
                        </button>
                        {openMenuIndex === i && (
                          <div
                            role="menu"
                            className="border-border bg-background absolute top-[38px] right-0 z-10 min-w-[150px] overflow-hidden rounded-lg border text-left"
                          >
                            <a
                              href="#"
                              role="menuitem"
                              className="text-brand block px-4 py-2.5 text-sm transition-colors hover:bg-[#E3D5B4]"
                            >
                              View details
                            </a>
                            <a
                              href="#"
                              role="menuitem"
                              className="border-border text-brand block border-t px-4 py-2.5 text-sm transition-colors hover:bg-[#E3D5B4]"
                            >
                              Retry import
                            </a>
                            <a
                              href="#"
                              role="menuitem"
                              className="border-border text-foreground block border-t px-4 py-2.5 text-sm transition-colors hover:bg-[#E3D5B4]"
                            >
                              Delete
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
