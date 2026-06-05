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
GĐ 1 — Functional Prototype  : [~] In Progress (M1.1–M1.4 Done)
GĐ 2 — Connected Prototype   : [ ] Not Started
GĐ 3 — Polish (MVP ship)     : [ ] Not Started
─────────────────────────────
Post-MVP A — Layer 3         : [ ] Not Started
Post-MVP B — Layer 4         : [ ] Not Started
```

---
---

# [Layer 2: Core Loop] — Task: GĐ 1 Functional Prototype (M1.1–M1.4)

- **Latest prompt:** "Bắt đầu thực hiện các milestone từ 1.1-1.4 trước tiên... xây khung xương."
- **Latest step:** Git
- **Layer status:** Layer 2 In Progress (Dở dang — có logic + UI structure, chưa style/DB/scoring)

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

## Ghi chú scope & nợ kỹ thuật (cho batch sau)
- Player dùng `useState` cho `current` + `answers`. **M1.5** sẽ nâng lên `useReducer` (examPlayerStore) — prop interface của component không đổi.
- Nút "Nộp bài" hiện disabled placeholder. **M1.6** thêm `lib/scoring/computeScore.ts` (pure, testable). **M1.7** thêm `ResultView`.
- Tất cả `_components` mới đặt theo `UI-LAYER-MAP.md` Mục 4.5 — GĐ 3 (M3.1) chỉ thêm style, không viết lại.

## Kết quả Testing
- `tsc --noEmit`: pass (exit 0).
- `next build`: pass — routes `/exams`, `/exams/[id]`, `/exams/[id]/attempt/[attemptId]` build đúng.
- Visual testing: bỏ qua (GĐ 1 chưa làm — theo WORKFLOW Bước 4, chỉ từ GĐ 2+).
