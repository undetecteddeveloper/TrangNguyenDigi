# [GĐ 0: Nền Móng] — Scaffold Project

- **Latest prompt:** "Bắt đầu thiết lập dự án."
- **Latest step:** Git ✅ Done
- **Layer status:** GĐ 0 Done

---

## M0.1 — Khởi tạo project
- **State:** Done
  + Next.js 16.2.7 + TypeScript + Tailwind CSS 4 + App Router — Done
  + shadcn/ui initialized (Button, Input) — Done
  + Prettier + prettier-plugin-tailwindcss — Done
  + ESLint (via Next.js), TypeScript strict mode — Done

## M0.2 — Hello Production
- **State:** Done
  + Trang `/` hiển thị "TrangNguyenDigi" — Done
  + git init + remote origin + branch main — Done
  + Push lên https://github.com/undetecteddeveloper/TrangNguyenDigi.git — Done
  + (Kết nối Vercel: engineer thực hiện thủ công trên vercel.com)

## M0.3 — Khung route groups
- **State:** Done
  + Route groups: `(layer1)` `(layer2)` `(layer3)` `(layer4)` — Done
  + `proxy.ts` skeleton (Next.js 16 convention, thay thế `middleware.ts`) — Done
  + Thư mục `SOURCE/types/` `SOURCE/hooks/` `SOURCE/components/shared/` — Done
  + `npm run build` pass không lỗi — Done

---

## Lưu ý kỹ thuật phát sinh

| Vấn đề | Giải quyết |
|---|---|
| `create-next-app` không nhận tên thư mục có chữ hoa (SOURCE) | Tạo trong thư mục tạm rồi di chuyển vào SOURCE/ |
| Route groups `(layerN)/page.tsx` conflict vì cùng resolve về `/` | Xóa placeholder page.tsx trong các route groups — root `/` chỉ do `app/page.tsx` đảm nhiệm |
| `middleware.ts` deprecated trong Next.js 16 | Đổi thành `proxy.ts` theo convention mới |
| Tailwind CSS 4 không dùng `tailwind.config.ts` | Config qua `globals.css` với `@import "tailwindcss"` |

---

## Tiến độ tổng thể

```
GĐ 0 — Nền Móng              : [x] Done
GĐ 1 — Functional Prototype  : [x] Done (M1.1–M1.7) — đạt đủ tiêu chí thoát
GĐ 2 — Connected Prototype   : [ ] Not Started
GĐ 3 — Polish (MVP ship)     : [ ] Not Started
─────────────────────────────
Post-MVP A — Layer 3         : [ ] Not Started
Post-MVP B — Layer 4         : [ ] Not Started
```

---
---

# [Layer 2: Core Loop] — Task: GĐ 1 Functional Prototype (M1.1–M1.7)

- **Latest prompt:** "Bắt đầu với các milestone còn lại của GĐ1" (M1.5–M1.7), tiếp nối M1.1–M1.4.
- **Latest step:** Git
- **Layer status:** Layer 2 Dở dang (GĐ 1 logic + structure Done; chưa style/DB/auth)

### Quyết định C&D (engineer chốt)
- Q1=B: `/exams` → `/exams/[id]` (Detail) → "Bắt đầu" → Player.
- Q2=A: Player ở route blueprint `/exams/[id]/attempt/[attemptId]`, `attemptId` sinh client-side bằng `crypto.randomUUID()` (GĐ 2 thay bằng UUID từ DB).
- Q3=A: một câu/trang, điều hướng next/prev + pagination.
- Q4=B: `choices: { id: 'A'|'B'|'C'|'D', text }[]` + `correctAnswer: ChoiceId`.

---

## Logic Module: Data Model + Fake Data
- **State:** Done
  + M1.1 `types/question.ts` (Question, Choice, ChoiceId) — Done
  + M1.1 `types/exam.ts` (Exam) — Done
  + M1.1 `types/attempt.ts` (Attempt) — Done
  + M1.2 `lib/fake-data/exams.ts` — 2 đề (Toán 10, Vật Lý 10), mỗi đề 5 câu, đáp án verify tay — Done
  + M1.2 `getFakeExams()`, `getFakeExam(id)`, `getFakeQuestions(examId)` — Done

## UI Module: Exam Browser + Exam Player (structure, chưa style)
- **State:** Done (cho scope M1.3–M1.4)
  + M1.3 `_components/ExamBrowser.tsx` + `ExamCard.tsx` — list đề, Link sang Detail — Done
  + M1.3 `exams/page.tsx` (Browser), `exams/[id]/page.tsx` (Detail) + `StartAttemptButton.tsx` — Done
  + M1.4 `_components/QuestionRenderer.tsx` + `AnswerChoice.tsx` — hiện câu + 4 radio — Done
  + M1.4 `_components/QuestionPagination.tsx` — prev/next + jump số câu — Done
  + M1.4 `exams/[id]/attempt/[attemptId]/page.tsx` (Player) — Done

---

---

## Logic Module: Scoring (M1.6 — ⭐ tracer code)
- **State:** Done
  + M1.6 `types/result.ts` (ScoreResult, PerQuestionResult, TopicResult) — Done
  + M1.6 `lib/scoring/computeScore.ts` — hàm THUẦN `(questions, answers) → ScoreResult`, thang 10, topicBreakdown — Done
  + M1.6 Verify tay 8/8 case (đúng hết→10, sai hết→0, partial 3/5→6, bỏ trống, breakdown) qua `npx tsx` one-shot — Done

## Logic Module: Exam Player State (M1.5)
- **State:** Done
  + M1.5 `hooks/useExamPlayer.ts` — useReducer (current + answers), actions SELECT_ANSWER/GOTO/NEXT/PREV — Done
  + M1.5 Player refactor dùng hook (thay useState placeholder) — Done

## UI Module: Result + Submit (M1.7)
- **State:** Done
  + M1.7 `_components/ScoreCard.tsx` (điểm tổng) + `TopicBreakdown.tsx` (theo chủ đề) — Done
  + M1.7 `exams/[id]/attempt/[attemptId]/result/page.tsx` (ResultView) — chi tiết từng câu + "Làm lại" — Done
  + M1.7 Nút "Nộp bài" thật: sessionStorage bridge (Q=A) → điều hướng Result — Done

---

## Ghi chú scope & nợ kỹ thuật (cho GĐ 2)
- Bridge Player→Result qua `sessionStorage` key `attempt:<attemptId>`. **GĐ 2 (M2.6)** thay bằng `submitExam()` Server Action + `getResult(attemptId)` từ DB — route không đổi.
- `attemptId` sinh client-side (`crypto.randomUUID`). **GĐ 2** thay bằng UUID do `startAttempt()` tạo.
- `getFakeExams/getFakeExam/getFakeQuestions` → **GĐ 2 (M2.5)** thay bằng query Supabase.
- `computeScore` giữ nguyên, **GĐ 2** chạy server-side trong `submitExam()`.
- Tất cả `_components` theo `UI-LAYER-MAP.md` Mục 4.5 — GĐ 3 (M3.1) chỉ thêm style.

## Kết quả Testing
- `tsc --noEmit`: pass (exit 0).
- `next build`: pass — 6 routes gồm `/exams/[id]/attempt/[attemptId]/result`.
- `computeScore` verify tay: **8/8 pass** (Pha 0, không cài framework — script tạm đã xóa).
- Visual testing: bỏ qua (Pha 0 thủ công; render server-side xác nhận qua build).

## ✅ Tiêu chí thoát GĐ 1 (PROJECT_ROADMAP Mục 5)
- [x] Chọn được 1 trong 2 đề mẫu.
- [x] Trả lời hết câu, nộp bài.
- [x] Điểm hiển thị chính xác (verify tay 8/8).
- [x] Toàn bộ in-memory, không cần internet.
- [x] **Kiểm thử thủ công trên browser (2026-06-05):** Engineer xác nhận toàn bộ luồng chạy đúng — chọn đề, làm bài, pagination, nộp bài, kết quả, "Làm lại". GĐ 1 CONFIRMED ✅

> **Layer 2 status:** Dở dang (logic + structure xong; chưa style/DB/auth — đúng tinh thần prototype-first).
> **Bước tiếp theo:** GĐ 2 — Connected Prototype (Supabase + auth thật, xem PROJECT_ROADMAP Mục 6).

---
---

# [Layer 1 + Layer 2] — Task: GĐ 2 Connected Prototype (M2.1–M2.4)

- **Latest prompt:** "Continue the project where we paused" → GĐ 2; engineer chốt Q1=A (schema đơn giản, không confidence/quarantine), Q2=A (batch on submit); phạm vi đợt này M2.1→M2.4, các milestone còn lại yêu cầu sau.
- **Latest step:** Git
- **Layer status:** Layer 1 Dở dang (auth), Layer 2 Dở dang

### Quyết định C&D (engineer chốt)
- Q1=A: Schema `questions`/`exams` chỉ các cột cần thiết (không `confidence_score`/`quarantine`/view `published_questions`) — mở rộng L4 ở Post-MVP.
- Q2=A: Persist batch-on-submit — giữ `useReducer` client-side, `submitExam()` insert toàn bộ `attempt_answers` + tính điểm một lần (sẽ làm ở M2.6).
- Phạm vi đợt này: M2.1–M2.4. Event system (L3/L4) bỏ qua ở GĐ 2.

---

## Logic Module: Supabase Clients (M2.1)
- **State:** Done
  + M2.1 Cài `@supabase/supabase-js` + `@supabase/ssr` — Done
  + M2.1 `.env.local` (URL + anon + service_role) — Done
  + M2.1 `lib/supabase/client.ts` (browser, `createBrowserClient`) — Done
  + M2.1 `lib/supabase/server.ts` (server, đọc cookie qua `createServerClient`) — Done
  + M2.1 `lib/supabase/middleware.ts` (`updateSession`: refresh token + chặn route) — Done

## Logic Module: Database Schema + RLS (M2.2)
- **State:** Done (code) — ⚠️ chờ engineer apply lên DB
  + M2.2 `supabase/schema.sql` — 6 bảng + RLS + trigger `handle_new_user` (auto tạo user_profiles). Idempotent. — Done
  + M2.2 **Engineer chạy `supabase/schema.sql` trong Supabase SQL Editor** — Done

## Logic Module: Seed Data (M2.3)
- **State:** Done (code) — ⚠️ chờ chạy sau khi M2.2 apply
  + M2.3 `supabase/seed.ts` — đẩy 2 đề + 10 câu từ fake-data vào DB (service_role, upsert, tự nạp `.env.local`) — Done
  + M2.3 Chạy `npx tsx supabase/seed.ts` — Done (10 câu hỏi + 2 đề ✅)
  + M2.3 Verify data trong Supabase dashboard — Done (seed log xác nhận)

## Logic Module + UI Module: Auth thật (M2.4 — Logic Layer 1)
- **State:** Done
  + M2.4 `app/(layer1)/actions.ts` — signUp/signIn/signOut Server Actions (`useActionState` pattern) — Done
  + M2.4 user_profiles row tạo tự động qua DB trigger (thay vì trong action — tránh lỗi timing email-confirm) — Done
  + M2.4 `lib/auth/getCurrentUser.ts` — helper Server Component — Done
  + M2.4 `app/(layer1)/_components/AuthForm.tsx` + `app/(layer1)/login/page.tsx` — form tối giản (chưa style) — Done
  + M2.4 `proxy.ts` — gọi `updateSession`, chặn route chưa auth (public: `/`, `/login`) → redirect `/login` — Done

---

## Files đã tạo/sửa (Updating)
- Tạo: `lib/supabase/{client,server,middleware}.ts`, `lib/auth/getCurrentUser.ts`
- Tạo: `supabase/schema.sql`, `supabase/seed.ts`
- Tạo: `app/(layer1)/actions.ts`, `app/(layer1)/_components/AuthForm.tsx`, `app/(layer1)/login/page.tsx`
- Sửa: `proxy.ts` (pass-through → `updateSession` + route guard)
- Sửa: `package.json` / `package-lock.json` (thêm `@supabase/ssr`, `@supabase/supabase-js`)
- `.env.local`: 3 biến Supabase (gitignored — không commit)

## Kết quả Testing
- `tsc --noEmit`: pass (exit 0).
- `next build`: pass — 7 routes, thêm `/login`; `Proxy (Middleware)` được nhận diện.
- Seed live-DB: **pass** — 10 câu hỏi + 2 đề đã vào DB (2026-06-06).
- Visual testing: bỏ qua so sánh — engineer chưa cung cấp reference image (đúng quy định WORKFLOW Bước 4).

> Lưu ý quy trình: Đọc sơ qua các md file có trong dự án để có đủ context.

---
---

# [Layer 2: Core Loop] — Task: GĐ 2 Connected Prototype (M2.5–M2.7)

- **Latest prompt:** "bắt đầu với các milestone còn lại của giai đoạn 2" (M2.5–M2.7). Engineer chốt Q1=A, Q2=A.
- **Latest step:** Git
- **Layer status:** Layer 2 Dở dang (wiring DB xong; chưa style)

### Quyết định C&D (engineer chốt)
- Q1=A: Giữ `lib/fake-data/` CHỈ làm nguồn cho `seed.ts`; gỡ mọi import trong app (app đọc 100% từ DB).
- Q2=A: `getResult` gặp attempt chưa nộp / không tồn tại → `redirect('/exams/[id]')`.
- Bảo mật: tạo `PublicQuestion = Omit<Question,'correctAnswer'>` cho client player; `correctAnswer` chỉ ở server; `computeScore` chạy server-side trong `submitExam`.
- Bỏ `submitAnswer` per-câu (đúng Q2=A batch on submit). Không cài tool mới; visual testing bỏ qua ở GĐ2.

---

## Logic Module: L2 Reads — thay fake-data (M2.5)
- **State:** Done
  + M2.5 `types/question.ts` — thêm `PublicQuestion = Omit<Question,'correctAnswer'>` — Done
  + M2.5 `app/(layer2)/queries.ts` (server-only) — `listExams()`, `getExam(id)`, `getExamForPlayer(id)` (PublicQuestion, không select correct_answer), `getResult(attemptId)` — Done
  + M2.5 Sửa `exams/page.tsx` + `exams/[id]/page.tsx` → async dùng query — Done
  + M2.5 Gỡ import fake-data khỏi app (chỉ `seed.ts` còn dùng) — Done

## Logic Module: L2 Writes — Server Actions (M2.6)
- **State:** Done
  + M2.6 `app/(layer2)/actions.ts` — `startAttempt(examId)` (insert + redirect), `submitExam(attemptId, answers)` (batch upsert answers + computeScore server-side + insert results + khóa attempt + redirect; idempotent) — Done
  + M2.6 `StartAttemptButton` → `<form action={startAttempt}>` (bỏ `crypto.randomUUID`) — Done
  + M2.6 Tách player: `attempt/[attemptId]/page.tsx` (server fetch PublicQuestion) + `_components/ExamPlayer.tsx` (client, giữ `useExamPlayer`, submit qua `useTransition`) — Done
  + M2.6 Result `page.tsx` → server component đọc `getResult` (bỏ sessionStorage + computeScore client); "Làm lại" = `<Link>` — Done
  + M2.6 `QuestionRenderer` prop → `PublicQuestion` — Done

## Logic Module: Test RLS (M2.7)
- **State:** Done
  + M2.7 `supabase/test-rls.ts` — 2 user (tạo qua Admin API, email_confirm=true), test bằng anon key + login thật — Done
  + M2.7 Chạy `npx tsx supabase/test-rls.ts` — **6/6 PASS** — Done

---

## Files đã tạo/sửa (Updating M2.5–M2.7)
- Tạo: `app/(layer2)/queries.ts`, `app/(layer2)/actions.ts`, `app/(layer2)/_components/ExamPlayer.tsx`, `supabase/test-rls.ts`
- Sửa: `types/question.ts` (+PublicQuestion), `QuestionRenderer.tsx` (prop PublicQuestion), `StartAttemptButton.tsx` (form action), `exams/page.tsx`, `exams/[id]/page.tsx`, `attempt/[attemptId]/page.tsx` (server), `attempt/[attemptId]/result/page.tsx` (server)
- Giữ nguyên: `lib/fake-data/exams.ts` (chỉ làm nguồn seed), `computeScore.ts` (tracer code, giờ chạy server-side), `useExamPlayer.ts`

## Kết quả Testing (M2.5–M2.7)
- `tsc --noEmit`: pass.
- `next build`: pass — `/exams*` chuyển sang dynamic (ƒ) vì đọc DB qua cookie.
- RLS test: **6/6 PASS** (A đọc của mình ✓, B bị chặn đọc/update attempt của A ✓, anon bị chặn questions/attempts ✓, auth đọc được questions ✓).
- Visual testing: bỏ qua (chưa có reference image, UI cố tình chưa style — đúng WORKFLOW Bước 4).

> Lưu ý quy trình: Đọc sơ qua các md file có trong dự án để có đủ context.

## ✅ Tiêu chí thoát GĐ 2 (PROJECT_ROADMAP Mục 6)
- [x] Test user đăng ký/đăng nhập được (auth M2.4 + RLS test tạo/login user).
- [x] Làm đề lấy từ DB thật (listExams/getExam/getExamForPlayer).
- [x] Attempt + điểm persist trong Supabase (startAttempt/submitExam → exam_attempts/attempt_answers/exam_results).
- [x] RLS chặn đúng giữa 2 user (6/6 pass).
- [ ] **Chờ engineer kiểm thử thủ công end-to-end trên browser** (đăng ký → làm đề → nộp → kết quả reload vẫn còn) để CONFIRM GĐ 2.

---

*Issue (nếu có):* (đã xử lý trong lúc test) signUp dính "Email invalid" với domain example.com/không-MX, rồi "email rate limit exceeded".
*Fixing process:* Chuyển M2.7 sang tạo user bằng Admin API (`email_confirm=true`, không gửi mail) + login bằng anon key để test RLS. Pass 6/6.
