import type { Metadata } from "next";
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
  title: "Polar Coordinates Simulator",
  description: "Interactive simulator showing the relationship between Cartesian and polar coordinates for circular motion with a freely movable pole",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Inline script runs before React hydrates to prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var s=localStorage.getItem('kinelab-theme');if(s==='dark'||(!s&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')})()` }} />
        {children}
      </body>
    </html>
  );
}
