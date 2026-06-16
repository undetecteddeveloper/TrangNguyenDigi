import { SiteHeader } from "@/app/(layer2)/_components/SiteHeader";
import { HomepageStage } from "@/app/(layer1)/_components/HomepageStage";

// Homepage (Layer 1 — Entry). Sân khấu editorial tối theo
// TEMPLATE/homepage/homepage_desktop.png. Navbar kế thừa SiteHeader của L2
// (không viết lại). HomepageStage chọn nhánh: desktop (≥1024px + WebGL) → scene
// 3D Three.js (M3.3); mobile/tablet → fallback 2.5D computer.png trên bàn CSS
// (M3.4) — three KHÔNG nạp trên mobile. Bấm máy / CTA → /exams (proxy đẩy /login
// nếu chưa auth).
export default function Home() {
  return (
    // Container khóa đúng 1 viewport (h-[100dvh]) + overflow-hidden → không
    // scrollbar dọc (header có border-b 1px nên tránh tính calc thủ công).
    // Header trong flow + main flex-1 min-h-0 cho Canvas WebGL chiều cao xác định.
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#0d0d11]">
      <SiteHeader />
      <main className="relative min-h-0 flex-1">
        <HomepageStage />
      </main>
    </div>
  );
}
