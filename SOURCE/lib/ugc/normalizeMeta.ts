// UGC Exam Upload v2.2 — normalizeMeta: ranh giới DUY NHẤT từ output AI tới
// cột DB (Design Doc §v2.2, ADR-0007). THUẦN (không I/O), client-safe — vai
// trò tương tự assembleExam cho câu hỏi: AI ĐỀ XUẤT, CODE QUYẾT ĐỊNH.
//
// Nguyên tắc:
//   - Giá trị TÁC GIẢ GÕ luôn thắng giá trị AI đọc (model không bao giờ đè
//     lên thứ con người viết).
//   - Ngoài khoảng hợp lệ → SENTINEL ("" / 0), KHÔNG BAO GIỜ clamp — clamp
//     tạo ra giá trị "hợp lý sai" lọt qua mắt review; field trống thì nhìn
//     là thấy (ADR-0007 kill criterion: fabrication là hard fail).
//   - Kết quả trả về không bao giờ vi phạm CHECK của schema hay limits.ts.

import { makeUgcError } from "./errorCopy";
import { LIMITS } from "./limits";
import { normalizeSubject } from "./subjects";
import type { ExamMeta, ExtractedMeta, UgcError } from "./types";

/** Giá trị tác giả đã gõ ở S-01 (đã parse, chỉ field có thật). */
export type TypedMeta = Partial<ExamMeta>;

/** Sentinel = "chưa có giá trị" cho cột NOT NULL (subject ""/grade 0/duration 0).
 * Bị validateMetaForPublish chặn — không bao giờ publish được. */
export const META_SENTINEL = { subject: "", grade: 0, durationMinutes: 0 } as const;

/** "Năm học: 2024 – 2025" / "2024-2025" / "2024" → năm BẮT ĐẦU; không parse
 * được hoặc ngoài khoảng → null. */
export function parseSchoolYear(raw: string | null): number | null {
  if (!raw) return null;
  const m = /(\d{4})/.exec(raw);
  if (!m) return null;
  const y = Number.parseInt(m[1], 10);
  return y >= LIMITS.MIN_YEAR && y <= LIMITS.MAX_YEAR ? y : null;
}

/** "HỌC KÌ I" / "HK1" / "Học kỳ 2" / "II" → HK1|HK2; khác → null. */
export function parseSemester(raw: string | null): "HK1" | "HK2" | null {
  if (!raw) return null;
  const s = raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .trim();
  // "HOC KI I", "HOC KY 1", "HK1", "KI I", "I"…
  if (/(HK\s*|KI\s*|KY\s*)?(1|I)$/.test(s) && !/(2|II)$/.test(s)) return "HK1";
  if (/(HK\s*|KI\s*|KY\s*)?(2|II)$/.test(s)) return "HK2";
  return null;
}

function intInRange(v: number | null | undefined, min: number, max: number): number | null {
  if (v == null || !Number.isInteger(v)) return null;
  return v >= min && v <= max ? v : null;
}

function truncate(s: string, max: number): string {
  const t = s.trim();
  return t.length > max ? t.slice(0, max) : t;
}

/** Tên file → title dự phòng ("de_kiem_tra_toan.pdf" → "de kiem tra toan"). */
export function titleFromFilename(filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  return truncate(stem.length > 0 ? stem : "Untitled exam", LIMITS.MAX_TITLE);
}

/**
 * Hợp nhất metadata AI đọc + tác giả gõ → ExamMeta an toàn để ghi DB.
 * `fallbackTitle` = tên file đề (đường lui khi cả AI lẫn tác giả không có
 * title — AC-040: upload không bao giờ fail vì metadata).
 */
export function normalizeMeta(
  raw: ExtractedMeta | null,
  typed: TypedMeta,
  fallbackTitle: string
): ExamMeta {
  const r: ExtractedMeta = raw ?? {
    title: null,
    subject: null,
    grade: null,
    durationMinutes: null,
    school: null,
    schoolYear: null,
    semester: null,
  };

  // subject: typed (đã canonical từ <select>) thắng; AI map qua vocabulary
  // (O-9) — không khớp → sentinel "".
  const subject =
    typed.subject !== undefined && typed.subject !== ""
      ? typed.subject
      : (normalizeSubject(r.subject) ?? META_SENTINEL.subject);

  const grade =
    typed.grade !== undefined && typed.grade !== 0
      ? typed.grade
      : (intInRange(r.grade, LIMITS.MIN_GRADE, LIMITS.MAX_GRADE) ?? META_SENTINEL.grade);

  const durationMinutes =
    typed.durationMinutes !== undefined && typed.durationMinutes !== 0
      ? typed.durationMinutes
      : (intInRange(r.durationMinutes, LIMITS.MIN_DURATION, LIMITS.MAX_DURATION) ??
        META_SENTINEL.durationMinutes);

  // title: typed → AI → ghép từ field có thật → tên file.
  let title: string;
  if (typed.title !== undefined && typed.title.trim() !== "") {
    title = truncate(typed.title, LIMITS.MAX_TITLE);
  } else if (r.title && r.title.trim() !== "") {
    title = truncate(r.title, LIMITS.MAX_TITLE);
  } else if (subject !== "" || grade !== 0) {
    title = truncate(
      ["Đề kiểm tra", subject !== "" ? subject : null, grade !== 0 ? `lớp ${grade}` : null]
        .filter(Boolean)
        .join(" "),
      LIMITS.MAX_TITLE
    );
  } else {
    title = titleFromFilename(fallbackTitle);
  }

  const school =
    typed.school !== undefined
      ? typed.school
      : r.school && r.school.trim() !== ""
        ? truncate(r.school, LIMITS.MAX_SCHOOL)
        : undefined;

  const schoolYear =
    typed.schoolYear !== undefined ? typed.schoolYear : (parseSchoolYear(r.schoolYear) ?? undefined);

  const semester =
    typed.semester !== undefined ? typed.semester : (parseSemester(r.semester) ?? undefined);

  return { title, subject, grade, durationMinutes, school, schoolYear, semester };
}

/**
 * Gate publish (ADR-0007 quyết định trung tâm): field required thiếu (sentinel)
 * → META_INCOMPLETE; có giá trị nhưng ngoài khoảng → META_INVALID. Rỗng ⇔ đủ
 * điều kiện publish về mặt metadata. Dùng bởi publishExam (server, bắt buộc —
 * nút disable chỉ là UX) và ReviewScreen (client, hiển thị sớm).
 */
export function validateMetaForPublish(meta: ExamMeta): UgcError[] {
  const errors: UgcError[] = [];

  if (meta.title.trim() === "") {
    errors.push(makeUgcError("META_INCOMPLETE", null, { field: "title" }));
  }
  if (meta.subject === "") {
    errors.push(makeUgcError("META_INCOMPLETE", null, { field: "subject" }));
  }
  if (meta.grade === 0) {
    errors.push(makeUgcError("META_INCOMPLETE", null, { field: "grade" }));
  } else if (meta.grade < LIMITS.MIN_GRADE || meta.grade > LIMITS.MAX_GRADE) {
    errors.push(makeUgcError("META_INVALID", null, { field: "grade" }));
  }
  if (meta.durationMinutes === 0) {
    errors.push(makeUgcError("META_INCOMPLETE", null, { field: "durationMinutes" }));
  } else if (
    meta.durationMinutes < LIMITS.MIN_DURATION ||
    meta.durationMinutes > LIMITS.MAX_DURATION
  ) {
    errors.push(makeUgcError("META_INVALID", null, { field: "durationMinutes" }));
  }
  if (
    meta.schoolYear !== undefined &&
    (meta.schoolYear < LIMITS.MIN_YEAR || meta.schoolYear > LIMITS.MAX_YEAR)
  ) {
    errors.push(makeUgcError("META_INVALID", null, { field: "schoolYear" }));
  }

  return errors;
}
