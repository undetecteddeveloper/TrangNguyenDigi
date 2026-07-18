import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Nền test cho MS-MOLAR. Mặc định môi trường node (module thuần lib/ugc);
// test component (RichText/QuestionFigure) tự khai `// @vitest-environment jsdom`
// ở docblock đầu file. Alias "@/..." khớp tsconfig paths.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.{ts,tsx}", "components/**/*.test.{ts,tsx}"],
  },
});
