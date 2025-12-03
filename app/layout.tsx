import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-kr",
});

export const metadata: Metadata = {
  title: "Voti test",
  description: "보티 test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSerifKR.variable}>
      <body>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}