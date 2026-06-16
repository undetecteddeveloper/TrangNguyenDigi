"use client";

// HomepageStage — chọn nhánh render homepage (M3.4).
//   desktop (≥1024px) + WebGL khả dụng → Homepage3D (scene Three.js, M3.3)
//   còn lại (mobile/tablet/không WebGL) → HomepageMobile (fallback 2.5D CSS)
// Quyết định bằng JS sau hydrate, KHÔNG dùng CSS `hidden`: nhờ vậy Scene3D
// (dynamic ssr:false → kéo theo three) chỉ được *mount* trên desktop → three
// KHÔNG nạp trên mobile (ràng buộc lõi của dự án — PROJECT_OVERVIEW Mục 4/9).
// SSR + lần render client đầu tiên trả về HomepageMobile (HTML thuần): tốt SEO,
// không layout shift trên Android; desktop swap sang 3D sau khi mount.

import { useEffect, useState } from "react";
import { Homepage3D } from "./Homepage3D";
import { HomepageMobile } from "./HomepageMobile";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

export function HomepageStage() {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (desktop && hasWebGL()) setUse3D(true);
  }, []);

  return use3D ? <Homepage3D /> : <HomepageMobile />;
}
