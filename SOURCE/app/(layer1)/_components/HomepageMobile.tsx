// HomepageMobile — fallback 2.5D cho viewport < 1024px / không WebGL (M3.4).
// Three.js KHÔNG nạp ở nhánh này (xem HomepageStage). Visual language Layer 1
// (Spatial) tái hiện bằng HTML/CSS thuần: chiếc bàn gỗ faux-3D (mặt bàn phối
// cảnh + 4 chân, agent tự vẽ) với máy AIO (computer.png) đặt trên mặt bàn và
// CTA đè chính giữa máy. Nhẹ, SSR ra HTML thật (tốt SEO, không layout shift).

import Image from "next/image";
import Link from "next/link";

// Tông gỗ trầm cho bàn — đồng bộ với editorial dark của homepage (#0d0d11).
const WOOD_TOP = "linear-gradient(180deg, #5b4636 0%, #40342780 100%)";
const WOOD_EDGE = "linear-gradient(180deg, #342a1f, #271e16)";
const LEG_FRONT = "linear-gradient(180deg, #342a1f, #1f1810)";
const LEG_BACK = "linear-gradient(180deg, #2a2118, #181109)";

export function HomepageMobile() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6">
      {/* SEO: tiêu đề crawlable (scene không index được — PROJECT_OVERVIEW Mục 8). */}
      <h1 className="sr-only">
        TrạngNguyênDigi — Nền tảng luyện đề thi trực tuyến cho học sinh THCS và
        THPT
      </h1>

      {/* Sân khấu: máy đặt trên bàn. */}
      <div className="relative w-[min(78vw,300px)]">
        {/* Quầng sáng xanh nhạt sau máy — mô phỏng ánh màn hình, tạo chiều sâu.
            Đặt trong sân khấu để luôn bám theo máy. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 z-0 h-64 w-64 -translate-x-1/2 -translate-y-[28%] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(120,150,220,0.22), transparent 70%)",
          }}
        />
        {/* Máy AIO + CTA đè giữa. z cao hơn bàn để "đứng trên" mặt bàn. */}
        <div className="relative z-20 mx-auto w-[58%]">
          <Image
            src="/images/computer.png"
            alt="Máy tính — chạm để vào luyện đề"
            width={256}
            height={256}
            priority
            className="h-auto w-full select-none drop-shadow-[0_12px_26px_rgba(0,0,0,0.55)]"
          />
          {/* CTA căn vào tâm MÀN HÌNH của ảnh (≈38% chiều cao tính từ trên —
              ảnh gồm cả chân đế nên tâm màn hình cao hơn tâm ảnh). Nhỏ hơn ~10%. */}
          <Link
            href="/exams"
            className="absolute left-1/2 top-[38%] z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand px-[18px] py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-brand-foreground shadow-lg shadow-black/40 transition-transform active:scale-95"
          >
            Vào học →
          </Link>
        </div>

        {/* Bàn gỗ faux-3D (4 chân). Kéo lên dưới máy để máy "ngồi" trên mặt bàn;
            overlap tăng (-mt-6 → -mt-[33px]) đẩy máy nhích lên/forward ~5%. */}
        <div className="relative -mt-[33px] h-[132px] w-full">
          {/* Mặt bàn — trapezoid phối cảnh (hẹp ở sau, rộng ở trước). */}
          <div
            className="absolute left-0 top-0 h-[56px] w-full"
            style={{
              clipPath: "polygon(14% 0, 86% 0, 100% 100%, 0 100%)",
              background: WOOD_TOP,
            }}
          />
          {/* Cạnh trước (độ dày mặt bàn). */}
          <div
            className="absolute left-0 top-[52px] h-[13px] w-full rounded-b-[2px]"
            style={{ background: WOOD_EDGE }}
          />
          {/* 4 chân: trước (đậm, ra ngoài) + sau (mảnh, tối, thụt vào — chiều sâu). */}
          <div
            className="absolute left-[3%] top-[62px] h-[70px] w-[10px] rounded-b-sm"
            style={{ background: LEG_FRONT }}
          />
          <div
            className="absolute right-[3%] top-[62px] h-[70px] w-[10px] rounded-b-sm"
            style={{ background: LEG_FRONT }}
          />
          <div
            className="absolute left-[17%] top-[58px] h-[58px] w-[8px] rounded-b-sm"
            style={{ background: LEG_BACK }}
          />
          <div
            className="absolute right-[17%] top-[58px] h-[58px] w-[8px] rounded-b-sm"
            style={{ background: LEG_BACK }}
          />
        </div>

        {/* Bóng đổ mềm dưới bàn. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-1 left-1/2 h-5 w-[76%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-md"
        />
      </div>
    </div>
  );
}
