"use client";

// HomeStage — content area của homepage (Layer 1, S#17). Hero và AuthForm là
// HAI TRẠNG THÁI của cùng một vùng nội dung (không tách 2 page riêng): cả hai
// cùng mount, xếp chồng trong một grid cell, swap bằng CSS transition
// opacity/translate theo prop `auth` (đọc từ URL `?auth=signin|signup` — server
// page truyền xuống). Điều hướng bằng <Link> soft navigation → component KHÔNG
// remount → transition chạy mượt cả hai chiều. Panel đang ẩn có `inert` (không
// tab/đọc screen-reader vào được). Hướng transition: NGANG phải→trái (engineer
// chốt vòng sửa 1) — hero trượt ra trái, form trượt vào từ phải.
import Link from "next/link";
import { AuthForm } from "./AuthForm";

export type AuthMode = "signin" | "signup" | null;

export function HomeStage({ auth }: { auth: AuthMode }) {
  const showAuth = auth !== null;

  return (
    <div className="relative z-10 my-auto grid w-full">
      {/* ---------- Trạng thái 1: Hero ---------- */}
      <section
        inert={showAuth || undefined}
        className={`col-start-1 row-start-1 max-w-3xl self-center transition-all duration-500 ease-out ${
          showAuth
            ? "pointer-events-none -translate-x-6 opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#6B655C]">
          Online exam practice platform
        </p>
        {/* Copper rule-divider (40px × 2px) — DESIGN.md section-opening mark,
            at most one per viewport. */}
        <div className="mt-4 h-0.5 w-10 bg-[#B8863B]" aria-hidden />

        <h1 className="mt-5 font-serif text-xl leading-[1.2] font-semibold tracking-tight text-[#1B1512] sm:text-3xl lg:text-4xl">
          An Exam Practice Engine Integrated with a Chart-Based Analytics
          System, Capable of Generating New Data from PDF Files
        </h1>

        <p className="mt-5 max-w-xl font-sans text-sm leading-[1.7] text-[#1B1512]/80 sm:text-lg">
          A{" "}
          <span className="border-b-2 border-[#B8863B] pb-0.5 font-medium text-[#1B1512]">
            continuously updated
          </span>{" "}
          question bank for secondary and high school, with{" "}
          <span className="border-b-2 border-[#B8863B] pb-0.5 font-medium text-[#1B1512]">
            instant grading
          </span>{" "}
          and weakness analysis so you study the right things and improve
          faster.
        </p>

        <div className="mt-8">
          <Link
            href="/exams"
            className="group inline-flex items-center gap-3 rounded-[4px] border-2 border-[#1B1512] px-8 py-3 font-sans text-xs font-medium tracking-[0.16em] text-[#1B1512] uppercase transition-colors hover:border-[#A62C2B] hover:bg-[#A62C2B] hover:text-[#EDE1C8]"
          >
            Get started
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ---------- Trạng thái 2: Auth form ---------- */}
      <section
        inert={!showAuth || undefined}
        className={`col-start-1 row-start-1 flex max-w-3xl flex-col self-center transition-all duration-500 ease-out ${
          showAuth
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-6 opacity-0"
        }`}
      >
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 self-start font-sans text-xs font-medium uppercase tracking-[0.16em] text-[#6B655C] transition-colors hover:text-[#1B1512]"
        >
          <span aria-hidden>←</span> Back
        </Link>
        {/* key theo mode: deep-link ?auth=signup mở đúng tab (AuthForm giữ mode
            trong state nội bộ, chỉ đọc initialMode lúc mount). */}
        <AuthForm key={auth ?? "signin"} initialMode={auth ?? "signin"} />
      </section>
    </div>
  );
}
