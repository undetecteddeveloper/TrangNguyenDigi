// Seed script (GĐ 2 M2.3) — đẩy 2 đề mẫu từ fake-data vào Supabase.
// Dùng service_role key (bypass RLS). CHỈ chạy local, không bao giờ ship key này lên client.
//
// Cách chạy (sau khi đã apply schema.sql trong Supabase SQL Editor):
//   cd SOURCE
//   npx tsx supabase/seed.ts
//
// Tiền đề: M2.2 schema đã được tạo. Script idempotent (upsert) — chạy lại an toàn.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { getFakeExams, getFakeQuestions } from "../lib/fake-data/exams";
import type { Question } from "../types/question";

// --- Nạp env từ .env.local (tsx không tự load như Next.js) ----------------
function loadEnv(): Record<string, string> {
  const raw = readFileSync(resolve(__dirname, "../.env.local"), "utf8");
  const env: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local",
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const exams = getFakeExams();

  // Gom toàn bộ câu hỏi (dedupe theo id) từ các đề.
  const questionMap = new Map<string, Question>();
  for (const exam of exams) {
    for (const q of getFakeQuestions(exam.id)) questionMap.set(q.id, q);
  }

  const questionRows = [...questionMap.values()].map((q) => ({
    id: q.id,
    content: q.content,
    choices: q.choices,
    correct_answer: q.correctAnswer,
    subject: q.subject,
    grade: q.grade,
    topic: q.topic,
  }));

  // S#27: created_at set lệch ngày theo thứ tự đề (đề sau = mới hơn) để sort
  // Newest/Oldest phân biệt được — 3 đề seed cùng lúc sẽ có timestamp trùng nhau.
  const SEED_BASE = Date.parse("2026-07-01T00:00:00Z");
  const examRows = exams.map((e, i) => ({
    id: e.id,
    title: e.title,
    question_ids: e.questionIds,
    duration_minutes: e.durationMinutes,
    subject: e.subject,
    grade: e.grade,
    school: e.school ?? null,
    school_year: e.schoolYear ?? null,
    semester: e.semester ?? null,
    created_at: new Date(SEED_BASE + i * 86_400_000).toISOString(),
  }));

  // questions trước (exams tham chiếu chúng qua question_ids).
  const q = await supabase.from("questions").upsert(questionRows);
  if (q.error) throw q.error;
  console.log(`✓ Seed ${questionRows.length} câu hỏi.`);

  const e = await supabase.from("exams").upsert(examRows);
  if (e.error) throw e.error;
  console.log(`✓ Seed ${examRows.length} đề.`);

  console.log("✅ Seed hoàn tất.");
}

main().catch((err) => {
  console.error("❌ Seed thất bại:", err.message ?? err);
  process.exit(1);
});
