// @vitest-environment jsdom

// Task 3.2 (Gate B — phần hình) — image-origin fixtures (ADR-0002 / AC-023).
// Storage-origin render <img> đúng alt; MỌI origin khác (kể cả javascript:,
// data:, URL hỏng, null) render KHÔNG có phần tử hình — fail closed.

import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { isAllowedImageUrl, QuestionFigure } from "../QuestionFigure";

const STORAGE_ORIGIN = "https://test-project.supabase.co";
const STORAGE_URL = `${STORAGE_ORIGIN}/storage/v1/object/public/exam-images/exam-1/q5.png`;

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = STORAGE_ORIGIN;
});

describe("QuestionFigure — origin allowlist", () => {
  it("URL đúng origin Storage → render <img> với alt mặc định non-empty", () => {
    const { container } = render(<QuestionFigure url={STORAGE_URL} questionNumber={5} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe(STORAGE_URL);
    expect(img?.getAttribute("alt")).toBe("Figure for Câu 5");
    expect(img?.getAttribute("alt")?.trim().length).toBeGreaterThan(0);
  });

  it("alt tuỳ chỉnh được dùng; alt rỗng/space fallback về mặc định", () => {
    const custom = render(
      <QuestionFigure url={STORAGE_URL} questionNumber={1} alt="Đồ thị hàm số" />
    );
    expect(custom.container.querySelector("img")?.getAttribute("alt")).toBe("Đồ thị hàm số");
    const blank = render(<QuestionFigure url={STORAGE_URL} questionNumber={2} alt="   " />);
    expect(blank.container.querySelector("img")?.getAttribute("alt")).toBe("Figure for Câu 2");
  });

  it("origin khác → KHÔNG render hình (fail closed)", () => {
    const { container } = render(
      <QuestionFigure url="https://evil.example/exam-images/exam-1/q5.png" questionNumber={5} />
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.innerHTML).toBe("");
  });

  it("subdomain giả mạo → KHÔNG render", () => {
    const { container } = render(
      <QuestionFigure
        url="https://test-project.supabase.co.evil.example/x.png"
        questionNumber={1}
      />
    );
    expect(container.querySelector("img")).toBeNull();
  });

  it("javascript: URL → KHÔNG render", () => {
    const { container } = render(<QuestionFigure url="javascript:alert(1)" questionNumber={1} />);
    expect(container.querySelector("img")).toBeNull();
  });

  it("data: URL → KHÔNG render", () => {
    const { container } = render(
      <QuestionFigure url="data:image/png;base64,iVBORw0KGgo=" questionNumber={1} />
    );
    expect(container.querySelector("img")).toBeNull();
  });

  it("null / undefined / chuỗi rỗng / URL hỏng → KHÔNG render", () => {
    for (const url of [null, undefined, "", "not-a-url", "//evil.example/x.png"]) {
      const { container } = render(<QuestionFigure url={url} questionNumber={1} />);
      expect(container.querySelector("img"), `url=${String(url)}`).toBeNull();
    }
  });
});

describe("isAllowedImageUrl — export tái dùng", () => {
  it("chỉ chấp nhận origin Storage", () => {
    expect(isAllowedImageUrl(STORAGE_URL)).toBe(true);
    expect(isAllowedImageUrl("https://evil.example/x.png")).toBe(false);
    expect(isAllowedImageUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedImageUrl(null)).toBe(false);
    expect(isAllowedImageUrl("")).toBe(false);
  });
});
