import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eduardo Andrés Crespo",
  description: "Artist portfolio of Eduardo Andrés Crespo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-30 backdrop-blur-sm" style={{ borderBottom: "1px solid rgba(200, 168, 128, 0.22)", background: "rgba(249, 247, 245, 0.85)" }}>
          <nav className="mx-auto max-w-5xl flex items-center justify-between px-8 py-4">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.2em] font-light transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--warm-nav)" }}
            >
              Works
            </Link>
            <Link
              href="/cv"
              className="text-xs uppercase tracking-[0.2em] font-light transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--warm-nav)" }}
            >
              CV
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
