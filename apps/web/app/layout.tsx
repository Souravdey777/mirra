import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const defaultSiteUrl = "https://mirra-web.vercel.app";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? defaultSiteUrl;
const metadataBase = new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`);

const title = "Mirra - Grow your presence without losing your voice";
const description =
  "Join the waitlist for Mirra, the AI writing companion that turns rough ideas into LinkedIn and X posts that still sound like you.";
const ogImage = {
  url: "/images/mirra-og-launch.png",
  width: 1200,
  height: 630,
  alt: "Mirra standing beside launch copy for an AI writing companion waitlist"
};

export const metadata: Metadata = {
  metadataBase,
  applicationName: "Mirra",
  title: {
    default: title,
    template: "%s | Mirra"
  },
  description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Mirra",
    type: "website",
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage.url]
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
