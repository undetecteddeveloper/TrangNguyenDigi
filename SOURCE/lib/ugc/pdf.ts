// UGC Exam Upload v2.0 — helper PDF (server-only theo thực tế: mupdf WASM).
// Tách riêng khỏi validateInput.ts để phần validate còn lại thuần/test được.

/** Đếm số trang PDF (dùng cho check TOO_MANY_PAGES trước khi gọi AI). */
export async function getPdfPageCount(bytes: Uint8Array): Promise<number> {
  const mupdf = await import("mupdf");
  const doc = mupdf.Document.openDocument(Buffer.from(bytes), "application/pdf");
  return doc.countPages();
}
