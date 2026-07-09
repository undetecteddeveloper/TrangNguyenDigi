// UI Layer 1 — Card đăng nhập / đăng ký (GĐ 3 Polish, S#15).
// Bố cục theo TEMPLATE/homepage/signup_login_page_form.jpe (panel tab trái +
// form phải). Màu TRẮNG/ĐEN tạm thời (engineer chốt — không bê tông hồng
// template). Logic giữ nguyên: signIn/signUp Server Actions (L1).
// Google/Facebook + "Quên mật khẩu" = placeholder disabled (chưa có OAuth/reset).
"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "../actions";

type Mode = "signin" | "signup";

export function AuthForm({ initialMode = "signin" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    null,
  );

  const isSignup = mode === "signup";

  return (
    <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:flex-row">
      {/* ---------- Panel trái: tabs (đen) ---------- */}
      <div className="relative flex overflow-hidden bg-neutral-900 p-6 sm:w-2/5 sm:flex-col sm:justify-center sm:p-8">
        {/* Hình mũi tên hình học tái hiện bằng CSS (tông xám, tiết chế). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
        >
          <div className="absolute -left-10 top-1/4 size-40 rotate-45 border-[16px] border-white" />
          <div className="absolute left-4 top-1/2 size-28 rotate-45 border-[12px] border-white" />
        </div>

        <div className="relative flex gap-3 sm:flex-col sm:gap-2">
          <TabButton
            active={!isSignup}
            onClick={() => setMode("signin")}
            label="Đăng nhập"
          />
          <TabButton
            active={isSignup}
            onClick={() => setMode("signup")}
            label="Đăng ký"
          />
        </div>
      </div>

      {/* ---------- Panel phải: form (trắng) ---------- */}
      <div className="flex-1 px-7 py-9 sm:px-10">
        {/* Avatar tròn */}
        <div className="mb-5 flex justify-center">
          <div className="grid size-16 place-items-center rounded-full bg-neutral-900 text-white shadow-md">
            <UserIcon className="size-8" />
          </div>
        </div>

        <h1 className="mb-7 text-center text-2xl font-serif tracking-wide text-neutral-900">
          {isSignup ? "Đăng ký" : "Đăng nhập"}
        </h1>

        <form action={formAction}>
          {/* Key theo mode → field animate khi chuyển tab; "Tên hiển thị"
              xuất hiện/ẩn tự nhiên theo remount. */}
          <div
            key={mode}
            className="space-y-5 duration-300 animate-in fade-in slide-in-from-right-3"
          >
            {isSignup && (
              <Field
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Tên hiển thị"
                icon={<UserIcon className="size-4" />}
              />
            )}
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              icon={<MailIcon className="size-4" />}
            />
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Mật khẩu"
              required
              icon={<LockIcon className="size-4" />}
            />
          </div>

          {state?.error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {state.error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              disabled
              title="Chức năng đang phát triển"
              className="cursor-not-allowed text-xs text-neutral-400"
            >
              Quên mật khẩu?
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-neutral-900 px-7 py-2.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-neutral-700 disabled:opacity-60"
            >
              {pending ? "Đang xử lý…" : isSignup ? "Đăng ký" : "Đăng nhập"}
            </button>
          </div>
        </form>

        {/* Social — placeholder disabled */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-neutral-200 pt-5 text-xs text-neutral-500 sm:flex-row sm:justify-between">
          <span>Hoặc {isSignup ? "đăng ký" : "đăng nhập"} với</span>
          <div className="flex items-center gap-4">
            <SocialButton
              label="Google"
              icon={<GoogleIcon className="size-4" />}
            />
            <SocialButton
              label="Facebook"
              icon={<FacebookIcon className="size-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 sm:-mr-8 sm:rounded-l-full sm:rounded-r-none sm:py-2.5 sm:text-left ${
        active
          ? "bg-white text-neutral-900 shadow"
          : "text-white/55 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function Field({
  id,
  name,
  type,
  placeholder,
  icon,
  required,
}: {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 border-b border-neutral-300 pb-1 text-neutral-500 transition-colors focus-within:border-neutral-900 focus-within:text-neutral-900"
    >
      <span className="shrink-0">{icon}</span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent py-2 text-neutral-900 outline-none placeholder:text-neutral-400"
      />
    </label>
  );
}

function SocialButton({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled
      title="Chức năng đang phát triển"
      className="flex cursor-not-allowed items-center gap-1.5 text-neutral-600 opacity-70"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ---------- Inline SVG icons (đồng bộ style SVG của SiteHeader) ---------- */

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect
        x="4"
        y="10"
        width="16"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 11v3h4.2c-.5 1.6-1.9 2.7-4.2 2.7A4.7 4.7 0 0 1 12 7.3c1.2 0 2.3.5 3 1.2l2.1-2.1A7.6 7.6 0 0 0 12 4a8 8 0 1 0 0 16c4.6 0 7.7-3.2 7.7-7.8 0-.5 0-.9-.1-1.2H12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M14 8.5V7c0-.7.3-1 1-1h1.5V3H14c-2.2 0-3.5 1.3-3.5 3.7V8.5H8.5v3h2V21h3.5v-9.5H17l.5-3H14Z"
        fill="currentColor"
      />
    </svg>
  );
}
