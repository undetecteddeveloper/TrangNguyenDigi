# PROJECT ROADMAP — TrangNguyenDigi

> **Tài liệu này trả lời câu hỏi: "Bắt đầu toàn bộ dự án từ đâu, theo trình tự nào?"**
> Khác với `WORKFLOW.md` (nói agent làm *một feature* theo các bước nào), file này định nghĩa **trình tự macro của cả dự án** — chia thành các giai đoạn, mỗi giai đoạn chia thành milestone, mỗi milestone chia thành task cụ thể.
> Đọc sau khi đã nắm `PROJECT_OVERVIEW.md`, `UI-LAYER-MAP.md`, `BACK-END-ARCHITECTURE-MAP.md`.

---

## 0. Cách Dùng Tài Liệu Này

- Mỗi **task** trong roadmap là một ứng viên cho **TE1** (prompt khởi động workflow). Engineer lấy task từ đây, gửi vào workflow.
- Roadmap đi **tuần tự**: không nhảy giai đoạn. Hoàn thành tiêu chí thoát (exit criteria) của giai đoạn trước mới sang giai đoạn sau.
- Trong mỗi giai đoạn, milestone đi tuần tự; task trong cùng milestone có thể linh hoạt thứ tự nếu không có dependency.

---

## 1. Phương Pháp: Prototype-First & Walking Skeleton

### 1.1. Ba khái niệm cần phân biệt

| Khái niệm | Bản chất | Code giữ hay bỏ? |
|---|---|---|
| **Prototype** | Code thăm dò, dùng xong vứt | Bỏ |
| **Tracer Bullet** | Code mỏng nhưng *hoàn chỉnh*, là một phần của hệ thống cuối | Giữ |
| **Walking Skeleton** | Lát cắt end-to-end nhỏ nhất, nối tất cả thành phần kiến trúc chính | Giữ |

> Nguồn: *The Pragmatic Programmer* (tracer bullet) và Alistair Cockburn (walking skeleton). Điểm chung: làm một lát cắt mỏng xuyên suốt để xác nhận hướng đi đúng, **trước khi** đổ công sức vào chi tiết.

### 1.2. Áp dụng cho TrangNguyenDigi

Dự án dùng **prototype-first** nhưng theo tinh thần **walking skeleton** — nghĩa là:

> **Logic là tracer code (giữ lại). Data và styling là tạm thời (thay sau).**

Cụ thể, đây là cái gì giữ / cái gì thay qua từng giai đoạn:

| Thành phần | GĐ 1 (Functional) | GĐ 2 (Connected) | GĐ 3 (Polish) |
|---|---|---|---|
| **Logic chấm điểm, flow làm đề** | Viết thật, giữ mãi | Giữ nguyên (chạy server-side) | Giữ nguyên |
| **Data (đề, câu hỏi)** | Hardcode | Thay bằng Supabase | Giữ |
| **Auth** | Fake (user giả) | Thay bằng auth thật | Giữ |
| **Cấu trúc component UI** | Viết tối giản, có cấu trúc | Giữ nguyên | Giữ nguyên |
| **Styling / visual** | Không style (xấu) | Vẫn xấu | Làm đẹp |

> **Khuyến nghị quan trọng:** Ở GĐ 1, đừng viết UI kiểu "dùng xong xóa". Viết component **có cấu trúc đúng nhưng chưa style**. Như vậy GĐ 3 chỉ cần thêm CSS/visual, không phải viết lại từ đầu. Đây là khác biệt giữa *walking skeleton* (giữ xương, đắp thịt) và *prototype* (vứt cả).

---

## 2. Hòa Giải Với Quy Tắc Layer Dependency

> **Đây là điểm dễ gây nhầm lẫn nhất. Agent phải đọc kỹ.**

### 2.1. Mâu thuẫn bề mặt

| Tài liệu | Nói gì |
|---|---|
| `WORKFLOW.md` Mục 1.2 | Build từ **Layer 1 → 2 → 3 → 4** (bottom-up). Layer trên chỉ bắt đầu khi layer dưới `Done`. |
| Roadmap (file này) | Build **Core Loop (Layer 2) trước**, Homepage (Layer 1) sau cùng. |

Thoạt nhìn hai điều này trái ngược.

### 2.2. Giải quyết: "Dependency" là runtime, không phải build order

Quy tắc layer dependency nói về **ai được đọc data của ai lúc chạy** (runtime), **không** quy định thứ tự viết code.

- Layer 2 (Core Loop) *runtime* cần Layer 1 (auth) để biết user là ai.
- Nhưng khi *build prototype*, ta **stub** (làm giả) Layer 1: dùng một `user_id` cố định thay vì auth thật.
- Stub này thỏa mãn dependency — Layer 2 vẫn "có" thứ nó cần, chỉ là phiên bản giả.
- Sang GĐ 2, ta thay stub bằng Layer 1 thật.

```
GĐ 1:   [Layer 2 Core Loop]  ──cần──►  [Layer 1 FAKE/stub]
                                          (user_id = 'test-user')

GĐ 2:   [Layer 2 Core Loop]  ──cần──►  [Layer 1 THẬT]
                                          (Supabase Auth)
```

### 2.3. Quy tắc vẫn được tôn trọng

- Ta **không** làm Layer 2 phụ thuộc Layer 3/4 (đó mới là vi phạm — upward dependency).
- Ta chỉ tạm stub dependency *xuống dưới* (Layer 1), điều này hợp lệ.
- Khi xây layer thật, vẫn theo nguyên tắc: layer dưới phải thật trước khi layer trên dựa vào nó ở production.

> **Tóm lại:** Prototype-first = xây xương sống giá trị nhất (Core Loop) trước bằng cách *giả lập* các dependency, rồi *thay thật dần*. WORKFLOW.md vẫn đúng khi áp dụng cho từng feature trong từng giai đoạn.

---

## 3. Bản Đồ Tổng Thể Các Giai Đoạn

```
┌──────────────────────────────────────────────────────────────┐
│ GĐ 0 — Nền Móng                                              │
│ Scaffold project, deploy "hello production"                  │
│ Validate: pipeline build + deploy có chạy không?            │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ GĐ 1 — Functional Prototype                                  │
│ Core Loop chạy in-memory, UI xấu, data hardcode, auth giả    │
│ Validate: LUỒNG làm đề có đúng logic không?                 │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ GĐ 2 — Connected Prototype                                   │
│ Thay hardcode bằng Supabase thật + auth thật. UI vẫn xấu.    │
│ Validate: HỆ THỐNG có chạy đúng với DB thật không?          │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ GĐ 3 — Polish                                                │
│ 3D homepage, visual language, animation, personalization     │
│ Validate: Sản phẩm có đẹp & dùng được trên mọi device không?│
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
                  [ MVP Core Loop SHIPPED ]
                               │
              ┌────────────────┴────────────────┐
              ▼                                  ▼
   Post-MVP Initiative A:              Post-MVP Initiative B:
   Layer 3 — Analyze & History         Layer 4 — Content Pipeline
   (lặp lại chu kỳ 3 giai đoạn)        (lặp lại chu kỳ 3 giai đoạn)
```

| Giai đoạn | Câu hỏi cần trả lời | Tiêu chí thoát ngắn gọn |
|---|---|---|
| **GĐ 0** | Pipeline build/deploy chạy chưa? | App deploy được lên Vercel |
| **GĐ 1** | Logic làm đề có đúng không? | Chọn đề → làm → nộp → ra điểm đúng (in-memory) |
| **GĐ 2** | Hệ thống chạy với DB thật chưa? | User thật làm đề từ DB, attempt persist, RLS đúng |
| **GĐ 3** | Đẹp và responsive chưa? | Core Loop đẹp, homepage 3D chạy, mobile OK |

---

## 4. GIAI ĐOẠN 0 — Nền Móng

**Mục tiêu:** Dựng khung dự án và xác nhận pipeline deploy hoạt động **sớm nhất có thể** (nguyên tắc walking skeleton: đừng để rủi ro deploy dồn về cuối).

**Validate:** "Code → build → deploy lên Vercel" có thông suốt không?

### Milestone M0.1 — Khởi tạo project

- [ ] Task: Chạy `create-next-app` với TypeScript + Tailwind + App Router
- [ ] Task: Tạo cấu trúc thư mục `SOURCE/` `ASSETS/` `TEXT/` (theo `PROJECT_OVERVIEW.md` Mục 5) (đã có thay đổi một chút)
- [ ] Task: Cài đặt shadcn/ui (init + thêm Button, Input làm mẫu)
- [ ] Task: Cấu hình ESLint + Prettier + TypeScript strict mode

### Milestone M0.2 — Hello Production

- [ ] Task: Tạo một trang `/` trắng hiển thị text "TrangNguyenDigi"
- [ ] Task: `git init` + add remote + push lần đầu (theo `PROJECT_OVERVIEW.md` Mục 7)
- [ ] Task: Kết nối repo với Vercel, deploy thành công, mở được URL public

### Milestone M0.3 — Khung route groups

- [ ] Task: Tạo route group rỗng `(layer1)` `(layer2)` `(layer3)` `(layer4)` với `page.tsx` placeholder
- [ ] Task: Tạo `middleware.ts` skeleton (chưa logic, chỉ pass-through)
- [ ] Task: Tạo `SOURCE/types/`, `SOURCE/lib/`, `SOURCE/hooks/` rỗng có sẵn

**✅ Tiêu chí thoát GĐ 0:**
- App chạy `npm run dev` không lỗi.
- App deploy lên Vercel, mở URL thấy trang trắng.
- Cấu trúc thư mục đầy đủ.

---

## 5. GIAI ĐOẠN 1 — Functional Prototype

**Mục tiêu:** Xác nhận **luồng làm đề đúng logic**. Không style, không DB, không auth thật.

**Validate:** Chọn đề → hiện câu hỏi → chọn đáp án → nộp → ra điểm chính xác?

**Scope:**
- ✅ Trong scope: Core Loop (Layer 2) — chọn đề, làm bài, chấm điểm, xem kết quả
- ❌ Ngoài scope: auth thật, DB, styling, 3D, Layer 3, Layer 4

**Stub gì:** `user_id` cố định = `'test-user'`. Data hardcode trong file.

### Milestone M1.1 — Định nghĩa data model

> Đây là contract dữ liệu, sẽ giữ vào production. Đặt trong `SOURCE/types/`.

- [ ] Task: `types/question.ts` — interface `Question { id, content, choices[], correctAnswer, subject, grade }`
- [ ] Task: `types/exam.ts` — interface `Exam { id, title, questionIds[], durationMinutes }`
- [ ] Task: `types/attempt.ts` — interface `Attempt { examId, answers: Record<questionId, choice>, score? }`

### Milestone M1.2 — Tạo fake data

- [ ] Task: `lib/fake-data/exams.ts` — 2 đề mẫu, mỗi đề 5 câu hỏi, có đáp án đúng
- [ ] Task: Viết hàm `getFakeExams()` và `getFakeExam(id)` trả về data này

### Milestone M1.3 — Màn chọn đề (không style)

> Tham chiếu `UI-LAYER-MAP.md` Mục 4.3 (Exam Browser) — nhưng chỉ làm phần tối giản.

- [ ] Task: Component `ExamBrowser` — dropdown/list liệt kê fake exams
- [ ] Task: Chọn đề → điều hướng tới màn làm bài (truyền examId)

### Milestone M1.4 — Hiển thị câu hỏi (không style)

- [ ] Task: Component `QuestionRenderer` — hiện nội dung câu hỏi + 4 lựa chọn (radio)
- [ ] Task: Component điều hướng câu (next/prev hoặc hiện tất cả câu một lúc)

### Milestone M1.5 — Bắt đáp án (local state)

- [ ] Task: State quản lý đáp án đang chọn (`useReducer` cho exam player state)
- [ ] Task: Lưu đáp án mỗi câu vào state khi user chọn

### Milestone M1.6 — Logic chấm điểm ⭐ (TRACER CODE — giữ mãi)

> Đây là phần quan trọng nhất GĐ 1. Phải **thuần (pure), testable, không phụ thuộc UI**.

- [ ] Task: `lib/scoring/computeScore.ts` — hàm thuần nhận `(exam, answers)` trả về `{ totalScore, perQuestion[], topicBreakdown }`
- [ ] Task: Viết vài test case tay cho `computeScore` (đúng hết, sai hết, bỏ trống)

### Milestone M1.7 — Hiển thị kết quả (không style)

- [ ] Task: Component `ResultView` — hiện điểm tổng + đúng/sai từng câu
- [ ] Task: Nút "Làm lại" reset state

**✅ Tiêu chí thoát GĐ 1:**
- Chọn được 1 trong 2 đề mẫu.
- Trả lời hết câu, nộp bài.
- Điểm hiển thị **chính xác** (verify tay với đáp án).
- Toàn bộ chạy in-memory, không cần internet.

---

## 6. GIAI ĐOẠN 2 — Connected Prototype

**Mục tiêu:** Thay data hardcode bằng Supabase thật, thay auth giả bằng auth thật. **UI vẫn xấu** — chưa đụng tới styling.

**Validate:** Hệ thống có chạy đúng với DB và auth thật không? Backend cần expose endpoint nào?

**Scope:**
- ✅ Trong scope: Supabase setup, schema, RLS, auth thật (Logic L1), wiring Logic L2 vào DB
- ❌ Ngoài scope: styling, 3D, Layer 3, Layer 4 pipeline tự động

### Milestone M2.1 — Supabase project & clients

> Tham chiếu `BACK-END-ARCHITECTURE-MAP.md` Mục 9.2.

- [ ] Task: Tạo Supabase project, chọn region **Singapore** (gần VN nhất, giảm latency)
- [ ] Task: Thêm env vars (`NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY`) vào `.env.local` và Vercel
- [ ] Task: `lib/supabase/client.ts` — browser client
- [ ] Task: `lib/supabase/server.ts` — server client (đọc cookie)
- [ ] Task: `lib/supabase/middleware.ts` — refresh session mỗi request

### Milestone M2.2 — Database schema & RLS

> Mỗi table là một task riêng để dễ kiểm soát. Tham chiếu `BACK-END-ARCHITECTURE-MAP.md` Mục 3 & 4.

- [ ] Task: Table `user_profiles` + RLS (user chỉ đọc/sửa profile của mình)
- [ ] Task: Table `questions` + RLS (mọi authenticated user đọc được câu published)
- [ ] Task: Table `exams` + RLS
- [ ] Task: Table `exam_attempts` + RLS (`user_id = auth.uid()`)
- [ ] Task: Table `attempt_answers` + RLS
- [ ] Task: Table `exam_results` + RLS
- [ ] Task: Tạo view `published_questions` (chỉ câu đủ điều kiện hiển thị)

### Milestone M2.3 — Seed data

- [ ] Task: Viết script đưa 2 đề mẫu (từ M1.2) vào DB thật
- [ ] Task: Verify data hiển thị đúng trong Supabase dashboard

### Milestone M2.4 — Auth thật (Logic Layer 1)

> Đây là lúc Layer 1 logic trở thành thật. UI vẫn tối giản.

- [ ] Task: `signUp(email, password)` Server Action + tạo `user_profiles` row
- [ ] Task: `signIn(email, password)` Server Action
- [ ] Task: `signOut()` Server Action
- [ ] Task: `getCurrentUser()` helper trong Server Component
- [ ] Task: Form login/signup tối giản (chưa style)
- [ ] Task: `middleware.ts` — chặn route chưa auth, redirect `/login`
- [ ] Task: Thay mọi chỗ dùng `'test-user'` (stub GĐ 1) bằng session thật

### Milestone M2.5 — Thay data fetching (Logic L2 reads)

> Lúc này mới rõ backend cần expose gì — như mô tả trong yêu cầu.

- [ ] Task: `listExams(filters)` đọc từ Supabase (thay `getFakeExams`)
- [ ] Task: `getExam(id)` đọc từ Supabase (thay `getFakeExam`)
- [ ] Task: Xóa `lib/fake-data/` sau khi xác nhận DB chạy

### Milestone M2.6 — Persist attempt (Logic L2 writes)

- [ ] Task: `startAttempt(examId)` Server Action — tạo row `exam_attempts`
- [ ] Task: `submitAnswer(attemptId, questionId, answer)` Server Action
- [ ] Task: `submitExam(attemptId)` Server Action — chạy `computeScore` (từ M1.6) **server-side**, lưu `exam_results`
- [ ] Task: `getResult(attemptId)` đọc kết quả từ DB

### Milestone M2.7 — Kiểm tra bảo mật

- [ ] Task: Tạo 2 test user, verify user A không đọc được attempt của user B (RLS hoạt động)
- [ ] Task: Verify không thể gọi Server Action khi chưa đăng nhập

**✅ Tiêu chí thoát GĐ 2:**
- Test user đăng ký/đăng nhập được.
- Làm đề lấy từ DB thật.
- Attempt + điểm persist trong Supabase (reload vẫn còn).
- RLS chặn đúng giữa 2 user.

---

## 7. GIAI ĐOẠN 3 — Polish

**Mục tiêu:** Làm đẹp. Xây visual language thật cho Layer 1 & 2, dựng homepage 3D, thêm animation và personalization.

**Validate:** Sản phẩm có đẹp, mượt, và chạy tốt trên mọi device (đặc biệt Android tầm trung) không?

**Scope:**
- ✅ Trong scope: visual language L1 + L2, homepage 3D, mobile fallback, personalization, transitions
- ❌ Ngoài scope: Layer 3, Layer 4 (để post-MVP)

### Milestone M3.1 — Visual language Layer 2 (Focused)

> Tham chiếu `UI-LAYER-MAP.md` Mục 1 (visual language) & Mục 4.

- [ ] Task: Style `ExamBrowser` + `ExamCard` + `ExamFilters` theo phong cách tối giản
- [ ] Task: Style `QuestionRenderer` + `AnswerChoice` (focus mode, không distraction)
- [ ] Task: Style `ExamTimer` + `QuestionPagination` + `FlagButton`
- [ ] Task: Style `ScoreCard` + `TopicBreakdown` ở Result screen
- [ ] Task: Thêm markdown + LaTeX rendering cho nội dung câu hỏi

### Milestone M3.2 — Responsive Layer 2

> Tham chiếu `UI-LAYER-MAP.md` Mục 8.

- [ ] Task: Layout mobile cho Exam Player (1 câu/màn hình, swipe chuyển câu)
- [ ] Task: Kiểm tra breakpoints (mobile < 640, tablet, desktop)
- [ ] Task: Test trên thiết bị Android tầm trung thật

### Milestone M3.3 — Homepage 3D Desktop (Layer 1)

> Phần phức tạp nhất — chia nhỏ tối đa. Tham chiếu `UI-LAYER-MAP.md` Mục 3.2.

- [ ] Task: Cài `@react-three/fiber` + `@react-three/drei`, dựng `<Canvas>` rỗng
- [ ] Task: Thêm chiếc bàn gỗ (geometry hoặc model đơn giản) + lighting cơ bản
- [ ] Task: Load Mac model `.glb` từ `ASSETS/models/`
- [ ] Task: Camera drift nhẹ (autoRotate giới hạn)
- [ ] Task: Raycasting — detect hover trên Mac → tooltip "Open Workspace →"
- [ ] Task: Raycasting — detect click trên Mac → GSAP fade → `router.push('/exams')`
- [ ] Task: Lazy load Three.js (chỉ load khi desktop + WebGL khả dụng)

### Milestone M3.4 — Homepage Mobile Fallback

> Tham chiếu `UI-LAYER-MAP.md` Mục 3.3.

- [ ] Task: Static image Mac + CSS Parallax 2.5D
- [ ] Task: Gyroscope API (nếu device cho phép)
- [ ] Task: CTA button rõ ràng "Vào học →"
- [ ] Task: Đảm bảo Three.js KHÔNG load trên mobile

### Milestone M3.5 — Personalization

> Tham chiếu `UI-LAYER-MAP.md` Mục 3, `BACK-END-ARCHITECTURE-MAP.md` Mục 3.

- [ ] Task: Table `user_preferences` + RLS (nếu chưa có)
- [ ] Task: Model picker — đổi model máy tính (từ store nội bộ curated)
- [ ] Task: Sticky notes — tạo/sửa/xóa, lưu theo account
- [ ] Task: Sticky note hiển thị trên homepage (HTML overlay, không trong canvas — để SEO)

### Milestone M3.6 — Transitions & SEO

- [ ] Task: GSAP fade transition giữa các layer (300ms)
- [ ] Task: Meta tags, Open Graph, title cho mọi route
- [ ] Task: Đảm bảo navbar/footer HTML gánh crawlable text (canvas không index)
- [ ] Task: Chạy Lighthouse — verify Performance ≥ 85 mobile (theo `PROJECT_OVERVIEW.md` Mục 8)

**✅ Tiêu chí thoát GĐ 3:**
- Core Loop đẹp, đúng visual language tối giản.
- Homepage 3D chạy mượt trên desktop, fallback 2.5D chạy tốt trên mobile.
- Personalization cơ bản hoạt động.
- Lighthouse Performance mobile ≥ 85.

---

## 8. Phạm Vi MVP & Các Initiative Hậu MVP

### 8.1. MVP = Giai đoạn 0 → 3

Khi hoàn thành GĐ 3, MVP đã ship: **một học sinh có thể đăng nhập và luyện đề (có sẵn trong DB) với giao diện đẹp, chạy tốt trên mọi device.**

### 8.2. Hậu MVP — mỗi initiative lặp lại chu kỳ 3 giai đoạn của riêng nó

| Initiative | Layer | Nội dung | Ghi chú |
|---|---|---|---|
| **A — Analyze & History** | Layer 3 | Dashboard, lịch sử, phân tích điểm yếu, gợi ý | Đọc data attempt đã persist từ GĐ 2 |
| **B — Content Pipeline** | Layer 4 | Import đề tự động (PDF/Word/ảnh), confidence scoring, version control, quarantine | Phức tạp nhất; trước MVP chỉ seed tay |

> Mỗi initiative chạy lại đúng 3 giai đoạn: Functional (logic + fake) → Connected (DB thật) → Polish (visual language riêng của layer đó). Không gộp A và B làm cùng lúc.

### 8.3. Vì sao Layer 3 & 4 để sau?

- **Layer 3** cần dữ liệu attempt tích lũy — chỉ có ý nghĩa sau khi Core Loop chạy thật một thời gian.
- **Layer 4** (pipeline tự động) là phần phức tạp nhất; trước MVP, seed đề bằng tay (GĐ 2 M2.3) là đủ. Tự động hóa khi lượng đề tăng.

---

## 9. Roadmap Kết Nối Với WORKFLOW Như Thế Nào

```
PROJECT_ROADMAP.md                     WORKFLOW.md
─────────────────                     ───────────
Giai đoạn → Milestone → Task           C&D → Coding → Updating → Testing → Git
                          │                ▲
                          │                │
                          └──── là một ────┘
                               TE1
```

- Engineer lấy **một task** từ roadmap, diễn đạt thành prompt → đó là **TE1**.
- Workflow xử lý task đó qua 5 bước.
- Hoàn thành → quay lại roadmap lấy task tiếp theo.

**Ví dụ:**
> Task M1.6 "Logic chấm điểm" → Engineer gửi TE1: *"Làm hàm computeScore thuần nhận exam và answers, trả về điểm tổng và breakdown theo chủ đề. Đây là Layer 2, Logic Module."*
> → Agent chạy C&D → Coding → … → Git.

> **Lưu ý quan trọng cho agent:** Khi nhận một TE1, nếu task thuộc giai đoạn prototype (GĐ 1), agent **không** tự ý thêm DB, auth, hay styling — vì roadmap quy định những thứ đó thuộc giai đoạn sau. Tôn trọng scope của từng giai đoạn.

---

## 10. Bảng Theo Dõi Tiến Độ Giai Đoạn

```
GĐ 0 — Nền Móng              : [ ] Not Started / [ ] In Progress / [ ] Done
GĐ 1 — Functional Prototype  : [ ] Not Started
GĐ 2 — Connected Prototype   : [ ] Not Started
GĐ 3 — Polish (MVP ship)     : [ ] Not Started
─────────────────────────────
Post-MVP A — Layer 3         : [ ] Not Started
Post-MVP B — Layer 4         : [ ] Not Started
```

Cập nhật bảng này sau khi mỗi giai đoạn đạt tiêu chí thoát. Đây là bức tranh macro, bổ sung cho bảng tiến độ layer trong `WORKFLOW.md` Mục 6 (bức tranh per-feature).
