// UGC Exam Upload v2.0 — helper PDF (server-only theo thực tế: mupdf WASM).
// Tách riêng khỏi validateInput.ts để phần validate còn lại thuần/test được.

// Render PDF ở scale 2x để hình crop/đọc đủ nét.
const PDF_RENDER_SCALE = 2;

/** Đếm số trang PDF (dùng cho check TOO_MANY_PAGES trước khi gọi AI). */
export async function getPdfPageCount(bytes: Uint8Array): Promise<number> {
  const mupdf = await import("mupdf");
  const doc = mupdf.Document.openDocument(Buffer.from(bytes), "application/pdf");
  return doc.countPages();
}

/** Render một trang PDF (1-based) thành PNG bytes bằng mupdf (WASM).
 * Dùng bởi cropImages (crop bbox từ trang render) và extractMeta (v2.2 —
 * chỉ gửi TRANG 1 cho model đọc header, không gửi cả tài liệu). */
export async function renderPdfPage(pdfBytes: Uint8Array, page1Based: number): Promise<Uint8Array> {
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
