import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DEFAULT_THEME, themeInitScript } from "@/lib/theme";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import "./home.css";
import "./readability.css";
import "./case-study.css";
import "./studio.css";
import "./studio-chrome.css";
import "./design-study/motion.css";
import "./technology.css";
import "./theme.css";
import "./application-scene.css";

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
  themeColor: "#11161d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
