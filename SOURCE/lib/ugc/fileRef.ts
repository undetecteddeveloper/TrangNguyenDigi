// UGC Exam Upload v2.0 — FileRef: file đã validate (type/size/pages) truyền vào
// extractor. Thuần dữ liệu, dùng được cả trong unit test (không phụ thuộc SDK).

import type { AllowedMime } from "./limits";

export type FileRef = {
  bytes: Uint8Array;
  mediaType: AllowedMime;
};

type InlineDataPart = {
  inlineData: { data: string; mimeType: AllowedMime };
};

/** FileRef → Part cho Gemini generateContent (PDF và ảnh đều là inlineData). */
export function toGeminiPart(file: FileRef): InlineDataPart {
  const data = Buffer.from(file.bytes).toString("base64");
  return { inlineData: { data, mimeType: file.mediaType } };
}
