// Layout route group (layer2) — áp theme L2 cho MỌI trang Layer 2.
// Mục đích: navbar Navy Blue (RGB 26,54,93) cho tất cả trang L2 (Exam Browser,
// Detail, Player, Result, Detail-câu). Biến --nav-* nằm trong .theme-l2
// (globals.css) → các trang con thừa hưởng, không cần lặp ở từng trang.
//
// SiteHeader render Ở ĐÂY (1 lần cho mọi trang L2) thay vì lặp lại trong từng
// page — tránh phải truyền `user` prop xuyên qua ExamPlayer (client component)
// và tránh fetch getCurrentUserProfile() nhiều lần mỗi navigation. Các trang
// con KHÔNG còn tự render <SiteHeader/> nữa (đã gỡ), chỉ giữ `bg-background`
// (bỏ `min-h-dvh` — layout này gánh min-h-dvh, tránh cộng dồn chiều cao với
// header 56px gây scrollbar thừa, giống bug đã gặp ở M3.3 homepage).
import { getCurrentUserProfile } from "@/lib/auth/getCurrentUser";
import { SiteHeader } from "@/app/(layer2)/_components/SiteHeader";

export default async function Layer2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserProfile();

  return (
    <div className="theme-l2 min-h-dvh">
      <SiteHeader user={user} />
      {children}
    </div>
  );
}
