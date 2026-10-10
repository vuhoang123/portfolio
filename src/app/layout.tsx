import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import "./home.css";
import "./selected-work.css";
import "./readability.css";
import "./experience.css";
import "./case-study.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://hoang-anh-vu-portfolio.quiet-crane-9559.chatgpt.site",
  ),
  title: {
    default: "Hoàng Anh Vũ — Full-stack Engineer",
    template: "%s — Hoàng Anh Vũ",
  },
  description:
    "Customer-facing interfaces, admin systems, and enterprise applications. Selected work by Hoàng Anh Vũ, a full-stack engineer based in Ho Chi Minh City.",
  keywords: [
    "Hoang Anh Vu",
    "Full-stack Engineer",
    "Frontend Developer",
    "Next.js",
    "Laravel",
    "Vue",
  ],
  openGraph: {
    title: "Hoàng Anh Vũ — Interfaces & Systems",
    description: "Interfaces people use. Systems teams run.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f4ef",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
