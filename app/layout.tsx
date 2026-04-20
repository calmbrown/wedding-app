import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
});

export const metadata: Metadata = {
  title: "김태민 ♥ 김지현 결혼합니다",
  description: "2026년 6월 21일 일요일 오후 3시 30분 로프트가든344",
  openGraph: {
    title: "김태민 ♥ 김지현 결혼합니다",
    description: "2026년 6월 21일 일요일 오후 3시 30분 로프트가든344",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKR.variable}`}>
      <body className="min-h-full antialiased" style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}>
        {children}
      </body>
    </html>
  );
}
