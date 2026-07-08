// Layout route group (layer2) — áp theme L2 cho MỌI trang Layer 2.
// Mục đích: navbar Navy Blue (RGB 26,54,93) cho tất cả trang L2 (Exam Browser,
// Detail, Player, Result, Detail-câu). Biến --nav-* nằm trong .theme-l2
// (globals.css) → các trang con thừa hưởng, không cần lặp ở từng trang.
// Wrapper là <div> thường (không overflow/transform/height) nên KHÔNG phá vỡ
// position:sticky của SiteHeader bên trong các trang.

export default function Layer2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="theme-l2">{children}</div>;
}
