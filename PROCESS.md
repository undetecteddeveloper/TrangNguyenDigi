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
GĐ 2 — Connected Prototype   : [x] Done (M2.1–M2.7) — confirmed browser 2026-06-06
GĐ 3 — Polish (MVP ship)     : [ ] In Progress — M3.1 Task 1 Done (2026-06-08)
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
