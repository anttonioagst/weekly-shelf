import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
    <html lang="en">
      <body>
        <main>
          <header>
            <strong>Weekly shelf</strong>
            <nav>
              <Link href="/">Home</Link>
              <Link href="/rules">Rules</Link>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
