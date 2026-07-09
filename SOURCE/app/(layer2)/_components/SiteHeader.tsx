"use client";

// SiteHeader — navbar DÙNG CHUNG cho UI Layer 2/3/4 (KHÔNG dùng cho L1 — L1 có
// HomeHeader riêng). Các thẻ nav độc lập: "Phân tích" (→ L3), "Nhập đề" (→ L4),
// "Tài khoản" (dropdown: Đăng ký / Đăng nhập). Nền theo token --nav-* (navy ở L2
// qua .theme-l2; L3/L4 khi build sẽ bọc theme tương tự để đồng bộ).

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [acctOpen, setAcctOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur">
      {/* Bố cục header = 2 item ngang hàng cho flexbox: logo (item 1) và
          TOÀN BỘ khối nav (item 2, một block duy nhất) — justify-between đẩy
          2 item ra 2 mép (chỉ còn padding container, không có khoảng đệm dư
          thừa) — đúng chuẩn phổ biến (vd navbar Google: logo sát trái, nav
          sát phải). */}
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-[var(--nav-fg)]"
        >
          Trạng Nguyên
        </Link>

        {/* Khối nav — một item duy nhất ở cấp header. Bên trong, các thẻ
            con dùng gap chuẩn phổ biến (rem, không stretch/justify-around
            trên toàn header). Mỗi thẻ vẫn rộng 8vw ở desktop (min 5.5rem)
            — yêu cầu "thẻ nav = 8% chiều dài màn hình". */}
        <nav className="flex items-center gap-6 sm:gap-8">
          {/* Thẻ <a> độc lập — Phân tích (Layer 3) + Nhập đề (Layer 4). */}
          <Link
            href="/me/dashboard"
            className="eyebrow flex items-center justify-center whitespace-nowrap text-[var(--nav-fg-muted)] transition-colors hover:text-[var(--nav-fg)] max-sm:text-[10px] max-sm:tracking-[0.04em] sm:w-[8vw] sm:min-w-[5.5rem]"
          >
            Phân tích
          </Link>
          <Link
            href="/admin/import"
            className="eyebrow flex items-center justify-center whitespace-nowrap text-[var(--nav-fg-muted)] transition-colors hover:text-[var(--nav-fg)] max-sm:text-[10px] max-sm:tracking-[0.04em] sm:w-[8vw] sm:min-w-[5.5rem]"
          >
            Nhập đề
          </Link>

          {/* Tài khoản — dropdown: Đăng ký / Đăng nhập. */}
          <div className="relative sm:w-[8vw] sm:min-w-[5.5rem]">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={acctOpen}
              onClick={() => setAcctOpen((v) => !v)}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap py-2"
            >
              <span className="eyebrow text-[var(--nav-fg-muted)] max-sm:text-[10px] max-sm:tracking-[0.04em]">
                Tài khoản
              </span>
              <svg
                aria-hidden
                viewBox="0 0 12 8"
                className={`size-3 text-[var(--nav-fg-muted)] transition-transform ${
                  acctOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M1 1.5 6 6.5 11 1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {acctOpen && (
              <>
                {/* Backdrop bắt click ngoài để đóng. */}
                <button
                  aria-hidden
                  tabIndex={-1}
                  onClick={() => setAcctOpen(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div
                  role="menu"
                  className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-sm"
                >
                  <Link
                    role="menuitem"
                    href="/login?mode=signup"
                    onClick={() => setAcctOpen(false)}
                    className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    Đăng ký
                  </Link>
                  <Link
                    role="menuitem"
                    href="/login"
                    onClick={() => setAcctOpen(false)}
                    className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    Đăng nhập
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
