"use client";

// ImportInstructions — panel gấp/mở giải thích cách import (prototype
// UI_Layer4_main). Thay thế UploadGuide cũ (gộp nội dung cốt lõi vào bullet
// ngắn gọn hơn). Expand/collapse animate qua grid-template-rows (0fr↔1fr,
// 0.3s) + chevron xoay 180° đồng bộ (HIDDEN-FEATURES #1) — chỉ CSS, không
// height cứng nên không cần đo nội dung.

import { useState } from "react";
import { LIMITS } from "@/lib/ugc/limits";

const MAX_MB = Math.round(LIMITS.MAX_FILE_BYTES / (1024 * 1024));

export function ImportInstructions() {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-[4px] border border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium text-foreground"
      >
        Import Instructions
        <span
          aria-hidden
          className={[
            "text-ring transition-transform duration-300",
            open ? "rotate-180" : "",
          ].join(" ")}
        >
          ▾
        </span>
      </button>
      <div
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <ul className="list-disc space-y-2 px-4 pb-4 pl-9 text-sm leading-relaxed text-foreground">
            <li>Supported formats: PNG, JPEG, WebP, or PDF.</li>
            <li>
              Choose <span className="font-medium">Automatic</span> to let AI scan and
              extract the exam — no manual entry needed.
            </li>
            <li>
              Choose <span className="font-medium">Manual</span> to fill in the exam
              details yourself.
            </li>
            <li>Answers always come from your answer file — never guessed by AI.</li>
            <li>
              Maximum file size: {MAX_MB}MB each · PDF up to {LIMITS.MAX_PDF_PAGES} pages.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
