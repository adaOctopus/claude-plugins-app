import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
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
    default: "plugsville — Claude Plugin for Engineers | Context Engineering",
    template: "%s | plugsville",
  },
  description:
    "Automated context-gathering and prompt-engineering for engineers. Jira, Slack, GitHub, docs — accurate AI output, dashboard inside Claude.",
  keywords: [
    "Claude plugin for developers",
    "AI context engineering",
    "CRISPE prompt framework",
    "AI fatigue",
    "context switching remote work",
    "Jira Slack GitHub integration",
    "LLM spirals",
    "CI failure AI assistant",
    "Anthropic AI research",
    "context engineer plugin",
  ],
  openGraph: {
    title: "plugsville — Claude Plugin for Engineers",
    description:
      "Gathers all context, engineers advanced prompts, delivers high-quality output. Approve or reject — no iterations.",
    url: APP_URL,
    siteName: "plugsville",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "plugsville — Claude Plugin for Engineers",
    description:
      "All context gathered. Advanced prompts built. Approve the output — skip the LLM spirals.",
  },
  robots: {
    index: true,
    follow: true,
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
