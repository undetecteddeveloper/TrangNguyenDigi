import type { Metadata } from "next";
import { Geist_Mono, Source_Serif_4, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

// Font theo DESIGN.md ("Mực & Sơn mài") — đồng bộ TOÀN site (S#17):
// Source Serif 4 cho display/h1/h2/quote (--font-serif/--font-heading),
// Be Vietnam Pro cho body/label-caps (--font-sans). Geist Mono giữ cho
// --font-mono (timer MM:SS, nhãn chữ cái A/B/C/D). Merriweather + Geist Sans
// đã gỡ khỏi bundle (TTF Merriweather vẫn nằm trong ASSETS/fonts).
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "vietnamese"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
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
      className={`${geistMono.variable} ${sourceSerif.variable} ${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
