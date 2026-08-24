"use client";

import {
  InfoIcon,
  RowsIcon,
  ScrollIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Board", Icon: RowsIcon },
  { href: "/categories", label: "Categories", Icon: SquaresFourIcon },
  { href: "/about", label: "About", Icon: InfoIcon },
  { href: "/rules", label: "Rules", Icon: ScrollIcon },
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
            <link.Icon size={16} weight="bold" aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
