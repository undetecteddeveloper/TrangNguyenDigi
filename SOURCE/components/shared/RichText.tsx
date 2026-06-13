"use client";

// RichText — render nội dung markdown + LaTeX (GĐ 3 M3.1 Task 5).
// Dùng cho nội dung câu hỏi và lựa chọn đáp án (Layer 2), tái dùng được cho layer khác.
// Pipeline: remark-gfm (markdown mở rộng) + remark-math (cú pháp $…$, $$…$$)
//           → rehype-katex (render công thức bằng KaTeX).
// `inline` = true: bỏ thẻ <p> bao quanh (dùng trong nhãn lựa chọn, không xuống dòng block).

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const INLINE_COMPONENTS: Components = {
  // Gỡ <p> để text chảy inline trong nhãn lựa chọn (vẫn giữ math/format con).
  p: ({ children }) => <>{children}</>,
};

interface RichTextProps {
  /** Chuỗi nguồn (markdown + LaTeX). */
  text: string;
  /** Class cho wrapper — typography do parent quyết định (serif/size…). */
  className?: string;
  /** Inline (lựa chọn đáp án) thay vì block (nội dung câu hỏi). */
  inline?: boolean;
}

export function RichText({ text, className, inline = false }: RichTextProps) {
  const markdown = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={inline ? INLINE_COMPONENTS : undefined}
    >
      {text}
    </ReactMarkdown>
  );

  if (inline) {
    return <span className={className}>{markdown}</span>;
  }
  return <div className={className}>{markdown}</div>;
}
