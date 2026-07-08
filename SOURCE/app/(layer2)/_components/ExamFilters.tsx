"use client";

// ExamFilters — bộ lọc Exam Browser (Layer 2). GĐ 3 M3.1 (LÀM LẠI #2).
// Bám sát TEMPLATE/L2/L2_mobile.png + #Yêu cầu engineer:
//  - *Filter nằm BÊN TRÁI exam list (cạnh nó), KHÔNG có tiêu đề trang phía trên.
//  - Đóng: chỉ hiện "tay nắm" mảnh (tam giác đen ▶ + nhãn dọc "BỘ LỌC") cạnh list.
//  - Mở: bảng lọc ĐÈ LÊN exam list (overlay, không đẩy block sang bên) + rgba highlight.
//  - Cả block *Filter là position: STICKY (top-14) → đi theo user khi cuộn trang,
//    không trôi mất như phần tử thường.
//  - Mỗi filter có toggle riêng; mở "bảng chọn" cũng là overlay (absolute) nên
//    KHÔNG làm xê dịch bố cục các filter khác.
// State lọc ở URL searchParams (UI-LAYER-MAP Mục 9) → Server Component re-query.
// 6 filter: Môn học + Lớp lọc thật; Trường/Năm/Học kỳ/Mức độ tượng trưng (data sau).

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface ExamFiltersProps {
  subjects: string[];
  grades: number[];
  selected: { subject?: string; grade?: number };
}

// Lọc nhanh — 3 ô checkbox NGOÀI dropdown, xếp dọc. Chưa gắn hành vi (để sau).
const QUICK = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "hardest", label: "Khó nhất" },
];

// rgba khai báo tường minh trong source (theo #Yêu cầu) để làm nổi bật *Filter:
const PANEL_BG = "rgba(255, 255, 255, 0.98)"; // sheet trắng nổi trên nền giấy
const OPTIONS_BG = "rgba(255, 255, 255, 0.99)"; // bảng chọn của từng filter
const SCRIM_BG = "rgba(20, 20, 20, 0.08)"; // dim exam list khi *Filter mở

export function ExamFilters({ subjects, grades, selected }: ExamFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false); // master *Filter open/close

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(params.toString() ? `${pathname}?${params}` : pathname, {
        scroll: false,
      });
    });
  }

  function clearAll() {
    startTransition(() => router.push(pathname, { scroll: false }));
  }

  const hasFilters =
    selected.subject !== undefined || selected.grade !== undefined;

  return (
    <>
      {/* Scrim rgba — dim exam list để *Filter nổi bật. Click để đóng. */}
      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-10 cursor-default"
          style={{ backgroundColor: SCRIM_BG }}
        />
      )}

      {/* Cả block *Filter STICKY dưới navbar (h-14). shrink-0: tay nắm mảnh cạnh list. */}
      <div
        className="sticky top-14 z-20 shrink-0 self-start"
        data-pending={isPending ? "" : undefined}
      >
        <div className="relative">
          {/* Tay nắm (master toggle) — tam giác đen, nhãn dọc. Luôn render = mỏ neo sticky. */}
          <button
            type="button"
            aria-label="Bộ lọc"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col items-center gap-2 rounded-md border-r border-border py-4 pl-3 pr-2.5 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)]"
          >
            <span className="relative">
              <Triangle open={open} />
              {hasFilters && (
                <span
                  aria-hidden
                  className="absolute -right-1.5 -top-1 size-1.5 rounded-full bg-brand"
                />
              )}
            </span>
            <span
              className="eyebrow"
              style={{ writingMode: "vertical-rl" }}
            >
              Bộ lọc
            </span>
          </button>

          {/* Bảng lọc OVERLAY — absolute từ mép trái, đè lên exam list (không đẩy bố cục). */}
          {open && (
            <div
              className="absolute left-0 top-0 z-20 w-[84vw] max-w-xs border border-border shadow-lg"
              style={{ backgroundColor: PANEL_BG }}
            >
              {/* Header bảng: tam giác (đóng) + nhãn + Xoá lọc. */}
              <button
                type="button"
                aria-expanded
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 border-b border-border bg-background/60 px-4 py-3"
              >
                <Triangle open />
                <span className="eyebrow">
                  Bộ lọc{hasFilters ? " · đang lọc" : ""}
                </span>
              </button>

              <FilterRow
                label="Môn học"
                selectedLabel={selected.subject}
                currentValue={selected.subject ?? ""}
                options={[
                  { value: "", label: "Tất cả" },
                  ...subjects.map((s) => ({ value: s, label: s })),
                ]}
                onSelect={(v) => setParam("subject", v)}
              />
              <FilterRow
                label="Lớp"
                selectedLabel={
                  selected.grade !== undefined
                    ? `Lớp ${selected.grade}`
                    : undefined
                }
                currentValue={
                  selected.grade !== undefined ? String(selected.grade) : ""
                }
                options={[
                  { value: "", label: "Tất cả" },
                  ...grades.map((g) => ({ value: String(g), label: `Lớp ${g}` })),
                ]}
                onSelect={(v) => setParam("grade", v)}
              />
              {/* Tượng trưng — chưa có data (engineer Q1). */}
              <FilterRow label="Trường" symbolic />
              <FilterRow label="Năm" symbolic />
              <FilterRow label="Học kỳ" symbolic />
              <FilterRow label="Mức độ" symbolic last={!hasFilters} />

              {hasFilters && (
                <div className="border-t border-border px-4 py-3">
                  <ClearButton onClick={clearAll} />
                </div>
              )}
            </div>
          )}

          {/* Lọc nhanh — 3 ô CHECKBOX (chưa gắn hành vi). Mép phải mỗi ô canh
              đúng viền phải tay nắm: đặt absolute right-0 trong .relative
              (right-0 = mép phải handle = đường kẻ). w-max nới text sang TRÁI,
              checkbox luôn ghim mép phải nên cả 3 ô thẳng hàng trên đường kẻ. */}
          <div className="absolute right-0 top-full mt-3 flex w-max flex-col gap-2">
            {QUICK.map((q) => (
              <label
                key={q.value}
                className="flex cursor-pointer items-center justify-between gap-2 whitespace-nowrap text-sm text-foreground"
              >
                {q.label}
                <input type="checkbox" className="size-4 accent-brand" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

interface Option {
  value: string;
  label: string;
}

function FilterRow({
  label,
  selectedLabel,
  currentValue,
  options,
  onSelect,
  symbolic = false,
  last = false,
}: {
  label: string;
  selectedLabel?: string;
  currentValue?: string;
  options?: Option[];
  onSelect?: (value: string) => void;
  symbolic?: boolean;
  last?: boolean;
}) {
  const [rowOpen, setRowOpen] = useState(false);

  return (
    <div className={`relative ${last ? "" : "border-b border-border"}`}>
      <button
        type="button"
        aria-expanded={rowOpen}
        onClick={() => setRowOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex flex-col gap-0.5">
          <span className="eyebrow">{label}</span>
          {selectedLabel && (
            <span className="font-serif text-base text-foreground">
              {selectedLabel}
            </span>
          )}
        </span>
        <RowTriangle open={rowOpen} />
      </button>

      {/* Bảng chọn của filter — OVERLAY absolute (đè row dưới, không xê dịch). */}
      {rowOpen && (
        <div
          className="absolute inset-x-0 top-full z-30 border-x border-b border-border shadow-md"
          style={{ backgroundColor: OPTIONS_BG }}
        >
          {symbolic ? (
            <p className="px-4 py-3 font-serif text-sm italic text-muted-foreground">
              Đang cập nhật — sẽ có ở phiên bản sau.
            </p>
          ) : (
            <ul className="py-1">
              {options!.map((opt) => {
                const active = opt.value === currentValue;
                return (
                  <li key={opt.value || "all"}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect!(opt.value);
                        setRowOpen(false);
                      }}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-left font-serif text-base transition-colors ${
                        active
                          ? "text-brand"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`h-px w-3 shrink-0 transition-colors ${
                          active ? "bg-brand" : "bg-transparent"
                        }`}
                      />
                      {opt.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Tam giác đen MASTER: ▶ (đóng) → ▼ (mở). Màu mực (gần đen) — màu thật của design.
function Triangle({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`size-3.5 shrink-0 fill-foreground transition-transform ${
        open ? "rotate-90" : ""
      }`}
    >
      <path d="M2 1 L10 6 L2 11 Z" />
    </svg>
  );
}

// Tam giác nhỏ cho từng filter: ▼ (đóng) → ▲ (mở).
function RowTriangle({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`size-2.5 shrink-0 fill-muted-foreground transition-transform ${
        open ? "-rotate-90" : "rotate-90"
      }`}
    >
      <path d="M2 1 L10 6 L2 11 Z" />
    </svg>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
    >
      Xoá lọc
    </button>
  );
}
