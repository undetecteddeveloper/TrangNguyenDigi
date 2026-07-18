// UGC Exam Upload v2.1 — crop hình câu hỏi + upload Storage (ADR-0004 + ADR-0006).
//
// Code thuần + Storage, KHÔNG gọi AI. Với mỗi câu có imageBox:
//   - Nguồn PDF: render trang bằng mupdf (WASM) rồi crop bounding box (sharp).
//     (O-4: chọn bbox-crop-từ-trang-render thống nhất cho MVP; trích ảnh
//     nhúng PDF là tối ưu hoá tương lai.)
//   - Nguồn ảnh: crop bounding box trực tiếp bằng sharp.
// v2.1: bbox theo GIAO THỨC NATIVE GEMINI — box2d [ymin,xmin,ymax,xmax] số
// nguyên 0..1000 (ADR-0006); quy đổi pixel DUY NHẤT tại boxToPixels. Khoá map
// hình + đường dẫn file mang PHẦN (ADR-0005) — tránh "Câu 1" các phần đè nhau.
// Upload exam-images/{examId}/p{part}q{n}.png qua Supabase client được inject
// (O-3: action truyền client phiên user → RLS enforced; row exams phải tồn tại
// trước — action tạo exam status='processing' trước khi gọi hàm này).
// Thất bại từng hình → IMAGE_CROP_FAILED(part, n).
//
// URL trả về: dạng object-URL ổn định cùng origin Supabase (getPublicUrl).
// Bucket private → tầng đọc (queries) đổi sang signed URL trước khi render;
// QuestionFigure chỉ allowlist origin này.

import sharp from "sharp";
import type { SupabaseClient } from "@supabase/supabase-js";
import { qKey } from "./assembleExam";
import { makeUgcError } from "./errorCopy";
import type { PipelineLogger } from "./pipelineLog";
import type { BoundingBox, ExtractedQuestion, Result, UgcError } from "./types";
import type { FileRef } from "./fileRef";

const BUCKET = "exam-images";
// Render PDF ở scale 2x để hình crop đủ nét.
const PDF_RENDER_SCALE = 2;

function clamp1000(v: number): number {
  return Math.min(1000, Math.max(0, v));
}

/** box2d native Gemini ([ymin,xmin,ymax,xmax] 0..1000) → vùng pixel hợp lệ
 * trong ảnh width×height (ADR-0006 — điểm quy đổi DUY NHẤT). */
export function boxToPixels(
  box: BoundingBox,
  width: number,
  height: number
): { left: number; top: number; width: number; height: number } | null {
  const [ymin, xmin, ymax, xmax] = box.box2d.map(clamp1000);
  if (ymin >= ymax || xmin >= xmax) return null;
  const px = {
    left: Math.round((xmin / 1000) * width),
    top: Math.round((ymin / 1000) * height),
    width: Math.round(((xmax - xmin) / 1000) * width),
    height: Math.round(((ymax - ymin) / 1000) * height),
  };
  if (px.width < 1 || px.height < 1) return null;
  // Không tràn mép ảnh sau khi làm tròn.
  px.width = Math.min(px.width, width - px.left);
  px.height = Math.min(px.height, height - px.top);
  if (px.width < 1 || px.height < 1) return null;
  return px;
}

/** Render một trang PDF (1-based) thành PNG bytes bằng mupdf (WASM). */
async function renderPdfPage(pdfBytes: Uint8Array, page1Based: number): Promise<Uint8Array> {
  const mupdf = await import("mupdf");
  const doc = mupdf.Document.openDocument(Buffer.from(pdfBytes), "application/pdf");
  const pageIndex = page1Based - 1;
  if (pageIndex < 0 || pageIndex >= doc.countPages()) {
    throw new Error(`PDF không có trang ${page1Based}`);
  }
  const page = doc.loadPage(pageIndex);
  const pixmap = page.toPixmap(
    mupdf.Matrix.scale(PDF_RENDER_SCALE, PDF_RENDER_SCALE),
    mupdf.ColorSpace.DeviceRGB,
    false,
    true
  );
  return pixmap.asPNG();
}

/** Crop 1 hình theo bbox từ file nguồn (PDF hoặc ảnh) → PNG buffer. */
async function cropOne(file: FileRef, box: BoundingBox): Promise<Buffer> {
  const pageBytes =
    file.mediaType === "application/pdf" ? await renderPdfPage(file.bytes, box.page) : file.bytes;
  const image = sharp(Buffer.from(pageBytes));
  const meta = await image.metadata();
  if (!meta.width || !meta.height) throw new Error("Không đọc được kích thước ảnh");
  const px = boxToPixels(box, meta.width, meta.height);
  if (!px) throw new Error("Bounding box rỗng sau khi quy đổi pixel");
  return image.extract(px).png().toBuffer();
}

/**
 * Bản lenient (Task 4.1): LUÔN trả về map các hình crop THÀNH CÔNG (khoá
 * composite `part:number` — ADR-0005) + lỗi IMAGE_CROP_FAILED cho từng hình
 * fail — action dùng để persist bản nháp kèm hình nào được thì gắn hình đó
 * (re-run idempotent nhờ upsert). `multiPart` chỉ ảnh hưởng NHÃN lỗi.
 */
export async function cropImagesLenient(
  questionFile: FileRef,
  questions: ExtractedQuestion[],
  examId: string,
  supabase: SupabaseClient,
  log?: PipelineLogger,
  multiPart = false
): Promise<{ images: Map<string, string>; errors: UgcError[] }> {
  const images = new Map<string, string>();
  const errors: UgcError[] = [];

  for (const q of questions) {
    if (!q.imageBox) continue;
    const label = multiPart ? `phần ${q.part} câu ${q.number}` : `câu ${q.number}`;
    try {
      const png = await cropOne(questionFile, q.imageBox);
      const path = `${examId}/p${q.part}q${q.number}.png`;
      const up = await supabase.storage.from(BUCKET).upload(path, png, {
        contentType: "image/png",
        upsert: true,
      });
      if (up.error) throw up.error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      images.set(qKey(q.part, q.number), data.publicUrl);
      log?.info(`hình ${label}: cắt & lưu OK (${(png.length / 1024).toFixed(0)}KB)`);
    } catch (err) {
      errors.push(
        makeUgcError("IMAGE_CROP_FAILED", q.number, {
          partNumber: multiPart ? q.part : undefined,
        })
      );
      log?.info(`hình ${label}: LỖI — ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { images, errors };
}

/**
 * Hợp đồng gốc (Design Doc §Contracts): ok=true → Map khoá `part:number` → URL;
 * bất kỳ hình nào fail → ok=false với IMAGE_CROP_FAILED cho từng hình lỗi.
 */
export async function cropImages(
  questionFile: FileRef,
  questions: ExtractedQuestion[],
  examId: string,
  supabase: SupabaseClient
): Promise<Result<Map<string, string>>> {
  const { images, errors } = await cropImagesLenient(questionFile, questions, examId, supabase);
  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: images };
}
