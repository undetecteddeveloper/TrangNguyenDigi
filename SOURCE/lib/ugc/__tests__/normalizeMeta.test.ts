// Unit tests Task M2 (v2.2, Gate E) — normalizeMeta là ranh giới DUY NHẤT
// AI → DB: mọi rule per-field, KHÔNG CLAMP (ngoài khoảng → sentinel, không
// phải giá trị "hợp lý sai"), typed luôn thắng extracted, kết quả không bao
// giờ vượt limits.ts.

import { describe, expect, it } from "vitest";
import { LIMITS } from "../limits";
import {
  META_SENTINEL,
  normalizeMeta,
  parseSchoolYear,
  parseSemester,
  titleFromFilename,
  validateMetaForPublish,
} from "../normalizeMeta";
import { normalizeSubject } from "../subjects";
import type { ExamMeta, ExtractedMeta } from "../types";

const NULL_META: ExtractedMeta = {
  title: null,
  subject: null,
  grade: null,
  durationMinutes: null,
  school: null,
  schoolYear: null,
  semester: null,
};

const FALLBACK = "de_kiem_tra_toan.pdf";

describe("normalizeSubject — vocabulary O-9", () => {
  it("map tên Việt (có/không dấu, viết tắt) về canonical", () => {
    expect(normalizeSubject("Toán")).toBe("Math");
    expect(normalizeSubject("toan")).toBe("Math");
    expect(normalizeSubject("Vật lí")).toBe("Physics");
    expect(normalizeSubject("VẬT LÝ")).toBe("Physics");
    expect(normalizeSubject("Hoá học")).toBe("Chemistry");
    expect(normalizeSubject("Ngữ văn")).toBe("Literature");
    expect(normalizeSubject("Tiếng Anh")).toBe("English");
    expect(normalizeSubject("GDCD")).toBe("Civic Education");
  });

  it("bóc tiền tố 'Môn:' khi model trả nguyên dòng", () => {
    expect(normalizeSubject("Môn: Toán")).toBe("Math");
    expect(normalizeSubject("Môn thi: Vật lí")).toBe("Physics");
  });

  it("giá trị canonical sẵn có đi qua nguyên vẹn", () => {
    expect(normalizeSubject("Math")).toBe("Math");
    expect(normalizeSubject("Chemistry")).toBe("Chemistry");
  });

  it("không khớp → null, KHÔNG đoán", () => {
    expect(normalizeSubject("Thiên văn học")).toBeNull();
    expect(normalizeSubject("")).toBeNull();
    expect(normalizeSubject(null)).toBeNull();
  });
});

describe("parseSchoolYear", () => {
  it("'2024 – 2025' → năm bắt đầu 2024", () => {
    expect(parseSchoolYear("2024 – 2025")).toBe(2024);
    expect(parseSchoolYear("2024-2025")).toBe(2024);
    expect(parseSchoolYear("Năm học: 2024 – 2025")).toBe(2024);
    expect(parseSchoolYear("2024")).toBe(2024);
  });

  it("không parse được / ngoài khoảng → null", () => {
    expect(parseSchoolYear("không rõ")).toBeNull();
    expect(parseSchoolYear(null)).toBeNull();
    expect(parseSchoolYear("999")).toBeNull();
  });
});

describe("parseSemester — các cách in trên đề", () => {
  it("HK1: 'HỌC KÌ I' / 'HK1' / 'Học kỳ 1' / 'I'", () => {
    expect(parseSemester("HỌC KÌ I")).toBe("HK1");
    expect(parseSemester("HK1")).toBe("HK1");
    expect(parseSemester("Học kỳ 1")).toBe("HK1");
    expect(parseSemester("I")).toBe("HK1");
  });

  it("HK2: 'HỌC KÌ II' / 'HK2' / 'Học kỳ 2' / 'II'", () => {
    expect(parseSemester("HỌC KÌ II")).toBe("HK2");
    expect(parseSemester("HK2")).toBe("HK2");
    expect(parseSemester("Học kỳ 2")).toBe("HK2");
    expect(parseSemester("II")).toBe("HK2");
  });

  it("khác → null", () => {
    expect(parseSemester("Cả năm")).toBeNull();
    expect(parseSemester(null)).toBeNull();
  });
});

describe("normalizeMeta — KHÔNG CLAMP (Gate E, điểm mấu chốt)", () => {
  it("duration 900 (ngoài 1–600) → SENTINEL 0, KHÔNG phải 600", () => {
    const meta = normalizeMeta({ ...NULL_META, durationMinutes: 900 }, {}, FALLBACK);
    expect(meta.durationMinutes).toBe(META_SENTINEL.durationMinutes);
    expect(meta.durationMinutes).not.toBe(LIMITS.MAX_DURATION);
  });

  it("grade 13 (ngoài 6–12) → SENTINEL 0, KHÔNG phải 12", () => {
    const meta = normalizeMeta({ ...NULL_META, grade: 13 }, {}, FALLBACK);
    expect(meta.grade).toBe(META_SENTINEL.grade);
    expect(meta.grade).not.toBe(LIMITS.MAX_GRADE);
  });

  it("grade 5 (dưới 6) → sentinel; grade hợp lệ đi qua", () => {
    expect(normalizeMeta({ ...NULL_META, grade: 5 }, {}, FALLBACK).grade).toBe(0);
    expect(normalizeMeta({ ...NULL_META, grade: 12 }, {}, FALLBACK).grade).toBe(12);
  });

  it("schoolYear ngoài khoảng → undefined (optional, không sentinel)", () => {
    const meta = normalizeMeta({ ...NULL_META, schoolYear: "0999" }, {}, FALLBACK);
    expect(meta.schoolYear).toBeUndefined();
  });
});

describe("normalizeMeta — typed LUÔN thắng extracted", () => {
  it("mọi field typed đè lên giá trị AI", () => {
    const raw: ExtractedMeta = {
      title: "Đề AI đọc",
      subject: "Toán",
      grade: 11,
      durationMinutes: 45,
      school: "Trường AI đọc",
      schoolYear: "2023 – 2024",
      semester: "HỌC KÌ I",
    };
    const meta = normalizeMeta(
      raw,
      {
        title: "Đề tác giả gõ",
        subject: "Physics",
        grade: 12,
        durationMinutes: 90,
        school: "Trường tác giả gõ",
        schoolYear: 2025,
        semester: "HK2",
      },
      FALLBACK
    );
    expect(meta).toEqual({
      title: "Đề tác giả gõ",
      subject: "Physics",
      grade: 12,
      durationMinutes: 90,
      school: "Trường tác giả gõ",
      schoolYear: 2025,
      semester: "HK2",
    });
  });

  it("typed một phần: field gõ thắng, field trống nhận AI", () => {
    const raw: ExtractedMeta = { ...NULL_META, subject: "Toán", grade: 10, durationMinutes: 60 };
    const meta = normalizeMeta(raw, { grade: 11 }, FALLBACK);
    expect(meta.subject).toBe("Math");
    expect(meta.grade).toBe(11);
    expect(meta.durationMinutes).toBe(60);
  });
});

describe("normalizeMeta — title composition + fallback", () => {
  it("title AI có → dùng (truncate về MAX_TITLE)", () => {
    const meta = normalizeMeta(
      { ...NULL_META, title: "x".repeat(LIMITS.MAX_TITLE + 50) },
      {},
      FALLBACK
    );
    expect(meta.title).toHaveLength(LIMITS.MAX_TITLE);
  });

  it("title thiếu nhưng có subject/grade → ghép 'Đề kiểm tra …'", () => {
    const meta = normalizeMeta({ ...NULL_META, subject: "Toán", grade: 12 }, {}, FALLBACK);
    expect(meta.title).toBe("Đề kiểm tra Math lớp 12");
  });

  it("không có gì → tên file (bỏ đuôi, _/- thành khoảng trắng)", () => {
    const meta = normalizeMeta(NULL_META, {}, "de_kiem_tra_toan.pdf");
    expect(meta.title).toBe("de kiem tra toan");
  });

  it("raw = null (extractMeta fail) → vẫn trả meta hợp lệ với sentinel (AC-040)", () => {
    const meta = normalizeMeta(null, {}, FALLBACK);
    expect(meta.subject).toBe("");
    expect(meta.grade).toBe(0);
    expect(meta.durationMinutes).toBe(0);
    expect(meta.title).toBe("de kiem tra toan");
  });
});

describe("normalizeMeta — truncation về limits", () => {
  it("school dài → truncate MAX_SCHOOL; school AI rỗng → undefined", () => {
    const meta = normalizeMeta(
      { ...NULL_META, school: "T".repeat(LIMITS.MAX_SCHOOL + 10) },
      {},
      FALLBACK
    );
    expect(meta.school).toHaveLength(LIMITS.MAX_SCHOOL);
    expect(normalizeMeta({ ...NULL_META, school: "  " }, {}, FALLBACK).school).toBeUndefined();
  });
});

describe("titleFromFilename", () => {
  it("bỏ đuôi file, _- → space", () => {
    expect(titleFromFilename("de-thi_toan.2025.pdf")).toBe("de thi toan.2025");
    expect(titleFromFilename(".pdf")).toBe("Untitled exam");
  });
});

describe("validateMetaForPublish — gate publish (Gate F contract)", () => {
  const CLEAN: ExamMeta = {
    title: "Đề kiểm tra",
    subject: "Math",
    grade: 12,
    durationMinutes: 90,
  };

  it("meta sạch → không lỗi", () => {
    expect(validateMetaForPublish(CLEAN)).toEqual([]);
  });

  it("sentinel → META_INCOMPLETE đúng field", () => {
    const errors = validateMetaForPublish({
      title: "",
      subject: "",
      grade: 0,
      durationMinutes: 0,
    });
    expect(errors.map((e) => [e.code, e.field])).toEqual([
      ["META_INCOMPLETE", "title"],
      ["META_INCOMPLETE", "subject"],
      ["META_INCOMPLETE", "grade"],
      ["META_INCOMPLETE", "durationMinutes"],
    ]);
  });

  it("giá trị ngoài khoảng (không phải sentinel) → META_INVALID", () => {
    const errors = validateMetaForPublish({ ...CLEAN, grade: 13, durationMinutes: 900 });
    expect(errors.map((e) => [e.code, e.field])).toEqual([
      ["META_INVALID", "grade"],
      ["META_INVALID", "durationMinutes"],
    ]);
  });

  it("schoolYear optional: có nhưng ngoài khoảng → META_INVALID; thiếu → OK", () => {
    expect(validateMetaForPublish({ ...CLEAN, schoolYear: 999 }).map((e) => e.code)).toEqual([
      "META_INVALID",
    ]);
    expect(validateMetaForPublish(CLEAN)).toEqual([]);
  });

  it("mỗi lỗi mang message trỏ 'Exam details' (ErrorPanel copy)", () => {
    const [err] = validateMetaForPublish({ ...CLEAN, subject: "" });
    expect(err.message).toContain("Exam details");
    expect(err.message).toContain("subject");
    expect(err.questionNumber).toBeNull();
  });
});
