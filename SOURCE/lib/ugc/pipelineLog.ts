// UGC Exam Upload v2.0 — logger quan sát pipeline xử lý đề (server-side).
//
// In ra terminal server (dev) từng công đoạn của extractAndAssemble: đang làm
// gì, tiến độ, trạng thái, thời gian. Mỗi lần upload = 1 "run" có runId ngắn để
// gom dòng log lại với nhau khi nhiều người upload cùng lúc.
//
// KHÔNG log token/raw AI payload (nguyên tắc bảo mật §12) — chỉ log số lượng,
// mã lỗi, thời gian. Tự tắt ở production trừ khi bật UGC_PIPELINE_LOG=1.

const ENABLED =
  process.env.NODE_ENV !== "production" || process.env.UGC_PIPELINE_LOG === "1";

const PREFIX = "[ugc-pipeline]";

/** ms từ mốc t0 → chuỗi "1.23s" / "456ms". */
function fmtMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;
}

export interface PipelineLogger {
  /** Bắt đầu một công đoạn (giai đoạn N/8). */
  stage(n: number, name: string, detail?: string): void;
  /** Công đoạn xong tốt đẹp. */
  ok(n: number, name: string, detail?: string, sinceStageMs?: number): void;
  /** Công đoạn thất bại (kèm mã lỗi/nguyên nhân). */
  fail(n: number, name: string, reason: string, sinceStageMs?: number): void;
  /** Ghi chú lẻ trong một công đoạn (vd. từng hình crop). */
  info(msg: string): void;
  /** Kết thúc toàn bộ run (thành công hay không). */
  done(msg: string): void;
  /** Mốc thời gian hiện tại (ms, để đo 1 công đoạn). */
  now(): number;
}

/** No-op khi tắt log (production) — tránh nhánh if rải rác nơi gọi. */
const NOOP: PipelineLogger = {
  stage() {},
  ok() {},
  fail() {},
  info() {},
  done() {},
  now: () => 0,
};

/** Tạo logger cho một lần chạy pipeline. runId tự sinh nếu không truyền. */
export function createPipelineLogger(runId?: string): PipelineLogger {
  if (!ENABLED) return NOOP;

  const id = runId ?? Math.random().toString(36).slice(2, 6);
  const tag = `${PREFIX} ${id}`;
  const t0 = performance.now();
  const sinceStart = () => fmtMs(performance.now() - t0);

  return {
    now: () => performance.now(),
    stage(n, name, detail) {
      console.log(`${tag} [${n}/8] ${name}${detail ? ` — ${detail}` : ""} …`);
    },
    ok(n, name, detail, sinceStageMs) {
      const t = sinceStageMs != null ? `  (${fmtMs(performance.now() - sinceStageMs)})` : "";
      console.log(`${tag} [${n}/8] ${name} ✓ OK${detail ? `  ${detail}` : ""}${t}`);
    },
    fail(n, name, reason, sinceStageMs) {
      const t = sinceStageMs != null ? `  (${fmtMs(performance.now() - sinceStageMs)})` : "";
      console.error(`${tag} [${n}/8] ${name} ✗ FAIL  ${reason}${t}`);
    },
    info(msg) {
      console.log(`${tag}     ${msg}`);
    },
    done(msg) {
      console.log(`${tag} ■ DONE  ${msg}  (tổng ${sinceStart()})`);
    },
  };
}
