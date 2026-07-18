// UGC Exam Upload v2.0 — Gemini client (SERVER-ONLY, ADR-0004 addendum: swap
// Anthropic → Gemini free tier, engineer decision 2026-07-17).
//
// Module này (và mọi module import nó) KHÔNG BAO GIỜ được import từ client
// component: "server-only" làm build fail ngay nếu vi phạm; check bổ sung ở
// scripts/check-ai-key-bundle.mjs khẳng định key không nằm trong client bundle
// (PRD metric 6).

import "server-only";
import { GoogleGenAI } from "@google/genai";

// LƯU Ý (2026-07-17): "gemini-2.5-flash"/"gemini-2.5-flash-lite" (chọn ban đầu
// theo rate-limit công bố) hoá ra KHÔNG gọi được với key thật — 2.5-flash trả
// 404 "no longer available to new users", dòng 2.0-flash trả 429 quota (tài
// khoản mới không có quota free cho 2 dòng model cũ này). Xác nhận bằng
// client.models.list() + gọi thử trực tiếp: chỉ dòng 3.x hoạt động.
/** Model đọc file đề (multimodal, ảnh + PDF). */
export const QUESTION_MODEL = "gemini-3.5-flash";
/** Model đọc file đáp án (rẻ hơn). */
export const ANSWER_MODEL = "gemini-3.1-flash-lite";

let client: GoogleGenAI | null = null;

/** Singleton — key đọc từ server env, không bao giờ gửi xuống client. */
export function getGeminiClient(): GoogleGenAI {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      // Fail loudly (log server) — caller map thành EXTRACTION_FAILED cho user.
      throw new Error("GEMINI_API_KEY chưa được cấu hình trong server env");
    }
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}
