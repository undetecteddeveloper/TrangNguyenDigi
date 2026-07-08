"use client";

// HomeHeader — navbar cho UI Layer 1 (Homepage/Entry). Khác navbar L2:
// các mục là thẻ <a> độc lập — "Về chúng tôi" (link) + "Tài khoản" (dropdown:
// Đăng ký, Đăng nhập). Dùng token --nav-* (mặc định root, nền tối của hero L1).
// Không kế thừa "Menu" của SiteHeader L2 (khách chưa đăng nhập, nhu cầu khác).

import Link from "next/link";
import { useState } from "react";

export function HomeHeader() {
  const [acctOpen, setAcctOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-[var(--nav-fg)]"
        >
          Trạng Nguyên
        </Link>

        <nav className="flex items-center gap-6">
          {/* Thẻ <a> độc lập — Về chúng tôi. */}
          <Link
            href="#"
            className="eyebrow text-[var(--nav-fg-muted)] transition-colors hover:text-[var(--nav-fg)]"
          >
            Về chúng tôi
          </Link>

          {/* Tài khoản — dropdown: Đăng ký / Đăng nhập. */}
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={acctOpen}
              onClick={() => setAcctOpen((v) => !v)}
              className="flex items-center gap-2 py-2"
            >
              <span className="eyebrow text-[var(--nav-fg-muted)]">
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
