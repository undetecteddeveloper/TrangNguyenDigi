// UGC v2.1 — mã hoá/giải mã input Đ/S từng ý của câu true_false (Task D2/D3).
// Thuần, client-safe. Người làm bài chọn Đ/S cho từng ý a–d; toàn bộ lưu thành
// MỘT chuỗi trong attempt_answers.answer (không đổi shape bảng): "a:Đ,b:S,c:Đ".
// Chỉ chứa các ý ĐÃ trả lời — ý bỏ trống không xuất hiện.

import type { SubItemId } from "./types";

const SUB_ITEM_IDS: readonly SubItemId[] = ["a", "b", "c", "d"];

export type TfSelection = Partial<Record<SubItemId, boolean>>;

/** {a:true,b:false} → "a:Đ,b:S" (thứ tự a–d ổn định). */
export function encodeTfAnswer(sel: TfSelection): string {
  return SUB_ITEM_IDS.filter((id) => typeof sel[id] === "boolean")
    .map((id) => `${id}:${sel[id] ? "Đ" : "S"}`)
    .join(",");
}

/** "a:Đ,b:S" → {a:true,b:false}; chuỗi lạ/không phải TF → {} (bỏ qua an toàn). */
export function decodeTfAnswer(raw: string | null | undefined): TfSelection {
  const out: TfSelection = {};
  if (!raw) return out;
  for (const piece of raw.split(",")) {
    const [id, v] = piece.split(":");
    if ((SUB_ITEM_IDS as readonly string[]).includes(id) && (v === "Đ" || v === "S")) {
      out[id as SubItemId] = v === "Đ";
    }
  }
  return out;
}

/** Đáp án lưu trữ {a:true,...} → chuỗi hiển thị "a) Đ · b) S · …". */
export function formatSubAnswers(sub: TfSelection | null | undefined): string {
  if (!sub) return "";
  return SUB_ITEM_IDS.filter((id) => typeof sub[id] === "boolean")
    .map((id) => `${id}) ${sub[id] ? "Đ" : "S"}`)
    .join(" · ");
}
