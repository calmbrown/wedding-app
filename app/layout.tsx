import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://calmbrown.github.io/wedding-app"),
  title: "김태민 ♥ 김지현 결혼합니다",
  description: "2026년 6월 21일 일요일 오후 3시 30분 · 로프트가든344",
  openGraph: {
    title: "김태민 ♥ 김지현 결혼합니다",
    description: "2026년 6월 21일 일요일 오후 3시 30분 · 로프트가든344",
    url: "https://calmbrown.github.io/wedding-app",
    siteName: "태민 ♥ 지현 청첩장",
    images: [
      {
        url: "/og-image-v2.jpeg",
        width: 800,
        height: 1200,
        alt: "김태민 김지현 웨딩 사진",
      },
    ],
    locale: "ko_KR",
    type: "website",
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
