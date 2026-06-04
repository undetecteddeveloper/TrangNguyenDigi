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
GĐ 1 — Functional Prototype  : [ ] Not Started
GĐ 2 — Connected Prototype   : [ ] Not Started
GĐ 3 — Polish (MVP ship)     : [ ] Not Started
─────────────────────────────
Post-MVP A — Layer 3         : [ ] Not Started
Post-MVP B — Layer 4         : [ ] Not Started
```
