# AGENT WORKFLOW SPECIFICATION

> **Đây là tài liệu điều phối agent.** Agent phải đọc toàn bộ file này trước khi bắt đầu bất kỳ hành động nào.
> Workflow gồm 5 bước tuần tự (sequential pipeline). Mỗi bước chỉ được bắt đầu khi bước trước đã hoàn thành và điều kiện kích hoạt (Trigger Event) đã được đáp ứng.

---

## 0. Meta

- **Repo:** https://github.com/undetecteddeveloper/TrangNguyenDigi.git
- **Ngôn ngữ giao tiếp với engineer:** Tiếng Việt
- **File trạng thái:** `PROCESS.md` (agent tạo và cập nhật liên tục)

### Tài liệu phụ trợ (bắt buộc đọc trước workflow)

| File | Vai trò |
|---|---|
| `PROJECT_OVERVIEW.md` | Triết lý sản phẩm, tech stack, conventions |
| `UI-LAYER-MAP.md` | Blueprint giao diện: screens, components, navigation, routing |
| `BACK-END-ARCHITECTURE-MAP.md` | Blueprint logic: tables, functions, events, security |

> **Phân vai:** Hai file `*MAP.md` trả lời câu hỏi *"Website của chúng ta là gì?"*. File `WORKFLOW.md` (file này) trả lời câu hỏi *"Với feature này tôi cần làm theo các bước nào?"*.

---

## 1. Nguyên Tắc Cấu Trúc Hệ Thống

Website tổ chức thành **4 Layer**. Đây là cấu trúc để **tổ chức công việc** và **xác định quan hệ phụ thuộc lúc chạy (runtime)** — **KHÔNG phải thứ tự xây dựng**.

```
Layer 4 — Content Infrastructure
Layer 3 — Analyze & History
Layer 2 — Core Loop
Layer 1 — Account & Entry
```

> **Thứ tự xây dựng dự án (build order) được định nghĩa trong `PROJECT_ROADMAP.md`, KHÔNG phải theo số layer.** Dự án đi prototype-first: Core Loop (Layer 2) xây trước, homepage (Layer 1) làm sau cùng. Số layer chỉ phản ánh quan hệ phụ thuộc, không phản ánh thứ tự làm.

> Chi tiết về từng layer (screens, components, routes): xem `UI-LAYER-MAP.md` và `BACK-END-ARCHITECTURE-MAP.md`.

### 1.1. Phân cấp công việc

```
Layer
 └── Module
      ├── UI Module        ← giao diện, component, layout, styling
      └── Logic Module     ← business logic, Server Actions, DB, events
           └── Task        ← đơn vị nhỏ nhất agent triển khai, có thể kiểm tra được
```

- Một feature thường có **cả UI Module và Logic Module**. Agent phải tách rõ ràng khi thiết kế.
- Task phải đủ cụ thể để có tiêu chí "Done" rõ ràng. *"Làm authentication"* không phải task. *"Tích hợp Google OAuth callback và lưu vào user_profiles"* mới là task.

### 1.2. Dependency giữa các Layer (quy tắc RUNTIME)

Đây là quy tắc về **ai được đọc data của ai lúc chạy**, không phải thứ tự viết code.

- Layer cao hơn **có thể phụ thuộc** vào layer thấp hơn (vd: Layer 2 cần auth của Layer 1 để biết user là ai).
- Layer thấp hơn **không bao giờ** được phụ thuộc vào layer cao hơn — upward dependency là vi phạm, cấm tuyệt đối.
- Trong giai đoạn prototype, một dependency *xuống dưới* có thể được **stub** (làm giả) tạm thời — vd dùng `user_id` cố định thay cho auth thật. Stub luôn là dependency xuống dưới nên hợp lệ; không bao giờ stub để tạo dependency lên trên.

### 1.3. Điều kiện hoàn thành một Layer (định nghĩa)

> **Layer hoàn thành ⟺ TẤT CẢ task của TẤT CẢ module (UI + Logic) trong layer đó đều ở trạng thái `Done`.**

Đây là **định nghĩa** để báo cáo tiến độ, **không phải điều kiện chặn** layer khác bắt đầu. Thứ tự bắt đầu/hoàn thành các layer do `PROJECT_ROADMAP.md` quyết định (prototype-first), nên nhiều layer có thể cùng ở trạng thái dở dang qua các giai đoạn.

---

## 2. Pipeline Workflow

Mỗi lần engineer gửi TE1, agent chạy toàn bộ pipeline 5 bước cho **một task/feature cụ thể** thuộc một layer xác định.

```
[Engineer] ──TE1──► C&D ──TE2──► Coding ──auto──► Updating ──auto──► Testing ──auto──► Git ──► [chờ TE1]
                     ▲
                     └──TE3 (làm lại C&D)──────────────────────────────────────────────────────────
```

| Bước | Tên | Ai thực hiện | Trigger vào | Trigger ra |
|---|---|---|---|---|
| 1 | **C&D** (Concept & Design) | Agent + Engineer (Q&A) | TE1 | TE2 hoặc TE3 |
| 2 | **Coding** | Agent | TE2 | Tự động (TE4) |
| 3 | **Updating** | Agent | Tự động (TE4) | Tự động (TE5) |
| 4 | **Testing** | Agent | Tự động (TE5) | Tự động khi pass |
| 5 | **Git** | Agent | Tự động sau Testing pass | Tự động (TE6) → chờ TE1 |

---

## 3. Trigger Events (TE)

Trigger Event là tín hiệu từ engineer hoặc trạng thái nội bộ của agent. Agent phải nhận diện chính xác TE để chuyển bước đúng lúc.

### Trigger từ engineer

| ID | Mô tả | Ví dụ prompt | Hành động |
|---|---|---|---|
| **TE1** | Yêu cầu làm feature mới hoặc sửa lỗi (kèm hoặc không kèm layer) | *"Làm tính năng đăng nhập Google"*, *"Sửa lỗi crash khi upload"* | Bắt đầu **C&D** |
| **TE2** | Xác nhận approach, yêu cầu bắt đầu code | *"Được, làm theo approach đó đi"*, *"OK code đi"* | Chuyển sang **Coding** |
| **TE3** | Không đồng ý approach, yêu cầu giải thích lại | *"Không, làm theo cách khác"*, *"Giải thích lại đi"* | Làm lại **C&D** từ đầu |

### Trigger nội bộ (agent tự kích hoạt)

| ID | Điều kiện kích hoạt | Hành động bắt buộc |
|---|---|---|
| **TE4** | Toàn bộ code của task hiện tại đã viết xong | Thông báo → tự chuyển sang **Updating** |
| **TE5** | Toàn bộ file liên quan đã được update | Thông báo → tự thực hiện **Testing** → chuyển **Git** nếu pass |
| **TE6** | `git push` thành công | Thông báo → cập nhật `PROCESS.md` → chờ **TE1** |

> **Nguyên tắc bất biến:** Với TE4, TE5, TE6 — agent **không chờ** engineer xác nhận. Chuyển bước ngay sau khi thông báo. Chỉ dừng và hỏi khi gặp lỗi không thể tự giải quyết.

---

## 4. Mô Tả Chi Tiết Từng Bước

---

### Bước 1 — C&D (Concept & Design)

**Kích hoạt bởi:** TE1
**Kết thúc bởi:** TE2 (tiếp tục) hoặc TE3 (làm lại)

**Mục tiêu:** Hiểu rõ yêu cầu, xác định layer đích, thiết kế approach, đạt đồng thuận với engineer trước khi viết một dòng code nào.

**Quy trình:**

1. Đọc prompt TE1. Xác định task này thuộc **layer nào** (1/2/3/4) và **module nào** (UI và/hoặc Logic).
2. Xác định task thuộc **giai đoạn nào** trong `PROJECT_ROADMAP.md` và **tôn trọng scope của giai đoạn đó**. Ví dụ: nếu đang ở giai đoạn prototype, không tự ý thêm DB, auth thật, hay styling nếu roadmap chưa yêu cầu — dùng stub thay thế.
3. **Tham chiếu blueprint:**
   - Nếu có UI Module: đọc lại section tương ứng trong `UI-LAYER-MAP.md`.
   - Nếu có Logic Module: đọc lại section tương ứng trong `BACK-END-ARCHITECTURE-MAP.md`.
4. Đặt câu hỏi làm rõ nếu yêu cầu còn mơ hồ — **hỏi từng câu một**, không hỏi nhiều thứ cùng lúc.
5. Trình bày approach đề xuất, bao gồm:
   - Layer và module đích.
   - UI Module: screens/components cần tạo/sửa (chiếu vào `UI-LAYER-MAP.md`).
   - Logic Module: tables/functions/events cần tạo/sửa (chiếu vào `BACK-END-ARCHITECTURE-MAP.md`).
   - Danh sách task dự kiến cho mỗi module.
   - Dependency với module/layer khác (nếu có).
   - Rủi ro hoặc ambiguity tiềm ẩn.
6. Chờ phản hồi:
   - **TE2** → tạo/cập nhật `PROCESS.md` rồi chuyển sang **Coding**.
   - **TE3** → quay lại bước 4.

---

### Bước 2 — Coding

**Kích hoạt bởi:** TE2
**Kết thúc bởi:** TE4 (agent tự kích hoạt)

**Mục tiêu:** Viết code theo đúng approach đã thống nhất, theo từng task trong `PROCESS.md`.

**Quy trình:**

1. Triển khai code theo thứ tự: **Logic Module trước, UI Module sau** (tránh UI phụ thuộc vào logic chưa tồn tại).
2. Đặt file vào đúng vị trí theo `UI-LAYER-MAP.md` Mục 11 (UI) và `BACK-END-ARCHITECTURE-MAP.md` Mục 9 (Logic).
3. Cập nhật state từng task trong `PROCESS.md` ngay khi hoàn thành task đó (`In Progress` → `Done`).
4. Khi toàn bộ task đã `Done`:
   - Thông báo: *"✅ Coding hoàn thành. Chuyển sang bước Updating."*
   - Tự chuyển sang **Updating** (TE4).

**Không hỏi engineer** trong bước này trừ khi gặp ambiguity nghiêm trọng không thể tự giải quyết.

---

### Bước 3 — Updating

**Kích hoạt bởi:** TE4 (tự động sau Coding)
**Kết thúc bởi:** TE5 (agent tự kích hoạt)

**Mục tiêu:** Đảm bảo toàn bộ codebase nhất quán với code mới — không file nào bị bỏ sót.

**Checklist cần rà soát:**

- Imports và exports trong các file liên quan.
- Type definitions / interfaces / schemas (`SOURCE/types/`).
- Config files (routes, middleware, environment).
- Shared components hoặc utilities bị ảnh hưởng.
- RLS policies trong Supabase (nếu thêm/sửa table).
- Event schemas (`SOURCE/lib/events/types.ts`) nếu thêm event mới.
- Documentation nội bộ (comments, README nếu có).

**Quy trình:**

1. Rà soát toàn bộ checklist trên.
2. Áp dụng thay đổi.
3. Cập nhật `PROCESS.md`: ghi nhận các file đã update.
4. Khi hoàn thành:
   - Thông báo: *"✅ Updating hoàn thành. Chuyển sang bước Testing."*
   - Tự chuyển sang **Testing** (TE5).

---

### Bước 4 — Testing

**Kích hoạt bởi:** TE5 (tự động sau Updating)
**Kết thúc bởi:** Tự động khi toàn bộ test pass

**Mục tiêu:** Xác minh code hoạt động đúng và không gây regression ở các module/layer khác.

**Quy trình:**

1. Chạy test suite theo Pha hiện tại (xem `PROJECT_OVERVIEW.md` Mục 6 — Testing Strategy).
2. Nếu có lỗi:
   - Ghi vào `PROCESS.md`: trường `*Issue` (paste nguyên văn lỗi) và `*Fixing process` (mô tả hướng sửa).
   - Sửa lỗi → chạy lại test.
   - Lặp cho đến khi pass.
3. **Visual Testing** — chỉ thực hiện khi task có **UI Module** VÀ giai đoạn hiện tại từ **GĐ2 trở lên** (xem `PROJECT_ROADMAP.md` Mục 9):

   **Điều kiện tiên quyết:** Playwright MCP đã được cài và cấu hình trong Claude Code. Nếu chưa có:
```bash
   claude mcp add playwright -- npx @playwright/mcp@latest
```
   Engineer phải cung cấp **ảnh tham chiếu** (reference image) — mockup, Figma export, hoặc screenshot mẫu — đặt tại `ASSETS/screenshots/reference/<tên-feature>.png`.

   **Vòng lặp visual verification:**
   1. Đảm bảo dev server đang chạy (`npm run dev` trên `localhost:3000`).
   2. Dùng Playwright MCP điều hướng đến route vừa thay đổi.
   3. Chụp screenshot toàn trang ở **hai viewport**: desktop (1280px) và mobile (375px). Lưu vào `ASSETS/screenshots/output/<tên-feature>-desktop.png` và `...-mobile.png`.
   4. Đặt screenshot vừa chụp cạnh ảnh tham chiếu, phân tích bằng mắt:
      - Layout tổng thể có vỡ không?
      - Visual language có đúng với layer? (xem `UI-LAYER-MAP.md` Mục 1)
      - Responsive có đúng breakpoint không? (xem `UI-LAYER-MAP.md` Mục 8)
      - Console có lỗi không? (Playwright MCP log console errors tự động)
   5. Nếu phát hiện lỗi visual:
      - Ghi vào `PROCESS.md` trường `*Issue` với mô tả lỗi + tên file screenshot.
      - Sửa code → quay lại bước 3.1 (chụp lại).
      - Lặp cho đến khi output khớp tham chiếu ở mức chấp nhận được.

   > **Ngưỡng "pass" visual:** Không yêu cầu pixel-perfect. Pass khi: không có layout bị vỡ, đúng visual language của layer, đúng breakpoint, không có console error. Sai lệch nhỏ về màu sắc/spacing cho phép — ghi chú vào `PROCESS.md` để sửa sau.

   > **Nếu engineer không cung cấp reference image:** Bỏ qua bước so sánh, chỉ chụp screenshot và ghi chú trong `PROCESS.md` rằng visual chưa được verify với tham chiếu. Chuyển sang bước tiếp theo.
4. Khi toàn bộ test pass (logic + visual):
   - Kiểm tra xem **tất cả task của module/layer hiện tại đã `Done` chưa**.
   - Nếu layer vừa hoàn thành toàn bộ (theo điều kiện ở Mục 1.3): thông báo rõ — *"✅ Layer \<N\>: \<tên layer\> đã hoàn thành toàn bộ."*
   - Thông báo: *"✅ Testing hoàn thành. Chuyển sang bước Git."*
   - Tự chuyển sang **Git**.

**Nếu lỗi không thể tự sửa:** Dừng lại, báo cáo chi tiết (error log, file liên quan, hướng đã thử) cho engineer và chờ hướng dẫn.

---

### Bước 5 — Git

**Kích hoạt bởi:** Sau khi Testing pass
**Kết thúc bởi:** TE6 (agent tự kích hoạt sau khi push thành công)

**Mục tiêu:** Commit toàn bộ thay đổi và push lên remote repo.

**Quy trình:**

```bash
git add .
git commit -m "<type>(<layer>/<scope>): <mô tả ngắn gọn bằng tiếng Anh>"
git push
```

> Nếu là lần Git đầu tiên của dự án: xem `PROJECT_OVERVIEW.md` Mục 7 — phần "Khởi tạo (lần đầu tiên)".

**Quy ước commit message** (Conventional Commits + layer scope):

| Type | Ý nghĩa |
|---|---|
| `feat` | Tính năng mới |
| `fix` | Sửa lỗi |
| `refactor` | Cải tiến code, không thay đổi hành vi |
| `style` | UI/CSS, không đổi logic |
| `test` | Thêm/sửa test |
| `docs` | Cập nhật tài liệu |
| `chore` | Build, config, dependencies |

Ví dụ commit message chuẩn:

```
feat(layer1/auth): add Google OAuth login
fix(layer2/exam): handle null answer on submit
refactor(layer3/analytics): extract chart logic to hook
```

Sau khi push thành công:
- Thông báo: *"✅ Git hoàn thành. Đã push lên repo. Sẵn sàng cho task tiếp theo."*
- Cập nhật `PROCESS.md`.
- Chờ **TE1**.

---

## 5. Format File `PROCESS.md`

`PROCESS.md` là **state memory** của toàn bộ quá trình phát triển. Agent tạo ngay sau TE2 và cập nhật liên tục cho đến Git.

```markdown
# [Layer <1|2|3|4>: <Tên Layer>] — Task: <tên task/feature ngắn gọn>

- **Latest prompt:** <paste nguyên văn prompt TE1 của engineer>
- **Latest step:** <C&D | Coding | Updating | Testing | Git>
- **Layer status:** <In Progress | Done>

---

## UI Module: <Tên Module>
- **State:** <In Progress | Done | Blocked>
  + Task 1: <mô tả cụ thể, có thể kiểm tra được> — <Todo | In Progress | Done | Blocked>
  + Task 2: <mô tả> — <state>

## Logic Module: <Tên Module>
- **State:** <In Progress | Done | Blocked>
  + Task 1: <mô tả> — <state>
  + Task 2: <mô tả> — <state>

---

*Issue (nếu có):* <paste nguyên văn lỗi từ test output hoặc feedback của engineer>
*Fixing process:* <các bước đang hoặc đã thực hiện để sửa issue>
```

### Quy tắc cập nhật `PROCESS.md`

| Thời điểm | Hành động |
|---|---|
| Ngay sau TE2 | Tạo file (hoặc thêm section mới nếu file đã tồn tại) |
| Mỗi khi chuyển bước | Cập nhật `Latest step` |
| Sau mỗi task hoàn thành | Cập nhật state của task đó |
| Sau mỗi module hoàn thành | Cập nhật `State` của module |
| Sau Testing pass | Kiểm tra và cập nhật `Layer status` nếu layer đã done |
| Không bao giờ | Xóa section cũ — giữ lại toàn bộ làm lịch sử |

### Ví dụ `PROCESS.md` thực tế

```markdown
# [Layer 1: Account & Entry] — Task: Google OAuth Login

- **Latest prompt:** "Thêm chức năng đăng nhập bằng Google vào trang login"
- **Latest step:** Testing
- **Layer status:** In Progress

---

## Logic Module: AuthService
- **State:** Done
  + Task 1: Tích hợp Google OAuth 2.0 client — Done
  + Task 2: Xử lý callback và tạo session — Done
  + Task 3: Lưu user info vào user_profiles nếu lần đầu — Done

## UI Module: LoginPage
- **State:** In Progress
  + Task 1: Thêm nút "Đăng nhập bằng Google" — Done
  + Task 2: Xử lý loading state trong khi redirect — In Progress
  + Task 3: Hiển thị error nếu OAuth thất bại — Todo

---

*Issue (nếu có):* TypeError: Cannot read property 'email' of undefined tại authCallback.ts:34
*Fixing process:* Thêm null check trước khi truy cập profile.email. Đang test lại.
```

---

## 6. Theo Dõi Tiến Độ Layer Tổng Thể

Agent phải duy trì nhận thức về mức độ hoàn thiện của từng layer, không chỉ task hiện tại. Sau mỗi lần Git hoàn thành, agent tự đánh giá:

```
Layer 1 — Account & Entry            : [ ] Chưa bắt đầu / [ ] Dở dang / [ ] Done
Layer 2 — Core Loop                  : [ ] Chưa bắt đầu / [ ] Dở dang / [ ] Done
Layer 3 — Analyze & History          : [ ] Chưa bắt đầu / [ ] Dở dang / [ ] Done
Layer 4 — Content Infrastructure     : [ ] Chưa bắt đầu / [ ] Dở dang / [ ] Done
```

Đây là **ảnh chụp mức độ hoàn thiện** của từng layer, không phải thứ tự xây dựng. Vì dự án đi prototype-first (xem `PROJECT_ROADMAP.md`), nhiều layer có thể cùng ở trạng thái "Dở dang" — ví dụ Layer 2 có logic nhưng chưa style, Layer 1 có auth nhưng chưa có homepage 3D. Đây là điều bình thường.

Nếu engineer hỏi về tiến độ tổng thể, agent trả lời dựa trên `PROCESS.md` và bảng trên — không phỏng đoán. Tiến độ theo **giai đoạn** (macro) xem bảng trong `PROJECT_ROADMAP.md`.
