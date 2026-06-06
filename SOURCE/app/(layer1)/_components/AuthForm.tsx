// UI Layer 1 — Form login/signup tối giản (GĐ 2 M2.4). Chưa style — GĐ 3 mới làm đẹp.
"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "../actions";

export function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    null,
  );

  return (
    <div>
      <h1>{mode === "signin" ? "Đăng nhập" : "Đăng ký"}</h1>

      <form action={formAction}>
        {mode === "signup" && (
          <div>
            <label htmlFor="displayName">Tên hiển thị</label>
            <input id="displayName" name="displayName" type="text" />
          </div>
        )}
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Mật khẩu</label>
          <input id="password" name="password" type="password" required />
        </div>

        {state?.error && <p role="alert">{state.error}</p>}

        <button type="submit" disabled={pending}>
          {pending
            ? "Đang xử lý…"
            : mode === "signin"
              ? "Đăng nhập"
              : "Đăng ký"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin"
          ? "Chưa có tài khoản? Đăng ký"
          : "Đã có tài khoản? Đăng nhập"}
      </button>
    </div>
  );
}
