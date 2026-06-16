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
GĐ 1 — Functional Prototype  : [x] Done (M1.1–M1.7) — confirmed browser 2026-06-05
GĐ 2 — Connected Prototype   : [x] Done (M2.1–M2.7) — confirmed browser 2026-06-06
GĐ 3 — Polish (MVP ship)     : [ ] In Progress
  M3.1 Visual language L2    : [x] Done (Tasks 1–5, commits 57c403a→35c1811, 2026-06-08→2026-06-13)
  M3.2 Responsive L2         : [x] Done (commit 36e40a4, 2026-06-14)
  M3.3 Homepage 3D           : [x] Done (commit e094bc5, 2026-06-14)
  M3.4 Homepage Mobile       : [ ] Not Started
  M3.5 Personalization       : [ ] Not Started
  M3.6 Transitions & SEO     : [ ] Not Started
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
- [x] **Kiểm thử thủ công end-to-end trên browser (2026-06-06):** Engineer xác nhận toàn bộ luồng chạy đúng — đăng nhập, duyệt đề từ DB, bắt đầu làm, nộp bài, kết quả persist (reload vẫn còn), "Làm lại". **GĐ 2 CONFIRMED ✅**

> **Thiếu sót nhỏ ghi nhận (xử lý ở GĐ 3):** Trang `/exams/[id]` (Detail) và Player không có nút quay lại trang trước hoặc về homepage. Điều hướng ngược chiều chưa được thiết kế ở GĐ 1–2 (chưa style, chưa có nav). Sẽ bổ sung khi làm navigation/header ở GĐ 3 — Polish.

> **Bước tiếp theo:** GĐ 3 — Polish (visual language, 3D homepage, responsive, navigation). Yêu cầu C&D riêng trước khi code.

---

*Issue (nếu có):* (đã xử lý trong lúc test) signUp dính "Email invalid" với domain example.com/không-MX, rồi "email rate limit exceeded".
*Fixing process:* Chuyển M2.7 sang tạo user bằng Admin API (`email_confirm=true`, không gửi mail) + login bằng anon key để test RLS. Pass 6/6.

---
---

# [Layer 2: Core Loop] — Task: GĐ 3 Polish — M3.1 Task 1 (Visual language Exam Browser)

- **Latest prompt:** "Thực hiện M3.1, task 1 đầu tiên" — chỉ milestone M3.1, bắt đầu từ Task 1. "Using all front-end skill".
- **Latest step:** Testing (build + tsc + visual browser) ✅ — chờ engineer xác nhận để Git.
- **Layer status:** Layer 2 — bắt đầu style (visual language Focused).

### Quyết định C&D (engineer chốt qua bảng Q + assets)
- Q2/Q3/Q4: Engineer **cung cấp assets riêng** trong `ASSETS/` + `TEMPLATE/`. Font dự án = **Merriweather** (variable TTF, `ASSETS/fonts/`) thay cho Inter. Models thật (AIO_PC/BOOK/PENCIL `.glb`) cho M3.3.
- Template tham chiếu: `TEMPLATE/L2/L2_mobile.png` (sidebar filter + blocks), `TEMPLATE/homepage/homepage_desktop.png` (editorial dark, mono wordmark).
- Scope đợt này: **chỉ M3.1 Task 1** — style ExamBrowser + ExamCard + ExamFilters.

### Quyết định kỹ thuật
- Font sống ở `ASSETS/` (UI-LAYER-MAP Mục 11) → **không copy vào public**; `next/font/local` trỏ `../../ASSETS/fonts/...`. Mở `turbopack.root` lên thư mục cha để next-font đọc được file ngoài SOURCE.
- Subset Geist: `latin` + `latin-ext` (Geist không có subset `vietnamese`; latin-ext phủ dấu tiếng Việt). Merriweather variable TTF phủ đầy đủ tiếng Việt.
- Visual language L2 "tờ giấy trắng / focused": nền giấy ấm nhẹ, mực mềm, 1 accent chàm tiết chế (`--brand`), hairline border, nhãn mono small-caps (`.eyebrow`), tiêu đề serif.
- Filter state ở **URL searchParams** (UI-LAYER-MAP Mục 9) → Server Component re-query DB. Chỉ lọc theo data hiện có: **Môn học + Lớp** (không dựng filter giả Trường/Năm/Mức độ chưa có trong data model).

## UI Module: Exam Browser (style) — M3.1 Task 1
- **State:** Done (chờ engineer confirm visual)
  + `app/layout.tsx` — thêm `localFont` Merriweather (`--font-merriweather`), `lang="vi"`, subset latin-ext.
  + `app/globals.css` — token `--font-serif`/`--font-heading` = Merriweather, fix `--font-sans` = Geist; `--brand` accent; palette giấy ấm/mực mềm; base typography (h1–h3 serif, `.eyebrow`).
  + `next.config.ts` — `turbopack.root` = thư mục cha (đọc font ASSETS).
  + `_components/ExamFilters.tsx` (MỚI) — client, 2 select Môn học/Lớp + "Xoá lọc", push URL qua `useTransition`.
  + `_components/ExamCard.tsx` — thẻ giấy hairline, eyebrow môn/lớp, tiêu đề serif hover→brand, meta số câu/phút.
  + `_components/ExamBrowser.tsx` — grid `sm:grid-cols-2` + empty state.
  + `exams/page.tsx` — shell 2 cột (header + aside filters sticky + grid), đọc `searchParams` (await, Next 16).
  + `queries.ts` — `listExams(filters?)` (`.eq` subject/grade) + `listExamFacets()` (distinct, sort vi).

## Kết quả Testing (M3.1 Task 1)
- `tsc --noEmit`: pass. `next build`: pass (7 routes; font ASSETS resolve OK).
- **Visual (browser, đăng nhập test user `+rlstesta`):** /exams render đúng — nền giấy, serif Merriweather có dấu tiếng Việt chuẩn, eyebrow mono, 2 cột, cards hairline. Filter Môn học=Toán → URL `?subject=Toán`, lưới còn 1 đề, hiện "Xoá lọc". **0 console errors.**
- **⚠️ Gotcha Turbopack dev:** chạy `next build` rồi `npm run dev` chung `.next` → 500 `loadFontManifest: Unexpected end of JSON input` (font manifest rỗng). Fix: xoá `.next` rồi `dev` lại. Build production không dính.

> **Còn lại của M3.1 (session sau):** Task 2 QuestionRenderer/AnswerChoice (focus mode), Task 3 ExamTimer/QuestionPagination/FlagButton, Task 4 ScoreCard/TopicBreakdown, Task 5 markdown + LaTeX. Component ExamTimer/FlagButton chưa tồn tại — sẽ tạo khi tới task đó.

*Issue (engineer feedback — làm lại M3.1 Task 1):* Bản đầu sai **triết lý mobile-first** (chỉ verify desktop) + **sai bố cục** so với `TEMPLATE/L2/L2_mobile.png`: thiếu header (logo + dropdown menu), thiếu **toggle ▶/▼ ẩn/hiện bảng lọc** (tam giác đen = toggle button), filter dùng native select thay vì panel collapsible. Screenshot lưu sai chỗ (repo root thay vì `TEMP_SCREENSHOT/`).
*Fixing process (Done — visual confirm browser 2026-06-07):*
- **Mobile-first**: thiết kế/verify từ 375px trước; trên mobile bảng lọc **collapse mặc định** (content full-width), nút "Bộ lọc" ▼ mở ra; lg: bảng lọc thành sidebar luôn hiện (master toggle `lg:hidden`).
- `_components/SiteHeader.tsx` (MỚI, client) — header sticky nền trắng: logo "Trạng Nguyên" (serif, → `/`) + dropdown menu (Trang chủ / Đề luyện / Đăng xuất qua `signOut` Server Action L1, backdrop bắt click ngoài).
- `_components/ExamFilters.tsx` (viết lại) — master toggle ẩn/hiện cả bảng lọc + mỗi filter là **accordion** (▼ toggle "ẩn hiện bảng chọn"), option dạng list chọn được (active = màu brand + gạch). Bỏ native select.
- `exams/page.tsx` (viết lại) — SiteHeader + body mobile-first (1 cột → `lg:grid-cols-[220px_1fr]`).
- **Nền trắng**: màu bg trong template (xanh/vàng/đỏ) chỉ tượng trưng — giữ paper trắng, hairline; KHÔNG fill màu.
- Screenshot đúng chỗ: `TEMP_SCREENSHOT/exam-browser-{mobile,mobile-filter-open,desktop,desktop-menu}.png`.
- Verify: 375px (header + filter collapse + cards 1 cột; mở filter → accordion Môn học/Lớp; chọn Toán → URL `?subject=Toán` → còn 1 đề + "Xoá lọc") và 1280px (header full-width, sidebar lọc + grid 2 cột, dropdown menu mở đúng). `tsc`/`build` pass. **0 console errors.**
- ⚠️ Font Merriweather giữ nguyên (engineer chỉ định) — tiếng Việt có dấu render chuẩn ở cả serif/sans/mono (latin-ext).

---
---

# [Layer 2: Core Loop] — Task: GĐ 3 Polish — M3.1 Task 1 (LÀM LẠI lần 2 — overlay filter)

- **Latest prompt:** "M3.1 phải làm lại vì sai yêu cầu phiên trước." Engineer gửi lại template `L2_mobile.png` + giải thích + #Yêu cầu chi tiết. Chốt: navbar + filter đều sticky (toàn bộ nội dung bên trong); filter **overlay đè lên** danh sách đề (không đẩy block sang bên); mọi toggle mở ra **bảng chọn overlay không làm xê dịch bố cục** phần tử khác; dùng **rgba trong source** làm nổi bật Filter khi mở; **không thêm bg color** ngoài rgba được cấp; nút tam giác đen thuộc về *Filter (master toggle). "Sử dụng front-end skill". "Bắt đầu code".
- **Latest step:** Testing ✅ (tsc + build + visual mobile browser) — **chờ engineer xác nhận visual để Git** (milestone này làm lại do bị từ chối visual lần trước → không auto-Git).
- **Layer status:** Layer 2 — style lại (visual language Focused, mobile-only verify).

### Quyết định C&D (engineer chốt)
- Q1 (6 filter vs 2 field DB): hiển thị đủ 6 filter ở mức **tượng trưng** (Môn học + Lớp có data thật & lọc URL; Trường/Năm/Học kỳ/Mức độ symbolic — data thêm ở milestone sau).
- Q2=B: giữ `exam.title` nguyên (không dựng "môn + học kì + năm"); block hiển thị title + nội dung tượng trưng (Trường, Mức độ).
- Sticky: áp dụng cho **toàn bộ** nội dung navbar và *Filter.
- Toggle = overlay (absolute/fixed, ngoài flow) → mở không đẩy phần tử khác (kể cả filter khác).
- *Filter mở = overlay đè exam list + **rgba** highlight (panel sheet trắng rgba + scrim rgba dim list).
- Không bg color mới (chỉ rgba được cấp + token paper/card/hairline sẵn có). Không có "front-end skill" cài đặt → áp dụng best practices thủ công.

## UI Module: Exam Browser (style lại — overlay filter) — M3.1 Task 1
- **State:** In Progress
  + `ExamFilters.tsx` — viết lại: master toggle tam giác đen (▶→▼, thuộc *Filter) + panel overlay (absolute, rgba sheet) + 6 filter row (mỗi row toggle mở options dạng overlay absolute, không xê dịch); scrim rgba fixed dim list; sticky `top-14`.
  + `exams/page.tsx` — bỏ lg sidebar grid; stack dọc: header → ExamFilters (sticky overlay) → ExamBrowser. max-w hẹp (focused).
  + `ExamBrowser.tsx` — danh sách block dọc 1 cột (khớp template mobile).
  + `ExamCard.tsx` — block: title (serif) + nội dung tượng trưng (Trường/Mức độ) + meta thật (môn/lớp, câu/phút).

## Kết quả Testing (M3.1 Task 1 — làm lại)
- `tsc --noEmit`: pass. `next build`: pass (7 routes).
- **Visual (browser mobile 375×812, /exams):** khớp template + #Yêu cầu:
  - Navbar sticky (logo "Trạng Nguyên" + dropdown Menu).
  - Master toggle tam giác đen "▶ BỘ LỌC" → mở "▼", sticky `top-14`.
  - Mở *Filter: panel rgba sheet trắng **đè lên** danh sách đề (block Vật Lý mờ phía sau qua scrim rgba — KHÔNG bị đẩy sang bên); 6 filter (Môn học, Lớp, Trường, Năm, Học kỳ, Mức độ).
  - Mở "Môn học": bảng chọn overlay (absolute) phủ lên Trường/Năm — Học kỳ/Mức độ **không xê dịch** (đúng yêu cầu "không ảnh hưởng bố cục").
  - Lọc chạy: `?subject=Toán` → 1 đề; `?subject=Vật Lý` → 1 đề; master hiện "Bộ lọc · đang lọc" + "Xoá lọc"; sub-panel tự đóng sau khi chọn.
  - **0 console errors** (chỉ warning preload font/css — Next dev, vô hại).
- Screenshot: `TEMP_SCREENSHOT/m3.1-redo-mobile-{1-collapsed,2-filter-open,3-monhoc-open,4-after-select}.png`.
- ⚠️ MCP `browser_click` báo timeout 5s (quirk RPC) nhưng click vẫn vào — xác nhận bằng `browser_evaluate` (click option → URL đổi đúng).

### Sửa lần 2 (engineer feedback)
*Issue:* (1) Tự thêm tiêu đề trang "Chọn đề luyện" — template không có → bỏ. (2) *Filter đặt sai chỗ: đang là thanh ngang phía trên list; phải nằm BÊN TRÁI cạnh list + đè lên list khi mở; cả block *Filter phải `sticky` để đi theo khi cuộn.
*Fixing process:*
- `exams/page.tsx` — bỏ hẳn `<header>` tiêu đề; layout `flex items-start`: ExamFilters (trái) | exam list (`flex-1`).
- `ExamFilters.tsx` — đổi sang **tay nắm mảnh bên trái** (tam giác đen ▶ + nhãn dọc "BỘ LỌC", chấm brand khi đang lọc), `sticky top-14`. Mở → panel `absolute left-0 top-0 w-[84vw]` đè lên list (rgba sheet + scrim). Bỏ `overflow-y-auto` ở panel (tránh clip sub-panel overlay).

## Kết quả Testing (sửa lần 2 — browser mobile 375×812)
- `tsc` pass. `next build` pass (7 routes). **0 console errors**.
- **Đóng:** không còn tiêu đề trang; tay nắm *Filter mảnh bên trái (▶ + "BỘ LỌC" dọc) cạnh exam list — khớp template.
- **Mở:** panel đè lên list (block Vật Lý mờ sau scrim rgba), 6 filter; chọn Toán → `?subject=Toán`.
- **Sticky (kiểm bằng JS):** cuộn `scrollY=700` → tay nắm vẫn ghim `top=56px` (đi theo user). `getComputedStyle.position='sticky'`.
- **Overlay không xê dịch:** mở Môn học → options phủ lên Lớp/Trường/Năm; Học kỳ/Mức độ KHÔNG bị đẩy.
- Screenshot: `TEMP_SCREENSHOT/m3.1-redo2-mobile-{1-collapsed,2-filter-open,4-monhoc-open}.png` (ảnh sticky-scrolled bỏ vì DOM clone bị React reconcile — sticky đã xác minh bằng JS).
- **Engineer xác nhận visual ✅ (2026-06-08)**
- **Git: commit `57c403a`, push lên main ✅ (2026-06-08)**
  - Staged: `SOURCE/app/(layer2)/_components/` (4 file), `SOURCE/app/(layer2)/exams/page.tsx`, `SOURCE/app/(layer2)/queries.ts`, `SOURCE/app/globals.css`, `SOURCE/app/layout.tsx`, `SOURCE/next.config.ts`, `ASSETS/` (fonts + models 3D).
  - **KHÔNG stage:** MD file, screenshot, `.claude/`, `.mcp.json`, `TEMPLATE/`, `TEXT/`. Rule này áp dụng cho mọi Git step về sau.
- **M3.1 Task 1 — DONE ✅**

> **Bước tiếp theo (M3.1 còn lại):**
> - Task 2: Style `QuestionRenderer` + `AnswerChoice` (focus mode — exam player)
> - Task 3: Style `ExamTimer` + `QuestionPagination` + `FlagButton` (ExamTimer/FlagButton chưa tồn tại — sẽ tạo)
> - Task 4: Style `ScoreCard` + `TopicBreakdown`
> - Task 5: Markdown + LaTeX rendering cho nội dung câu hỏi

---
---

# [Layer 2: Core Loop] — Task: GĐ 3 Polish — M3.1 Task 2 (Style Exam Player — focus mode)

- **Latest prompt:** "Go on the next task" → Task 2. Engineer chốt "Có chức năng như agent đề nghị" + "Bắt đầu code". (Trước đó: bỏ block "5 câu · 15 phút" khỏi ExamCard.)
- **Latest step:** Testing (tsc + build pass) — **chờ engineer xác nhận visual để Git** (milestone UI → không auto-Git, theo pattern Task 1).
- **Layer status:** Layer 2 — tiếp tục style (visual language Focused).

### Quyết định C&D (engineer chốt)
- Approach style như agent đề xuất: ExamPlayer shell (SiteHeader + top bar tiến độ sticky + cột hẹp) · QuestionRenderer (eyebrow mono + nội dung serif) · AnswerChoice (card hairline, radio ẩn, nhãn A/B/C/D mono, selected = brand) · QuestionPagination (ô vuông trạng thái chưa làm/đã làm/đang xem + prev/next minimal).
- Timer + Flag để dành **Task 3** (câu hỏi hành vi timer-hết-giờ vẫn mở).

## UI Module: Exam Player (style) — M3.1 Task 2
- **State:** Done (chờ engineer confirm visual)
  + `_components/AnswerChoice.tsx` — viết lại: card hairline, `<input radio>` `sr-only` (giữ a11y), nhãn chữ cái mono, selected = `border-brand bg-brand/8`, hover = `border-brand/40 bg-accent`.
  + `_components/QuestionRenderer.tsx` — eyebrow "Câu N / M", nội dung `font-serif text-xl leading-relaxed`, fieldset bỏ border, legend sr-only.
  + `_components/QuestionPagination.tsx` — ô vuông `size-9`: đang xem = brand solid, đã làm = `bg-brand/8` viền brand mờ, chưa làm = hairline; prev/next text minimal disabled mờ.
  + `_components/ExamPlayer.tsx` — thêm `SiteHeader`; top bar sticky `top-14`; `main` cột `max-w-2xl` căn giữa; nút "Nộp bài" nền brand; "còn N câu" nhấn số.
  + `_components/ExamCard.tsx` — gỡ block meta "N câu · N phút" (engineer yêu cầu) — `Exam` type + queries giữ nguyên `durationMinutes` (cần cho ExamTimer Task 3).

### Sửa theo feedback engineer (screenshot review)
*Issue:* (1) Top bar dưới navbar lặp "Câu n/N" cạnh tên đề → bỏ. (2) Bỏ 2 nút "Câu trước"/"Câu sau" (điều hướng chỉ qua ô số). (3) Tên đề căn giữa block top bar.
*Fixing process:*
- `ExamPlayer.tsx` — top bar bỏ span "Câu N / M", đổi `justify-between` → `justify-center` (tên đề căn giữa). Bỏ destructure `next`/`prev` khỏi `useExamPlayer` + bỏ prop `onPrev`/`onNext` truyền xuống.
- `QuestionPagination.tsx` — gỡ hẳn 2 nút prev/next + 2 prop `onPrev`/`onNext` khỏi interface; chỉ còn lưới ô số (`onJump`). `useExamPlayer` vẫn export `next`/`prev` (không dùng — vô hại).
- `tsc` pass, `next build` pass (7 routes).

## Kết quả Testing (M3.1 Task 2)
- `tsc --noEmit`: pass. `next build`: pass (7 routes, không đổi).
- **Visual:** Playwright MCP chưa cấu hình trong session này + không có reference image riêng cho màn Player → bỏ qua bước chụp tự động (đúng WORKFLOW Bước 4). Chờ engineer xác nhận visual trên browser trước khi Git.

> **Còn lại M3.1:** Task 3 (ExamTimer + FlagButton — cần chốt hành vi timer hết giờ), Task 4 (ScoreCard + TopicBreakdown), Task 5 (markdown + LaTeX).

> **Task 2 — Git: commit `9bc5e86`, push main ✅.** Staged 5 component (AnswerChoice, ExamCard, ExamPlayer, QuestionPagination, QuestionRenderer). KHÔNG stage MD/TEXT/.claude/TEMPLATE. **Task 2 DONE ✅.**

---
---

# [Layer 2: Core Loop] — Task: GĐ 3 Polish — M3.1 Task 3 (ExamTimer + FlagButton)

- **Latest prompt:** "Chọn phương án của agent cho bộ đếm thời gian" + "Bắt đầu code".
- **Latest step:** Testing (tsc + build pass) — **chờ engineer xác nhận visual để Git**.
- **Layer status:** Layer 2 — tiếp tục style.

### Quyết định C&D (engineer chốt)
- Timer hết giờ → **PA A (auto-submit)**: đồng hồ về 0 tự gọi `submitExam()`. Đúng hành vi phòng thi.
- FlagButton: đánh dấu câu để xem lại — state in-memory trong `useExamPlayer` (không persist DB, đúng "local UI state" UI-LAYER-MAP Mục 9).
- Vị trí top bar: timer (trái) · tên đề (giữa, giữ căn giữa engineer đã yêu cầu) · flag (phải) — grid 3 cột `[1fr_auto_1fr]`.

## Logic Module: Exam Player State (mở rộng)
- **State:** Done
  + `hooks/useExamPlayer.ts` — thêm `flags: Record<string,true>` + action `TOGGLE_FLAG`, expose `flags`/`toggleFlag`. Giữ next/prev (không dùng — vô hại).

## UI Module: Exam Player — Timer + Flag (M3.1 Task 3)
- **State:** Done (chờ engineer confirm visual)
  + `_components/ExamTimer.tsx` (MỚI) — client, đếm ngược từ `durationMinutes` bằng `setTimeout` từng giây; chạm 0 → `onTimeUp()` đúng 1 lần (2-effect pattern, callback giữ trong ref → dùng answers mới nhất). MM:SS mono, đổi màu `destructive` ở phút cuối, KHÔNG nhấp nháy.
  + `_components/FlagButton.tsx` (MỚI) — client, toggle flag câu hiện tại; cờ tô đặc + chữ mono, active = brand. Controlled qua flagged/onToggle.
  + `_components/QuestionPagination.tsx` — thêm prop `flaggedIndices`; ô câu đã flag có chấm brand góc trên-phải (ring nền).
  + `_components/ExamPlayer.tsx` — nhận `durationMinutes`; top bar grid 3 cột (timer/tên đề/flag); `submittedRef` chống nộp trùng (nút thủ công + auto-submit); truyền flags xuống Pagination.
  + `exams/[id]/attempt/[attemptId]/page.tsx` — truyền `durationMinutes={data.exam.durationMinutes}`.

## Kết quả Testing (M3.1 Task 3)
- `tsc --noEmit`: pass. `next build`: pass (7 routes, không đổi).
- **Visual:** chờ engineer xác nhận trên browser (pattern milestone style). Lưu ý: timer 15:00 đếm ngược; auto-submit chỉ kích khi về 00:00.

> **Còn lại M3.1:** Task 4 (ScoreCard + TopicBreakdown), Task 5 (markdown + LaTeX).

---
---

# [Layer 2: Core Loop] — Task: GĐ 3 Polish — M3.1 Task 4 + 5 (Result page + Markdown/LaTeX)

- **Latest prompt:** "Hoàn thành hai task còn lại của M3.1. Bắt đầu code." (model Opus). Trước đó C&D qua template `TEMPLATE/L2/resultpage_L2_mobile.png` + 6 câu hỏi engineer chốt.
- **Latest step:** ✅ **DONE — đã Git commit `35c1811`** (S#13, 2026-06-13).
- **Layer status:** Layer 2 — tiếp tục style (visual language Focused).

### Quyết định C&D (engineer chốt qua bảng Q1–Q6)
- Q1: Score summary (tên đề, câu đúng/sai, thời gian hoàn thành) — **tượng trưng**, chưa persist thời gian thực.
- Q2: Topic breakdown — nhãn theo `topic` của câu hỏi (vd "Câu đạo hàm") — **tượng trưng**.
- Q3: 2 ô cạnh block topic = **Save PDF** (icon trống + chữ `<save>`) + **Share** (icon trống + chữ `share`) — placeholder, chưa có function.
- Q4: "Trở về homepage" → route `/` (trang placeholder hiện có; L1 style sau).
- Q5: "Chi tiết" → **page riêng** (`result/detail`) hiển thị đúng/sai từng câu — bố cục tự thiết kế, nhất quán L2.
- Q6: Màu template chỉ tượng trưng → giữ nền giấy trắng + accent tiết chế (không fill đỏ/vàng/xanh).

### Quyết định kỹ thuật
- Markdown + LaTeX: dùng `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex` + `katex` (chuẩn hệ sinh thái). Component dùng chung `components/shared/RichText.tsx` (client) — import `katex/dist/katex.min.css`.
- `getResult` mở rộng: trả `questions: Record<id, {content, choices}>` (thay `questionContent` map string) để Detail page render đủ nội dung + lựa chọn.
- Detail page route con: `/exams/[id]/attempt/[attemptId]/result/detail` (server component, đọc `getResult`).

## UI Module: Result Page (M3.1 Task 4)
- **State:** Done (chờ engineer confirm visual)
  + `ScoreCard.tsx` — block "tờ giấy": eyebrow + tên đề serif + điểm lớn /10 (brand) + dl 3 cột đúng/sai/thời gian (thời gian = "—" tượng trưng) — Done
  + `TopicBreakdown.tsx` — list chủ đề "Câu <topic>" + thanh tiến độ brand (correct/total) — Done
  + `ResultActions.tsx` (MỚI) — 2 ô vuông Save/Share: icon trống (ô hairline) + nhãn mono "save"/"share", `disabled` (chưa có function — Q3) — Done
  + `result/page.tsx` — redesign: SiteHeader + ScoreCard + grid [TopicBreakdown | (Save/Share + Trở về trang chủ)] + nav 2 cột (Xem chi tiết brand → detail / Làm lại) — Done
  + `result/detail/page.tsx` (MỚI) — chi tiết từng câu: status Đúng/Sai/Bỏ trống; mỗi lựa chọn tô đáp án đúng (brand) + đáp án chọn sai (destructive) + tag; ← Quay lại kết quả — Done

## UI Module: Markdown + LaTeX (M3.1 Task 5)
- **State:** Done
  + `components/shared/RichText.tsx` (MỚI) — react-markdown + remark-gfm + remark-math + rehype-katex + katex CSS; prop `inline` (p→fragment) cho nhãn lựa chọn — Done
  + `QuestionRenderer.tsx` — content dùng `<RichText>` (block) — Done
  + `AnswerChoice.tsx` — text lựa chọn dùng `<RichText inline>` — Done
  + (Detail page cũng dùng RichText cho content + choices.)

## Logic Module: getResult mở rộng
- **State:** Done
  + `queries.ts` — `getResult` trả `questions: Record<id, {content, choices}>` (thay `questionContent` map string); select thêm `choices`; import `Choice` type — Done

## Kết quả Testing (M3.1 Task 4 + 5)
- `npm install react-markdown remark-gfm remark-math rehype-katex katex`: +121 packages (lần đầu fail ECONNRESET → cài lại OK).
- `tsc --noEmit`: pass (exit 0).
- `next build`: pass — **8 routes**, thêm `/exams/[id]/attempt/[attemptId]/result/detail`.
- Đã `rm -rf .next` sau build (tránh gotcha font manifest khi `npm run dev`).
- **Visual (Playwright MCP, 390px, login test user `+rlstesta`):**
  + Result page: bố cục khớp `resultpage_L2_mobile.png` — block điểm; [chủ đề | (save/share đỉnh + Trang chủ đáy)]; [Xem chi tiết | Làm lại]. **0 console errors.**
  + Detail page: từng câu status Đúng/Bỏ trống, đáp án đúng tô brand + tag "ĐÁP ÁN ĐÚNG", "← Quay lại kết quả". **0 console errors.**

### Sửa sau review engineer (vòng 1)
- Nút trở về: text "Trở về trang chủ" → **"Trang chủ"** (1 dòng, không wrap).
- Bố cục nút Trang chủ chưa khớp template → cột phải `items-stretch` + `justify-between`: save/share canh **đỉnh**, "Trang chủ" canh **đáy** (thẳng đáy block chủ đề) — đúng template.
- Đã so trực tiếp page hiện tại vs template qua Playwright, lặp tới khi khớp.

> **M3.1 — hoàn tất Task 1–5, visual đã verify bằng Playwright.** Chờ engineer xác nhận lần cuối → Git.

---
---

# [Layer 2: Core Loop] — Task: GĐ 3 Polish — M3.2 Responsive Layer 2 (Task 1–3)

- **Latest prompt:** "Bắt đầu thực hiện M3.2 (tất cả task)." Engineer chốt Q1=A, Q2=A, Q3=A (model Opus).
- **Latest step:** Testing ✅ (tsc + build + visual Playwright mobile 390 / desktop 1280) — **chờ engineer xác nhận visual để Git** (pattern milestone UI).
- **Layer status:** Layer 2 — responsive (visual language Focused giữ nguyên).

### Quyết định C&D (engineer chốt)
- Q1=A: Swipe = **touch events thuần** (`useSwipe` hook, không thêm dependency). Đúng tinh thần "chuyển câu instant, không animation thừa" (UI-LAYER-MAP 4.2).
- Q2=A: Style luôn trang **Exam Detail** (`/exams/[id]`) — đang còn ở trạng thái GĐ 1 (xấu), nằm giữa Browser→Player nên không thể bỏ sót khi test mobile.
- Q3=A: Desktop giữ lưới ô số pagination + thêm **keyboard nav** (← →); mobile dùng swipe + vẫn giữ lưới ô số.

## Logic/Hook Module: Swipe + Keyboard nav (M3.2 Task 1)
- **State:** Done
  + `hooks/useSwipe.ts` (MỚI) — touch events, chỉ tính swipe khi vuốt ngang vượt ngưỡng 50px VÀ trội hơn vuốt dọc (không nuốt cuộn trang); không preventDefault. Trả props `{onTouchStart,onTouchEnd}`. — Done
  + `_components/ExamPlayer.tsx` — destructure `next`/`prev` từ `useExamPlayer`; gắn `useSwipe({onSwipeLeft:next,onSwipeRight:prev})` lên div bọc QuestionRenderer; `useEffect` keydown ← → (bỏ qua khi focus ở INPUT/TEXTAREA để radio group dùng mũi tên chọn A/B/C/D bình thường). — Done

## UI Module: Exam Detail style + breakpoints (M3.2 Task 2)
- **State:** Done (chờ engineer confirm visual)
  + `exams/[id]/page.tsx` (viết lại) — visual language L2: SiteHeader + back link "← Tất cả đề" (bù thiếu sót nav ghi nhận từ GĐ 2) + eyebrow môn/lớp + tiêu đề serif + 2 ô meta (số câu/thời gian) + đoạn dẫn + nút brand. `max-w-xl`, mobile-first. — Done
  + `_components/StartAttemptButton.tsx` — style brand, `w-full` mobile → `sm:w-auto` desktop. — Done

## Testing thiết bị (M3.2 Task 3)
- **State:** Done (screenshot chuẩn bị cho engineer test Android thật)
  + Screenshot `TEMP_SCREENSHOT/m3.2-*.png` (mobile 390 + desktop 1280) cho Detail/Player/Result.

## Kết quả Testing (M3.2)
- `tsc --noEmit`: pass. `next build`: pass — 8 routes (không đổi). Đã `rm -rf .next` sau build.
- **Visual (Playwright, login test user `+rlstesta`):**
  + **Swipe** (dispatch TouchEvent trên vùng câu hỏi): vuốt trái Câu 1→2 ✓, vuốt phải 2→1 ✓.
  + **Keyboard:** ArrowRight 1→2 ✓; ArrowLeft 2→1 ✓; **guard** — ArrowRight khi target=radio KHÔNG chuyển câu (giữ ở Câu 2) ✓.
  + **Detail page** 390 + 1280: bố cục L2 đúng (back link, eyebrow, tiêu đề serif, 2 ô meta, nút brand full→auto). ✓
  + **Player** 390 + 1280: top bar timer·tên đề·flag, focus mode cột hẹp, không vỡ. ✓
  + **Result** 390 + 1280: constrained max-w-xl, không vỡ. ✓
  + **0 console errors** (2 warning preload font — Next dev, vô hại).

> **Còn lại GĐ 3 sau M3.2:** M3.3 Homepage 3D (Three.js, model `.glb`), M3.4 Mobile fallback, M3.5 Personalization, M3.6 Transitions & SEO + Lighthouse.

---
---

# [Layer 1: Entry] — Task: GĐ 3 Polish — M3.3 Homepage 3D

- **Latest prompt:** "Bắt đầu thực hiện toàn bộ task của M3.3" (model Opus). C&D chốt qua bảng Q1–Q5.
- **Latest step:** ✅ **DONE — Git commit `e094bc5`, push main** (2026-06-14).
- **Layer status:** Layer 1 — homepage style xong (editorial dark + 3D).

### Quyết định C&D (engineer chốt)
- Q1: Navbar L1 **kế thừa `SiteHeader` của L2** (không viết lại). → header trắng sticky trên nền hero tối (tương phản editorial).
- Q2: Bấm máy AIO → dẫn thẳng `/exams` (Exam Browser; proxy tự đẩy `/login` nếu chưa auth).
- Q3: **Bỏ** 3 feature columns dưới fold (không dùng).
- Q4=A: Nền tối riêng cho homepage (`#0d0d11`), tách khỏi visual L2 giấy trắng.
- Q5=A: M3.3 chỉ desktop; mobile fallback để M3.4.

### Quyết định kỹ thuật
- Stack: `three@0.184` + `@react-three/fiber@9` (React 19) + `@react-three/drei@10`. Cài thêm `@types/three` (dev).
- Model `.glb` cần serve runtime cho `useGLTF` → **copy** `ASSETS/models/*/source/*.glb` sang `SOURCE/public/models/` (AIO `all_in_one_pc.glb`, BOOK `stack_of_books.glb`, PENCIL `Pencil.glb`). Textures **embedded** trong .glb (self-contained, không cần copy textures riêng).
- `proxy.ts` matcher sửa loại trừ path có phần mở rộng (`.*\\..*`) → `/models/*.glb` không bị route guard đẩy `/login` (homepage là public, khách chưa auth vẫn xem được scene).
- SSR: Canvas WebGL chỉ mount client → `Homepage3D` (client) dùng `next/dynamic(ssr:false)` nạp `Scene3D`.
- Layout: hero cần **chiều cao tường minh** `h-[calc(100dvh-3.5rem)]` (header h-14) — flex-1 không đủ tin cậy cho R3F đo parent (lần đầu canvas chỉ cao 150px).

## UI Module: Homepage 3D (M3.3)
- **State:** Done (chờ engineer confirm visual)
  + `app/(layer1)/_components/Scene3D.tsx` (MỚI) — Canvas dark `#0d0d11`; ambient + 1 directional key light đổ bóng (orthographic shadow-camera); bàn gỗ dựng từ box geometry (mặt bàn y=0 + 4 chân kim loại); sàn tối hứng bóng; `Model` helper chuẩn hoá .glb (xoay→scale theo target→căn tâm x/z + đặt đáy chạm bàn); AIO giữa (clickable → `router.push('/exams')` + cursor pointer + pointLight xanh nhạt mô phỏng màn hình sáng); BOOK phải, PENCIL trái; `ContactShadows` mềm; `Suspense` fallback "Đang tải…".
  + `app/(layer1)/_components/Homepage3D.tsx` (MỚI) — client wrapper, `dynamic(ssr:false)` nạp Scene3D (loading "Đang dựng cảnh…").
  + `app/page.tsx` (viết lại) — `SiteHeader` + `<main>` nền tối + hero `h-[calc(100dvh-3.5rem)]` chứa Homepage3D + CTA "Nhấn vào màn hình để bắt đầu" (Link `/exams`, fallback a11y/non-WebGL).
  + `proxy.ts` — matcher loại trừ static file có phần mở rộng.
  + `public/models/` (MỚI) — 3 .glb copy từ ASSETS.

## Kết quả Testing (M3.3)
- `tsc --noEmit`: pass. `next build`: pass — 8 routes; homepage `/` **static (○)**.
- Đã `rm -rf .next` trước `npm run dev` (gotcha font manifest).
- **Visual (Playwright desktop 1280×800, /):**
  + Scene render khớp `homepage_desktop.png`: phòng tối, bàn gỗ chân kim loại, máy AIO màn hình sáng (kèm chuột — bonus từ model), bút đỏ trái, chồng sách xanh phải, CTA mono dưới. Canvas 1265×744.
  + **Click máy AIO** (dispatch PointerEvent giữa canvas): raycast bắt đúng mesh → điều hướng `/exams` ✓ (session còn → không qua `/login`).
  + **0 console errors** (4 warning: THREE.Clock/PCFSoftShadowMap deprecated nội bộ three + preload font Merriweather — đều vô hại).
- Screenshot: `TEMP_SCREENSHOT/m3.3-homepage-desktop.png`.

### 🐛 Bug fix (engineer report — hover làm model nhảy loạn / sách biến mất)
*Nguyên nhân:* `Model` áp `scale`/`position` trực tiếp lên chính `scene` qua `<primitive object={scene} scale position>`, nhưng `useMemo` cũng đo `Box3.setFromObject(scene)` trên scene đó → mỗi re-render (hover đổi state) đo lại trên scene đã biến đổi của lần trước → **cộng dồn** → scale/tọa độ nhảy loạn, sách scale về ~0 nên biến mất, bút phình to. Thêm: prop `rotation` là array literal → reference mới mỗi render → recompute liên tục.
*Sửa:* Tách *đo* khỏi *áp transform* — reset `scene.position/scale` về gốc trước khi đo (chỉ bake rotation); scale/offset áp lên **group bọc ngoài**, không đụng transform của `scene`. Deps useMemo dùng số `rx,ry,rz` thay array. **Verify Playwright: bắn 30 pointermove lên AIO → scene ổn định tuyệt đối (sách còn, bút đúng cỡ, không nhảy), 0 console errors.**

### 🐛 Bug fix 2 (engineer report — scrollbar dọc + object quá gần camera)
*Scrollbar:* hero tính `calc(100dvh-3.5rem)` nhưng header có `border-b` 1px → cao 57px (không phải 56) → tổng trang = 100dvh + 1px → tràn 1px. *Sửa:* bỏ calc thủ công, bọc homepage trong `div.flex.h-[100dvh].flex-col.overflow-hidden`, header trong flow + `main.flex-1.min-h-0` (Canvas vẫn có chiều cao xác định). Verify `scrollHeight - clientHeight = 0`.
*Object quá gần:* kéo camera lùi `position z 3.9 → 4.7` (giữ fov 38) → toàn cảnh lùi xa, nhỏ lại, nhiều khoảng thở, chân bàn hiện đủ. Verify screenshot 1280×800, 0 console errors.

### ✨ Bổ sung ánh sáng (engineer yêu cầu — qua vài vòng)
- **Directional light top-down**: đổi vị trí `[3.5,6,4] → [0,9,-1.5]`, intensity `1.5 → 2.1` — chiếu gần thẳng từ trên xuống mặt bàn, hơi nghiêng về camera để bóng đổ ra trước (thấy độ sâu).
- **Bóng đậm hơn (nổi khối)**: `ambientLight 0.28 → 0.18` + `ContactShadows opacity 0.45 → 0.85`, `far 3 → 1.3`.
- **Đèn trần bóng sợi đốt**: đã thêm `PendantLamp` (dây + đui + quả cầu emissive + pointLight ấm) rồi **engineer yêu cầu BỎ** — đã gỡ hẳn component + usage, chỉ giữ directional light. Scene cuối: directional top-down + ambient + pointLight xanh màn hình.

### Điểm cần engineer review
- **Header trắng trên nền tối**: đúng quyết định Q1 (kế thừa SiteHeader, không viết lại) → tương phản mạnh. Nếu muốn header tối hơi hoà với hero thì là thay đổi riêng (sẽ phải sửa/biến thể SiteHeader — ngoài "không viết lại").
- **Sách màu xanh bão hoà**: là texture embedded của model, hơi nổi so với tông editorial trầm của template. Giữ nguyên asset; có thể override material nếu engineer muốn dịu lại.
- Màn hình AIO chưa có hiệu ứng bloom (đốm sáng) như template — cần postprocessing (`@react-three/postprocessing`), để dành nếu engineer yêu cầu.

> **Còn lại GĐ 3:** M3.4 Mobile fallback (ảnh tĩnh + parallax thay 3D nặng trên mobile), M3.5 Personalization, M3.6 Transitions & SEO + Lighthouse.

---
---

# [Layer 1: Entry] — Task: GĐ 3 Polish — M3.4 Homepage Mobile Fallback

- **Latest prompt:** "Tiếp tại nơi đã dừng trong PROCESS.md. Thực hiện M3.4." (model Opus). Trước đó cùng phiên engineer yêu cầu sửa desktop hover (scale Mac + biến CTA tĩnh thành CTA hover) — đã xong, engineer xác nhận "Hoạt động ổn".
- **Latest step:** Testing ✅ (tsc + build pass) — ⚠️ **Visual chưa ổn — engineer xem trên browser và từ chối, sẽ sửa lại phiên sau.** Chưa Git.
- **Layer status:** Layer 1 — thêm nhánh mobile (visual language Spatial/2.5D thay 3D).

### Quyết định C&D (engineer chốt — bảng Q1–Q5)
- Q1=A: Dựng fallback 2.5D bằng **CSS/HTML layers** (tái hiện bàn+Mac+đạo cụ editorial tối), KHÔNG cần ảnh tĩnh mới (ASSETS/images rỗng, không có template mobile).
- Q2=A: Ngưỡng load 3D = `≥1024px` (`lg`) + có WebGL → 3D; còn lại (kể cả tablet) → 2.5D.
- Q3=A: Parallax theo **cuộn + di con trỏ/ngón** (pointermove), **BỎ** gyroscope (optional, tránh popup quyền iOS).
- Q4=Bỏ qua: sticky notes để dành M3.5 (cần account/DB). M3.4 chỉ scene + CTA.
- Q5=A: Tự thiết kế theo visual language L1, **không cần screenshot lại** (không có template mobile để so).

### Quyết định kỹ thuật
- **Three.js KHÔNG nạp trên mobile** ⇒ không dùng CSS `hidden` (component vẫn mount → `dynamic()` vẫn tải chunk). Branch bằng JS: `HomepageStage` (client) đọc `matchMedia('(min-width:1024px)')` + check WebGL sau hydrate → chỉ mount `Homepage3D` khi đủ điều kiện; ngược lại `HomepageMobile`.
- SSR/first paint render nhánh mobile (HTML/CSS thuần, nhẹ, tốt SEO, không layout shift trên Android); desktop swap sang 3D sau mount.
- Parallax dùng **CSS variables** (`--px`/`--py`) ghi qua ref + throttle rAF (tránh re-render React mỗi pointermove — quan trọng cho Android tầm trung). Layer transform `translate3d(calc(var(--px)*Npx)...)`, transition mượt.

## UI Module: Homepage Mobile (M3.4)
- **State:** Done (chờ engineer confirm visual)
  + `hooks/useParallax.ts` (MỚI) — `usePointerParallax<T>()`: ghi `--px`/`--py` ∈ [-1,1] theo vị trí con trỏ/ngón trong phần tử, throttle rAF, reset khi rời (pointerleave/up/cancel). — Done
  + `app/(layer1)/_components/HomepageMobile.tsx` (MỚI) — scene 2.5D editorial tối: lớp tường/glow/bàn gỗ/bóng/Mac(màn hình sáng)/sách/bút parallax theo độ sâu (3→16px) + vignette tĩnh + khối CTA tĩnh ghim đáy ("Vào học →" Link `/exams`, eyebrow). `<h1 sr-only>` gánh SEO. CSS var qua `as CSSProperties`. — Done
  + `app/(layer1)/_components/HomepageStage.tsx` (MỚI) — branch desktop(3D)/mobile(2.5D) bằng `matchMedia('(min-width:1024px)')` + `hasWebGL()`; mount Homepage3D CHỈ khi đủ điều kiện → three không nạp trên mobile. — Done
  + `app/page.tsx` — thay `<Homepage3D/>` bằng `<HomepageStage/>` (giữ shell + SiteHeader). — Done

## Kết quả Testing (M3.4)
- `tsc --noEmit`: pass (exit 0). `next build`: pass — 8 routes; homepage `/` **vẫn static (○)** vì fallback mobile SSR ra HTML thuần (3D chỉ swap client-side trên desktop). Đã `rm -rf .next` sau build.
- **Three.js KHÔNG nạp trên mobile (kiến trúc):** `HomepageStage` import `Homepage3D` (module wrapper nhẹ) nhưng chỉ *render* nó khi `use3D=true`; chunk three thực sự nằm sau `dynamic(ssr:false)` của Scene3D → chỉ tải khi Scene3D mount (tức desktop). Nhánh mobile không bao giờ mount Homepage3D.
- **Visual:** ⚠️ Engineer xem trên browser và nhận xét **"chưa ổn"**. Sẽ sửa lại phiên sau. Chưa Git, chưa commit.

> **Bước tiếp theo (phiên sau):** Hỏi engineer muốn sửa cụ thể điểm nào (bố cục, màu, độ mạnh parallax, hình dạng Mac/bàn…) → sửa `HomepageMobile.tsx` theo feedback → verify lại → Git.

---
---

# [Layer 1: Entry] — Task: GĐ 3 Polish — M3.4 RESET (xóa code, làm lại từ đầu)

- **Latest prompt:** "Xóa các file code liên quan của M3.4 để thực hiện lại. Chờ engineer yêu cầu code." (Không dùng Playwright trong phiên này.)
- **Latest step:** Updating + Testing tối giản (chỉ `tsc --noEmit`, không build/không Playwright) — **xong. Chờ TE1 từ engineer (chưa C&D lại).**
- **Layer status:** Layer 1 — quay lại trạng thái cuối M3.3 (chỉ desktop 3D, chưa có nhánh mobile).

## Logic/UI Module: Xóa code M3.4
- **State:** Done
  + Xóa `SOURCE/hooks/useParallax.ts` — Done
  + Xóa `SOURCE/app/(layer1)/_components/HomepageMobile.tsx` — Done
  + Xóa `SOURCE/app/(layer1)/_components/HomepageStage.tsx` — Done
  + Revert `SOURCE/app/page.tsx` — import lại `Homepage3D` (thay `HomepageStage`), `<Homepage3D />` thay `<HomepageStage />`, sửa comment đầu file về lại mô tả M3.3 (desktop only, mobile fallback để M3.4 làm lại) — Done
  + **Giữ nguyên, KHÔNG đụng tới:** `SOURCE/app/(layer1)/_components/Scene3D.tsx` — hover-scale (`HOVER_SCALE`, lerp `useFrame`) + CTA `<Html>` "Nhấn để bắt đầu" là phần bổ sung của M3.3, engineer đã xác nhận "Hoạt động ổn" trước khi M3.4 bắt đầu.
  + `SOURCE/app/(layer1)/_components/Homepage3D.tsx` — không đổi, vẫn còn nguyên từ M3.3.

## Kết quả Testing (RESET)
- `tsc --noEmit` (trong `SOURCE/`): pass, không lỗi sau khi xóa file + revert `page.tsx`.
- Không chạy `next build` / Playwright trong phiên này theo yêu cầu engineer.

> **Bước tiếp theo:** Chờ engineer gửi TE1 mới (yêu cầu/feedback cụ thể cho M3.4) → C&D lại từ đầu (không tái dùng C&D vòng 1 nếu engineer muốn hướng khác) → Coding.

---
---

# [Layer 1: Entry] — Task: GĐ 3 Polish — M3.4 Homepage Mobile Fallback (LÀM LẠI — computer.png trên bàn CSS)

- **Latest prompt:** "Thực hiện M3.4: Import ảnh AIO PC (computer.png) trong ASSETS/images; computer.png nằm trên một 3D table model (4 chân, agent tự vẽ); CTA button đè trên chính giữa computer.png; navbar kế thừa từ UI L2." (model Opus, KHÔNG dùng Playwright phiên này.)
- **Latest step:** Testing ✅ (tsc + next build pass) — **chờ engineer xác nhận visual trên browser để Git** (pattern milestone UI; lần trước bị từ chối nên không auto-Git).
- **Layer status:** Layer 1 — thêm nhánh mobile (visual language Spatial tái hiện bằng CSS 2.5D).

### Quyết định C&D (engineer chốt — 2 câu hỏi)
- Q1=A: Bàn dựng bằng **CSS/HTML 2.5D** (faux-3D: mặt bàn trapezoid phối cảnh + 4 chân, agent tự vẽ). KHÔNG Three.js trên nhánh mobile (đúng ràng buộc lõi dự án).
- Q2=A: Thiết kế mới **chỉ áp dụng <1024px**; giữ nguyên scene 3D Three.js M3.3 cho desktop → cần branching (HomepageStage).

### Quyết định kỹ thuật
- `computer.png` (256×256, illustration AIO phẳng nền trong suốt) copy `ASSETS/images/` → `SOURCE/public/images/` để Next serve runtime (proxy đã loại path có đuôi từ M3.3). Render bằng `next/image` (priority, alt → a11y/SEO).
- Bàn faux-3D bằng CSS thuần (deterministic, không cần Playwright verify): mặt bàn `clip-path: polygon(14% 0,86% 0,100% 100%,0 100%)` (trapezoid hẹp-sau-rộng-trước) + cạnh trước (độ dày) + 4 chân (2 trước đậm/ra ngoài, 2 sau mảnh+tối+thụt vào → chiều sâu) + bóng đổ mềm. Tông gỗ trầm khớp editorial dark `#0d0d11`.
- Máy đặt **trên** mặt bàn: z-index máy > bàn + `-mt-6` kéo bàn lên dưới đáy máy. CTA "Vào học →" `absolute` đè chính giữa computer.png (bg-brand + text-brand-foreground, active:scale-95).
- Branch không dùng CSS `hidden`: `HomepageStage` (client) đọc `matchMedia('(min-width:1024px)')` + `hasWebGL()` sau hydrate → chỉ *mount* Homepage3D (→ Scene3D dynamic → three) khi đủ điều kiện. SSR + render client đầu = HomepageMobile (HTML thuần).

## UI Module: Homepage Mobile (M3.4 — làm lại)
- **State:** Done (chờ engineer confirm visual)
  + `SOURCE/public/images/computer.png` (MỚI) — copy từ ASSETS. — Done
  + `app/(layer1)/_components/HomepageMobile.tsx` (MỚI) — scene 2.5D: glow màn hình + eyebrow + máy (next/image) trên bàn gỗ faux-3D 4 chân + CTA đè giữa máy + bóng đổ + hint dưới. `<h1 sr-only>` gánh SEO. — Done
  + `app/(layer1)/_components/HomepageStage.tsx` (MỚI) — branch desktop(3D)/mobile(2.5D) bằng matchMedia + hasWebGL; three không nạp trên mobile. — Done
  + `app/page.tsx` — thay `<Homepage3D/>` bằng `<HomepageStage/>` (giữ shell + SiteHeader = navbar kế thừa L2). — Done
  + Giữ nguyên `Scene3D.tsx`/`Homepage3D.tsx` (M3.3, không đụng).

## Kết quả Testing (M3.4 — làm lại)
- `tsc --noEmit`: pass (exit 0). `next build`: pass — homepage `/` **static (○)** (fallback mobile SSR ra HTML thuần; 3D chỉ swap client-side trên desktop). Đã `rm -rf .next` sau build (gotcha font manifest).
- **Three.js KHÔNG nạp trên mobile (kiến trúc):** `HomepageStage` chỉ *render* `Homepage3D` khi `use3D=true`; chunk three nằm sau `dynamic(ssr:false)` của Scene3D → chỉ tải khi Scene3D mount (desktop).
- **Visual:** KHÔNG dùng Playwright phiên này (engineer chỉ định) → chờ engineer xem trên browser (mobile <1024px) và xác nhận trước khi Git.

### Sửa visual vòng 1 (engineer feedback + screenshot)
*Issue:* (1) Bỏ 2 dòng chữ trên/dưới ("Không gian học của bạn" + "Chạm vào màn hình để bắt đầu"). (2) CTA hơi to + đang căn giữa CẢ ẢNH (top-1/2) nên không nằm giữa màn hình (ảnh có chân đế → tâm màn hình cao hơn). (3) Máy nằm hơi lùi.
*Fixing process (HomepageMobile.tsx):*
- Xóa 2 `<p className="eyebrow">`. Glow chuyển vào trong "sân khấu" (bám theo máy thay vì container).
- CTA nhỏ ~10%: `px-5 py-2.5 text-xs tracking-[0.16em]` → `px-[18px] py-2 text-[11px] tracking-[0.14em]`. Căn tâm màn hình: `top-1/2` → `top-[38%]` (giữ `-translate-y-1/2`; 38% ≈ tâm vùng màn hình của computer.png 256×256).
- Máy nhích lên/forward ~5%: overlap bàn `-mt-6` (24px) → `-mt-[33px]` (+9px ≈ 5% chiều cao máy).
- `tsc` + `next build` pass. Đã `rm -rf .next`.
- ⚠️ Con số `top-[38%]` và overlap là ước lượng (không Playwright phiên này) — chờ engineer xem lại, lệch thì chỉnh tiếp.

> **Còn lại GĐ 3 sau M3.4:** M3.5 Personalization, M3.6 Transitions & SEO + Lighthouse.

> **M3.4 TẠM GÁC (2026-06-16):** engineer yêu cầu bỏ qua M3.4, chuyển sang làm theme. Code M3.4 giữ nguyên (chưa Git), quay lại sau.

---
---

# [Layer 2: Core Loop] — Task: Theming hệ thống — EBP Theme (Exam Browser Page)

- **Latest prompt:** "Bắt đầu tạo theme cho từng UI Layer. UI Layer 2 — EBP Theme (Exam Browser Page): Navbar RGB(26,54,93); Background White; Block content bg RGB(47,133,90); Hover RGB(255,249,69); Text trắng. Lưu ý: chỉ đổi theme không đổi thiết kế; mỗi UI Layer một theme riêng, không kế thừa (trừ vài trường hợp)."
- **Latest step:** Testing ✅ (tsc + next build pass; KHÔNG Playwright phiên này) — **chờ engineer xác nhận visual để Git**.
- **Layer status:** Layer 2 — thêm hệ thống theme (per-trang/per-layer, scope CSS variables).

### Quyết định C&D (engineer chốt — 3 câu hỏi)
- Q1=A: Theme áp dụng **chỉ trang /exams** (Exam Browser). Trang L2 khác giữ nguyên, làm theme riêng sau.
- Q2=A: Navbar xanh đậm **chỉ trong scope theme này**; homepage L1 + trang L2 ngoài scope GIỮ navbar trắng (đúng "không kế thừa").
- Q3=A: Hover vàng → **viền + tiêu đề block chuyển vàng**, giữ nền block xanh, chữ thân trắng (tương phản tốt).

### Quyết định kỹ thuật — hệ thống theme
- **Theme hooks bằng CSS variables** (`globals.css`): biến `--nav-*` (navbar) + `--block-*` (ExamCard). **Mặc định ở `:root` = đúng token giao diện hiện tại** → component dùng chung (SiteHeader, ExamCard) KHÔNG đổi ở mọi nơi NGOÀI scope. Mỗi trang/layer override trong class scope riêng (`.theme-*`) → "không kế thừa".
- `.theme-ebp` override: nav-bg `rgb(26 54 93 /.95)` + nav-fg trắng; block-bg `rgb(47 133 90)` + block-fg trắng + block-hover `rgb(255 249 69)`.
- KHÔNG override token toàn cục (`--background/--foreground/--card`) → ExamFilters (sheet trắng, chữ đậm) + empty-state KHÔNG bị ảnh hưởng (đúng "chỉ đổi theme, không đổi thiết kế"). Filter là control overlay, không phải content block nên không tô xanh.
- Text trắng = trên bề mặt có màu (navbar + block xanh). Chữ trên nền trắng (filter, empty-state) giữ đậm để đọc được (white-on-white là vô nghĩa).

## UI Module: EBP Theme
- **State:** Done (chờ engineer confirm visual)
  + `app/globals.css` — thêm khối "THEME HOOKS": biến mặc định `--nav-*`/`--block-*` ở `:root` + scope `.theme-ebp`. — Done
  + `_components/SiteHeader.tsx` — header dùng `bg-[var(--nav-bg)]` + `border-[color:var(--nav-border)]`; logo `text-[var(--nav-fg)]`; "Menu"+chevron `text-[var(--nav-fg-muted)]`. (Dropdown panel giữ trắng/chữ đậm — readable, không đổi.) — Done
  + `_components/ExamCard.tsx` — block dùng `bg-[var(--block-bg)]`, `border-[color:var(--block-border)]`, hover/focus `border-[color:var(--block-hover)]`; eyebrow+meta `text-[var(--block-fg-muted)]`; tiêu đề `text-[var(--block-fg)]` + `group-hover:text-[var(--block-hover)]`. — Done
  + `exams/page.tsx` — bọc toàn trang trong `<div className="theme-ebp min-h-dvh bg-white">` (thay fragment) → kích hoạt scope + nền trắng. — Done

## Kết quả Testing (EBP Theme)
- `tsc --noEmit`: pass. `next build`: pass (routes không đổi). Đã `rm -rf .next`.
- **Không ảnh hưởng ngoài scope (kiến trúc):** biến mặc định `:root` = token cũ → SiteHeader trên homepage L1 / Detail / Player / Result vẫn trắng như trước.
- **Visual:** KHÔNG dùng Playwright phiên này (engineer chỉ định) → chờ engineer xem /exams trên browser.

> **Bước tiếp theo:** Engineer confirm visual EBP theme → Git. Sau đó theme tiếp các trang/layer khác (mỗi cái 1 scope `.theme-*`).

### Sửa bố cục EBP + hover shadow (engineer feedback)
*Yêu cầu:* (1) Main content = một block gồm filter + lưới ExamCard **2 cột × n hàng** (n theo số đề DB), block căn giữa. (2) Hover ExamCard → shadow transition độ đậm ~15%. (3) Hover filter → hiệu ứng tương tự.
*Fixing process:*
- `exams/page.tsx` — `max-w-2xl` → `max-w-3xl` (đủ rộng cho 2 cột); giữ `mx-auto` (block căn giữa) + cấu trúc `flex items-start` (filter trái + grid phải).
- `ExamBrowser.tsx` — `ul` từ `flex flex-col gap-4` → `grid grid-cols-2 gap-4` (2 cột, hàng tự theo số đề).
- `ExamCard.tsx` — `li` + `Link` thêm `h-full` (cao bằng nhau trong hàng); `transition-colors` → `transition-all duration-200` + `hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]` (bóng đen 15%).
- `ExamFilters.tsx` — tay nắm master toggle thêm `rounded-md transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]` (hover shadow giống ExamCard).
- `tsc` + `next build` pass. Đã `rm -rf .next`.
- ⚠️ Lưu ý: lưới để `grid-cols-2` cố định (đúng "2 cột") — trên màn rất hẹp (375px) 2 cột + tay nắm filter sẽ chật; nếu muốn mobile về 1 cột thì đổi `grid-cols-1 sm:grid-cols-2` (hỏi engineer). Không Playwright phiên này → chờ engineer xem.

### Đảo dark theme thành ROOT — áp dụng toàn bộ Layer ngoài L1 (engineer feedback)
*Yêu cầu:* (1) Đảo màu shadow + background của page: black ↔ white. (2) Đặt dark theme này làm **root**, để toàn bộ Layer NGOÀI L1 dựa vào (based on) — đây là "trường hợp ngoại lệ" được phép kế thừa theme đã nói ở task EBP Theme phía trên.
*C&D (1 câu hỏi):* Hỏi engineer phạm vi root dark có áp dụng ngay cho các trang L2 đã build (Detail/Player/Result — đang "tờ giấy trắng") hay chỉ /exams + tương lai. Engineer chọn: **áp dụng toàn bộ ngay**.
*Fixing process:*
- `globals.css` — gộp giá trị `.dark` (cũ, không ai dùng — không `next-themes`/toggle nào trong codebase) vào `:root` làm mặc định mới: `--background`/`--card`/`--popover` tối, `--foreground` sáng, `--border`/`--input` trắng mờ, `--brand` tông sáng hơn cho đủ tương phản trên nền tối. Xoá class `.dark` (dead code, root đã là dark).
  - ⚠️ Cập nhật/ghi đè quyết định cũ ở mục "EBP Theme" phía trên ("KHÔNG override token toàn cục `--background/--foreground/--card`") — quyết định đó đã hết hiệu lực theo yêu cầu mới này.
- `exams/page.tsx` — `bg-white` (hardcode) → `bg-background` (kế thừa root dark, đúng yêu cầu "dựa vào root").
- `ExamCard.tsx` + `ExamFilters.tsx` — hover shadow `rgba(0,0,0,0.15)` (đen) → `rgba(255,255,255,0.15)` (trắng) — đảo đúng yêu cầu, hợp lý trên nền tối.
- L1 (Homepage3D/HomepageMobile/Scene3D) — KHÔNG đụng, vẫn dùng nền riêng (`#0d0d11`/space) như cũ, đúng yêu cầu "ngoài UI L1".
- `tsc --noEmit` + `next build`: pass (routes không đổi). Đã `rm -rf .next`.
- Không Playwright phiên này → chờ engineer xem `/exams` (và các trang L2 khác: Detail/Player/Result) trên browser để confirm trước khi Git.
