# UI LAYER MAP — TrangNguyenDigi

***Lưu ý***: Một số example về UI sau đây có thể chỉ được dùng cho phần thiết kế core (dùng tạm). Không phải desgin chính thức của project. Engineer có thể gửi template khác cho agent. 

> **Blueprint của giao diện người dùng.** Tài liệu này mô tả website nhìn từ phía user: 4 UI Layer chứa những gì, điều hướng giữa các layer ra sao, component nào nằm ở đâu.
> Cặp song sinh với `BACK-END-ARCHITECTURE-MAP.md` (mô tả Logic Layer). Đọc cả hai để có bức tranh toàn cảnh.

---

## 1. Mô Hình 4 UI Layer

Website được tổ chức thành **4 UI Layer** xếp theo hành trình user. Mỗi layer có một mục đích duy nhất và một visual language riêng biệt.

```
┌─────────────────────────────────────────────────────┐
│ Layer 4 — Content Infrastructure  (admin only)      │
│ CMS UI: nhập đề, version control, duyệt báo cáo lỗi │
├─────────────────────────────────────────────────────┤
│ Layer 3 — Analyze & History                         │
│ Dashboard: lịch sử làm bài, phân tích điểm yếu      │
├─────────────────────────────────────────────────────┤
│ Layer 2 — Core Loop                                 │
│ Exam Player: chọn đề → làm → nộp → xem kết quả      │
├─────────────────────────────────────────────────────┤
│ Layer 1 — Account & Entry                           │
│ Homepage 3D, đăng nhập, personalization             │
└─────────────────────────────────────────────────────┘
```

### Visual Language

Mỗi layer có ngôn ngữ thị giác riêng — user nhận biết mình đang ở đâu mà không cần breadcrumb.

| Layer | Visual Language | Ẩn dụ |
|---|---|---|
| **L1 — Account & Entry** | Spatial / 3D — chiếc bàn gỗ, máy Mac, ánh sáng vật lý | "Bước vào không gian học" |
| **L2 — Core Loop** | Focused / tối giản — như tờ giấy trắng, không distraction | "Tập trung vào đề" |
| **L3 — Analyze & History** | Analytical / data-rich — charts, heatmap, số liệu | "Soi gương để học" |
| **L4 — Content Infrastructure** | Structured / editorial — table, form, version diff | "Bảng điều khiển kho đề" |

> **Quy tắc:** Không bao giờ trộn visual language. User vào Layer 2 thấy 3D mơ hồ là sai. User vào Layer 1 thấy form login phẳng cũng sai.

---

## 2. Quy Tắc Cấu Trúc

### 2.1. Phân cấp

```
UI Layer
 └── UI Module                 ← một feature hoặc một screen lớn
      └── Component             ← đơn vị render
           └── Task             ← việc cụ thể agent triển khai
```

> **Logic Module song hành:** Mỗi UI Module thường có Logic Module tương ứng (Server Action, query, state). Logic Module được mô tả trong `BACK-END-ARCHITECTURE-MAP.md`. WORKFLOW.md operates on cả hai loại module.

### 2.2. Dependency giữa các Layer

- Layer cao **được phép** dùng component và data từ layer thấp.
- Layer thấp **không bao giờ** import từ layer cao.
- Mỗi layer chỉ bắt đầu khi toàn bộ task của layer liền dưới đã `Done`.

```
L4 ──► có thể dùng ──► L3 ──► L2 ──► L1
                                      │
L1 ──── KHÔNG ─── được dùng ─────────┘
```

### 2.3. Component sharing

Không phải mọi thứ đều thuộc một layer. Có 3 cấp độ component:

| Cấp | Vị trí | Phạm vi sử dụng |
|---|---|---|
| **Primitive** | `SOURCE/components/ui/` | Mọi layer (shadcn/ui: Button, Input, Dialog…) |
| **Shared feature** | `SOURCE/components/shared/` | Dùng ở ≥2 layer (UserAvatar, Toast, Loading) |
| **Layer-specific** | `SOURCE/app/(layerN)/_components/` | Chỉ dùng trong layer đó |

---

## 3. UI Layer 1 — Account & Entry

**Mục đích:** Điểm vào hệ thống. Tạo first impression. Quản lý danh tính.

### 3.1. Screens

| Screen | Route | Mô tả |
|---|---|---|
| **Homepage 3D** | `/` | Scene chiếc bàn + máy Mac. Click Mac → vào Layer 2 |
| **Login** | `/login` | Email/password + Google OAuth |
| **Signup** | `/signup` | Đăng ký tài khoản mới |
| **Personalization** | `/me/customize` | Đổi model máy tính, quản lý sticky notes |

### 3.2. Homepage 3D — chi tiết kỹ thuật

```
┌────────────────────────────────────────────────────┐
│                                                    │
│              [ Camera drift nhẹ ]                  │
│                                                    │
│           ╔═══════════════════════╗                │
│           ║                       ║                │
│           ║      [ Mac model ]    ║                │
│           ║      ▲ click here     ║                │
│           ║                       ║                │
│           ╚═══════════════════════╝                │
│              [ Wooden desk surface ]               │
│                                                    │
│           [Sticky notes scattered]                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

| Element | Implementation |
|---|---|
| 3D Scene | Three.js Canvas (`<Canvas>` từ `@react-three/fiber`) |
| Mac model | `.glb` từ `ASSETS/models/`, raycasting cho click/hover |
| Camera | OrbitControls disabled, autoRotate drift nhẹ |
| Lighting | DirectionalLight + AmbientLight + soft shadow |
| Hover state | Tooltip "Open Workspace →" + subtle pulse trên Mac |
| Click | GSAP fade-out → router.push('/exams') |
| Sticky notes | HTML overlay tuyệt đối, không trong canvas (để SEO index) |

### 3.3. Mobile Fallback (< 768px)

Three.js bị **disable hoàn toàn** trên mobile. Thay vào đó:

```
┌──────────────────┐
│                  │
│   [Mac image]    │   ← static PNG/WebP
│   parallax       │
│   on scroll      │
│                  │
│  Sticky notes    │   ← absolute positioned divs
│                  │
│  [Vào học →]     │   ← rõ ràng CTA button
│                  │
└──────────────────┘
```

| Element | Mobile implementation |
|---|---|
| Background | CSS Parallax 2.5D + Gyroscope API (nếu cho phép) |
| Mac | Static image, không 3D |
| CTA | Button rõ ràng "Vào học →" (không phụ thuộc affordance ngầm) |
| Sticky notes | Vẫn có, dạng HTML overlay |

### 3.4. UI Modules

- **HomepageScene** (desktop): Canvas, Mac model, lighting setup
- **HomepageMobile**: Static image + parallax
- **AuthForms**: Login form, Signup form, OAuth buttons
- **PersonalizationPanel**: Model picker, sticky notes editor

### 3.5. Key components

```
app/(layer1)/
  ├── page.tsx                    # Homepage (chọn desktop/mobile)
  ├── login/page.tsx
  ├── signup/page.tsx
  ├── me/customize/page.tsx
  └── _components/
      ├── HomepageScene.tsx       # 3D scene (client component)
      ├── HomepageMobile.tsx      # 2.5D fallback
      ├── MacModel.tsx            # Three.js mesh + raycasting
      ├── StickyNote.tsx          # HTML overlay
      ├── LoginForm.tsx
      ├── SignupForm.tsx
      └── GoogleOAuthButton.tsx
```

---

## 4. UI Layer 2 — Core Loop

**Mục đích:** Nơi user thực sự làm đề. 90% thời gian user ở đây. Tối giản hết mức.

### 4.1. Screens

| Screen | Route | Mô tả |
|---|---|---|
| **Exam Browser** | `/exams` | List/filter/search đề thi |
| **Exam Detail** | `/exams/[id]` | Xem thông tin đề trước khi bắt đầu |
| **Exam Player** | `/exams/[id]/attempt/[attemptId]` | Giao diện làm bài (focus mode) |
| **Result** | `/exams/[id]/attempt/[attemptId]/result` | Điểm + đáp án + breakdown |

### 4.2. Exam Player — chi tiết

```
┌──────────────────────────────────────────────────────┐
│ Câu 12/40              ⏱ 45:32              [≡ flag] │  ← Top bar tối giản
├──────────────────────────────────────────────────────┤
│                                                      │
│  Câu 12: Trong các phát biểu sau, phát biểu nào…     │
│                                                      │
│  ○ A. Phát biểu A                                    │
│  ○ B. Phát biểu B                                    │
│  ● C. Phát biểu C  (đã chọn)                         │
│  ○ D. Phát biểu D                                    │
│                                                      │
├──────────────────────────────────────────────────────┤
│  [← Câu trước]  [1][2][3][4][5][…]  [Câu sau →]      │  ← Pagination
│                                                      │
│                        [ Nộp bài ]                   │
└──────────────────────────────────────────────────────┘
```

**Nguyên tắc thiết kế Exam Player:**
- Không sidebar, không header phức tạp — chỉ có đề và câu trả lời
- Không animation thừa khi chuyển câu (instant)
- Auto-save mỗi 5 giây, không cần user nhấn "Save"
- Timer luôn hiển thị nhưng không nhấp nháy

### 4.3. Exam Browser

| Bộ lọc | Loại |
|---|---|
| Môn | Multi-select chips |
| Cấp lớp (6–12) | Range slider |
| Năm thi | Multi-select |
| Nguồn | Bộ GD&ĐT / Trường / User submitted (filter chip) |
| Độ khó | Easy / Medium / Hard |

Card layout: title, subject, year, số câu, thời gian, confidence score badge.

### 4.4. Result Screen

Sau khi nộp bài, hiển thị:
1. **Điểm tổng** — big number, prominent
2. **Breakdown theo chủ đề** — bar chart đơn giản
3. **Danh sách câu** — đúng/sai/bỏ qua, click vào xem đáp án + giải thích
4. **Action:** "Xem lịch sử" (→ L3) | "Làm đề tiếp" (→ L2 browser) | "Báo lỗi câu" (→ L4 input form)

### 4.5. Key components

```
app/(layer2)/
  ├── exams/
  │   ├── page.tsx                # Browser
  │   ├── [id]/
  │   │   ├── page.tsx            # Detail
  │   │   └── attempt/[attemptId]/
  │   │       ├── page.tsx        # Player
  │   │       └── result/page.tsx # Result
  └── _components/
      ├── ExamCard.tsx
      ├── ExamFilters.tsx
      ├── QuestionRenderer.tsx    # Render câu hỏi (markdown + latex)
      ├── AnswerChoice.tsx
      ├── ExamTimer.tsx
      ├── QuestionPagination.tsx
      ├── FlagButton.tsx
      ├── ScoreCard.tsx
      └── TopicBreakdown.tsx
```

---

## 5. UI Layer 3 — Analyze & History

**Mục đích:** Cho user thấy mình đã làm gì và đang yếu ở đâu. Data-rich nhưng không choáng ngợp.

### 5.1. Screens

| Screen | Route | Mô tả |
|---|---|---|
| **Dashboard** | `/me/dashboard` | Overview: tổng số đề, avg score, streak |
| **History** | `/me/history` | Bảng lịch sử các lần làm |
| **Weakness Analysis** | `/me/weakness` | Heatmap điểm yếu theo chủ đề |
| **Attempt Detail** | `/me/history/[attemptId]` | Xem lại một attempt đã làm |

### 5.2. Dashboard layout

```
┌──────────────────────────────────────────────────────┐
│  Tổng đề: 47    Avg: 7.8/10    Streak: 12 ngày      │  ← KPI cards
├──────────────────────────────────────────────────────┤
│                                                      │
│   Tiến độ điểm theo thời gian (line chart)           │
│                                                      │
├─────────────────────────┬────────────────────────────┤
│ Điểm yếu top 5         │ Đề gợi ý ôn tập             │
│ • Lượng giác (45%)     │ • Đề THPT 2023 - Toán       │
│ • Tích phân (52%)      │ • Đề tự luyện - Hóa 12      │
│ • …                    │ • …                         │
└─────────────────────────┴────────────────────────────┘
```

### 5.3. Visualization library

| Loại chart | Lib | Khi nào |
|---|---|---|
| Line / Bar / Pie | **Recharts** | Đa số cases — declarative, lightweight |
| Heatmap | **Custom SVG** hoặc **visx** | Weakness map |
| KPI cards | Component thuần | Không cần lib |

> **Quy tắc:** Không dùng D3 trực tiếp trừ khi Recharts thật sự không làm được. D3 quá nặng cho mid-range Android.

### 5.4. Key components

```
app/(layer3)/
  ├── me/
  │   ├── dashboard/page.tsx
  │   ├── history/
  │   │   ├── page.tsx
  │   │   └── [attemptId]/page.tsx
  │   └── weakness/page.tsx
  └── _components/
      ├── KPICard.tsx
      ├── ScoreTimelineChart.tsx
      ├── WeaknessHeatmap.tsx
      ├── HistoryTable.tsx
      ├── RecommendationList.tsx
      └── AttemptReplay.tsx        # Xem lại từng câu của attempt cũ
```

---

## 6. UI Layer 4 — Content Infrastructure

**Mục đích:** UI cho admin/editor quản lý ngân hàng đề. Không hiển thị cho student.

### 6.1. Access control

- Chỉ user có role `admin` hoặc `editor` (xem `BACK-END-ARCHITECTURE-MAP.md` Mục 8.2)
- Route prefix `/admin/*` — middleware kiểm tra role
- Student truy cập → redirect về `/exams`

### 6.2. Screens

| Screen | Route | Mô tả |
|---|---|---|
| **Question Library** | `/admin/questions` | Browse all questions, filter, search |
| **Question Editor** | `/admin/questions/[id]/edit` | Sửa câu hỏi, xem version history |
| **Batch Import** | `/admin/import` | Upload PDF/Word/ảnh → pipeline |
| **Review Queue** | `/admin/review` | Câu hỏi bị quarantine cần duyệt |
| **Error Reports** | `/admin/reports` | Danh sách báo lỗi từ user, batch process |

### 6.3. Visual language: editorial

- **Tables nhiều cột**, dense layout (admin cần thấy nhiều thông tin cùng lúc)
- **Inline editing** thay vì navigate sang trang khác
- **Diff view** cho version history (trái = cũ, phải = mới)
- **Batch actions** — checkbox + bulk operations

### 6.4. Key components

```
app/(layer4)/
  ├── admin/
  │   ├── questions/
  │   │   ├── page.tsx
  │   │   └── [id]/edit/page.tsx
  │   ├── import/page.tsx
  │   ├── review/page.tsx
  │   └── reports/page.tsx
  └── _components/
      ├── QuestionTable.tsx
      ├── QuestionEditor.tsx        # Markdown + LaTeX editor
      ├── VersionDiffViewer.tsx
      ├── ImportPipelineProgress.tsx
      ├── QuarantineCard.tsx
      ├── ConfidenceBadge.tsx
      └── BatchActionBar.tsx
```

---

## 7. Navigation Flow

Sơ đồ dòng điều hướng giữa các layer:

```
                    ┌──────────────┐
                    │  /           │ ← Entry point
                    │  Layer 1     │
                    │  Homepage 3D │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
        Click Mac                Login/Signup
                │                     │
                ▼                     ▼
        ┌──────────────┐      ┌──────────────┐
        │  /login      │      │  /signup     │
        │  Layer 1     │      │  Layer 1     │
        └──────┬───────┘      └──────┬───────┘
               │                     │
               └──────────┬──────────┘
                          │
                  Authenticated
                          │
                          ▼
                  ┌──────────────┐
                  │  /exams      │ ◄────────────┐
                  │  Layer 2     │              │
                  │  Browser     │              │
                  └──────┬───────┘              │
                         │                      │
                  Pick exam                     │
                         │                      │
                         ▼                      │
                  ┌──────────────┐              │
                  │ Exam Player  │              │
                  │  Layer 2     │              │
                  └──────┬───────┘              │
                         │                      │
                    Submit                      │
                         │                      │
                         ▼                      │
                  ┌──────────────┐              │
                  │  Result      │              │
                  │  Layer 2     │              │
                  └──────┬───────┘              │
                         │                      │
              ┌──────────┼──────────┐           │
              │          │          │           │
              ▼          ▼          ▼           │
        ┌─────────┐ ┌─────────┐ ┌──────────┐    │
        │/me/     │ │/me/     │ │ Làm tiếp │────┘
        │dashboard│ │history  │ │          │
        │Layer 3  │ │Layer 3  │ └──────────┘
        └─────────┘ └─────────┘

                  ┌─────────────────────────┐
                  │  /admin/*  (admin only) │
                  │  Layer 4 — CMS          │
                  └─────────────────────────┘
```

**Quy tắc navigation:**
- Mọi route trừ `/`, `/login`, `/signup` đều cần auth.
- `/admin/*` cần role admin/editor.
- Back button luôn hoạt động (Next.js App Router default).
- Transition giữa layer: GSAP fade (300ms). Trong cùng layer: instant.

---

## 8. Responsive Strategy

### 8.1. Breakpoints

| Tên | Width | Target |
|---|---|---|
| Mobile | < 640px | Phổ thông Android 4–6 inch |
| Tablet | 640 – 1024px | iPad, Android tablet |
| Desktop | ≥ 1024px | Laptop, desktop |

Tailwind config theo default — `sm:` `md:` `lg:` `xl:`.

### 8.2. Device-specific decisions

| Tính năng | Mobile | Desktop |
|---|---|---|
| Layer 1 — 3D scene | ❌ disabled, dùng 2.5D | ✅ Three.js |
| Layer 2 — Exam Player | Một câu/màn hình, swipe | Có pagination nhỏ + keyboard nav |
| Layer 3 — Charts | Stacked vertical | Side-by-side grid |
| Layer 4 — CMS | ❌ không support (admin chỉ trên desktop) | ✅ |

### 8.3. Performance budget theo device

| Metric | Mobile | Desktop |
|---|---|---|
| LCP | ≤ 2.5s | ≤ 1.8s |
| TTI | ≤ 3.5s | ≤ 2.5s |
| Bundle (initial) | ≤ 200KB | ≤ 350KB |
| Three.js | Không load | Lazy load sau interaction |

---

## 9. State Management

Bốn loại state, dùng tool khác nhau cho mỗi loại:

| Loại state | Tool | Ví dụ |
|---|---|---|
| **Server state** | TanStack Query + Server Components | Danh sách đề, lịch sử attempt |
| **URL state** | Next.js searchParams | Filters, pagination |
| **Form state** | `react-hook-form` + Zod | Login, signup, question editor |
| **Local UI state** | `useState` / `useReducer` | Modal open/close, tab active |

**Không dùng global state manager (Redux/Zustand) trừ khi thực sự cần.** Lý do: Server Components đã handle data fetching tốt, hầu hết state khác là local.

**Trường hợp cần Zustand:** Exam Player có state phức tạp (đáp án đang chọn, flag, timer) cần share giữa nhiều component — lúc đó tạo store cục bộ trong `app/(layer2)/_state/examPlayerStore.ts`.

---

## 10. Routing Map (Next.js App Router)

### 10.1. Route groups theo layer

```
SOURCE/app/
  ├── (layer1)/                   # Route group — không ảnh hưởng URL
  │   ├── page.tsx                # /
  │   ├── login/page.tsx          # /login
  │   ├── signup/page.tsx         # /signup
  │   └── me/customize/page.tsx   # /me/customize
  │
  ├── (layer2)/
  │   └── exams/
  │       ├── page.tsx            # /exams
  │       └── [id]/...
  │
  ├── (layer3)/
  │   └── me/
  │       ├── dashboard/page.tsx
  │       ├── history/...
  │       └── weakness/page.tsx
  │
  ├── (layer4)/
  │   └── admin/
  │       ├── questions/...
  │       ├── import/page.tsx
  │       ├── review/page.tsx
  │       └── reports/page.tsx
  │
  ├── layout.tsx                  # Root layout
  ├── globals.css
  └── middleware.ts               # Auth + role check
```

### 10.2. Middleware logic

```
middleware.ts:
  IF route in PUBLIC_ROUTES (/, /login, /signup, /api/auth/*):
      → cho qua
  ELSE IF không có session:
      → redirect /login
  ELSE IF route bắt đầu /admin/* và user.role không phải admin/editor:
      → redirect /exams
  ELSE:
      → cho qua
```

---

## 11. Implementation Cheat Sheet

Khi agent triển khai một feature UI, dùng bảng này để biết file đi đâu:

| Loại file | Vị trí |
|---|---|
| Page (route) | `SOURCE/app/(layerN)/<route>/page.tsx` |
| Component layer-specific | `SOURCE/app/(layerN)/_components/<Name>.tsx` |
| Component primitives | `SOURCE/components/ui/<name>.tsx` (shadcn/ui) |
| Component shared cross-layer | `SOURCE/components/shared/<Name>.tsx` |
| Server Action | `SOURCE/app/(layerN)/actions.ts` |
| Custom hook | `SOURCE/hooks/use<Name>.ts` |
| Type definition | `SOURCE/types/<domain>.ts` |
| Utility | `SOURCE/lib/<domain>/<name>.ts` |
| Static asset (3D model, font, image lớn) | `ASSETS/<type>/<name>` |
| UI copy / labels | `TEXT/copy/<layer>.<lang>.ts` |

---

## 12. Quick Reference cho Agent

Khi nhận TE1 và task thuộc UI Module, agent phải xác định:

```
[ ] Task này thuộc UI Layer nào? (1/2/3/4)
[ ] Tạo screen mới hay sửa screen có sẵn?
[ ] Route nào? (xem Mục 10)
[ ] Visual language phải khớp với layer (xem Mục 1)
[ ] Component thuộc cấp nào: primitive / shared / layer-specific?
[ ] Có mobile fallback đặc biệt không? (xem Mục 8.2)
[ ] State quản lý ở đâu: server / URL / form / local? (xem Mục 9)
[ ] Logic Module tương ứng đã có chưa? → xem BACK-END-ARCHITECTURE-MAP.md
```

