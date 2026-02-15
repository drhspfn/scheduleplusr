import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schedule Plus Reborn",
  description: "Advanced schedule application",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Schedule Plus",
  },
};

export const viewport = {
  themeColor: "#1677ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4618086531881629"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
