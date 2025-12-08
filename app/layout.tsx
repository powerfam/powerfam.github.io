import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "./providers";
import RippleEffect from "@/components/RippleEffect";
import GlobalProgress from "@/components/GlobalProgress";

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-kr",
});

export const metadata: Metadata = {
  title: "Voti Web",
  description: "보티의 웹페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSerifKR.variable}>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Suspense fallback={null}>
            <GlobalProgress />
          </Suspense>
          <RippleEffect />
          <Header />
          <main className="w-full px-4 py-8 flex-grow text-left">
            {children}
          </main>
          <footer className="text-center py-4 text-sm opacity-60">
            ©{new Date().getFullYear()} Voti
          </footer>
        </Providers>
      </body>
    </html>
  );
}