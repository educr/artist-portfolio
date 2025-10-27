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
        <header className="border-b border-gray-200 backdrop-blur">
          <nav className="mx-auto max-w-3xl flex items-center justify-between px-8 py-4">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Works
            </Link>
            <Link href="/cv" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              CV
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
