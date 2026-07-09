"use client";

// AccountMenu — dropdown "Tài khoản" DÙNG CHUNG cho mọi UI Layer (SiteHeader
// L2/3/4; L1 dùng ô account riêng trong HomeSidebar). Module IAM (Logic Layer 1):
//  - Chưa đăng nhập: giữ nguyên hành vi cũ — Đăng ký / Đăng nhập.
//  - Đã đăng nhập: avatar (icon blank-user-circles, ASSETS/images) thay chữ
//    "Tài khoản" → dropdown CĂN GIỮA gồm tên hiện tại, "Chỉnh sửa" (đổi tên
//    hiển thị NGAY trong dropdown, không chuyển trang) + "Đăng xuất".
//  - Ràng buộc tên hiển thị: tối đa 12 ký tự, chỉ chữ cái (kể cả có dấu) và
//    dấu chấm — lọc ngay lúc gõ (client) + validate lại ở updateProfile
//    (server, authoritative, chống bypass).
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, updateProfile, type AuthState } from "@/app/(layer1)/actions";

export type MenuUser = { displayName: string };

export function AccountMenu({ user }: { user: MenuUser | null }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [draft, setDraft] = useState(displayName);
  const router = useRouter();
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updateProfile,
    null,
  );
  const wasPending = useRef(false);

  // Sau khi Server Action chạy xong (pending true → false) mà không lỗi: chốt
  // tên mới vào state hiển thị, đóng form edit, và đồng bộ lại data server
  // (router.refresh) — đảm bảo dữ liệu thực sự ghi xuống DB, không chỉ ảo client.
  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      setDisplayName(draft);
      setEditing(false);
      router.refresh();
    }
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  function close() {
    setOpen(false);
    setEditing(false);
  }

  if (!user) {
    return (
      <div className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 whitespace-nowrap py-2"
        >
          <span className="eyebrow text-[var(--nav-fg-muted)] max-sm:text-[10px] max-sm:tracking-[0.04em]">
            Tài khoản
          </span>
          <Chevron open={open} />
        </button>

        {open && (
          <>
            <button
              aria-hidden
              tabIndex={-1}
              onClick={close}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div
              role="menu"
              className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-card py-1"
            >
              <Link
                role="menuitem"
                href="/?auth=signup"
                onClick={close}
                className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                Đăng ký
              </Link>
              <Link
                role="menuitem"
                href="/?auth=signin"
                onClick={close}
                className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                Đăng nhập
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        aria-label="Tài khoản"
        className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
      >
        <Image
          src="/images/user-avatar-placeholder.png"
          alt=""
          width={28}
          height={28}
          className="rounded-full"
        />
      </button>

      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card p-1"
          >
            {!editing ? (
              <>
                <p className="truncate px-3 py-2 text-center text-sm font-medium text-foreground">
                  {displayName}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(displayName);
                    setEditing(true);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-center text-sm text-foreground transition-colors hover:bg-accent"
                >
                  Chỉnh sửa
                </button>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="block w-full rounded-md px-3 py-2 text-center text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    Đăng xuất
                  </button>
                </form>
              </>
            ) : (
              <form
                action={formAction}
                className="flex flex-col items-center gap-2 p-2"
              >
                <label htmlFor="account-menu-display-name" className="sr-only">
                  Tên hiển thị
                </label>
                <input
                  id="account-menu-display-name"
                  name="displayName"
                  value={draft}
                  onChange={(e) => {
                    // Ràng buộc: tối đa 12 ký tự, chỉ chữ cái (kể cả có dấu) và
                    // dấu chấm — lọc ngay lúc gõ để không cho nhập ký tự sai.
                    const filtered = e.target.value
                      .replace(/[^\p{L}.]/gu, "")
                      .slice(0, 12);
                    setDraft(filtered);
                  }}
                  maxLength={12}
                  autoFocus
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-center text-sm text-foreground outline-none focus:border-brand"
                />
                <p className="px-1 text-center text-[0.65rem] text-muted-foreground">
                  Tối đa 12 ký tự, chỉ chữ cái và dấu chấm.
                </p>
                {state?.error && (
                  <p className="px-1 text-center text-xs text-destructive">
                    {state.error}
                  </p>
                )}
                <div className="flex w-full gap-2">
                  <button
                    type="submit"
                    disabled={pending || draft.length === 0}
                    className="flex-1 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {pending ? "Đang lưu…" : "Lưu"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 8"
      className={`size-3 text-[var(--nav-fg-muted)] transition-transform ${
        open ? "rotate-180" : ""
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
  );
}
