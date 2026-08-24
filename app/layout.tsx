import type { Metadata } from "next";
import { CreditCardIcon, RowsIcon } from "@phosphor-icons/react/ssr";
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

export const metadata: Metadata = {
  title: "Weekly shelf",
  description:
    "Pay the current price. Your app or site goes to #1 this week. Next move costs $1 more. Resets Monday 00:00 UTC. No clicks, SEO, or installs guaranteed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <main>
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
          {children}
          <footer className="site-footer">
            <p className="with-icon">
              <CreditCardIcon size={15} weight="bold" aria-hidden />
              Checkout by Polar. No traffic guaranteed.
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
