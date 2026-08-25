import type { Metadata, Viewport } from "next";
import { RowsIcon } from "@phosphor-icons/react/ssr";
import StripeMark from "@thesvg/react/stripe";
import { Nunito } from "next/font/google";
import Link from "next/link";
import { SiteNav } from "./site-nav";
import { VisitorCount } from "./visitor-count";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-nunito",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Weekly shelf",
  description:
    "A weekly shelf for App Store apps, Play Store apps, and sites. Pay the current price. Take #1 this week. Next move costs $1 more. Resets Monday 00:00 UTC. No clicks, SEO, or installs guaranteed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <header className="site-header">
          <Link href="/" className="wordmark">
            <RowsIcon size={18} weight="bold" aria-hidden />
            Weekly shelf
          </Link>
          <div className="header-end">
            <VisitorCount />
            <SiteNav />
          </div>
        </header>
        <main>
          {children}
          <footer className="site-footer">
            <p className="with-icon">
              <StripeMark variant="mono" width={15} height={15} className="brand-mark brand-mark-mono" aria-hidden />
              Checkout by Stripe. No traffic guaranteed.
            </p>
            <p className="footer-links">
              <Link href="/">Board</Link>
              <Link href="/categories">Categories</Link>
              <Link href="/about">About</Link>
              <Link href="/rules">Rules</Link>
              <Link href="/stats">Stats</Link>
            </p>
          </footer>
        </main>
      </body>
    </html>
  );
}
