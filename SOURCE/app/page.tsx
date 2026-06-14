import Link from "next/link";
import { SiteHeader } from "@/app/(layer2)/_components/SiteHeader";
import { Homepage3D } from "@/app/(layer1)/_components/Homepage3D";

// Homepage (Layer 1 — Entry). Sân khấu 3D editorial tối theo
// TEMPLATE/homepage/homepage_desktop.png. Navbar kế thừa SiteHeader của L2
// (không viết lại). Bấm máy AIO trong cảnh → /exams (proxy tự đẩy /login nếu
// chưa đăng nhập). M3.3 tập trung desktop; mobile fallback ở M3.4.
export default function Home() {
  return (
    // Container khóa đúng 1 viewport (h-[100dvh]) + overflow-hidden → không
    // scrollbar dọc (header có border-b 1px nên tránh tính calc thủ công).
    // Header trong flow + main flex-1 min-h-0 cho Canvas WebGL chiều cao xác định.
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#0d0d11]">
      <SiteHeader />
      <main className="relative min-h-0 flex-1">
        <Homepage3D />
        <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center">
          <Link
            href="/exams"
            className="pointer-events-auto font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Nhấn vào màn hình để bắt đầu
          </Link>
        </div>
      </main>
    </div>
  );
}
