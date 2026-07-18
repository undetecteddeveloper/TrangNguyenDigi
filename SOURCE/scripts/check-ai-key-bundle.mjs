// UGC v2.0 — build-time check (PRD metric 6): AI key KHÔNG nằm trong client bundle.
//
// Chạy SAU `next build`:  node scripts/check-ai-key-bundle.mjs
// (script npm: `npm run check:bundle` — build trước rồi check).
//
// Cơ chế: quét .next-build/static (mọi thứ ship xuống browser) tìm
//   1) giá trị GEMINI_API_KEY thật (đọc từ env/.env.local nếu có),
//   2) các marker chỉ xuất hiện khi module server-only bị bundle nhầm:
//      "GEMINI_API_KEY", "@google/genai", "generativelanguage.googleapis.com".
// Lớp chặn thứ nhất là import "server-only" trong lib/ugc/gemini.ts (build
// fail ngay khi client import); script này là lưới an toàn thứ hai.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
// `.next-build` — production distDir tách riêng khỏi dev (next.config.ts S#36).
const STATIC_DIR = join(ROOT, ".next-build", "static");

function loadEnvLocal() {
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return {};
  const env = {};
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return env;
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

if (!existsSync(STATIC_DIR)) {
  console.error(`❌ Không thấy ${STATIC_DIR} — chạy \`next build\` trước.`);
  process.exit(1);
}

const envLocal = loadEnvLocal();
const keyValue = process.env.GEMINI_API_KEY ?? envLocal.GEMINI_API_KEY;
const markers = ["GEMINI_API_KEY", "@google/genai", "generativelanguage.googleapis.com"];

let failures = 0;
for (const file of walk(STATIC_DIR)) {
  const content = readFileSync(file, "utf8");
  if (keyValue && content.includes(keyValue)) {
    console.error(`❌ GIÁ TRỊ AI key xuất hiện trong client bundle: ${file}`);
    failures += 1;
  }
  for (const marker of markers) {
    if (content.includes(marker)) {
      console.error(`❌ Marker server-only "${marker}" trong client bundle: ${file}`);
      failures += 1;
    }
  }
}

if (failures > 0) {
  console.error(`\n❌ AI-key bundle check FAIL (${failures} phát hiện).`);
  process.exit(1);
}
console.log("✅ AI-key bundle check PASS — key/SDK không nằm trong client bundle.");
