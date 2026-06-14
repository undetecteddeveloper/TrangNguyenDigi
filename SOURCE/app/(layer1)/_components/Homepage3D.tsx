"use client";

// Homepage3D — ranh giới client cho sân khấu 3D. Dùng next/dynamic ssr:false để
// Canvas (WebGL) chỉ mount ở browser, tránh lỗi SSR. ssr:false chỉ hợp lệ trong
// Client Component nên file này phải "use client".

import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-600">
        Đang dựng cảnh…
      </span>
    </div>
  ),
});

export function Homepage3D() {
  return <Scene3D />;
}
