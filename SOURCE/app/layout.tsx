import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

// Merriweather (serif) — font đọc cho Layer 2 "tờ giấy trắng / focused".
// Variable font sống trong ASSETS/ theo UI-LAYER-MAP Mục 11 (không copy vào public).
const merriweather = localFont({
  src: "../../ASSETS/fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf",
  variable: "--font-merriweather",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrangNguyenDigi",
  description: "Nền tảng luyện đề thi trực tuyến cho học sinh THCS và THPT Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
