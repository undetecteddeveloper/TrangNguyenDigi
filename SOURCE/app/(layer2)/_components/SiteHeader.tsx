"use client";

// SiteHeader — thanh đầu trang cho Layer 2 (logo + dropdown menu).
// Theo TEMPLATE/L2/L2_mobile.png: <logo> trái, <drdown_menu> phải. Nền trắng,
// hairline dưới, sticky. Mobile-first: hoạt động tốt từ 375px.

import Link from "next/link";
import { useState } from "react";
import { signOut } from "@/app/(layer1)/actions";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-[var(--nav-fg)]"
        >
          Trạng Nguyên
        </Link>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 py-2"
          >
            <span className="eyebrow text-[var(--nav-fg-muted)]">Menu</span>
            <svg
              aria-hidden
              viewBox="0 0 12 8"
              className={`size-3 text-[var(--nav-fg-muted)] transition-transform ${
                menuOpen ? "rotate-180" : ""
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

          {menuOpen && (
            <>
              {/* Backdrop bắt click ngoài để đóng menu. */}
              <button
                aria-hidden
                tabIndex={-1}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div
                role="menu"
                className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-sm"
              >
                <Link
                  role="menuitem"
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  Trang chủ
                </Link>
                <Link
                  role="menuitem"
                  href="/exams"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  Đề luyện
                </Link>
                <form action={signOut}>
                  <button
                    role="menuitem"
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    Đăng xuất
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
