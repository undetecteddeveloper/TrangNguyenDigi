import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Root nằm ở thư mục cha (TrangNguyenDigi) để Turbopack/next-font đọc được
  // font trong `ASSETS/` — theo UI-LAYER-MAP Mục 11 (static asset sống ở ASSETS/).
  turbopack: {
    root: path.join(process.cwd(), ".."),
  },
  // mupdf (WASM) + sharp (native) KHÔNG được để Turbopack bundle vào server
  // build — phải require ở runtime, nếu không file .wasm/.node không nạp được
  // (mupdf.Document.openDocument throw → "the PDF could not be read").
  serverExternalPackages: ["mupdf", "sharp"],
  // UGC upload (extractAndAssemble) gửi 2 file tới LIMITS.MAX_FILE_BYTES=15MB
  // mỗi file qua Server Action — mặc định Next.js chỉ cho 1MB/request.
  experimental: {
    serverActions: {
      bodySizeLimit: "35mb",
    },
  },
};

export default nextConfig;
