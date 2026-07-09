"use client";

// HomeHeader — navbar cho UI Layer 1 (Homepage/Entry). Khác navbar L2:
// mục "Về chúng tôi" là thẻ <a> độc lập. "Tài khoản" dùng AccountMenu dùng
// chung (components/shared) — chưa đăng nhập: Đăng ký/Đăng nhập; đã đăng
// nhập: avatar + Chỉnh sửa/Đăng xuất. Dùng token --nav-* (mặc định root,
// nền tối của hero L1). Không kế thừa "Menu" của SiteHeader L2.

import Link from "next/link";
import { AccountMenu, type MenuUser } from "@/components/shared/AccountMenu";

export function HomeHeader({ user = null }: { user?: MenuUser | null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur">
      {/* Bố cục header = 2 item ngang hàng cho flexbox: logo (item 1) và
          TOÀN BỘ khối nav (item 2, một block duy nhất) — justify-between đẩy
          2 item ra 2 mép (chỉ còn padding container, không có khoảng đệm dư
          thừa) — đúng chuẩn phổ biến (vd navbar Google: logo sát trái, nav
          sát phải). */}
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* shrink-0 + whitespace-nowrap: logo không bao giờ wrap dòng dù nav
            chiếm nhiều chỗ hơn (gap-[12vw]) — padding mobile giảm (px-4) để
            nhường đủ không gian, thay vì để logo tự vỡ dòng. */}
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap font-serif text-lg tracking-tight text-[var(--nav-fg)]"
        >
          Trạng Nguyên
        </Link>

        {/* Khối nav — một item duy nhất ở cấp header. Khoảng cách GIỮA các
            thẻ = gap-[12vw] đồng bộ (12% chiều ngang màn hình) — thay cho
            cách cũ "mỗi thẻ rộng 8vw" (box rộng khác nhau giữa text-item và
            avatar khiến khoảng trống nhìn KHÔNG đều — engineer phát hiện).
            Item giờ tự nhiên theo nội dung (auto width), gap lo hết khoảng
            cách nên luôn đều nhau bất kể item là text hay avatar. */}
        <nav className="flex items-center gap-[12vw]">
          {/* Thẻ <a> độc lập — Về chúng tôi. */}
          <Link
            href="#"
            className="eyebrow whitespace-nowrap text-[var(--nav-fg-muted)] transition-colors hover:text-[var(--nav-fg)] max-sm:text-[10px] max-sm:tracking-[0.04em]"
          >
            Về chúng tôi
          </Link>

          <AccountMenu user={user} />
        </nav>
      </div>
    </header>
  );
}
