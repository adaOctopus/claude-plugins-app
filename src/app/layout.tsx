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
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://projectx.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Project X — Claude Plugins for Developers | Context Engineering",
    template: "%s | Project X",
  },
  description:
    "Claude plugins that gather context from Jira, Slack, and GitHub. Deliver tasks faster, fix CI failures, and eliminate Slack anxiety. Built for remote engineers.",
  keywords: [
    "Claude plugin for developers",
    "AI context engineering",
    "Jira Slack GitHub integration",
    "CI failure AI assistant",
    "remote work productivity",
    "Slack anxiety",
    "Claude MCP dashboard",
    "context engineer plugin",
  ],
  openGraph: {
    title: "Project X — Claude Plugins that do your work extremely well",
    description:
      "Gathers context from Jira, Slack, GitHub and docs so AI delivers your tasks accurately.",
    url: APP_URL,
    siteName: "Project X",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project X — Claude Plugins for Engineers",
    description:
      "Work less. Let AI gather context from Jira, Slack, and GitHub.",
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
