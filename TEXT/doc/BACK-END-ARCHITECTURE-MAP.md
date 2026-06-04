# BACK-END ARCHITECTURE MAP — TrangNguyenDigi

> Tài liệu này mô tả **luồng logic chảy bên trong website**: 4 UI Layer giao tiếp với nhau qua 4 Logic Layer tương ứng như thế nào, dữ liệu di chuyển ra sao, và mỗi function thuộc về layer nào.
> Đọc sau `PROJECT_OVERVIEW.md`, trước khi viết bất kỳ Server Action hay Edge Function nào.

---

## 1. Mô Hình Tổng Thể — Dual-Layer Mirror

Mỗi tầng của hệ thống gồm **hai mặt** ghép đôi:

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Layer (View)                          │  ← chạy trên trình duyệt
├─────────────────────────────────────────────────────────────┤
│                  Logic Layer (Server)                       │  ← chạy trên Vercel/Supabase
└─────────────────────────────────────────────────────────────┘
```

- **UI Layer** = giao diện người dùng (React components, 3D scene, forms…)
- **Logic Layer** = business logic + data access (Server Actions, Edge Functions, RLS policies, DB tables)

UI Layer **không bao giờ** gọi trực tiếp database. Mọi truy vấn đi qua Logic Layer cùng tầng.

### Sơ đồ tổng quát

```
┌──────────────────────┐         ┌──────────────────────┐
│ UI L4: CMS / Editor  │ ◄────► │ Logic L4: Content    │  Content Infrastructure
└──────────────────────┘         └──────────────────────┘
           ▲                                ▲
           │                                │
┌──────────────────────┐         ┌──────────────────────┐
│ UI L3: Charts        │ ◄────► │ Logic L3: Reflection │  Analytics & History
└──────────────────────┘         └──────────────────────┘
           ▲                                ▲
           │                                │
┌──────────────────────┐         ┌──────────────────────┐
│ UI L2: Exam Player   │ ◄────► │ Logic L2: Core Loop  │  Exam Engine
└──────────────────────┘         └──────────────────────┘
           ▲                                ▲
           │                                │
┌──────────────────────┐         ┌──────────────────────┐
│ UI L1: 3D Homepage   │ ◄────► │ Logic L1: Identity   │  Auth & Session
└──────────────────────┘         └──────────────────────┘
                                            ▲
                                            │
                                  ┌──────────────────────┐
                                  │ Supabase (DB + Auth) │
                                  └──────────────────────┘
```

---

## 2. Quy Tắc Giao Tiếp Giữa Các Layer

Có **3 hướng** dữ liệu chảy. Mỗi hướng có luật riêng.

### 2.1. Vertical (UI ↔ Logic cùng tầng)

UI gọi Logic qua một trong các kênh sau:

| Kênh | Khi nào dùng | Vị trí |
|---|---|---|
| **Server Action** | Mutation (tạo/sửa/xóa), form submit | `SOURCE/app/(layerN)/actions.ts` |
| **Server Component fetch** | Đọc data lần đầu render | Trong `page.tsx` Server Component |
| **Client-side Supabase SDK** | Realtime subscription, optimistic UI | `SOURCE/lib/supabase/client.ts` |
| **Route Handler** (`route.ts`) | Webhook, API thuần (hiếm) | `SOURCE/app/api/...` |

### 2.2. Downward (Logic Layer cao đọc từ Logic Layer thấp)

Logic Layer cao **được phép** đọc trực tiếp data của layer thấp hơn:

```
Logic L4  ──reads──►  Logic L1   (đọc user role để authorize editor)
Logic L3  ──reads──►  Logic L2   (đọc attempts để tính analytics)
Logic L3  ──reads──►  Logic L1   (lấy user_id)
Logic L2  ──reads──►  Logic L4   (đọc published questions)
Logic L2  ──reads──►  Logic L1   (verify session)
```

**Cấm:** Layer thấp đọc trực tiếp data của layer cao (ví dụ: L1 không biết gì về exam attempts).

### 2.3. Upward (Layer thấp nhận event từ layer cao)

Khi layer thấp cần phản ứng với hành vi ở layer cao, dùng **event-driven**, không phải direct call:

```
Logic L2  ──emits──►  exam.completed  ──►  Logic L3 (cập nhật analytics)
                                       ──►  Logic L4 (cập nhật confidence score)
Logic L1  ──emits──►  user.signed_up  ──►  Logic L2 (tạo default state)
```

**Cơ chế triển khai event:**
- **Database triggers** cho event nội bộ Supabase (đơn giản, latency thấp)
- **Supabase Realtime** + **Edge Functions** cho event cross-region
- Mỗi event có schema cố định trong `SOURCE/types/events.ts`

> **Nguyên tắc bất biến:** Logic Layer thấp **không bao giờ** import code từ Logic Layer cao. Layer thấp chỉ biết về event mà layer cao publish, không biết ai đang lắng nghe.

---

## 3. Logic Layer 1 — Identity & Session

**Mục đích:** Quản lý danh tính người dùng và trạng thái cá nhân hóa.

### 3.1. Tables sở hữu

| Table | Mô tả | Layer khác có read? |
|---|---|---|
| `auth.users` | Quản lý bởi Supabase Auth | L2, L3, L4 (read-only) |
| `user_profiles` | display_name, avatar, role, created_at | L2, L3, L4 (read) |
| `user_preferences` | model máy tính, sticky notes, theme | Không (L1-only) |

### 3.2. Functions

| Function | Loại | Mô tả |
|---|---|---|
| `signUp(email, password)` | Server Action | Đăng ký + tạo `user_profiles` row |
| `signIn(email, password)` | Server Action | Đăng nhập email/password |
| `signInWithGoogle()` | Server Action | OAuth flow |
| `signOut()` | Server Action | Hủy session |
| `updatePreferences(prefs)` | Server Action | Cập nhật personalization |
| `getCurrentUser()` | Server Component fetch | Lấy session hiện tại |

### 3.3. Events publish

| Event | Payload | Mục đích |
|---|---|---|
| `user.signed_up` | `{ user_id, email, created_at }` | Layer khác setup default state |
| `user.signed_in` | `{ user_id, session_id }` | Logging, analytics |
| `user.preferences_changed` | `{ user_id, changed_keys[] }` | Sync UI L1 (sticky notes) |

### 3.4. Phụ thuộc layer khác

Không có. **Layer 1 là tầng nền — không phụ thuộc gì cao hơn.**

---

## 4. Logic Layer 2 — Core Loop (Exam Engine)

**Mục đích:** Vận hành toàn bộ trải nghiệm làm đề — từ chọn đề đến nộp bài và xem kết quả.

### 4.1. Tables sở hữu

| Table | Mô tả | Layer khác có read? |
|---|---|---|
| `exam_attempts` | session làm đề: user_id, exam_id, start_at, submit_at, status | L3 (read) |
| `attempt_answers` | từng câu trả lời: attempt_id, question_id, answer, flagged | L3 (read), L4 (event) |
| `exam_results` | điểm tổng + breakdown theo chủ đề | L3 (read) |

### 4.2. Functions

| Function | Loại | Mô tả |
|---|---|---|
| `listExams(filters)` | Server Component fetch | Browse/filter đề từ L4 |
| `startAttempt(exam_id)` | Server Action | Tạo `exam_attempts` row mới |
| `submitAnswer(attempt_id, question_id, answer)` | Server Action | Lưu/cập nhật câu trả lời |
| `flagQuestion(attempt_id, question_id)` | Server Action | Đánh dấu câu để xem lại |
| `submitExam(attempt_id)` | Server Action | Khóa attempt, tính điểm, emit event |
| `getResult(attempt_id)` | Server Component fetch | Trả về điểm + đáp án + breakdown |

### 4.3. Events publish

| Event | Payload | Subscriber |
|---|---|---|
| `attempt.started` | `{ attempt_id, user_id, exam_id }` | L3 (track) |
| `attempt.submitted` | `{ attempt_id, score, answers[] }` | L3, L4 |
| `exam.completed` | `{ user_id, exam_id, score, weak_topics[] }` | L3 |

### 4.4. Phụ thuộc layer khác

| Phụ thuộc | Cách lấy |
|---|---|
| Session từ L1 | RLS policy auto-check `auth.uid()` |
| Published questions từ L4 | Read view `published_questions` (chỉ thấy question có `confidence_score ≥ threshold` và không bị quarantine) |

---

## 5. Logic Layer 3 — Reflection (Analytics & History)

**Mục đích:** Biến raw exam attempts thành insight có giá trị cho user.

### 5.1. Tables sở hữu

| Table | Mô tả | Cách cập nhật |
|---|---|---|
| `user_analytics` | aggregate: tổng số đề, avg score, time spent | Trigger từ `exam.completed` |
| `weakness_profile` | điểm yếu theo chủ đề, môn, độ khó | Recompute sau mỗi attempt |
| `recommendations` | gợi ý đề tiếp theo | Recompute định kỳ |

### 5.2. Functions

| Function | Loại | Mô tả |
|---|---|---|
| `getHistory(user_id, filters)` | Server Component fetch | Lịch sử làm đề có pagination |
| `getWeaknessAnalysis(user_id)` | Server Component fetch | Heatmap điểm yếu |
| `getRecommendations(user_id)` | Server Component fetch | Top N đề được gợi ý |
| `recomputeAnalytics(user_id)` | Edge Function | Chạy nền sau event L2 |

### 5.3. Events publish

| Event | Payload | Subscriber |
|---|---|---|
| `analytics.updated` | `{ user_id, updated_at }` | UI L3 (invalidate cache) |

### 5.4. Phụ thuộc layer khác

| Phụ thuộc | Cách lấy |
|---|---|
| Session từ L1 | RLS |
| Attempts + answers từ L2 | Read trực tiếp (downward dependency hợp lệ) |
| Topic metadata từ L4 | Join với `questions` để biết chủ đề |

> **Lưu ý:** Layer 3 **chỉ đọc**, không ghi vào table của L2 hay L4. Mọi sự khôn ngoan của L3 đến từ aggregation, không phải mutation.

---

## 6. Logic Layer 4 — Content Infrastructure

**Mục đích:** Pipeline nhập đề, version control, kiểm soát chất lượng tự động.

### 6.1. Tables sở hữu

| Table | Mô tả |
|---|---|
| `questions` | Câu hỏi: nội dung, đáp án, metadata (môn/năm/cấp/nguồn) |
| `question_versions` | Lịch sử mọi lần sửa câu hỏi (ai sửa, sửa gì) |
| `exams` | Tập hợp câu hỏi thành đề |
| `confidence_scores` | Điểm tin cậy hiện tại của mỗi câu (0.0 – 1.0) |
| `error_reports` | User báo lỗi câu hỏi |
| `quarantine_queue` | Câu bị tạm khóa chờ admin review |
| `ground_truth_questions` | Đề chính thức Bộ GD&ĐT — confidence khóa cứng |

### 6.2. Functions

| Function | Loại | Mô tả |
|---|---|---|
| `importQuestionBatch(file)` | Edge Function | Pipeline: parse → normalize → dedup → publish |
| `updateQuestion(id, changes)` | Server Action | Sửa câu + tạo version record |
| `reportError(question_id, reason)` | Server Action | User báo lỗi → giảm confidence |
| `recalculateConfidence(question_id)` | Edge Function | Chạy mỗi lần có signal mới |
| `quarantineQuestion(id)` | DB trigger | Tự động khi confidence < threshold |
| `reviewQuarantine(id, decision)` | Server Action | Admin duyệt batch quarantine |

### 6.3. Pipeline nhúng đề (quan trọng nhất ở L4)

```
[Raw input: PDF / Word / ảnh / nhập tay]
        │
        ▼
┌──────────────────┐
│ 1. Parse         │  Edge Function: parseQuestion()
│   & Extract      │  Output: { text, choices, answer, source_file }
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ 2. Normalize     │  Chuẩn hóa định dạng (markdown, latex)
│   format         │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ 3. Attach        │  Gắn metadata: subject, year, grade, source
│   metadata       │  Phân biệt ground_truth vs user_submitted
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ 4. Dedup check   │  Embedding similarity check với corpus hiện có
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ 5. Initial score │  ground_truth → 1.0
│                  │  user_submitted → 0.7 (default)
└──────────────────┘
        │
        ▼
[Published → L2 có thể dùng]
```

### 6.4. Events publish

| Event | Payload | Subscriber |
|---|---|---|
| `question.published` | `{ question_id, subject, grade }` | L2 (refresh cache) |
| `question.quarantined` | `{ question_id, reason }` | UI L4 admin |
| `confidence.recalculated` | `{ question_id, old, new }` | Internal logging |

### 6.5. Events subscribe (feedback loop)

| Event from | Hành động khi nhận |
|---|---|
| L2 `attempt.submitted` | Phân tích: câu nào hay sai? hay bị bỏ qua? → update confidence |
| L2 `attempt.submitted` | Nếu user flag câu này nhiều lần → tăng weight error |

> **Quy tắc Ground Truth:** Câu hỏi trong `ground_truth_questions` có confidence khóa ở 1.0. Bất kể user signal thế nào, confidence không bị kéo xuống. Đây là **firewall chống feedback loop sai**.

---

## 7. Luồng Logic Thực Tế — Sequence Diagrams

### 7.1. Journey: User đăng nhập rồi làm đề

```
User           UI L1        Logic L1      UI L2       Logic L2      Logic L4
 │              │             │             │            │             │
 │ click Mac    │             │             │            │             │
 ├────────────►│              |             │             │             │
 │              │ signIn()    │             │            │             │
 │              ├───────────►│             │            │             │
 │              │             │ verify JWT  │            │             │
 │              │ session OK  │             │            │             │
 │              │◄───────────┤             │            │             │
 │              │ navigate to L2            │            │             │
 │              ├──────────────────────────►│           │             │
 │              │             │             │ listExams()│             │
 │              │             │             ├──────────►│             │
 │              │             │             │            │ read       │
 │              │             │             │            │ published_ │
 │              │             │             │            │ questions  │
 │              │             │             │            ├───────────►│
 │              │             │             │            │◄───────────┤
 │              │             │             │ exams list │             │
 │              │             │             │◄──────────┤              │
 │              │             │             │            │             │
 │ pick exam    │             │             │            │             │
 ├──────────────────────────────────────────►│           │             │
 │              │             │             │ startAttempt(exam_id)    │
 │              │             │             ├──────────►│              │
 │              │             │             │ attempt_id │             │
 │              │             │             │◄──────────┤              │
 │              │             │             │            │             │
 │ submit ans   │             │             │            │             │
 ├──────────────────────────────────────────►│           │             │
 │              │             │             │ submitAnswer(...)        │
 │              │             │             ├──────────►│              │
 │              │             │             │   (loop)   │             │
 │              │             │             │            │             │
 │ submit exam  │             │             │            │             │
 ├──────────────────────────────────────────►│           │             │
 │              │             │             │ submitExam(attempt_id)   │
 │              │             │             ├──────────►│              │
 │              │             │             │            │ compute     │
 │              │             │             │            │ score       │
 │              │             │             │            │             │
 │              │             │             │            │ EMIT:       │
 │              │             │             │            │ exam.       │
 │              │             │             │            │ completed   │
 │              │             │             │            ├──►Logic L3  │
 │              │             │             │            │   (analytics│
 │              │             │             │            │    update)  │
 │              │             │             │            ├──►Logic L4  │
 │              │             │             │            │   (confidence
 │              │             │             │            │    update)  │
 │              │             │             │ result     │             │
 │              │             │             │◄──────────┤|             │
```

### 7.2. Journey: User xem lịch sử và gợi ý ôn tập

```
User           UI L3        Logic L3      Logic L2      Logic L4
 │              │             │             │             │
 │ open L3      │             │             │             │
 ├────────────►│             │             │             │
 │              │ getHistory()│             │             │
 │              ├───────────►│             │             │
 │              │             │ query       │             │
 │              │             │ exam_attempts            │
 │              │             ├───────────►│             │
 │              │             │◄───────────┤             │
 │              │             │             │             │
 │              │             │ join questions metadata  │
 │              │             ├──────────────────────────►│
 │              │             │◄──────────────────────────┤
 │              │             │             │             │
 │              │ history[]   │             │             │
 │              │◄───────────┤             │             │
 │              │             │             │             │
 │              │ getRecommendations()      │             │
 │              ├───────────►│             │             │
 │              │             │ read weakness_profile     │
 │              │             │ + suggest from published_ │
 │              │             │ questions                 │
 │              │             ├──────────────────────────►│
 │              │             │◄──────────────────────────┤
 │              │ recs[]      │             │             │
 │              │◄───────────┤             │             │
```

### 7.3. Journey: Feedback loop cải thiện ngân hàng đề

```
[exam.completed event]
        │
        ▼
   Logic L4 subscriber
        │
        ├─► Đếm: trong batch này, câu X có bao nhiêu user trả lời sai?
        ├─► Câu X có bị flag nhiều không?
        ├─► Có error_report nào về câu X không?
        │
        ▼
   recalculateConfidence(question_id = X)
        │
        ├─► IF question.is_ground_truth → KHÔNG ĐỔI (lock at 1.0)
        ├─► ELSE: confidence_new = f(error_rate, flag_rate, report_count)
        │
        ▼
   IF confidence_new < THRESHOLD (e.g. 0.5)
        │
        ▼
   EMIT question.quarantined
        │
        ├─► DB trigger: remove from published_questions view
        ├─► UI L4 admin: hiển thị trong review batch
```

---

## 8. Auth Context & Security Model

### 8.1. Cách session được truyền qua các layer

Mọi function trong mọi Logic Layer **không nhận `user_id` làm tham số**. Thay vào đó:

1. Browser gửi cookie chứa Supabase JWT trong mỗi request.
2. Server Action / Server Component khởi tạo Supabase server client từ cookie.
3. Supabase client tự inject `auth.uid()` vào mọi query.
4. RLS policy ở DB level lọc row theo `auth.uid()`.

**Hậu quả an toàn:** Một function ở Logic L3 không thể "đọc trộm" data của user khác kể cả khi developer viết sai SQL — RLS chặn ở tầng DB.

### 8.2. Authorization theo layer

| Layer | Yêu cầu auth | Role check |
|---|---|---|
| Logic L1 | Một số function công khai (signUp, signIn) | — |
| Logic L2 | Authenticated user | role: `student` (default) |
| Logic L3 | Authenticated user, chỉ xem data của chính mình | RLS: `user_id = auth.uid()` |
| Logic L4 (read public) | Authenticated user | — |
| Logic L4 (write/import) | Admin | role: `admin` hoặc `editor` |

### 8.3. Ranh giới giữa các layer được enforce ở đâu?

| Cấp độ | Cơ chế | Ví dụ |
|---|---|---|
| Code | Folder structure + lint rules | L1 không được import từ `app/(layer2)` |
| Runtime | RLS policies | L3 không thể write vào `exam_attempts` |
| Network | Edge Function permissions | Chỉ admin Edge Function được gọi `recalculateConfidence` |

---

## 9. Implementation Map — Cái Gì Nằm Ở Đâu

### 9.1. Mapping function → file location

| Logic Layer | Server Actions | Edge Functions | DB |
|---|---|---|---|
| L1 | `SOURCE/app/(layer1)/actions.ts` | — | `auth.*`, `user_*` tables |
| L2 | `SOURCE/app/(layer2)/actions.ts` | — | `exam_*` tables |
| L3 | `SOURCE/app/(layer3)/actions.ts` | `supabase/functions/recompute-analytics/` | `user_analytics`, `weakness_profile` |
| L4 | `SOURCE/app/(layer4)/actions.ts` | `supabase/functions/import-question/`, `supabase/functions/recalc-confidence/` | `questions`, `question_versions`, `confidence_scores` |

### 9.2. Shared infrastructure

```
SOURCE/lib/
  ├── supabase/
  │   ├── client.ts       # Browser client (use 'use client' components)
  │   ├── server.ts       # Server client (Server Actions, Server Components)
  │   └── middleware.ts   # Refresh session on every request
  ├── events/
  │   ├── types.ts        # Event schemas (shared by all layers)
  │   └── publish.ts      # Publish helper (wraps DB triggers / Realtime)
  └── auth/
      └── policies.ts     # Helper kiểm tra role
```

### 9.3. Nguyên tắc đặt code

| Nguyên tắc | Áp dụng |
|---|---|
| **Vertical slice** | Mỗi feature gom hết UI + action + types vào một folder `app/(layerN)/<feature>/` |
| **No cross-layer import** | File trong `(layer2)` không được import từ `(layer3)` hoặc `(layer4)` |
| **Shared via `lib/`** | Code dùng chung được trích ra `lib/` |
| **Events for upward** | Layer thấp không gọi function của layer cao — dùng event |

---

## 10. Checklist Cho Agent Khi Triển Khai Một Feature

Mỗi khi nhận TE1, agent phải xác định:

```
[ ] Feature này thuộc UI Layer nào? (1/2/3/4)
[ ] Logic Layer tương ứng cần thêm/sửa gì?
[ ] Có tạo bảng DB mới không? Nếu có:
    [ ] Đã viết RLS policy chưa?
    [ ] Layer khác có cần read không? Tạo view hay column-level grant?
[ ] Có cần publish event không?
    [ ] Schema event đã thêm vào SOURCE/lib/events/types.ts chưa?
    [ ] Subscriber ở layer nào? Trigger hay Edge Function?
[ ] Function này gọi từ Client hay Server?
    [ ] Mutation → Server Action
    [ ] Initial fetch → Server Component
    [ ] Realtime → Client + Supabase Realtime
[ ] Test thủ công với 2 user khác nhau — RLS có chặn đúng không?
```

> Checklist này là output bắt buộc của bước C&D trong `WORKFLOW.md`.
