"use client";

import {
  CaretDownIcon,
  InfoIcon,
  ListIcon,
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
  const current =
    LINKS.find((link) =>
      link.href === "/"
        ? pathname === "/"
        : pathname === link.href || pathname.startsWith(`${link.href}/`),
    ) ?? LINKS[0];

  return (
    <details className="menu">
      <summary className="menu-toggle">
        <ListIcon size={16} weight="bold" aria-hidden />
        <span className="menu-toggle-label">{current.label}</span>
        <CaretDownIcon size={12} weight="bold" aria-hidden />
      </summary>
      <div className="menu-panel" role="menu">
        {LINKS.map((link) => {
          const on =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              className={on ? "on" : undefined}
              onClick={(event) => {
                const root = event.currentTarget.closest("details");
                if (root) root.removeAttribute("open");
              }}
            >
              <link.Icon size={16} weight="bold" aria-hidden />
              {link.label}
            </Link>
          );
        })}
      </div>
    </details>
  );
}
