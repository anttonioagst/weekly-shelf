"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Board" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/rules", label: "Rules" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav>
      {LINKS.map((link) => {
        const on =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link key={link.href} href={link.href} className={on ? "on" : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
