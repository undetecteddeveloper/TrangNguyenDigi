---
version: "alpha"
name: "Muc & Son Mai (Ink & Lacquer)"
description: "Ban sac Viet Nam co dien - do son, den son mai, nga, vang dong - dua vao khong gian ky thuat so."
colors:
  primary: "#A62C2B"
  on-primary: "#EDE1C8"
  primary-hover: "#8F2523"
  background: "#EDE1C8"
  foreground: "#1B1512"
  surface: "#1B1512"
  on-surface: "#EDE1C8"
  accent: "#B8863B"
  on-accent: "#1B1512"
  muted: "#6B655C"
  on-muted: "#EDE1C8"
  border: "#D8C9A8"
typography:
  display:
    fontFamily: "Source Serif 4"
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.01em
  h1:
    fontFamily: "Source Serif 4"
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.25
  h2:
    fontFamily: "Source Serif 4"
    fontSize: 1.5rem
    fontWeight: 500
    lineHeight: 1.3
  quote:
    fontFamily: "Source Serif 4"
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body:
    fontFamily: "Be Vietnam Pro"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: "Be Vietnam Pro"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: "Be Vietnam Pro"
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: 0.04em
rounded:
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 12px
  rule-divider:
    backgroundColor: "{colors.accent}"
    height: 2px
    width: 40px
  divider-hairline:
    backgroundColor: "{colors.border}"
    height: 1px
    width: 100%
  caption:
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 24px
  card-dark:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 24px
  drop-cap:
    textColor: "{colors.primary}"
    typography: "{typography.display}"
---

## Overview

Bản sắc "Mực & Sơn mài" — biên tập cổ điển (đầu báo lâu đời kiểu New York Times)
gặp bảng màu sơn mài truyền thống Việt Nam. Serif chỉ xuất hiện ở tiêu đề và các
điểm nhấn mang tính "tuyên bố"; phần còn lại của giao diện dùng sans-serif rõ
ràng, hiện đại. Đỏ son và vàng đồng không bao giờ phủ diện tích lớn — chúng là
điểm nhấn, không phải nền.

## Colors

- **Primary — Đỏ son (`#A62C2B`):** dùng cho nút hành động chính, liên kết quan
  trọng, trích dẫn nổi bật. Không dùng làm nền cho khối văn bản dài — chỉ dùng
  cho khối nhỏ, tiêu đề, hoặc dải màu hẹp (banner, thẻ tag).
- **On-primary — Ngà (`#EDE1C8`):** màu chữ duy nhất được dùng trên nền đỏ son.
  Không dùng trắng thuần (#FFFFFF) trên đỏ son — quá lạnh, phá vỡ tông ấm.
- **Background — Ngà (`#EDE1C8`):** nền mặc định của giao diện sáng. Đóng vai
  trò "trang giấy cũ" — không dùng trắng thuần làm nền trang.
- **Foreground — Đen sơn mài (`#1B1512`):** màu chữ chính trên nền ngà. Đây là
  đen ấm (ánh nâu), không phải đen tuyệt đối (#000000).
- **Surface — Đen sơn mài (`#1B1512`):** nền cho các khối "đảo ngược" (footer,
  banner tối, chế độ tối). Khi dùng làm nền, chữ luôn là `on-surface`.
- **Accent — Vàng đồng (`#B8863B`):** chỉ dùng cho đường kẻ phân cách, viền
  mảnh, icon, gạch chân hover. Không phủ thành mảng lớn — dễ ngả sang "sến,
  phú quý" nếu lạm dụng.
- **Muted — Xám khói (`#6B655C`):** chữ phụ, chú thích, border mặc định, icon
  trung tính. Đây là màu xuất hiện nhiều nhất trong giao diện thực tế.
- **Border (`#D8C9A8`):** viền mảnh giữa các khối trên nền sáng — ngà đậm hơn
  một chút, không dùng xám lạnh.

Cảnh báo tương phản: không đặt đỏ son trên đen sơn mài (hoặc ngược lại) ở cỡ
chữ nhỏ hơn 24px — độ tương phản không đủ để đọc thoải mái.

## Typography

Hai vai trò tách biệt, không trộn lẫn:

- **Serif (Source Serif 4)** — chỉ dùng cho `display`, `h1`, `h2`, và `quote`.
  Đây là chữ ký thị giác cổ điển. Không dùng cho nút bấm, nhãn, hay văn bản
  dài trên màn hình nhỏ.
- **Sans (Be Vietnam Pro)** — dùng cho toàn bộ `body`, `body-sm`, `label-caps`,
  UI, điều hướng. Chọn font này vì hỗ trợ dấu tiếng Việt đầy đủ và có sẵn trên
  Google Fonts.

`line-height` của serif cỡ lớn giữ ở 1.15–1.3 (đặc trưng tiêu đề báo in); của
sans ở thân bài giữ 1.6–1.7 (đọc thoải mái trên màn hình, cao hơn chuẩn in ấn).

## Layout

- Lưới nội dung: max-width 720px cho văn bản dài (đúng chuẩn biên tập, dòng
  không quá 75 ký tự).
- Khoảng cách dùng thang `spacing` — không dùng giá trị tuỳ tiện ngoài thang.
- Mỗi section có tối đa một `rule-divider` (đường kẻ vàng đồng) làm điểm nhấn
  mở đầu — không lặp lại nhiều đường kẻ trong cùng một khung nhìn.

## Elevation & Depth

Không dùng đổ bóng (box-shadow) hay gradient — bề mặt phẳng. Phân lớp bằng
màu nền (`background` ↔ `surface`) và viền mảnh (`border`), không phải bằng
độ sâu giả lập. Đây là quy tắc cứng: nếu một component cần "nổi", dùng viền
2px màu `accent`, không dùng shadow.

## Shapes

Bo góc rất nhẹ: `rounded.sm` (4px) cho nút và input, `rounded.md` (8px) cho
thẻ/card. Không dùng bo góc lớn (pill-shape) — phá vỡ cảm giác "biên tập,
nghiêm túc" mà bảng màu này hướng tới.

## Components

- `button-primary`: nền đỏ son, chữ ngà, viết hoa nhỏ theo `label-caps`.
- `button-secondary`: nền trong suốt, viền mảnh, chữ đen sơn mài — dùng cho
  hành động phụ để không cạnh tranh với `button-primary`.
- `rule-divider`: thanh ngang 40px × 2px màu vàng đồng — dấu hiệu nhận diện
  lặp lại ở đầu mỗi section hoặc bài viết.
- `card` / `card-dark`: hai biến thể sáng/tối của cùng một khối nội dung.
- `drop-cap`: chữ cái đầu đoạn, dùng font `display`, màu đỏ son — chỉ dùng ở
  đoạn mở đầu bài viết hoặc trang giới thiệu, không lặp lại trong mỗi đoạn.

## Do's and Don'ts

- Do dùng đỏ son như dấu câu — xuất hiện có chủ đích, không phủ khắp trang.
- Do giữ nền mặc định là ngà, không phải trắng thuần.
- Do dùng serif chỉ cho tiêu đề lớn và trích dẫn.
- Don't dùng vàng đồng cho mảng nền lớn hoặc văn bản dài.
- Don't trộn serif vào nút bấm, nhãn, hoặc điều hướng.
- Don't dùng đổ bóng hoặc gradient để tạo chiều sâu.
- Don't đặt chữ đỏ son trên nền đen sơn mài ở cỡ nhỏ hơn 24px.
