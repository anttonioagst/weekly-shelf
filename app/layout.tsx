import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-fraunces",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
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
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
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
