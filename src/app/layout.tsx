import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SEO_DEFAULTS } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://plugsville.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: SEO_DEFAULTS.title,
    template: "%s | plugsville",
  },
  description: SEO_DEFAULTS.description,
  keywords: [...SEO_DEFAULTS.keywords],
  alternates: {
    canonical: APP_URL,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "1024x1024" },
      { url: "/plugsville-mark.png", type: "image/png", sizes: "1024x1024" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "1024x1024", type: "image/png" }],
    shortcut: "/plugsville-mark.png",
  },
  openGraph: {
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    url: APP_URL,
    siteName: "plugsville",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-plugsville.png",
        width: 1200,
        height: 630,
        alt: "plugsville",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    images: ["/og-plugsville.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <JsonLd />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
