import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Root nằm ở thư mục cha (TrangNguyenDigi) để Turbopack/next-font đọc được
  // font trong `ASSETS/` — theo UI-LAYER-MAP Mục 11 (static asset sống ở ASSETS/).
  turbopack: {
    root: path.join(process.cwd(), ".."),
  },
};

export default nextConfig;
